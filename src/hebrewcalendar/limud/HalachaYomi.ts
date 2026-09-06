// @ts-check

import { HebrewDateFormatter } from "../HebrewDateFormatter";
import JewishDate from '../JewishDate.ts';

export interface HalachaSegment {
    bookName: string;
    siman: number;
    firstSeif: number;
    seifim: string;
    lastSeif: number;
}

export interface SimanInfo {
    simanNumber: number;
    seifCount: number;
}

export interface DailyLearning {
    jewishDate: JewishDate;
    hebrewDate: string; // Formatted Hebrew date
    dayOfWeek: string; // Hebrew day name
    dayOfWeekNumber: number; // 1-7 where 1 = Sunday, 7 = Shabbat
    segments: HalachaSegment[];
}

export interface WeeklyLearning {
    weekStart: JewishDate; // Sunday (Gregorian)
    weekEnd: JewishDate; // Shabbat (Saturday, Gregorian)
    jewishWeekStart: string; // Hebrew date of Sunday
    jewishWeekEnd: string; // Hebrew date of Saturday
    weekNumber: number; // Week number in the Hebrew calendar year
    days: DailyLearning[];
    weeklyRange: string;
    totalSegments: HalachaSegment[];
}

// SimanRepository (unchanged)
export class SimanRepository {
    static readonly shulchanAruchCounts: number[] = [
        9, 6, 17, 23, 1, 4, 4, 17, 6, 12, 15, 3, 3, 5, 6, 1, 3, 3, 2, 2, 4, 1,
        3, 6, 13, 2, 11, 3, 1, 5, 2, 52, 5, 4, 1, 3, 3, 13, 10, 8, 1, 3,
        9, 1, 2, 9, 14, 1, 1, 1, 9, 1, 26, 3, 22, 5, 2, 7, 5, 5, 26, 5, 9, 4, 3, 10, 1, 1, 2, 5, 7, 5, 4, 6, 6, 8, 2, 1, 9, 1, 2, 2, 5, 1, 2, 1, 3, 1, 8, 27, 6, 10, 4, 9, 4, 2, 5, 5, 3, 1, 4, 5, 3, 8, 1,
        2, 4, 12, 3, 8, 3, 2, 9, 9, 1, 1, 5, 1, 4, 1, 3, 3, 6, 12, 2, 4, 2, 45, 2, 1, 8, 2, 1, 2, 14, 1, 6, 1, 11, 3, 8, 2, 5, 4, 3, 4, 8, 1, 1, 5, 12, 1, 22, 15, 2, 1, 1, 13, 20, 15, 4, 10, 2, 2, 2, 1, 20, 17, 3, 22, 5, 2, 3, 8, 6, 1, 5, 7, 6, 5, 10, 7, 12, 6, 5, 2, 4, 10, 2, 5, 3, 2, 6, 3, 3, 4, 4, 1, 11, 2, 4, 18, 8, 13, 5, 6, 1, 18, 3, 2, 6, 2, 3, 1, 4, 14, 8, 9, 9, 2, 2, 4, 6, 13, 10, 1, 3, 3, 2, 5, 1, 3, 2, 2, 4, 4, 1, 2, 2, 17, 1, 1, 2, 6, 6, 5, 6, 4, 4, 2, 2, 7, 5, 9, 3, 1, 8, 1, 7, 2, 4, 3, 17, 10, 4, 13, 3, 13, 1, 2, 17, 10, 7, 4, 12, 5, 5, 1, 7, 2, 1, 7, 1, 7, 7, 5, 1, 10, 2, 2, 6, 2, 3, 5, 1, 8, 5, 15, 10, 1, 51, 13, 27, 3, 23, 14, 22, 52, 5, 9, 9, 10, 10, 12, 13, 12, 7, 19, 17, 20, 19, 6, 10, 15, 16, 13, 4, 49, 9, 11, 10, 4, 3, 27, 5, 13, 4, 8, 7, 14, 3, 1, 1, 2, 19, 3, 1, 1, 5, 3, 1, 2, 3, 2, 5, 2, 3, 14, 1, 3, 2, 12, 36, 5, 8, 15, 1, 5, 1, 8, 6, 19, 1, 4, 4, 4, 1, 5, 2, 4, 7, 20, 1, 2, 4, 9, 1, 1, 1, 2, 2, 8, 3, 3, 1, 2, 18, 11, 11, 1, 1, 1, 1, 1, 9, 1, 3, 4, 13, 3, 1, 1, 1, 2, 4, 5, 1, 5, 1, 2, 1, 7, 4, 1, 3, 4, 1, 8, 2, 1, 2, 2, 11, 4, 1, 3, 4, 2, 4, 4, 2, 11, 3, 8, 3, 4, 12, 7, 1, 7, 27, 7, 9, 4, 6, 3, 2, 1, 6, 7, 5, 7, 3, 1, 3, 6, 16, 10, 1, 3, 3, 16, 7, 1, 7, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 4, 3, 10, 9, 2, 1, 4, 3, 4, 3, 17, 20, 5, 6, 7, 4, 2, 4, 1, 9, 7, 2, 7, 11, 4, 3, 8, 11, 9, 3, 4, 9, 5, 1, 3, 4, 4, 2, 2, 12, 24, 2, 4, 1, 8, 2, 5, 3, 3, 4, 16, 6, 14, 8, 5, 2, 3, 2, 11, 5, 12, 20, 2, 4, 18, 12, 2, 25, 2, 1, 1, 1, 10, 5, 5, 13, 1, 1, 6, 8, 3, 12, 2, 3, 3, 3, 1, 5, 13, 16, 1, 1, 3, 3, 4, 9, 2, 4, 5, 23, 3, 5, 9, 9, 8, 4, 2, 1, 1, 1, 3, 1, 1, 3, 2, 1, 1, 2, 1, 4, 6, 4, 1, 4, 2, 10, 12, 4, 2, 2, 4, 10, 6, 1, 6, 4, 6, 5, 1, 3, 4, 3, 19, 13, 10, 4, 10, 4, 1, 2, 3, 2, 8, 10, 1, 1, 3, 2, 9, 11, 2, 22, 6, 2, 15, 2, 2, 1, 1, 1, 1, 9, 1, 3, 1, 3, 3, 11, 2, 1, 1, 2, 1, 3, 8, 2, 4, 2, 3, 5, 4, 1, 1, 2, 2, 3, 1, 3, 7, 3, 2, 8, 6, 18, 11, 4, 4, 4, 4,
        8
    ];

