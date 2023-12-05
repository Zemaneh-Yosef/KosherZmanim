// Import this to handle dates to push into DateFormatter
import { DateTime } from "luxon"

// Import KosherZmanim as the methodListAcquirer & DateFormatter using the miliseconds
import * as KZ from "../../src/kosher-zmanim.ts"
import { getAllMethods, langInterf, locationError, locationLogger, pyStr } from "./lib.ts";

const logConfig = {
    rangeOfAcceptible: 100,
    noValidFunction: false,
    unCallable: false,
    shaahZmanitNaN: false,
    shaahZmanitSame: false
}

const methodNames = getAllMethods(KZ.ComplexZmanimCalendar.prototype)
const methodsWithToMillis = {
    'Aloth Hashachar': methodNames.filter(str => str.startsWith('getAlos')),
    'Misheyakir': methodNames.filter(str => str.startsWith('getMisheyakir')),
    'Sunrise': methodNames.filter(str => str.startsWith('getSunrise')),
    //'Sof Zman': methodNames.filter(str => str.startsWith('getSof')), // getSofZmanKidushLevana15Days breaks this
    'Sof Zman Shema': methodNames.filter(str => str.startsWith('getSofZmanShma')),
    'Sof Zman Tefilah': methodNames.filter(str => str.startsWith('getSofZmanTfila')),
    'Sof Zman Akhilath Hametz': methodNames.filter(str => str.startsWith('getSofZmanAchilas')),
    'Sof Zman Biur Hametz': methodNames.filter(str => str.startsWith('getSofZmanBiur')),
    'Mincha Gedolah': methodNames.filter(str => str.startsWith('getMinchaGedola')),
    'Samukh Mincha Ketanah': methodNames.filter(str => str.startsWith('getSamuch')),
    'Mincha Ketanah': methodNames.filter(str => str.startsWith('getMinchaKetana')),
    'Plag HaMinchah': methodNames.filter(str => str.startsWith('getPlag')),
    'Sunset': methodNames.filter(str => str.startsWith('getSunset')),
    "Ben Hashmashoth": methodNames.filter(str => str.startsWith('getBainHashmashos')),
    'Tzeth Hakokhavim': methodNames.filter(str => str.startsWith('getTzais'))
}

const methodsWithoutToMillis = {
    'Shaoth Zmanith': methodNames.filter(str => str.startsWith('getShaahZmanis'))
}

const allTestedMethods = [...new Set([...Object.values(methodsWithToMillis).flat(), ...Object.values(methodsWithoutToMillis).flat()])]
const allUntestedMethods = methodNames.filter(str => !allTestedMethods.includes(str))

const locationNames = Object.values(langInterf['ts'].listAll()).map(czc => czc.getGeoLocation().getLocationName()!).sort((a, b) => b.length - a.length);
const zmanFormatDefaultParams = [KZ.ZmanimFormatter.SEXAGESIMAL_MILLIS_FORMAT, "yyyy-MM-dd h:mm:ss.SSS a z"] as const;

