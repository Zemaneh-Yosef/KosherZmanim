import { Calendar } from "../../polyfills/Utils";
import { Temporal } from "temporal-polyfill";
import { HebrewDateFormatter } from "../HebrewDateFormatter";
import { JewishDate } from "../JewishDate";
import { IllegalArgumentException } from "../../polyfills/errors";

const masechtaNameEng = [
    "Berachot",
    "Peah",
    "Demai",
    "Kilayim",
    "Sheviit",
    "Terumot",
    "Maasrot",
    "Maaser Sheni",
    "Challah",
    "Orlah",
    "Bikurim",
    "Shabbat",
    "Eruvin",
    "Pesachim",
    "Shekalim",
    "Yoma",
    "Sukkah",
    "Beitzah",
    "Rosh Hashanah",
    "Taanit",
    "Megillah",
    "Moed Katan",
    "Chagigah",
    "Yevamot",
    "Ketubot",
    "Nedarim",
    "Nazir",
    "Sotah",
    "Gittin",
    "Kiddushin",
    "Bava Kamma",
    "Bava Metzia",
    "Bava Batra",
    "Sanhedrin",
    "Makkot",
    "Shevuot",
    "Eduyot",
    "Avodah Zarah",
    "Avot",
    "Horiyot",
    "Zevachim",
    "Menachot",
    "Chullin",
    "Bechorot",
    "Arachin",
    "Temurah",
    "Keritot",
    "Meilah",
    "Tamid",
    "Midot",
    "Kinnim",
    "Keilim",
    "Ohalot",
    "Negaim",
    "Parah",
    "Tahorot",
    "Mikvaot",
    "Niddah",
    "Machshirin",
    "Zavim",
    "Tevul Yom",
    "Yadayim",
    "Uktzin"
];

const masechtaNameHeb = [
	"ברכות",
	"פאה",
	"דמאי",
	"כלאים",
	"שביעית",
	"תרומות",
	"מעשרות",
	"מעשר שני",
	"חלה",
	"ערלה",
	"ביכורים",
	"שבת",
	"ערובין",
	"פסחים",
	"שקלים",
	"יומא",
	"סוכה",
	"ביצה",
	"ראש השנה",
	"תענית",
	"מגילה",
	"מועד קטן",
	"חגיגה",
	"יבמות",
	"כתובות",
	"נדרים",
	"נזיר",
	"סוטה",
	"גיטין",
	"קידושין",
	"בבא קמא",
	"בבא מציעא",
	"בבא בתרא",
	"סנהדרין",
	"מכות",
	"שבועות",
	"עדויות",
	"עבודה זרה",
	"אבות",
	"הוריות",
	"זבחים",
	"מנחות",
	"חולין",
	"בכורות",
	"ערכין",
	"תמורה",
	"כריתות",
	"מעילה",
	"תמיד",
	"מדות",
	"קינים",
	"כלים",
	"אהלות",
	"נגעים",
	"פרה",
	"טהרות",
	"מקואות",
	"נדה",
	"מכשירין",
	"זבים",
	"טבול יום",
	"ידים",
	"עוקצין",
]

export default class MishnaYomi {
	/** The start date of the Mishna Yomi Cycle. */
	private static readonly CYCLE_START_DATE = Temporal.PlainDate.from({ year: 1947, month: Calendar.MAY, day: 20 });
	/** The number of mishnas in a day. */
	public static readonly MISHNAS_PER_DAY = 2;
	public static readonly NUM_MISHNAS = 4192;
	public static readonly CYCLE_LENGTH = this.NUM_MISHNAS / this.MISHNAS_PER_DAY;  // 2075 mishnas