    static readonly actualKitzurSeifimCounts: number[] = [
        7, 9, 8, 6, 17, 11, 8, 6, 21, 26, 25, 15, 5, 8, 13, 5, 10, 22, 14, 12,
        10, 10, 30, 12, 8, 22, 5, 13, 21, 9, 7, 27, 14, 16, 9, 28, 13, 15, 3, 21,
        10, 23, 7, 18, 23, 46, 22, 10, 49, 16, 15, 18, 6, 9, 5, 7, 7, 14, 21, 15,
        10, 18, 5, 4, 30, 12, 11, 12, 9, 5, 5, 23, 11, 4, 14, 23, 24, 11, 10, 94,
        5, 13, 6, 19, 8, 7, 24, 18, 6, 23, 18, 10, 5, 27, 18, 15, 15, 37, 5, 22,
        6, 7, 14, 21, 2, 8, 3, 7, 9, 15, 17, 6, 9, 13, 6, 18, 13, 11, 12, 11,
        11, 17, 5, 22, 8, 4, 18, 16, 23, 6, 17, 5, 31, 15, 22, 10, 13, 10, 26, 3,
        23, 10, 22, 9, 26, 4, 5, 4, 13, 17, 7, 17, 16, 7, 12, 3, 8, 4, 10, 6,
        20, 14, 8, 10, 16, 5, 15, 7, 3, 2, 3, 3, 4, 3, 6, 8, 15, 5, 15, 16,
        22, 16, 7, 11, 6, 4, 5, 5, 6, 3, 6, 10, 14, 12, 14, 22, 13, 16, 17, 11,
        7, 16, 5, 11, 9, 11, 7, 15, 8, 9, 15, 5, 5, 3, 3, 2, 4, 2, 9, 10, 8
    ];

    static get shulchanAruchStructure(): SimanInfo[] {
        return this.shulchanAruchCounts.map((count, index) => ({
            simanNumber: index + 1,
            seifCount: count
        }));
    }

    static get kitzurStructure(): SimanInfo[] {
        const rangesToLearn: [number, number][] = [
            [11, 11],
            [24, 24],
            [27, 38],
            [46, 47],
            [62, 67],
            [71, 71],
            [143, 221]
        ];

        const structure: SimanInfo[] = [];

        for (const [start, end] of rangesToLearn) {
            for (let simanNum = start; simanNum <= end; simanNum++) {
                const listIndex = simanNum - 1;
                if (listIndex >= 0 && listIndex < this.actualKitzurSeifimCounts.length) {
                    structure.push({
                        simanNumber: simanNum,
                        seifCount: this.actualKitzurSeifimCounts[listIndex]
                    });
                }
            }
        }

        return structure;
    }
}

