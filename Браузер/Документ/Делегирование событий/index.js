const messagesContainer = document.querySelector(".messages");

messagesContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const message = event.target.closest(".message");
    message.remove();
  }
});
//задание 2
const contents = document.getElementById("contents");

contents.addEventListener("click", function (event) {
  const link = event.target.closest("a");

  if (link) {
    event.preventDefault();

    const isLeaving = confirm("Вы действительно хотите покинуть страницу?");

    if (isLeaving) {
      window.location.href = link.href;
    }
  }
});
