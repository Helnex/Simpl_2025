//задание 1
function ucFirst(str) {
  return str[0].toUpperCase() + str.slice(1);
}
alert(ucFirst("вася"));
//задание 2
function checkSpam(str) {
  if (
    str.toLowerCase().includes("viagra") ||
    str.toLowerCase().includes("XXX")
  ) {
    return true;
  } else {
    false;
  }
}
//задание 3
function truncate(str, maxlength) {
  if (str.length > maxlength) {
    return str.slice(str.length - maxlength) + "...";
  }
}
//задание 4
function extractCurrencyValue(str) {
  if (str[0] == "$") {
    return +str.slice(1);
  }
}
