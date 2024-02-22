import { Temporal } from 'temporal-polyfill'

import { Calendar } from '../../polyfills/Utils.ts';
import { Daf } from './Daf.ts';
import { IllegalArgumentException } from '../../polyfills/errors.ts';
import { JewishDate } from '../JewishDate.ts';

/**
 * This class calculates the <a href="https://en.wikipedia.org/wiki/Jerusalem_Talmud">Talmud Yerusalmi</a> <a href=
 * "https://en.wikipedia.org/wiki/Daf_Yomi">Daf Yomi</a> page ({@link DafYomiYerushalmi}) for the a given date.
 *
 * @author &copy; elihaidv
 * @author &copy; Eliyahu Hershfeld 2017 - 2019
 */
export class YerushalmiYomiCalculator {
  /**
   * The start date of the first Daf Yomi Yerushalmi cycle of February 2, 1980 / 15 Shevat, 5740.
   */
  private static readonly DAF_YOMI_START_DAY: Temporal.PlainDate = Temporal.PlainDate.from({
    year: 1980,
    month: Calendar.FEBRUARY + 1,
    day: 2,
  });

  /** The number of pages in the Talmud Yerushalmi. */
  private static readonly WHOLE_SHAS_DAFS: number = 1554;

  /** The number of pages per <em>masechta</em> (tractate). */
  private static readonly BLATT_PER_MASECHTA: number[] = [68, 37, 34, 44, 31, 59, 26, 33, 28, 20, 13, 92, 65, 71, 22,
    22, 42, 26, 26, 33, 34, 22, 19, 85, 72, 47, 40, 47, 54, 48, 44, 37, 34, 44, 9, 57, 37, 19, 13];

  /**
   * Returns the <a href="https://en.wikipedia.org/wiki/Daf_Yomi">Daf Yomi</a>
   * <a href="https://en.wikipedia.org/wiki/Jerusalem_Talmud">Yerusalmi</a> page ({@link DafYomiYerushalmi}) for a given date.
   * The first Daf Yomi cycle started on 15 Shevat (Tu Bishvat) 5740 (February, 2, 1980) and calculations
   * prior to this date will result in an IllegalArgumentException thrown. A null will be returned on Tisha B'Av or
   * Yom Kippur.
   *
   * @param jewishCalendar
   *            the calendar date for calculation
   * @return the {@link DafYomiYerushalmi} or null if the date is on Tisha B'Av or Yom Kippur.
   *
   * @throws IllegalArgumentException
   *             if the date is prior to the February 2, 1980, the start date of the first Daf Yomi Yerushalmi cycle
   */
  public static getDafYomiYerushalmi(jewishCalendar: JewishDate) {
    let nextCycle: Temporal.PlainDate = YerushalmiYomiCalculator.DAF_YOMI_START_DAY;
    let prevCycle: Temporal.PlainDate = YerushalmiYomiCalculator.DAF_YOMI_START_DAY;
    const requested: Temporal.PlainDate = jewishCalendar.getDate();
    let masechta: number = 0;
    let dafYomi: DafYomiYerushalmi;

    const hebrewDate = jewishCalendar.getDate().withCalendar("hebrew");
    if (hebrewDate.month == 1 && hebrewDate.day == 10) {
      return null;
    }

    if (jewishCalendar.getJewishMonth() == JewishDate.AV) {
      if ((hebrewDate.day == 9 && hebrewDate.dayOfWeek !== 6) || (hebrewDate.day == 10 && hebrewDate.dayOfWeek == 7))
        return null;
    }

    if (Temporal.PlainDate.compare(requested, YerushalmiYomiCalculator.DAF_YOMI_START_DAY) == -1) {
      throw new IllegalArgumentException(`${requested} is prior to organized Daf Yomi Yerushalmi cycles that started on ${YerushalmiYomiCalculator.DAF_YOMI_START_DAY}`);
    }

    // Start to calculate current cycle. Initialize the start day
    // nextCycle = YerushalmiYomiCalculator.DAF_YOMI_START_DAY;

    // Go cycle by cycle, until we get the next cycle
    while (Temporal.PlainDate.compare(nextCycle, requested) == -1) {
      prevCycle = nextCycle;

      // Adds the number of whole shas dafs, and then the number of days that not have daf.
      nextCycle = nextCycle.add({ days: YerushalmiYomiCalculator.WHOLE_SHAS_DAFS });
      // This needs to be a separate step
      nextCycle = nextCycle.add({ days: YerushalmiYomiCalculator.getNumOfSpecialDays(prevCycle, nextCycle) });
    }

    // Get the number of days from cycle start until request.
    const dafNo: number = requested.since(prevCycle).total({ unit: 'days' });

    // Get the number of special days to subtract
    const specialDays: number = YerushalmiYomiCalculator.getNumOfSpecialDays(prevCycle, requested);
    let total: number = dafNo - specialDays;

    // Finally find the daf.
    for (let i: number = 0; i < YerushalmiYomiCalculator.BLATT_PER_MASECHTA.length; i++) {
      if (total <= YerushalmiYomiCalculator.BLATT_PER_MASECHTA[i]) {
        dafYomi = new DafYomiYerushalmi(masechta, total + 1);
        break;
      }
      total -= YerushalmiYomiCalculator.BLATT_PER_MASECHTA[i];
      masechta++;
    }

    return dafYomi!;
  }

