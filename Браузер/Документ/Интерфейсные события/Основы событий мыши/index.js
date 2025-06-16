document.addEventListener("DOMContentLoaded", function () {
  const list = document.getElementById("list");

  list.addEventListener("click", function (event) {
    const item = event.target;

    const multiSelect = event.ctrlKey || event.metaKey;

    if (multiSelect) {
      item.classList.toggle("selected");
    } else {
      const allItems = list.querySelectorAll("li");
      allItems.forEach((li) => li.classList.remove("selected"));

      item.classList.add("selected");
    }
  });
});
