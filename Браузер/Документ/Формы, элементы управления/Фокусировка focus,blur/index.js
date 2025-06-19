const select = document.getElementById("genres");

const selectedOption = select.options[select.selectedIndex];

const newOption = new Option("Классика", "classic");
select.add(newOption);

select.value = "classic";
