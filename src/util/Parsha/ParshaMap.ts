;

/**
 * List of <em>parshiyos</em> or special <em>Shabasos</em>. {@link #NONE} indicates a week without a <em>parsha</em>, while the enum for
 * the <em>parsha</em> of {@link #VZOS_HABERACHA} exists for consistency, but is not currently used. The special <em>Shabasos</em> of
 * Shekalim, Zachor, Para, Hachodesh, as well as Shabbos Shuva, Shira, Hagadol, Chazon and Nachamu are also represented in this collection
 * of <em>parshiyos</em>.
 * @see #getSpecialShabbos()
 * @see #getParshah()
 */
export enum Parsha {
  /** NONE - A week without any <em>parsha</em> such as <em>Shabbos Chol Hamoed</em> */
  NONE,
  BERESHIS, NOACH, LECH_LECHA, VAYERA, CHAYEI_SARA, TOLDOS, VAYETZEI,
  VAYISHLACH, VAYESHEV, MIKETZ, VAYIGASH, VAYECHI, SHEMOS, VAERA, BO,
  BESHALACH, YISRO, MISHPATIM, TERUMAH, TETZAVEH, KI_SISA, VAYAKHEL,
  PEKUDEI, VAYIKRA, TZAV, SHMINI, TAZRIA, METZORA, ACHREI_MOS, KEDOSHIM,
  EMOR, BEHAR, BECHUKOSAI, BAMIDBAR, NASSO, BEHAALOSCHA, SHLACH, KORACH,
  CHUKAS, BALAK, PINCHAS, MATOS, MASEI, DEVARIM, VAESCHANAN, EIKEV,
  REEH, SHOFTIM, KI_SEITZEI, KI_SAVO, NITZAVIM, VAYEILECH, HAAZINU,
  VZOS_HABERACHA,
  /** The double parsha of Vayakhel &amp; Peudei */
  VAYAKHEL_PEKUDEI,
  /** The double <em>parsha</em> of Tazria &amp; Metzora */
  TAZRIA_METZORA,
  /** The double <em>parsha</em> of Achrei Mos &amp; Kedoshim */
  ACHREI_MOS_KEDOSHIM,
  /** The double <em>parsha</em> of Behar &amp; Bechukosai */
  BEHAR_BECHUKOSAI,
  /** The double <em>parsha</em> of Qorah & Huqat */
  KORACH_CHUKAS,
  /** The double <em>parsha</em> of Chukas &amp; Balak */
  CHUKAS_BALAK,
  /** The double <em>parsha</em> of Matos &amp; Masei */
  MATOS_MASEI,
  /** The double <em>parsha</em> of Nitzavim &amp; Vayelech */
  NITZAVIM_VAYEILECH,
  /** The special <em>parsha</em> of Shekalim */
  SHKALIM,
  /** The special <em>parsha</em> of Zachor */
  ZACHOR,
  /** The special <em>parsha</em> of Para */
  PARA,
  /** The special <em>parsha</em> of Hachodesh */
  HACHODESH,
  SHUVA,
  SHIRA,
  HAGADOL,
  CHAZON,
  NACHAMU,
}

export abstract class ParshaMap {
    public static parshaMap = Parsha;

    public abstract parshalist: Parsha[][];
    public abstract getParsha(date: Temporal.PlainDate, israel: boolean): Parsha;
}