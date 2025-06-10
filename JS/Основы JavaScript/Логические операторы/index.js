//задание 1
alert(null || 2 || undefined); // 2
//задание 2
alert(alert(1) || 2 || alert(3)); //1, потом 2
//задание 3
alert(1 && null && 2); // null
//задание 4
alert(alert(1) && alert(2)); // 1, потом undefined
//задание 5
alert(null || (2 && 3) || 4); // 3
//задание 6
let value = NaN;

value &&= 10;
value ||= 20;
value &&= 30;
value ||= 40;

alert(value); // 30
//задание 7
let inputNumber = prompt("Enter number", "");
if (inputNumber >= 14 && inputNumber <= 90) {
  alert(true);
}

//задание 8
let inputNumber2 = prompt("Enter number", "");
if (!(inputNumber >= 14 && inputNumber <= 90)) {
  alert(true);
}
if (inputNumber > 14 || inputNumber > 90) {
  alert(true);
}
//задание 9
if (-1 || 0) alert("first"); //выполнится. -1
if (-1 && 0) alert("second"); //не выполнится
if (null || (-1 && 1)) alert("third"); //выполнится. 1
//задание 10
let login = prompt("Enter login", "");
if (login == "Admin") {
  let pass = prompt("Enter password:", "");
  if (pass == "Я главный") {
    alert("Здравствуйте");
  } else if (pass == "" || pass === null) {
    alert("отменено");
  } else {
    alert("Неверный пароль");
  }
} else if (login == "" || login === null) {
  alert("Отменено");
} else {
  alert("Я вас не знаю");
}
