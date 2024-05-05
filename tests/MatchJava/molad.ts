// Import KosherZmanim as the methodListAcquirer & DateFormatter using the miliseconds
import * as KZ from "../../src/kosher-zmanim.ts"

import { langInterf } from "./lib.ts";


const moladDate = new KZ.JewishCalendar();
console.log('Molad Date TS', moladDate.getMoladAsDate().toLocaleString())
console.log('Molad Date JV', langInterf.jv.main.getJewishCalendar().getMoladAsDate())

const moladTS = moladDate.getMolad();
const moladJV = langInterf.jv.main.getJewishCalendar().getMolad();
console.log('Molad Chalakim TS', moladTS.getChalakimSinceMoladTohu())
console.log('Molad Chalakim JV', moladJV.getChalakimSinceMoladTohu())