
document.addEventListener("DOMContentLoaded", function() {
  // Get loader and progress elements
  const loader = document.getElementById("loader");
  const progressBar = document.getElementById("loading-progress");
  
  // Track progress state to prevent double animations
  let progressState = 0; // 0: not started, 1: at 50%, 2: completed
  
  // Get major page sections
  const navbar = document.getElementById("navbar");
  const heroContent = document.getElementById("hero-content");
  const videoContainer = document.getElementById("video-container");
  if (navbar) {
    navbar.style.opacity = "1";
    navbar.style.visibility = "visible";
  }
  
  // Keep track of whether video has actually started playing
  let videoIsPlaying = false;
  
  // Create a better detection for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Initialize video more intelligently - keep the placeholder until video loads
  if (videoContainer) {
    // Store original placeholder content
    const placeholderContent = videoContainer.innerHTML;
    
    // Create video element but don't replace placeholder yet
    const videoElement = document.createElement('video');
    videoElement.id = 'background-video';
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.playsInline = true;
    videoElement.style.opacity = "0"; // Hide initially
    videoElement.style.position = "absolute";
    videoElement.style.top = "0";
    videoElement.style.left = "0";
    videoElement.style.width = "100%";
    videoElement.style.height = "100%";
    videoElement.style.objectFit = "cover";
    
    const sourceElement = document.createElement('source');
    sourceElement.src = "tigersafarilodge (1).mp4";
    sourceElement.type = "video/mp4";
    
    videoElement.appendChild(sourceElement);
    
    // Pre-load the video in the background without replacing placeholder
    if (!isMobile) {
      // For desktop - append video behind poster image
      videoContainer.appendChild(videoElement);
    }
    
    // Attempt to play and set up event listeners
    const attemptVideoPlay = function() {
      // Check if video element exists in the DOM
      const existingVideo = document.getElementById('background-video');
      const video = existingVideo || videoElement;
      
      // If on mobile and video doesn't exist in DOM yet, add it now
      if (isMobile && !existingVideo && videoContainer) {
        videoContainer.appendChild(video);
      }
      
      // Try to play the video with error handling
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Video started playing successfully
          videoIsPlaying = true;
          
          // Update progress bar if not already done
          if (progressBar && progressState === 0) {
            progressState = 1;
            progressBar.style.width = "50%";
          }
          
          // Fade in video and remove placeholder with crossfade
          setTimeout(() => {
            video.style.transition = "opacity 1s ease";
            video.style.opacity = "1";
            
            // If there are any images inside videoContainer, fade them out
            const placeholderImages = videoContainer.querySelectorAll('img');
            placeholderImages.forEach(img => {
              img.style.transition = "opacity 1s ease";
              img.style.opacity = "0";
            });
            
            // Begin loading the rest of the page content
            loadRemainingContent();
          }, 100);
        }).catch(error => {
          // Video failed to play automatically
          console.warn("Video autoplay failed:", error);
          
          // Keep placeholder visible
          // Update progress bar anyway and continue
          if (progressBar && progressState === 0) {
            progressState = 1;
            progressBar.style.width = "50%";
          }
          
          loadRemainingContent();
        });
      } else {
        // Browser doesn't support modern promise-based API
        // Update progress and continue loading
        if (progressBar && progressState === 0) {
          progressState = 1;
          progressBar.style.width = "50%";
        }
        loadRemainingContent();
      }
    };
    
    // Add event listener for loadeddata
    videoElement.addEventListener('loadeddata', function() {
      attemptVideoPlay();
    });
    
    // Set up timeout for slow connections
    const videoLoadTimeout = setTimeout(() => {
      if (!videoIsPlaying) {
        console.warn("Video taking too long to load, continuing with page load");
        if (progressBar && progressState === 0) {
          progressState = 1;
          progressBar.style.width = "50%";
        }
        loadRemainingContent();
      }
    }, isMobile ? 2000 : 3000); // Shorter timeout for mobile
    
    // Add event listeners for user interactions that might trigger playback
    if (isMobile) {
      document.addEventListener('touchstart', function() {
        if (!videoIsPlaying) {
          attemptVideoPlay();
        }
      }, { once: true });
    }
    
    // Clean up function for the timeout
    videoElement.addEventListener('playing', function() {
      clearTimeout(videoLoadTimeout);
    });
    
  } else {
    // No video container found, continue with page load
    if (progressBar && progressState === 0) {
      progressState = 1;
      progressBar.style.width = "50%";
    }
    loadRemainingContent();
  }
  
  // Function to load remaining content after video is loaded
  function loadRemainingContent() {
    // Define loading stages with selectors and delays
    const loadStages = [
      {
        elements: document.querySelectorAll('#hero-content,#navbar'),
        delay: 300
      },
      {
        elements: document.querySelectorAll('.about-section'),
        delay: 1000
      },
      {
        elements: document.querySelectorAll('.map-section'),
        delay: 1500
      },
      {
        elements: document.querySelectorAll('.amenities-section, .kheoniwildlife-section'),
        delay: 2000
      },
      {
        elements: document.querySelectorAll('.nearby-section, .contact-section, .site-footer'),
        delay: 2500
      }
    ];
    
    // Complete the progress bar animation - only if not already at 100%
    if (progressBar && progressBar.style.width !== "100%") {
      setTimeout(function() {
        progressBar.style.transition = "width 1.5s cubic-bezier(0.65, 0, 0.35, 1)";
        progressBar.style.width = "100%";
      }, 300);
    }
    
    // Page load complete event handler - wait for all resources
    window.addEventListener('load', function() {
      // Hide loader when main content is ready
      if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => {
          loader.style.display = "none";
        }, 500);
      }
      
      // Progressive reveal of content based on stages
      loadStages.forEach((stage) => {
        setTimeout(() => {
          stage.elements.forEach(el => {
            if (el) {
              el.style.opacity = "1";
              el.classList.add('loaded');
            }
          });
        }, stage.delay);
      });
      
      // Ensure video is visible and playing
      const video = document.getElementById("background-video");
      if (video) {
        video.style.opacity = "1";
        video.play();
      }
    });
    
    // Fallback: If page takes too long to load, hide loader anyway
    setTimeout(() => {
      if (loader && loader.style.opacity !== "0") {
        loader.style.opacity = "0";
        setTimeout(() => {
          loader.style.display = "none";
        }, 500);
      }
    }, 2000);
  }
});
document.addEventListener("scroll", function() {
  // After scrolling 100px, add 'scrolled' class to body
  if (window.scrollY > 100) {
    document.body.classList.add('scrolled');
  } else {
    document.body.classList.remove('scrolled');
  }
});
function initPropertyMap() {
  // Check if map container exists
  const mapContainer = document.getElementById('property-map');
  if (!mapContainer) return;
  
  // Coordinates for Tiger Safari Lodge (Kheoni Wildlife Sanctuary area)
  const propertyCoords = [22.99706366963482, 76.55440659849152]; // Replace with exact coordinates
  
  // Initialize the map
  const map = L.map('property-map').setView(propertyCoords, 10); // Changed zoom level from 13 to 11 to show more area
  
  // Add a tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);
  
  // Add a marker for the property
  const lodgeIcon = L.divIcon({
    html: '<div style="background-color: #3a3a3a; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
    className: 'property-marker',
    iconSize: [20, 20],
    iconAnchor: [9, 9]
  });
  
  L.marker(propertyCoords, {icon: lodgeIcon}).addTo(map)
    .bindPopup('<b>Tiger Safari Lodge</b>')
    .openPopup();
    
  // Add a circle to show the general area
  L.circle(propertyCoords, {
    color: '#3a3a3a',
    fillColor: '#3a3a3a',
    fillOpacity: 0.1,
    radius: 8000
  }).addTo(map);
  
  // Add nearby landmarks
  const landmarks = [
    {
      name: "Kheoni Wildlife Sanctuary Main Gate",
      coords: [22.8384887235879, 76.88388395033772],
      icon: "🦁",
      description: "Main entrance to the sanctuary(90 mins drive)"
    },
    {
      name: "Devbadla Temple",
      coords: [22.899320162030847, 76.47492485404727],
      icon: "🏛️",
      description: "Ancient temple dating back to 1000 AD(45 min drive)"
    },
    {
      name: "Dewas Temples",
      coords: [22.980346428454457, 76.0608566133082],
      icon: "🛕",
      description: "Famous temples on a hilltop (1 hour drive)"
    },
    {
      name: "Indore Airport",
      coords: [22.743612346255823, 75.80141545009442],
      icon: "🛫",
      description: "Nearest city famous for its food and culture (1 hour 45 minutes drive)"
    },
    {
      name: "Bhopal Airport",
      coords: [23.307955403106853, 77.33628045714181],
      icon: "✈️",
      description: "City of lakes and capital of Madhya Pradesh (1.5 hours drive)"
    },
    {
      name: "Ujjain Mahakaleshwar Temple",
      coords: [23.196621817456894, 75.76922894204955],
      icon: "🛕",
      description: "Historic town with famous temple and ghats (2 hours drive)"
    }
  ];
  
  // Create custom icon for landmarks
  landmarks.forEach(landmark => {
    const landmarkIcon = L.divIcon({
      html: `<div style="background-color: #0c0c0c; color: #333; width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 10px rgba(0,0,0,0.3); font-size: 16px;">${landmark.icon}</div>`,
      className: 'landmark-marker',
      iconSize: [50, 50],
      iconAnchor: [25, 25]
    });
    
    L.marker(landmark.coords, {icon: landmarkIcon}).addTo(map)
      .bindPopup(`<b>${landmark.name}</b><br>${landmark.description}`);
  });
}
window.addEventListener("load", function () {
  // Variables
  const navbar = document.getElementById("navbar");
  const heroContent = document.getElementById("hero-content");
  const ctaButton = document.getElementById("explore-button");
  const menuToggle = document.getElementById("menu-toggle");
  const navbarLinks = document.getElementById("navbar-links");
  const navLinks = document.querySelectorAll(".navbar-links a");
  // Add near the top of your script
  if (navbar) {
    navbar.style.opacity = "1";
  }

// Check if user is coming from another page on our site
const referrer = document.referrer;
const isInternalNavigation = referrer && referrer.includes('khayali');

// If coming from another page on our site and has a hash, skip animations
if (isInternalNavigation && window.location.hash) {
  // Skip or shorten animations
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 300);
  }
  
  // Hide hero content faster
  const heroContent = document.getElementById("hero-content");
  if (heroContent) {
    gsap.to(heroContent, { opacity: 0, duration: 0.3 });
  }
  
  // Skip image grid animation
  const imageGrid = document.getElementById("image-grid");
  if (imageGrid) {
    imageGrid.style.opacity = 0;
    setTimeout(() => {
      imageGrid.style.display = "none";
    }, 300);
  }
  
  // Scroll to the target section sooner
  setTimeout(() => {
    const targetElement = document.querySelector(window.location.hash);
    if (targetElement && typeof locoScroll !== "undefined") {
      locoScroll.scrollTo(targetElement);
    }
  }, 800);
}


  // Rest of your existing code starts here
  console.log("Script loaded and running");

  // Show hero content initially with a shorter animation
  gsap.fromTo(
    heroContent,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 2, delay: 2.2, ease: "power4.out" }
  );

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
  
  // Hide the loader after the animation (your existing code)
  setTimeout(function () {
    console.log("Hiding loader");
    loader.style.opacity = "0";
    setTimeout(function () {
      loader.style.display = "none";
      console.log("Loader hidden completely");

      initScrollAnimations();
    }, 500);
  }, 2000);

  // let locoScroll
  window.locoScroll = null; 

  function setupScrollerProxy() {
  window.locoScroll = new LocomotiveScroll({
      el: document.querySelector("[data-scroll-container]"),
      smooth: true,
      multiplier: 1,
      smartphone: {
        smooth: false,
      },
      tablet: {
        smooth: true,
        breakpoint: 1024,
      },
    });

    // Tell ScrollTrigger to use these proxy methods
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

    // Update ScrollTrigger when scroll updates
    locoScroll.on("scroll", ScrollTrigger.update);

    // After everything is set up, refresh
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();

    return locoScroll;
  }
  initPropertyMap();
  function initScrollAnimations() {
    const isMobile = window.innerWidth <= 768;
  
    gsap.registerPlugin(ScrollTrigger);
    const locoScroll = setupScrollerProxy();

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


    const navbar = document.getElementById("navbar");
  if (navbar) {
    navbar.style.opacity = "1";
  }
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
// In initScrollAnimations function
gsap.utils.toArray(".section").forEach((section, i) => {
  gsap.fromTo(
    section,
    { opacity: 0, y: 30 }, // Reduced from 50 to 30 for subtler effect
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        scroller: "[data-scroll-container]",
        start: "top 85%", // Trigger earlier (was 80%)
        end: "top 60%",   // End earlier (was 50%)
        scrub: 0.5,       // Smoother scrubbing
        once: true,       // Only animate once
      }
    }
  );
});

    locoScroll.on("scroll", ScrollTrigger.update);
    ScrollTrigger.refresh();

    // Place after your initial animations

