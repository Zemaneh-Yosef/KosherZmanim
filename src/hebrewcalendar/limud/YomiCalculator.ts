import { Temporal } from 'temporal-polyfill'

import { Calendar } from '../../polyfills/Utils.ts';
import { Daf } from './Daf.ts';
import { IllegalArgumentException } from '../../polyfills/errors.ts';
import { JewishDate } from '../JewishDate.ts';

/**
 * This class calculates the Daf Yomi Bavli page (daf) for a given date. To calculate Daf Yomi Yerushalmi
 * use the {@link YerushalmiYomiCalculator}. The library may cover Mishna Yomi etc. at some point in the future.
 *
 * @author &copy; Bob Newell (original C code)
 * @author &copy; Eliyahu Hershfeld 2011 - 2019
 * @version 0.0.1
 */
export class YomiCalculator {
  /**
   * The start date of the first Daf Yomi Bavli cycle of September 11, 1923 / Rosh Hashana 5684.
   */
  private static readonly dafYomiStartDate: Temporal.PlainDate = Temporal.PlainDate.from({
    year: 1923,
    month: Calendar.SEPTEMBER + 1,
    day: 11,
  });

  /** The start date of the first Daf Yomi Bavli cycle in the Julian calendar. Used internally for claculations. */
  private static readonly dafYomiJulianStartDay: number = YomiCalculator.getJulianDay(YomiCalculator.dafYomiStartDate);

  /**
   * The date that the pagination for the Daf Yomi <em>Maseches Shekalim</em> changed to use the commonly used Vilna
   * Shas pagination from the no longer commonly available Zhitomir / Slavuta Shas used by Rabbi Meir Shapiro.
   */
  private static readonly shekalimChangeDate: Temporal.PlainDate = Temporal.PlainDate.from({ year: 1975, month: Calendar.JUNE + 1, day: 24 });

  /** The Julian date that the cycle for Shekalim changed.
   * @see #getDafYomiBavli(JewishCalendar) for details.
   */
  private static readonly shekalimJulianChangeDay: number = YomiCalculator.getJulianDay(YomiCalculator.shekalimChangeDate);

