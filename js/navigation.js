document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navbarLinks = document.getElementById("navbar-links");

  if (menuToggle && navbarLinks) {
    menuToggle.addEventListener("click", function () {
      navbarLinks.classList.toggle("active");
      menuToggle.textContent = navbarLinks.classList.contains("active")
        ? "✕"
        : "☰";
    });
  }

  // Handle navigation links
  const navLinks = document.querySelectorAll(".navbar-links a");


  // Store the target section when navigating from other pages to index.html
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const href = this.getAttribute("href");

      // If link points to a section on the index page
      if (href && href.includes("index.html#")) {
        const targetSection = href.split("#")[1];
        sessionStorage.setItem("scrollTarget", targetSection);
      }
      if (href && href.startsWith("#") && href !== "#") {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: "smooth",
          });
        }
      }

      // Close mobile menu if open
      if (navbarLinks && navbarLinks.classList.contains("active")) {
        navbarLinks.classList.remove("active");
        menuToggle.textContent = "☰";
      }
    });
  });

});
