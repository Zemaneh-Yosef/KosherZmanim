import { Temporal } from "@js-temporal/polyfill";

declare module "@js-temporal/polyfill" {
    namespace Temporal {
        // @ts-ignore
        interface Instant extends Temporal.Instant {
            toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string;
        }

        // @ts-ignore
        interface ZonedDateTime extends Temporal.ZonedDateTime {
            toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string;
        }
    }
  }