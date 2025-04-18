document.addEventListener('DOMContentLoaded', function() {
    // Initialize locomotive scroll if it exists
    // if (typeof LocomotiveScroll !== 'undefined') {
    //   const scroll = new LocomotiveScroll({
    //     el: document.querySelector('[data-scroll-container]'),
    //     smooth: true,
    //     smartphone: {
    //       smooth: true
    //     },
    //     tablet: {
    //       smooth: true
    //     }
    //   });
  
    //   // Update scroll on window resize
    //   window.addEventListener('resize', () => scroll.update());
    // }
  
    // Handle booking form submission
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
      bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
          checkIn: document.getElementById('check-in').value,
          checkOut: document.getElementById('check-out').value,
          guests: document.getElementById('guests').value,
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          specialRequests: document.getElementById('special-requests').value
        };
        
        // Here you would normally send this data to your server
        console.log('Booking request:', formData);
        
        // Show success message (replace with your own implementation)
        alert('Thank you for your booking request! Our team will contact you shortly to confirm your reservation.');
        
        // Reset form
        bookingForm.reset();
      });
    }
  
    // Set minimum dates for check-in and check-out
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const checkIn = document.getElementById('check-in');
    const checkOut = document.getElementById('check-out');
    
    if (checkIn && checkOut) {
      // Format dates to YYYY-MM-DD
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      checkIn.min = formatDate(today);
      checkOut.min = formatDate(tomorrow);
      
      // Update checkout min date when check-in changes
      checkIn.addEventListener('change', function() {
        const newMinCheckOut = new Date(this.value);
        newMinCheckOut.setDate(newMinCheckOut.getDate() + 1);
        checkOut.min = formatDate(newMinCheckOut);
        
        // If current checkout date is now before checkin, update it
        if (new Date(checkOut.value) <= new Date(this.value)) {
          checkOut.value = formatDate(newMinCheckOut);
        }
      });
    }
  });