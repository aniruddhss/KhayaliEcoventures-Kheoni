document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navbarLinks = document.getElementById('navbar-links');
    
    if (menuToggle && navbarLinks) {
      menuToggle.addEventListener('click', function() {
        navbarLinks.classList.toggle('active');
        menuToggle.textContent = navbarLinks.classList.contains('active') ? '✕' : '☰';
      });
    }
    
    // Handle navigation links
    const navLinks = document.querySelectorAll('.navbar-links a');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only handle links that point to sections on the current page
        if (href && href.startsWith('#') && href !== '#') {
          e.preventDefault();
          const targetElement = document.querySelector(href);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 100,
              behavior: 'smooth'
            });
          }
        }
        
        // Close mobile menu if open
        if (navbarLinks && navbarLinks.classList.contains('active')) {
          navbarLinks.classList.remove('active');
          menuToggle.textContent = '☰';
        }
      });
    });
  });