const backToTopButton = document.getElementById("back-to-top");

window.addEventListener("scroll", function () {
  if (window.pageYOffset > window.innerHeight) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
});

backToTopButton.addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
