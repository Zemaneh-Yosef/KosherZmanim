import JewishDate from"../JewishDate.ts";

type HiloulahObj = { name: string; src: string }[];

export class HiloulahYomiCalculator {
    private folderWithHiloulotJSON: string;
    private initPromise: Promise<void> | null = null;
    private hiloulot_en: Record<string, HiloulahObj> = {};
    private hiloulot_he: Record<string, HiloulahObj> = {};

    constructor(dir: string = new URL('.', import.meta.url).href) {
        this.folderWithHiloulotJSON = dir.endsWith('/') ? dir : dir + '/';
        this.init();
    }

    public init(): Promise<void> {
        if (!this.initPromise) {
            this.initPromise = Promise.all([
                fetch(this.folderWithHiloulotJSON + 'hiloulah-en.json').then(r => r.json()),
                fetch(this.folderWithHiloulotJSON + 'hiloulah-he.json').then(r => r.json()),
            ]).then(([en, he]) => {
                this.hiloulot_en = en as Record<string, HiloulahObj>;
                this.hiloulot_he = he as Record<string, HiloulahObj>;
            });
        }
        return this.initPromise;
    }

    public async getHiloulah(jewishCalendar: JewishDate): Promise<{ en: HiloulahObj; he: HiloulahObj }> {
        await this.init();
        return this.useHiloulahData(jewishCalendar);
    }

    private useHiloulahData(jewishCalendar: JewishDate): { en: HiloulahObj; he: HiloulahObj } {
        const day = jewishCalendar.getJewishDayOfMonth().toString().padStart(2, '0');
        const month = jewishCalendar.getJewishMonth().toString().padStart(2, '0');
        const key = month + day;

        if (!jewishCalendar.isJewishLeapYear() && jewishCalendar.getJewishMonth() === JewishDate.ADAR) {
            const keys = ['12', '13'].map(m => m + day);
            return {
                en: this.mergeHiloulot(keys, this.hiloulot_en),
                he: this.mergeHiloulot(keys, this.hiloulot_he),
            };
        }

        return {
            en: this.hiloulot_en[key] ?? [],
            he: this.hiloulot_he[key] ?? [],
        };
    }

    private mergeHiloulot(keys: string[], hiloulot: Record<string, HiloulahObj>): HiloulahObj {
        const seen = new Set<string>();
        return keys
            .flatMap(k => hiloulot[k] ?? [])
            .filter(entry => {
                if (seen.has(entry.name)) return false;
                seen.add(entry.name);
                return true;
            });
    }
}