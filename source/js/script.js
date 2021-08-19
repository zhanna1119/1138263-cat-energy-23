var mainNav = document.querySelector(".main-nav");
var navToggle = document.querySelector(".main-nav__toggle");

if (navToggle) {
  navToggle.addEventListener("click", function () {
    mainNav.classList.toggle("main-nav--opened");
    mainNav.classList.toggle("main-nav--closed");
  })
};
