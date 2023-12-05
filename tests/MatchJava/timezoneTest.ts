// Import KosherZmanim as the methodListAcquirer & DateFormatter using the miliseconds
import * as KZ from "../../src/kosher-zmanim.ts"

import { langInterf } from "./lib.ts";

const timezoneOffset: (string|number)[][] = [];
for (const timezone of Intl.supportedValuesOf("timeZone")) {
    timezoneOffset.push([timezone, KZ.TimeZone.getRawOffset(timezone), parseInt(langInterf['jv'].main.tzOffset(timezone))])
}
for (const tzLog of timezoneOffset.filter(array => array[1] !== array[2]))
    console.log(...tzLog)