  /**
   * Return the number of special days (Yom Kippur and Tisha B'Av) on which there is no daf, between the two given dates
   *
   * @param start - start date to calculate
   * @param end - end date to calculate
   * @return the number of special days
   */
  private static getNumOfSpecialDays(start: Temporal.PlainDate, end: Temporal.PlainDate): number {
    // Find the start and end Jewish years
    const jewishStartYear: number = new JewishDate(start).getJewishYear();
    const jewishEndYear: number = new JewishDate(end).getJewishYear();

    // Value to return
    let specialDays: number = 0;

    // Instant of special dates
    const yomKippur: JewishDate = new JewishDate(jewishStartYear, 7, 10);
    const tishaBeav: JewishDate = new JewishDate(jewishStartYear, 5, 9);

    // Go over the years and find special dates
    for (let i: number = jewishStartYear; i <= jewishEndYear; i++) {
      yomKippur.setJewishYear(i);
      tishaBeav.setJewishYear(i);

      if (rangeDates(start, yomKippur.getDate(), end)) specialDays++;
      if (rangeDates(start, tishaBeav.getDate(), end)) specialDays++;
    }

    return specialDays;
  }
}

/**
 * An Object representing a <em>daf</em> (page) in the <a href="https://en.wikipedia.org/wiki/Daf_Yomi">Daf Yomi</a> cycle.
 *
 * @author &copy; Eliyahu Hershfeld 2011 - 2019
 */
export class DafYomiYerushalmi extends Daf {
  /**
   * See {@link #getYerushalmiMasechtaTransliterated()}.
   */
  private static masechtosYerushalmiTransliterated: string[] = ['Berachos', "Pe'ah", 'Demai', 'Kilayim', "Shevi'is",
    'Terumos', "Ma'asros", "Ma'aser Sheni", 'Chalah', 'Orlah', 'Bikurim', 'Shabbos', 'Eruvin', 'Pesachim',
    'Beitzah', 'Rosh Hashanah', 'Yoma', 'Sukah', "Ta'anis", 'Shekalim', 'Megilah', 'Chagigah', 'Moed Katan',
    'Yevamos', 'Kesuvos', 'Sotah', 'Nedarim', 'Nazir', 'Gitin', 'Kidushin', 'Bava Kama', 'Bava Metzia',
    'Bava Basra', 'Sanhedrin', 'Makos', 'Shevuos', 'Avodah Zarah', 'Horayos', 'Nidah', 'No Daf Today' ];

  /**
   * See {@link #getYerushalmiMasechta()}.
   */
  private static readonly masechtosYerushalmi: string[] = ['\u05d1\u05e8\u05db\u05d5\u05ea', '\u05e4\u05d9\u05d0\u05d4',
    '\u05d3\u05de\u05d0\u05d9', '\u05db\u05dc\u05d0\u05d9\u05d9\u05dd', '\u05e9\u05d1\u05d9\u05e2\u05d9\u05ea',
    '\u05ea\u05e8\u05d5\u05de\u05d5\u05ea', '\u05de\u05e2\u05e9\u05e8\u05d5\u05ea', '\u05de\u05e2\u05e9\u05e8 \u05e9\u05e0\u05d9',
    '\u05d7\u05dc\u05d4', '\u05e2\u05d5\u05e8\u05dc\u05d4', '\u05d1\u05d9\u05db\u05d5\u05e8\u05d9\u05dd',
    '\u05e9\u05d1\u05ea', '\u05e2\u05d9\u05e8\u05d5\u05d1\u05d9\u05df', '\u05e4\u05e1\u05d7\u05d9\u05dd',
    '\u05d1\u05d9\u05e6\u05d4', '\u05e8\u05d0\u05e9 \u05d4\u05e9\u05e0\u05d4', '\u05d9\u05d5\u05de\u05d0',
    '\u05e1\u05d5\u05db\u05d4', '\u05ea\u05e2\u05e0\u05d9\u05ea', '\u05e9\u05e7\u05dc\u05d9\u05dd', '\u05de\u05d2\u05d9\u05dc\u05d4',
    '\u05d7\u05d2\u05d9\u05d2\u05d4', '\u05de\u05d5\u05e2\u05d3 \u05e7\u05d8\u05df', '\u05d9\u05d1\u05de\u05d5\u05ea',
    '\u05db\u05ea\u05d5\u05d1\u05d5\u05ea', '\u05e1\u05d5\u05d8\u05d4', '\u05e0\u05d3\u05e8\u05d9\u05dd', '\u05e0\u05d6\u05d9\u05e8',
    '\u05d2\u05d9\u05d8\u05d9\u05df', '\u05e7\u05d9\u05d3\u05d5\u05e9\u05d9\u05df', '\u05d1\u05d1\u05d0 \u05e7\u05de\u05d0',
    '\u05d1\u05d1\u05d0 \u05de\u05e6\u05d9\u05e2\u05d0', '\u05d1\u05d1\u05d0 \u05d1\u05ea\u05e8\u05d0',
    '\u05e9\u05d1\u05d5\u05e2\u05d5\u05ea', '\u05de\u05db\u05d5\u05ea', '\u05e1\u05e0\u05d4\u05d3\u05e8\u05d9\u05df',
    '\u05e2\u05d1\u05d5\u05d3\u05d4 \u05d6\u05e8\u05d4', '\u05d4\u05d5\u05e8\u05d9\u05d5\u05ea', '\u05e0\u05d9\u05d3\u05d4',
    '\u05d0\u05d9\u05df \u05d3\u05e3 \u05d4\u05d9\u05d5\u05dd'];

