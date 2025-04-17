window.addEventListener("load", function () {
    // Variables
    const loader = document.getElementById("loader");
    const navbar = document.getElementById("navbar");
    const menuToggle = document.getElementById("menu-toggle");
    const navbarLinks = document.getElementById("navbar-links");
    // Add cool carousel effects
const carouselSlides = document.querySelectorAll('.carousel-slide');
if (carouselSlides.length) {
  carouselSlides.forEach((slide, index) => {
    // Add subtle movement to slides based on mouse position
    slide.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = slide.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      gsap.to(slide, {
        rotateY: x * 5,
        rotateX: -y * 5,
        ease: 'power1.out',
        duration: 0.5,
        transformPerspective: 1000
      });
    });
    
    // Reset on mouse leave
    slide.addEventListener('mouseleave', () => {
      gsap.to(slide, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power1.out'
      });
    });
  });
}

// Add smooth scroll for booking button
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: 'smooth'
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
  
    // Carousel functionality
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselPrev = document.querySelector('.carousel-prev');
    const carouselNext = document.querySelector('.carousel-next');
    const carouselIndicators = document.querySelector('.carousel-indicators');
    
    if (carouselTrack) {
      // Will be set dynamically based on loaded images
      let slideCount = 0;
      let currentSlide = 0;
      
      // Function to update carousel position
      function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update indicators
        document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
          if (index === currentSlide) {
            indicator.classList.add('active');
          } else {
            indicator.classList.remove('active');
          }
        });
      }
      
      // Navigate to next slide
      carouselNext.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slideCount;
        updateCarousel();
      });
      
      // Navigate to previous slide
      carouselPrev.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateCarousel();
      });
      
      // Create indicators and add click events
      function createIndicators() {
        carouselIndicators.innerHTML = '';
        for (let i = 0; i < slideCount; i++) {
          const indicator = document.createElement('div');
          indicator.classList.add('carousel-indicator');
          if (i === 0) indicator.classList.add('active');
          indicator.addEventListener('click', () => {
            currentSlide = i;
            updateCarousel();
          });
          carouselIndicators.appendChild(indicator);
        }
      }
      
      // Auto-advance carousel every 5 seconds
      let carouselInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slideCount;
        updateCarousel();
      }, 5000);
      
      // Pause auto-advance when interacting with carousel
      document.querySelector('.carousel-container').addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
      });
      
      document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
        carouselInterval = setInterval(() => {
          currentSlide = (currentSlide + 1) % slideCount;
          updateCarousel();
        }, 5000);
      });
    }
    
    // Itinerary dropdown functionality
    const itineraryItems = document.querySelectorAll('.itinerary-item');
    
    itineraryItems.forEach(item => {
      const header = item.querySelector('.itinerary-header');
      header.addEventListener('click', () => {
        item.classList.toggle('active');
      });
    });
  
    // Form submission
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your inquiry! We will contact you soon.');
        bookingForm.reset();
      });
    }
  
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