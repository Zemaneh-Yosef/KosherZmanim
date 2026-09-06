import { GeoLocation } from '../GeoLocation.ts';
import { AstronomicalCalculator } from './AstronomicalCalculator.ts';
import { MathUtils } from '../../polyfills/Utils.ts';

enum SolarEvent {
	/**SUNRISE A solar event related to sunrise*/SUNRISE,
	/**SUNSET A solar event related to sunset*/SUNSET,
	/**NOON A solar event related to noon*/NOON,
	/**MIDNIGHT A solar event related to midnight*/MIDNIGHT,
}

/**
 * Implementation of sunrise and sunset methods to calculate astronomical times based on the <a
 * href="https://noaa.gov">NOAA</a> algorithm. This calculator uses the Java algorithm based on the implementation by <a
 * href="https://noaa.gov">NOAA - National Oceanic and Atmospheric Administration</a>'s <a href =
 * "https://www.srrb.noaa.gov/highlights/sunrise/sunrise.html">Surface Radiation Research Branch</a>. NOAA's <a
 * href="https://www.srrb.noaa.gov/highlights/sunrise/solareqns.PDF">implementation</a> is based on equations from <a
 * href="https://www.amazon.com/Astronomical-Table-Sun-Moon-Planets/dp/1942675038/">Astronomical Algorithms</a> by <a
 * href="https://en.wikipedia.org/wiki/Jean_Meeus">Jean Meeus</a>. Added to the algorithm is an adjustment of the zenith
 * to account for elevation. The algorithm can be found in the <a
 * href="https://en.wikipedia.org/wiki/Sunrise_equation">Wikipedia Sunrise Equation</a> article.
 * 
 * @author © Eliyahu Hershfeld 2011 - 2026
 */
export default class NOAACalculator extends AstronomicalCalculator {
	/**
	 * The <a href="https://en.wikipedia.org/wiki/Julian_day">Julian day</a> of January 1, 2000, known as
	 * <a href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
	 */
	private static readonly JULIAN_DAY_JAN_1_2000: number = 2451545.0;

	/**
	 * Julian days per century.
	 */
	private static readonly JULIAN_DAYS_PER_CENTURY: number = 36525.0;

	/**
	 * Default constructor of the NOAACalculator.
	 */
	public constructor() {
		super();
	}

	public getCalculatorName(): string {
		return "US National Oceanic and Atmospheric Administration Algorithm"; // Implementation of the Jean Meeus algorithm
	}

	public getUTCSunrise(dt: Temporal.PlainDate, geoLocation: GeoLocation, zenith: number, adjustForElevation: boolean): number {
		return this.getUTCSunRiseSet(dt, geoLocation, zenith, adjustForElevation, SolarEvent.SUNRISE);
	}

	public getUTCSunset(dt: Temporal.PlainDate, geoLocation: GeoLocation, zenith: number, adjustForElevation: boolean): number {
		return this.getUTCSunRiseSet(dt, geoLocation, zenith, adjustForElevation, SolarEvent.SUNSET);
	}

