//задание 1
document.body.firstElementChild;
document.body.lastElementChild;
document.body.lastElementChild.lastElementChild;
//задание 2
let table = document.body.firstElementChild;
for (let r of table.rows) {
  r.cells[r.rowIndex].style.backgroundColor = "red";
}
