interface RambamReading {
  bookName: string;
  chapters: number[]; // Array of chapter numbers, e.g., [1] or [1, 2, 3] or [1, 21] for a range
}

class DailyMishnehTorah {
  private static readonly CYCLE_LENGTH = 1017;
  // April 29, 1984
  private static readonly START_DATE = Temporal.PlainDate.from('1984-04-29');

  // Special formatting for the first 4 books - these are actually ranges of verses/paragraphs
  // We store them as the actual numeric ranges they represent
  private static readonly specialVerseRanges = [
    [
      { start: 1, end: 21 },   // Transmission of the Oral Law
      { start: 22, end: 33 },
      { start: 34, end: 45 }
    ],
    [
      { start: 1, end: 83 },   // Positive Mitzvot
      { start: 84, end: 166 },
      { start: 167, end: 248 }
    ],
    [
      { start: 1, end: 122 },  // Negative Mitzvot
      { start: 123, end: 245 },
      { start: 246, end: 365 }
    ],
    [
      { start: 1, end: 4 },    // Overview of Mishneh Torah Contents
      { start: 5, end: 9 },
      { start: 10, end: 14 }
    ]
  ];

  private static readonly books = [
    { name: "הקדמת הרמב\"ם", chapterCount: 3 },
    { name: "מצוות עשה", chapterCount: 3 },
    { name: "מצוות לא תעשה", chapterCount: 3 },
    { name: "תוכן ההלכות", chapterCount: 3 },
    { name: "הלכות יסודי התורה", chapterCount: 10 },
    { name: "הלכות דעות", chapterCount: 7 },
    { name: "הלכות תלמוד תורה", chapterCount: 7 },
    { name: "הלכות עבודה זרה וחוקות הגויים", chapterCount: 12 },
    { name: "הלכות תשובה", chapterCount: 10 },
    { name: "הלכות קריאת שמע", chapterCount: 4 },
    { name: "הלכות תפילה וברכת כהנים", chapterCount: 15 },
    { name: "הלכות תפילין ומזוזה וספר תורה", chapterCount: 10 },
    { name: "הלכות ציצית", chapterCount: 3 },
    { name: "הלכות ברכות", chapterCount: 11 },
    { name: "הלכות מילה", chapterCount: 3 },
    { name: "סדר התפילה", chapterCount: 4 },
    { name: "הלכות שבת", chapterCount: 30 },
    { name: "הלכות ערובין", chapterCount: 8 },
    { name: "הלכות שביתת עשור", chapterCount: 3 },
    { name: "הלכות שביתת יום טוב", chapterCount: 8 },
    { name: "הלכות חמץ ומצה", chapterCount: 9 },
    { name: "הלכות שופר וסוכה ולולב", chapterCount: 8 },
    { name: "הלכות שקלים", chapterCount: 4 },
    { name: "הלכות קידוש החודש", chapterCount: 19 },
    { name: "הלכות תעניות", chapterCount: 5 },
    { name: "הלכות מגילה וחנוכה", chapterCount: 4 },
    { name: "הלכות אישות", chapterCount: 25 },
    { name: "הלכות גירושין", chapterCount: 13 },
    { name: "הלכות ייבום וחליצה", chapterCount: 8 },
    { name: "הלכות נערה בתולה", chapterCount: 3 },
    { name: "הלכות סוטה", chapterCount: 4 },
    { name: "הלכות איסורי ביאה", chapterCount: 22 },
    { name: "הלכות מאכלות אסורות", chapterCount: 17 },
    { name: "הלכות שחיטה", chapterCount: 14 },
    { name: "הלכות שבועות", chapterCount: 12 },
    { name: "הלכות נדרים", chapterCount: 13 },
    { name: "הלכות נזירות", chapterCount: 10 },
    { name: "הלכות ערכים וחרמים", chapterCount: 8 },
    { name: "הלכות כלאיים", chapterCount: 10 },
    { name: "הלכות מתנות עניים", chapterCount: 10 },
    { name: "הלכות תרומות", chapterCount: 15 },
    { name: "הלכות מעשרות", chapterCount: 14 },
    { name: "הלכות מעשר שני ונטע רבעי", chapterCount: 11 },
    { name: "הלכות ביכורים ושאר מתנות כהונה שבגבולין", chapterCount: 12 },
    { name: "הלכות שמיטה ויובל", chapterCount: 13 },
    { name: "הלכות בית הבחירה", chapterCount: 8 },
    { name: "הלכות כלי המקדש והעובדים בו", chapterCount: 10 },
    { name: "הלכות ביאת המקדש", chapterCount: 9 },
    { name: "הלכות איסורי מזבח", chapterCount: 7 },
    { name: "הלכות מעשה הקרבנות", chapterCount: 19 },
    { name: "הלכות תמידין ומוספין", chapterCount: 10 },
    { name: "הלכות פסולי המוקדשין", chapterCount: 19 },
    { name: "הלכות עבודת יום הכיפורים", chapterCount: 5 },
    { name: "הלכות מעילה", chapterCount: 8 },
    { name: "הלכות קרבן פסח", chapterCount: 10 },
    { name: "הלכות חגיגה", chapterCount: 3 },
    { name: "הלכות בכורות", chapterCount: 8 },
    { name: "הלכות שגגות", chapterCount: 15 },
    { name: "הלכות מחוסרי כפרה", chapterCount: 5 },
    { name: "הלכות תמורה", chapterCount: 4 },
    { name: "הלכות טומאת מת", chapterCount: 25 },
    { name: "הלכות פרה אדומה", chapterCount: 15 },
    { name: "הלכות טומאת צרעת", chapterCount: 16 },
    { name: "הלכות מטמאי משכב ומושב", chapterCount: 13 },
    { name: "הלכות שאר אבות הטומאות", chapterCount: 20 },
    { name: "הלכות טומאת אוכלין", chapterCount: 16 },
    { name: "הלכות כלים", chapterCount: 28 },
    { name: "הלכות מקוואות", chapterCount: 11 },
    { name: "הלכות נזקי ממון", chapterCount: 14 },
    { name: "הלכות גנבה", chapterCount: 9 },
    { name: "הלכות גזילה ואבידה", chapterCount: 18 },
    { name: "הלכות חובל ומזיק", chapterCount: 8 },
    { name: "הלכות רוצח ושמירת נפש", chapterCount: 13 },
    { name: "הלכות מכירה", chapterCount: 30 },
    { name: "הלכות זכייה ומתנה", chapterCount: 12 },
    { name: "הלכות שכנים", chapterCount: 14 },
    { name: "הלכות שלוחין ושותפין", chapterCount: 10 },
    { name: "הלכות עבדים", chapterCount: 9 },
    { name: "הלכות שכירות", chapterCount: 13 },
    { name: "הלכות שאלה ופיקדון", chapterCount: 8 },
    { name: "הלכות מלווה ולווה", chapterCount: 27 },
    { name: "הלכות טוען ונטען", chapterCount: 16 },
    { name: "הלכות נחלות", chapterCount: 11 },
    { name: "הלכות סנהדרין והעונשין המסורין להם", chapterCount: 26 },
    { name: "הלכות עדות", chapterCount: 22 },
    { name: "הלכות ממרים", chapterCount: 7 },
    { name: "הלכות אבל", chapterCount: 14 },
    { name: "הלכות מלכים ומלחמות", chapterCount: 12 }
  ];

