import { JewishDate } from "../JewishDate.ts";
type hiloulahObj = { name: string; src: string; }[]

export class HiloulahYomiCalculator {
	folderWithHiloulotJSON = (new URL(import.meta.url)).pathname.substring(0, (new URL(import.meta.url)).pathname.lastIndexOf('/'));
	initFlag = false;
	hiloulot_en: Record<string, hiloulahObj> = {};
	hiloulot_he: Record<string, hiloulahObj> = {};
	constructor (dir = (new URL(import.meta.url)).pathname.substring(0, (new URL(import.meta.url)).pathname.lastIndexOf('/'))) {
		this.folderWithHiloulotJSON = dir;
		this.init();
	}

	public async init() {
		if (this.initFlag) return;

		this.hiloulot_en = (await (await fetch(this.folderWithHiloulotJSON + '/hiloulah-en.json')).json()) as Record<string, hiloulahObj>;
		this.hiloulot_he = (await (await fetch(this.folderWithHiloulotJSON + '/hiloulah-he.json')).json()) as Record<string, hiloulahObj>;

		this.initFlag = true;
	}

	public getHiloulah(jewishCalendar: JewishDate) {
		let en: hiloulahObj|null = null;
		let he: hiloulahObj|null = null;
		if (!this.initFlag)
			this.init().then(() => ({ en, he } = this.useHiloulahData(jewishCalendar)))
		else
			({ en, he } = this.useHiloulahData(jewishCalendar));

		return {en, he} as { en: hiloulahObj; he: hiloulahObj;}
	}

	private useHiloulahData(jewishCalendar: JewishDate) {
		const key = jewishCalendar.getJewishMonth().toString().padStart(2, '0') + jewishCalendar.getJewishDayOfMonth().toString().padStart(2, '0')

		let en = (key in this.hiloulot_en ? this.hiloulot_en[key] : []);
		let he = (key in this.hiloulot_he ? this.hiloulot_he[key] : []);

		if (!jewishCalendar.isJewishLeapYear() && jewishCalendar.getJewishMonth() == JewishDate.ADAR) {
			en = Array.from(new Set(...(["12", "13"]
				.map(numString => numString + jewishCalendar.getJewishDayOfMonth().toString().padStart(2, '0'))
				.map(key => (key in this.hiloulot_en ? this.hiloulot_en[key] : [])))))
			he = Array.from(new Set(...(["12", "13"]
				.map(numString => numString + jewishCalendar.getJewishDayOfMonth().toString().padStart(2, '0'))
				.map(key => (key in this.hiloulot_he ? this.hiloulot_he[key] : [])))))
		}

		return { en, he }
	}
}