  /**
   * Returns the <a href="https://en.wikipedia.org/wiki/Daf_yomi">Daf Yomi</a> <a
   * href="https://en.wikipedia.org/wiki/Talmud">Bavli</a> {@link DafBavliYomi} for a given date. The first Daf Yomi cycle
   * started on Rosh Hashana 5684 (September 11, 1923) and calculations prior to this date will result in an
   * IllegalArgumentException thrown. For historical calculations (supported by this method), it is important to note
   * that a change in length of the cycle was instituted starting in the eighth Daf Yomi cycle beginning on June 24,
   * 1975. The Daf Yomi Bavli cycle has a single masechta of the Talmud Yerushalmi - Shekalim as part of the cycle.
   * Unlike the Bavli where the number of daf per masechta was standardized since the original <a
   * href="https://en.wikipedia.org/wiki/Daniel_Bomberg">Bomberg Edition</a> published from 1520 - 1523, there is no
   * uniform page length in the Yerushalmi. The early cycles had the Yerushalmi Shekalim length of 13 days following the
   * <a href=
   * "https://he.wikipedia.org/wiki/%D7%93%D7%A4%D7%95%D7%A1_%D7%A1%D7%9C%D7%90%D7%95%D7%95%D7%99%D7%98%D7%90">Slavuta/Zhytomyr</a>
   * Shas used by <a href="https://en.wikipedia.org/wiki/Meir_Shapiro">Rabbi Meir Shapiro</a>. With the start of the eighth Daf Yomi
   * cycle beginning on June 24, 1975 the length of the Yerushalmi Shekalim was changed from 13 to 22 daf to follow
   * the <a href="https://en.wikipedia.org/wiki/Vilna_Edition_Shas">Vilna Shas</a> that is in common use today.
   *
   * @param calendar
   *            the calendar date for calculation
   * @return the {@link DafBavliYomi}.
   *
   * @throws IllegalArgumentException
   *             if the date is prior to the September 11, 1923 start date of the first Daf Yomi cycle
   */
  public static getDafYomiBavli(calendar: JewishDate): DafBavliYomi {
    /*
     * The number of daf per masechta. Since the number of blatt in Shekalim changed on the 8th Daf Yomi cycle
     * beginning on June 24, 1975 from 13 to 22, the actual calculation for blattPerMasechta[4] will later be
     * adjusted based on the cycle.
     */
    const blattPerMasechta: number[] = [64, 157, 105, 121, 22, 88, 56, 40, 35, 31, 32, 29, 27, 122, 112, 91, 66, 49, 90, 82,
      119, 119, 176, 113, 24, 49, 76, 14, 120, 110, 142, 61, 34, 34, 28, 22, 4, 9, 5, 73];

    const date: Temporal.PlainDate = calendar.getDate();

    let dafYomi: DafBavliYomi;
    const julianDay: number = this.getJulianDay(date);
    let cycleNo: number = 0;
    let dafNo: number = 0;
    if (Temporal.PlainDate.compare(date,YomiCalculator.dafYomiStartDate) == -1) {
      // TODO: should we return a null or throw an IllegalArgumentException?
      throw new IllegalArgumentException(`${calendar} is prior to organized Daf Yomi Bavli cycles that started on ${YomiCalculator.dafYomiStartDate}`);
    }
    if (Temporal.PlainDate.compare(date, YomiCalculator.shekalimChangeDate) == 1) {
      cycleNo = 8 + ((julianDay - YomiCalculator.shekalimJulianChangeDay) / 2711);
      dafNo = ((julianDay - YomiCalculator.shekalimJulianChangeDay) % 2711);
    } else {
      cycleNo = 1 + ((julianDay - YomiCalculator.dafYomiJulianStartDay) / 2702);
      dafNo = ((julianDay - YomiCalculator.dafYomiJulianStartDay) % 2702);
    }

    let total: number = 0;
    let masechta: number = -1;
    let blatt: number = 0;

    /* Fix Shekalim for old cycles. */
    if (cycleNo <= 7) {
      blattPerMasechta[4] = 13;
    } else {
      blattPerMasechta[4] = 22; // correct any change that may have been changed from a prior calculation
    }
    /* Finally find the daf. */
    // eslint-disable-next-line no-restricted-syntax
    for (const blattInMasechta of blattPerMasechta) {
      masechta++;
      total = total + blattInMasechta - 1;
      if (dafNo < total) {
        blatt = 1 + blattInMasechta - (total - dafNo);
        /* Fiddle with the weird ones near the end. */
        if (masechta === 36) {
          blatt += 21;
        } else if (masechta === 37) {
          blatt += 24;
        } else if (masechta === 38) {
          blatt += 32;
        }
        dafYomi = new DafBavliYomi(masechta, blatt);
        break;
      }
    }

    return dafYomi!;
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Julian_day">Julian day</a> from a Java Date.
   *
   * @param date
   *            The Java Date
   * @return the Julian day number corresponding to the date
   */
  private static getJulianDay(date: Temporal.PlainDate): number {
    let { year, month } = date;
    const { day } = date;

    if (month <= 2) {
      year -= 1;
      month += 12;
    }

    const a: number = Math.trunc(year / 100);
    const b: number = 2 - a + Math.trunc(a / 4);
    return Math.trunc(Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5);
  }
}

/**
 * An Object representing a <em>daf</em> (page) in the <a href="https://en.wikipedia.org/wiki/Daf_Yomi">Daf Yomi</a> cycle.
 *
 * @author &copy; Eliyahu Hershfeld 2011 - 2019
 */
export class DafBavliYomi extends Daf {
  /**
   * See {@link #getMasechtaTransliterated()} and {@link #setMasechtaTransliterated(String[])}.
   */
  private static masechtosBavliTransliterated: string[] = ['Berachos', 'Shabbos', 'Eruvin', 'Pesachim', 'Shekalim',
    'Yoma', 'Sukkah', 'Beitzah', 'Rosh Hashana', 'Taanis', 'Megillah', 'Moed Katan', 'Chagigah', 'Yevamos',
    'Kesubos', 'Nedarim', 'Nazir', 'Sotah', 'Gitin', 'Kiddushin', 'Bava Kamma', 'Bava Metzia', 'Bava Basra',
    'Sanhedrin', 'Makkos', 'Shevuos', 'Avodah Zarah', 'Horiyos', 'Zevachim', 'Menachos', 'Chullin', 'Bechoros',
    'Arachin', 'Temurah', 'Kerisos', 'Meilah', 'Kinnim', 'Tamid', 'Midos', 'Niddah'];

