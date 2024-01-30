/*
import { Calendar } from '../polyfills/Utils';
import { Daf } from './Daf';
import { JewishCalendar } from './JewishCalendar';
import { IllegalArgumentException } from '../polyfills/errors';

/**
 * This class calculates the <a href="https://en.wikipedia.org/wiki/Jerusalem_Talmud">Talmud Yerusalmi</a> <a href=
 * "https://en.wikipedia.org/wiki/Daf_Yomi">Daf Yomi</a> page ({@link Daf}) for the a given date.
 *
 * @author &copy; elihaidv
 * @author &copy; Eliyahu Hershfeld 2017 - 2019
 
export class YerushalmiYomiCalculator {
  /**
   * The start date of the first Daf Yomi Yerushalmi cycle of February 2, 1980 / 15 Shevat, 5740.
   
  private static readonly DAF_YOMI_START_DAY: DateTime = DateTime.fromObject({
    year: 2022,
    month: Calendar.NOVEMBER + 1,
    day: 14,
  });

  // The number of pages in the Talmud Yerushalmi.
  private static readonly WHOLE_SHAS_DAFS: number = 2094;

  /** The number of pages per <em>masechta</em> (tractate).
  private static readonly BLATT_PER_MASECHTA: number[] = [
      94 , //  Berachos
			73 , //  Pe'ah
			77 , //  Demai
			84 , //  Kil'ayim
			87 , //  Shevi'is
			107 , //  Terumos
			46 , //  Ma'asros
			59 , //  Ma'aser Sheni
			49 , //  Chalah
			42 , //  Orlah
			26 , //  Bikurim
			113 , //  Shabbos
			71 , //  Eruvin
			86 , //  Pesachim
			61 , //  Shekalim
			57 , //  Yoma
			33 , //  Sukah
			49 , //  Beitzah
			27 , //  Rosh Hashanah
			31 , //  Ta'anis
			41 , //  Megilah
			28 , //  Chagigah
			23 , //  Moed Katan
			88 , //  Yevamos
			77 , //  Kesuvos
			42 , //  Nedarim
			53 , //  Nazir
			52 , //  Sotah
			53 , //  Gitin
			53 , //  Kidushin
			40 , //  Bava Kama
			35 , //  Bava Metzia
			39 , //  Bava Basra
			75 , //  Sanhedrin
			49 , //  Shevuos
			34 , //  Avodah Zarah
			11 , //  Makos
			18 , //  Horayos
			11 //  Nidah
  ];

  /**
   * Returns the <a href="https://en.wikipedia.org/wiki/Daf_Yomi">Daf Yomi</a>
   * <a href="https://en.wikipedia.org/wiki/Jerusalem_Talmud">Yerusalmi</a> page ({@link Daf}) for a given date.
   * The first Daf Yomi cycle started on 15 Shevat (Tu Bishvat) 5740 (February, 2, 1980) and calculations
   * prior to this date will result in an IllegalArgumentException thrown. A null will be returned on Tisha B'Av or
   * Yom Kippur.
   *
   * @param jewishCalendar
   *            the calendar date for calculation
   * @return the {@link Daf} or null if the date is on Tisha B'Av or Yom Kippur.
   *
   * @throws IllegalArgumentException
   *             if the date is prior to the February 2, 1980, the start date of the first Daf Yomi Yerushalmi cycle
  
  public static getDafYomiYerushalmi(jewishCalendar: JewishCalendar) {
    let nextCycle: DateTime = YerushalmiYomiCalculator.DAF_YOMI_START_DAY;
    let prevCycle: DateTime = YerushalmiYomiCalculator.DAF_YOMI_START_DAY;
    const requested: DateTime = jewishCalendar.getDate();
    let masechta: number = 0;
    let dafYomi: Daf;

    if (requested < YerushalmiYomiCalculator.DAF_YOMI_START_DAY) {
      throw new IllegalArgumentException(`${requested} is prior to newly-organized Daf Yomi Yerushalmi cycles that started on ${YerushalmiYomiCalculator.DAF_YOMI_START_DAY}`);
    }

    // Start to calculate current cycle. Initialize the start day
    // nextCycle = YerushalmiYomiCalculator.DAF_YOMI_START_DAY;

    // Go cycle by cycle, until we get the next cycle
    while (requested > nextCycle) {
      prevCycle = nextCycle;

      // Adds the number of whole shas dafs, and then the number of days that not have daf.
      nextCycle = nextCycle.plus({ days: YerushalmiYomiCalculator.WHOLE_SHAS_DAFS });
    }

    // Get the number of days from cycle start until request.
    const dafNo: number = requested.diff(prevCycle, ['days']).days;

    // Get the number of special days to subtract
    let total: number = dafNo;

    // Finally find the daf.
    for (let i: number = 0; i < YerushalmiYomiCalculator.BLATT_PER_MASECHTA.length; i++) {
      if (total <= YerushalmiYomiCalculator.BLATT_PER_MASECHTA[i]) {
        dafYomi = new Daf(masechta, total + 1);
        break;
      }
      total -= YerushalmiYomiCalculator.BLATT_PER_MASECHTA[i];
      masechta++;
    }

    return dafYomi!;
  }
} */
