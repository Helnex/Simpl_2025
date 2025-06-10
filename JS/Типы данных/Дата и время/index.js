let user = {
  name: "John",
  years: 30,
};
let { name, years: age, isAdmin = false } = user;
//задание 2
function topSalary(salaries) {
  if (salaries.keys() != 0) {
    let max = 0;
    let maxName = null;

    for (const [name, salary] of Object.entries(salaries)) {
      if (max < salary) {
        max = salary;
        maxName = name;
      }
    }

    return maxName;
  } else {
    return null;
  }
}
let salaries = {
  John: 100,
  Pete: 300,
  Mary: 250,
};