  /**
   * Returns the transliterated name of the <em>masechta</em> (tractate) of the Daf Yomi in Yerushalmi. The list of
	 * <em>mashechtos</em> is:
	 * Berachos, Pe'ah, Demai, Kilayim, Shevi'is, Terumos, Ma'asros, Ma'aser Sheni, Chalah, Orlah, Bikurim, 
	 * Shabbos, Eruvin, Pesachim, Beitzah, Rosh Hashanah, Yoma, Sukah, Ta'anis, Shekalim, Megilah, Chagigah, 
	 * Moed Katan, Yevamos, Kesuvos, Sotah, Nedarim, Nazir, Gitin, Kidushin, Bava Kama, Bava Metzia,
	 * Bava Basra, Shevuos, Makos, Sanhedrin, Avodah Zarah, Horayos, Nidah and No Daf Today.
	 * 
	 * @return the transliterated name of the <em>masechta</em> (tractate) of the Daf Yomi such as Berachos.
   */
  public getMasechtaTransliterated(): string {
    return DafYomiYerushalmi.masechtosYerushalmiTransliterated[super.getMasechtaNumber()];
  }

  /**
   * Setter method to allow overriding of the default list of Yerushalmi <em>masechtos</em> transliterated into into Latin chars.
	 * The default uses Ashkenazi American English transliteration.
	 * 
	 * @param masechtosYerushalmiTransliterated the list of transliterated Yerushalmi <em>masechtos</em> to set.
   */
  public static setMasechtaTransliterated(masechtosYerushalmiTransliterated: string[]): void {
    DafYomiYerushalmi.masechtosYerushalmiTransliterated = masechtosYerushalmiTransliterated;
  }

  /**
	 * Getter method to allow retrieving the list of Yerushalmi <em>masechtos</em> transliterated into into Latin chars.
	 * The default uses Ashkenazi American English transliteration.
	 * 
	 * @return the array of transliterated <em>masechta</em> (tractate) names of the Daf Yomi Yerushalmi.
	 */
  public static getMasechtosTransliterated(): string[] {
    return this.masechtosYerushalmiTransliterated;
  }

  /**
	 * Getter method to allow retrieving the list of Yerushalmi <em>masechtos</em>.
	 * 
	 * @return the array of Hebrew <em>masechta</em> (tractate) names of the Daf Yomi Yerushalmi.
	 */
  public static getMasechtos():string[] {
    return this.masechtosYerushalmi;
  }

  /**
   * Returns the Yerushalmi <em>masechta</em> (tractate) of the Daf Yomi in Hebrew. As an example, it will return
	 * &#x05D1;&#x05E8;&#x05DB;&#x05D5;&#x05EA; for Berachos.
	 * 
	 * @return the Yerushalmi <em>masechta</em> (tractate) of the Daf Yomi in Hebrew. As an example, it will return
	 *         &#x05D1;&#x05E8;&#x05DB;&#x05D5;&#x05EA; for Berachos.
   */
  public getMasechta(): string {
    return DafYomiYerushalmi.masechtosYerushalmi[this.getMasechtaNumber()];
  }
}


function rangeDates(start: Temporal.PlainDate, middle:Temporal.PlainDate, end: Temporal.PlainDate, inclusive=true) {
  const acceptedValues = [1];
  if (inclusive)
    acceptedValues.push(0);

  return acceptedValues.includes(Temporal.PlainDate.compare(middle, start)) && acceptedValues.includes(Temporal.PlainDate.compare(end, middle))
};