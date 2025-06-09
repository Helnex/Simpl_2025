//задание 1
if ("0") {
  alert("Привет");
}
//вывод будет. непустая строка = true

//задание 2
let inputName = prompt("официальное название JavaScript:", "");
if (inputName == "ECMAScript") {
  alert("Верно");
} else {
  alert("Неверно");
}

//задание 3
let inputNumber = Number(prompt("enter number:", ""));
if (inputNumber > 0) {
  alert(1);
} else if (inputNumber < 0) {
  alert(-1);
} else {
  alert(0);
}

//задание 4
let result;

a + b < 4 ? (result = "Мало") : "Много";

//задание 5
let message;

login == "СОтрудник"
  ? (message = "Привет")
  : login == "Директор"
  ? (message = "Здравствуйте")
  : login == ""
  ? (message = "Нет логина")
  : (message = "");
