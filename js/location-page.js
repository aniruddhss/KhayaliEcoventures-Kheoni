window.addEventListener("load", function () {
  // Variables
  const loader = document.getElementById("loader");
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menu-toggle");
  const navbarLinks = document.getElementById("navbar-links");

  if (navbar) {
    navbar.style.opacity = "1";
  }

  // Mobile menu toggle
  if (menuToggle && navbarLinks) {
    menuToggle.addEventListener("click", function () {
      navbarLinks.classList.toggle("active");
      menuToggle.textContent = navbarLinks.classList.contains("active")
        ? "✕"
        : "☰";
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll(".navbar-links a");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navbarLinks.classList.remove("active");
        menuToggle.textContent = "☰";
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!navbarLinks.contains(e.target) && e.target !== menuToggle) {
        navbarLinks.classList.remove("active");
        menuToggle.textContent = "☰";
      }
    });
  }

  // Itinerary dropdown functionality
  const itineraryItems = document.querySelectorAll(".itinerary-item");

  itineraryItems.forEach((item) => {
    const header = item.querySelector(".itinerary-header");
    header.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });

  // Form submission
  const bookingForm = document.querySelector(".booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you for your inquiry! We will contact you soon.");
      bookingForm.reset();
    });
  }

  ScrollTrigger.refresh();

  // Hide loader after page is loaded
  setTimeout(function () {
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(function () {
        loader.style.display = "none";
      }, 500);
    }

    // Show navbar
    if (navbar) {
      navbar.style.opacity = "1";
    }
  }, 1000);
});
