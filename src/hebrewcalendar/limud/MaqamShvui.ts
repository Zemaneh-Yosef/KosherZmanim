import { Calendar } from "../../polyfills/Utils";
import { Parsha, JewishCalendar } from "../JewishCalendar";

/**
 * This class's main goal is to return the Weekly Haftorah reading said after the Weekly Parasha
 * reading. Which readings to say were taken from the Chumash "L'maan Shemo B'Ahavah" according to
 * the Sepharadic Minhag.
 * @see WeeklyParashaReadings
 */

type Unpacked<T> = T extends (infer U)[] ? U : T;

const allSefarim = [
	"ADES: 24793" as const,
	"GABRIEL A SHREM 1964 SUHV" as const, // AKA ARTSCROLL
	"TABBUSH Ms NLI 8*7622, Aleppo" as const,
	"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905" as const,
	"TEBELE Pre1888" as const,
	"ELIE SHAUL COHEN FROM AINTAB, ~1880" as const,
	"YAAQOB ABADI-PARSIYA" as const,
	"YISHAQ YEQAR ARGENTINA" as const,
	"Dibre Shelomo S KASSIN Pre1915" as const,
	"Knis Betesh Geniza List, Aleppo" as const,
	"ABRAHAM DWECK Pre1920" as const,
	"IDELSOHN Pre1923" as const,
	"S SAGIR Laniado" as const,
	"M H Elias, SHIR HADASH, Jerusalem, 1930" as const,
	"ASHEAR list" as const,
	"ASHEAR NOTES 1936-1940" as const,
	"ABRAHAM E SHREM ~1945" as const,
	"Argentina 1947 & Ezra Mishanieh" as const,
	"Shire Zimra H S ABOUD Jerusalem, 1950" as const,
	"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO" as const,
	"YOSEF YEHEZKEL Jerusalem 1975" as const,
	"Ish Massliah \"Abia Renanot\" Tunisians" as const,
	"Shaare Zimra YANANI Buenos Aires, 01" as const,
	"BOZO, Ades, Shir Ushbaha 2005" as const,
	"Yishaq Yeranen Halabi" as const,
	"MOSHE AMASH (Shami)" as const,
	"EZRA MASLATON TARAB (Shami)" as const,
	"ABRAHAM SHAMRICHA (Shami)" as const,
]
const entries = [
	...allSefarim,
	"Victor Afya, Istanbul List" as const,
	"Izak Alaluf, Izmir List" as const,
	"Hallel VeZimrah, Salonika, 1928" as const,
	"Hallel VeZimrah, Greece List, 1926" as const,
	"SASSOON #647 Aleppo, 1850" as const,
	"Eliahou Yaaqob DWECK-KESAR" as const
]

enum Makam {
	HOSENI,
	HIJAZ,
	HIJAZ_KAR,
	BAYAT,
	SABA,
	SIGAH,
	AJAM,
	RAST,
	SASGAR,
	IRAQ,
	MAHOUR,
	NAHWAND,
	NAWAH,
	MEHAYAR,
	BUSTANIGAR,
	ASHIRAN,
	GIRKA,
	OJ,
	RAHAWI,
	ARAZBAR,
	SHURI,
	KURD,
	ZANGIRAN,
	MOUHAYAR,

	// TURKISH
	HUSEYNI,
	ACEM_ASHIRAN,
	SEGAH,
	HICAZ,
	NAHOFT,
	DUGAH,
	MAHUR,
	NIHAVEND,
	ARABAN,
	BEYATI,
	USSAK,
	ISFAHAN,
	CARGAH,
	SEHNAZ,
	SEBAH,

	// GREEK
	FARAHNAQ,
	HUZAM,
	QARGIGAR,
	BUSALIQ,
	MUHAYER,
	SUZNIQ,
	BAYATI
}
type getMaqamReturnType = Partial<Record<Unpacked<typeof entries>, (Makam|string)[]>>

const makamHeaders:Record<"bereshit"|"shemot"|"vayikra"|"bamidbar"|"devarim", typeof entries> = {
	bereshit: [
		...allSefarim,
		"Victor Afya, Istanbul List" as const,
		"Izak Alaluf, Izmir List" as const,
		"Hallel VeZimrah, Salonika, 1928" as const
	],
	shemot: [
		...allSefarim,
		"Victor Afya, Istanbul List" as const,
		"Izak Alaluf, Izmir List" as const,
		"Hallel VeZimrah, Greece List, 1926" as const
	],
	vayikra: [],
	bamidbar: [
		...allSefarim,
		"Hallel VeZimrah, Greece List, 1926" as const
	],
	devarim: []
}

makamHeaders.vayikra = makamHeaders.shemot;
makamHeaders.devarim = makamHeaders.bamidbar;

export default class WeeklyMakamReading {
	hierarchy: (Unpacked<typeof entries> | "MAJORITY")[];

	constructor(hierarchy:(Unpacked<typeof entries> | "MAJORITY")[]=entries) {
		this.hierarchy = hierarchy;
	}

	getTodayMakam(jCal: JewishCalendar) {
		const data = WeeklyMakamReading.getMakamData(jCal);
		for (const entry of this.hierarchy) {
			if (entry == "MAJORITY")
				return {title: entry, makam: findDuplicate(Object.values(data).flat())};

			if (entry in data) {
				return {title: entry, makam: data[entry] };
			}
		}
	}
	/**
	 * This method returns a string that contains the weekly Makam. The {@link JewishCalendar}
	 * object passed into this method should be preset with the correct date.
	 * @param jCal the JewishCalendar object set to Saturday
	 * @return All the data fields
	 */
	public static getMakamData(jCal: JewishCalendar): getMaqamReturnType {
		if (jCal.isYomTov()) {
			switch (jCal.getYomTovIndex()) {
				case JewishCalendar.ROSH_HASHANA:
					if (jCal.getJewishDayOfMonth() == 1)
						return {
							"Eliahou Yaaqob DWECK-KESAR": [Makam.HOSENI],
							"YISHAQ YEQAR ARGENTINA": [Makam.HIJAZ],
							"IDELSOHN Pre1923": [Makam.SABA],
						}
					else
						return {
							"Eliahou Yaaqob DWECK-KESAR": [Makam.HOSENI],
							"YISHAQ YEQAR ARGENTINA": [Makam.HIJAZ],
							"IDELSOHN Pre1923": [Makam.BAYAT]
						}
					break;
				case JewishCalendar.YOM_KIPPUR:
					return {
						"Eliahou Yaaqob DWECK-KESAR": [Makam.HIJAZ, Makam.HOSENI],
						"YISHAQ YEQAR ARGENTINA": [Makam.HIJAZ],
						"IDELSOHN Pre1923": [Makam.HIJAZ]
					};
					break;
				case JewishCalendar.SUCCOS:
					if (jCal.getJewishDayOfMonth() == 15)
						return {
							"SASSOON #647 Aleppo, 1850": [Makam.SIGAH],
							"Eliahou Yaaqob DWECK-KESAR": [Makam.SIGAH],
							"YAAQOB ABADI-PARSIYA": [Makam.SIGAH],
							"YISHAQ YEQAR ARGENTINA": [Makam.SIGAH],
							"ABRAHAM DWECK Pre1920": [Makam.SIGAH],
							"IDELSOHN Pre1923": [Makam.SIGAH],
							"S SAGIR Laniado": [Makam.SIGAH],
							"ASHEAR list": [Makam.SIGAH],
							"ASHEAR NOTES 1936-1940": [Makam.SIGAH],
							"ABRAHAM E SHREM ~1945": [Makam.SIGAH],
							"Argentina 1947 & Ezra Mishanieh": [Makam.SIGAH],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.SIGAH],
							"GABRIEL A SHREM 1964 SUHV": [Makam.SIGAH],
							"YOSEF YEHEZKEL Jerusalem 1975": [Makam.AJAM],
							"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.SIGAH],
							"Shaare Zimra YANANI Buenos Aires, 01": [Makam.SIGAH],
							"BOZO, Ades, Shir Ushbaha 2005": [Makam.SIGAH],
							"MOSHE AMASH (Shami)": [Makam.RAST],
							"EZRA MASLATON TARAB (Shami)": [Makam.RAST],
							"ABRAHAM SHAMRICHA (Shami)": [Makam.RAST],
							"Hallel VeZimrah, Greece List, 1926": [Makam.SIGAH]
						}
					else
						return {
							"SASSOON #647 Aleppo, 1850": [Makam.SASGAR],
							"Eliahou Yaaqob DWECK-KESAR": [Makam.AJAM],
							"YAAQOB ABADI-PARSIYA": [Makam.SASGAR],
							"YISHAQ YEQAR ARGENTINA": [Makam.AJAM],
							"ABRAHAM DWECK Pre1920": [Makam.SASGAR],
							"S SAGIR Laniado": [Makam.AJAM],
							"ASHEAR list": [Makam.AJAM],
							"ASHEAR NOTES 1936-1940": [Makam.AJAM],
							"ABRAHAM E SHREM ~1945": [Makam.AJAM],
							"Argentina 1947 & Ezra Mishanieh": [Makam.AJAM],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.AJAM],
							"GABRIEL A SHREM 1964 SUHV": [Makam.AJAM],
							"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.AJAM],
							"Shaare Zimra YANANI Buenos Aires, 01": [Makam.AJAM],
							"BOZO, Ades, Shir Ushbaha 2005": [Makam.AJAM],
							"MOSHE AMASH (Shami)": [Makam.SIGAH],
							"EZRA MASLATON TARAB (Shami)": [Makam.SIGAH],
							"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
							"Hallel VeZimrah, Greece List, 1926": [Makam.RAST]
						}
					break;
				case JewishCalendar.CHOL_HAMOED_SUCCOS:
					const sukkotHHreturnData = {
						16: {
							"SASSOON #647 Aleppo, 1850": [Makam.SASGAR],
							"Eliahou Yaaqob DWECK-KESAR": [Makam.AJAM],
							"YAAQOB ABADI-PARSIYA": [Makam.SASGAR],
							"YISHAQ YEQAR ARGENTINA": [Makam.AJAM],
							"ABRAHAM DWECK Pre1920": [Makam.SASGAR],
							"S SAGIR Laniado": [Makam.AJAM],
							"ASHEAR list": [Makam.AJAM],
							"ASHEAR NOTES 1936-1940": [Makam.AJAM],
							"ABRAHAM E SHREM ~1945": [Makam.AJAM],
							"Argentina 1947 & Ezra Mishanieh": [Makam.AJAM],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.AJAM],
							"GABRIEL A SHREM 1964 SUHV": [Makam.AJAM],
							"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.AJAM],
							"Shaare Zimra YANANI Buenos Aires, 01": [Makam.AJAM],
							"BOZO, Ades, Shir Ushbaha 2005": [Makam.AJAM],
							"MOSHE AMASH (Shami)": [Makam.SIGAH],
							"EZRA MASLATON TARAB (Shami)": [Makam.SIGAH],
							"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
							"Hallel VeZimrah, Greece List, 1926": [Makam.RAST]
						}, // Day 2 of Diaspora, but 1st day Hol Hamoed Israel
						17: {
							"SASSOON #647 Aleppo, 1850": [Makam.IRAQ],
							"Eliahou Yaaqob DWECK-KESAR": [Makam.SABA],
							"YAAQOB ABADI-PARSIYA": [Makam.IRAQ],
							"YISHAQ YEQAR ARGENTINA": [Makam.SABA],
							"ASHEAR list": [Makam.IRAQ],
							"ASHEAR NOTES 1936-1940": [Makam.IRAQ],
							"Argentina 1947 & Ezra Mishanieh": [Makam.IRAQ],
							"GABRIEL A SHREM 1964 SUHV": [Makam.IRAQ]
						},
						18: {
							"SASSOON #647 Aleppo, 1850": [Makam.SABA],
							"Eliahou Yaaqob DWECK-KESAR": [Makam.BAYAT],
							"YAAQOB ABADI-PARSIYA": [Makam.SABA],
							"YISHAQ YEQAR ARGENTINA": [Makam.RAST],
							"ASHEAR list": [Makam.RAST],
							"ASHEAR NOTES 1936-1940": [Makam.RAST],
							"Argentina 1947 & Ezra Mishanieh": [Makam.RAST],
							"GABRIEL A SHREM 1964 SUHV": [Makam.RAST]
						},
						19: {
							"SASSOON #647 Aleppo, 1850": [Makam.RAST],
							"Eliahou Yaaqob DWECK-KESAR": [Makam.RAST],
							"YAAQOB ABADI-PARSIYA": [Makam.RAST],
							"YISHAQ YEQAR ARGENTINA": [Makam.BAYAT],
							"ASHEAR list": [Makam.NAWAH],
							"ASHEAR NOTES 1936-1940": [Makam.NAWAH],
							"Argentina 1947 & Ezra Mishanieh": [Makam.NAHWAND],
							"GABRIEL A SHREM 1964 SUHV": [Makam.NAHWAND]
						},
						20: {
							"SASSOON #647 Aleppo, 1850": [Makam.HOSENI],
							"Eliahou Yaaqob DWECK-KESAR": [Makam.NAWAH],
							"YAAQOB ABADI-PARSIYA": [Makam.HOSENI],
							"YISHAQ YEQAR ARGENTINA": [Makam.HOSENI],
							"ASHEAR list": [Makam.BAYAT],
							"ASHEAR NOTES 1936-1940": [Makam.BAYAT],
							"Argentina 1947 & Ezra Mishanieh": [Makam.BAYAT],
							"GABRIEL A SHREM 1964 SUHV": [Makam.HOSENI]
						}
					}[jCal.getJewishDayOfMonth()]!;

