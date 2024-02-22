import { Temporal } from 'temporal-polyfill'

import { Calendar } from '../../polyfills/Utils';
import { Daf } from './Daf';
import { IllegalArgumentException } from '../../polyfills/errors';
import { JewishDate } from '../JewishDate';

/**
 * This class calculates the Daf Yomi Bavli page (daf) for a given date. To calculate Daf Yomi Yerushalmi
 * use the {@link YerushalmiYomiCalculator}. The library may cover Mishna Yomi etc. at some point in the future.
 *
 * @author &copy; Bob Newell (original C code)
 * @author &copy; Eliyahu Hershfeld 2011 - 2019
 * @version 0.0.1
 */
export class NakhYomiTest {
  /**
   * The start date of the first Daf Yomi Bavli cycle of September 11, 1923 / Rosh Hashana 5684.
   */
  private static readonly nakhYomiStartDate: Temporal.PlainDate = Temporal.PlainDate.from({
    year: 2007,
    month: Calendar.OCTOBER + 1,
    day: 1,
  });

  /**
   * Returns the <a href="https://en.wikipedia.org/wiki/Daf_yomi">Nakh Yomi</a> <a
   * href="https://en.wikipedia.org/wiki/Talmud">Bavli</a> {@link Daf} for a given date. The first Daf Yomi cycle
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
   * @return the {@link Daf}.
   *
   * @throws IllegalArgumentException
   *             if the date is prior to the September 11, 1923 start date of the first Daf Yomi cycle
   */
  public static getNakhYomi(calendar: JewishDate) {
    const chapterPerSefer: number[] = [
      24,
      21,
      31,
      24,
      22,
      25,
      66,
      52,
      48,
      14,
      4,
      9,
      1,
      4,
      7,
      3,
      3,
      3,
      2,
      14,
      3,
      150,
      31,
      42,
      8,
      4,
      5,
      12,
      10,
      12,
      10,
      13,
      29,
      36
    ];
    const total = chapterPerSefer.reduce((a,b)=>a+b)

    const date: Temporal.PlainDate = calendar.getDate();
    if (Temporal.PlainDate.compare(date,NakhYomiTest.nakhYomiStartDate) == -1) {
      // TODO: should we return a null or throw an IllegalArgumentException?
      throw new IllegalArgumentException(`${calendar} is prior to organized Nakh Yomi cycles that started on ${NakhYomiTest.nakhYomiStartDate}`);
    }

    const cycle = Math.trunc(NakhYomiTest.nakhYomiStartDate.until(date).total('days')) % total;
    let cycleTemp = cycle;
    let permKey = 0;

    for (const key in chapterPerSefer) {
      if (cycleTemp - chapterPerSefer[parseInt(key)] <= 0)
        break;

      cycleTemp -= chapterPerSefer[parseInt(key)];
      permKey = parseInt(key);
    }

    return cycleTemp;
  }
}
