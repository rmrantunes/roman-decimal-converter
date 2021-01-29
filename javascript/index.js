import { Converter } from "./converter.js";
var input = document.querySelector("#input");
var result = document.querySelector("#result");
var isNotANumber = function (string) { return isNaN(Number(string)); };
var sanitizeInput = function (string) {
    return string.replace(/[\\\.\+\*\?\^\$\[\]\(\)\{\}\/\'\#\:\!\=\-\|]/g, "");
};
var convert = new Converter();
input.addEventListener("keyup", function () {
    input.value = sanitizeInput(input.value);
    if (isNotANumber(input.value)) {
        var conversionResult = String(convert.roman(input.value).toDecimal());
        if (conversionResult.includes("Error")) {
            result.classList.add("text-red-500");
        }
        else {
            result.classList.remove("text-red-500");
        }
        result.innerText = conversionResult;
        return;
    }
    result.classList.remove("text-red-500");
    result.innerText = convert.decimal(Number(input.value)).toRoman();
});