					if (jCal.getDayOfWeek() == Calendar.SATURDAY)
						Object.assign(sukkotHHreturnData,{
							"Eliahou Yaaqob DWECK-KESAR": [Makam.ASHIRAN],
							"ASHEAR NOTES 1936-1940": [Makam.MAHOUR],
							"ABRAHAM E SHREM ~1945": [Makam.BAYAT],
							"GABRIEL A SHREM 1964 SUHV": [Makam.BAYAT],
							"BOZO, Ades, Shir Ushbaha 2005": [Makam.BAYAT],
							"MOSHE AMASH (Shami)": [Makam.SABA],
							"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
							"Hallel VeZimrah, Greece List, 1926": ["Bustanigar"]
						});

					return sukkotHHreturnData;
					break;
				case JewishCalendar.HOSHANA_RABBA:
					return {
						"Eliahou Yaaqob DWECK-KESAR": [Makam.HOSENI],
						"YAAQOB ABADI-PARSIYA": [Makam.SABA],
						"YISHAQ YEQAR ARGENTINA": [Makam.ASHIRAN],
						"ASHEAR list": [Makam.MEHAYAR],
						"ASHEAR NOTES 1936-1940": [Makam.MEHAYAR],
						"Argentina 1947 & Ezra Mishanieh": [Makam.MEHAYAR]
					}
				case JewishCalendar.SHEMINI_ATZERES:
					if (!jCal.getInIsrael()) {
						return {
							"SASSOON #647 Aleppo, 1850": [Makam.AJAM],
							"Eliahou Yaaqob DWECK-KESAR": [Makam.ASHIRAN],
							"YAAQOB ABADI-PARSIYA": [Makam.BAYAT],
							"ABRAHAM DWECK Pre1920": [Makam.BAYAT],
							"ASHEAR list": [Makam.AJAM],
							"ASHEAR NOTES 1936-1940": [Makam.AJAM],
							"ABRAHAM E SHREM ~1945": [Makam.SABA],
							"Argentina 1947 & Ezra Mishanieh": [Makam.AJAM],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.HOSENI],
							"GABRIEL A SHREM 1964 SUHV": [Makam.SABA, Makam.SIGAH],
							"YOSEF YEHEZKEL Jerusalem 1975": [Makam.RAST],
							"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.AJAM],
							"Shaare Zimra YANANI Buenos Aires, 01": [Makam.SABA],
							"BOZO, Ades, Shir Ushbaha 2005": [Makam.SABA, Makam.SIGAH, Makam.HOSENI],
							"MOSHE AMASH (Shami)": [Makam.RAST],
							"EZRA MASLATON TARAB (Shami)": [Makam.RAST],
							"ABRAHAM SHAMRICHA (Shami)": [Makam.RAST],
							"Hallel VeZimrah, Greece List, 1926": [Makam.HIJAZ_KAR]
						}
					} else {
						// This data is taken from the Parasha Page on VeZot Haberacha
						return {
							"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.AJAM],
							"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.AJAM],
							"TEBELE Pre1888": [Makam.AJAM],
							"YAAQOB ABADI-PARSIYA": [Makam.AJAM],
							"YISHAQ YEQAR ARGENTINA": [Makam.AJAM],
							"ADES: 24793": [Makam.AJAM],
							"Dibre Shelomo S KASSIN Pre1915": [Makam.AJAM],
							"ABRAHAM DWECK Pre1920": [Makam.AJAM],
							"IDELSOHN Pre1923": [Makam.AJAM],
							"S SAGIR Laniado": [Makam.AJAM],
							"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.AJAM],
							"ASHEAR list": [Makam.AJAM],
							"ABRAHAM E SHREM ~1945": [Makam.AJAM],
							"Argentina 1947 & Ezra Mishanieh": [Makam.AJAM],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.AJAM],
							"GABRIEL A SHREM 1964 SUHV": [Makam.AJAM],
							"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.AJAM],
							"YOSEF YEHEZKEL Jerusalem 1975": [Makam.AJAM],
							"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.AJAM],
							"Shaare Zimra YANANI Buenos Aires, 01": [Makam.AJAM],
							"BOZO, Ades, Shir Ushbaha 2005": [Makam.AJAM],
							"Yishaq Yeranen Halabi": [Makam.AJAM],
							"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT]
						}
					}
					break;
				case JewishCalendar.SIMCHAS_TORAH:
					// This data is taken from the Yom Tov Page
					return {
						"SASSOON #647 Aleppo, 1850": [Makam.BAYAT],
						"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.AJAM],
						"Eliahou Yaaqob DWECK-KESAR": [Makam.AJAM],
						"YAAQOB ABADI-PARSIYA": [Makam.AJAM],
						"YISHAQ YEQAR ARGENTINA": [Makam.AJAM],
						"ADES: 24793": [Makam.AJAM],
						"Dibre Shelomo S KASSIN Pre1915": [Makam.AJAM],
						"ABRAHAM DWECK Pre1920": [Makam.AJAM],
						"IDELSOHN Pre1923": [Makam.AJAM],
						"S SAGIR Laniado": [Makam.AJAM],
						"ASHEAR list": [Makam.SABA],
						"ASHEAR NOTES 1936-1940": [Makam.SABA],
						"ABRAHAM E SHREM ~1945": [Makam.AJAM],
						"Argentina 1947 & Ezra Mishanieh": [Makam.SABA],
						"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.AJAM],
						"GABRIEL A SHREM 1964 SUHV": [Makam.AJAM],
						"YOSEF YEHEZKEL Jerusalem 1975": [Makam.GIRKA],
						"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.SIGAH],
						"Shaare Zimra YANANI Buenos Aires, 01": [Makam.AJAM],
						"BOZO, Ades, Shir Ushbaha 2005": [Makam.AJAM],
						"Yishaq Yeranen Halabi": [Makam.AJAM],
						"MOSHE AMASH (Shami)": [Makam.BAYAT],
						"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
						"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT]
					}
				case JewishCalendar.PURIM:
				case JewishCalendar.SHUSHAN_PURIM:
					return {
						"Eliahou Yaaqob DWECK-KESAR": [Makam.OJ, Makam.SABA],
						"IDELSOHN Pre1923": [Makam.OJ, Makam.SIGAH],
						"ASHEAR NOTES 1936-1940": [Makam.SIGAH],
						"GABRIEL A SHREM 1964 SUHV":
							[(jCal.getYomTovIndex() == JewishCalendar.PURIM ? Makam.OJ : Makam.SIGAH)],
						"BOZO, Ades, Shir Ushbaha 2005": [Makam.OJ, Makam.SIGAH],
						"MOSHE AMASH (Shami)": [Makam.SIGAH],
						"EZRA MASLATON TARAB (Shami)":
							[(jCal.getYomTovIndex() == JewishCalendar.PURIM ? Makam.SIGAH : Makam.RAST)],
						"ABRAHAM SHAMRICHA (Shami)": [Makam.SIGAH]
					};
				case JewishCalendar.PESACH:
					return {
						15: {
							"Eliahou Yaaqob DWECK-KESAR": [Makam.SIGAH],
							"YAAQOB ABADI-PARSIYA": [Makam.SIGAH],
							"ABRAHAM DWECK Pre1920": [Makam.SIGAH],
							"IDELSOHN Pre1923": [Makam.BAYAT],
							"S SAGIR Laniado": [Makam.SIGAH],
							"ASHEAR list": [Makam.SIGAH],
							"ASHEAR NOTES 1936-1940": [Makam.SIGAH],
							"ABRAHAM E SHREM ~1945": [Makam.SIGAH],
							"Argentina 1947 & Ezra Mishanieh": [Makam.SIGAH],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.SIGAH],
							"GABRIEL A SHREM 1964 SUHV": [Makam.SIGAH],
							"YOSEF YEHEZKEL Jerusalem 1975": [Makam.SIGAH],
							"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.SIGAH],
							"Shaare Zimra YANANI Buenos Aires, 01": [Makam.SIGAH],
							"BOZO, Ades, Shir Ushbaha 2005": [Makam.SIGAH, Makam.BAYAT],
							"MOSHE AMASH (Shami)": [Makam.RAST],
							"EZRA MASLATON TARAB (Shami)": [Makam.RAST],
							"ABRAHAM SHAMRICHA (Shami)": [Makam.RAST],
							"Hallel VeZimrah, Greece List, 1926": [Makam.SIGAH]
						},
						16: {
							"Eliahou Yaaqob DWECK-KESAR": [Makam.AJAM],
							"YAAQOB ABADI-PARSIYA": [Makam.SASGAR],
							"ABRAHAM DWECK Pre1920": [Makam.SASGAR],
							"IDELSOHN Pre1923": [Makam.SASGAR],
							"S SAGIR Laniado": [Makam.AJAM],
							"ASHEAR list": [Makam.AJAM],
							"ASHEAR NOTES 1936-1940": [Makam.AJAM],
							"ABRAHAM E SHREM ~1945": [Makam.AJAM],
							"Argentina 1947 & Ezra Mishanieh": [Makam.AJAM],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.AJAM],
							"GABRIEL A SHREM 1964 SUHV": [Makam.AJAM],
							"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.AJAM],
							"Shaare Zimra YANANI Buenos Aires, 01": [Makam.AJAM],
							"BOZO, Ades, Shir Ushbaha 2005": [Makam.AJAM, Makam.SASGAR],
							"MOSHE AMASH (Shami)": [Makam.SIGAH],
							"EZRA MASLATON TARAB (Shami)": [Makam.SIGAH],
							"ABRAHAM SHAMRICHA (Shami)": [Makam.SIGAH],
							"Hallel VeZimrah, Greece List, 1926": [Makam.AJAM]
						},
						21: {
							"Eliahou Yaaqob DWECK-KESAR": [Makam.AJAM],
							"YAAQOB ABADI-PARSIYA": [Makam.AJAM],
							"ABRAHAM DWECK Pre1920": [Makam.AJAM],
							"IDELSOHN Pre1923": [Makam.AJAM],
							"S SAGIR Laniado": [Makam.AJAM],
							"ASHEAR list": [Makam.AJAM],
							"ASHEAR NOTES 1936-1940": [Makam.AJAM],
							"ABRAHAM E SHREM ~1945": [Makam.AJAM],
							"Argentina 1947 & Ezra Mishanieh": [Makam.AJAM],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.AJAM],
							"GABRIEL A SHREM 1964 SUHV": [Makam.AJAM],
							"YOSEF YEHEZKEL Jerusalem 1975": [Makam.GIRKA],
							"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.AJAM],
							"Shaare Zimra YANANI Buenos Aires, 01": [Makam.AJAM],
							"BOZO, Ades, Shir Ushbaha 2005": [Makam.AJAM],
							"MOSHE AMASH (Shami)": [Makam.AJAM],
							"EZRA MASLATON TARAB (Shami)": [Makam.AJAM],
							"ABRAHAM SHAMRICHA (Shami)": [Makam.AJAM],
							"Hallel VeZimrah, Greece List, 1926": [Makam.FARAHNAQ]
						},
						22: {
							"Eliahou Yaaqob DWECK-KESAR": [Makam.ASHIRAN],
							"ABRAHAM DWECK Pre1920": [Makam.BAYAT],
							"IDELSOHN Pre1923": [Makam.MEHAYAR],
							"S SAGIR Laniado": [Makam.SABA],
							"ASHEAR list": [Makam.SABA],
							"ASHEAR NOTES 1936-1940": [Makam.SABA],
							"ABRAHAM E SHREM ~1945": [Makam.SABA],
							"Argentina 1947 & Ezra Mishanieh": [Makam.SABA],
							"GABRIEL A SHREM 1964 SUHV": [Makam.SABA],
							"Shaare Zimra YANANI Buenos Aires, 01": [Makam.SABA],
							"BOZO, Ades, Shir Ushbaha 2005": [Makam.SABA, Makam.MEHAYAR],
							"MOSHE AMASH (Shami)": [Makam.BAYAT],
							"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
							"Hallel VeZimrah, Greece List, 1926": [Makam.IRAQ]
						}
					}[jCal.getJewishDayOfMonth()]!;
					break;
				case JewishCalendar.CHOL_HAMOED_PESACH:
					const pesachHHReturnData = {
						16: {
							"Eliahou Yaaqob DWECK-KESAR": [Makam.AJAM],
							"YAAQOB ABADI-PARSIYA": [Makam.SASGAR],
							"ABRAHAM DWECK Pre1920": [Makam.SASGAR],
							"IDELSOHN Pre1923": [Makam.SASGAR],
							"S SAGIR Laniado": [Makam.AJAM],
							"ASHEAR list": [Makam.AJAM],
							"ASHEAR NOTES 1936-1940": [Makam.AJAM],
							"ABRAHAM E SHREM ~1945": [Makam.AJAM],
							"Argentina 1947 & Ezra Mishanieh": [Makam.AJAM],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.AJAM],
							"GABRIEL A SHREM 1964 SUHV": [Makam.AJAM],
							"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.AJAM],
							"Shaare Zimra YANANI Buenos Aires, 01": [Makam.AJAM],
							"BOZO, Ades, Shir Ushbaha 2005": [Makam.AJAM, Makam.SASGAR],
							"MOSHE AMASH (Shami)": [Makam.SIGAH],
							"EZRA MASLATON TARAB (Shami)": [Makam.SIGAH],
							"ABRAHAM SHAMRICHA (Shami)": [Makam.SIGAH],
							"Hallel VeZimrah, Greece List, 1926": [Makam.AJAM]
						},
						17: {
							"Eliahou Yaaqob DWECK-KESAR": [Makam.SABA],
							"YAAQOB ABADI-PARSIYA": [Makam.IRAQ],
							"IDELSOHN Pre1923": [Makam.IRAQ],
							"ASHEAR list": [Makam.IRAQ],
							"Argentina 1947 & Ezra Mishanieh": [Makam.IRAQ],
							"GABRIEL A SHREM 1964 SUHV": [Makam.IRAQ]
						},
						18: {
							"Eliahou Yaaqob DWECK-KESAR": [Makam.BAYAT],
							"YAAQOB ABADI-PARSIYA": [Makam.RAHAWI],
							"IDELSOHN Pre1923": [Makam.RAHAWI],
							"ASHEAR list": [Makam.SABA],
							"Argentina 1947 & Ezra Mishanieh": [Makam.SABA],
							"GABRIEL A SHREM 1964 SUHV": [Makam.RAHAWI]
						},
						19: {
							"Eliahou Yaaqob DWECK-KESAR": [Makam.RAST],
							"YAAQOB ABADI-PARSIYA": [Makam.RAST],
							"IDELSOHN Pre1923": [Makam.RAST],
							"ASHEAR list": [Makam.RAST],
							"Argentina 1947 & Ezra Mishanieh": [Makam.RAST],
							"GABRIEL A SHREM 1964 SUHV": [Makam.RAST]
						},
						20: {
							"Eliahou Yaaqob DWECK-KESAR": [Makam.RAHAWI],
							"YAAQOB ABADI-PARSIYA": [Makam.SABA],
							"IDELSOHN Pre1923": [Makam.SABA],
							"ASHEAR list": [Makam.BAYAT],
							"Argentina 1947 & Ezra Mishanieh": [Makam.BAYAT],
							"GABRIEL A SHREM 1964 SUHV": [Makam.BAYAT]
						}
					}[jCal.getJewishDayOfMonth()]!;

					if (jCal.getDayOfWeek() == Calendar.SATURDAY)
						pesachHHReturnData["GABRIEL A SHREM 1964 SUHV"] = [Makam.BAYAT];

					return pesachHHReturnData;
					break;
				case JewishCalendar.SHAVUOS:
					if (jCal.getJewishDayOfMonth() == 7)
						return {
							"Eliahou Yaaqob DWECK-KESAR": [Makam.AJAM],
							"ABRAHAM DWECK Pre1920": [Makam.SASGAR],
							"S SAGIR Laniado": [Makam.AJAM],
							"ASHEAR list": [Makam.AJAM],
							"ASHEAR NOTES 1936-1940": [Makam.AJAM],
							"Argentina 1947 & Ezra Mishanieh": [Makam.SASGAR],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.HOSENI],
							"GABRIEL A SHREM 1964 SUHV": [Makam.AJAM],
							"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.HOSENI],
							"Shaare Zimra YANANI Buenos Aires, 01": [Makam.SIGAH],
							"BOZO, Ades, Shir Ushbaha 2005": [Makam.AJAM],
							"MOSHE AMASH (Shami)": [Makam.BAYAT],
							"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
							"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
							"Hallel VeZimrah, Greece List, 1926": [Makam.BUSTANIGAR]
						};

					return {
						"Eliahou Yaaqob DWECK-KESAR": [Makam.SIGAH],
						"ABRAHAM DWECK Pre1920": [Makam.SIGAH],
						"IDELSOHN Pre1923": [Makam.SIGAH],
						"S SAGIR Laniado": [Makam.SIGAH],
						"ASHEAR list": [Makam.SIGAH],
						"ASHEAR NOTES 1936-1940": [Makam.SIGAH],
						"Argentina 1947 & Ezra Mishanieh": [Makam.SIGAH],
						"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.AJAM],
						"GABRIEL A SHREM 1964 SUHV": [Makam.SIGAH],
						"YOSEF YEHEZKEL Jerusalem 1975": [Makam.BAYAT, Makam.AJAM],
						"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.AJAM],
						"Shaare Zimra YANANI Buenos Aires, 01": [Makam.AJAM],
						"BOZO, Ades, Shir Ushbaha 2005": [Makam.SIGAH],
						"MOSHE AMASH (Shami)": [Makam.RAST],
						"EZRA MASLATON TARAB (Shami)": [Makam.RAST],
						"ABRAHAM SHAMRICHA (Shami)": [Makam.RAST],
						"Hallel VeZimrah, Greece List, 1926": [Makam.RAST]
					};
			}
		}

		const data:Partial<Record<Parsha, getMaqamReturnType>> = {
			[Parsha.BERESHIS]: fillMakamTable(makamHeaders.bereshit,
				[Makam.RAST],
				{
					"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.RAST, Makam.BAYAT],
					"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.RAST, Makam.BAYAT],
					"Dibre Shelomo S KASSIN Pre1915": [Makam.RAST, Makam.BAYAT],
					"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.BAYAT, Makam.RAST],
					"Victor Afya, Istanbul List": [Makam.SEGAH],
					"Izak Alaluf, Izmir List": [Makam.SEGAH],
				}
			),
			[Parsha.NOACH]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.IRAQ, Makam.SABA],
				"TEBELE Pre1888": [Makam.IRAQ],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.IRAQ, Makam.SABA],
				"YAAQOB ABADI-PARSIYA": [Makam.BAYAT],
				"YISHAQ YEQAR ARGENTINA": [Makam.IRAQ],
				"ADES: 24793": [Makam.IRAQ, Makam.SABA],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.IRAQ, Makam.SABA],
				"Knis Betesh Geniza List, Aleppo": [Makam.IRAQ, Makam.SIGAH],
				"ABRAHAM DWECK Pre1920": [Makam.SIGAH],
				"IDELSOHN Pre1923": [Makam.IRAQ],
				"S SAGIR Laniado": [Makam.BAYAT],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.SIGAH],
				"ASHEAR list": [Makam.IRAQ],
				"ASHEAR NOTES 1936-1940": [Makam.IRAQ, Makam.SIGAH],
				"ABRAHAM E SHREM ~1945": [Makam.SIGAH],
				"Argentina 1947 & Ezra Mishanieh": [Makam.IRAQ],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.IRAQ, Makam.BAYAT],
				"GABRIEL A SHREM 1964 SUHV": [Makam.SIGAH],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.SIGAH],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.HIJAZ],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.HIJAZ],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.BAYAT, Makam.SIGAH],
				"Yishaq Yeranen Halabi": [Makam.BAYAT],
				"MOSHE AMASH (Shami)": [Makam.NAWAH],
				"EZRA MASLATON TARAB (Shami)": [Makam.NAWAH],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.NAWAH],
				"Victor Afya, Istanbul List": [Makam.HICAZ],
				"Izak Alaluf, Izmir List": [Makam.HICAZ],
				//"Hallel VeZimrah, Salonika, 1928": "Nibah"
			},
			[Parsha.LECH_LECHA]: fillMakamTable(makamHeaders.bereshit,
				[Makam.SABA],
				{
					"MOSHE AMASH (Shami)": [Makam.SIGAH, Makam.IRAQ],
					"EZRA MASLATON TARAB (Shami)": [Makam.SIGAH, Makam.IRAQ],
					"ABRAHAM SHAMRICHA (Shami)": [Makam.SIGAH],
					"Victor Afya, Istanbul List": [Makam.HUSEYNI],
					"Izak Alaluf, Izmir List": [Makam.HUSEYNI],
					"Hallel VeZimrah, Salonika, 1928": [Makam.NAHOFT]
				}),
			[Parsha.VAYERA]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.NAWAH],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.NAWAH],
				"TEBELE Pre1888": [Makam.NAWAH],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [Makam.NAWAH],
				"YISHAQ YEQAR ARGENTINA": [Makam.NAWAH],
				"ADES: 24793": [Makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.NAWAH],
				"Knis Betesh Geniza List, Aleppo": [Makam.NAWAH],
				"ABRAHAM DWECK Pre1920": [Makam.HOSENI],
				"IDELSOHN Pre1923": [Makam.NAWAH],
				"S SAGIR Laniado": [Makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.BAYAT],
				"ASHEAR list": [Makam.NAWAH],
				"ASHEAR NOTES 1936-1940": [Makam.NAWAH, Makam.RAST],
				"ABRAHAM E SHREM ~1945": [Makam.BAYAT],
				"Argentina 1947 & Ezra Mishanieh": [Makam.NAHWAND],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.NAWAH],
				"GABRIEL A SHREM 1964 SUHV": [Makam.RAHAWI, Makam.NAWAH], // Original Pizmonim.com entry: Just Nawah
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.BAYAT],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.HIJAZ],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.NAHWAND],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.NAWAH],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.NAWAH],
				"Yishaq Yeranen Halabi": [Makam.NAWAH],
				"MOSHE AMASH (Shami)": [Makam.AJAM],
				"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
				"Victor Afya, Istanbul List": [Makam.ARABAN],
				"Izak Alaluf, Izmir List": [Makam.NIHAVEND],
				"Hallel VeZimrah, Salonika, 1928": [Makam.HIJAZ]
			},
			[Parsha.CHAYEI_SARA]: fillMakamTable(makamHeaders.bereshit,
				[Makam.HIJAZ],
				{
					"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.HOSENI],
					"ADES: 24793": [Makam.ARAZBAR],
					"Dibre Shelomo S KASSIN Pre1915": [Makam.HIJAZ, Makam.ARAZBAR],
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.NAHWAND],
					"YOSEF YEHEZKEL Jerusalem 1975": [Makam.HIJAZ_KAR],
					"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.HIJAZ_KAR],
					"Shaare Zimra YANANI Buenos Aires, 01": [Makam.NAHWAND],
					"MOSHE AMASH (Shami)": [Makam.SABA],
					"EZRA MASLATON TARAB (Shami)": [Makam.SABA],
					"ABRAHAM SHAMRICHA (Shami)": [Makam.SABA],
					"Victor Afya, Istanbul List": [Makam.DUGAH],
					"Izak Alaluf, Izmir List": [Makam.DUGAH],
					"Hallel VeZimrah, Salonika, 1928": [Makam.BUSTANIGAR]
				}),
			[Parsha.TOLDOS]: fillMakamTable(makamHeaders.bereshit,
				[Makam.MAHOUR],
				{
					"Knis Betesh Geniza List, Aleppo": [Makam.RAST],
					"ABRAHAM DWECK Pre1920": [Makam.RAST],
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.RAST],
					"Shaare Zimra YANANI Buenos Aires, 01": [Makam.RAST],
					"MOSHE AMASH (Shami)": [Makam.RAST],
					"Victor Afya, Istanbul List": [Makam.MAHUR],
					"Izak Alaluf, Izmir List": [Makam.ARABAN],
					"Hallel VeZimrah, Salonika, 1928": [Makam.IRAQ]
				}),
			[Parsha.VAYETZEI]: {
				//"TABBUSH Ms NLI 8*7622, Aleppo": ["Sharga"],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.GIRKA],
				"TEBELE Pre1888": [Makam.GIRKA],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.GIRKA],
				"YAAQOB ABADI-PARSIYA": [Makam.GIRKA],
				"YISHAQ YEQAR ARGENTINA": [Makam.GIRKA],
				"ADES: 24793": [Makam.GIRKA],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.GIRKA, Makam.AJAM],
				"Knis Betesh Geniza List, Aleppo": [Makam.SABA],
				"ABRAHAM DWECK Pre1920": [Makam.SABA],
				"IDELSOHN Pre1923": [Makam.GIRKA],
				"S SAGIR Laniado": [Makam.AJAM],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.SABA],
				//"ASHEAR list": ["Sharga"],
				"ASHEAR NOTES 1936-1940": [Makam.AJAM],
				"ABRAHAM E SHREM ~1945": [Makam.SABA],
				"Argentina 1947 & Ezra Mishanieh": [Makam.GIRKA/*, "Sharga" */],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.AJAM],
				"GABRIEL A SHREM 1964 SUHV": [Makam.AJAM],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.SABA],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.AJAM],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.AJAM],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.AJAM],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.AJAM],
				"Yishaq Yeranen Halabi": [Makam.AJAM],
				"MOSHE AMASH (Shami)": [Makam.AJAM],
				"EZRA MASLATON TARAB (Shami)": [Makam.AJAM],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.AJAM],
				"Victor Afya, Istanbul List": [Makam.NIHAVEND],
				"Izak Alaluf, Izmir List": [Makam.BEYATI],
				"Hallel VeZimrah, Salonika, 1928": [Makam.SABA]
			},
			[Parsha.VAYISHLACH]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.IRAQ, Makam.SABA],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.IRAQ, Makam.SABA],
				"TEBELE Pre1888": [Makam.IRAQ],
				"YAAQOB ABADI-PARSIYA": [Makam.BAYAT],
				"YISHAQ YEQAR ARGENTINA": [Makam.SIGAH],
				"ADES: 24793": [Makam.IRAQ, Makam.SABA],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.IRAQ, Makam.SABA],
				"Knis Betesh Geniza List, Aleppo": [Makam.IRAQ],
				"ABRAHAM DWECK Pre1920": [Makam.BAYAT],
				"IDELSOHN Pre1923": [Makam.IRAQ],
				"S SAGIR Laniado": [Makam.BAYAT],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.HOSENI],
				"ASHEAR list": [Makam.IRAQ],
				"ASHEAR NOTES 1936-1940": [Makam.SIGAH, Makam.IRAQ],
				"ABRAHAM E SHREM ~1945": [Makam.HOSENI],
				"Argentina 1947 & Ezra Mishanieh": [Makam.IRAQ],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.SABA, Makam.SIGAH],
				"GABRIEL A SHREM 1964 SUHV": [Makam.SABA, Makam.SIGAH],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.SIGAH],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.SABA],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.SABA],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.BAYAT, Makam.SIGAH],
				"Yishaq Yeranen Halabi": [Makam.BAYAT],
				"MOSHE AMASH (Shami)": [Makam.BAYAT],
				"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
				"Victor Afya, Istanbul List": [Makam.ACEM_ASHIRAN],
				"Izak Alaluf, Izmir List": [Makam.ACEM_ASHIRAN],
				"Hallel VeZimrah, Salonika, 1928": [Makam.HUZAM]
			},
			[Parsha.VAYESHEV]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.RAHAWI],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.RAHAWI],
				"TEBELE Pre1888": [Makam.RAHAWI],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.RAHAWI],
				"YAAQOB ABADI-PARSIYA": [Makam.RAHAWI],
				"YISHAQ YEQAR ARGENTINA": [Makam.RAHAWI],
				"ADES: 24793": [Makam.RAHAWI],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.RAHAWI],
				"Knis Betesh Geniza List, Aleppo": [Makam.RAHAWI],
				"IDELSOHN Pre1923": [Makam.RAHAWI],
				"S SAGIR Laniado": [Makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.RAHAWI],
				"ASHEAR list": [Makam.RAHAWI],
				"ASHEAR NOTES 1936-1940": [Makam.NAWAH, Makam.NAHWAND],
				"ABRAHAM E SHREM ~1945": [Makam.RAHAWI, Makam.NAHWAND],
				"Argentina 1947 & Ezra Mishanieh": [Makam.RAHAWI],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.RAHAWI],
				"GABRIEL A SHREM 1964 SUHV": [Makam.RAHAWI, Makam.NAHWAND],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.NAWAH],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.NAHWAND],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.NAHWAND],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.NAWAH],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.RAHAWI, Makam.NAWAH],
				"Yishaq Yeranen Halabi": [Makam.NAWAH],
				"MOSHE AMASH (Shami)": [Makam.NAWAH],
				"EZRA MASLATON TARAB (Shami)": [Makam.NAWAH],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.NAWAH],
				"Victor Afya, Istanbul List": [Makam.USSAK],
				"Izak Alaluf, Izmir List": [Makam.ISFAHAN],
				"Hallel VeZimrah, Salonika, 1928": [Makam.SIGAH]
			},
			[Parsha.MIKETZ]:
				fillMakamTable(makamHeaders.bereshit
					.filter(book => book !== "Victor Afya, Istanbul List"),
				[Makam.SIGAH],
				{
					"MOSHE AMASH (Shami)": [Makam.RAHAWI],
					"EZRA MASLATON TARAB (Shami)": [Makam.RAHAWI],
					"ABRAHAM SHAMRICHA (Shami)": [Makam.RAHAWI],
					"Izak Alaluf, Izmir List": [Makam.USSAK],
					"Hallel VeZimrah, Salonika, 1928": [Makam.USSAK]
				}),
			[Parsha.VAYIGASH]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.BAYAT],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.BAYAT],
				"TEBELE Pre1888": [Makam.BAYAT],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.IRAQ, Makam.SABA, Makam.BAYAT, Makam.RAST],
				"YAAQOB ABADI-PARSIYA": [Makam.SABA],
				"YISHAQ YEQAR ARGENTINA": [Makam.BAYAT],
				"ADES: 24793": [Makam.BAYAT],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.BAYAT],
				"Knis Betesh Geniza List, Aleppo": [Makam.SABA],
				"ABRAHAM DWECK Pre1920": [Makam.SABA],
				"IDELSOHN Pre1923": [Makam.BAYAT],
				"S SAGIR Laniado": [Makam.SABA],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.MAHOUR],
				"ASHEAR list": [Makam.BAYAT],
				"ASHEAR NOTES 1936-1940": [Makam.BAYAT],
				"ABRAHAM E SHREM ~1945": [Makam.MAHOUR],
				"Argentina 1947 & Ezra Mishanieh": [Makam.BAYAT],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.BAYAT, Makam.SABA],
				"GABRIEL A SHREM 1964 SUHV": [Makam.BAYAT],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.BAYAT],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.BAYAT],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.BAYAT],
				"Yishaq Yeranen Halabi": [Makam.BAYAT, Makam.SABA],
				"MOSHE AMASH (Shami)": [Makam.SIGAH],
				"EZRA MASLATON TARAB (Shami)": [Makam.SIGAH],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.SIGAH],
				"Victor Afya, Istanbul List": [Makam.SEGAH],
				"Izak Alaluf, Izmir List": [Makam.NIHAVEND],
				"Hallel VeZimrah, Salonika, 1928": [Makam.MUHAYER]
			},
			[Parsha.VAYECHI]: fillMakamTable(makamHeaders.bereshit,
				[Makam.HIJAZ],
				{
					"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.HIJAZ, Makam.SABA],
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.NAHWAND],
					"YOSEF YEHEZKEL Jerusalem 1975": [Makam.SHURI],
					"Shaare Zimra YANANI Buenos Aires, 01": [Makam.NAHWAND],
					"MOSHE AMASH (Shami)": [Makam.SABA],
					"EZRA MASLATON TARAB (Shami)": [Makam.SABA],
					"ABRAHAM SHAMRICHA (Shami)": [Makam.SABA],
					"Victor Afya, Istanbul List": [Makam.BEYATI],
					"Izak Alaluf, Izmir List": [Makam.CARGAH],
					"Hallel VeZimrah, Salonika, 1928": [Makam.AJAM]
				}),
			[Parsha.SHEMOS]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.RAST],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.BAYAT, Makam.RAST],
				"TEBELE Pre1888": [Makam.BAYAT],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.BAYAT, Makam.RAST],
				"YAAQOB ABADI-PARSIYA": [Makam.BAYAT],
				"YISHAQ YEQAR ARGENTINA": [Makam.RAST],
				"ADES: 24793": [Makam.BAYAT, Makam.RAST],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.BAYAT, Makam.RAST],
				"Knis Betesh Geniza List, Aleppo": [Makam.RAST],
				"ABRAHAM DWECK Pre1920": [Makam.RAST],
				"IDELSOHN Pre1923": [Makam.RAST],
				"S SAGIR Laniado": [Makam.BAYAT],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.HOSENI],
				"ASHEAR list": [Makam.BAYAT, Makam.RAST],
				"ASHEAR NOTES 1936-1940": [Makam.BAYAT, Makam.RAST],
				"ABRAHAM E SHREM ~1945": [Makam.HOSENI],
				"Argentina 1947 & Ezra Mishanieh": [Makam.BAYAT, Makam.RAST],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.BAYAT, Makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [Makam.BAYAT, Makam.RAST],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.RAST],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.RAST],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.RAST],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.RAST],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.BAYAT, Makam.RAST],
				"Yishaq Yeranen Halabi": [Makam.BAYAT],
				"MOSHE AMASH (Shami)": [Makam.RAST],
				"EZRA MASLATON TARAB (Shami)": [Makam.RAST],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.RAST],
				"Victor Afya, Istanbul List": [Makam.NIHAVEND],
				"Izak Alaluf, Izmir List": [Makam.NIHAVEND],
				"Hallel VeZimrah, Greece List, 1926": [Makam.BAYATI]
			},
			[Parsha.VAERA]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.SABA],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.HOSENI, Makam.NAWAH],
				"TEBELE Pre1888": [Makam.HOSENI],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.IRAQ, Makam.HOSENI, Makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [Makam.IRAQ, Makam.HOSENI],
				"YISHAQ YEQAR ARGENTINA": [Makam.SIGAH],
				"ADES: 24793": [Makam.HOSENI, Makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.HOSENI, Makam.NAWAH],
				"Knis Betesh Geniza List, Aleppo": [Makam.BAYAT],
				"ABRAHAM DWECK Pre1920": [Makam.BAYAT],
				"IDELSOHN Pre1923": [Makam.HOSENI, Makam.NAWAH],
				"S SAGIR Laniado": [Makam.SIGAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.SABA],
				"ASHEAR list": [Makam.SIGAH],
				"ASHEAR NOTES 1936-1940": [Makam.NAHWAND,Makam.BAYAT],
				"ABRAHAM E SHREM ~1945": [Makam.SABA],
				"Argentina 1947 & Ezra Mishanieh": [Makam.SIGAH],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.HOSENI, Makam.SIGAH],
				"GABRIEL A SHREM 1964 SUHV": [Makam.HOSENI, Makam.RAST],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.BAYAT],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.HOSENI],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.BAYAT],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.SIGAH],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.NAWAH,Makam.HOSENI],
				"Yishaq Yeranen Halabi": [Makam.NAWAH],
				"MOSHE AMASH (Shami)": [Makam.BAYAT],
				"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
				"Victor Afya, Istanbul List": [Makam.HICAZ],
				"Izak Alaluf, Izmir List": [Makam.HICAZ],
				"Hallel VeZimrah, Greece List, 1926": [Makam.BUSALIQ]
			},
			[Parsha.BO]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.IRAQ, Makam.RAST],
				"TEBELE Pre1888": [Makam.IRAQ],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.IRAQ, Makam.RAST],
				"YAAQOB ABADI-PARSIYA": [Makam.SIGAH, Makam.RAST],
				"YISHAQ YEQAR ARGENTINA": [Makam.BAYAT],
				"ADES: 24793": [Makam.IRAQ, Makam.RAST],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.IRAQ, Makam.RAST],
				"Knis Betesh Geniza List, Aleppo": [Makam.SABA],
				"ABRAHAM DWECK Pre1920": [Makam.RAHAWI],
				"IDELSOHN Pre1923": [Makam.IRAQ],
				"S SAGIR Laniado": [Makam.RAST],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.BAYAT],
				"ASHEAR list": [Makam.RAST],
				"ASHEAR NOTES 1936-1940": [Makam.NAWAH, Makam.NAHWAND],
				"ABRAHAM E SHREM ~1945": [Makam.NAHWAND],
				"Argentina 1947 & Ezra Mishanieh": [Makam.RAST],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.SIGAH, Makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [Makam.SIGAH],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.SIGAH],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.SIGAH],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.SIGAH],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.NAWAH],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.SIGAH],
				"Yishaq Yeranen Halabi": [Makam.SIGAH],
				"MOSHE AMASH (Shami)": [Makam.RAST],
				"EZRA MASLATON TARAB (Shami)": [Makam.RAHAWI],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.NAWAH],
				"Victor Afya, Istanbul List": [Makam.HUSEYNI],
				"Izak Alaluf, Izmir List": [Makam.HUSEYNI],
				"Hallel VeZimrah, Greece List, 1926": [Makam.QARGIGAR]
			},
			[Parsha.BESHALACH]: fillMakamTable(makamHeaders.shemot,
				[Makam.AJAM],
				{
					"Victor Afya, Istanbul List": [Makam.ACEM_ASHIRAN],
					"Izak Alaluf, Izmir List": [Makam.ACEM_ASHIRAN],
					"Hallel VeZimrah, Greece List, 1926": ["Farahnaq"]
				}),
			[Parsha.YISRO]: fillMakamTable(makamHeaders.shemot,
				[Makam.HOSENI],
				{
					"ELIE SHAUL COHEN FROM AINTAB, ~1880": ["Ḥoseni"],
					"IDELSOHN Pre1923": [Makam.SIGAH],
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.BAYAT],
					"YOSEF YEHEZKEL Jerusalem 1975": [Makam.KURD],
					"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.KURD, Makam.HOSENI],
					"Shaare Zimra YANANI Buenos Aires, 01": [Makam.BAYAT],
					"BOZO, Ades, Shir Ushbaha 2005": [Makam.HOSENI, Makam.SIGAH],
					"MOSHE AMASH (Shami)": [Makam.BAYAT],
					"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
					"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
					"Victor Afya, Istanbul List": [Makam.MAHUR, Makam.SEHNAZ],
					"Izak Alaluf, Izmir List": [Makam.MAHUR],
					"Hallel VeZimrah, Greece List, 1926": [Makam.RAST]
				}),
			[Parsha.MISHPATIM]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.NAWAH],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.RAST,Makam.SABA],
				"TEBELE Pre1888": [Makam.SABA],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.NAWAH,Makam.SABA],
				"YAAQOB ABADI-PARSIYA": [Makam.NAWAH,Makam.SABA],
				"YISHAQ YEQAR ARGENTINA": [Makam.NAWAH],
				"ADES: 24793": [Makam.SABA],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.SABA],
				"Knis Betesh Geniza List, Aleppo": [Makam.NAWAH],
				"ABRAHAM DWECK Pre1920": [Makam.NAHWAND],
				"IDELSOHN Pre1923": [Makam.SABA],
				"S SAGIR Laniado": [Makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.RAST,Makam.SABA],
				"ASHEAR list": [Makam.NAWAH],
				"ASHEAR NOTES 1936-1940": [Makam.BAYAT, Makam.NAWAH],
				"ABRAHAM E SHREM ~1945": [Makam.RAST],
				"Argentina 1947 & Ezra Mishanieh": [Makam.NAHWAND],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.SABA],
				"GABRIEL A SHREM 1964 SUHV": [Makam.SABA],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.SABA],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.SABA, Makam.ISFAHAN],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.SABA],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.RAST],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.SABA],
				"Yishaq Yeranen Halabi": [Makam.SABA],
				"MOSHE AMASH (Shami)": [Makam.SIGAH],
				"EZRA MASLATON TARAB (Shami)": [Makam.SIGAH],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.SIGAH],
				"Victor Afya, Istanbul List": [Makam.ARABAN],
				"Izak Alaluf, Izmir List": [Makam.BEYATI],
				//"Hallel VeZimrah, Greece List, 1926": "Nibah"
			},
			[Parsha.TERUMAH]: fillMakamTable(
				makamHeaders.shemot, [Makam.SABA],
				{
					"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.SABA, Makam.RAST],
					"YAAQOB ABADI-PARSIYA": [Makam.SABA, Makam.RAST],
					"Dibre Shelomo S KASSIN Pre1915": [Makam.SABA, Makam.MOUHAYAR],
					"IDELSOHN Pre1923": [Makam.SIGAH],
					"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.SABA, Makam.HOSENI],
					"ASHEAR NOTES 1936-1940": [Makam.BAYAT],
					"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.BAYAT, Makam.SABA],
					"GABRIEL A SHREM 1964 SUHV": [Makam.HOSENI],
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.RAST],
					"YOSEF YEHEZKEL Jerusalem 1975": [Makam.BAYAT, Makam.HOSENI],
					"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.BAYAT],
					"BOZO, Ades, Shir Ushbaha 2005": [Makam.BAYAT, Makam.SIGAH],
					"Yishaq Yeranen Halabi": [Makam.BAYAT],
					"MOSHE AMASH (Shami)": [Makam.RAST],
					"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
					"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
					"Victor Afya, Istanbul List": [Makam.BEYATI],
					"Izak Alaluf, Izmir List": [Makam.SEGAH],
					"Hallel VeZimrah, Greece List, 1926": [Makam.NAHWAND]
				}),
			[Parsha.TETZAVEH]: fillMakamTable(makamHeaders.shemot,
				[Makam.SIGAH],
				{
					"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.SABA, Makam.SIGAH],
					"MOSHE AMASH (Shami)": [Makam.BAYAT],
					"EZRA MASLATON TARAB (Shami)": [Makam.MAHOUR],
					"ABRAHAM SHAMRICHA (Shami)": [Makam.MAHOUR],
					"Victor Afya, Istanbul List": [Makam.SEGAH],
					"Izak Alaluf, Izmir List": [Makam.ISFAHAN],
					"Hallel VeZimrah, Greece List, 1926": ["Sigah"]
				}),
			[Parsha.KI_SISA]: fillMakamTable(
				makamHeaders.shemot.filter(book => book !== "Hallel VeZimrah, Greece List, 1926"),
				[Makam.HIJAZ],
				{
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.NAHWAND],
					"YOSEF YEHEZKEL Jerusalem 1975": [Makam.SHURI],
					"Shaare Zimra YANANI Buenos Aires, 01": [Makam.NAHWAND],
					"MOSHE AMASH (Shami)": [Makam.SABA],
					"EZRA MASLATON TARAB (Shami)": [Makam.SABA],
					"ABRAHAM SHAMRICHA (Shami)": [Makam.SABA],
					"Victor Afya, Istanbul List": [Makam.HICAZ],
					"Izak Alaluf, Izmir List": [Makam.ARABAN],
					//"Hallel VeZimrah, Greece List, 1926": "Haqaqordo?"
				}),
			[Parsha.VAYAKHEL]: fillMakamTable(makamHeaders.shemot
					.filter(book => ![
						"M H Elias, SHIR HADASH, Jerusalem, 1930",
						"YOSEF YEHEZKEL Jerusalem 1975",
						"ABRAHAM SHAMRICHA (Shami)",
						"Victor Afya, Istanbul List",
						"Izak Alaluf, Izmir List"
					].includes(book)), [Makam.HOSENI],
				{
					"YISHAQ YEQAR ARGENTINA": [Makam.SABA],
					"S SAGIR Laniado": [Makam.BAYAT],
					"ASHEAR NOTES 1936-1940": [Makam.BAYAT],
					"ABRAHAM E SHREM ~1945": [Makam.BAYAT],
					"Shaare Zimra YANANI Buenos Aires, 01": [Makam.BAYAT],
					"MOSHE AMASH (Shami)": [Makam.AJAM],
					"EZRA MASLATON TARAB (Shami)": [Makam.MAHOUR],
					"Hallel VeZimrah, Greece List, 1926": [Makam.BUSTANIGAR]
				}),
			[Parsha.PEKUDEI]: fillMakamTable(makamHeaders.shemot
					.filter(book => ![
						"YOSEF YEHEZKEL Jerusalem 1975",
						"Victor Afya, Istanbul List",
						"Izak Alaluf, Izmir List"
					].includes(book)), [Makam.NAWAH],
				{
					"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.RAST, Makam.SABA],
					"ABRAHAM E SHREM ~1945": [Makam.SABA],
					"Argentina 1947 & Ezra Mishanieh": [Makam.NAHWAND],
					//"GABRIEL A SHREM 1964 SUHV": [Makam.NAWAH], // Artscroll: Nawah/Nahwand; Shir Ushbacha: Rahaw/Nawah
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.BAYAT],
					"MOSHE AMASH (Shami)": [Makam.BAYAT],
					"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
					"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
					"Hallel VeZimrah, Greece List, 1926": [Makam.HUZAM]
				}),
			[Parsha.VAYIKRA]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.RAST],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.RAST],
				"TEBELE Pre1888": [Makam.RAST],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.RAST],
				"YAAQOB ABADI-PARSIYA": [Makam.RAST],
				"YISHAQ YEQAR ARGENTINA": [Makam.RAST],
				"ADES: 24793": [Makam.RAST],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.RAST],
				"Knis Betesh Geniza List, Aleppo": [Makam.RAST],
				"ABRAHAM DWECK Pre1920": [Makam.RAST],
				"IDELSOHN Pre1923": [Makam.RAST],
				"S SAGIR Laniado": [Makam.RAST],
				"ASHEAR list": [Makam.RAST],
				"ASHEAR NOTES 1936-1940": [Makam.RAST],
				"Argentina 1947 & Ezra Mishanieh": [Makam.RAST],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [Makam.RAST],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.RAST],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.RAST],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.RAST],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.RAST],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.RAST],
				"Yishaq Yeranen Halabi": [Makam.RAST],
				"MOSHE AMASH (Shami)": [Makam.RAST],
				"EZRA MASLATON TARAB (Shami)": [Makam.RAST],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.RAST],
				"Victor Afya, Istanbul List": [Makam.SEBAH],
				"Izak Alaluf, Izmir List": [Makam.HICAZ],
				"Hallel VeZimrah, Greece List, 1926": [Makam.SABA]
			},
			[Parsha.TZAV]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.IRAQ],
				"TEBELE Pre1888": [Makam.IRAQ],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.RAHAWI, Makam.IRAQ],
				"YAAQOB ABADI-PARSIYA": [Makam.RAHAWI, Makam.IRAQ],
				"YISHAQ YEQAR ARGENTINA": [Makam.RAHAWI],
				"ADES: 24793": [Makam.IRAQ],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.IRAQ],
				"Knis Betesh Geniza List, Aleppo": [Makam.RAHAWI],
				"ABRAHAM DWECK Pre1920": [Makam.RAHAWI],
				"IDELSOHN Pre1923": [Makam.IRAQ],
				"S SAGIR Laniado": [Makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.RAHAWI],
				"ASHEAR list": [Makam.RAHAWI],
				"ASHEAR NOTES 1936-1940": [Makam.BAYAT],
				"Argentina 1947 & Ezra Mishanieh": [Makam.RAHAWI],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.IRAQ],
				"GABRIEL A SHREM 1964 SUHV": [Makam.RAHAWI, Makam.NAWAH],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.BAYAT],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.IRAQ],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.NAHWAND],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.SIGAH],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.NAWAH],
				"Yishaq Yeranen Halabi": [Makam.NAWAH],
				"MOSHE AMASH (Shami)": [Makam.NAWAH],
				"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
				"Victor Afya, Istanbul List": [Makam.ISFAHAN, Makam.ACEM_ASHIRAN],
				"Izak Alaluf, Izmir List": [Makam.SEGAH],
				"Hallel VeZimrah, Greece List, 1926": ["Ḥoseni"]
			},
			[Parsha.SHMINI]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.HOSENI],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.HOSENI],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.HOSENI],
				"YAAQOB ABADI-PARSIYA": [Makam.HOSENI],
				"YISHAQ YEQAR ARGENTINA": [Makam.HOSENI],
				"ADES: 24793": [Makam.HOSENI],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.HOSENI],
				"Knis Betesh Geniza List, Aleppo": [Makam.HOSENI],
				"ABRAHAM DWECK Pre1920": [Makam.HOSENI],
				"IDELSOHN Pre1923": [Makam.HOSENI],
				"S SAGIR Laniado": [Makam.HOSENI],
				"ASHEAR list": [Makam.HOSENI],
				"ASHEAR NOTES 1936-1940": [Makam.NAHWAND],
				"Argentina 1947 & Ezra Mishanieh": [Makam.HOSENI],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.HOSENI],
				"GABRIEL A SHREM 1964 SUHV": [Makam.HOSENI],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.RAST],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.HOSENI],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.HOSENI],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.HOSENI],
				"Yishaq Yeranen Halabi": [Makam.HOSENI],
				"MOSHE AMASH (Shami)": [Makam.SABA],
				"EZRA MASLATON TARAB (Shami)": [Makam.SABA],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.SABA],
				"Victor Afya, Istanbul List": [Makam.HICAZ],
				"Izak Alaluf, Izmir List": [Makam.HICAZ],
				"Hallel VeZimrah, Greece List, 1926": [Makam.BAYATI]
			},
			[Parsha.TAZRIA]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.BAYAT],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.BAYAT],
				"TEBELE Pre1888": [Makam.BAYAT],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.BAYAT],
				"YAAQOB ABADI-PARSIYA": [Makam.BAYAT],
				"YISHAQ YEQAR ARGENTINA": [Makam.MEHAYAR],
				"ADES: 24793": [Makam.BAYAT],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.BAYAT],
				"Knis Betesh Geniza List, Aleppo": [Makam.BAYAT],
				"ABRAHAM DWECK Pre1920": [Makam.BAYAT],
				"IDELSOHN Pre1923": [Makam.BAYAT],
				"S SAGIR Laniado": [Makam.SIGAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.BAYAT],
				"ASHEAR list": [Makam.SIGAH],
				"ASHEAR NOTES 1936-1940": [Makam.BAYAT, Makam.SIGAH],
				"Argentina 1947 & Ezra Mishanieh": [Makam.SIGAH],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.BAYAT, Makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [Makam.BAYAT, Makam.SABA],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.BAYAT],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.MEHAYAR],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.SIGAH],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.SABA],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.BAYAT, Makam.SABA],
				"Yishaq Yeranen Halabi": [Makam.SABA],
				"MOSHE AMASH (Shami)": [Makam.BAYAT],
				"EZRA MASLATON TARAB (Shami)": [Makam.SIGAH],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
				"Victor Afya, Istanbul List": [Makam.MAHUR],
				"Izak Alaluf, Izmir List": [Makam.ACEM_ASHIRAN],
				"Hallel VeZimrah, Greece List, 1926": [Makam.SUZNIQ]
			},
			[Parsha.METZORA]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.IRAQ],
				"TEBELE Pre1888": [Makam.IRAQ],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.RAHAWI],
				"YAAQOB ABADI-PARSIYA": [Makam.NAWAH],
				"YISHAQ YEQAR ARGENTINA": [Makam.SIGAH],
				"ADES: 24793": [Makam.IRAQ],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.IRAQ],
				"Knis Betesh Geniza List, Aleppo": [Makam.RAHAWI],
				"ABRAHAM DWECK Pre1920": [Makam.NAHWAND],
				"IDELSOHN Pre1923": [Makam.IRAQ],
				"S SAGIR Laniado": [Makam.NAWAH],
				"ASHEAR NOTES 1936-1940": [Makam.NAHWAND, Makam.SIGAH],
				"Argentina 1947 & Ezra Mishanieh": [Makam.SIGAH],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.SABA, Makam.SIGAH],
				"GABRIEL A SHREM 1964 SUHV": [Makam.NAHWAND, Makam.SIGAH],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.SIGAH],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.RAST],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.NAWAH],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.SABA, Makam.SIGAH],
				"Yishaq Yeranen Halabi": [Makam.SABA],
				"MOSHE AMASH (Shami)": [Makam.RAST],
				"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
				"Izak Alaluf, Izmir List": [Makam.SEGAH],
				"Hallel VeZimrah, Greece List, 1926": ["Sigah"]
			},
			[Parsha.ACHREI_MOS]: fillMakamTable(makamHeaders.vayikra
					.filter(book => !["Izak Alaluf, Izmir List", "Victor Afya, Istanbul List"].includes(book)),
				[Makam.HIJAZ],
				{
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.NAHWAND],
					"Shaare Zimra YANANI Buenos Aires, 01": [Makam.NAHWAND],
					"MOSHE AMASH (Shami)": [Makam.SABA],
					"EZRA MASLATON TARAB (Shami)": [Makam.SABA],
					"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
					"Hallel VeZimrah, Greece List, 1926": [Makam.NAHOFT]
				}),
			[Parsha.KEDOSHIM]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.SABA],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.SABA],
				"YAAQOB ABADI-PARSIYA": [Makam.IRAQ, Makam.SABA],
				"YISHAQ YEQAR ARGENTINA": [Makam.IRAQ],
				"ADES: 24793": [Makam.SABA],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.SABA],
				"Knis Betesh Geniza List, Aleppo": [Makam.SABA],
				"ABRAHAM DWECK Pre1920": [Makam.SABA],
				"IDELSOHN Pre1923": [Makam.SABA],
				"S SAGIR Laniado": [Makam.SABA],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.RAST],
				"ASHEAR list": [Makam.IRAQ],
				"ASHEAR NOTES 1936-1940": [Makam.SABA],
				"Argentina 1947 & Ezra Mishanieh": [Makam.IRAQ],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.SABA],
				"GABRIEL A SHREM 1964 SUHV": [Makam.SABA],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.RAST],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.SABA],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.SABA],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.SABA],
				"Yishaq Yeranen Halabi": [Makam.SABA],
				"MOSHE AMASH (Shami)": [Makam.AJAM],
				"EZRA MASLATON TARAB (Shami)": [Makam.SIGAH],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.SIGAH],
				"Hallel VeZimrah, Greece List, 1926": [Makam.HIJAZ]
			},
			[Parsha.EMOR]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.ASHIRAN],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.ASHIRAN],
				"TEBELE Pre1888": [Makam.ASHIRAN],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.ASHIRAN, Makam.SABA],
				"YAAQOB ABADI-PARSIYA": [Makam.ASHIRAN],
				"YISHAQ YEQAR ARGENTINA": [Makam.ASHIRAN],
				"ADES: 24793": [Makam.ASHIRAN],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.ASHIRAN],
				"Knis Betesh Geniza List, Aleppo": [Makam.ASHIRAN],
				"ABRAHAM DWECK Pre1920": [Makam.SIGAH],
				"IDELSOHN Pre1923": [Makam.ASHIRAN],
				"S SAGIR Laniado": [Makam.ASHIRAN],
				"ASHEAR list": [Makam.ASHIRAN],
				"ASHEAR NOTES 1936-1940": [Makam.SIGAH, Makam.HOSENI],
				"Argentina 1947 & Ezra Mishanieh": [Makam.ASHIRAN],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.SIGAH, Makam.HOSENI],
				"GABRIEL A SHREM 1964 SUHV": [Makam.SIGAH, Makam.HOSENI],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.SIGAH],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.OJ],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.HOSENI],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.SIGAH],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.SIGAH, Makam.HOSENI],
				"Yishaq Yeranen Halabi": [Makam.SIGAH],
				"MOSHE AMASH (Shami)": [Makam.RAST],
				"EZRA MASLATON TARAB (Shami)": [Makam.RAST],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.RAST],
				"Hallel VeZimrah, Greece List, 1926": [Makam.BUSALIQ]
			},
			[Parsha.BEHAR]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.NAWAH],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.NAWAH],
				"TEBELE Pre1888": [Makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [Makam.NAWAH],
				"YISHAQ YEQAR ARGENTINA": [Makam.SABA],
				"ADES: 24793": [Makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.NAWAH],
				"Knis Betesh Geniza List, Aleppo": [Makam.NAWAH],
				"ABRAHAM DWECK Pre1920": [Makam.NAWAH],
				"IDELSOHN Pre1923": [Makam.NAWAH],
				"S SAGIR Laniado": [Makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.SABA],
				"ASHEAR NOTES 1936-1940": [Makam.NAWAH],
				"ABRAHAM E SHREM ~1945": [Makam.SABA],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.NAWAH],
				"GABRIEL A SHREM 1964 SUHV": [Makam.NAWAH, Makam.SABA],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.BAYAT],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.NAHWAND],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.NAWAH],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.NAWAH],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.NAWAH, Makam.SABA],
				"Yishaq Yeranen Halabi": [Makam.NAWAH],
				"MOSHE AMASH (Shami)": [Makam.SIGAH],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.AJAM],
				"Hallel VeZimrah, Greece List, 1926": ["Qargigar"]
			},
			[Parsha.BECHUKOSAI]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.NAWAH],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.NAWAH],
				"TEBELE Pre1888": [Makam.NAWAH],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [Makam.NAWAH],
				"YISHAQ YEQAR ARGENTINA": [Makam.NAWAH],
				"ADES: 24793": [Makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.RAHAWI],
				"Knis Betesh Geniza List, Aleppo": [Makam.BAYAT],
				"IDELSOHN Pre1923": [Makam.NAWAH, Makam.BAYAT],
				"S SAGIR Laniado": [Makam.NAHWAND],
				"ASHEAR list": [Makam.NAWAH],
				"Argentina 1947 & Ezra Mishanieh": [Makam.NAHWAND],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.BAYAT],
				"GABRIEL A SHREM 1964 SUHV": [Makam.NAHWAND], // Original pizmonim.com: Nawah/Nahwand
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.NAHWAND],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.KURD],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.SABA],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.RAST],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.NAWAH, Makam.BAYAT],
				"Yishaq Yeranen Halabi": [Makam.BAYAT],
				"MOSHE AMASH (Shami)": [Makam.BAYAT],
				"EZRA MASLATON TARAB (Shami)": [Makam.AJAM],
				"Hallel VeZimrah, Greece List, 1926": [Makam.IRAQ]
			},
			[Parsha.BAMIDBAR]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.MEHAYAR],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.MEHAYAR],
				"TEBELE Pre1888": [Makam.MEHAYAR],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [Makam.RAST],
				"YISHAQ YEQAR ARGENTINA": [Makam.RAST],
				"ADES: 24793": [Makam.MEHAYAR],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.MEHAYAR, Makam.RAST],
				"Knis Betesh Geniza List, Aleppo": [Makam.RAST],
				"IDELSOHN Pre1923": [Makam.MEHAYAR],
				"S SAGIR Laniado": [Makam.RAST],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.RAST],
				"ASHEAR list": [Makam.MEHAYAR],
				"ASHEAR NOTES 1936-1940": [Makam.HOSENI, Makam.RAST],
				"ABRAHAM E SHREM ~1945": [Makam.RAST],
				"Argentina 1947 & Ezra Mishanieh": [Makam.MEHAYAR],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.SABA, Makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [Makam.RAST],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.RAST],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.RAST],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.RAST],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.HOSENI, Makam.RAST],
				"Yishaq Yeranen Halabi": [Makam.BAYAT],
				"MOSHE AMASH (Shami)": [Makam.RAST, Makam.AJAM],
				"EZRA MASLATON TARAB (Shami)": [Makam.RAST],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.RAST],
				//"Hallel VeZimrah, Greece List, 1926": "Haqqordo?"
			},
			[Parsha.NASSO]: fillMakamTable(makamHeaders.bamidbar
					.filter(book => book !== "M H Elias, SHIR HADASH, Jerusalem, 1930"),
				[Makam.SABA],
				{
					"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.HOSENI, Makam.SABA],
					"GABRIEL A SHREM 1964 SUHV": [Makam.RAST, Makam.SABA], // Original Pizmonim.com: Saba
					"YOSEF YEHEZKEL Jerusalem 1975": [Makam.ZANGIRAN],
					"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.HOSENI],
					"BOZO, Ades, Shir Ushbaha 2005": [Makam.SABA, Makam.RAST],
					"Yishaq Yeranen Halabi": [Makam.HOSENI, Makam.SABA],
					"MOSHE AMASH (Shami)": [Makam.SIGAH],
					"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
					"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
					"Hallel VeZimrah, Greece List, 1926": [Makam.HIJAZ]
				}),
			[Parsha.BEHAALOSCHA]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.HOSENI],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.OJ],
				"TEBELE Pre1888": [Makam.SIGAH],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.SIGAH, Makam.HOSENI],
				"YAAQOB ABADI-PARSIYA": [Makam.SIGAH],
				"YISHAQ YEQAR ARGENTINA": [Makam.SIGAH],
				"ADES: 24793": [Makam.OJ],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.HOSENI],
				"Knis Betesh Geniza List, Aleppo": [Makam.SIGAH],
				"ABRAHAM DWECK Pre1920": [Makam.SIGAH],
				"IDELSOHN Pre1923": [Makam.SIGAH],
				"S SAGIR Laniado": [Makam.SIGAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.SIGAH],
				"ASHEAR list": [Makam.SIGAH],
				"ASHEAR NOTES 1936-1940": [Makam.SIGAH],
				"ABRAHAM E SHREM ~1945": [Makam.SIGAH],
				"Argentina 1947 & Ezra Mishanieh": [Makam.SIGAH],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.SIGAH],
				"GABRIEL A SHREM 1964 SUHV": [Makam.SIGAH],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.SIGAH],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.SIGAH],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.SIGAH],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.SIGAH],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.SIGAH],
				"Yishaq Yeranen Halabi": [Makam.SIGAH],
				"MOSHE AMASH (Shami)": [Makam.NAWAH],
				"EZRA MASLATON TARAB (Shami)": [Makam.RAHAWI],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.NAWAH],
				// "Hallel VeZimrah, Greece List, 1926": "Ushaq"
			},
			[Parsha.SHLACH]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.IRAQ, Makam.NAWAH],
				"TEBELE Pre1888": [Makam.IRAQ],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.IRAQ, Makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [Makam.NAWAH],
				"YISHAQ YEQAR ARGENTINA": [Makam.HIJAZ],
				"ADES: 24793": [Makam.IRAQ, Makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.IRAQ],
				"Knis Betesh Geniza List, Aleppo": [Makam.IRAQ],
				"ABRAHAM DWECK Pre1920": [Makam.HIJAZ],
				"IDELSOHN Pre1923": [Makam.IRAQ],
				"S SAGIR Laniado": [Makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.HIJAZ],
				"ASHEAR list": [Makam.IRAQ],
				"ASHEAR NOTES 1936-1940": [Makam.HIJAZ],
				"ABRAHAM E SHREM ~1945": [Makam.HIJAZ],
				"Argentina 1947 & Ezra Mishanieh": [Makam.IRAQ],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.IRAQ, Makam.NAWAH],
				"GABRIEL A SHREM 1964 SUHV": [Makam.HIJAZ],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.NAHWAND],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.SHURI],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.NAWAH],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.NAHWAND],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.HIJAZ, Makam.NAHWAND],
				"Yishaq Yeranen Halabi": [Makam.NAHWAND],
				"MOSHE AMASH (Shami)": [Makam.SABA],
				"EZRA MASLATON TARAB (Shami)": [Makam.SABA],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.SABA],
				"Hallel VeZimrah, Greece List, 1926": [Makam.HUZAM]
			},
			[Parsha.KORACH]: {
				//"TABBUSH Ms NLI 8*7622, Aleppo": "Ḥoseni combined",
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.HOSENI],
				"TEBELE Pre1888": [Makam.HOSENI],
				//"ELIE SHAUL COHEN FROM AINTAB, ~1880": "Ḥoseni Bayat combined",
				"YAAQOB ABADI-PARSIYA": [Makam.HOSENI],
				"YISHAQ YEQAR ARGENTINA": [Makam.HOSENI],
				"ADES: 24793": [Makam.HOSENI],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.HOSENI],
				//"Knis Betesh Geniza List, Aleppo": "Ḥoseni combined",
				//"ABRAHAM DWECK Pre1920": "Ḥoseni combined",
				"IDELSOHN Pre1923": [Makam.HOSENI],
				"S SAGIR Laniado": [Makam.HOSENI],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.HOSENI],
				"ASHEAR list": [Makam.HOSENI],
				"ASHEAR NOTES 1936-1940": [Makam.BAYAT],
				"ABRAHAM E SHREM ~1945": [Makam.NAHWAND],
				"Argentina 1947 & Ezra Mishanieh": [Makam.HOSENI],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.HOSENI],
				"GABRIEL A SHREM 1964 SUHV": [Makam.NAHWAND],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.BAYAT],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.HOSENI],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.NAHWAND],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.NAHWAND, Makam.HOSENI],
				"Yishaq Yeranen Halabi": [Makam.HOSENI],
				"MOSHE AMASH (Shami)": [Makam.BAYAT],
				"EZRA MASLATON TARAB (Shami)": [Makam.SIGAH],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.SIGAH],
				"Hallel VeZimrah, Greece List, 1926": [Makam.IRAQ]
			},
			[Parsha.CHUKAS]: {
				//"TABBUSH Ms NLI 8*7622, Aleppo": "Ḥoseni combined",
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.HOSENI],
				"TEBELE Pre1888": [Makam.HOSENI],
				"YAAQOB ABADI-PARSIYA": [Makam.BAYAT],
				"ADES: 24793": [Makam.HOSENI],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.RAST],
				"IDELSOHN Pre1923": [Makam.RAST],
				"S SAGIR Laniado": [Makam.MAHOUR],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.ASHIRAN],
				"ASHEAR NOTES 1936-1940": [Makam.BAYAT],
				"ABRAHAM E SHREM ~1945": [Makam.HOSENI],
				"Argentina 1947 & Ezra Mishanieh": [Makam.HOSENI],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [Makam.HOSENI],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.AJAM],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.RAST],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.RAST, Makam.HOSENI],
				"Yishaq Yeranen Halabi": [Makam.RAST],
				"MOSHE AMASH (Shami)": [Makam.AJAM],
				"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.AJAM],
				"Hallel VeZimrah, Greece List, 1926": [Makam.SUZNIQ]
			},
			[Parsha.BALAK]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.BAYAT],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.BAYAT],
				"TEBELE Pre1888": [Makam.BAYAT],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.BAYAT],
				"YISHAQ YEQAR ARGENTINA": [Makam.RAST],
				"ADES: 24793": [Makam.BAYAT],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.BAYAT],
				"Knis Betesh Geniza List, Aleppo": [Makam.BAYAT],
				"ABRAHAM DWECK Pre1920": [Makam.BAYAT],
				"IDELSOHN Pre1923": [Makam.BAYAT],
				"S SAGIR Laniado": [Makam.BAYAT],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.RAST],
				"ASHEAR list": [Makam.NAHWAND],
				"ASHEAR NOTES 1936-1940": [Makam.NAHWAND],
				"ABRAHAM E SHREM ~1945": [Makam.MAHOUR],
				"Argentina 1947 & Ezra Mishanieh": [Makam.NAHWAND],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.BAYAT],
				"GABRIEL A SHREM 1964 SUHV": [Makam.MAHOUR],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.BAYAT],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.BAYAT],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.RAST],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.BAYAT, Makam.MAHOUR],
				"Yishaq Yeranen Halabi": [Makam.BAYAT],
				"MOSHE AMASH (Shami)": [Makam.SIGAH],
				"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
				"Hallel VeZimrah, Greece List, 1926": [Makam.SIGAH]
			},
			[Parsha.PINCHAS]: fillMakamTable(makamHeaders.bamidbar,
				[Makam.SABA],
				{
					"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.BAYAT],
					"ASHEAR NOTES 1936-1940": [Makam.SABA, Makam.BAYAT],
					"YOSEF YEHEZKEL Jerusalem 1975": [Makam.BUSTANIGAR],
					"Hallel VeZimrah, Greece List, 1926": [Makam.MUHAYER]
				}),
			[Parsha.MATOS]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.NAWAH],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.NAWAH],
				"TEBELE Pre1888": [Makam.NAWAH],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [Makam.NAWAH],
				"YISHAQ YEQAR ARGENTINA": [Makam.BAYAT],
				"ADES: 24793": [Makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.NAWAH],
				"Knis Betesh Geniza List, Aleppo": [Makam.NAWAH],
				"ABRAHAM DWECK Pre1920": [Makam.NAWAH],
				"IDELSOHN Pre1923": [Makam.NAWAH],
				"S SAGIR Laniado": [Makam.NAWAH, Makam.NAHWAND],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.RAHAWI],
				"ASHEAR list": [Makam.NAWAH],
				"ASHEAR NOTES 1936-1940": [Makam.BAYAT],
				"ABRAHAM E SHREM ~1945": [Makam.NAHWAND],
				"Argentina 1947 & Ezra Mishanieh": [Makam.NAHWAND],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.NAWAH],
				"GABRIEL A SHREM 1964 SUHV": [Makam.RAHAWI, Makam.NAHWAND],// Pizmonim.com[Makam.NAWAH, Makam.NAHWAND],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.SABA],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.NAHWAND],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.SABA],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.NAWAH],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.NAWAH, Makam.NAHWAND],
				"Yishaq Yeranen Halabi": [Makam.NAWAH],
				"MOSHE AMASH (Shami)": [Makam.RAST],
				"EZRA MASLATON TARAB (Shami)": [Makam.MAHOUR],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
				"Hallel VeZimrah, Greece List, 1926": [Makam.SABA]
			},
			[Parsha.MASEI]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.SABA],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.SABA],
				"TEBELE Pre1888": [Makam.SABA],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.SABA],
				"YAAQOB ABADI-PARSIYA": [Makam.NAHWAND],
				"YISHAQ YEQAR ARGENTINA": [Makam.NAHWAND],
				"ADES: 24793": [Makam.SABA],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.MEHAYAR],
				"Knis Betesh Geniza List, Aleppo": [Makam.SABA],
				"IDELSOHN Pre1923": [Makam.SABA],
				"S SAGIR Laniado": [Makam.NAWAH, Makam.NAHWAND],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.SABA],
				"ASHEAR list": [Makam.SABA],
				"ASHEAR NOTES 1936-1940": [Makam.NAWAH],
				"ABRAHAM E SHREM ~1945": [Makam.SABA],
				"Argentina 1947 & Ezra Mishanieh": [Makam.SABA],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.SABA],
				"GABRIEL A SHREM 1964 SUHV": [Makam.SABA],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.NAHWAND],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.SABA, Makam.ISFAHAN],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.NAHWAND],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.NAHWAND],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.BAYAT, Makam.SABA],
				"Yishaq Yeranen Halabi": [Makam.SABA],
				"MOSHE AMASH (Shami)": [Makam.BAYAT],
				"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
				"Hallel VeZimrah, Greece List, 1926": [Makam.NAHWAND]
			},
			[Parsha.DEVARIM]: fillMakamTable(makamHeaders.devarim, [Makam.HIJAZ],
			{
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.ZANGIRAN],
				"Hallel VeZimrah, Greece List, 1926": [Makam.AJAM]
			}),
			[Parsha.VAESCHANAN]: fillMakamTable(makamHeaders.devarim,
				[Makam.HOSENI],
				{
					"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.HOSENI, Makam.ASHIRAN],
					"Knis Betesh Geniza List, Aleppo": [Makam.ASHIRAN],
					"ABRAHAM DWECK Pre1920": [Makam.ASHIRAN],
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.BAYAT],
					"Shaare Zimra YANANI Buenos Aires, 01": [Makam.BAYAT],
					"MOSHE AMASH (Shami)": [Makam.RAST],
					"EZRA MASLATON TARAB (Shami)": [Makam.RAST],
					"ABRAHAM SHAMRICHA (Shami)": [Makam.RAST],
					"Hallel VeZimrah, Greece List, 1926": [Makam.RAST]
				}),
			[Parsha.EIKEV]: fillMakamTable(
				makamHeaders.devarim.filter(book => book !== "TABBUSH Ms NLI 8*7622, Aleppo"),
				[Makam.SIGAH],
				{
					"YISHAQ YEQAR ARGENTINA": [Makam.RAST],
					"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.RAST],
					"ASHEAR NOTES 1936-1940": [Makam.SIGAH, Makam.IRAQ],
					"Shaare Zimra YANANI Buenos Aires, 01": [Makam.RAST],
					"BOZO, Ades, Shir Ushbaha 2005": [Makam.SIGAH, Makam.IRAQ],
					"Hallel VeZimrah, Greece List, 1926": [Makam.QARGIGAR]
				}),
			[Parsha.REEH]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.IRAQ, Makam.RAST],
				"TEBELE Pre1888": [Makam.ASHIRAN],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.IRAQ],
				"YAAQOB ABADI-PARSIYA": [Makam.RAST],
				"YISHAQ YEQAR ARGENTINA": [Makam.ASHIRAN],
				"ADES: 24793": [Makam.IRAQ],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.IRAQ],
				"Knis Betesh Geniza List, Aleppo": [Makam.SABA],
				"ABRAHAM DWECK Pre1920": [Makam.SABA],
				"IDELSOHN Pre1923": [Makam.IRAQ],
				"S SAGIR Laniado": [Makam.NAHWAND],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.NAWAH],
				"ASHEAR list": [Makam.ASHIRAN],
				"ASHEAR NOTES 1936-1940": [Makam.BAYAT],
				"ABRAHAM E SHREM ~1945": [Makam.BAYAT],
				"Argentina 1947 & Ezra Mishanieh": [Makam.ASHIRAN],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.SIGAH, Makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [Makam.RAST],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.RAST],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.RAST],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.RAST],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.RAST],
				"Yishaq Yeranen Halabi": [Makam.RAST],
				"MOSHE AMASH (Shami)": [Makam.BAYAT],
				"EZRA MASLATON TARAB (Shami)": [Makam.NAWAH],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.NAWAH],
				"Hallel VeZimrah, Greece List, 1926": ["Ḥoseni"]
			},
			[Parsha.SHOFTIM]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.SABA],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.SABA, Makam.SIGAH],
				"TEBELE Pre1888": [Makam.SABA],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.SIGAH, Makam.SABA],
				"YAAQOB ABADI-PARSIYA": [Makam.SABA],
				"YISHAQ YEQAR ARGENTINA": [Makam.AJAM],
				"ADES: 24793": [Makam.SABA, Makam.SIGAH],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.SASGAR],
				"Knis Betesh Geniza List, Aleppo": [Makam.AJAM],
				"ABRAHAM DWECK Pre1920": [Makam.AJAM],
				"IDELSOHN Pre1923": [Makam.SIGAH],
				"S SAGIR Laniado": [Makam.AJAM],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.AJAM],
				"ASHEAR list": [Makam.SABA],
				"ASHEAR NOTES 1936-1940": [Makam.AJAM],
				"ABRAHAM E SHREM ~1945": [Makam.AJAM],
				"Argentina 1947 & Ezra Mishanieh": [Makam.SABA],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.SABA],
				"GABRIEL A SHREM 1964 SUHV": [Makam.AJAM],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.AJAM],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.GIRKA],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.SABA, Makam.AJAM],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.AJAM],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.SIGAH, Makam.AJAM],
				"Yishaq Yeranen Halabi": [Makam.AJAM],
				"MOSHE AMASH (Shami)": [Makam.AJAM],
				"EZRA MASLATON TARAB (Shami)": [Makam.AJAM],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.AJAM],
				"Hallel VeZimrah, Greece List, 1926": [Makam.HIJAZ]
			},
			[Parsha.KI_SEITZEI]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.SABA],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.SABA, Makam.RAST],
				"TEBELE Pre1888": [Makam.SABA],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.RAST, Makam.IRAQ, Makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [Makam.RAST],
				"YISHAQ YEQAR ARGENTINA": [Makam.SABA],
				"ADES: 24793": [Makam.SABA, Makam.RAST],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.SABA],
				"Knis Betesh Geniza List, Aleppo": [Makam.RAST],
				"ABRAHAM DWECK Pre1920": [Makam.NAHWAND],
				"IDELSOHN Pre1923": [Makam.SABA],
				"S SAGIR Laniado": [Makam.RAST],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.SABA],
				"ASHEAR list": [Makam.NAWAH],
				"ASHEAR NOTES 1936-1940": [Makam.SABA, Makam.SIGAH],
				"ABRAHAM E SHREM ~1945": [Makam.SABA],
				"Argentina 1947 & Ezra Mishanieh": [Makam.NAHWAND],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [Makam.SABA],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.SABA],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.BAYAT, Makam.AJAM],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.RAST],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.SABA],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.SABA],
				"Yishaq Yeranen Halabi": [Makam.SABA],
				"MOSHE AMASH (Shami)": [Makam.SIGAH],
				"EZRA MASLATON TARAB (Shami)": [Makam.SIGAH],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.SIGAH],
				"Hallel VeZimrah, Greece List, 1926": [Makam.BAYATI]
			},
			[Parsha.KI_SAVO]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.IRAQ],
				"TEBELE Pre1888": [Makam.IRAQ],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.IRAQ],
				"YAAQOB ABADI-PARSIYA": [Makam.IRAQ],
				"YISHAQ YEQAR ARGENTINA": [Makam.NAWAH],
				"ADES: 24793": [Makam.IRAQ],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.IRAQ],
				"Knis Betesh Geniza List, Aleppo": [Makam.IRAQ],
				"ABRAHAM DWECK Pre1920": [Makam.RAST],
				"IDELSOHN Pre1923": [Makam.IRAQ],
				"S SAGIR Laniado": [Makam.SIGAH],
				"ASHEAR list": [Makam.IRAQ],
				"ASHEAR NOTES 1936-1940": [Makam.NAWAH, Makam.SABA, Makam.SIGAH],
				"ABRAHAM E SHREM ~1945": [Makam.SIGAH],
				"Argentina 1947 & Ezra Mishanieh": [Makam.IRAQ],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.SIGAH],
				"GABRIEL A SHREM 1964 SUHV": [Makam.SIGAH],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.SIGAH],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.OJ],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.HIJAZ],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.SIGAH],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.SIGAH, Makam.IRAQ],
				"Yishaq Yeranen Halabi": [Makam.SIGAH],
				"MOSHE AMASH (Shami)": [Makam.SABA],
				"EZRA MASLATON TARAB (Shami)": [Makam.SABA],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
				"Hallel VeZimrah, Greece List, 1926": ["Sigah"]
			},
			[Parsha.NITZAVIM]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.NAWAH],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.NAWAH],
				"TEBELE Pre1888": [Makam.NAWAH],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [Makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [Makam.NAWAH],
				"YISHAQ YEQAR ARGENTINA": [Makam.RAST],
				"ADES: 24793": [Makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.NAWAH],
				"Knis Betesh Geniza List, Aleppo": [Makam.NAWAH],
				"ABRAHAM DWECK Pre1920": [Makam.HIJAZ],
				"IDELSOHN Pre1923": [Makam.NAWAH],
				"S SAGIR Laniado": [Makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.RAST],
				"ASHEAR list": [Makam.NAWAH],
				//"ASHEAR NOTES 1936-1940": "Ḥijaz, H/H",
				"ABRAHAM E SHREM ~1945": [Makam.NAHWAND],
				"Argentina 1947 & Ezra Mishanieh": [Makam.NAHWAND],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.NAWAH],
				"GABRIEL A SHREM 1964 SUHV": [Makam.NAHWAND], //Original Pizmonim.com: ["Nawa", Makam.NAHWAND],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.RAST],
				"YOSEF YEHEZKEL Jerusalem 1975": [Makam.RAST],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.NAHWAND],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.NAWAH, Makam.NAHWAND],
				"Yishaq Yeranen Halabi": [Makam.NAWAH],
				"MOSHE AMASH (Shami)": [Makam.AJAM],
				"EZRA MASLATON TARAB (Shami)": [Makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.SIGAH],
				"Hallel VeZimrah, Greece List, 1926": [Makam.SABA]
			},
			[Parsha.VAYEILECH]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [Makam.NAWAH],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [Makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [Makam.RAST],
				"YISHAQ YEQAR ARGENTINA": [Makam.HIJAZ],
				"ADES: 24793": [Makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [Makam.NAWAH],
				"S SAGIR Laniado": [Makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [Makam.HOSENI],
				"ASHEAR NOTES 1936-1940": [Makam.HOSENI],
				"ABRAHAM E SHREM ~1945": [Makam.BAYAT, Makam.HOSENI],
				"Argentina 1947 & Ezra Mishanieh": [Makam.AJAM],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [Makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [Makam.HOSENI],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.BAYAT],
				"Ish Massliah \"Abia Renanot\" Tunisians": [Makam.RAST],
				"Shaare Zimra YANANI Buenos Aires, 01": [Makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [Makam.RAST, Makam.HOSENI],
				"Yishaq Yeranen Halabi": [Makam.RAST],
				"MOSHE AMASH (Shami)": [Makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [Makam.AJAM],
				"Hallel VeZimrah, Greece List, 1926": [Makam.HOSENI]
			},
			[Parsha.HAAZINU]: fillMakamTable(
				makamHeaders.devarim
					.filter(book => !["M H Elias, SHIR HADASH, Jerusalem, 1930", "ASHEAR NOTES 1936-1940"].includes(book)),
				[Makam.HOSENI],
				{
					"S SAGIR Laniado": [Makam.BAYAT],
					"ABRAHAM E SHREM ~1945": [Makam.BAYAT],
					"GABRIEL A SHREM 1964 SUHV": [Makam.MEHAYAR],
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [Makam.BAYAT],
					"YOSEF YEHEZKEL Jerusalem 1975": [Makam.SHURI],
					"Shaare Zimra YANANI Buenos Aires, 01": [Makam.BAYAT],
					"BOZO, Ades, Shir Ushbaha 2005": [Makam.HOSENI, Makam.MEHAYAR],
					"MOSHE AMASH (Shami)": [Makam.AJAM],
					"EZRA MASLATON TARAB (Shami)": [Makam.AJAM],
					"ABRAHAM SHAMRICHA (Shami)": [Makam.BAYAT],
					"Hallel VeZimrah, Greece List, 1926": [Makam.NAHWAND]
				})
			// Parsha.VZOS_HABERACHA is unused
		}

		data[Parsha.VAYAKHEL_PEKUDEI] = {
			...data[Parsha.VAYAKHEL],
			"GABRIEL A SHREM 1964 SUHV": [Makam.BAYAT]
		}
		data[Parsha.TAZRIA_METZORA] = {
			...data[Parsha.TAZRIA],
			"GABRIEL A SHREM 1964 SUHV": [Makam.SABA]
		}
		data[Parsha.ACHREI_MOS_KEDOSHIM] = {
			...data[Parsha.ACHREI_MOS],
			"GABRIEL A SHREM 1964 SUHV": [Makam.BAYAT, Makam.HIJAZ]
		}
		data[Parsha.BEHAR_BECHUKOSAI] = {
			...data[Parsha.BEHAR],
			"GABRIEL A SHREM 1964 SUHV": [Makam.SABA]
			// https://pizmonim.com/weekly.php?parasha=behar says when they are combined to do some other things
			// However, he prefaces them with 2020, and the actual Sefarim say otherwise. Curious as to why
		}
		data[Parsha.CHUKAS_BALAK] = {
			...data[Parsha.CHUKAS],
			"GABRIEL A SHREM 1964 SUHV": [Makam.HOSENI]
		}
		data[Parsha.MATOS_MASEI] = {
			...data[Parsha.MATOS],
			"GABRIEL A SHREM 1964 SUHV": [Makam.SABA]
		}
		data[Parsha.NITZAVIM_VAYEILECH] = {
			...data[Parsha.NITZAVIM],
			"GABRIEL A SHREM 1964 SUHV": [Makam.HOSENI]
		}

		if (jCal.getJewishMonth() == JewishCalendar.TISHREI && jCal.getJewishDayOfMonth() > 10) {
			data[Parsha.HAAZINU]!["ASHEAR NOTES 1936-1940"] = [Makam.HOSENI]
		}

		if (jCal.getDayOfWeek() === Calendar.SATURDAY) {
			let shavuotInUpcoming = false;
			let restoreDate = jCal.getDate();
			for (let i = 1; i <= 7; i++) {
				jCal.forward(Calendar.DATE, 1);
				if (jCal.isShavuos()) {
					shavuotInUpcoming = true;
					break;
				}
			}
			jCal.setDate(restoreDate);

			if (shavuotInUpcoming)
				data[jCal.getParshah()]!["GABRIEL A SHREM 1964 SUHV"] = [Makam.HOSENI];

			if (jCal.getSpecialShabbos() == Parsha.HAGADOL) {
				data[jCal.getParshah()]!["GABRIEL A SHREM 1964 SUHV"] = [Makam.RAHAWI];
			}

			return data[jCal.getParshah()]!
		}

		if (jCal.getDayOfChanukah() !== -1) {
			return {
				1: {
					"SASSOON #647 Aleppo, 1850": [Makam.RAHAWI],
					"GABRIEL A SHREM 1964 SUHV": [Makam.RAHAWI],
					"ABRAHAM SHAMRICHA (Shami)": [Makam.NAWAH]
				},
				2: {
					"SASSOON #647 Aleppo, 1850": [Makam.IRAQ],
					"GABRIEL A SHREM 1964 SUHV": [Makam.IRAQ]
				},
				3: {
					"SASSOON #647 Aleppo, 1850": [Makam.SIGAH],
					"GABRIEL A SHREM 1964 SUHV": [Makam.SIGAH]
				},
				4: {
					"SASSOON #647 Aleppo, 1850": [Makam.SABA],
					"GABRIEL A SHREM 1964 SUHV": [Makam.SABA]
				},
				5: {
					"SASSOON #647 Aleppo, 1850": [Makam.RAST],
					"GABRIEL A SHREM 1964 SUHV": [Makam.RAST]
				},
				6: {
					"GABRIEL A SHREM 1964 SUHV": [Makam.NAHWAND]
				},
				7: {
					"GABRIEL A SHREM 1964 SUHV": [Makam.SIGAH]
				},
				8: {
					"GABRIEL A SHREM 1964 SUHV": [Makam.BAYAT]
				},
				[-1]: {}
			}[jCal.getDayOfChanukah()]
		}

		return {}
	}
}

function findDuplicate<T>(arr:T[]):T[] {
	const map = arr.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map<T, number>());
	let sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));

	return sortedMap.keys().filter(k => sortedMap.get(k) == sortedMap.values().next().value).toArray();
}

function fillMakamTable(table:string[], makam:(Makam|string)[], exceptions:getMaqamReturnType):getMaqamReturnType {
	return Object.assign(Object.fromEntries(table.map(book => [book, makam])), exceptions);
}