document.addEventListener("DOMContentLoaded", function() {
    // Check if browser supports IntersectionObserver
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            if (lazyImage.dataset.src) {
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.removeAttribute('data-src');
            }
            
            if (lazyImage.dataset.srcset) {
              lazyImage.srcset = lazyImage.dataset.srcset;
              lazyImage.removeAttribute('data-srcset');
            }
            
            lazyImage.classList.remove('lazy');
            imageObserver.unobserve(lazyImage);
          }
        });
      }, {
        rootMargin: '200px 0px' // Start loading 200px before image enters viewport
      });
  
      // Track all images with class "lazy" or with data-src attribute
      const lazyImages = document.querySelectorAll('img.lazy, img[data-src]');
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver support
      let lazyLoadThrottleTimeout;
      
      function lazyLoad() {
        if (lazyLoadThrottleTimeout) {
          clearTimeout(lazyLoadThrottleTimeout);
        }
        
        lazyLoadThrottleTimeout = setTimeout(function() {
          const scrollTop = window.pageYOffset;
          const lazyImages = document.querySelectorAll('img.lazy, img[data-src]');
          
          lazyImages.forEach(function(img) {
            if (img.offsetTop < (window.innerHeight + scrollTop + 200)) {
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
                img.removeAttribute('data-srcset');
              }
              
              img.classList.remove('lazy');
            }
          });
          
          if (lazyImages.length === 0) { 
            document.removeEventListener('scroll', lazyLoad);
            window.removeEventListener('resize', lazyLoad);
            window.removeEventListener('orientationChange', lazyLoad);
          }
        }, 20);
      }
      
      document.addEventListener('scroll', lazyLoad);
      window.addEventListener('resize', lazyLoad);
      window.addEventListener('orientationChange', lazyLoad);
      // Run once to check for any images in initial viewport
      lazyLoad();
    }
    
    // Also apply to background images loaded via CSS
    // For elements with data-bg attribute
    if ('IntersectionObserver' in window) {
      const bgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyBg = entry.target;
            if (lazyBg.dataset.bg) {
              lazyBg.style.backgroundImage = `url(${lazyBg.dataset.bg})`;
              lazyBg.removeAttribute('data-bg');
            }
            
            lazyBg.classList.remove('lazy-bg');
            bgObserver.unobserve(lazyBg);
          }
        });
      }, {
        rootMargin: '200px 0px'
      });
  
      const lazyBackgrounds = document.querySelectorAll('.lazy-bg, [data-bg]');
      lazyBackgrounds.forEach(bg => {
        bgObserver.observe(bg);
      });
    }
  });