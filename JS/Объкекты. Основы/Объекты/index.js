//задание 1
const user = {};
user.name = "Jhon";
user.surname = "Smith";
user.name = "Pete";
delete user.name;
//задание 2
function isEmpty(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}
//задание 3
let salaries = {
  John: 100,
  Ann: 160,
  Pete: 130,
};
let sum;
for (let key of salaries) {
  sum += salaries[key];
}
if (isEmpty(salaries)) {
  alert(0);
} else {
  alert(sum);
}
//задание 4
function multiplyNumeric(obj) {
  for (let key of menu) {
    if (typeof menu[key] == "number") {
      menu[key] *= 2;
    }
  }
}

let menu = {
  width: 200,
  height: 300,
  title: "My menu",
};

multiplyNumeric(menu);
