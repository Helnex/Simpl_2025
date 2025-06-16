//задание 1
let elem = document.getElementById("elem");
function clear(elem) {
  elem.innerHTML = "";
}
clear(elem);

let input;
elem.insertAdjacentHTML("afterend", "<ul id='test'></ul>");
let test = document.getElementById("test");
while (input !== null) {
  input = prompt("Enter text:");
  test.insertAdjacentHTML("beforeend", `<li>${input}</li>`);
}