// Check if we need to scroll to a specific section after all animations
setTimeout(function() {
  // Check for stored scroll target or URL hash
  const storedTarget = sessionStorage.getItem('scrollTarget');
  const urlHash = window.location.hash.substring(1); // Remove the # symbol
  const targetId = storedTarget || urlHash;
  
  if (targetId) {
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // If using LocomotiveScroll
      if (typeof locoScroll !== "undefined") {
        locoScroll.scrollTo(targetElement);
      } else {
        // Fallback for browsers without LocomotiveScroll
        window.scrollTo({
          top: targetElement.offsetTop - 100, 
          behavior: 'smooth'
        });
      }
      
      // Clear the stored target to prevent unwanted scrolling on future page loads
      sessionStorage.removeItem('scrollTarget');
    }
  }
}, 2500); // Adjust timing based on your animations

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

    
  const carouselTrack = document.querySelector('.full-screen-carousel .carousel-track');
  const carouselIndicators = document.querySelector('.full-screen-carousel .carousel-indicators');
  let currentSlide = 0;
  
  // Skip if carousel doesn't exist on page
  if (!carouselTrack) return;
  
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
  
  // Set up navigation buttons
  const prevButton = document.querySelector('.full-screen-carousel .carousel-prev');
  const nextButton = document.querySelector('.full-screen-carousel .carousel-next');
  
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      const slides = document.querySelectorAll('.carousel-slide');
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateCarousel();
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const slides = document.querySelectorAll('.carousel-slide');
      currentSlide = (currentSlide + 1) % slides.length;
      updateCarousel();
    });
  }
  
  // Set up indicators
  document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentSlide = index;
      updateCarousel();
    });
  });
  
  // Auto-advance carousel
  let carouselInterval = setInterval(() => {
    const slides = document.querySelectorAll('.carousel-slide');
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
  }, 5000);
  
  // Pause auto-advance when interacting with carousel
  const carouselContainer = document.querySelector('.full-screen-carousel');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
      clearInterval(carouselInterval);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
      carouselInterval = setInterval(() => {
        const slides = document.querySelectorAll('.carousel-slide');
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
      }, 5000);
    });
  }
}
});
