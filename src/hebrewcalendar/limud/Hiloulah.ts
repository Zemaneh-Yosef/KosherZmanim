import { JewishDate } from "../JewishDate.ts";
import hiloulah_en from "./dataSets/hiloulah-en.json" assert { type: "json" };
import hiloulah_he from "./dataSets/hiloulah-he.json" assert { type: "json" };

export class HiloulahYomiCalculator {
    public static getHiloulah(jewishCalendar: JewishDate) {
        const key = jewishCalendar.getJewishMonth().toString().padStart(2, '0') + jewishCalendar.getJewishDayOfMonth().toString().padStart(2, '0')

        // 0101 is hardcoded. Thank you TypeScript for making up a difference between keys
        let en: typeof hiloulah_en['0101'] = hiloulah_en[key as keyof typeof hiloulah_en];
        let he: typeof hiloulah_he['0101'] = hiloulah_he[key as keyof typeof hiloulah_he];

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