// HalachaYomi with JewishDate consistently
export default class HalachaYomi {
    // START_DATE: November 12, 2020 (Gregorian) 
    private static readonly START_DATE = Temporal.PlainDate.from({ day: 12, month: 11, year: 2020 });
    private static readonly RATE_SA = 3;
    private static readonly RATE_KITZUR = 5;
    private static readonly NAME_SA = "שו\"ע - או\"ח";
    private static readonly NAME_KITZUR = "קיצשו\"ע";

    // Cache formatter instance
    private static formatter: HebrewDateFormatter | null = null;

    /**
     * Get or create the HebrewDateFormatter instance
     */
    private static getFormatter(): HebrewDateFormatter {
        if (!this.formatter) {
            this.formatter = new HebrewDateFormatter();
            this.formatter.setHebrewFormat(true);
            this.formatter.setUseGershGershayim(true);
            this.formatter.setUseLongHebrewYears(false);
            this.formatter.setUseFinalFormLetters(false);
        }
        return this.formatter;
    }

    /**
     * Get the day of the week in the Jewish calendar (1-7, where 1 = Sunday, 7 = Shabbat)
     */
    private static getJewishDayOfWeek(date: JewishDate): number {
        return date.getDayOfWeek();
    }

    /**
     * Get the start of the Jewish week (Sunday) for a given date
     */
    private static getJewishWeekStart(date: JewishDate): JewishDate {
        const dayOfWeek = this.getJewishDayOfWeek(date);
        const daysToSubtract = dayOfWeek - 1;

        const weekStartDate = new JewishDate(date.getDate().subtract({ days: daysToSubtract }));
        return weekStartDate;
    }

    /**
     * Format Hebrew date using the HebrewDateFormatter
     */
    private static formatHebrewDate(date: JewishDate): string {
        const formatter = this.getFormatter();
        return formatter.format(date);
    }

    /**
     * Format Hebrew day of week
     */
    private static formatHebrewDayOfWeek(date: JewishDate): string {
        const formatter = this.getFormatter();
        return formatter.formatDayOfWeek(date);
    }

    /**
     * Get the Jewish week number for a given date
     */
    private static getJewishWeekNumber(date: JewishDate): number {
        const weekStart = this.getJewishWeekStart(date);
        const daysSinceRoshHashanah = this.daysBetween(
            Temporal.PlainDate.from({ calendarId: 'hebrew', year: date.getJewishYear(), month: 1, day: 1}),
            weekStart.getDate().withCalendar("hebrew")
        );
        return Math.floor(daysSinceRoshHashanah / 7) + 1;
    }

    /**
     * Get a single day's learning
     */
    static getDailyLearning(date: JewishDate): HalachaSegment[] | null {
        if (Temporal.PlainDate.compare(date.getDate(), this.START_DATE) < 0) return null;

        const saStructure = SimanRepository.shulchanAruchStructure;
        const kitzurStructure = SimanRepository.kitzurStructure;

        const totalSaSeifim = saStructure.reduce((sum, info) => sum + info.seifCount, 0);
        const totalKitzurSeifim = kitzurStructure.reduce((sum, info) => sum + info.seifCount, 0);

        const daysInSaPhase = Math.ceil(totalSaSeifim / this.RATE_SA);
        const daysInKitzurPhase = Math.ceil(totalKitzurSeifim / this.RATE_KITZUR);
        const totalDaysInCycle = daysInSaPhase + daysInKitzurPhase;

        const totalDaysPassed = this.daysBetween(this.START_DATE, date.getDate());
        const dayInCurrentCycle = totalDaysPassed % totalDaysInCycle;

        if (dayInCurrentCycle < daysInSaPhase) {
            const startSeifIndex = dayInCurrentCycle * this.RATE_SA;
            return this.calculateSegments(
                startSeifIndex,
                this.RATE_SA,
                saStructure,
                this.NAME_SA,
                totalSaSeifim
            );
        } else {
            const daysIntoKitzur = dayInCurrentCycle - daysInSaPhase;
            const startSeifIndex = daysIntoKitzur * this.RATE_KITZUR;
            return this.calculateSegments(
                startSeifIndex,
                this.RATE_KITZUR,
                kitzurStructure,
                this.NAME_KITZUR,
                totalKitzurSeifim
            );
        }
    }