	/**
	 * A method that calculates UTC sunrise or sunset as well as any time based on an angle above or below sunset and
	 * returns it as a {@code double} in 24-hour format. 5:45:00 AM will return 5.75.
	 * 
	 * @param localDate Used to calculate day of year.
	 * @param geoLocation The location information used for astronomical calculation of solar times.
	 * @param zenith the azimuth below the vertical zenith of 90°. For sunset typically the {@link #adjustZenith zenith} used for
	 *         the calculation uses geometric zenith of 90° and {@link #adjustZenith adjusts} this slightly to account for solar
	 *         refraction and the sun's radius. Another example would be
	 *         {@link com.kosherjava.zmanim.AstronomicalCalendar#getEndNauticalTwilight()} that passes
	 *         {@link com.kosherjava.zmanim.AstronomicalCalendar#NAUTICAL_ZENITH} to this method.
	 * @param adjustForElevation Should the time be adjusted for elevation
	 * @param solarEvent if the calculation is for {@link SolarEvent#SUNRISE} or {@link SolarEvent#SUNSET}
	 * @return The UTC time of sunrise or sunset in 24-hour format. 5:45:00 AM will return 5.75, while 5:45 PM will return 17.75. If
	 *         an error was encountered in the calculation (expected behavior for some locations such as near the poles),
	 *         {@link Double#NaN} will be returned.
	 * @see #getElevationAdjustment(double)
	 */
	private getUTCSunRiseSet(localDate: Temporal.PlainDate, geoLocation: GeoLocation, zenith: number, adjustForElevation: boolean,
			solarEvent: SolarEvent): number {
		const elevation = adjustForElevation ? geoLocation.getElevation() : 0;
		const adjustedZenith = this.adjustZenith(zenith, elevation);
		let riseSet = NOAACalculator.getSunRiseSetUTC(localDate, geoLocation.getLatitude(), -geoLocation.getLongitude(),
			adjustedZenith, solarEvent);
		riseSet = riseSet / 60;
		return (riseSet % 24 + 24) % 24; // ensure that the time is >= 0 and < 24
	}

	/**
	 * Return the <a href="https://en.wikipedia.org/wiki/Julian_day">Julian day</a> from a Java {@code LocalDate}.
	 * 
	 * @param localDate The LocalDate
	 * @return the Julian day corresponding to the date Note: Number is returned for the start of the Julian day. Fractional days
	 *         / time should be added later.
	 */
	private static getJulianDay(localDate: Temporal.PlainDate): number {
		let year = localDate.year;
		let month = localDate.month;
		const day = localDate.day;

		if (month <= 2) {
			year -= 1;
			month += 12;
		}

		const a = Math.floor(year / 100);
		const b = 2 - a + Math.floor(a / 4);

		return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
	}

	/**
	 * Convert <a href="https://en.wikipedia.org/wiki/Julian_day">Julian day</a> to centuries since
	 * <a href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
	 * 
	 * @param julianDay the Julian Day to convert
	 * @return the centuries since 2000 Julian corresponding to the Julian Day
	 */
	private static getJulianCenturiesFromJulianDay(julianDay: number): number {
		return (julianDay - NOAACalculator.JULIAN_DAY_JAN_1_2000) / NOAACalculator.JULIAN_DAYS_PER_CENTURY;
	}

	/**
	 * Returns the Geometric <a href="https://en.wikipedia.org/wiki/Mean_longitude">Mean Longitude</a> of the Sun.
	 * 
	 * @param julianCenturies the number of Julian centuries since
	 *         <a href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
	 * @return the Geometric Mean Longitude of the Sun in degrees
	 */
	private static getSunGeometricMeanLongitude(julianCenturies: number): number {
		let longitude = 280.46646 + julianCenturies * (36000.76983 + 0.0003032 * julianCenturies);
		return (longitude % 360 + 360) % 360; // return a longitude is in the range of 0 - 360
	}

	/**
	 * Returns the Geometric <a href="https://en.wikipedia.org/wiki/Mean_anomaly">Mean Anomaly</a> of the Sun in degrees.
	 * 
	 * @param julianCenturies the number of Julian centuries since
	 *         <a href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
	 * @return the Geometric Mean Anomaly of the Sun in degrees
	 */
	private static getSunGeometricMeanAnomaly(julianCenturies: number): number {
		return 357.52911 + julianCenturies * (35999.05029 - 0.0001537 * julianCenturies);
	}

	/**
	 * Return the <a href="https://en.wikipedia.org/wiki/Eccentricity_%28orbit%29">eccentricity of earth's orbit</a>.
	 * 
	 * @param julianCenturies the number of Julian centuries since
	 *         <a href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
	 * @return the unitless eccentricity
	 */
	private static getEarthOrbitEccentricity(julianCenturies: number): number {
		return 0.016708634 - julianCenturies * (0.000042037 + 0.0000001267 * julianCenturies);
	}