	public static readonly UNITS = [
		[5, 8, 6, 7, 5, 8, 5, 8, 5],
		[6, 8, 8, 11, 8, 11, 8, 9],
		[4, 5, 6, 7, 11, 12, 8],
		[9, 11, 7, 9, 8, 9, 8, 6, 10],
		[8, 10, 10, 10, 9, 6, 7, 11, 9, 9],
		[10, 6, 9, 13, 9, 6, 7, 12, 7, 12, 10],
		[8, 8, 10, 6, 8],
		[7, 10, 13, 12, 15],
		[9, 8, 10, 11],
		[9, 17, 9],
		[11, 11, 12, 5],
		[11, 7, 6, 2, 4, 10, 4, 7, 7, 6, 6, 6, 7, 4, 3, 8, 8, 3, 6, 5, 3, 6, 5, 5],
		[10, 6, 9, 11, 9, 10, 11, 11, 4, 15],
		[7, 8, 8, 9, 10, 6, 13, 8, 11, 9],
		[7, 5, 4, 9, 6, 6, 7, 8],
		[8, 7, 11, 6, 7, 8, 5, 9],
		[11, 9, 15, 10, 8],
		[10, 10, 8, 7, 7],
		[9, 8, 9, 9],
		[7, 10, 9, 8],
		[11, 6, 6, 10],
		[10, 5, 9],
		[8, 7, 8],
		[4, 10, 10, 13, 6, 6, 6, 6, 6, 9, 7, 6, 13, 9, 10, 7],
		[10, 10, 9, 12, 9, 7, 10, 8, 9, 6, 6, 4, 11],
		[4, 5, 11, 8, 6, 10, 9, 7, 10, 8, 12],
		[7, 10, 7, 7, 7, 11, 4, 2, 5],
		[9, 6, 8, 5, 5, 4, 8, 7, 15],
		[6, 7, 8, 9, 9, 7, 9, 10, 10],
		[10, 10, 13, 14],
		[4, 6, 11, 9, 7, 6, 7, 7, 12, 10],
		[8, 11, 12, 12, 11, 8, 11, 9, 13, 6],
		[6, 14, 8, 9, 11, 8, 4, 8, 10, 8],
		[6, 5, 8, 5, 5, 6, 11, 7, 6, 6, 6],
		[10, 8, 16],
		[7, 5, 11, 13, 5, 7, 8, 6],
		[14, 10, 12, 12, 7, 3, 9, 7],
		[9, 7, 10, 12, 12],
		[18, 16, 18, 22, 23, 11],
		[5, 7, 8],
		[4, 5, 6, 6, 8, 7, 6, 12, 7, 8, 8, 6, 8, 10],
		[4, 5, 7, 5, 9, 7, 6, 7, 9, 9, 9, 5, 11],
		[7, 10, 7, 7, 5, 7, 6, 6, 8, 4, 2, 5],
		[7, 9, 4, 10, 6, 12, 7, 10, 8],
		[4, 6, 5, 4, 6, 5, 5, 7, 8],
		[6, 3, 5, 4, 6, 5, 6],
		[7, 6, 10, 3, 8, 9],
		[4, 9, 8, 6, 5, 6],
		[4, 5, 9, 3, 6, 4, 3],
		[9, 6, 8, 7, 4],
		[4, 5, 6],
		[9, 8, 8, 4, 11, 4, 6, 11, 8, 8, 9, 8, 8, 8, 6, 8, 17, 9, 10, 7, 3, 10, 5, 17, 9, 9, 12, 10, 8, 4],
		[8, 7, 7, 3, 7, 7, 6, 6, 16, 7, 9, 8, 6, 7, 10, 5, 5, 10],
		[6, 5, 8, 11, 5, 8, 5, 10, 3, 10, 12, 7, 12, 13],
		[4, 5, 11, 4, 9, 5, 12, 11, 9, 6, 9, 11],
		[9, 8, 8, 13, 9, 10, 9, 9, 9, 8],
		[8, 10, 4, 5, 6, 11, 7, 5, 7, 8],
		[7, 7, 7, 7, 9, 14, 5, 4, 11, 8],
		[6, 11, 8, 10, 11, 8],
		[6, 4, 3, 7, 12],
		[5, 8, 6, 7],
		[5, 4, 5, 8],
		[6, 10, 12],
	];

