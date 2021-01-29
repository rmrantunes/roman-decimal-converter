console.warn("Converter at experimental stage. Needs improvements.");

type ToDecimalConversionRule = [RegExp, number];

type ToRomanConversionRule = [number, string];

interface MatchedNumber {
  number: number;
  quantity: number;
}

abstract class SetConverter {
  protected romanNumeral: string;
  protected decimalNumber: number;

  /** Set a roman numeral and then chain `.toDecimal()`  */
  roman(romanNumeral: string) {
    this.romanNumeral = romanNumeral;
    return this;
  }

  /** Set a decimal number and then chain `.toRoman()` */
  decimal(decimalNumber: number) {
    this.decimalNumber = decimalNumber;
    return this;
  }
}

export class Converter extends SetConverter {
  /** Must be preceded by `.roman(romanNumeral: string)`
   *  @returns If valid, a number converted from a given roman numeral. If invalid, a string message error. */
  toDecimal() {
    const validateNumeralTyping = () => {
      const allowedNumerals = ["I", "V", "X", "L", "C", "D", "M"];
      const forbiddenNumerals = this.romanNumeral
        .split("")
        .filter((numeral) => !allowedNumerals.includes(numeral));
      return {
        goesWrong: Boolean(forbiddenNumerals.length),
        message: `Error: Following numerals are invalid: [${forbiddenNumerals}]`,
      };
    };

    const validateNumeralMax3Sequence = () => {
      const forbiddenSequence = this.romanNumeral.match(/(\w)\1{3,}/gi);
      return {
        goesWrong: Boolean(forbiddenSequence),
        message: `Error: The senquences [${forbiddenSequence}] are not allowed`,
      };
    };

    const typingValidation = validateNumeralTyping();
    const max3SequenceValidation = validateNumeralMax3Sequence();
    if (typingValidation.goesWrong) return typingValidation.message;
    if (max3SequenceValidation.goesWrong) return max3SequenceValidation.message;

    const conversionRules: ToDecimalConversionRule[] = [
      [/(?<!C)M/g, 1000],
      [/CM/g, 900],
      [/(?<!C)D/g, 500],
      [/CD/g, 400],
      [/(?<!X)C(?![DM])/g, 100],
      [/XC/g, 90],
      [/(?<![XV])L/g, 50],
      [/XL/g, 40],
      [/(?<!I)X(?![LC])/g, 10],
      [/IX/g, 9],
      [/(?<!I)V(?![L])/g, 5],
      [/IV/g, 4],
      [/I(?![XV])/g, 1],
    ];

    const matchedNumerals = conversionRules
      .map(([regex]) => this.romanNumeral.match(regex))
      .filter(Boolean) as string[][];

    const convertedNumber = matchedNumerals.reduce(
      (accumulated, matchedNumeral) => {
        const quantity = matchedNumeral.length;
        const [numeral] = matchedNumeral;
        const [_, number] = conversionRules.find(([regex]) =>
          regex.test(numeral)
        ) as ToDecimalConversionRule;

        return accumulated + number * quantity;
      },
      0
    );

    return convertedNumber;
  }

  /** Must be preceded by `.decimal(decimalNumber: number)`
   *  @returns If valid, a roman numeral converted from a given decimal number. If invalid, a string with message error. */
  toRoman() {
    const conversionRules: ToRomanConversionRule[] = [
      [1000, "M"],
      [900, "CM"],
      [500, "D"],
      [400, "CD"],
      [100, "C"],
      [90, "XC"],
      [50, "L"],
      [40, "XL"],
      [10, "X"],
      [9, "IX"],
      [5, "V"],
      [4, "IV"],
      [1, "I"],
    ];

    const matchedNumbers: MatchedNumber[] = [];

    conversionRules.reduce((returned, [number]) => {
      const quantity = Math.floor(returned / number);
      const remained = returned % number;

      if (quantity) matchedNumbers.push({ number, quantity });
      return remained;
    }, this.decimalNumber);

    const convertedNumeral = matchedNumbers.map(({ number, quantity }) => {
      const [_, numeral] = conversionRules.find(
        ([n]) => n === number
      ) as ToRomanConversionRule;
      return numeral.repeat(quantity);
    });

    return convertedNumeral.join("");
  }
}
