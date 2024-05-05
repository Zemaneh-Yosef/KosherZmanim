import { JewishDate } from "../JewishDate.ts";
import hiloulah_en from "./dataSets/hiloulah-en.json";
import hiloulah_he from "./dataSets/hiloulah-he.json";

export class HiloulahYomiCalculator {
    public static getHiloulah(jewishCalendar: JewishDate) {
        const key = jewishCalendar.getJewishMonth().toString().padStart(2, '0') + jewishCalendar.getJewishDayOfMonth().toString().padStart(2, '0')

        let en = hiloulah_en[key as keyof typeof hiloulah_en];
        let he = hiloulah_he[key as keyof typeof hiloulah_he];

        if (!jewishCalendar.isJewishLeapYear() && jewishCalendar.getJewishMonth() == JewishDate.ADAR) {
            en = Array.from(new Set(...(["12", "13"]
                .map(numString => numString + jewishCalendar.getJewishDayOfMonth().toString().padStart(2, '0'))
                .map(key => hiloulah_en[key as keyof typeof hiloulah_en]))))
            he = Array.from(new Set(...(["12", "13"]
                .map(numString => numString + jewishCalendar.getJewishDayOfMonth().toString().padStart(2, '0'))
                .map(key => hiloulah_he[key as keyof typeof hiloulah_he]))))
        }

        return { en, he }
    }
}