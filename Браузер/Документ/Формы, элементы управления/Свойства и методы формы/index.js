const editArea = document.getElementById("editArea");

editArea.addEventListener("click", function () {
  const textarea = document.createElement("textarea");
  textarea.className = "editable";
  textarea.value = this.innerHTML;

  this.replaceWith(textarea);
  textarea.focus();

  function saveAndRevert() {
    const newDiv = document.createElement("div");
    newDiv.className = "editable";
    newDiv.innerHTML = textarea.value;

    textarea.replaceWith(newDiv);

    newDiv.addEventListener("click", arguments.callee);
  }

  textarea.addEventListener("blur", saveAndRevert);

  textarea.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveAndRevert();
    }
  });
});
