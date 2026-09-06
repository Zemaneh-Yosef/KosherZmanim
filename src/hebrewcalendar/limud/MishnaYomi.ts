// @ts-check

import { Calendar } from "../../polyfills/Utils";

import { HebrewDateFormatter } from "../HebrewDateFormatter";
import JewishDate from "../JewishDate";
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

	/**
	 * Returns the daily Mishna Yomi assignment for a given date.
	 */
	public static getMishnaForDate(calendar: JewishDate, useHebrewText: boolean): string {
		return MishnaYomi._getMishnaForPlainDate(calendar.getDate(), useHebrewText);
	}

	/**
	 * Returns an array of daily Mishna Yomi assignments for each day from startDate to endDate (inclusive).
	 * Dates are automatically swapped if startDate > endDate.
	 */
	public static getMishnaRange(
		startDate: JewishDate,
		endDate: JewishDate,
		useHebrewText: boolean
	): string[] {
		let start = startDate.getDate();
		let end = endDate.getDate();

		// Ensure chronological order
		if (Temporal.PlainDate.compare(start, end) > 0) {
			[start, end] = [end, start];
		}

		const results: string[] = [];
		let current = start;
		while (Temporal.PlainDate.compare(current, end) <= 0) {
			results.push(MishnaYomi._getMishnaForPlainDate(current, useHebrewText));
			current = current.add({ days: 1 });
		}
		return results;
	}

	/**
	 * Returns a concatenated string of daily Mishna Yomi assignments for the date range.
	 * @param separator - string to join each day's assignment (default: newline).
	 */
	public static getMishnaRangeAsString(
		startDate: JewishDate,
		endDate: JewishDate,
		useHebrewText: boolean,
		separator: string = "\n"
	): string {
		return MishnaYomi.getMishnaRange(startDate, endDate, useHebrewText).join(separator);
	}

	public static getMishnaRangeSummary(
		startDate: JewishDate,
		endDate: JewishDate,
		useHebrewText: boolean
	): string {
		let start = startDate.getDate();
		let end = endDate.getDate();

		// Ensure chronological order
		if (Temporal.PlainDate.compare(start, end) > 0) {
			[start, end] = [end, start];
		}

		// Absolute days from cycle start (no cycle-finding needed)
		const absStartDays = Math.floor(start.since(MishnaYomi.CYCLE_START_DATE).total({ unit: 'days' }));
		const absEndDays = Math.floor(end.since(MishnaYomi.CYCLE_START_DATE).total({ unit: 'days' }));

		// First mishna of the start day (0-based index in the cycle)
		const firstIdx = (absStartDays * MishnaYomi.MISHNAS_PER_DAY) % MishnaYomi.NUM_MISHNAS;
		// Last mishna of the end day
		const lastIdx = (absEndDays * MishnaYomi.MISHNAS_PER_DAY + 1) % MishnaYomi.NUM_MISHNAS;

		// Look up both mishnayot
		const { masechet: m1, perek: p1, mishna: mi1 } = MishnaYomi.findMishna(firstIdx);
		const { masechet: m2, perek: p2, mishna: mi2 } = MishnaYomi.findMishna(lastIdx);

		const hebrewDateFormatter = new HebrewDateFormatter();
		hebrewDateFormatter.setUseGershGershayim(true);

		const masechtaNames = useHebrewText ? masechtaNameHeb : masechtaNameEng;
		const formatNumber = (n: number) =>
			useHebrewText ? hebrewDateFormatter.formatHebrewNumber(n) : String(n);

		// Format the summary
		if (m1 === m2) {
			const base = masechtaNames[m1];
			if (p1 === p2) {
				return `${base} ${formatNumber(p1)}:${formatNumber(mi1)}-${formatNumber(mi2)}`;
			} else {
				return `${base} ${formatNumber(p1)}:${formatNumber(mi1)} - ${formatNumber(p2)}:${formatNumber(mi2)}`;
			}
		} else {
			return `${masechtaNames[m1]} ${formatNumber(p1)}:${formatNumber(mi1)} - ${masechtaNames[m2]} ${formatNumber(p2)}:${formatNumber(mi2)}`;
		}
	}

	// -------------------------------------------------------------------------
	// Private helpers
	// -------------------------------------------------------------------------

	/**
	 * Core logic: returns the formatted string for a given PlainDate.
	 */
	private static _getMishnaForPlainDate(
		requested: Temporal.PlainDate,
		useHebrewText: boolean
	): string {
		if (Temporal.PlainDate.compare(requested, MishnaYomi.CYCLE_START_DATE) < 0) {
			throw new IllegalArgumentException(
				`${requested} is prior to the first Mishna Yomi cycle that started on ${MishnaYomi.CYCLE_START_DATE}`
			);
		}

		// Find the start of the cycle that contains the requested date
		let prevCycle = MishnaYomi.CYCLE_START_DATE;
		let nextCycle = MishnaYomi.CYCLE_START_DATE;
		while (Temporal.PlainDate.compare(nextCycle, requested) < 0) {
			prevCycle = nextCycle;
			nextCycle = nextCycle.add({ days: MishnaYomi.CYCLE_LENGTH });
		}

		// Number of mishnayot read from the cycle start up to the day *before* the requested day
		const daysSinceCycleStart = requested.since(prevCycle).total({ unit: 'days' });
		const firstMishnaIndex = daysSinceCycleStart * MishnaYomi.MISHNAS_PER_DAY;
		const secondMishnaIndex = firstMishnaIndex + 1;

		return MishnaYomi._formatMishnayot(firstMishnaIndex, secondMishnaIndex, useHebrewText);
	}

	/**
	 * Formats two consecutive mishnayot given their global indices.
	 */
	private static _formatMishnayot(
		idx1: number,
		idx2: number,
		useHebrewText: boolean
	): string {
		const { masechet: m1, perek: p1, mishna: mi1 } = MishnaYomi.findMishna(idx1)!;
		const { masechet: m2, perek: p2, mishna: mi2 } = MishnaYomi.findMishna(idx2)!;

		const hebrewDateFormatter = new HebrewDateFormatter();
		hebrewDateFormatter.setUseGershGershayim(false);

		const masechtaNames = useHebrewText ? masechtaNameHeb : masechtaNameEng;
		const formatNumber = (n: number) =>
			useHebrewText ? hebrewDateFormatter.formatHebrewNumber(n) : String(n);

		if (m1 !== m2) {
			return [
				[m1, p1, mi1],
				[m2, p2, mi2]
			].map(([m, p, mi]) =>
				`${masechtaNames[m]} ${formatNumber(p)}:${formatNumber(mi)}`
			).join(" - ");
		} else if (p1 !== p2) {
			return `${masechtaNames[m1]} ${formatNumber(p1)}:${formatNumber(mi1)} - ${formatNumber(p2)}:${formatNumber(mi2)}`;
		} else {
			return `${masechtaNames[m1]} ${formatNumber(p1)}:${formatNumber(mi1)}-${formatNumber(mi2)}`;
		}
	}

	private static findMishna(index: number): { masechet: number; perek: number; mishna: number } {
		let cumulative = 0;
		for (let m = 0; m < MishnaYomi.UNITS.length; m++) {
			const perakim = MishnaYomi.UNITS[m];
			for (let p = 0; p < perakim.length; p++) {
				const mishnayotInPerek = perakim[p];
				if (index < cumulative + mishnayotInPerek) {
					const mishnaIndex = index - cumulative;
					return {
						masechet: m,
						perek: p + 1,
						mishna: mishnaIndex + 1
					};
				}
				cumulative += mishnayotInPerek;
			}
		}
		throw new IllegalArgumentException(`Index ${index} is out of bounds (max ${MishnaYomi.NUM_MISHNAS - 1})`);
	}
}