	/**
	 * Returns the <a href="https://en.wikipedia.org/wiki/Equation_of_the_center">equation of center</a> for the sun.
	 * 
	 * @param julianCenturies the number of Julian centuries since
	 *         <a href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
	 * @return the equation of center for the sun in degrees
	 */
	private static getSunEquationOfCenter(julianCenturies: number): number {
		const m = NOAACalculator.getSunGeometricMeanAnomaly(julianCenturies);
		const mrad = MathUtils.degreesToRadians(m);
		const sinm = Math.sin(mrad);
		const sin2m = Math.sin(2 * mrad);
		const sin3m = Math.sin(3 * mrad);

		return sinm * (1.914602 - julianCenturies * (0.004817 + 0.000014 * julianCenturies)) + sin2m
			* (0.019993 - 0.000101 * julianCenturies) + sin3m * 0.000289;
	}

	/**
	 * Return the true longitude of the sun
	 * 
	 * @param julianCenturies the number of Julian centuries since
	 *         <a href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
	 * @return the sun's true longitude in degrees
	 */
	private static getSunTrueLongitude(julianCenturies: number): number {
		const sunLongitude = NOAACalculator.getSunGeometricMeanLongitude(julianCenturies);
		const center = NOAACalculator.getSunEquationOfCenter(julianCenturies);
		return sunLongitude + center;
	}

	/**
	 * Return the apparent longitude of the sun
	 * 
	 * @param julianCenturies the number of Julian centuries since
	 *         <a href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
	 * @return sun's apparent longitude in degrees
	 */
	private static getSunApparentLongitude(julianCenturies: number): number {
		const sunTrueLongitude = NOAACalculator.getSunTrueLongitude(julianCenturies);
		const omega = 125.04 - 1934.136 * julianCenturies;
		const lambda = sunTrueLongitude - 0.00569 - 0.00478 * Math.sin(MathUtils.degreesToRadians(omega));
		return lambda;
	}

	/**
	 * Returns the mean <a href="https://en.wikipedia.org/wiki/Axial_tilt">obliquity of the ecliptic</a> (Axial tilt).
	 * 
	 * @param julianCenturies the number of Julian centuries since
	 *         <a href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
	 * @return the mean obliquity in degrees
	 */
	private static getMeanObliquityOfEcliptic(julianCenturies: number): number {
		const seconds = 21.448 - julianCenturies * (46.815 + julianCenturies * (0.00059 - julianCenturies * (0.001813)));
		return 23 + (26 + (seconds / 60) / 60);
	}

	/**
	 * Returns the corrected obliquity of the ecliptic.
	 * 
	 * @param julianCenturies the number of Julian centuries since
	 *         <a href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
	 * @return the corrected obliquity in degrees
	 */
	private static getObliquityCorrection(julianCenturies: number): number {
		const obliquityOfEcliptic = NOAACalculator.getMeanObliquityOfEcliptic(julianCenturies);
		const omega = 125.04 - 1934.136 * julianCenturies;
		return obliquityOfEcliptic + 0.00256 * Math.cos(MathUtils.degreesToRadians(omega));
	}

	/**
	 * Return the apparent sun longitude.
	 * 
	 * @param julianCenturies the number of Julian centuries since
	 *         <a href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
	 * @return sun's apparent longitude in degrees
	 */
	private static getGeometricMeanSolarTime(julianCenturies: number): number {
		const julianDay = julianCenturies * NOAACalculator.JULIAN_DAYS_PER_CENTURY + NOAACalculator.JULIAN_DAY_JAN_1_2000;
		return (280.46646 + 36000.76983 * julianCenturies + 0.0003032 * julianCenturies * julianCenturies) % 360;
	}