	public static getMishnaForDate(calendar: JewishDate, useHebrewText: boolean): string {
		let nextCycle: Temporal.PlainDate = MishnaYomi.CYCLE_START_DATE;
		let prevCycle: Temporal.PlainDate = MishnaYomi.CYCLE_START_DATE;
		const requested: Temporal.PlainDate = calendar.getDate();

		if (Temporal.PlainDate.compare(requested, MishnaYomi.CYCLE_START_DATE) == -1) {
			throw new IllegalArgumentException(`${requested} is prior to organized Daf Yomi Yerushalmi cycles that started on ${MishnaYomi.CYCLE_START_DATE}`);
		}

		// Go cycle by cycle, until we get the next cycle
		while (Temporal.PlainDate.compare(nextCycle, requested) == -1) {
			prevCycle = nextCycle;
	  
			// Adds the number of whole shas dafs, and then the number of days that not have daf.
			nextCycle = nextCycle.add({ days: MishnaYomi.CYCLE_LENGTH });
		}

		// Get the number of days from cycle start until request.
		const numberOfMishnasRead = requested.since(prevCycle).total({ unit: 'days' }) * MishnaYomi.MISHNAS_PER_DAY;

		// Finally find the mishna.
		const { masechet: sFirstMasechta, perek: sFirstPerek, mishna: sFirstMishna } = this.findMishna(numberOfMishnasRead)!;

		// Again for the second mishna which could be in the next masechta
		const { masechet: sSecondMasechta, perek: sSecondPerek, mishna: sSecondMishna } = MishnaYomi.findMishna(numberOfMishnasRead + 1)!;

		const hebrewDateFormatter = new HebrewDateFormatter();
		hebrewDateFormatter.setUseGershGershayim(false);

		if (sFirstMasechta !== sSecondMasechta) {
			return [
				[sFirstMasechta, sFirstPerek, sFirstMishna],
				[sSecondMasechta, sSecondPerek, sSecondMishna]
			].map(([massechet, perek, mishna]) =>
				(useHebrewText ? masechtaNameHeb : masechtaNameEng)[massechet]
				+ " "
				+ (useHebrewText ? hebrewDateFormatter.formatHebrewNumber(perek) : perek)
				+ ":"
				+ (useHebrewText ? hebrewDateFormatter.formatHebrewNumber(mishna) : mishna)
			).join(" - ")
		} else if (sFirstPerek !== sSecondPerek) {
			return (useHebrewText ? masechtaNameHeb : masechtaNameEng)[sFirstMasechta]
				+ " "
				+ [
					[sFirstPerek, sFirstMishna],
					[sSecondPerek, sSecondMishna]
				].map(([perek, mishna]) =>
					(useHebrewText ? hebrewDateFormatter.formatHebrewNumber(perek) : perek)
					+ ":"
					+ (useHebrewText ? hebrewDateFormatter.formatHebrewNumber(mishna) : mishna)
				).join(" - ")
		} else {
			return (useHebrewText ? masechtaNameHeb : masechtaNameEng)[sFirstMasechta]
				+ " "
				+ (useHebrewText ? hebrewDateFormatter.formatHebrewNumber(sFirstPerek) : sFirstPerek)
				+ ":"
				+ [sFirstMishna, sSecondMishna].map((mishna) =>
					(useHebrewText ? hebrewDateFormatter.formatHebrewNumber(mishna) : mishna)
				).join("-")
		}
	}

	private static findMishna(numberOfMishnasRead: number) {
		for (const perakim of MishnaYomi.UNITS) {
			for (let i = 0; i < perakim.length; i++) {
				const perek = i + 1;
				const numberOfMishnayot = perakim[i];
				let currentMishna = 1;
				if (numberOfMishnasRead >= 0) {
					for (let j = 0; j < numberOfMishnayot; j++) {
						if (numberOfMishnasRead == 0) {
							return {
								masechet: MishnaYomi.UNITS.indexOf(perakim),
								perek,
								mishna: currentMishna
							};
						}
						numberOfMishnasRead -= 1;
						currentMishna += 1;
					}
				}
			}
		}
	}
}