//задание 1
let i = 3;

while (i) {
  alert(i--);
}
//Вывод 1

//задание 2
let i2 = 0;
while (++i2 < 5) alert(i); //Вывод от 1 до 4

let i3 = 0;
while (i3++ < 5) alert(i); // вывод от 1 до 5
//задание 3
for (let i = 0; i < 5; i++) alert(i); //вывод от 0 до 4
for (let i = 0; i < 5; ++i) alert(i); //вывод от 0 до 4
//задание 4: При помощи цикла for выведите чётные числа от 2 до 10.
for (let i = 2; i <= 10; i++) {
  if (i % 2 == 0) {
    alert(i);
  }
}
//задание 5
let i4 = 0;
while (i < 3) {
  alert(`number ${i}!`);
  i++;
}
//задание 6
let number = 0;
while (number < 100) {
  number = +prompt("enter number:", "");
}
//задание 7
let border = +prompt("enter number:", "");
for (let i = 2; i < border; i++) {
  flag = true;
  for (let j = 2; j < i; j++) {
    if (i % j == 0) {
      flag = false;
    }
  }
  if (flag) {
    alert(i);
  }
}
