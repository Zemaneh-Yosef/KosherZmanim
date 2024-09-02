import { Calendar } from '../../polyfills/Utils.ts';
const { SUNDAY, FRIDAY, SATURDAY } = Calendar;

import { JewishDate } from "../JewishDate";
export default class TehilimYomi {
    static byDayOfMonth(jDate: JewishDate) {
        return ({
            1: [1, 9],
            2: [10, 17],
            3: [18, 22],
            4: [23, 28],
            5: [29, 34],
            6: [35, 38],
            7: [39, 43],
            8: [44, 48],
            9: [49, 54],
            10: [55, 59],
            11: [60, 65],
            12: [66, 68],
            13: [69, 71],
            14: [72, 76],
            15: [77, 78],
            16: [79, 82],
            17: [83, 87],
            18: [88, 89],
            19: [90, 96],
            20: [97, 103],
            21: [104, 105],
            22: [106, 107],
            23: [108, 112],
            24: [113, 118],
            25: ['119:1', '119:96'],
            26: ['119:97', '119:176'],
            27: [120, 134],
            28: [135, 139],
            29: [140, (jDate.getDaysInJewishMonth() == 29 ? 150 : 144)],
            30: [145, 150]
        }[jDate.getJewishDayOfMonth()]) as [number, number] | [string, string]
    }

    static byWeek(jDate: JewishDate) {
        return ({
            [Calendar.SUNDAY]: [1, 29],
            [Calendar.MONDAY]: [30, 50],
            [Calendar.TUESDAY]: [51, 72],
            [Calendar.WEDNESDAY]: [73, 89],
            [Calendar.THURSDAY]: [90, 106],
            [Calendar.FRIDAY]: [107, 119],
            [Calendar.SATURDAY]: [120, 150]
        }[jDate.getDayOfWeek()]) as [number, number]
    }
}