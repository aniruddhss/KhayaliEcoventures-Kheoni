// let isCursorEnabled = true;

window.addEventListener("load", function () {
  // Variables
  const loader = document.getElementById("loader");
  const image1 = document.getElementById("image-1");
  const image2 = document.getElementById("image-2");
  const image3 = document.getElementById("image-3");
  const image4 = document.getElementById("image-4");
  const navbar = document.getElementById("navbar");
  const heroContent = document.getElementById("hero-content");
  const ctaButton = document.getElementById("explore-button");
  const menuToggle = document.getElementById("menu-toggle");
  const navbarLinks = document.getElementById("navbar-links");

  // Custom cursor variables
  const cursor = document.getElementById("custom-cursor");
  const cursorInner = document.querySelector(".cursor-inner");
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let isAnimating = false;

  // Initialize the cursor position
  gsap.set(cursor, { x: mouseX, y: mouseY });

  // Mouse move event to track cursor position
  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Click event to trigger the cursor animation
  // Click event to trigger the cursor animation - simpler version
document.addEventListener("mousedown", function () {
  if (!isAnimating) {
    isAnimating = true;
    cursor.classList.add("cursor-clicked");

    setTimeout(() => {
      cursor.classList.remove("cursor-clicked");
      isAnimating = false;
    }, 800); // Match this with the animation duration
  }
});
  // Animation loop for smooth cursor following
  // Update the animation loop for smooth cursor following

  // Simplified animation cursor function
function animateCursor() {
  // Calculate the distance between current position and target
  const dx = mouseX - cursorX;
  const dy = mouseY - cursorY;
  
  // Normal mode - ease the cursor toward the mouse position
  cursorX += dx * 0.08;
  cursorY += dy * 0.08;

  // Update cursor position
  gsap.set(cursor, {
    left: cursorX,
    top: cursorY,
  });

  // Continue the animation loop
  requestAnimationFrame(animateCursor);
}
  animateCursor();
  const interactiveElements = document.querySelectorAll(
    "a, button, .cta-button, .menu-toggle"
  );

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
      cursorInner.style.backgroundColor = "#fff";
    });

    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      cursorInner.style.backgroundColor = "#fff";
    });
  });

  // Hide cursor when it leaves the window
  document.addEventListener("mouseout", (e) => {
    if (
      e.clientY <= 0 ||
      e.clientX <= 0 ||
      e.clientX >= window.innerWidth ||
      e.clientY >= window.innerHeight
    ) {
      cursor.style.opacity = "0";
    }
  });

  document.addEventListener("mouseover", () => {
    cursor.style.opacity = "1";
  });

  // Rest of your existing code starts here
  console.log("Script loaded and running");

  // Show hero content initially with a shorter animation
  gsap.fromTo(
    heroContent,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 2, delay: 2.2, ease: "power4.out" }
  );

  // Show hero content initially with a shorter animation
  gsap.fromTo(
    heroContent,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 2, delay: 2.2, ease: "power4.out" }
  );
  if (menuToggle && navbarLinks) {
    menuToggle.addEventListener("click", function () {
      navbarLinks.classList.toggle("active");

      // Change the toggle button text based on menu state
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
  // Direct event handler for the explore button
  if (ctaButton) {
    ctaButton.onclick = function (e) {
      console.log("CTA button clicked");
      alert("Button clicked! Add your destination action here.");
      e.stopPropagation();
      e.preventDefault();
      return false;
    };

    // Make extra sure it's clickable
    ctaButton.style.pointerEvents = "all";
    ctaButton.style.cursor = "pointer";
  }

  setTimeout(function () {
    console.log("Hiding loader");
    loader.style.opacity = "0";
    setTimeout(function () {
      loader.style.display = "none";
      console.log("Loader hidden completely");

      initScrollAnimations();
    }, 500);
  }, 2000);

  function initScrollAnimations() {
    const locoScroll = new LocomotiveScroll({
      el: document.querySelector("[data-scroll-container]"),
      smooth: true,
      multiplier: 1,
      smartphone: {
        smooth: true,
      },
      tablet: {
        smooth: true,
      },
    });

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.scrollerProxy("[data-scroll-container]", {
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
      pinType: document.querySelector("[data-scroll-container]").style.transform
        ? "transform"
        : "fixed",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#content",
        scroller: "[data-scroll-container]",
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });

    tl.to(image1, { x: "-100%", y: "-100%", ease: "power2.inOut" }, 0)
      .to(image2, { x: "100%", y: "-100%", ease: "power2.inOut" }, 0)
      .to(image3, { x: "-100%", y: "100%", ease: "power2.inOut" }, 0)
      .to(image4, { x: "100%", y: "100%", ease: "power2.inOut" }, 0);

    // Navbar animation - using earlier timing
    const navTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#content",
        scroller: "[data-scroll-container]",
        start: "top 50%",
        end: "top top",
        scrub: true,
      },
    });

    navTl.to(navbar, { opacity: 1, ease: "power1.inOut" }, 0);

    // Separate timeline for hero content - only start fading when the first content section enters
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".section:nth-child(2)", // Target the first content section after the hero
        scroller: "[data-scroll-container]",
        start: "top bottom", // Start when the section enters the viewport
        end: "top 90%", // Complete fade by the time section is 70% in view
        scrub: 1.5, // Smoother scrub for more gradual transition
      },
    });

    heroTl.to(heroContent, { opacity: 0, y: 30, ease: "power2.inOut" }, 0);

    gsap.utils.toArray(".section").forEach((section, i) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            scroller: "[data-scroll-container]",
            start: "top 80%",
            end: "top 50%",
            scrub: true,
          },
        }
      );
    });

    locoScroll.on("scroll", ScrollTrigger.update);
    ScrollTrigger.refresh();
    // Add this inside your initScrollAnimations function in main.js
    // Animation for About Us section
    const aboutTitle = document.querySelector(".about-title h2");
    const aboutParagraphs = document.querySelectorAll(".about-paragraph");

    if (aboutTitle) {
      // Animate the title
      gsap.fromTo(
        aboutTitle,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-section",
            scroller: "[data-scroll-container]",
            start: "top 70%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );
    }

    if (aboutParagraphs.length > 0) {
      // Animate paragraphs with stagger
      gsap.fromTo(
        aboutParagraphs,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".about-section",
            scroller: "[data-scroll-container]",
            start: "top 60%",
            end: "top 20%",
            scrub: 1,
          },
        }
      );
    }
    gsap.to(".about-section", {
      backgroundPosition: "0 -300px",
      ease: "none",
      scrollTrigger: {
        trigger: ".about-section",
        scroller: "[data-scroll-container]",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
    // Locations section animations
    const locationsSection = document.querySelector(".locations-section");
    const locationsHeader = document.querySelector(".locations-header");
    const locationCards = document.querySelectorAll(".location-card");

    if (locationsSection) {
      // Background parallax effect
      gsap.to(".locations-section", {
        backgroundPosition: "0 -100px",
        ease: "none",
        scrollTrigger: {
          trigger: ".locations-section",
          scroller: "[data-scroll-container]",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Header animation
      gsap.fromTo(
        locationsHeader,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".locations-section",
            scroller: "[data-scroll-container]",
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );

      // Cards staggered animation
      gsap.fromTo(
        locationCards,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".locations-section",
            scroller: "[data-scroll-container]",
            start: "top 70%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );

      // Hover effects with GSAP
      locationCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card.querySelector("h3"), {
            y: -5,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card.querySelector("h3"), {
            y: 0,
            duration: 0.3,
            ease: "power2.in",
          });
        });
      });
    }
  
  }
});
