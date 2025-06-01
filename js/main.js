
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  const app = {
    init() {
      this.setupEventListeners();
      this.setupNavbar();
      this.handleVideoLoading();
      this.initializeMap();
      this.initializeCarousels();
    },

    // Core event listeners
    setupEventListeners() {
      // Handle scroll events for navbar
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
          document.body.classList.add('scrolled');
        } else {
          document.body.classList.remove('scrolled');
        }
      });

      // Handle hash-based navigation
      if (window.location.hash) {
        setTimeout(() => {
          const targetElement = document.querySelector(window.location.hash);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 1000);
      }
    },

    // Navbar functionality
    setupNavbar() {
      const navbar = document.getElementById('navbar');
      const menuToggle = document.getElementById('menu-toggle');
      const navbarLinks = document.getElementById('navbar-links');
      
      // Show navbar initially
      if (navbar) navbar.style.opacity = '1';
      
      // Mobile menu toggle
      if (menuToggle && navbarLinks) {
        menuToggle.addEventListener('click', () => {
          navbarLinks.classList.toggle('active');
          menuToggle.textContent = navbarLinks.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
          if (!navbarLinks.contains(e.target) && e.target !== menuToggle && navbarLinks.classList.contains('active')) {
            navbarLinks.classList.remove('active');
            menuToggle.textContent = '☰';
          }
        });
      }
    },

    
    // Video background optimization
    handleVideoLoading() {
      const videoContainer = document.getElementById('video-container');
      const loader = document.getElementById('loader');
      const progressBar = document.getElementById('loading-progress');
      
      // Skip video loading if not on home page or on mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isHomePage = !window.location.pathname.includes('/pages/');
      
      if (!videoContainer || !isHomePage) {
        // No video container or not on home page, hide loader and continue
        if (loader) {
          setTimeout(() => {
            progressBar.style.width = '100%';
            setTimeout(() => {
              loader.style.opacity = '0';
              setTimeout(() => loader.style.display = 'none', 500);
            }, 500);
          }, 300);
        }
        return;
      }

      // On mobile, just use the poster image and skip video
      if (isMobile) {
        if (progressBar) progressBar.style.width = '100%';
        if (loader) {
          setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
          }, 1000);
        }
        return;
      }

      // Load video efficiently (once) for desktop users
      const videoElement = document.createElement('video');
      videoElement.id = 'background-video';
      videoElement.muted = true;
      videoElement.loop = true;
      videoElement.playsInline = true;
      videoElement.style.opacity = '0';
      videoElement.style.position = 'absolute';
      videoElement.style.top = '0';
      videoElement.style.left = '0';
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoElement.style.objectFit = 'cover';
      videoElement.setAttribute('preload', 'metadata');
      
      // Add source with media attribute to only download on large screens
      const source = document.createElement('source');
      source.src = 'tigersafarilodge (1).mp4';
      source.type = 'video/mp4';
      videoElement.appendChild(source);
      
      // Add video to container behind the poster image
      videoContainer.appendChild(videoElement);
      
      // Show progress as video loads
      if (progressBar) progressBar.style.width = '50%';
      
      // Handle video loaded event
      videoElement.addEventListener('loadeddata', () => {
        // Play video when loaded
        const playPromise = videoElement.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // Fade in video
            setTimeout(() => {
              videoElement.style.transition = 'opacity 1s ease';
              videoElement.style.opacity = '1';
              
              // Complete progress bar
              if (progressBar) progressBar.style.width = '100%';
              
              // Hide loader
              if (loader) {
                setTimeout(() => {
                  loader.style.opacity = '0';
                  setTimeout(() => loader.style.display = 'none', 500);
                }, 500);
              }
            }, 100);
          }).catch(error => {
            console.warn('Auto-play prevented:', error);
            // Hide loader anyway
            if (progressBar) progressBar.style.width = '100%';
            if (loader) {
              setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
              }, 500);
            }
          });
        } else {
          // For browsers that don't support the promise-based API
          if (progressBar) progressBar.style.width = '100%';
          if (loader) {
            setTimeout(() => {
              loader.style.opacity = '0';
              setTimeout(() => loader.style.display = 'none', 500);
            }, 500);
          }
        }
      });
      
      // Fallback if video takes too long to load
      setTimeout(() => {
        if (loader && loader.style.opacity !== '0') {
          if (progressBar) progressBar.style.width = '100%';
          setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
          }, 500);
        }
      }, 3000);
    },

    // Map functionality
    initializeMap() {
      const mapContainer = document.getElementById('property-map');
      if (!mapContainer) return;
      
      // Coordinates for Tiger Safari Lodge
      const propertyCoords = [22.99706366963482, 76.55440659849152];
      
      // Initialize the map
      const map = L.map('property-map').setView(propertyCoords, 10);
      
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
    },

    // Simple carousel functionality
    initializeCarousels() {
      document.querySelectorAll('.full-screen-carousel').forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        
        if (!track || slides.length === 0) return;
        
        let currentSlide = 0;
        let autoplayInterval;
        
        // Update carousel display
        const updateCarousel = () => {
          // Update slide position
          track.style.transform = `translateX(-${currentSlide * 100}%)`;
          
          // Update indicators
          indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
          });
        };
        
        // Set up navigation buttons
        if (prevButton) {
          prevButton.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel();
          });
        }
        
        if (nextButton) {
          nextButton.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
          });
        }
        
        // Set up indicators
        indicators.forEach((indicator, index) => {
          indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
          });
        });
        
        // Setup autoplay
        const startAutoplay = () => {
          autoplayInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
          }, 5000);
        };
        
        const stopAutoplay = () => {
          clearInterval(autoplayInterval);
        };
        
        // Pause autoplay on hover
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        
        // Start autoplay
        startAutoplay();
      });
    }
  };

  // Initialize the app
  app.init();
});