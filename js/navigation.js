document.addEventListener('DOMContentLoaded', function() {
  // Super simple mobile navigation that WILL work
  // Get all navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Prevent default anchor behavior
      e.preventDefault();
      
      // Extract the target section ID from the href
      const targetId = this.getAttribute('href').substring(1);
      
      // Find the target element
      const targetElement = document.getElementById(targetId);
      
      if (!targetElement) return; // Skip if element doesn't exist
      
      // Close mobile menu if it's open
      const navbarLinks = document.getElementById('navbar-links');
      if (navbarLinks && navbarLinks.classList.contains('active')) {
        navbarLinks.classList.remove('active');
        document.getElementById('menu-toggle').textContent = '☰';
      }
      
      // Scroll behavior with animation support
      if (window.innerWidth <= 1220 || !window.locoScroll) {
        // MOBILE SCROLL - basic approach with smooth behavior
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
        
        // Get the absolute position of the element relative to the page
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = rect.top + scrollTop - navbarHeight;
        
        // Use smooth scrolling on mobile (if supported)
        try {
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        } catch (error) {
          // Fallback for older browsers
          window.scrollTo(0, targetPosition);
        }
      } else {
        // DESKTOP - use locomotive scroll with animation
        window.locoScroll.scrollTo(targetElement, {
          duration: 1000,
          easing: [0.25, 0.00, 0.35, 1.00] // Smooth easing
        });
      }
    });
  });
  
  // Handle data-scroll-to links with animation support
  const dataScrollLinks = document.querySelectorAll('[data-scroll-to]');
  
  dataScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get target ID from data attribute
      const targetId = this.getAttribute('data-scroll-to');
      if (!targetId) return;
      
      // Find the element
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;
      
      // Close mobile menu if open
      const navbarLinks = document.getElementById('navbar-links');
      if (navbarLinks && navbarLinks.classList.contains('active')) {
        navbarLinks.classList.remove('active');
        document.getElementById('menu-toggle').textContent = '☰';
      }
      
      // Use same scrolling logic as above with animations
      if (window.innerWidth <= 1220 || !window.locoScroll) {
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = rect.top + scrollTop - navbarHeight;
        
        // Use smooth scrolling on mobile (if supported)
        try {
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        } catch (error) {
          // Fallback for older browsers
          window.scrollTo(0, targetPosition);
        }
      } else {
        window.locoScroll.scrollTo(targetElement, {
          duration: 1000,
          easing: [0.25, 0.00, 0.35, 1.00]
        });
      }
    });
  });
  
  // Menu toggle functionality - keep this the same for both
  const menuToggle = document.getElementById('menu-toggle');
  const navbarLinks = document.getElementById('navbar-links');
  
  if (menuToggle && navbarLinks) {
    menuToggle.addEventListener('click', function() {
      navbarLinks.classList.toggle('active');
      menuToggle.textContent = navbarLinks.classList.contains('active') ? '✕' : '☰';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navbarLinks.contains(e.target) && e.target !== menuToggle) {
        navbarLinks.classList.remove('active');
        menuToggle.textContent = '☰';
      }
    });
  }
});