  /**
   * See {@link #getMasechta()}.
   */
  private static readonly masechtosBavli: string[] = ['\u05D1\u05E8\u05DB\u05D5\u05EA', '\u05E9\u05D1\u05EA',
    '\u05E2\u05D9\u05E8\u05D5\u05D1\u05D9\u05DF', '\u05E4\u05E1\u05D7\u05D9\u05DD',
    '\u05E9\u05E7\u05DC\u05D9\u05DD', '\u05D9\u05D5\u05DE\u05D0', '\u05E1\u05D5\u05DB\u05D4',
    '\u05D1\u05D9\u05E6\u05D4', '\u05E8\u05D0\u05E9 \u05D4\u05E9\u05E0\u05D4',
    '\u05EA\u05E2\u05E0\u05D9\u05EA', '\u05DE\u05D2\u05D9\u05DC\u05D4',
    '\u05DE\u05D5\u05E2\u05D3 \u05E7\u05D8\u05DF', '\u05D7\u05D2\u05D9\u05D2\u05D4',
    '\u05D9\u05D1\u05DE\u05D5\u05EA', '\u05DB\u05EA\u05D5\u05D1\u05D5\u05EA', '\u05E0\u05D3\u05E8\u05D9\u05DD',
    '\u05E0\u05D6\u05D9\u05E8', '\u05E1\u05D5\u05D8\u05D4', '\u05D2\u05D9\u05D8\u05D9\u05DF',
    '\u05E7\u05D9\u05D3\u05D5\u05E9\u05D9\u05DF', '\u05D1\u05D1\u05D0 \u05E7\u05DE\u05D0',
    '\u05D1\u05D1\u05D0 \u05DE\u05E6\u05D9\u05E2\u05D0', '\u05D1\u05D1\u05D0 \u05D1\u05EA\u05E8\u05D0',
    '\u05E1\u05E0\u05D4\u05D3\u05E8\u05D9\u05DF', '\u05DE\u05DB\u05D5\u05EA',
    '\u05E9\u05D1\u05D5\u05E2\u05D5\u05EA', '\u05E2\u05D1\u05D5\u05D3\u05D4 \u05D6\u05E8\u05D4',
    '\u05D4\u05D5\u05E8\u05D9\u05D5\u05EA', '\u05D6\u05D1\u05D7\u05D9\u05DD', '\u05DE\u05E0\u05D7\u05D5\u05EA',
    '\u05D7\u05D5\u05DC\u05D9\u05DF', '\u05D1\u05DB\u05D5\u05E8\u05D5\u05EA', '\u05E2\u05E8\u05DB\u05D9\u05DF',
    '\u05EA\u05DE\u05D5\u05E8\u05D4', '\u05DB\u05E8\u05D9\u05EA\u05D5\u05EA', '\u05DE\u05E2\u05D9\u05DC\u05D4',
    '\u05E7\u05D9\u05E0\u05D9\u05DD', '\u05EA\u05DE\u05D9\u05D3', '\u05DE\u05D9\u05D3\u05D5\u05EA',
    '\u05E0\u05D3\u05D4'];

  /**
   * Returns the transliterated name of the <em>masechta</em> (tractate) of the Daf Yomi. The list of <em>mashechtos</em>
	 * is: Berachos, Shabbos, Eruvin, Pesachim, Shekalim, Yoma, Sukkah, Beitzah, Rosh Hashana, Taanis, Megillah, Moed Katan,
	 * Chagigah, Yevamos, Kesubos, Nedarim, Nazir, Sotah, Gitin, Kiddushin, Bava Kamma, Bava Metzia, Bava Basra, Sanhedrin,
	 * Makkos, Shevuos, Avodah Zarah, Horiyos, Zevachim, Menachos, Chullin, Bechoros, Arachin, Temurah, Kerisos, Meilah,
	 * Kinnim, Tamid, Midos and Niddah.
	 * 
	 * @return the transliterated name of the <em>masechta</em> (tractate) of the Daf Yomi such as Berachos.
   * @see #setMasechtaTransliterated(String[])
   */
  public getMasechtaTransliterated(): string {
    return DafBavliYomi.masechtosBavliTransliterated[this.getMasechtaNumber()];
  }

  /**
   * Setter method to allow overriding of the default list of <em>masechtos</em> transliterated into into Latin chars.
	 * The default values use Ashkenazi American English transliteration.
	 * 
	 * @param masechtosBavliTransliterated the list of transliterated Bavli <em>masechtos</em> to set.
   * @see #getMasechtaTransliterated()
   */
  public static setMasechtaTransliterated(masechtosBavliTransliterated: string[]): void {
    DafBavliYomi.masechtosBavliTransliterated = masechtosBavliTransliterated;
  }

