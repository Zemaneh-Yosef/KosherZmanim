import { JewishDate } from "../JewishDate.ts";
import ccyNl from "./dataSets/ccy-nonleap.json" assert { type: "json" }
import ccyL from "./dataSets/ccy-leap.json" assert { type: "json" }

export class ChafetzChayimYomiCalculator {
	public static getChafetzChayimYomi(jewishCalendar: JewishDate) {
		const hebrewDateToday = jewishCalendar.getDate().withCalendar("hebrew")

		const ccCal = (jewishCalendar.isJewishLeapYear() ? ccyL : ccyNl);
		const limudToday = ccCal
			.find(limud => limud.days
				.find(dateObj => hebrewDateToday.equals(hebrewDateToday.withCalendar("hebrew").with(dateObj)))
			)

		return limudToday;
	}
}