    /**
     * Get a week's worth of learning from Sunday to Shabbat (Saturday)
     */
    static getWeeklyLearning(date: JewishDate = new JewishDate()): WeeklyLearning {
        const days: DailyLearning[] = [];
        const weekStart = this.getJewishWeekStart(date);
        const weekStartPlain = weekStart.getDate();
        
        // Create weekEnd as 6 days after weekStart
        const weekEnd = new JewishDate(weekStartPlain.add({ days: 6 }));

        // Get learning for each day of the week (Sunday to Saturday)
        for (let i = 0; i < 7; i++) {
            const currentDatePlain = weekStartPlain.add({ days: i });
            const currentDay = new JewishDate(currentDatePlain);
            
            const segments = this.getDailyLearning(currentDay);
            
            days.push({
                jewishDate: currentDay,
                hebrewDate: this.formatHebrewDate(currentDay),
                dayOfWeek: this.formatHebrewDayOfWeek(currentDay),
                dayOfWeekNumber: this.getJewishDayOfWeek(currentDay),
                segments: segments || []
            });
        }

        // Calculate the overall weekly range
        const allSegments: HalachaSegment[] = [];
        for (const day of days) {
            allSegments.push(...day.segments);
        }

        const formatter = this.getFormatter();

        // Create a condensed weekly range string
        let weeklyRange = '';
        if (allSegments.length > 0) {
            const firstSegment = allSegments[0];
            const lastSegment = allSegments[allSegments.length - 1];

            const allSameBook = allSegments.every(s => s.bookName === firstSegment.bookName);

            if (allSameBook) {
                const firstSimanHebrew = formatter.formatHebrewNumber(firstSegment.siman);
                const lastSimanHebrew = formatter.formatHebrewNumber(lastSegment.siman);
                const firstSeifHebrew = formatter.formatHebrewNumber(firstSegment.firstSeif);
                const lastSeifHebrew = formatter.formatHebrewNumber(firstSegment.lastSeif);

                weeklyRange = `${firstSegment.bookName} ${firstSimanHebrew}:${firstSeifHebrew} - ${lastSimanHebrew}:${lastSeifHebrew}`;
            } else {
                const uniqueBooks = [...new Set(allSegments.map(s => s.bookName))];
                weeklyRange = uniqueBooks.join(' & ');
            }
        }

        const weekNumber = this.getJewishWeekNumber(date);

        return {
            weekStart: weekStart,
            weekEnd: weekEnd,
            jewishWeekStart: this.formatHebrewDate(weekStart),
            jewishWeekEnd: this.formatHebrewDate(weekEnd),
            weekNumber: weekNumber,
            days: days,
            weeklyRange: weeklyRange,
            totalSegments: allSegments
        };
    }

    /**
     * Get a formatted string showing the weekly learning progression
     */
    static getWeeklyLearningString(date: JewishDate = new JewishDate()): string {
        const weeklyLearning = this.getWeeklyLearning(date);
        const formatter = this.getFormatter();
        
        let output = '';
        output += `📖 Halacha Yomi - Weekly Learning\n`;
        output += `📅 Week ${weeklyLearning.weekNumber} (${weeklyLearning.jewishWeekStart} - ${weeklyLearning.jewishWeekEnd})\n`;
        output += `📅 Gregorian: ${weeklyLearning.weekStart.getDate().toString()} - ${weeklyLearning.weekEnd.getDate().toString()}\n`;
        
        if (weeklyLearning.weeklyRange) {
            output += `📚 Weekly Range: ${weeklyLearning.weeklyRange}\n`;
        }
        output += `${'='.repeat(60)}\n\n`;

        for (const day of weeklyLearning.days) {
            const dayLabel = day.dayOfWeekNumber === 7 ? 'שבת' : `יום ${day.dayOfWeek}`;
            output += `${dayLabel} (${day.hebrewDate})\n`;
            
            if (day.segments.length === 0) {
                output += `  ❌ No learning available\n\n`;
                continue;
            }

            for (const segment of day.segments) {
                const simanHebrew = formatter.formatHebrewNumber(segment.siman);
                output += `  ${segment.bookName}\n`;
                output += `    📖 Siman ${simanHebrew}, Seifim ${segment.seifim}\n`;
            }
            output += '\n';
        }

        return output;
    }

    /**
     * Get a condensed weekly summary
     */
    static getWeeklySummary(date: JewishDate = new JewishDate()): string {
        const weeklyLearning = this.getWeeklyLearning(date);
        const formatter = this.getFormatter();
        
        let summary = `📅 Week ${weeklyLearning.weekNumber} (${weeklyLearning.jewishWeekStart} - ${weeklyLearning.jewishWeekEnd})\n`;
        summary += `${'─'.repeat(50)}\n`;

        const dayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

        for (let i = 0; i < weeklyLearning.days.length; i++) {
            const day = weeklyLearning.days[i];
            if (day.segments.length === 0) {
                summary += `יום ${dayNames[i]}: ❌\n`;
                continue;
            }

            const segmentStrings = day.segments.map(seg => {
                const simanHebrew = formatter.formatHebrewNumber(seg.siman);
                return `${simanHebrew}:${seg.seifim}`;
            });
            summary += `יום ${dayNames[i]}: ${segmentStrings.join(' | ')}\n`;
        }

        return summary;
    }

