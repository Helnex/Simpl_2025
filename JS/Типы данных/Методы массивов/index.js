//задание 1
/*function camelize(str) {
  let slicedStr = str.split("-");

  slicedStr.forEach((item, index) => {
    if (item == "") {
      slicedStr.splice(index, 1);
    }
    if (index != 0) {
      slicedStr[index] = item[0].toUpperCase() + item.slice(1);
    }
  });
  return slicedStr.join().replace(/,/g, "");
}
alert(camelize("-webkit-transition"));
alert(camelize("background-color"));
alert(camelize("list-style-image"));
//задание 2
function filterRange(arr, x, y) {
  let result = [];
  arr.forEach((item, index) => {
    if (item >= x && item <= y) {
      result.push(item);
    }
  });
  return result;
}*/
//задание 3
function filterRangeInPlace(arr, a, b) {
  arr.forEach((item, index) => {
    if (!(item >= a && item <= b)) {
      arr.splice(index, 1);
    }
  });
}
let arr = [5, 3, 8, 1];

filterRangeInPlace(arr, 1, 4); // удалены числа вне диапазона 1..4
alert(arr); // [3, 1]
//задание 4
let arr2 = [5, 2, 1, -10, 8];

arr.sort((a, b) => b - a);

alert(arr2);
//задание 5
function copySorted(arr) {
  return arr.slice().sort();
}
let arr3 = ["HTML", "JavaScript", "CSS"];

let sorted = copySorted(arr);

alert(sorted); // CSS, HTML, JavaScript
alert(arr3); // HTML, JavaScript, CSS (без изменений)
//задание 6
function Calculator() {
  this.methods = {
    "-": (a, b) => a - b,
    "+": (a, b) => a + b,
  };

  this.calculate = function (str) {
    let split = str.split(" "),
      a = +split[0],
      op = split[1],
      b = +split[2];

    if (!this.methods[op] || isNaN(a) || isNaN(b)) {
      return NaN;
    }

    return this.methods[op](a, b);
  };

  this.addMethod = function (name, func) {
    this.methods[name] = func;
  };
}