	/**
	 * Return the equation of time in minutes.
	 * 
	 * @param julianCenturies the number of Julian centuries since
	 *         <a href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
	 * @return the equation of time in minutes
	 */
	private static getEquationOfTime(julianCenturies: number): number {
		const epsilon = NOAACalculator.getObliquityCorrection(julianCenturies);
		const geomMeanLongSun = NOAACalculator.getSunGeometricMeanLongitude(julianCenturies);
		const eccentricityEarthOrbit = NOAACalculator.getEarthOrbitEccentricity(julianCenturies);
		const geomMeanAnomalySun = NOAACalculator.getSunGeometricMeanAnomaly(julianCenturies);

		let y = Math.tan(MathUtils.degreesToRadians(epsilon / 2));
		y = y * y;

		const sin2l0 = Math.sin(2 * MathUtils.degreesToRadians(geomMeanLongSun));
		const sinm = Math.sin(MathUtils.degreesToRadians(geomMeanAnomalySun));
		const cos2l0 = Math.cos(2 * MathUtils.degreesToRadians(geomMeanLongSun));
		const sin4l0 = Math.sin(4 * MathUtils.degreesToRadians(geomMeanLongSun));
		const sin2m = Math.sin(2 * MathUtils.degreesToRadians(geomMeanAnomalySun));

		const etime = y * sin2l0 - 2 * eccentricityEarthOrbit * sinm + 4 * eccentricityEarthOrbit * y * sinm * cos2l0
			- 0.5 * y * y * sin4l0 - 1.25 * eccentricityEarthOrbit * eccentricityEarthOrbit * sin2m;

		return MathUtils.radiansToDegrees(etime) * 4; // in minutes
	}

	/**
	 * Return the sun's declination in degrees.
	 * 
	 * @param julianCenturies the number of Julian centuries since
	 *         <a href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
	 * @return the sun's declination in degrees
	 */
	private static getSunDeclination(julianCenturies: number): number {
		const obliquityCorrection = NOAACalculator.getObliquityCorrection(julianCenturies);
		const lambda = NOAACalculator.getSunApparentLongitude(julianCenturies);

		const sint = Math.sin(MathUtils.degreesToRadians(obliquityCorrection)) * Math.sin(MathUtils.degreesToRadians(lambda));
		const theta = MathUtils.radiansToDegrees(Math.asin(sint));
		return theta;
	}

	/**
	 * Return the Sunrise/Sunset hour angle.
	 * 
	 * @param latitude the location latitude
	 * @param solarDeclination the sun's declination
	 * @param zenith the zenith angle
	 * @param solarEvent whether it's sunrise or sunset
	 * @return the hour angle in radians
	 */
	private static getSunHourAngle(latitude: number, solarDeclination: number, zenith: number, solarEvent: SolarEvent): number {
		const latRad = MathUtils.degreesToRadians(latitude);
		const sdRad = MathUtils.degreesToRadians(solarDeclination);
		const zenithRad = MathUtils.degreesToRadians(zenith);

		let hourAngle = Math.acos(Math.cos(zenithRad) / (Math.cos(latRad) * Math.cos(sdRad))
			- Math.tan(latRad) * Math.tan(sdRad));

		if (solarEvent === SolarEvent.SUNSET) {
			hourAngle = -hourAngle;
		}
		return hourAngle;
	}

	/**
	 * Get solar elevation and azimuth angles.
	 * @param dateTime the ZonedDateTime for which to calculate the solar position
	 * @param geoLocation the GeoLocation to calculate the solar position for
	 * @param isAzimuth true for azimuth, false for elevation
	 * @return the solar elevation (positive = above horizon) or azimuth (0° = north, 90° = east, 180° = south, 270° = west) in degrees
	 */
	public getSolarElevation(dateTime: Temporal.ZonedDateTime, geoLocation: GeoLocation): number {
		return this.getSolarElevationAzimuth(dateTime, geoLocation, false);
	}

	/**
	 * Get solar azimuth angle.
	 * @param dateTime the ZonedDateTime for which to calculate the solar position
	 * @param geoLocation the GeoLocation to calculate the solar position for
	 * @return the solar azimuth (0° = north, 90° = east, 180° = south, 270° = west) in degrees
	 */
	public getSolarAzimuth(dateTime: Temporal.ZonedDateTime, geoLocation: GeoLocation): number {
		return this.getSolarElevationAzimuth(dateTime, geoLocation, true);
	}

