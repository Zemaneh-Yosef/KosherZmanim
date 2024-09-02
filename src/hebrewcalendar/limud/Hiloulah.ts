import { JewishDate } from "../JewishDate.ts";
type hiloulahObj = { name: string; src: string; }[]

export class HiloulahYomiCalculator {
	folderWithHiloulotJSON = (new URL(import.meta.url)).pathname.substring(0, (new URL(import.meta.url)).pathname.lastIndexOf('/'));
	initFlag = false;
	hiloulot_en: Record<string, hiloulahObj> = {};
	hiloulot_he: Record<string, hiloulahObj> = {};
	constructor (dir = (new URL(import.meta.url)).pathname.substring(0, (new URL(import.meta.url)).pathname.lastIndexOf('/'))) {
		this.folderWithHiloulotJSON = dir;
		this.init()
			.then(() => this.initFlag = true)
	}

	public async init() {
		this.hiloulot_en = (await (await fetch(this.folderWithHiloulotJSON + '/hiloulah-en.json')).json()) as Record<string, hiloulahObj>;
		this.hiloulot_he = (await (await fetch(this.folderWithHiloulotJSON + '/hiloulah-he.json')).json()) as Record<string, hiloulahObj>;
	}

	public async getHiloulah(jewishCalendar: JewishDate) {
		if (!this.initFlag) {
			await this.init();
			this.initFlag = true;
		}
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