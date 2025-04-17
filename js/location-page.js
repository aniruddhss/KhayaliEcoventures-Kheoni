window.addEventListener("load", function () {
  // Variables
  const loader = document.getElementById("loader");
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menu-toggle");
  const navbarLinks = document.getElementById("navbar-links");

  if (navbar) {
    navbar.style.opacity = "1";
  }

  // Select the correct scrolling container (body element has data-scroll-container attribute)
  const scrollContainer =
    document.querySelector("[data-scroll-container]") ||
    document.querySelector("body");

  const locoScroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true,
    multiplier: 1,
    smartphone: {
      smooth: true,
    },
    tablet: {
      smooth: true,
    },
  });

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Use the same selector for ScrollTrigger proxy
  const scrollSelector =
    scrollContainer.tagName.toLowerCase() +
    (scrollContainer.hasAttribute("data-scroll-container")
      ? "[data-scroll-container]"
      : "");

  // Set up ScrollTrigger with Locomotive Scroll
  ScrollTrigger.scrollerProxy(scrollSelector, {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: scrollContainer.style.transform ? "transform" : "fixed",
  });

  // Update ScrollTrigger on scroll
  locoScroll.on("scroll", ScrollTrigger.update);

  // Add smooth scroll for booking button
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: "smooth",
        });
      }
    });
  });

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