	/**
	 * Calculate solar elevation or azimuth.
	 * @param zdt the ZonedDateTime
	 * @param geoLocation the location
	 * @param isAzimuth true for azimuth, false for elevation
	 * @return the solar elevation (in degrees, positive = above horizon) or azimuth (0° = north, 90° = east, 180° = south, 270° = west)
	 */
	private getSolarElevationAzimuth(zdt: Temporal.ZonedDateTime, geoLocation: GeoLocation, isAzimuth: boolean): number {
		const latitude = geoLocation.getLatitude();
		const longitude = geoLocation.getLongitude();

		// offsetNanoseconds is what Temporal gives us directly — no need for TimeZone.getOffset
		const offsetHours = zdt.offsetNanoseconds / 3_600_000_000_000;

		// Replicate Java: subtract offset to get UTC-equivalent hour
		const utcHour = zdt.hour - offsetHours;
		const minute = zdt.minute;
		const second = zdt.second;
		const milli = zdt.millisecond;

		const time = (utcHour + (minute + (second + milli / 1000) / 60) / 60) / 24;

		// Julian day with fractional time
		const julianDay = NOAACalculator.getJulianDay(zdt.toPlainDate()) + time;

		const julianCenturies = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);

		const eot = NOAACalculator.getEquationOfTime(julianCenturies);
		const theta = NOAACalculator.getSunDeclination(julianCenturies);

		const adjustment = time + eot / 1440;

		// True solar time (always positive)
		const trueSolarTime = ((adjustment + longitude / 360) + 2) % 1;

		const hourAngleRad = trueSolarTime * Math.PI * 2 - Math.PI;

		const cosZenith =
			Math.sin(MathUtils.degreesToRadians(latitude)) *
			Math.sin(MathUtils.degreesToRadians(theta)) +
			Math.cos(MathUtils.degreesToRadians(latitude)) *
			Math.cos(MathUtils.degreesToRadians(theta)) *
			Math.cos(hourAngleRad);

		const zenith = MathUtils.radiansToDegrees(Math.acos(
			cosZenith > 1 ? 1 : cosZenith < -1 ? -1 : cosZenith
		));

		const azDenom = Math.cos(MathUtils.degreesToRadians(latitude)) * Math.sin(MathUtils.degreesToRadians(zenith));

		// Elevation (no refraction correction, matching Java)
		const elevation = 90 - zenith;

		// --- Azimuth ---
		let azimuth = 0;

		const azRad =
			(Math.sin(MathUtils.degreesToRadians(latitude)) *
				Math.cos(MathUtils.degreesToRadians(zenith)) -
				Math.sin(MathUtils.degreesToRadians(theta))) /
			azDenom;

		if (Math.abs(azDenom) > 0.001) {
			azimuth =
				180 -
				MathUtils.radiansToDegrees(
					Math.acos(
						azRad > 1 ? 1 : azRad < -1 ? -1 : azRad
					)
				) *
				(hourAngleRad > 0 ? -1 : 1);
		} else {
			azimuth = latitude > 0 ? 180 : 0;
		}