  /**
   * Returns the <em>masechta</em> (tractate) of the Daf Yomi in Hebrew. The list is in the following format<br>
   * <code>["&#x05D1;&#x05E8;&#x05DB;&#x05D5;&#x05EA;",
   * "&#x05E9;&#x05D1;&#x05EA;", "&#x05E2;&#x05D9;&#x05E8;&#x05D5;&#x05D1;&#x05D9;&#x05DF;",
   * "&#x05E4;&#x05E1;&#x05D7;&#x05D9;&#x05DD;", "&#x05E9;&#x05E7;&#x05DC;&#x05D9;&#x05DD;", "&#x05D9;&#x05D5;&#x05DE;&#x05D0;",
   * "&#x05E1;&#x05D5;&#x05DB;&#x05D4;", "&#x05D1;&#x05D9;&#x05E6;&#x05D4;", "&#x05E8;&#x05D0;&#x05E9; &#x05D4;&#x05E9;&#x05E0;&#x05D4;",
   * "&#x05EA;&#x05E2;&#x05E0;&#x05D9;&#x05EA;", "&#x05DE;&#x05D2;&#x05D9;&#x05DC;&#x05D4;", "&#x05DE;&#x05D5;&#x05E2;&#x05D3;
   * &#x05E7;&#x05D8;&#x05DF;", "&#x05D7;&#x05D2;&#x05D9;&#x05D2;&#x05D4;", "&#x05D9;&#x05D1;&#x05DE;&#x05D5;&#x05EA;",
   * "&#x05DB;&#x05EA;&#x05D5;&#x05D1;&#x05D5;&#x05EA;", "&#x05E0;&#x05D3;&#x05E8;&#x05D9;&#x05DD;","&#x05E0;&#x05D6;&#x05D9;&#x05E8;",
   * "&#x05E1;&#x05D5;&#x05D8;&#x05D4;", "&#x05D2;&#x05D9;&#x05D8;&#x05D9;&#x05DF;", "&#x05E7;&#x05D9;&#x05D3;&#x05D5;&#x05E9;&#x05D9;&#x05DF;",
   * "&#x05D1;&#x05D1;&#x05D0; &#x05E7;&#x05DE;&#x05D0;", "&#x05D1;&#x05D1;&#x05D0; &#x05DE;&#x05E6;&#x05D9;&#x05E2;&#x05D0;",
   * "&#x05D1;&#x05D1;&#x05D0; &#x05D1;&#x05EA;&#x05E8;&#x05D0;", "&#x05E1;&#x05E0;&#x05D4;&#x05D3;&#x05E8;&#x05D9;&#x05DF;",
   * "&#x05DE;&#x05DB;&#x05D5;&#x05EA;", "&#x05E9;&#x05D1;&#x05D5;&#x05E2;&#x05D5;&#x05EA;", "&#x05E2;&#x05D1;&#x05D5;&#x05D3;&#x05D4;
   * &#x05D6;&#x05E8;&#x05D4;", "&#x05D4;&#x05D5;&#x05E8;&#x05D9;&#x05D5;&#x05EA;", "&#x05D6;&#x05D1;&#x05D7;&#x05D9;&#x05DD;",
   * "&#x05DE;&#x05E0;&#x05D7;&#x05D5;&#x05EA;", "&#x05D7;&#x05D5;&#x05DC;&#x05D9;&#x05DF;", "&#x05D1;&#x05DB;&#x05D5;&#x05E8;&#x05D5;&#x05EA;",
   * "&#x05E2;&#x05E8;&#x05DB;&#x05D9;&#x05DF;", "&#x05EA;&#x05DE;&#x05D5;&#x05E8;&#x05D4;", "&#x05DB;&#x05E8;&#x05D9;&#x05EA;&#x05D5;&#x05EA;",
   * "&#x05DE;&#x05E2;&#x05D9;&#x05DC;&#x05D4;", "&#x05E7;&#x05D9;&#x05E0;&#x05D9;&#x05DD;", "&#x05EA;&#x05DE;&#x05D9;&#x05D3;",
   * "&#x05DE;&#x05D9;&#x05D3;&#x05D5;&#x05EA;", "&#x05E0;&#x05D3;&#x05D4;"]</code>.
   *
   * @return the <em>masechta</em> (tractate) of the Daf Yomi in Hebrew. As an example, it will return
	 *         &#x05D1;&#x05E8;&#x05DB;&#x05D5;&#x05EA; for Berachos.
   */
  public getMasechta(): string {
    return DafBavliYomi.masechtosBavli[this.getMasechtaNumber()];
  }
}
