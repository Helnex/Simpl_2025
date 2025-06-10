//задание 1
let elem = document.querySelector("[data-widget-name]");
alert(elem.getAttribute("data-widget-name"));

//задание 2
let links = document.querySelectorAll("a");

for (let link of links) {
  let href = link.getAttribute("href");
  if (!href) continue; // нет атрибута

  if (!href.includes("://")) continue; // нет протокола

  if (href.startsWith("http://internal.com")) continue; // внутренняя

  link.style.color = "orange";
}
