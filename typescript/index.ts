import { Converter } from "./converter";

const input = document.querySelector("#input") as HTMLInputElement;
const result = document.querySelector("#result") as HTMLOutputElement;

const isNotANumber = (string: string) => isNaN(Number(string));
const sanitizeInput = (string: string) => {
  return string.replace(/[\\\.\+\*\?\^\$\[\]\(\)\{\}\/\'\#\:\!\=\-\|]/g, "");
};

const convert = new Converter();

input.addEventListener("keyup", () => {
  input.value = sanitizeInput(input.value);

  if (isNotANumber(input.value)) {
    const conversionResult = String(convert.roman(input.value).toDecimal());
    if (conversionResult.includes("Error")) {
      result.classList.add("text-red-500");
    } else {
      result.classList.remove("text-red-500");
    }
    result.innerText = conversionResult;
    return;
  }

  result.classList.remove("text-red-500");
  result.innerText = convert.decimal(Number(input.value)).toRoman();
});