    /**
     * Get a compact one-line summary
     */
    static getWeeklyCompact(date: JewishDate = new JewishDate()): string {
        const weeklyLearning = this.getWeeklyLearning(date);

        if (weeklyLearning.totalSegments.length === 0) {
            return `No learning available for this week`;
        }

        const firstSegment = weeklyLearning.totalSegments[0];
        const lastSegment = weeklyLearning.totalSegments[weeklyLearning.totalSegments.length - 1];

        const allSameBook = weeklyLearning.totalSegments.every(s => s.bookName === firstSegment.bookName);

        const formatter = this.getFormatter();

        let result = '';
        if (allSameBook) {
            const firstSimanHebrew = formatter.formatHebrewNumber(firstSegment.siman);
            const lastSimanHebrew = formatter.formatHebrewNumber(lastSegment.siman);
            const firstSeifHebrew = formatter.formatHebrewNumber(firstSegment.firstSeif);
            const lastSeifHebrew = formatter.formatHebrewNumber(firstSegment.lastSeif);

            result = `${firstSegment.bookName} ${firstSimanHebrew}:${firstSeifHebrew} - ${lastSimanHebrew}:${lastSeifHebrew}`;
        } else {
            const uniqueBooks = [...new Set(weeklyLearning.totalSegments.map(s => s.bookName))];
            result = uniqueBooks.join(' & ');
        }

        return result;
    }

    /**
     * Get just the Hebrew formatted date for a specific day
     */
    static getHebrewDate(date: JewishDate): string {
        return this.formatHebrewDate(date);
    }

    /**
     * Get the Hebrew day of week for a specific date
     */
    static getHebrewDayOfWeek(date: JewishDate): string {
        return this.formatHebrewDayOfWeek(date);
    }

    private static calculateSegments(
        globalStartIndex: number,
        amountToRead: number,
        structure: SimanInfo[],
        bookName: string,
        totalSeifimInBook: number
    ): HalachaSegment[] {
        const results: HalachaSegment[] = [];

        const actualAmountToRead = Math.min(amountToRead, totalSeifimInBook - globalStartIndex);
        const globalEndIndex = globalStartIndex + actualAmountToRead;

        let currentSimanStartGlobalIndex = 0;
        const formatter = this.getFormatter();

        for (const simanInfo of structure) {
            const simanNumber = simanInfo.simanNumber;
            const seifCountInSiman = simanInfo.seifCount;

            const currentSimanEndGlobalIndex = currentSimanStartGlobalIndex + seifCountInSiman;

            const overlapStart = Math.max(currentSimanStartGlobalIndex, globalStartIndex);
            const overlapEnd = Math.min(currentSimanEndGlobalIndex, globalEndIndex);

            if (overlapStart < overlapEnd) {
                const localStart = (overlapStart - currentSimanStartGlobalIndex) + 1;
                const localEnd = (overlapEnd - currentSimanStartGlobalIndex);

                const rangeString = localStart === localEnd 
                    ? `${formatter.formatHebrewNumber(localStart)}`
                    : `${formatter.formatHebrewNumber(localStart)}-${formatter.formatHebrewNumber(localEnd)}`;

                results.push({
                    bookName: bookName,
                    siman: simanNumber,
                    firstSeif: localStart,
                    seifim: rangeString,
                    lastSeif: localEnd
                });

                if (bookName === this.NAME_SA && simanNumber === 696 && localEnd === 8) {
                    results.push({
                        bookName: bookName,
                        siman: 697,
                        firstSeif: 1,
                        seifim: formatter.formatHebrewNumber(1),
                        lastSeif: 1
                    });
                }
            }

            if (currentSimanEndGlobalIndex >= globalEndIndex) break;
            currentSimanStartGlobalIndex += seifCountInSiman;
        }

        return results;
    }

    private static daysBetween(date1: Temporal.PlainDate, date2: Temporal.PlainDate): number {
        // Use Temporal PlainDate's until method for accurate day calculation
        const d1 = date1;
        const d2 = date2;

        // until() returns a Duration with largestUnit as days
        const duration = d2.until(d1, { largestUnit: 'days' });
        return -duration.days; // Negate because until is d2.until(d1), not d1.until(d2)
    }
}