# Introduction
TemporalZmanim is a TS/JS port of the [KosherJava](KosherJava/zmanim) library, rewritten to match Temporal standards (nanosecond based support, accurate TimeZone offsets). It is based on KosherZmanim, which is a direct port of KosherJava to TS.

## Setup
1. Either install from pnpm (`pnpm install temporal-zmanim`) or (web/Deno only) import from skypack.
2. Import the library using ESM imports (`import * as KosherZmanim from "kosher-zmanim";`)
3. Use the API the same way you would use KosherJava, except replace Java-specific imports with JS counterparts:
  - `shaahZmanis` functions return a `Temporal.Duration` rather than an integer with milliseconds
  - Other functions from the AstronomicalCalendar/ZmanimCalendar/ComplexZmanimCalendar classes will return a `Temporal.ZonedDateTime`
  - Input for all classes will use a `Temporal.PlainDate`, since TimeZone data is stored in the `GeoLocation` class

## Deviations
* `AstronomicalCalendar.getTemporalHour()` returns `null` instead of `Long.MIN_VALUE` if the calculations cannot be completed.
* JS/TS does not have a parallel to Java's `Long.MIN_VALUE`, so `Long_MIN_VALUE` is set to `NaN`.
* The following methods are not supported:
  * `AstronomicalCalendar.toString()`
  * `AstronomicalCalendar.toJSON()`
  (Use `ZmanimFormatter.toJSON(astronomicalCalendar)` instead).
  * `AstronomicalCalculator.getDefault()`
  (Use `new NOAACalculator()` instead).
  * `JewishCalendar.getDafYomiBavli()`
  (Use `YomiCalculator.getDafYomiBavli(jewishCalendar)` instead).
  * `JewishCalendar.getDafYomiYerushalmi()`
  (Use `YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar)` instead).
  * `Time.toString()`
  (Use `new ZmanimFormatter(TimeZone.getTimeZone("UTC")).format(time)` instead).
  * `ZmanimFormatter.toXML()`
* The `Zman` class uses public members instead of getters and setters.
* `AstronomicalCalendar.getTimeOffset` has been removed due to redundancy and either way not working like the original implementation