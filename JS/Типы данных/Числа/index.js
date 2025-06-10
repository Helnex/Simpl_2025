//задание 1
let a = +prompt("Enter first number", "");
let b = +prompt("Enter second number", "");

alert(a + b);
//задание 2
function readNumber() {
  let num;
  let flag = false;

  do {
    num = +prompt("Enter number", 0);
  } while (typeof num != "number");

  if (num === null || num === "") return null;

  return num;
}

alert(`Result: ${readNumber()}`);
//задание 3
function random(min, max) {
  return Math.random() * (max - min) + min;
}
alert(random(1, 5)); // 1.2345623452
alert(random(1, 5)); // 3.7894332423
alert(random(1, 5)); // 4.3435234525
//задание 4
function randomInteger(min, max) {
  let randomNumber = min + Math.random() * (max - min);
  return Math.round(randomNumber);
}
alert(randomInteger(1, 3));
