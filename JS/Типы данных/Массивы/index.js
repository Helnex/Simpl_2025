//задание 1
let fruits = ["Яблоки", "Груша", "Апельсин"];

// добавляем новое значение в "копию"
let shoppingCart = fruits;
shoppingCart.push("Банан");

// что в fruits?
alert(fruits.length); // 4
//задание 2
let styles = ["Джаз", "Блюз"];
styles.push("ROK");
styles[Math.floor((styles.length - 1) / 2)] = "Классика";
alert(styles.shift());
styles.unshift("Рэп", "Регги");
//задание 3
let arr = ["a", "b"];

arr.push(function () {
  alert(this);
});

arr[2](); // a,b,function(){...}
//задание 4
function sumInput() {
  let arr = [];
  while (true) {
    let value = prompt("Enter number", 0);
    if (value === "" || value === null || typeof value != "number") break;

    arr.push(+value);
  }
  let sum = 0;
  for (let number of arr) {
    sum += number;
  }
  return sum;
}
alert(sumInput());
//задание 5
function getMaxSubSum(arr) {
  let maxCurrent = arr[0];

  let maxGlobal = arr[0];

  for (let i = 1; i < arr.length; i++) {
    maxCurrent = Math.max(arr[i], maxCurrent + arr[i]);

    if (maxCurrent > maxGlobal) {
      maxGlobal = maxCurrent;
    }
  }

  return maxGlobal;
}
alert(getMaxSubSum([-1, 2, 3, -9])); // 5
alert(getMaxSubSum([-1, 2, 3, -9, 11])); // 11
alert(getMaxSubSum([-2, -1, 1, 2])); // 3
alert(getMaxSubSum([100, -9, 2, -3, 5])); // 100
alert(getMaxSubSum([1, 2, 3])); // 6
alert(getMaxSubSum([-1, -2, -3])); // 0
