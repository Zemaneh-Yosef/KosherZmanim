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

enum makam {
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
type getMaqamReturnType = Partial<Record<Unpacked<typeof entries>, (makam|string)[]>>

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
							"Eliahou Yaaqob DWECK-KESAR": [makam.HOSENI],
							"YISHAQ YEQAR ARGENTINA": [makam.HIJAZ],
							"IDELSOHN Pre1923": [makam.SABA],
						}
					else 
						return {
							"Eliahou Yaaqob DWECK-KESAR": [makam.HOSENI],
							"YISHAQ YEQAR ARGENTINA": [makam.HIJAZ],
							"IDELSOHN Pre1923": [makam.BAYAT]
						}
					break;
				case JewishCalendar.YOM_KIPPUR:
					return {
						"Eliahou Yaaqob DWECK-KESAR": [makam.HIJAZ, makam.HOSENI],
						"YISHAQ YEQAR ARGENTINA": [makam.HIJAZ],
						"IDELSOHN Pre1923": [makam.HIJAZ]
					};
					break;
				case JewishCalendar.SUCCOS:
					if (jCal.getJewishDayOfMonth() == 15)
						return {
							"SASSOON #647 Aleppo, 1850": [makam.SIGAH],
							"Eliahou Yaaqob DWECK-KESAR": [makam.SIGAH],
							"YAAQOB ABADI-PARSIYA": [makam.SIGAH],
							"YISHAQ YEQAR ARGENTINA": [makam.SIGAH],
							"ABRAHAM DWECK Pre1920": [makam.SIGAH],
							"IDELSOHN Pre1923": [makam.SIGAH],
							"S SAGIR Laniado": [makam.SIGAH],
							"ASHEAR list": [makam.SIGAH],
							"ASHEAR NOTES 1936-1940": [makam.SIGAH],
							"ABRAHAM E SHREM ~1945": [makam.SIGAH],
							"Argentina 1947 & Ezra Mishanieh": [makam.SIGAH],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.SIGAH],
							"GABRIEL A SHREM 1964 SUHV": [makam.SIGAH],
							"YOSEF YEHEZKEL Jerusalem 1975": [makam.AJAM],
							"Ish Massliah \"Abia Renanot\" Tunisians": [makam.SIGAH],
							"Shaare Zimra YANANI Buenos Aires, 01": [makam.SIGAH],
							"BOZO, Ades, Shir Ushbaha 2005": [makam.SIGAH],
							"MOSHE AMASH (Shami)": [makam.RAST],
							"EZRA MASLATON TARAB (Shami)": [makam.RAST],
							"ABRAHAM SHAMRICHA (Shami)": [makam.RAST],
							"Hallel VeZimrah, Greece List, 1926": [makam.SIGAH]
						}
					else
						return {
							"SASSOON #647 Aleppo, 1850": [makam.SASGAR],
							"Eliahou Yaaqob DWECK-KESAR": [makam.AJAM],
							"YAAQOB ABADI-PARSIYA": [makam.SASGAR],
							"YISHAQ YEQAR ARGENTINA": [makam.AJAM],
							"ABRAHAM DWECK Pre1920": [makam.SASGAR],
							"S SAGIR Laniado": [makam.AJAM],
							"ASHEAR list": [makam.AJAM],
							"ASHEAR NOTES 1936-1940": [makam.AJAM],
							"ABRAHAM E SHREM ~1945": [makam.AJAM],
							"Argentina 1947 & Ezra Mishanieh": [makam.AJAM],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.AJAM],
							"GABRIEL A SHREM 1964 SUHV": [makam.AJAM],
							"Ish Massliah \"Abia Renanot\" Tunisians": [makam.AJAM],
							"Shaare Zimra YANANI Buenos Aires, 01": [makam.AJAM],
							"BOZO, Ades, Shir Ushbaha 2005": [makam.AJAM],
							"MOSHE AMASH (Shami)": [makam.SIGAH],
							"EZRA MASLATON TARAB (Shami)": [makam.SIGAH],
							"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
							"Hallel VeZimrah, Greece List, 1926": [makam.RAST]
						}
					break;
				case JewishCalendar.CHOL_HAMOED_SUCCOS:
					const sukkotHHreturnData = {
						16: {
							"SASSOON #647 Aleppo, 1850": [makam.SASGAR],
							"Eliahou Yaaqob DWECK-KESAR": [makam.AJAM],
							"YAAQOB ABADI-PARSIYA": [makam.SASGAR],
							"YISHAQ YEQAR ARGENTINA": [makam.AJAM],
							"ABRAHAM DWECK Pre1920": [makam.SASGAR],
							"S SAGIR Laniado": [makam.AJAM],
							"ASHEAR list": [makam.AJAM],
							"ASHEAR NOTES 1936-1940": [makam.AJAM],
							"ABRAHAM E SHREM ~1945": [makam.AJAM],
							"Argentina 1947 & Ezra Mishanieh": [makam.AJAM],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.AJAM],
							"GABRIEL A SHREM 1964 SUHV": [makam.AJAM],
							"Ish Massliah \"Abia Renanot\" Tunisians": [makam.AJAM],
							"Shaare Zimra YANANI Buenos Aires, 01": [makam.AJAM],
							"BOZO, Ades, Shir Ushbaha 2005": [makam.AJAM],
							"MOSHE AMASH (Shami)": [makam.SIGAH],
							"EZRA MASLATON TARAB (Shami)": [makam.SIGAH],
							"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
							"Hallel VeZimrah, Greece List, 1926": [makam.RAST]
						}, // Day 2 of Diaspora, but 1st day Hol Hamoed Israel
						17: {
							"SASSOON #647 Aleppo, 1850": [makam.IRAQ],
							"Eliahou Yaaqob DWECK-KESAR": [makam.SABA],
							"YAAQOB ABADI-PARSIYA": [makam.IRAQ],
							"YISHAQ YEQAR ARGENTINA": [makam.SABA],
							"ASHEAR list": [makam.IRAQ],
							"ASHEAR NOTES 1936-1940": [makam.IRAQ],
							"Argentina 1947 & Ezra Mishanieh": [makam.IRAQ],
							"GABRIEL A SHREM 1964 SUHV": [makam.IRAQ]
						},
						18: {
							"SASSOON #647 Aleppo, 1850": [makam.SABA],
							"Eliahou Yaaqob DWECK-KESAR": [makam.BAYAT],
							"YAAQOB ABADI-PARSIYA": [makam.SABA],
							"YISHAQ YEQAR ARGENTINA": [makam.RAST],
							"ASHEAR list": [makam.RAST],
							"ASHEAR NOTES 1936-1940": [makam.RAST],
							"Argentina 1947 & Ezra Mishanieh": [makam.RAST],
							"GABRIEL A SHREM 1964 SUHV": [makam.RAST]
						},
						19: {
							"SASSOON #647 Aleppo, 1850": [makam.RAST],
							"Eliahou Yaaqob DWECK-KESAR": [makam.RAST],
							"YAAQOB ABADI-PARSIYA": [makam.RAST],
							"YISHAQ YEQAR ARGENTINA": [makam.BAYAT],
							"ASHEAR list": [makam.NAWAH],
							"ASHEAR NOTES 1936-1940": [makam.NAWAH],
							"Argentina 1947 & Ezra Mishanieh": [makam.NAHWAND],
							"GABRIEL A SHREM 1964 SUHV": [makam.NAHWAND]
						},
						20: {
							"SASSOON #647 Aleppo, 1850": [makam.HOSENI],
							"Eliahou Yaaqob DWECK-KESAR": [makam.NAWAH],
							"YAAQOB ABADI-PARSIYA": [makam.HOSENI],
							"YISHAQ YEQAR ARGENTINA": [makam.HOSENI],
							"ASHEAR list": [makam.BAYAT],
							"ASHEAR NOTES 1936-1940": [makam.BAYAT],
							"Argentina 1947 & Ezra Mishanieh": [makam.BAYAT],
							"GABRIEL A SHREM 1964 SUHV": [makam.HOSENI]
						}
					}[jCal.getJewishDayOfMonth()]!;

					if (jCal.getDayOfWeek() == Calendar.SATURDAY)
						Object.assign(sukkotHHreturnData,{
							"Eliahou Yaaqob DWECK-KESAR": [makam.ASHIRAN],
							"ASHEAR NOTES 1936-1940": [makam.MAHOUR],
							"ABRAHAM E SHREM ~1945": [makam.BAYAT],
							"GABRIEL A SHREM 1964 SUHV": [makam.BAYAT],
							"BOZO, Ades, Shir Ushbaha 2005": [makam.BAYAT],
							"MOSHE AMASH (Shami)": [makam.SABA],
							"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
							"Hallel VeZimrah, Greece List, 1926": ["Bustanigar"]
						});

					return sukkotHHreturnData;
					break;
				case JewishCalendar.HOSHANA_RABBA:
					return {
						"Eliahou Yaaqob DWECK-KESAR": [makam.HOSENI],
						"YAAQOB ABADI-PARSIYA": [makam.SABA],
						"YISHAQ YEQAR ARGENTINA": [makam.ASHIRAN],
						"ASHEAR list": [makam.MEHAYAR],
						"ASHEAR NOTES 1936-1940": [makam.MEHAYAR],
						"Argentina 1947 & Ezra Mishanieh": [makam.MEHAYAR]
					}
				case JewishCalendar.SHEMINI_ATZERES:
					if (!jCal.getInIsrael()) {
						return {
							"SASSOON #647 Aleppo, 1850": [makam.AJAM],
							"Eliahou Yaaqob DWECK-KESAR": [makam.ASHIRAN],
							"YAAQOB ABADI-PARSIYA": [makam.BAYAT],
							"ABRAHAM DWECK Pre1920": [makam.BAYAT],
							"ASHEAR list": [makam.AJAM],
							"ASHEAR NOTES 1936-1940": [makam.AJAM],
							"ABRAHAM E SHREM ~1945": [makam.SABA],
							"Argentina 1947 & Ezra Mishanieh": [makam.AJAM],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.HOSENI],
							"GABRIEL A SHREM 1964 SUHV": [makam.SABA, makam.SIGAH],
							"YOSEF YEHEZKEL Jerusalem 1975": [makam.RAST],
							"Ish Massliah \"Abia Renanot\" Tunisians": [makam.AJAM],
							"Shaare Zimra YANANI Buenos Aires, 01": [makam.SABA],
							"BOZO, Ades, Shir Ushbaha 2005": [makam.SABA, makam.SIGAH, makam.HOSENI],
							"MOSHE AMASH (Shami)": [makam.RAST],
							"EZRA MASLATON TARAB (Shami)": [makam.RAST],
							"ABRAHAM SHAMRICHA (Shami)": [makam.RAST],
							"Hallel VeZimrah, Greece List, 1926": [makam.HIJAZ_KAR]
						}
					} else {
						// This data is taken from the Parasha Page on VeZot Haberacha
						return {
							"TABBUSH Ms NLI 8*7622, Aleppo": [makam.AJAM],
							"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.AJAM],
							"TEBELE Pre1888": [makam.AJAM],
							"YAAQOB ABADI-PARSIYA": [makam.AJAM],
							"YISHAQ YEQAR ARGENTINA": [makam.AJAM],
							"ADES: 24793": [makam.AJAM],
							"Dibre Shelomo S KASSIN Pre1915": [makam.AJAM],
							"ABRAHAM DWECK Pre1920": [makam.AJAM],
							"IDELSOHN Pre1923": [makam.AJAM],
							"S SAGIR Laniado": [makam.AJAM],
							"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.AJAM],
							"ASHEAR list": [makam.AJAM],
							"ABRAHAM E SHREM ~1945": [makam.AJAM],
							"Argentina 1947 & Ezra Mishanieh": [makam.AJAM],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.AJAM],
							"GABRIEL A SHREM 1964 SUHV": [makam.AJAM],
							"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.AJAM],
							"YOSEF YEHEZKEL Jerusalem 1975": [makam.AJAM],
							"Ish Massliah \"Abia Renanot\" Tunisians": [makam.AJAM],
							"Shaare Zimra YANANI Buenos Aires, 01": [makam.AJAM],
							"BOZO, Ades, Shir Ushbaha 2005": [makam.AJAM],
							"Yishaq Yeranen Halabi": [makam.AJAM],
							"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT]
						}
					}
					break;
				case JewishCalendar.SIMCHAS_TORAH:
					// This data is taken from the Yom Tov Page
					return {
						"SASSOON #647 Aleppo, 1850": [makam.BAYAT],
						"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.AJAM],
						"Eliahou Yaaqob DWECK-KESAR": [makam.AJAM],
						"YAAQOB ABADI-PARSIYA": [makam.AJAM],
						"YISHAQ YEQAR ARGENTINA": [makam.AJAM],
						"ADES: 24793": [makam.AJAM],
						"Dibre Shelomo S KASSIN Pre1915": [makam.AJAM],
						"ABRAHAM DWECK Pre1920": [makam.AJAM],
						"IDELSOHN Pre1923": [makam.AJAM],
						"S SAGIR Laniado": [makam.AJAM],
						"ASHEAR list": [makam.SABA],
						"ASHEAR NOTES 1936-1940": [makam.SABA],
						"ABRAHAM E SHREM ~1945": [makam.AJAM],
						"Argentina 1947 & Ezra Mishanieh": [makam.SABA],
						"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.AJAM],
						"GABRIEL A SHREM 1964 SUHV": [makam.AJAM],
						"YOSEF YEHEZKEL Jerusalem 1975": [makam.GIRKA],
						"Ish Massliah \"Abia Renanot\" Tunisians": [makam.SIGAH],
						"Shaare Zimra YANANI Buenos Aires, 01": [makam.AJAM],
						"BOZO, Ades, Shir Ushbaha 2005": [makam.AJAM],
						"Yishaq Yeranen Halabi": [makam.AJAM],
						"MOSHE AMASH (Shami)": [makam.BAYAT],
						"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
						"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT]
					}
				case JewishCalendar.PURIM:
				case JewishCalendar.SHUSHAN_PURIM:
					return {
						"Eliahou Yaaqob DWECK-KESAR": [makam.OJ, makam.SABA],
						"IDELSOHN Pre1923": [makam.OJ, makam.SIGAH],
						"ASHEAR NOTES 1936-1940": [makam.SIGAH],
						"GABRIEL A SHREM 1964 SUHV":
							[(jCal.getYomTovIndex() == JewishCalendar.PURIM ? makam.OJ : makam.SIGAH)],
						"BOZO, Ades, Shir Ushbaha 2005": [makam.OJ, makam.SIGAH],
						"MOSHE AMASH (Shami)": [makam.SIGAH],
						"EZRA MASLATON TARAB (Shami)":
							[(jCal.getYomTovIndex() == JewishCalendar.PURIM ? makam.SIGAH : makam.RAST)],
						"ABRAHAM SHAMRICHA (Shami)": [makam.SIGAH]
					};
				case JewishCalendar.PESACH:
					return {
						15: {
							"Eliahou Yaaqob DWECK-KESAR": [makam.SIGAH],
							"YAAQOB ABADI-PARSIYA": [makam.SIGAH],
							"ABRAHAM DWECK Pre1920": [makam.SIGAH],
							"IDELSOHN Pre1923": [makam.BAYAT],
							"S SAGIR Laniado": [makam.SIGAH],
							"ASHEAR list": [makam.SIGAH],
							"ASHEAR NOTES 1936-1940": [makam.SIGAH],
							"ABRAHAM E SHREM ~1945": [makam.SIGAH],
							"Argentina 1947 & Ezra Mishanieh": [makam.SIGAH],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.SIGAH],
							"GABRIEL A SHREM 1964 SUHV": [makam.SIGAH],
							"YOSEF YEHEZKEL Jerusalem 1975": [makam.SIGAH],
							"Ish Massliah \"Abia Renanot\" Tunisians": [makam.SIGAH],
							"Shaare Zimra YANANI Buenos Aires, 01": [makam.SIGAH],
							"BOZO, Ades, Shir Ushbaha 2005": [makam.SIGAH, makam.BAYAT],
							"MOSHE AMASH (Shami)": [makam.RAST],
							"EZRA MASLATON TARAB (Shami)": [makam.RAST],
							"ABRAHAM SHAMRICHA (Shami)": [makam.RAST],
							"Hallel VeZimrah, Greece List, 1926": [makam.SIGAH]
						},
						16: {
							"Eliahou Yaaqob DWECK-KESAR": [makam.AJAM],
							"YAAQOB ABADI-PARSIYA": [makam.SASGAR],
							"ABRAHAM DWECK Pre1920": [makam.SASGAR],
							"IDELSOHN Pre1923": [makam.SASGAR],
							"S SAGIR Laniado": [makam.AJAM],
							"ASHEAR list": [makam.AJAM],
							"ASHEAR NOTES 1936-1940": [makam.AJAM],
							"ABRAHAM E SHREM ~1945": [makam.AJAM],
							"Argentina 1947 & Ezra Mishanieh": [makam.AJAM],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.AJAM],
							"GABRIEL A SHREM 1964 SUHV": [makam.AJAM],
							"Ish Massliah \"Abia Renanot\" Tunisians": [makam.AJAM],
							"Shaare Zimra YANANI Buenos Aires, 01": [makam.AJAM],
							"BOZO, Ades, Shir Ushbaha 2005": [makam.AJAM, makam.SASGAR],
							"MOSHE AMASH (Shami)": [makam.SIGAH],
							"EZRA MASLATON TARAB (Shami)": [makam.SIGAH],
							"ABRAHAM SHAMRICHA (Shami)": [makam.SIGAH],
							"Hallel VeZimrah, Greece List, 1926": [makam.AJAM]
						},
						21: {
							"Eliahou Yaaqob DWECK-KESAR": [makam.AJAM],
							"YAAQOB ABADI-PARSIYA": [makam.AJAM],
							"ABRAHAM DWECK Pre1920": [makam.AJAM],
							"IDELSOHN Pre1923": [makam.AJAM],
							"S SAGIR Laniado": [makam.AJAM],
							"ASHEAR list": [makam.AJAM],
							"ASHEAR NOTES 1936-1940": [makam.AJAM],
							"ABRAHAM E SHREM ~1945": [makam.AJAM],
							"Argentina 1947 & Ezra Mishanieh": [makam.AJAM],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.AJAM],
							"GABRIEL A SHREM 1964 SUHV": [makam.AJAM],
							"YOSEF YEHEZKEL Jerusalem 1975": [makam.GIRKA],
							"Ish Massliah \"Abia Renanot\" Tunisians": [makam.AJAM],
							"Shaare Zimra YANANI Buenos Aires, 01": [makam.AJAM],
							"BOZO, Ades, Shir Ushbaha 2005": [makam.AJAM],
							"MOSHE AMASH (Shami)": [makam.AJAM],
							"EZRA MASLATON TARAB (Shami)": [makam.AJAM],
							"ABRAHAM SHAMRICHA (Shami)": [makam.AJAM],
							"Hallel VeZimrah, Greece List, 1926": [makam.FARAHNAQ]
						},
						22: {
							"Eliahou Yaaqob DWECK-KESAR": [makam.ASHIRAN],
							"ABRAHAM DWECK Pre1920": [makam.BAYAT],
							"IDELSOHN Pre1923": [makam.MEHAYAR],
							"S SAGIR Laniado": [makam.SABA],
							"ASHEAR list": [makam.SABA],
							"ASHEAR NOTES 1936-1940": [makam.SABA],
							"ABRAHAM E SHREM ~1945": [makam.SABA],
							"Argentina 1947 & Ezra Mishanieh": [makam.SABA],
							"GABRIEL A SHREM 1964 SUHV": [makam.SABA],
							"Shaare Zimra YANANI Buenos Aires, 01": [makam.SABA],
							"BOZO, Ades, Shir Ushbaha 2005": [makam.SABA, makam.MEHAYAR],
							"MOSHE AMASH (Shami)": [makam.BAYAT],
							"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
							"Hallel VeZimrah, Greece List, 1926": [makam.IRAQ]
						}
					}[jCal.getJewishDayOfMonth()]!;
					break;
				case JewishCalendar.CHOL_HAMOED_PESACH:
					const pesachHHReturnData = {
						16: {
							"Eliahou Yaaqob DWECK-KESAR": [makam.AJAM],
							"YAAQOB ABADI-PARSIYA": [makam.SASGAR],
							"ABRAHAM DWECK Pre1920": [makam.SASGAR],
							"IDELSOHN Pre1923": [makam.SASGAR],
							"S SAGIR Laniado": [makam.AJAM],
							"ASHEAR list": [makam.AJAM],
							"ASHEAR NOTES 1936-1940": [makam.AJAM],
							"ABRAHAM E SHREM ~1945": [makam.AJAM],
							"Argentina 1947 & Ezra Mishanieh": [makam.AJAM],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.AJAM],
							"GABRIEL A SHREM 1964 SUHV": [makam.AJAM],
							"Ish Massliah \"Abia Renanot\" Tunisians": [makam.AJAM],
							"Shaare Zimra YANANI Buenos Aires, 01": [makam.AJAM],
							"BOZO, Ades, Shir Ushbaha 2005": [makam.AJAM, makam.SASGAR],
							"MOSHE AMASH (Shami)": [makam.SIGAH],
							"EZRA MASLATON TARAB (Shami)": [makam.SIGAH],
							"ABRAHAM SHAMRICHA (Shami)": [makam.SIGAH],
							"Hallel VeZimrah, Greece List, 1926": [makam.AJAM]
						},
						17: {
							"Eliahou Yaaqob DWECK-KESAR": [makam.SABA],
							"YAAQOB ABADI-PARSIYA": [makam.IRAQ],
							"IDELSOHN Pre1923": [makam.IRAQ],
							"ASHEAR list": [makam.IRAQ],
							"Argentina 1947 & Ezra Mishanieh": [makam.IRAQ],
							"GABRIEL A SHREM 1964 SUHV": [makam.IRAQ]
						},
						18: {
							"Eliahou Yaaqob DWECK-KESAR": [makam.BAYAT],
							"YAAQOB ABADI-PARSIYA": [makam.RAHAWI],
							"IDELSOHN Pre1923": [makam.RAHAWI],
							"ASHEAR list": [makam.SABA],
							"Argentina 1947 & Ezra Mishanieh": [makam.SABA],
							"GABRIEL A SHREM 1964 SUHV": [makam.RAHAWI]
						},
						19: {
							"Eliahou Yaaqob DWECK-KESAR": [makam.RAST],
							"YAAQOB ABADI-PARSIYA": [makam.RAST],
							"IDELSOHN Pre1923": [makam.RAST],
							"ASHEAR list": [makam.RAST],
							"Argentina 1947 & Ezra Mishanieh": [makam.RAST],
							"GABRIEL A SHREM 1964 SUHV": [makam.RAST]
						},
						20: {
							"Eliahou Yaaqob DWECK-KESAR": [makam.RAHAWI],
							"YAAQOB ABADI-PARSIYA": [makam.SABA],
							"IDELSOHN Pre1923": [makam.SABA],
							"ASHEAR list": [makam.BAYAT],
							"Argentina 1947 & Ezra Mishanieh": [makam.BAYAT],
							"GABRIEL A SHREM 1964 SUHV": [makam.BAYAT]
						}
					}[jCal.getJewishDayOfMonth()]!;

					if (jCal.getDayOfWeek() == Calendar.SATURDAY)
						pesachHHReturnData["GABRIEL A SHREM 1964 SUHV"] = [makam.BAYAT];

					return pesachHHReturnData;
					break;
				case JewishCalendar.SHAVUOS:
					if (jCal.getJewishDayOfMonth() == 7)
						return {
							"Eliahou Yaaqob DWECK-KESAR": [makam.AJAM],
							"ABRAHAM DWECK Pre1920": [makam.SASGAR],
							"S SAGIR Laniado": [makam.AJAM],
							"ASHEAR list": [makam.AJAM],
							"ASHEAR NOTES 1936-1940": [makam.AJAM],
							"Argentina 1947 & Ezra Mishanieh": [makam.SASGAR],
							"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.HOSENI],
							"GABRIEL A SHREM 1964 SUHV": [makam.AJAM],
							"Ish Massliah \"Abia Renanot\" Tunisians": [makam.HOSENI],
							"Shaare Zimra YANANI Buenos Aires, 01": [makam.SIGAH],
							"BOZO, Ades, Shir Ushbaha 2005": [makam.AJAM],
							"MOSHE AMASH (Shami)": [makam.BAYAT],
							"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
							"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
							"Hallel VeZimrah, Greece List, 1926": [makam.BUSTANIGAR]
						};

					return {
						"Eliahou Yaaqob DWECK-KESAR": [makam.SIGAH],
						"ABRAHAM DWECK Pre1920": [makam.SIGAH],
						"IDELSOHN Pre1923": [makam.SIGAH],
						"S SAGIR Laniado": [makam.SIGAH],
						"ASHEAR list": [makam.SIGAH],
						"ASHEAR NOTES 1936-1940": [makam.SIGAH],
						"Argentina 1947 & Ezra Mishanieh": [makam.SIGAH],
						"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.AJAM],
						"GABRIEL A SHREM 1964 SUHV": [makam.SIGAH],
						"YOSEF YEHEZKEL Jerusalem 1975": [makam.BAYAT, makam.AJAM],
						"Ish Massliah \"Abia Renanot\" Tunisians": [makam.AJAM],
						"Shaare Zimra YANANI Buenos Aires, 01": [makam.AJAM],
						"BOZO, Ades, Shir Ushbaha 2005": [makam.SIGAH],
						"MOSHE AMASH (Shami)": [makam.RAST],
						"EZRA MASLATON TARAB (Shami)": [makam.RAST],
						"ABRAHAM SHAMRICHA (Shami)": [makam.RAST],
						"Hallel VeZimrah, Greece List, 1926": [makam.RAST]
					};
			}
		}

		const data:Partial<Record<Parsha, getMaqamReturnType>> = {
			[Parsha.BERESHIS]: fillMakamTable(makamHeaders.bereshit,
				[makam.RAST],
				{
					"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.RAST, makam.BAYAT],
					"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.RAST, makam.BAYAT],
					"Dibre Shelomo S KASSIN Pre1915": [makam.RAST, makam.BAYAT],
					"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.BAYAT, makam.RAST],
					"Victor Afya, Istanbul List": [makam.SEGAH],
					"Izak Alaluf, Izmir List": [makam.SEGAH],
				}
			),
			[Parsha.NOACH]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.IRAQ, makam.SABA],
				"TEBELE Pre1888": [makam.IRAQ],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.IRAQ, makam.SABA],
				"YAAQOB ABADI-PARSIYA": [makam.BAYAT],
				"YISHAQ YEQAR ARGENTINA": [makam.IRAQ],
				"ADES: 24793": [makam.IRAQ, makam.SABA],
				"Dibre Shelomo S KASSIN Pre1915": [makam.IRAQ, makam.SABA],
				"Knis Betesh Geniza List, Aleppo": [makam.IRAQ, makam.SIGAH],
				"ABRAHAM DWECK Pre1920": [makam.SIGAH],
				"IDELSOHN Pre1923": [makam.IRAQ],
				"S SAGIR Laniado": [makam.BAYAT],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.SIGAH],
				"ASHEAR list": [makam.IRAQ],
				"ASHEAR NOTES 1936-1940": [makam.IRAQ, makam.SIGAH],
				"ABRAHAM E SHREM ~1945": [makam.SIGAH],
				"Argentina 1947 & Ezra Mishanieh": [makam.IRAQ],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.IRAQ, makam.BAYAT],
				"GABRIEL A SHREM 1964 SUHV": [makam.SIGAH],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.SIGAH],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.HIJAZ],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.HIJAZ],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.BAYAT, makam.SIGAH],
				"Yishaq Yeranen Halabi": [makam.BAYAT],
				"MOSHE AMASH (Shami)": [makam.NAWAH],
				"EZRA MASLATON TARAB (Shami)": [makam.NAWAH],
				"ABRAHAM SHAMRICHA (Shami)": [makam.NAWAH],
				"Victor Afya, Istanbul List": [makam.HICAZ],
				"Izak Alaluf, Izmir List": [makam.HICAZ],
				//"Hallel VeZimrah, Salonika, 1928": "Nibah"
			},
			[Parsha.LECH_LECHA]: fillMakamTable(makamHeaders.bereshit,
				[makam.SABA],
				{
					"MOSHE AMASH (Shami)": [makam.SIGAH, makam.IRAQ],
					"EZRA MASLATON TARAB (Shami)": [makam.SIGAH, makam.IRAQ],
					"ABRAHAM SHAMRICHA (Shami)": [makam.SIGAH],
					"Victor Afya, Istanbul List": [makam.HUSEYNI],
					"Izak Alaluf, Izmir List": [makam.HUSEYNI],
					"Hallel VeZimrah, Salonika, 1928": [makam.NAHOFT]
				}),
			[Parsha.VAYERA]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.NAWAH],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.NAWAH],
				"TEBELE Pre1888": [makam.NAWAH],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [makam.NAWAH],
				"YISHAQ YEQAR ARGENTINA": [makam.NAWAH],
				"ADES: 24793": [makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [makam.NAWAH],
				"Knis Betesh Geniza List, Aleppo": [makam.NAWAH],
				"ABRAHAM DWECK Pre1920": [makam.HOSENI],
				"IDELSOHN Pre1923": [makam.NAWAH],
				"S SAGIR Laniado": [makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.BAYAT],
				"ASHEAR list": [makam.NAWAH],
				"ASHEAR NOTES 1936-1940": [makam.NAWAH, makam.RAST],
				"ABRAHAM E SHREM ~1945": [makam.BAYAT],
				"Argentina 1947 & Ezra Mishanieh": [makam.NAHWAND],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.NAWAH],
				"GABRIEL A SHREM 1964 SUHV": [makam.RAHAWI, makam.NAWAH], // Original Pizmonim.com entry: Just Nawah
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.BAYAT],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.HIJAZ],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.NAHWAND],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.NAWAH],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.NAWAH],
				"Yishaq Yeranen Halabi": [makam.NAWAH],
				"MOSHE AMASH (Shami)": [makam.AJAM],
				"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
				"Victor Afya, Istanbul List": [makam.ARABAN],
				"Izak Alaluf, Izmir List": [makam.NIHAVEND],
				"Hallel VeZimrah, Salonika, 1928": [makam.HIJAZ]
			},
			[Parsha.CHAYEI_SARA]: fillMakamTable(makamHeaders.bereshit,
				[makam.HIJAZ],
				{
					"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.HOSENI],
					"ADES: 24793": [makam.ARAZBAR],
					"Dibre Shelomo S KASSIN Pre1915": [makam.HIJAZ, makam.ARAZBAR],
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.NAHWAND],
					"YOSEF YEHEZKEL Jerusalem 1975": [makam.HIJAZ_KAR],
					"Ish Massliah \"Abia Renanot\" Tunisians": [makam.HIJAZ_KAR],
					"Shaare Zimra YANANI Buenos Aires, 01": [makam.NAHWAND],
					"MOSHE AMASH (Shami)": [makam.SABA],
					"EZRA MASLATON TARAB (Shami)": [makam.SABA],
					"ABRAHAM SHAMRICHA (Shami)": [makam.SABA],
					"Victor Afya, Istanbul List": [makam.DUGAH],
					"Izak Alaluf, Izmir List": [makam.DUGAH],
					"Hallel VeZimrah, Salonika, 1928": [makam.BUSTANIGAR]
				}),
			[Parsha.TOLDOS]: fillMakamTable(makamHeaders.bereshit,
				[makam.MAHOUR],
				{
					"Knis Betesh Geniza List, Aleppo": [makam.RAST],
					"ABRAHAM DWECK Pre1920": [makam.RAST],
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.RAST],
					"Shaare Zimra YANANI Buenos Aires, 01": [makam.RAST],
					"MOSHE AMASH (Shami)": [makam.RAST],
					"Victor Afya, Istanbul List": [makam.MAHUR],
					"Izak Alaluf, Izmir List": [makam.ARABAN],
					"Hallel VeZimrah, Salonika, 1928": [makam.IRAQ]
				}),
			[Parsha.VAYETZEI]: {
				//"TABBUSH Ms NLI 8*7622, Aleppo": ["Sharga"],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.GIRKA],
				"TEBELE Pre1888": [makam.GIRKA],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.GIRKA],
				"YAAQOB ABADI-PARSIYA": [makam.GIRKA],
				"YISHAQ YEQAR ARGENTINA": [makam.GIRKA],
				"ADES: 24793": [makam.GIRKA],
				"Dibre Shelomo S KASSIN Pre1915": [makam.GIRKA, makam.AJAM],
				"Knis Betesh Geniza List, Aleppo": [makam.SABA],
				"ABRAHAM DWECK Pre1920": [makam.SABA],
				"IDELSOHN Pre1923": [makam.GIRKA],
				"S SAGIR Laniado": [makam.AJAM],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.SABA],
				//"ASHEAR list": ["Sharga"],
				"ASHEAR NOTES 1936-1940": [makam.AJAM],
				"ABRAHAM E SHREM ~1945": [makam.SABA],
				"Argentina 1947 & Ezra Mishanieh": [makam.GIRKA/*, "Sharga" */],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.AJAM],
				"GABRIEL A SHREM 1964 SUHV": [makam.AJAM],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.SABA],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.AJAM],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.AJAM],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.AJAM],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.AJAM],
				"Yishaq Yeranen Halabi": [makam.AJAM],
				"MOSHE AMASH (Shami)": [makam.AJAM],
				"EZRA MASLATON TARAB (Shami)": [makam.AJAM],
				"ABRAHAM SHAMRICHA (Shami)": [makam.AJAM],
				"Victor Afya, Istanbul List": [makam.NIHAVEND],
				"Izak Alaluf, Izmir List": [makam.BEYATI],
				"Hallel VeZimrah, Salonika, 1928": [makam.SABA]
			},
			[Parsha.VAYISHLACH]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.IRAQ, makam.SABA],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.IRAQ, makam.SABA],
				"TEBELE Pre1888": [makam.IRAQ],
				"YAAQOB ABADI-PARSIYA": [makam.BAYAT],
				"YISHAQ YEQAR ARGENTINA": [makam.SIGAH],
				"ADES: 24793": [makam.IRAQ, makam.SABA],
				"Dibre Shelomo S KASSIN Pre1915": [makam.IRAQ, makam.SABA],
				"Knis Betesh Geniza List, Aleppo": [makam.IRAQ],
				"ABRAHAM DWECK Pre1920": [makam.BAYAT],
				"IDELSOHN Pre1923": [makam.IRAQ],
				"S SAGIR Laniado": [makam.BAYAT],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.HOSENI],
				"ASHEAR list": [makam.IRAQ],
				"ASHEAR NOTES 1936-1940": [makam.SIGAH, makam.IRAQ],
				"ABRAHAM E SHREM ~1945": [makam.HOSENI],
				"Argentina 1947 & Ezra Mishanieh": [makam.IRAQ],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.SABA, makam.SIGAH],
				"GABRIEL A SHREM 1964 SUHV": [makam.SABA, makam.SIGAH],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.SIGAH],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.SABA],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.SABA],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.BAYAT, makam.SIGAH],
				"Yishaq Yeranen Halabi": [makam.BAYAT],
				"MOSHE AMASH (Shami)": [makam.BAYAT],
				"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
				"Victor Afya, Istanbul List": [makam.ACEM_ASHIRAN],
				"Izak Alaluf, Izmir List": [makam.ACEM_ASHIRAN],
				"Hallel VeZimrah, Salonika, 1928": [makam.HUZAM]
			},
			[Parsha.VAYESHEV]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.RAHAWI],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.RAHAWI],
				"TEBELE Pre1888": [makam.RAHAWI],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.RAHAWI],
				"YAAQOB ABADI-PARSIYA": [makam.RAHAWI],
				"YISHAQ YEQAR ARGENTINA": [makam.RAHAWI],
				"ADES: 24793": [makam.RAHAWI],
				"Dibre Shelomo S KASSIN Pre1915": [makam.RAHAWI],
				"Knis Betesh Geniza List, Aleppo": [makam.RAHAWI],
				"IDELSOHN Pre1923": [makam.RAHAWI],
				"S SAGIR Laniado": [makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.RAHAWI],
				"ASHEAR list": [makam.RAHAWI],
				"ASHEAR NOTES 1936-1940": [makam.NAWAH, makam.NAHWAND],
				"ABRAHAM E SHREM ~1945": [makam.RAHAWI, makam.NAHWAND],
				"Argentina 1947 & Ezra Mishanieh": [makam.RAHAWI],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.RAHAWI],
				"GABRIEL A SHREM 1964 SUHV": [makam.RAHAWI, makam.NAHWAND],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.NAWAH],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.NAHWAND],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.NAHWAND],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.NAWAH],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.RAHAWI, makam.NAWAH],
				"Yishaq Yeranen Halabi": [makam.NAWAH],
				"MOSHE AMASH (Shami)": [makam.NAWAH],
				"EZRA MASLATON TARAB (Shami)": [makam.NAWAH],
				"ABRAHAM SHAMRICHA (Shami)": [makam.NAWAH],
				"Victor Afya, Istanbul List": [makam.USSAK],
				"Izak Alaluf, Izmir List": [makam.ISFAHAN],
				"Hallel VeZimrah, Salonika, 1928": [makam.SIGAH]
			},
			[Parsha.MIKETZ]:
				fillMakamTable(makamHeaders.bereshit
					.filter(book => book !== "Victor Afya, Istanbul List"),
				[makam.SIGAH],
				{
					"MOSHE AMASH (Shami)": [makam.RAHAWI],
					"EZRA MASLATON TARAB (Shami)": [makam.RAHAWI],
					"ABRAHAM SHAMRICHA (Shami)": [makam.RAHAWI],
					"Izak Alaluf, Izmir List": [makam.USSAK],
					"Hallel VeZimrah, Salonika, 1928": [makam.USSAK]
				}),
			[Parsha.VAYIGASH]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.BAYAT],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.BAYAT],
				"TEBELE Pre1888": [makam.BAYAT],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.IRAQ, makam.SABA, makam.BAYAT, makam.RAST],
				"YAAQOB ABADI-PARSIYA": [makam.SABA],
				"YISHAQ YEQAR ARGENTINA": [makam.BAYAT],
				"ADES: 24793": [makam.BAYAT],
				"Dibre Shelomo S KASSIN Pre1915": [makam.BAYAT],
				"Knis Betesh Geniza List, Aleppo": [makam.SABA],
				"ABRAHAM DWECK Pre1920": [makam.SABA],
				"IDELSOHN Pre1923": [makam.BAYAT],
				"S SAGIR Laniado": [makam.SABA],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.MAHOUR],
				"ASHEAR list": [makam.BAYAT],
				"ASHEAR NOTES 1936-1940": [makam.BAYAT],
				"ABRAHAM E SHREM ~1945": [makam.MAHOUR],
				"Argentina 1947 & Ezra Mishanieh": [makam.BAYAT],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.BAYAT, makam.SABA],
				"GABRIEL A SHREM 1964 SUHV": [makam.BAYAT],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.BAYAT],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.BAYAT],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.BAYAT],
				"Yishaq Yeranen Halabi": [makam.BAYAT, makam.SABA],
				"MOSHE AMASH (Shami)": [makam.SIGAH],
				"EZRA MASLATON TARAB (Shami)": [makam.SIGAH],
				"ABRAHAM SHAMRICHA (Shami)": [makam.SIGAH],
				"Victor Afya, Istanbul List": [makam.SEGAH],
				"Izak Alaluf, Izmir List": [makam.NIHAVEND],
				"Hallel VeZimrah, Salonika, 1928": [makam.MUHAYER]
			},
			[Parsha.VAYECHI]: fillMakamTable(makamHeaders.bereshit,
				[makam.HIJAZ],
				{
					"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.HIJAZ, makam.SABA],
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.NAHWAND],
					"YOSEF YEHEZKEL Jerusalem 1975": [makam.SHURI],
					"Shaare Zimra YANANI Buenos Aires, 01": [makam.NAHWAND],
					"MOSHE AMASH (Shami)": [makam.SABA],
					"EZRA MASLATON TARAB (Shami)": [makam.SABA],
					"ABRAHAM SHAMRICHA (Shami)": [makam.SABA],
					"Victor Afya, Istanbul List": [makam.BEYATI],
					"Izak Alaluf, Izmir List": [makam.CARGAH],
					"Hallel VeZimrah, Salonika, 1928": [makam.AJAM]
				}),
			[Parsha.SHEMOS]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.RAST],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.BAYAT, makam.RAST],
				"TEBELE Pre1888": [makam.BAYAT],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.BAYAT, makam.RAST],
				"YAAQOB ABADI-PARSIYA": [makam.BAYAT],
				"YISHAQ YEQAR ARGENTINA": [makam.RAST],
				"ADES: 24793": [makam.BAYAT, makam.RAST],
				"Dibre Shelomo S KASSIN Pre1915": [makam.BAYAT, makam.RAST],
				"Knis Betesh Geniza List, Aleppo": [makam.RAST],
				"ABRAHAM DWECK Pre1920": [makam.RAST],
				"IDELSOHN Pre1923": [makam.RAST],
				"S SAGIR Laniado": [makam.BAYAT],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.HOSENI],
				"ASHEAR list": [makam.BAYAT, makam.RAST],
				"ASHEAR NOTES 1936-1940": [makam.BAYAT, makam.RAST],
				"ABRAHAM E SHREM ~1945": [makam.HOSENI],
				"Argentina 1947 & Ezra Mishanieh": [makam.BAYAT, makam.RAST],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.BAYAT, makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [makam.BAYAT, makam.RAST],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.RAST],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.RAST],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.RAST],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.RAST],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.BAYAT, makam.RAST],
				"Yishaq Yeranen Halabi": [makam.BAYAT],
				"MOSHE AMASH (Shami)": [makam.RAST],
				"EZRA MASLATON TARAB (Shami)": [makam.RAST],
				"ABRAHAM SHAMRICHA (Shami)": [makam.RAST],
				"Victor Afya, Istanbul List": [makam.NIHAVEND],
				"Izak Alaluf, Izmir List": [makam.NIHAVEND],
				"Hallel VeZimrah, Greece List, 1926": [makam.BAYATI]
			},
			[Parsha.VAERA]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.SABA],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.HOSENI, makam.NAWAH],
				"TEBELE Pre1888": [makam.HOSENI],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.IRAQ, makam.HOSENI, makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [makam.IRAQ, makam.HOSENI],
				"YISHAQ YEQAR ARGENTINA": [makam.SIGAH],
				"ADES: 24793": [makam.HOSENI, makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [makam.HOSENI, makam.NAWAH],
				"Knis Betesh Geniza List, Aleppo": [makam.BAYAT],
				"ABRAHAM DWECK Pre1920": [makam.BAYAT],
				"IDELSOHN Pre1923": [makam.HOSENI, makam.NAWAH],
				"S SAGIR Laniado": [makam.SIGAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.SABA],
				"ASHEAR list": [makam.SIGAH],
				"ASHEAR NOTES 1936-1940": [makam.NAHWAND,makam.BAYAT],
				"ABRAHAM E SHREM ~1945": [makam.SABA],
				"Argentina 1947 & Ezra Mishanieh": [makam.SIGAH],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.HOSENI, makam.SIGAH],
				"GABRIEL A SHREM 1964 SUHV": [makam.HOSENI, makam.RAST],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.BAYAT],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.HOSENI],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.BAYAT],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.SIGAH],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.NAWAH,makam.HOSENI],
				"Yishaq Yeranen Halabi": [makam.NAWAH],
				"MOSHE AMASH (Shami)": [makam.BAYAT],
				"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
				"Victor Afya, Istanbul List": [makam.HICAZ],
				"Izak Alaluf, Izmir List": [makam.HICAZ],
				"Hallel VeZimrah, Greece List, 1926": [makam.BUSALIQ]
			},
			[Parsha.BO]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.IRAQ, makam.RAST],
				"TEBELE Pre1888": [makam.IRAQ],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.IRAQ, makam.RAST],
				"YAAQOB ABADI-PARSIYA": [makam.SIGAH, makam.RAST],
				"YISHAQ YEQAR ARGENTINA": [makam.BAYAT],
				"ADES: 24793": [makam.IRAQ, makam.RAST],
				"Dibre Shelomo S KASSIN Pre1915": [makam.IRAQ, makam.RAST],
				"Knis Betesh Geniza List, Aleppo": [makam.SABA],
				"ABRAHAM DWECK Pre1920": [makam.RAHAWI],
				"IDELSOHN Pre1923": [makam.IRAQ],
				"S SAGIR Laniado": [makam.RAST],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.BAYAT],
				"ASHEAR list": [makam.RAST],
				"ASHEAR NOTES 1936-1940": [makam.NAWAH, makam.NAHWAND],
				"ABRAHAM E SHREM ~1945": [makam.NAHWAND],
				"Argentina 1947 & Ezra Mishanieh": [makam.RAST],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.SIGAH, makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [makam.SIGAH],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.SIGAH],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.SIGAH],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.SIGAH],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.NAWAH],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.SIGAH],
				"Yishaq Yeranen Halabi": [makam.SIGAH],
				"MOSHE AMASH (Shami)": [makam.RAST],
				"EZRA MASLATON TARAB (Shami)": [makam.RAHAWI],
				"ABRAHAM SHAMRICHA (Shami)": [makam.NAWAH],
				"Victor Afya, Istanbul List": [makam.HUSEYNI],
				"Izak Alaluf, Izmir List": [makam.HUSEYNI],
				"Hallel VeZimrah, Greece List, 1926": [makam.QARGIGAR]
			},
			[Parsha.BESHALACH]: fillMakamTable(makamHeaders.shemot,
				[makam.AJAM],
				{
					"Victor Afya, Istanbul List": [makam.ACEM_ASHIRAN],
					"Izak Alaluf, Izmir List": [makam.ACEM_ASHIRAN],
					"Hallel VeZimrah, Greece List, 1926": ["Farahnaq"]
				}),
			[Parsha.YISRO]: fillMakamTable(makamHeaders.shemot,
				[makam.HOSENI],
				{
					"ELIE SHAUL COHEN FROM AINTAB, ~1880": ["Ḥoseni"],
					"IDELSOHN Pre1923": [makam.SIGAH],
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.BAYAT],
					"YOSEF YEHEZKEL Jerusalem 1975": [makam.KURD],
					"Ish Massliah \"Abia Renanot\" Tunisians": [makam.KURD, makam.HOSENI],
					"Shaare Zimra YANANI Buenos Aires, 01": [makam.BAYAT],
					"BOZO, Ades, Shir Ushbaha 2005": [makam.HOSENI, makam.SIGAH],
					"MOSHE AMASH (Shami)": [makam.BAYAT],
					"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
					"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
					"Victor Afya, Istanbul List": [makam.MAHUR, makam.SEHNAZ],
					"Izak Alaluf, Izmir List": [makam.MAHUR],
					"Hallel VeZimrah, Greece List, 1926": [makam.RAST]
				}),
			[Parsha.MISHPATIM]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.NAWAH],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.RAST,makam.SABA],
				"TEBELE Pre1888": [makam.SABA],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.NAWAH,makam.SABA],
				"YAAQOB ABADI-PARSIYA": [makam.NAWAH,makam.SABA],
				"YISHAQ YEQAR ARGENTINA": [makam.NAWAH],
				"ADES: 24793": [makam.SABA],
				"Dibre Shelomo S KASSIN Pre1915": [makam.SABA],
				"Knis Betesh Geniza List, Aleppo": [makam.NAWAH],
				"ABRAHAM DWECK Pre1920": [makam.NAHWAND],
				"IDELSOHN Pre1923": [makam.SABA],
				"S SAGIR Laniado": [makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.RAST,makam.SABA],
				"ASHEAR list": [makam.NAWAH],
				"ASHEAR NOTES 1936-1940": [makam.BAYAT, makam.NAWAH],
				"ABRAHAM E SHREM ~1945": [makam.RAST],
				"Argentina 1947 & Ezra Mishanieh": [makam.NAHWAND],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.SABA],
				"GABRIEL A SHREM 1964 SUHV": [makam.SABA],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.SABA],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.SABA, makam.ISFAHAN],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.SABA],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.RAST],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.SABA],
				"Yishaq Yeranen Halabi": [makam.SABA],
				"MOSHE AMASH (Shami)": [makam.SIGAH],
				"EZRA MASLATON TARAB (Shami)": [makam.SIGAH],
				"ABRAHAM SHAMRICHA (Shami)": [makam.SIGAH],
				"Victor Afya, Istanbul List": [makam.ARABAN],
				"Izak Alaluf, Izmir List": [makam.BEYATI],
				//"Hallel VeZimrah, Greece List, 1926": "Nibah"
			},
			[Parsha.TERUMAH]: fillMakamTable(
				makamHeaders.shemot, [makam.SABA],
				{
					"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.SABA, makam.RAST],
					"YAAQOB ABADI-PARSIYA": [makam.SABA, makam.RAST],
					"Dibre Shelomo S KASSIN Pre1915": [makam.SABA, makam.MOUHAYAR],
					"IDELSOHN Pre1923": [makam.SIGAH],
					"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.SABA, makam.HOSENI],
					"ASHEAR NOTES 1936-1940": [makam.BAYAT],
					"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.BAYAT, makam.SABA],
					"GABRIEL A SHREM 1964 SUHV": [makam.HOSENI],
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.RAST],
					"YOSEF YEHEZKEL Jerusalem 1975": [makam.BAYAT, makam.HOSENI],
					"Ish Massliah \"Abia Renanot\" Tunisians": [makam.BAYAT],
					"BOZO, Ades, Shir Ushbaha 2005": [makam.BAYAT, makam.SIGAH],
					"Yishaq Yeranen Halabi": [makam.BAYAT],
					"MOSHE AMASH (Shami)": [makam.RAST],
					"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
					"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
					"Victor Afya, Istanbul List": [makam.BEYATI],
					"Izak Alaluf, Izmir List": [makam.SEGAH],
					"Hallel VeZimrah, Greece List, 1926": [makam.NAHWAND]
				}),
			[Parsha.TETZAVEH]: fillMakamTable(makamHeaders.shemot,
				[makam.SIGAH],
				{
					"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.SABA, makam.SIGAH],
					"MOSHE AMASH (Shami)": [makam.BAYAT],
					"EZRA MASLATON TARAB (Shami)": [makam.MAHOUR],
					"ABRAHAM SHAMRICHA (Shami)": [makam.MAHOUR],
					"Victor Afya, Istanbul List": [makam.SEGAH],
					"Izak Alaluf, Izmir List": [makam.ISFAHAN],
					"Hallel VeZimrah, Greece List, 1926": ["Sigah"]
				}),
			[Parsha.KI_SISA]: fillMakamTable(
				makamHeaders.shemot.filter(book => book !== "Hallel VeZimrah, Greece List, 1926"),
				[makam.HIJAZ],
				{
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.NAHWAND],
					"YOSEF YEHEZKEL Jerusalem 1975": [makam.SHURI],
					"Shaare Zimra YANANI Buenos Aires, 01": [makam.NAHWAND],
					"MOSHE AMASH (Shami)": [makam.SABA],
					"EZRA MASLATON TARAB (Shami)": [makam.SABA],
					"ABRAHAM SHAMRICHA (Shami)": [makam.SABA],
					"Victor Afya, Istanbul List": [makam.HICAZ],
					"Izak Alaluf, Izmir List": [makam.ARABAN],
					//"Hallel VeZimrah, Greece List, 1926": "Haqaqordo?"
				}),
			[Parsha.VAYAKHEL]: fillMakamTable(makamHeaders.shemot
					.filter(book => ![
						"M H Elias, SHIR HADASH, Jerusalem, 1930",
						"YOSEF YEHEZKEL Jerusalem 1975",
						"ABRAHAM SHAMRICHA (Shami)",
						"Victor Afya, Istanbul List",
						"Izak Alaluf, Izmir List"
					].includes(book)), [makam.HOSENI],
				{
					"YISHAQ YEQAR ARGENTINA": [makam.SABA],
					"S SAGIR Laniado": [makam.BAYAT],
					"ASHEAR NOTES 1936-1940": [makam.BAYAT],
					"ABRAHAM E SHREM ~1945": [makam.BAYAT],
					"Shaare Zimra YANANI Buenos Aires, 01": [makam.BAYAT],
					"MOSHE AMASH (Shami)": [makam.AJAM],
					"EZRA MASLATON TARAB (Shami)": [makam.MAHOUR],
					"Hallel VeZimrah, Greece List, 1926": [makam.BUSTANIGAR]
				}),
			[Parsha.PEKUDEI]: fillMakamTable(makamHeaders.shemot
					.filter(book => ![
						"YOSEF YEHEZKEL Jerusalem 1975",
						"Victor Afya, Istanbul List",
						"Izak Alaluf, Izmir List"
					].includes(book)), [makam.NAWAH],
				{
					"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.RAST, makam.SABA],
					"ABRAHAM E SHREM ~1945": [makam.SABA],
					"Argentina 1947 & Ezra Mishanieh": [makam.NAHWAND],
					//"GABRIEL A SHREM 1964 SUHV": [makam.NAWAH], // Artscroll: Nawah/Nahwand; Shir Ushbacha: Rahaw/Nawah
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.BAYAT],
					"MOSHE AMASH (Shami)": [makam.BAYAT],
					"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
					"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
					"Hallel VeZimrah, Greece List, 1926": [makam.HUZAM]
				}),
			[Parsha.VAYIKRA]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.RAST],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.RAST],
				"TEBELE Pre1888": [makam.RAST],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.RAST],
				"YAAQOB ABADI-PARSIYA": [makam.RAST],
				"YISHAQ YEQAR ARGENTINA": [makam.RAST],
				"ADES: 24793": [makam.RAST],
				"Dibre Shelomo S KASSIN Pre1915": [makam.RAST],
				"Knis Betesh Geniza List, Aleppo": [makam.RAST],
				"ABRAHAM DWECK Pre1920": [makam.RAST],
				"IDELSOHN Pre1923": [makam.RAST],
				"S SAGIR Laniado": [makam.RAST],
				"ASHEAR list": [makam.RAST],
				"ASHEAR NOTES 1936-1940": [makam.RAST],
				"Argentina 1947 & Ezra Mishanieh": [makam.RAST],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [makam.RAST],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.RAST],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.RAST],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.RAST],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.RAST],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.RAST],
				"Yishaq Yeranen Halabi": [makam.RAST],
				"MOSHE AMASH (Shami)": [makam.RAST],
				"EZRA MASLATON TARAB (Shami)": [makam.RAST],
				"ABRAHAM SHAMRICHA (Shami)": [makam.RAST],
				"Victor Afya, Istanbul List": [makam.SEBAH],
				"Izak Alaluf, Izmir List": [makam.HICAZ],
				"Hallel VeZimrah, Greece List, 1926": [makam.SABA]
			},
			[Parsha.TZAV]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.IRAQ],
				"TEBELE Pre1888": [makam.IRAQ],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.RAHAWI, makam.IRAQ],
				"YAAQOB ABADI-PARSIYA": [makam.RAHAWI, makam.IRAQ],
				"YISHAQ YEQAR ARGENTINA": [makam.RAHAWI],
				"ADES: 24793": [makam.IRAQ],
				"Dibre Shelomo S KASSIN Pre1915": [makam.IRAQ],
				"Knis Betesh Geniza List, Aleppo": [makam.RAHAWI],
				"ABRAHAM DWECK Pre1920": [makam.RAHAWI],
				"IDELSOHN Pre1923": [makam.IRAQ],
				"S SAGIR Laniado": [makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.RAHAWI],
				"ASHEAR list": [makam.RAHAWI],
				"ASHEAR NOTES 1936-1940": [makam.BAYAT],
				"Argentina 1947 & Ezra Mishanieh": [makam.RAHAWI],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.IRAQ],
				"GABRIEL A SHREM 1964 SUHV": [makam.RAHAWI, makam.NAWAH],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.BAYAT],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.IRAQ],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.NAHWAND],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.SIGAH],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.NAWAH],
				"Yishaq Yeranen Halabi": [makam.NAWAH],
				"MOSHE AMASH (Shami)": [makam.NAWAH],
				"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
				"Victor Afya, Istanbul List": [makam.ISFAHAN, makam.ACEM_ASHIRAN],
				"Izak Alaluf, Izmir List": [makam.SEGAH],
				"Hallel VeZimrah, Greece List, 1926": ["Ḥoseni"]
			},
			[Parsha.SHMINI]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.HOSENI],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.HOSENI],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.HOSENI],
				"YAAQOB ABADI-PARSIYA": [makam.HOSENI],
				"YISHAQ YEQAR ARGENTINA": [makam.HOSENI],
				"ADES: 24793": [makam.HOSENI],
				"Dibre Shelomo S KASSIN Pre1915": [makam.HOSENI],
				"Knis Betesh Geniza List, Aleppo": [makam.HOSENI],
				"ABRAHAM DWECK Pre1920": [makam.HOSENI],
				"IDELSOHN Pre1923": [makam.HOSENI],
				"S SAGIR Laniado": [makam.HOSENI],
				"ASHEAR list": [makam.HOSENI],
				"ASHEAR NOTES 1936-1940": [makam.NAHWAND],
				"Argentina 1947 & Ezra Mishanieh": [makam.HOSENI],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.HOSENI],
				"GABRIEL A SHREM 1964 SUHV": [makam.HOSENI],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.RAST],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.HOSENI],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.HOSENI],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.HOSENI],
				"Yishaq Yeranen Halabi": [makam.HOSENI],
				"MOSHE AMASH (Shami)": [makam.SABA],
				"EZRA MASLATON TARAB (Shami)": [makam.SABA],
				"ABRAHAM SHAMRICHA (Shami)": [makam.SABA],
				"Victor Afya, Istanbul List": [makam.HICAZ],
				"Izak Alaluf, Izmir List": [makam.HICAZ],
				"Hallel VeZimrah, Greece List, 1926": [makam.BAYATI]
			},
			[Parsha.TAZRIA]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.BAYAT],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.BAYAT],
				"TEBELE Pre1888": [makam.BAYAT],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.BAYAT],
				"YAAQOB ABADI-PARSIYA": [makam.BAYAT],
				"YISHAQ YEQAR ARGENTINA": [makam.MEHAYAR],
				"ADES: 24793": [makam.BAYAT],
				"Dibre Shelomo S KASSIN Pre1915": [makam.BAYAT],
				"Knis Betesh Geniza List, Aleppo": [makam.BAYAT],
				"ABRAHAM DWECK Pre1920": [makam.BAYAT],
				"IDELSOHN Pre1923": [makam.BAYAT],
				"S SAGIR Laniado": [makam.SIGAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.BAYAT],
				"ASHEAR list": [makam.SIGAH],
				"ASHEAR NOTES 1936-1940": [makam.BAYAT, makam.SIGAH],
				"Argentina 1947 & Ezra Mishanieh": [makam.SIGAH],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.BAYAT, makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [makam.BAYAT, makam.SABA],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.BAYAT],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.MEHAYAR],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.SIGAH],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.SABA],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.BAYAT, makam.SABA],
				"Yishaq Yeranen Halabi": [makam.SABA],
				"MOSHE AMASH (Shami)": [makam.BAYAT],
				"EZRA MASLATON TARAB (Shami)": [makam.SIGAH],
				"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
				"Victor Afya, Istanbul List": [makam.MAHUR],
				"Izak Alaluf, Izmir List": [makam.ACEM_ASHIRAN],
				"Hallel VeZimrah, Greece List, 1926": [makam.SUZNIQ]
			},
			[Parsha.METZORA]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.IRAQ],
				"TEBELE Pre1888": [makam.IRAQ],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.RAHAWI],
				"YAAQOB ABADI-PARSIYA": [makam.NAWAH],
				"YISHAQ YEQAR ARGENTINA": [makam.SIGAH],
				"ADES: 24793": [makam.IRAQ],
				"Dibre Shelomo S KASSIN Pre1915": [makam.IRAQ],
				"Knis Betesh Geniza List, Aleppo": [makam.RAHAWI],
				"ABRAHAM DWECK Pre1920": [makam.NAHWAND],
				"IDELSOHN Pre1923": [makam.IRAQ],
				"S SAGIR Laniado": [makam.NAWAH],
				"ASHEAR NOTES 1936-1940": [makam.NAHWAND, makam.SIGAH],
				"Argentina 1947 & Ezra Mishanieh": [makam.SIGAH],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.SABA, makam.SIGAH],
				"GABRIEL A SHREM 1964 SUHV": [makam.NAHWAND, makam.SIGAH],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.SIGAH],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.RAST],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.NAWAH],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.SABA, makam.SIGAH],
				"Yishaq Yeranen Halabi": [makam.SABA],
				"MOSHE AMASH (Shami)": [makam.RAST],
				"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
				"Izak Alaluf, Izmir List": [makam.SEGAH],
				"Hallel VeZimrah, Greece List, 1926": ["Sigah"]
			},
			[Parsha.ACHREI_MOS]: fillMakamTable(makamHeaders.vayikra
					.filter(book => !["Izak Alaluf, Izmir List", "Victor Afya, Istanbul List"].includes(book)),
				[makam.HIJAZ],
				{
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.NAHWAND],
					"Shaare Zimra YANANI Buenos Aires, 01": [makam.NAHWAND],
					"MOSHE AMASH (Shami)": [makam.SABA],
					"EZRA MASLATON TARAB (Shami)": [makam.SABA],
					"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
					"Hallel VeZimrah, Greece List, 1926": [makam.NAHOFT]
				}),
			[Parsha.KEDOSHIM]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.SABA],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.SABA],
				"YAAQOB ABADI-PARSIYA": [makam.IRAQ, makam.SABA],
				"YISHAQ YEQAR ARGENTINA": [makam.IRAQ],
				"ADES: 24793": [makam.SABA],
				"Dibre Shelomo S KASSIN Pre1915": [makam.SABA],
				"Knis Betesh Geniza List, Aleppo": [makam.SABA],
				"ABRAHAM DWECK Pre1920": [makam.SABA],
				"IDELSOHN Pre1923": [makam.SABA],
				"S SAGIR Laniado": [makam.SABA],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.RAST],
				"ASHEAR list": [makam.IRAQ],
				"ASHEAR NOTES 1936-1940": [makam.SABA],
				"Argentina 1947 & Ezra Mishanieh": [makam.IRAQ],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.SABA],
				"GABRIEL A SHREM 1964 SUHV": [makam.SABA],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.RAST],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.SABA],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.SABA],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.SABA],
				"Yishaq Yeranen Halabi": [makam.SABA],
				"MOSHE AMASH (Shami)": [makam.AJAM],
				"EZRA MASLATON TARAB (Shami)": [makam.SIGAH],
				"ABRAHAM SHAMRICHA (Shami)": [makam.SIGAH],
				"Hallel VeZimrah, Greece List, 1926": [makam.HIJAZ]
			},
			[Parsha.EMOR]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.ASHIRAN],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.ASHIRAN],
				"TEBELE Pre1888": [makam.ASHIRAN],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.ASHIRAN, makam.SABA],
				"YAAQOB ABADI-PARSIYA": [makam.ASHIRAN],
				"YISHAQ YEQAR ARGENTINA": [makam.ASHIRAN],
				"ADES: 24793": [makam.ASHIRAN],
				"Dibre Shelomo S KASSIN Pre1915": [makam.ASHIRAN],
				"Knis Betesh Geniza List, Aleppo": [makam.ASHIRAN],
				"ABRAHAM DWECK Pre1920": [makam.SIGAH],
				"IDELSOHN Pre1923": [makam.ASHIRAN],
				"S SAGIR Laniado": [makam.ASHIRAN],
				"ASHEAR list": [makam.ASHIRAN],
				"ASHEAR NOTES 1936-1940": [makam.SIGAH, makam.HOSENI],
				"Argentina 1947 & Ezra Mishanieh": [makam.ASHIRAN],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.SIGAH, makam.HOSENI],
				"GABRIEL A SHREM 1964 SUHV": [makam.SIGAH, makam.HOSENI],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.SIGAH],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.OJ],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.HOSENI],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.SIGAH],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.SIGAH, makam.HOSENI],
				"Yishaq Yeranen Halabi": [makam.SIGAH],
				"MOSHE AMASH (Shami)": [makam.RAST],
				"EZRA MASLATON TARAB (Shami)": [makam.RAST],
				"ABRAHAM SHAMRICHA (Shami)": [makam.RAST],
				"Hallel VeZimrah, Greece List, 1926": [makam.BUSALIQ]
			},
			[Parsha.BEHAR]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.NAWAH],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.NAWAH],
				"TEBELE Pre1888": [makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [makam.NAWAH],
				"YISHAQ YEQAR ARGENTINA": [makam.SABA],
				"ADES: 24793": [makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [makam.NAWAH],
				"Knis Betesh Geniza List, Aleppo": [makam.NAWAH],
				"ABRAHAM DWECK Pre1920": [makam.NAWAH],
				"IDELSOHN Pre1923": [makam.NAWAH],
				"S SAGIR Laniado": [makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.SABA],
				"ASHEAR NOTES 1936-1940": [makam.NAWAH],
				"ABRAHAM E SHREM ~1945": [makam.SABA],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.NAWAH],
				"GABRIEL A SHREM 1964 SUHV": [makam.NAWAH, makam.SABA],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.BAYAT],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.NAHWAND],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.NAWAH],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.NAWAH],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.NAWAH, makam.SABA],
				"Yishaq Yeranen Halabi": [makam.NAWAH],
				"MOSHE AMASH (Shami)": [makam.SIGAH],
				"ABRAHAM SHAMRICHA (Shami)": [makam.AJAM],
				"Hallel VeZimrah, Greece List, 1926": ["Qargigar"]
			},
			[Parsha.BECHUKOSAI]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.NAWAH],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.NAWAH],
				"TEBELE Pre1888": [makam.NAWAH],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [makam.NAWAH],
				"YISHAQ YEQAR ARGENTINA": [makam.NAWAH],
				"ADES: 24793": [makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [makam.RAHAWI],
				"Knis Betesh Geniza List, Aleppo": [makam.BAYAT],
				"IDELSOHN Pre1923": [makam.NAWAH, makam.BAYAT],
				"S SAGIR Laniado": [makam.NAHWAND],
				"ASHEAR list": [makam.NAWAH],
				"Argentina 1947 & Ezra Mishanieh": [makam.NAHWAND],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.BAYAT],
				"GABRIEL A SHREM 1964 SUHV": [makam.NAHWAND], // Original pizmonim.com: Nawah/Nahwand
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.NAHWAND],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.KURD],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.SABA],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.RAST],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.NAWAH, makam.BAYAT],
				"Yishaq Yeranen Halabi": [makam.BAYAT],
				"MOSHE AMASH (Shami)": [makam.BAYAT],
				"EZRA MASLATON TARAB (Shami)": [makam.AJAM],
				"Hallel VeZimrah, Greece List, 1926": [makam.IRAQ]
			},
			[Parsha.BAMIDBAR]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.MEHAYAR],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.MEHAYAR],
				"TEBELE Pre1888": [makam.MEHAYAR],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [makam.RAST],
				"YISHAQ YEQAR ARGENTINA": [makam.RAST],
				"ADES: 24793": [makam.MEHAYAR],
				"Dibre Shelomo S KASSIN Pre1915": [makam.MEHAYAR, makam.RAST],
				"Knis Betesh Geniza List, Aleppo": [makam.RAST],
				"IDELSOHN Pre1923": [makam.MEHAYAR],
				"S SAGIR Laniado": [makam.RAST],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.RAST],
				"ASHEAR list": [makam.MEHAYAR],
				"ASHEAR NOTES 1936-1940": [makam.HOSENI, makam.RAST],
				"ABRAHAM E SHREM ~1945": [makam.RAST],
				"Argentina 1947 & Ezra Mishanieh": [makam.MEHAYAR],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.SABA, makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [makam.RAST],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.RAST],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.RAST],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.RAST],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.HOSENI, makam.RAST],
				"Yishaq Yeranen Halabi": [makam.BAYAT],
				"MOSHE AMASH (Shami)": [makam.RAST, makam.AJAM],
				"EZRA MASLATON TARAB (Shami)": [makam.RAST],
				"ABRAHAM SHAMRICHA (Shami)": [makam.RAST],
				//"Hallel VeZimrah, Greece List, 1926": "Haqqordo?"
			},
			[Parsha.NASSO]: fillMakamTable(makamHeaders.bamidbar
					.filter(book => book !== "M H Elias, SHIR HADASH, Jerusalem, 1930"),
				[makam.SABA],
				{
					"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.HOSENI, makam.SABA],
					"GABRIEL A SHREM 1964 SUHV": [makam.RAST, makam.SABA], // Original Pizmonim.com: Saba
					"YOSEF YEHEZKEL Jerusalem 1975": [makam.ZANGIRAN],
					"Ish Massliah \"Abia Renanot\" Tunisians": [makam.HOSENI],
					"BOZO, Ades, Shir Ushbaha 2005": [makam.SABA, makam.RAST],
					"Yishaq Yeranen Halabi": [makam.HOSENI, makam.SABA],
					"MOSHE AMASH (Shami)": [makam.SIGAH],
					"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
					"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
					"Hallel VeZimrah, Greece List, 1926": [makam.HIJAZ]
				}),
			[Parsha.BEHAALOSCHA]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.HOSENI],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.OJ],
				"TEBELE Pre1888": [makam.SIGAH],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.SIGAH, makam.HOSENI],
				"YAAQOB ABADI-PARSIYA": [makam.SIGAH],
				"YISHAQ YEQAR ARGENTINA": [makam.SIGAH],
				"ADES: 24793": [makam.OJ],
				"Dibre Shelomo S KASSIN Pre1915": [makam.HOSENI],
				"Knis Betesh Geniza List, Aleppo": [makam.SIGAH],
				"ABRAHAM DWECK Pre1920": [makam.SIGAH],
				"IDELSOHN Pre1923": [makam.SIGAH],
				"S SAGIR Laniado": [makam.SIGAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.SIGAH],
				"ASHEAR list": [makam.SIGAH],
				"ASHEAR NOTES 1936-1940": [makam.SIGAH],
				"ABRAHAM E SHREM ~1945": [makam.SIGAH],
				"Argentina 1947 & Ezra Mishanieh": [makam.SIGAH],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.SIGAH],
				"GABRIEL A SHREM 1964 SUHV": [makam.SIGAH],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.SIGAH],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.SIGAH],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.SIGAH],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.SIGAH],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.SIGAH],
				"Yishaq Yeranen Halabi": [makam.SIGAH],
				"MOSHE AMASH (Shami)": [makam.NAWAH],
				"EZRA MASLATON TARAB (Shami)": [makam.RAHAWI],
				"ABRAHAM SHAMRICHA (Shami)": [makam.NAWAH],
				// "Hallel VeZimrah, Greece List, 1926": "Ushaq"
			},
			[Parsha.SHLACH]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.IRAQ, makam.NAWAH],
				"TEBELE Pre1888": [makam.IRAQ],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.IRAQ, makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [makam.NAWAH],
				"YISHAQ YEQAR ARGENTINA": [makam.HIJAZ],
				"ADES: 24793": [makam.IRAQ, makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [makam.IRAQ],
				"Knis Betesh Geniza List, Aleppo": [makam.IRAQ],
				"ABRAHAM DWECK Pre1920": [makam.HIJAZ],
				"IDELSOHN Pre1923": [makam.IRAQ],
				"S SAGIR Laniado": [makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.HIJAZ],
				"ASHEAR list": [makam.IRAQ],
				"ASHEAR NOTES 1936-1940": [makam.HIJAZ],
				"ABRAHAM E SHREM ~1945": [makam.HIJAZ],
				"Argentina 1947 & Ezra Mishanieh": [makam.IRAQ],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.IRAQ, makam.NAWAH],
				"GABRIEL A SHREM 1964 SUHV": [makam.HIJAZ],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.NAHWAND],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.SHURI],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.NAWAH],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.NAHWAND],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.HIJAZ, makam.NAHWAND],
				"Yishaq Yeranen Halabi": [makam.NAHWAND],
				"MOSHE AMASH (Shami)": [makam.SABA],
				"EZRA MASLATON TARAB (Shami)": [makam.SABA],
				"ABRAHAM SHAMRICHA (Shami)": [makam.SABA],
				"Hallel VeZimrah, Greece List, 1926": [makam.HUZAM]
			},
			[Parsha.KORACH]: {
				//"TABBUSH Ms NLI 8*7622, Aleppo": "Ḥoseni combined",
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.HOSENI],
				"TEBELE Pre1888": [makam.HOSENI],
				//"ELIE SHAUL COHEN FROM AINTAB, ~1880": "Ḥoseni Bayat combined",
				"YAAQOB ABADI-PARSIYA": [makam.HOSENI],
				"YISHAQ YEQAR ARGENTINA": [makam.HOSENI],
				"ADES: 24793": [makam.HOSENI],
				"Dibre Shelomo S KASSIN Pre1915": [makam.HOSENI],
				//"Knis Betesh Geniza List, Aleppo": "Ḥoseni combined",
				//"ABRAHAM DWECK Pre1920": "Ḥoseni combined",
				"IDELSOHN Pre1923": [makam.HOSENI],
				"S SAGIR Laniado": [makam.HOSENI],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.HOSENI],
				"ASHEAR list": [makam.HOSENI],
				"ASHEAR NOTES 1936-1940": [makam.BAYAT],
				"ABRAHAM E SHREM ~1945": [makam.NAHWAND],
				"Argentina 1947 & Ezra Mishanieh": [makam.HOSENI],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.HOSENI],
				"GABRIEL A SHREM 1964 SUHV": [makam.NAHWAND],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.BAYAT],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.HOSENI],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.NAHWAND],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.NAHWAND, makam.HOSENI],
				"Yishaq Yeranen Halabi": [makam.HOSENI],
				"MOSHE AMASH (Shami)": [makam.BAYAT],
				"EZRA MASLATON TARAB (Shami)": [makam.SIGAH],
				"ABRAHAM SHAMRICHA (Shami)": [makam.SIGAH],
				"Hallel VeZimrah, Greece List, 1926": [makam.IRAQ]
			},
			[Parsha.CHUKAS]: {
				//"TABBUSH Ms NLI 8*7622, Aleppo": "Ḥoseni combined",
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.HOSENI],
				"TEBELE Pre1888": [makam.HOSENI],
				"YAAQOB ABADI-PARSIYA": [makam.BAYAT],
				"ADES: 24793": [makam.HOSENI],
				"Dibre Shelomo S KASSIN Pre1915": [makam.RAST],
				"IDELSOHN Pre1923": [makam.RAST],
				"S SAGIR Laniado": [makam.MAHOUR],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.ASHIRAN],
				"ASHEAR NOTES 1936-1940": [makam.BAYAT],
				"ABRAHAM E SHREM ~1945": [makam.HOSENI],
				"Argentina 1947 & Ezra Mishanieh": [makam.HOSENI],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [makam.HOSENI],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.AJAM],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.RAST],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.RAST, makam.HOSENI],
				"Yishaq Yeranen Halabi": [makam.RAST],
				"MOSHE AMASH (Shami)": [makam.AJAM],
				"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [makam.AJAM],
				"Hallel VeZimrah, Greece List, 1926": [makam.SUZNIQ]
			},
			[Parsha.BALAK]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.BAYAT],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.BAYAT],
				"TEBELE Pre1888": [makam.BAYAT],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.BAYAT],
				"YISHAQ YEQAR ARGENTINA": [makam.RAST],
				"ADES: 24793": [makam.BAYAT],
				"Dibre Shelomo S KASSIN Pre1915": [makam.BAYAT],
				"Knis Betesh Geniza List, Aleppo": [makam.BAYAT],
				"ABRAHAM DWECK Pre1920": [makam.BAYAT],
				"IDELSOHN Pre1923": [makam.BAYAT],
				"S SAGIR Laniado": [makam.BAYAT],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.RAST],
				"ASHEAR list": [makam.NAHWAND],
				"ASHEAR NOTES 1936-1940": [makam.NAHWAND],
				"ABRAHAM E SHREM ~1945": [makam.MAHOUR],
				"Argentina 1947 & Ezra Mishanieh": [makam.NAHWAND],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.BAYAT],
				"GABRIEL A SHREM 1964 SUHV": [makam.MAHOUR],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.BAYAT],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.BAYAT],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.RAST],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.BAYAT, makam.MAHOUR],
				"Yishaq Yeranen Halabi": [makam.BAYAT],
				"MOSHE AMASH (Shami)": [makam.SIGAH],
				"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
				"Hallel VeZimrah, Greece List, 1926": [makam.SIGAH]
			},
			[Parsha.PINCHAS]: fillMakamTable(makamHeaders.bamidbar,
				[makam.SABA],
				{
					"TABBUSH Ms NLI 8*7622, Aleppo": [makam.BAYAT],
					"ASHEAR NOTES 1936-1940": [makam.SABA, makam.BAYAT],
					"YOSEF YEHEZKEL Jerusalem 1975": [makam.BUSTANIGAR],
					"Hallel VeZimrah, Greece List, 1926": [makam.MUHAYER]
				}),
			[Parsha.MATOS]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.NAWAH],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.NAWAH],
				"TEBELE Pre1888": [makam.NAWAH],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [makam.NAWAH],
				"YISHAQ YEQAR ARGENTINA": [makam.BAYAT],
				"ADES: 24793": [makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [makam.NAWAH],
				"Knis Betesh Geniza List, Aleppo": [makam.NAWAH],
				"ABRAHAM DWECK Pre1920": [makam.NAWAH],
				"IDELSOHN Pre1923": [makam.NAWAH],
				"S SAGIR Laniado": [makam.NAWAH, makam.NAHWAND],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.RAHAWI],
				"ASHEAR list": [makam.NAWAH],
				"ASHEAR NOTES 1936-1940": [makam.BAYAT],
				"ABRAHAM E SHREM ~1945": [makam.NAHWAND],
				"Argentina 1947 & Ezra Mishanieh": [makam.NAHWAND],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.NAWAH],
				"GABRIEL A SHREM 1964 SUHV": [makam.RAHAWI, makam.NAHWAND],// Pizmonim.com[makam.NAWAH, makam.NAHWAND],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.SABA],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.NAHWAND],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.SABA],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.NAWAH],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.NAWAH, makam.NAHWAND],
				"Yishaq Yeranen Halabi": [makam.NAWAH],
				"MOSHE AMASH (Shami)": [makam.RAST],
				"EZRA MASLATON TARAB (Shami)": [makam.MAHOUR],
				"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
				"Hallel VeZimrah, Greece List, 1926": [makam.SABA]
			},
			[Parsha.MASEI]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.SABA],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.SABA],
				"TEBELE Pre1888": [makam.SABA],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.SABA],
				"YAAQOB ABADI-PARSIYA": [makam.NAHWAND],
				"YISHAQ YEQAR ARGENTINA": [makam.NAHWAND],
				"ADES: 24793": [makam.SABA],
				"Dibre Shelomo S KASSIN Pre1915": [makam.MEHAYAR],
				"Knis Betesh Geniza List, Aleppo": [makam.SABA],
				"IDELSOHN Pre1923": [makam.SABA],
				"S SAGIR Laniado": [makam.NAWAH, makam.NAHWAND],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.SABA],
				"ASHEAR list": [makam.SABA],
				"ASHEAR NOTES 1936-1940": [makam.NAWAH],
				"ABRAHAM E SHREM ~1945": [makam.SABA],
				"Argentina 1947 & Ezra Mishanieh": [makam.SABA],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.SABA],
				"GABRIEL A SHREM 1964 SUHV": [makam.SABA],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.NAHWAND],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.SABA, makam.ISFAHAN],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.NAHWAND],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.NAHWAND],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.BAYAT, makam.SABA],
				"Yishaq Yeranen Halabi": [makam.SABA],
				"MOSHE AMASH (Shami)": [makam.BAYAT],
				"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
				"Hallel VeZimrah, Greece List, 1926": [makam.NAHWAND]
			},
			[Parsha.DEVARIM]: fillMakamTable(makamHeaders.devarim, [makam.HIJAZ],
			{
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.ZANGIRAN],
				"Hallel VeZimrah, Greece List, 1926": [makam.AJAM]
			}),
			[Parsha.VAESCHANAN]: fillMakamTable(makamHeaders.devarim,
				[makam.HOSENI],
				{
					"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.HOSENI, makam.ASHIRAN],
					"Knis Betesh Geniza List, Aleppo": [makam.ASHIRAN],
					"ABRAHAM DWECK Pre1920": [makam.ASHIRAN],
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.BAYAT],
					"Shaare Zimra YANANI Buenos Aires, 01": [makam.BAYAT],
					"MOSHE AMASH (Shami)": [makam.RAST],
					"EZRA MASLATON TARAB (Shami)": [makam.RAST],
					"ABRAHAM SHAMRICHA (Shami)": [makam.RAST],
					"Hallel VeZimrah, Greece List, 1926": [makam.RAST]
				}),
			[Parsha.EIKEV]: fillMakamTable(
				makamHeaders.devarim.filter(book => book !== "TABBUSH Ms NLI 8*7622, Aleppo"),
				[makam.SIGAH],
				{
					"YISHAQ YEQAR ARGENTINA": [makam.RAST],
					"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.RAST],
					"ASHEAR NOTES 1936-1940": [makam.SIGAH, makam.IRAQ],
					"Shaare Zimra YANANI Buenos Aires, 01": [makam.RAST],
					"BOZO, Ades, Shir Ushbaha 2005": [makam.SIGAH, makam.IRAQ],
					"Hallel VeZimrah, Greece List, 1926": [makam.QARGIGAR]
				}),
			[Parsha.REEH]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.IRAQ, makam.RAST],
				"TEBELE Pre1888": [makam.ASHIRAN],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.IRAQ],
				"YAAQOB ABADI-PARSIYA": [makam.RAST],
				"YISHAQ YEQAR ARGENTINA": [makam.ASHIRAN],
				"ADES: 24793": [makam.IRAQ],
				"Dibre Shelomo S KASSIN Pre1915": [makam.IRAQ],
				"Knis Betesh Geniza List, Aleppo": [makam.SABA],
				"ABRAHAM DWECK Pre1920": [makam.SABA],
				"IDELSOHN Pre1923": [makam.IRAQ],
				"S SAGIR Laniado": [makam.NAHWAND],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.NAWAH],
				"ASHEAR list": [makam.ASHIRAN],
				"ASHEAR NOTES 1936-1940": [makam.BAYAT],
				"ABRAHAM E SHREM ~1945": [makam.BAYAT],
				"Argentina 1947 & Ezra Mishanieh": [makam.ASHIRAN],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.SIGAH, makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [makam.RAST],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.RAST],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.RAST],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.RAST],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.RAST],
				"Yishaq Yeranen Halabi": [makam.RAST],
				"MOSHE AMASH (Shami)": [makam.BAYAT],
				"EZRA MASLATON TARAB (Shami)": [makam.NAWAH],
				"ABRAHAM SHAMRICHA (Shami)": [makam.NAWAH],
				"Hallel VeZimrah, Greece List, 1926": ["Ḥoseni"]
			},
			[Parsha.SHOFTIM]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.SABA],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.SABA, makam.SIGAH],
				"TEBELE Pre1888": [makam.SABA],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.SIGAH, makam.SABA],
				"YAAQOB ABADI-PARSIYA": [makam.SABA],
				"YISHAQ YEQAR ARGENTINA": [makam.AJAM],
				"ADES: 24793": [makam.SABA, makam.SIGAH],
				"Dibre Shelomo S KASSIN Pre1915": [makam.SASGAR],
				"Knis Betesh Geniza List, Aleppo": [makam.AJAM],
				"ABRAHAM DWECK Pre1920": [makam.AJAM],
				"IDELSOHN Pre1923": [makam.SIGAH],
				"S SAGIR Laniado": [makam.AJAM],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.AJAM],
				"ASHEAR list": [makam.SABA],
				"ASHEAR NOTES 1936-1940": [makam.AJAM],
				"ABRAHAM E SHREM ~1945": [makam.AJAM],
				"Argentina 1947 & Ezra Mishanieh": [makam.SABA],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.SABA],
				"GABRIEL A SHREM 1964 SUHV": [makam.AJAM],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.AJAM],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.GIRKA],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.SABA, makam.AJAM],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.AJAM],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.SIGAH, makam.AJAM],
				"Yishaq Yeranen Halabi": [makam.AJAM],
				"MOSHE AMASH (Shami)": [makam.AJAM],
				"EZRA MASLATON TARAB (Shami)": [makam.AJAM],
				"ABRAHAM SHAMRICHA (Shami)": [makam.AJAM],
				"Hallel VeZimrah, Greece List, 1926": [makam.HIJAZ]
			},
			[Parsha.KI_SEITZEI]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.SABA],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.SABA, makam.RAST],
				"TEBELE Pre1888": [makam.SABA],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.RAST, makam.IRAQ, makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [makam.RAST],
				"YISHAQ YEQAR ARGENTINA": [makam.SABA],
				"ADES: 24793": [makam.SABA, makam.RAST],
				"Dibre Shelomo S KASSIN Pre1915": [makam.SABA],
				"Knis Betesh Geniza List, Aleppo": [makam.RAST],
				"ABRAHAM DWECK Pre1920": [makam.NAHWAND],
				"IDELSOHN Pre1923": [makam.SABA],
				"S SAGIR Laniado": [makam.RAST],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.SABA],
				"ASHEAR list": [makam.NAWAH],
				"ASHEAR NOTES 1936-1940": [makam.SABA, makam.SIGAH],
				"ABRAHAM E SHREM ~1945": [makam.SABA],
				"Argentina 1947 & Ezra Mishanieh": [makam.NAHWAND],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [makam.SABA],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.SABA],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.BAYAT, makam.AJAM],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.RAST],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.SABA],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.SABA],
				"Yishaq Yeranen Halabi": [makam.SABA],
				"MOSHE AMASH (Shami)": [makam.SIGAH],
				"EZRA MASLATON TARAB (Shami)": [makam.SIGAH],
				"ABRAHAM SHAMRICHA (Shami)": [makam.SIGAH],
				"Hallel VeZimrah, Greece List, 1926": [makam.BAYATI]
			},
			[Parsha.KI_SAVO]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.IRAQ],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.IRAQ],
				"TEBELE Pre1888": [makam.IRAQ],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.IRAQ],
				"YAAQOB ABADI-PARSIYA": [makam.IRAQ],
				"YISHAQ YEQAR ARGENTINA": [makam.NAWAH],
				"ADES: 24793": [makam.IRAQ],
				"Dibre Shelomo S KASSIN Pre1915": [makam.IRAQ],
				"Knis Betesh Geniza List, Aleppo": [makam.IRAQ],
				"ABRAHAM DWECK Pre1920": [makam.RAST],
				"IDELSOHN Pre1923": [makam.IRAQ],
				"S SAGIR Laniado": [makam.SIGAH],
				"ASHEAR list": [makam.IRAQ],
				"ASHEAR NOTES 1936-1940": [makam.NAWAH, makam.SABA, makam.SIGAH],
				"ABRAHAM E SHREM ~1945": [makam.SIGAH],
				"Argentina 1947 & Ezra Mishanieh": [makam.IRAQ],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.SIGAH],
				"GABRIEL A SHREM 1964 SUHV": [makam.SIGAH],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.SIGAH],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.OJ],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.HIJAZ],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.SIGAH],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.SIGAH, makam.IRAQ],
				"Yishaq Yeranen Halabi": [makam.SIGAH],
				"MOSHE AMASH (Shami)": [makam.SABA],
				"EZRA MASLATON TARAB (Shami)": [makam.SABA],
				"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
				"Hallel VeZimrah, Greece List, 1926": ["Sigah"]
			},
			[Parsha.NITZAVIM]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.NAWAH],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.NAWAH],
				"TEBELE Pre1888": [makam.NAWAH],
				"ELIE SHAUL COHEN FROM AINTAB, ~1880": [makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [makam.NAWAH],
				"YISHAQ YEQAR ARGENTINA": [makam.RAST],
				"ADES: 24793": [makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [makam.NAWAH],
				"Knis Betesh Geniza List, Aleppo": [makam.NAWAH],
				"ABRAHAM DWECK Pre1920": [makam.HIJAZ],
				"IDELSOHN Pre1923": [makam.NAWAH],
				"S SAGIR Laniado": [makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.RAST],
				"ASHEAR list": [makam.NAWAH],
				//"ASHEAR NOTES 1936-1940": "Ḥijaz, H/H",
				"ABRAHAM E SHREM ~1945": [makam.NAHWAND],
				"Argentina 1947 & Ezra Mishanieh": [makam.NAHWAND],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.NAWAH],
				"GABRIEL A SHREM 1964 SUHV": [makam.NAHWAND], //Original Pizmonim.com: ["Nawa", makam.NAHWAND],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.RAST],
				"YOSEF YEHEZKEL Jerusalem 1975": [makam.RAST],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.NAHWAND],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.NAWAH, makam.NAHWAND],
				"Yishaq Yeranen Halabi": [makam.NAWAH],
				"MOSHE AMASH (Shami)": [makam.AJAM],
				"EZRA MASLATON TARAB (Shami)": [makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [makam.SIGAH],
				"Hallel VeZimrah, Greece List, 1926": [makam.SABA]
			},
			[Parsha.VAYEILECH]: {
				"TABBUSH Ms NLI 8*7622, Aleppo": [makam.NAWAH],
				"R COHEN \"SHIR USHBAHA\" Jerusalem, 1905": [makam.NAWAH],
				"YAAQOB ABADI-PARSIYA": [makam.RAST],
				"YISHAQ YEQAR ARGENTINA": [makam.HIJAZ],
				"ADES: 24793": [makam.NAWAH],
				"Dibre Shelomo S KASSIN Pre1915": [makam.NAWAH],
				"S SAGIR Laniado": [makam.NAWAH],
				"M H Elias, SHIR HADASH, Jerusalem, 1930": [makam.HOSENI],
				"ASHEAR NOTES 1936-1940": [makam.HOSENI],
				"ABRAHAM E SHREM ~1945": [makam.BAYAT, makam.HOSENI],
				"Argentina 1947 & Ezra Mishanieh": [makam.AJAM],
				"Shire Zimra H S ABOUD Jerusalem, 1950": [makam.RAST],
				"GABRIEL A SHREM 1964 SUHV": [makam.HOSENI],
				"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.BAYAT],
				"Ish Massliah \"Abia Renanot\" Tunisians": [makam.RAST],
				"Shaare Zimra YANANI Buenos Aires, 01": [makam.BAYAT],
				"BOZO, Ades, Shir Ushbaha 2005": [makam.RAST, makam.HOSENI],
				"Yishaq Yeranen Halabi": [makam.RAST],
				"MOSHE AMASH (Shami)": [makam.BAYAT],
				"ABRAHAM SHAMRICHA (Shami)": [makam.AJAM],
				"Hallel VeZimrah, Greece List, 1926": [makam.HOSENI]
			},
			[Parsha.HAAZINU]: fillMakamTable(
				makamHeaders.devarim
					.filter(book => !["M H Elias, SHIR HADASH, Jerusalem, 1930", "ASHEAR NOTES 1936-1940"].includes(book)),
				[makam.HOSENI],
				{
					"S SAGIR Laniado": [makam.BAYAT],
					"ABRAHAM E SHREM ~1945": [makam.BAYAT],
					"GABRIEL A SHREM 1964 SUHV": [makam.MEHAYAR],
					"D KASSIN/ ISAAC CAIN; RODFE SEDEQ; MEXICO": [makam.BAYAT],
					"YOSEF YEHEZKEL Jerusalem 1975": [makam.SHURI],
					"Shaare Zimra YANANI Buenos Aires, 01": [makam.BAYAT],
					"BOZO, Ades, Shir Ushbaha 2005": [makam.HOSENI, makam.MEHAYAR],
					"MOSHE AMASH (Shami)": [makam.AJAM],
					"EZRA MASLATON TARAB (Shami)": [makam.AJAM],
					"ABRAHAM SHAMRICHA (Shami)": [makam.BAYAT],
					"Hallel VeZimrah, Greece List, 1926": [makam.NAHWAND]
				})
			// Parsha.VZOS_HABERACHA is unused
		}

		data[Parsha.VAYAKHEL_PEKUDEI] = {
			...data[Parsha.VAYAKHEL],
			"GABRIEL A SHREM 1964 SUHV": [makam.BAYAT]
		}
		data[Parsha.TAZRIA_METZORA] = {
			...data[Parsha.TAZRIA],
			"GABRIEL A SHREM 1964 SUHV": [makam.SABA]
		}
		data[Parsha.ACHREI_MOS_KEDOSHIM] = {
			...data[Parsha.ACHREI_MOS],
			"GABRIEL A SHREM 1964 SUHV": [makam.BAYAT, makam.HIJAZ]
		}
		data[Parsha.BEHAR_BECHUKOSAI] = {
			...data[Parsha.BEHAR],
			"GABRIEL A SHREM 1964 SUHV": [makam.SABA]
			// https://pizmonim.com/weekly.php?parasha=behar says when they are combined to do some other things
			// However, he prefaces them with 2020, and the actual Sefarim say otherwise. Curious as to why
		}
		data[Parsha.CHUKAS_BALAK] = {
			...data[Parsha.CHUKAS],
			"GABRIEL A SHREM 1964 SUHV": [makam.HOSENI]
		}
		data[Parsha.MATOS_MASEI] = {
			...data[Parsha.MATOS],
			"GABRIEL A SHREM 1964 SUHV": [makam.SABA]
		}
		data[Parsha.NITZAVIM_VAYEILECH] = {
			...data[Parsha.NITZAVIM],
			"GABRIEL A SHREM 1964 SUHV": [makam.HOSENI]
		}

		if (jCal.getJewishMonth() == JewishCalendar.TISHREI && jCal.getJewishDayOfMonth() > 10) {
			data[Parsha.HAAZINU]!["ASHEAR NOTES 1936-1940"] = [makam.HOSENI]
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
				data[jCal.getParshah()]!["GABRIEL A SHREM 1964 SUHV"] = [makam.HOSENI];

			return data[jCal.getParshah()]!
		}

		if (jCal.getDayOfChanukah() !== -1) {
			return {
				1: {
					"SASSOON #647 Aleppo, 1850": [makam.RAHAWI],
					"GABRIEL A SHREM 1964 SUHV": [makam.RAHAWI],
					"ABRAHAM SHAMRICHA (Shami)": [makam.NAWAH]
				},
				2: {
					"SASSOON #647 Aleppo, 1850": [makam.IRAQ],
					"GABRIEL A SHREM 1964 SUHV": [makam.IRAQ]
				},
				3: {
					"SASSOON #647 Aleppo, 1850": [makam.SIGAH],
					"GABRIEL A SHREM 1964 SUHV": [makam.SIGAH]
				},
				4: {
					"SASSOON #647 Aleppo, 1850": [makam.SABA],
					"GABRIEL A SHREM 1964 SUHV": [makam.SABA]
				},
				5: {
					"SASSOON #647 Aleppo, 1850": [makam.RAST],
					"GABRIEL A SHREM 1964 SUHV": [makam.RAST]
				},
				6: {
					"GABRIEL A SHREM 1964 SUHV": [makam.NAHWAND]
				},
				7: {
					"GABRIEL A SHREM 1964 SUHV": [makam.SIGAH]
				},
				8: {
					"GABRIEL A SHREM 1964 SUHV": [makam.BAYAT]
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

function fillMakamTable(table:string[], makam:(makam|string)[], exceptions:getMaqamReturnType):getMaqamReturnType {
	return Object.assign(Object.fromEntries(table.map(book => [book, makam])), exceptions);
}