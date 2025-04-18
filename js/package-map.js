document.addEventListener('DOMContentLoaded', function() {
    // Check if map container exists
    const mapContainer = document.getElementById('package-map');
    if (!mapContainer) return;
    
    // Get current page URL to determine which package is being viewed
    const currentPage = window.location.pathname.split('/').pop();
    
    // Initialize the map centered on India
    const map = L.map('package-map').setView([23.0, 79.0], 5);
    
    // Add a tile layer (you can choose different map styles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);
    
    // Package route data
    const packageRoutes = {
      '2d2n.html': {
        title: 'Kheoni Retreat - 2 Days/2 Nights',
        locations: [
          { name: 'Indore Airport', coords: [22.7196, 75.8011], type: 'start' },
          { name: 'Wellness Spa', coords: [22.7276, 75.8723], type: 'stop', optional: true },
          { name: 'Kheoni Retreat', coords: [22.4922, 76.8154], type: 'destination' },
          { name: 'Kheoni Wildlife Sanctuary', coords: [22.4700, 76.8300], type: 'activity' },
          { name: 'Devbadla Temple', coords: [22.5100, 76.8200], type: 'activity' }
        ],
        route: true
      },
      '3d2n.html': {
        title: 'Kheoni Retreat - 3 Days/2 Nights',
        locations: [
          { name: 'Indore Airport', coords: [22.7196, 75.8011], type: 'start' },
          { name: 'Kheoni Retreat', coords: [22.4922, 76.8154], type: 'destination' },
          { name: 'Kheoni Wildlife Sanctuary', coords: [22.4700, 76.8300], type: 'activity' },
          { name: 'Devbadla Temple', coords: [22.5100, 76.8200], type: 'activity' }
        ],
        route: true
      },
      'ujjain-day-trip.html': {
        title: 'Ujjain Day Trip',
        locations: [
          { name: 'Indore', coords: [22.7196, 75.8011], type: 'start' },
          { name: 'Mahakaleshwar Temple', coords: [23.1828, 75.7682], type: 'activity' },
          { name: 'Heritage Haveli Stay', coords: [23.1756, 75.7712], type: 'destination' },
          { name: 'Ayurvedic Wellness Center', coords: [23.1700, 75.7690], type: 'activity', optional: true }
        ],
        route: true
      }
    };
    
    // Get package data based on current page
    const packageData = packageRoutes[currentPage];
    
    if (!packageData) {
      // Default display for pages without specific routes
      map.setView([22.5, 76.8], 10);
      L.marker([22.4922, 76.8154]).addTo(map)
        .bindPopup('<b>Khayali Travels</b><br>Property Location')
        .openPopup();
      return;
    }
    
    // Create location markers with different icons
    const icons = {
      start: L.divIcon({
        html: '<i class="fa fa-plane" style="color:#4a89dc;font-size:18px;"></i>',
        className: 'map-custom-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),
      destination: L.divIcon({
        html: '<i class="fa fa-bed" style="color:#e74c3c;font-size:18px;"></i>',
        className: 'map-custom-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),
      activity: L.divIcon({
        html: '<i class="fa fa-camera" style="color:#3a9d5f;font-size:18px;"></i>',
        className: 'map-custom-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),
      stop: L.divIcon({
        html: '<i class="fa fa-map-marker" style="color:#f39c12;font-size:18px;"></i>',
        className: 'map-custom-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
    };
    
    // Add markers and collect coordinates for bounds
    const points = [];
    packageData.locations.forEach(loc => {
      points.push(loc.coords);
      
      let popupContent = `<b>${loc.name}</b>`;
      if (loc.optional) {
        popupContent += ' <span style="color:#777;font-style:italic;">(Optional)</span>';
      }
      
      // Use appropriate icon or default
      const icon = icons[loc.type] || L.divIcon({
        html: '<i class="fa fa-map-marker" style="color:#3498db;font-size:18px;"></i>',
        className: 'map-custom-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      L.marker(loc.coords, {icon: icon}).addTo(map)
        .bindPopup(popupContent);
    });
    
    // Create route lines if enabled
    if (packageData.route && packageData.locations.length > 1) {
      L.polyline(points, {
        color: '#3498db', 
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10',
        lineJoin: 'round'
      }).addTo(map);
    }
    
    // Fit the map to show all markers
    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points).pad(0.3));
    }
  });