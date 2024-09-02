import { Parsha, JewishCalendar } from "../JewishCalendar";
import { Temporal } from "temporal-polyfill";

/**
 * This class's main goal is to return the Weekly Haftorah reading said after the Weekly Parasha
 * reading. Which readings to say were taken from the Chumash "L'maan Shemo B'Ahavah" according to
 * the Sepharadic Minhag.
 * @see WeeklyParashaReadings
 */
export default class WeeklyHaftarahReading {

	/**
	 * This method returns a string that contains the weekly Haftorah. The {@link JewishCalendar}
	 * object passed into this method should be set to Saturday because the {@link JewishCalendar#getParshah()}
	 * method returns {@link com.kosherjava.zmanim.hebrewcalendar.JewishCalendar.Parsha#NONE} during
	 * the week.
	 * @param jCal the JewishCalendar object set to Saturday
	 * @return The haftorah for this week as a string
	 */
	public static getThisWeeksHaftarah(jCal: JewishCalendar): { text: string; source: string; } {
		const specialShabbatot = {
			[Parsha.SHKALIM]: {
				text: "ויכרת יהוידע",
				source: 'מלכים ב י"א'
			},
			[Parsha.ZACHOR]: {
				text: "ויאמר שמואל",
				source: 'שמואל א ט"ו'
			},
			[Parsha.PARA]: {
				text: "ויהי דבר",
				source: 'יחזקאל ל"ו'
			},
			[Parsha.HACHODESH]: {
				text: "כה אמר",
				source: 'יחזקאל מ"ה'
			},
			[Parsha.HAGADOL]: {
				text: "וערבה",
				source: 'מלאכי ג'
			}
		}

		if (jCal.getSpecialShabbos() in specialShabbatot)
			// @ts-ignore
			return specialShabbatot[jCal.getSpecialShabbos()]

		// Rosh Hodesh & Erev Rosh Hodesh has its own Haftarot. Use that except if it's Matot Maseh, Re'eh or just Hanukah
		// Then default to weekly parasha.

		// The initial code wanted to make it more flexible and have each Parasha in its own ability to override ERH & RH,
		// but we refactored away from that since we know that only 2 Parashiot & 1 Event have the exception
		// Also, it combined Noah & Ki These, but we don't have that luxury because we're saving space on everything else.
		// (ironic it didn't combine Pekudeh & Wayaqhel-Pekudeh, among others)

		if (jCal.isChanukah())
			return ([7, 8].includes(jCal.getDayOfChanukah())
				? {
					text: "ויעש חירום",
					source: 'מלכים א ז'
				} : {
					text: "רני ושמחי",
					source: 'זכריה ב'
				})

		if (![Parsha.MATOS_MASEI, Parsha.REEH].includes(jCal.getParshah())) {
			if (jCal.isErevRoshChodesh()) {
				return {
					text: "מחר חודש",
					source: 'שמואל א כ'
				};
			} else if (jCal.isRoshChodesh()) {
				return {
					text: "כה אמר",
					source: 'ישעיה ס"ו'
				};
			}
		}

		const tammuz17 = jCal.clone()
		tammuz17.setJewishDate(tammuz17.getJewishYear(), JewishCalendar.TAMMUZ, 17)

		// @ts-ignore
		return {
			[Parsha.BERESHIS]: {
				text: "כה אמר",
				source: 'ישעיה מ"ב'
			},
			[Parsha.NOACH]: {
				text: "רני עקרה",
				source: 'ישעיה נ"ד'
			},
			[Parsha.LECH_LECHA]: {
				text: "למה תאמר",
				source: 'ישעיה מ'
			},
			[Parsha.VAYERA]: {
				text: "ואשה אחת",
				source: 'מלכים ב ד'
			},
			[Parsha.CHAYEI_SARA]: {
				text: "והמלך דוד",
				source: 'מלכים א א'
			},
			[Parsha.TOLDOS]: {
				text: "משא דבר",
				source: 'מלאכי א'
			},
			[Parsha.VAYETZEI]: {
				text: "ועמי תלואים",
				source: 'הושע י"א'
			},
			[Parsha.VAYISHLACH]: {
				text: "חזון עובדיה",
				source: 'עובדיה'
			},
			[Parsha.VAYESHEV]: {
				text: "כה אמר",
				source: 'עמוס ב'
			},
			[Parsha.MIKETZ]: {
				text: "ויקץ שלמה",
				source: 'מלכים א ג'
			},
			[Parsha.VAYIGASH]: {
				text: "ויהי דבר",
				source: 'יחזקאל ל"ז'
			},
			[Parsha.VAYECHI]: {
				text: "ויקרבו",
				source: 'מלכים א ב'
			},
			[Parsha.SHEMOS]: {
				text: "דברי ירמיה",
				source: 'ירמיה א'
			},
			[Parsha.VAERA]: {
				text: "כה אמר",
				source: 'יחזקאל כ"ח'
			},
			[Parsha.BO]: {
				text: "הדבר אשר",
				source: 'ירמיה מ"ו'
			},
			[Parsha.BESHALACH]: {
				text: "ותשר דבורה",
				source: 'שופטים ד'
			},
			[Parsha.YISRO]: {
				text: "בשנת מות",
				source: "ישעיה ו"
			},
			[Parsha.MISHPATIM]: {
				text: "הדבר אשר",
				source: 'ירמיה ל"ד'
			},
			[Parsha.TERUMAH]: {
				text: "ויהוה נתן",
				source: "מלכים א ה"
			},
			[Parsha.TETZAVEH]: {
				text: "אתה בן אדם",
				source: 'יחזקאל מ"ג'
			},
			[Parsha.KI_SISA]: {
				text: 'וישלח אחאב',
				source: 'מלכים א י"ח'
			},
			[Parsha.VAYAKHEL]: {
				text: "וישלח המלך",
				source: 'מלכים א ז'
			},
			[Parsha.PEKUDEI]: {
				text: "ויעש חירום",
				source: 'מלכים א ז'
			},
			[Parsha.VAYAKHEL_PEKUDEI]: {
				text: "ויעש חירום",
				source: 'מלכים א ז'
			},
			[Parsha.VAYIKRA]: {
				text: "עם זו",
				source: 'ישעיה מ"ג'
			},
			[Parsha.TZAV]: {text: "כה אמרס", source: "ירמיה ז"},
			[Parsha.SHMINI]: {text: "ויסף עוד", source: "שמואל ב ו"},
			[Parsha.TAZRIA]: {text: "ואיש בא", source: "מלכים ב ד"},
			[Parsha.METZORA]: {
				text: "וארבעה אנשים",
				source: 'מלכים ב ז'
			},
			[Parsha.TAZRIA_METZORA]: {
				text: "וארבעה אנשים",
				source: 'מלכים ב ז'
			},
			[Parsha.ACHREI_MOS]: {
				text: "ויהי דבר",
				source: 'יחזקאל כ"ב'
			},
			[Parsha.KEDOSHIM]: {
				text: "ויהי דבר",
				source: 'יחזקאל כ'
			},
			[Parsha.ACHREI_MOS_KEDOSHIM]: {
				text: "ויהי דבר",
				source: 'יחזקאל כ'
			},
			[Parsha.EMOR]: {
				text: "והכהנים",
				source: 'יחזקאל מ"ד'
			},
			[Parsha.BEHAR]: {
				text: "ויאמר ירמיהו",
				source: 'ירמיה ל"ב'
			},
			[Parsha.BECHUKOSAI]: {
				text: "יהיה עזי",
				source: 'ירמיה ט"ז'
			},
			[Parsha.BEHAR_BECHUKOSAI]: {
				text: "יהיה עזי",
				source: 'ירמיה ט"ז'
			},
			[Parsha.BAMIDBAR]: {
				text: "והיה מספר",
				source: 'הושע ב'
			},
			[Parsha.NASSO]: {
				text: "ויהי איש",
				source: 'שופטים י"ג'
			},
			[Parsha.BEHAALOSCHA]: {
				text: "רני ושמחי",
				source: 'זכריה ב'
			},
			[Parsha.SHLACH]: {
				text: "וישלח",
				source: 'יהושע ב'
			},
			[Parsha.KORACH]: {
				text: "ויאמר",
				source: 'שמואל א י"א'
			},
			[Parsha.CHUKAS]: {
				text: "ויפתח",
				source: 'שופטים י"א'
			},
			[Parsha.BALAK]: {
				text: "והיה",
				source: "מיכה ה"
			},
			[Parsha.CHUKAS_BALAK]: {
				text: "והיה",
				source: "מיכה ה"
			},
			[Parsha.PINCHAS]:
				(Temporal.PlainDate.compare(jCal.getDate(), tammuz17.getDate()) == -1
					? {
						text: "ויד יהוה",
						source: 'מלכים י"ח'
					} : {
						text: "דברי ירמיהו",
						source: "ירמיהו א"
					}),
			[Parsha.MATOS]: {
				text: "דברי ירמיהו",
				source: "ירמיהו א"
			},
			[Parsha.MASEI]: {
				text: "שמעו דבר",
				source: "ירמיהו ב"
			},
			[Parsha.MATOS_MASEI]: {
				text: "שמעו דבר",
				source: "ירמיהו ב"
			},
			[Parsha.DEVARIM]: {
				text: "חזון",
				source: 'ישעיה א'
			},
			[Parsha.VAESCHANAN]: {
				text: "נחמו",
				source: 'ישעיה מ'
			},
			[Parsha.EIKEV]: {
				text: "ותאמר ציון",
				source: 'ישעיה מ"ט'
			},
			[Parsha.REEH]: {
				text: "עניה סערה",
				source: 'ישעיה נ"ד'
			},
			[Parsha.SHOFTIM]: {
				text: "אנכי אנכי",
				source: 'ישעיה נ"א'
			},
			[Parsha.KI_SEITZEI]: {
				text: "רני עקרה",
				source: 'ישעיה נ"ד'
			},
			[Parsha.KI_SAVO]: {
				text: "קומי אורי",
				source: 'ישעיה ס'
			},
			[Parsha.NITZAVIM]: {
				text: "שוש אשיש",
				source: 'ישעיה ס"א'
			},
			[Parsha.VAYEILECH]: {
				text: "שובה",
				source: 'הושע י"ד'
			},
			[Parsha.NITZAVIM_VAYEILECH]: {
				text: "שוש אשיש",
				source: 'ישעיה ס"א'
			},
			[Parsha.HAAZINU]:
				(jCal.getJewishMonth() == JewishCalendar.TISHREI && jCal.getJewishDayOfMonth() >= 10
					? (jCal.getJewishDayOfMonth() == 10
						? { text: "סלו סלו", source: 'ישעיה נ"ז' }
						: { text: "וידבר דוד", source: 'שמואל ב כ"ב' })
					: { text: "שובה", source: 'הושע י"ד' }),
			[Parsha.VZOS_HABERACHA]: { text: "ויהי אחרי", source: 'יהושע א' },
		}[jCal.getParshah()]
	}
}