for (const [ZmanName, attachedMethods] of Object.entries(methodsWithToMillis)) {
    locationLogger(`Testing ${ZmanName} Methods:`)
    for (const testMethod of attachedMethods) {
        locationLogger(`${testMethod}()`)
        const tempLogs:string[][] = [];
        for (const stackInJV of Object.keys(langInterf['ts'].listAll()).map(locationKey => parseInt(locationKey))) {
            let javaTime;
            try {
                // @ts-ignore: Too Typed
                javaTime = langInterf['jv'].getLocation(stackInJV)[testMethod]()
            } catch (e) {
                if (e.message.includes('([]) does not exist')) {
                    if (logConfig.noValidFunction)
                        locationError(e)

                    allUntestedMethods.push(testMethod)
                    break;
                } else
                    throw new Error(e)
            }

            if (pyStr(javaTime) == "None") {
                if (logConfig.unCallable)
                    tempLogs.push([langInterf.ts.getLocation(stackInJV).getGeoLocation().getLocationName()!, `Expression uncallable in base (ABORT!)`])
                continue;
            }

            const zmanFrmt = new KZ.ZmanimFormatter(...zmanFormatDefaultParams, langInterf.ts.getLocation(stackInJV).getGeoLocation().getTimeZone());

            try {
                const times = [
                    // @ts-ignore: Too Typed
                    parseInt(langInterf.ts.getLocation(stackInJV)[testMethod]().toMillis()),
                    parseInt(javaTime.getTime())
                ]
                const formattedTimes = times.map(mili => zmanFrmt.formatDateTime(DateTime.fromMillis(mili)))
                if (Math.abs(times[1] - times[0]) >= logConfig.rangeOfAcceptible)
                    tempLogs.push([langInterf.ts.getLocation(stackInJV).getGeoLocation().getLocationName()!, formattedTimes[0], '(TS) -', formattedTimes[1], `(JV)`,
                        `[${new Boolean(times[0] == times[1]).toString() + (times[0] !== times[1] ? ` (${times[1] - times[0]})` : '')}]`])
            } catch (err) {
                if (err.message.includes('max requires all arguments be DateTimes')) {
                    if (logConfig.noValidFunction)
                        locationError(err)
                } else
                    throw new Error(err)
            }
        }

        if (tempLogs.length) {
            const longestLocationName = [...tempLogs].map(array=> array[0]);
            longestLocationName.sort((str1, str2) => str2.length - str1.length);

            const nonErrorArrays = [...tempLogs].filter(array=> array.length !== 2);

            const longestFstTime = nonErrorArrays.map(array=> array[1]);
            longestFstTime.sort((str1, str2) => str2.length - str1.length)

            const longestSndTime = nonErrorArrays.map(array=> array[3]);
            longestSndTime.sort((str1, str2) => str2.length - str1.length)

            // Sort via array length, because we want errors (that has two entries in their array) to go after normal reporting 
            for (const log of [...tempLogs].sort((array1, array2) => array2.length - array1.length)) {
                const locationName = `[ ${log[0].padStart(longestLocationName[0].length)} ]:`;
                if (log.length == 2) {
                    locationLogger(locationName, log[1]);
                    continue;
                }

                const fstTime = log[1].padEnd(longestFstTime[0].length);
                const sndTime = log[3].padEnd(longestSndTime[0].length);
                locationLogger(locationName, fstTime, log[2], sndTime, ...log.splice(4, log.length - 4));
            }
        }
    }
}

for (const [ZmanName, attachedMethods] of Object.entries(methodsWithoutToMillis)) {
    locationLogger(`Testing ${ZmanName} Methods:`)
    for (const testMethod of attachedMethods) {
        locationLogger(`${testMethod}()`)
        for (const stackInJV of Object.keys(langInterf.ts.listAll()).map(locationKey => parseInt(locationKey))) {
            const locationName = langInterf.ts.getLocation(stackInJV).getGeoLocation().getLocationName()?.padStart(locationNames.at(0)!.length)

            let javaCall: unknown;
            try {
                // @ts-ignore: Too typed
                javaCall = langInterf['jv'].getLocation(stackInJV)[testMethod]()
            } catch (e) {
                if (e.message.includes('([]) does not exist')) {
                    if (logConfig.noValidFunction)
                        locationError(e)

                    allUntestedMethods.push(testMethod)
                    break;
                } else
                    throw new Error(e)
            }

            if (pyStr(javaCall) == "None") {
                if (logConfig.unCallable)
                    locationLogger(`[ ${locationName} ] - Expression uncallable in base - ABORT!`)
                continue;
            }

            try {
                const times = [
                    // @ts-ignore: Too typed
                    parseInt(langInterf.ts.getLocation(stackInJV)[testMethod]()),
                    parseInt(javaCall as string)
                ]

                const NaNTest = !isNaN(times[0]) || (isNaN(times[0]) && logConfig.shaahZmanitNaN)
                const sameTest = times[0] !== times[1] || (times[0] == times[1] && logConfig.shaahZmanitSame)
                if (NaNTest && sameTest)
                    locationLogger(`[ ${locationName} ]:`, times[0], '(TS) -', times[1], `(JV) [${times[0] == times[1]}]`)
            } catch (err) {
                if (err.message.includes('max requires all arguments be DateTimes')) {
                    if (logConfig.noValidFunction)
                        locationError(err)
                } else
                    throw new Error(err)
            }
        }
    }
}

locationLogger('Untested Functions:', allUntestedMethods);