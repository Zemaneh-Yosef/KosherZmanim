// Import KosherZmanim as the methodListAcquirer & DateFormatter using the miliseconds
import * as KZ from "../../src/kosher-zmanim.ts"

// Import Python to interface with Java
import { python as py } from "https://deno.land/x/python@0.2.5/mod.ts";

// Type-Assertion ignore
// deno-lint-ignore no-explicit-any
const pyStr = (thing: any) => py.builtins.str(thing) as string;

const py4j = py.import("py4j.java_gateway")
const jv = py4j.JavaGateway();

const allLocations: Record<number, KZ.ComplexZmanimCalendar> = {};
const langInterf = {
    jv: {
        main: jv,
        getLocation: function (i: number) {
            return this.main.getStack(i) as KZ.ComplexZmanimCalendar
        },
        listAll: function () {
            return this.main.getArray()
        }
    },
    ts: {
        main: null,
        getLocation: function (i: keyof typeof allLocations) {
            return allLocations[i]
        },
        listAll: function () {
            return allLocations;
        }
    }
}
const size = parseInt(langInterf['jv'].main.getArray().size())
for (let i = 0; i < size; i++) {
    const geoLocationJava = jv.getStack(i).getGeoLocation();

    const paramMethods = ['LocationName', 'Latitude', 'Longitude', 'Elevation'];
    const paramValues = paramMethods.map(paramMethod => {
        if (paramMethod == "LocationName")
            return new String(geoLocationJava['get' + paramMethod]()).toString()
        else
            return parseFloat(geoLocationJava['get' + paramMethod]())
    })
    paramValues.push(new String(geoLocationJava.getTimeZone().getID()).toString())

    // @ts-ignore: paramValues is any
    const geoLocationTS = new KZ.GeoLocation(...paramValues)
    allLocations[i] = new KZ.ComplexZmanimCalendar(geoLocationTS)
}

// deno-lint-ignore no-explicit-any
function getAllMethods<T extends { [x: string]: any; }>(toCheck: T): string[] {
	const props = [];
    let obj = toCheck;
    do {
        props.push(...Object.getOwnPropertyNames(obj));
    // deno-lint-ignore no-cond-assign
    } while (obj = Object.getPrototypeOf(obj));

    return props.sort().filter((e, i, arr) => (e!=arr[i+1] && typeof toCheck[e] == 'function'));
}

function locationLogger(...params: Parameters<Console["log"]>) {
    console.log(...params)
}

function locationError(...params: Parameters<Console["log"]>) {
    console.error(...params)
}

export { langInterf, locationLogger, locationError, getAllMethods, pyStr }