		return isAzimuth ? (azimuth + 360) % 360 : elevation;
	}

	/**
	 * Apply refraction adjustment to solar elevation.
	 * @param elevation the elevation to adjust.
	 * @return the adjusted elevation.
	 */
	private adjustElevationForRefraction(elevation: number): number {
		if (elevation > 85.0) {
			return 0.0;
		}

		const te = AstronomicalCalculator.tanDegrees(elevation);
		let correction: number;

		if (elevation > 5.0) {
			correction = 58.1 / te - 0.07 / Math.pow(te, 3) + 0.000086 / Math.pow(te, 5);
		} else if (elevation > -0.575) {
			correction = 1735.0 + elevation * (-518.2 + elevation * (103.4 + elevation * (-12.79 + 0.711 * elevation)));
		} else {
			correction = -20.774 / te;
		}
		return correction / 3600.0;
	}

	public getUTCNoon(localDate: Temporal.PlainDate, geoLocation: GeoLocation): number {
		let noon = NOAACalculator.getSolarNoonMidnightUTC(NOAACalculator.getJulianDay(localDate), -geoLocation.getLongitude(), SolarEvent.NOON);
		noon = noon / 60;
		return (noon % 24 + 24) % 24; // ensure that the time is >= 0 and < 24
	}

	/**
	 * Return the <a href="https://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
	 * of the <a href="https://en.wikipedia.org/wiki/Midnight">solar midnight</a> for the end of the given civil
	 * day at the given location on earth (about 12 hours after solar noon). This implementation returns true solar
	 * midnight as opposed to the time halfway between sunrise and sunset. Other calculators may return a more
	 * simplified calculation of halfway between sunrise and sunset. See <a href=
	 * "https://kosherjava.com/2020/07/02/definition-of-chatzos/">The Definition of <em>Chatzos</em></a> for details on
	 * solar noon / midnight calculations.
	 * 
	 * @param localDate The date to calculate solar midnight for
	 * @param geoLocation The location information used for astronomical calculating sun times. This class uses only requires
	 *            the longitude for calculating midnight since it is the same time anywhere along the longitude line.
	 * @return the time in minutes from zero UTC
	 */
	public getUTCMidnight(localDate: Temporal.PlainDate, geoLocation: GeoLocation): number {
		let midnight = NOAACalculator.getSolarNoonMidnightUTC(NOAACalculator.getJulianDay(localDate), -geoLocation.getLongitude(), SolarEvent.MIDNIGHT);
		midnight = midnight / 60;
		return (midnight % 24 + 24) % 24; // ensure that the time is >= 0 and < 24
	}

	/**
	 * Return the <a href="https://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC) of the
	 * current day <a href="http://en.wikipedia.org/wiki/Noon#Solar_noon">solar noon</a> or the upcoming midnight (about 12 hours
	 * after solar noon) of the given day at the given location on earth.
	 * 
	 * @param julianDay The Julian day since <a href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
	 * @param longitude The longitude of observer in degrees
	 * @param solarEvent If the calculation is for {@link SolarEvent#NOON NOON} or {@link SolarEvent#MIDNIGHT MIDNIGHT}
	 * @return The UTC time of solar noon/midnight in 24-hour format. 12:45:00 AM will return 0.75 while 1:45:00 PM will return 13.75. If an error
	 *         was encountered in the calculation (expected behavior for some locations such as near the poles), {@link Double#NaN}
	 *         will be returned.
	 * @see #getUTCNoon(Temporal.PlainDate, GeoLocation)
	 * @see #getUTCMidnight(Temporal.PlainDate, GeoLocation)
	 */
	private static getSolarNoonMidnightUTC(julianDay: number, longitude: number, solarEvent: SolarEvent): number {
		// no day-half shift: the loop epoch julianDay + solNoonUTC/1440 already lands on the event
		// First pass for approximate solar noon to calculate equation of time
		let tnoon = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay + longitude / 360.0);
		let equationOfTime = NOAACalculator.getEquationOfTime(tnoon);
		let solNoonUTC = (longitude * 4) - equationOfTime; // minutes

		// Refine the equation of time at the calculated transit time.
		for (let i = 0; i < 2; i++) {
			const newt = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay + solNoonUTC / 1440.0);
			equationOfTime = NOAACalculator.getEquationOfTime(newt);
			solNoonUTC = (solarEvent === SolarEvent.NOON ? 720 : 1440) + (longitude * 4) - equationOfTime;
		}
		return solNoonUTC;
	}

	/**
	 * Return the <a href="https://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
	 * of sunrise or sunset in minutes for the given day at the given location on earth.
	 * @todo Possibly increase the number of passes for improved accuracy, especially in the Arctic areas.
	 * 
	 * @param localDate The {@code LocalDate}.
	 * @param latitude The latitude of observer in degrees
	 * @param longitude Longitude of observer in degrees
	 * @param zenith Zenith
	 * @param solarEvent If the calculation is for {@link SolarEvent#SUNRISE SUNRISE} or {@link SolarEvent#SUNSET SUNSET}
	 * @return The UTC time of sunrise or sunset in 24-hour format. 5:45:00 AM will return 5.75, while 5:45 PM will return 17.75. If
	 *         an error was encountered in the calculation (expected behavior for some locations such as near the poles),
	 *         {@link Double#NaN} will be returned.
	 */
	private static getSunRiseSetUTC(localDate: Temporal.PlainDate, latitude: number, longitude: number, zenith: number,
			solarEvent: SolarEvent): number {
		const julianDay = NOAACalculator.getJulianDay(localDate);

		// Find the time of solar noon at the location, and use that declination.
		// This is better than start of the Julian day
		// TODO really not needed since the Julian day starts from local fixed noon. Changing this would be more
		// efficient but would likely cause a very minor discrepancy in the calculated times (likely not reducing
		// accuracy, just slightly different, thus potentially breaking test cases). Regardless, it would be within
		// milliseconds.
		const noonmin = NOAACalculator.getSolarNoonMidnightUTC(julianDay, longitude, SolarEvent.NOON);
		const tnoon = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay + noonmin / 1440.0);
		// First calculates sunrise and approximate length of day
		let equationOfTime = NOAACalculator.getEquationOfTime(tnoon);
		let solarDeclination = NOAACalculator.getSunDeclination(tnoon);
		let hourAngle = NOAACalculator.getSunHourAngle(latitude, solarDeclination, zenith, solarEvent);
		let delta = longitude - MathUtils.radiansToDegrees(hourAngle);
		let timeDiff = 4 * delta;
		let timeUTC = 720 + timeDiff - equationOfTime;
		// Second pass includes fractional Julian Day in gamma calc
		const newt = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay + timeUTC / 1440.0);
		equationOfTime = NOAACalculator.getEquationOfTime(newt);
		solarDeclination = NOAACalculator.getSunDeclination(newt);
		hourAngle = NOAACalculator.getSunHourAngle(latitude, solarDeclination, zenith, solarEvent);
		delta = longitude - MathUtils.radiansToDegrees(hourAngle);
		timeDiff = 4 * delta;
		timeUTC = 720 + timeDiff - equationOfTime;
		return timeUTC;
	}

	/**
	 * {@inheritDoc}
	 * The current implementation in this class only supports azimuth values of 90° (directly east) or 270° (directly west) that are
	 * directly needed in this library for the polar Ben Ish Chai calculations.
	 * @throws IllegalArgumentException if the azimuth is not 90° or 270°.
	 * @todo complete the implementation for other azimuths. While not needed by this library, they may be of value to some projects.
	 *         There will be edge cases where the azimuth will occur more than once a day when based on the equation of time, the day
	 *         is shorter than 24 hours. In that case, the time for the first one will be returned.
	 */
	public getTimeAtAzimuth(localDate: Temporal.PlainDate, geoLocation: GeoLocation, targetAzimuth: number): number {
		if (targetAzimuth !== 90.0 && targetAzimuth !== 270.0) {
			throw new Error("The targetAzimuth must be 90 or 270. Other azimuth values are not supported");
		}

		const julianDay = NOAACalculator.getJulianDay(localDate);
		const solarNoonBase = 0.5 - (geoLocation.getLongitude() / 360.0);
		let dateTime = solarNoonBase + ((targetAzimuth === 90.0) ? 0.25 : 0.75);

		for (let i = 0; i < 3; i++) {
			const julianCenturies = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay + dateTime);
			const ratio = AstronomicalCalculator.tanDegrees(NOAACalculator.getSunDeclination(julianCenturies)) / AstronomicalCalculator.tanDegrees(geoLocation.getLatitude());

			if (Number.isNaN(ratio) || ratio > 1.0 || ratio < -1.0) { // Handle Tropics, the Poles, and Equator line divisions
				return Number.NaN;
			}

			const offset = ((targetAzimuth === 90.0) ? -1.0 : 1.0) * (AstronomicalCalculator.acosDegrees(ratio) / 360.0);
			dateTime = solarNoonBase + offset - (NOAACalculator.getEquationOfTime(julianCenturies) / 1440.0);
		}

		return (dateTime * 24) % 24 + (dateTime * 24 < 0 ? 24 : 0);
	}
}