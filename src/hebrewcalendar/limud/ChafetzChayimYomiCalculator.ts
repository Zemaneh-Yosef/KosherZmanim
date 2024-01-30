import { JewishDate } from "../JewishDate";
import ccyNl from "./dataSets/ccy-nonleap.json" 
import ccyL from "./dataSets/ccy-leap.json"
import { Temporal } from "temporal-polyfill";

export class ChafetzChayimYomiCalculator {
    public static getChafetzChayimYomi(jewishCalendar: JewishDate) {
        const hebrewDateToday = jewishCalendar.getDate().withCalendar("hebrew")

        const ccCal = (jewishCalendar.isJewishLeapYear() ? ccyL : ccyNl);
        const limudToday = ccCal
            .find(limud => limud.days
                .find(dateObj => hebrewDateToday.equals(Temporal.Now.plainDateISO().withCalendar("hebrew").with(dateObj)))
            )

        return limudToday;
    }
}