//задание 1
function checkAge(age) {
  return age > 18 ? true : confirm("Родители разрешили?");
}
//задание 2
function min(a, b) {
  return a > b ? a : b;
}
//задание 3
let x = +prompt("Enter x");
let n = +prompt("Enter n");
function pow(x, n) {
  return x ** n;
}
alert(pow(x, n));