  /**
   * Calculates Daily Rambam (Mishneh Torah) for 1 chapter a day cycle.
   */
  static getDailyLearning(date: Temporal.PlainDate): RambamReading | null {
    if (Temporal.PlainDate.compare(date, this.START_DATE) < 0) return null;

    const daysDifference = date.since(this.START_DATE, { largestUnit: 'days' }).days;
    const cycleIndex = daysDifference % this.CYCLE_LENGTH;

    return this.getChapterByIndex(cycleIndex);
  }

  /**
   * Calculates Daily Rambam (Mishneh Torah) for 3 chapters a day cycle.
   * Returns a list of readings for the day.
   */
  static getDailyLearning3(date: Temporal.PlainDate): RambamReading[] | null {
    if (Temporal.PlainDate.compare(date, this.START_DATE) < 0) return null;

    const daysDifference = date.since(this.START_DATE, { largestUnit: 'days' }).days;

    // Cycle length for 3 chapters is 1/3 of the main cycle (339 days)
    const cycleLength3 = Math.floor(this.CYCLE_LENGTH / 3);
    const dayInCycle = daysDifference % cycleLength3;

    // Get the base index for the 1-chapter cycle
    const baseIndex = dayInCycle * 3;

    const r1 = this.getChapterByIndex(baseIndex);
    const r2 = this.getChapterByIndex(baseIndex + 1);
    const r3 = this.getChapterByIndex(baseIndex + 2);

    if (!r1 || !r2 || !r3) return null;

    // Check if all 3 chapters are from the same section/book
    if (r1.bookName === r2.bookName && r2.bookName === r3.bookName) {
      return [this.combineReadings(r1, r3)];
    } else if (r1.bookName === r2.bookName) {
      return [this.combineReadings(r1, r2), r3];
    } else if (r2.bookName === r3.bookName) {
      return [r1, this.combineReadings(r2, r3)];
    }

    return [r1, r2, r3];
  }

  private static combineReadings(first: RambamReading, last: RambamReading): RambamReading {
    // Get all chapters from first reading
    const chapters = [...first.chapters];
    
    // If last reading has more than one chapter (a range), add all its chapters
    if (last.chapters.length > 1) {
      chapters.push(...last.chapters.slice(1));
    }
    // If it's a single chapter and it's not already included
    else if (!chapters.includes(last.chapters[0])) {
      chapters.push(last.chapters[0]);
    }
    
    // If we have a range (more than 2 chapters), we can condense it
    // But we keep the array as-is since it's more flexible
    return { bookName: first.bookName, chapters };
  }

  /**
   * Helper function to display a reading in a readable format
   */
  static formatReading(reading: RambamReading): string {
    const chapters = reading.chapters;
    if (chapters.length === 1) {
      return `${reading.bookName} - Chapter ${chapters[0]}`;
    } else if (chapters.length === 2) {
      return `${reading.bookName} - Chapters ${chapters[0]}-${chapters[1]}`;
    } else {
      // For 3 chapters from the same book (3-per-day cycle)
      return `${reading.bookName} - Chapters ${chapters[0]}-${chapters[chapters.length - 1]}`;
    }
  }

  // --- Core Calculation Logic ---

  private static getChapterByIndex(index: number): RambamReading | null {
    let remainingChapters = index;

    for (let bookIndex = 0; bookIndex < this.books.length; bookIndex++) {
      const book = this.books[bookIndex];
      if (remainingChapters < book.chapterCount) {
        const chapterNum = remainingChapters + 1;

        let chapters: number[];
        if (bookIndex < 4) {
          // For the first 4 books, the "chapters" are actually ranges
          const range = this.specialVerseRanges[bookIndex][chapterNum - 1];
          // If start and end are the same, it's a single chapter
          if (range.start === range.end) {
            chapters = [range.start];
          } else {
            chapters = [range.start, range.end];
          }
        } else {
          chapters = [chapterNum];
        }

        return { bookName: book.name, chapters };
      }
      remainingChapters -= book.chapterCount;
    }
    return null;
  }
}

export default DailyMishnehTorah;