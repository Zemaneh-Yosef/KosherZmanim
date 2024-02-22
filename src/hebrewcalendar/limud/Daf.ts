/**
 * An Object representing a <em>daf</em> (page) in the <a href="https://en.wikipedia.org/wiki/Daf_Yomi">Daf Yomi</a> cycle.
 *
 * @author &copy; Eliyahu Hershfeld 2011 - 2019
 */
export abstract class Daf {
  /**
   * {@link #getMasechtaNumber()} and {@link #setMasechtaNumber(int)}.
   */
  private masechtaNumber: number;

  /**
   * See {@link #getDaf()} and {@link #setDaf(int)}.
   */
  private daf: number;

  /**
   * Gets the <em>masechta</em> number of the currently set <em>Daf</em>.
   * @return the masechtaNumber
   * @see #setMasechtaNumber(int)
   */
  public getMasechtaNumber(): number {
    return this.masechtaNumber;
  }

  /**
   * Set the <em>masechta</em> number in the order of the Daf Yomi.
   *
   * @param masechtaNumber
   *            the <em>masechta</em> number in the order of the Daf Yomi to set.
   */
  public setMasechtaNumber(masechtaNumber: number): void {
    this.masechtaNumber = masechtaNumber;
  }

  /**
   * Constructor that creates a Daf setting the {@link #setMasechtaNumber(int) <em>masechta</em> number} and
	 * {@link #setDaf(int) <em>daf</em> number}.
	 * 
	 * @param masechtaNumber the <em>masechta</em> number in the order of the Daf Yomi to set as the current <em>masechta</em>.
	 * @param daf the <em>daf</em> (page) number to set.
   */
  constructor(masechtaNumber: number, daf: number) {
    this.masechtaNumber = masechtaNumber;
    this.daf = daf;
  }

  /**
   * Returns the <em>daf</em> (page) number of the Daf Yomi.
	 * @return the <em>daf</em> (page) number of the Daf Yomi.
   */
  public getDaf(): number {
    return this.daf;
  }

  /**
   * Sets the <em>daf</em> (page) number of the Daf Yomi.
	 * @param daf the <em>daf</em> (page) number.
   */
  public setDaf(daf: number): void {
    this.daf = daf;
  }

  /**
   * Returns the transliterated name of the <em>masechta</em> (tractate) of the Daf Yomi.
	 * 
	 * @return the transliterated name of the <em>masechta</em> (tractate) of the Daf Yomi such as Berachos.
   * @see #setMasechtaTransliterated(String[])
   */
  public abstract getMasechtaTransliterated(): string;

  /**
   * Returns the <em>masechta</em> (tractate) of the Daf Yomi in Hebrew.
   *
   * @return the <em>masechta</em> (tractate) of the Daf Yomi in Hebrew. As an example, it will return
	 *         &#x05D1;&#x05E8;&#x05DB;&#x05D5;&#x05EA; for Berachos.
   */
  public abstract getMasechta(): string;
}
