var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
console.warn("Converter at experimental stage. Needs improvements.");
var SetConverter = /** @class */ (function () {
    function SetConverter() {
    }
    /** Set a roman numeral and then chain `.toDecimal()`  */
    SetConverter.prototype.roman = function (romanNumeral) {
        this.romanNumeral = romanNumeral;
        return this;
    };
    /** Set a decimal number and then chain `.toRoman()` */
    SetConverter.prototype.decimal = function (decimalNumber) {
        this.decimalNumber = decimalNumber;
        return this;
    };
    return SetConverter;
}());
var Converter = /** @class */ (function (_super) {
    __extends(Converter, _super);
    function Converter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** Must be preceded by `.roman(romanNumeral: string)`
     *  @returns If valid, a number converted from a given roman numeral. If invalid, a string message error. */
    Converter.prototype.toDecimal = function () {
        var _this = this;
        var validateNumeralTyping = function () {
            var allowedNumerals = ["I", "V", "X", "L", "C", "D", "M"];
            var forbiddenNumerals = _this.romanNumeral
                .split("")
                .filter(function (numeral) { return !allowedNumerals.includes(numeral); });
            return {
                goesWrong: Boolean(forbiddenNumerals.length),
                message: "Error: Following numerals are invalid: [" + forbiddenNumerals + "]",
            };
        };
        var validateNumeralMax3Sequence = function () {
            var forbiddenSequence = _this.romanNumeral.match(/(\w)\1{3,}/gi);
            return {
                goesWrong: Boolean(forbiddenSequence),
                message: "Error: The senquences [" + forbiddenSequence + "] are not allowed",
            };
        };
        var typingValidation = validateNumeralTyping();
        var max3SequenceValidation = validateNumeralMax3Sequence();
        if (typingValidation.goesWrong)
            return typingValidation.message;
        if (max3SequenceValidation.goesWrong)
            return max3SequenceValidation.message;
        var conversionRules = [
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
        var matchedNumerals = conversionRules
            .map(function (_a) {
            var regex = _a[0];
            return _this.romanNumeral.match(regex);
        })
            .filter(Boolean);
        var convertedNumber = matchedNumerals.reduce(function (accumulated, matchedNumeral) {
            var quantity = matchedNumeral.length;
            var numeral = matchedNumeral[0];
            var _a = conversionRules.find(function (_a) {
                var regex = _a[0];
                return regex.test(numeral);
            }), _ = _a[0], number = _a[1];
            return accumulated + number * quantity;
        }, 0);
        return convertedNumber;
    };
    /** Must be preceded by `.decimal(decimalNumber: number)`
     *  @returns If valid, a roman numeral converted from a given decimal number. If invalid, a string with message error. */
    Converter.prototype.toRoman = function () {
        var conversionRules = [
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
        var matchedNumbers = [];
        conversionRules.reduce(function (returned, _a) {
            var number = _a[0];
            var quantity = Math.floor(returned / number);
            var remained = returned % number;
            if (quantity)
                matchedNumbers.push({ number: number, quantity: quantity });
            return remained;
        }, this.decimalNumber);
        var convertedNumeral = matchedNumbers.map(function (_a) {
            var number = _a.number, quantity = _a.quantity;
            var _b = conversionRules.find(function (_a) {
                var n = _a[0];
                return n === number;
            }), _ = _b[0], numeral = _b[1];
            return numeral.repeat(quantity);
        });
        return convertedNumeral.join("");
    };
    return Converter;
}(SetConverter));
export { Converter };
