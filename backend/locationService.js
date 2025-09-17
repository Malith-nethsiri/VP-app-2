const { Client } = require('@googlemaps/google-maps-services-js');

class LocationService {
  constructor() {
    this.client = new Client({});
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!this.apiKey) {
      console.warn('⚠️ Google Maps API key not found. Location services will be limited.');
    }

    // Sri Lankan specific amenity types based on planning documents
    this.amenityTypes = {
      educational: ['school', 'university', 'college', 'library'],
      healthcare: ['hospital', 'clinic', 'pharmacy', 'doctor'],
      government: ['post_office', 'police', 'courthouse', 'city_hall'],
      commercial: ['bank', 'atm', 'supermarket', 'gas_station', 'shopping_mall'],
      religious: ['church', 'temple', 'mosque', 'place_of_worship'],
      transport: ['bus_station', 'train_station', 'airport', 'taxi_stand']
    };
  }

  // Main method: Analyze location from GPS coordinates
  async analyzeLocation(coordinates) {
    try {
      console.log(`🌍 Starting location analysis for coordinates: ${coordinates.lat}, ${coordinates.lng}`);

      const [
        reverseGeocodeResult,
        nearbyAmenities,
        accessibilityInfo
      ] = await Promise.all([
        this.reverseGeocode(coordinates),
        this.findNearbyAmenities(coordinates),
        this.analyzeAccessibility(coordinates)
      ]);

      const locationAnalysis = {
        coordinates: coordinates,
        administrative_location: this.extractAdministrativeDetails(reverseGeocodeResult),
        address: this.formatAddress(reverseGeocodeResult),
        nearby_amenities: nearbyAmenities,
        accessibility: accessibilityInfo,
        analysis_timestamp: new Date().toISOString(),
        map_data: {
          static_map_url: this.generateStaticMapUrl(coordinates),
          interactive_map_config: this.getInteractiveMapConfig(coordinates)
        }
      };

      console.log('✅ Location analysis completed successfully');
      return {
        success: true,
        data: locationAnalysis,
        message: 'Location analysis completed'
      };

    } catch (error) {
      console.error('❌ Location analysis failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to analyze location'
      };
    }
  }

  // Reverse geocoding to get address from coordinates
  async reverseGeocode(coordinates) {
    try {
      if (!this.apiKey) {
        throw new Error('Google Maps API key not configured');
      }

      const response = await this.client.reverseGeocode({
        params: {
          latlng: coordinates,
          key: this.apiKey,
          language: 'en',
          region: 'lk' // Sri Lanka
        }
      });

      if (response.data.status === 'OK') {
        return response.data.results;
      } else {
        throw new Error(`Geocoding failed: ${response.data.status}`);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  // Extract Sri Lankan administrative details from geocoding results
  extractAdministrativeDetails(geocodeResults) {
    const administrative = {
      village_area: null,
      pradeshiya_sabha: null,
      divisional_secretariat: null,
      district: null,
      province: null,
      postal_code: null
    };

    if (!geocodeResults || geocodeResults.length === 0) {
      return administrative;
    }

    geocodeResults.forEach(result => {
      result.address_components.forEach(component => {
        const types = component.types;

        if (types.includes('sublocality') || types.includes('neighborhood')) {
          administrative.village_area = component.long_name;
        }
        if (types.includes('administrative_area_level_3')) {
          administrative.divisional_secretariat = component.long_name;
        }
        if (types.includes('administrative_area_level_2')) {
          administrative.district = component.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          administrative.province = component.long_name;
        }
        if (types.includes('postal_code')) {
          administrative.postal_code = component.long_name;
        }
        if (types.includes('locality')) {
          administrative.pradeshiya_sabha = component.long_name;
        }
      });
    });

    return administrative;
  }

  // Format complete address
  formatAddress(geocodeResults) {
    if (!geocodeResults || geocodeResults.length === 0) {
      return 'Address not available';
    }

    return geocodeResults[0].formatted_address;
  }

  // Find nearby amenities by category
  async findNearbyAmenities(coordinates, radius = 5000) {
    try {
      if (!this.apiKey) {
        return this.getMockAmenities(coordinates);
      }

      const amenitiesByCategory = {};

      for (const [category, types] of Object.entries(this.amenityTypes)) {
        console.log(`🔍 Searching for ${category} amenities...`);

        const categoryAmenities = [];

        for (const type of types) {
          try {
            const response = await this.client.placesNearby({
              params: {
                location: coordinates,
                radius: radius,
                type: type,
                key: this.apiKey,
                language: 'en'
              }
            });

            if (response.data.status === 'OK') {
              const places = response.data.results.slice(0, 5); // Limit to 5 per type

              places.forEach(place => {
                categoryAmenities.push({
                  name: place.name,
                  type: type,
                  address: place.vicinity,
                  rating: place.rating || null,
                  distance: this.calculateDistance(
                    coordinates,
                    place.geometry.location
                  ),
                  coordinates: {
                    lat: place.geometry.location.lat,
                    lng: place.geometry.location.lng
                  },
                  place_id: place.place_id,
                  open_now: place.opening_hours?.open_now || null
                });
              });
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));

          } catch (error) {
            console.warn(`Failed to search for ${type}:`, error.message);
          }
        }

        // Sort by distance and limit to top 10 per category
        amenitiesByCategory[category] = categoryAmenities
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 10);
      }

      return amenitiesByCategory;

    } catch (error) {
      console.error('Amenity search failed:', error);
      return this.getMockAmenities(coordinates);
    }
  }

  // Analyze accessibility and transportation
  async analyzeAccessibility(coordinates) {
    try {
      // For now, provide a basic accessibility analysis
      // This can be enhanced with routing API calls

      return {
        road_access: {
          primary_route: "Accessible via main road network",
          road_quality: "Assessment required - site visit needed",
          public_transport: "Analysis based on nearby transport amenities",
          all_weather_access: "To be determined during site inspection"
        },
        transportation_analysis: {
          nearest_bus_stop: "Within 1-2 km radius (estimated)",
          main_roads: "Connected to district road network",
          highway_access: "Distance to be calculated",
          traffic_conditions: "Normal for the area"
        },
        connectivity_score: this.calculateConnectivityScore(coordinates)
      };

    } catch (error) {
      console.error('Accessibility analysis failed:', error);
      return {
        road_access: { status: 'Analysis failed' },
        transportation_analysis: { status: 'Analysis failed' },
        connectivity_score: 0
      };
    }
  }

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLon = this.toRadians(coord2.lng - coord1.lng);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(coord1.lat)) * Math.cos(this.toRadians(coord2.lat)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 1000); // Return distance in meters
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Calculate connectivity score based on amenities and access
  calculateConnectivityScore(coordinates) {
    // Basic scoring algorithm - can be enhanced
    let score = 50; // Base score

    // This would be enhanced with actual amenity data
    // For now, return a reasonable estimate
    return Math.min(score, 100);
  }

  // Generate static map URL for reports
  generateStaticMapUrl(coordinates, width = 640, height = 400, zoom = 15) {
    if (!this.apiKey) {
      return null;
    }

    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
    const params = new URLSearchParams({
      center: `${coordinates.lat},${coordinates.lng}`,
      zoom: zoom,
      size: `${width}x${height}`,
      maptype: 'roadmap',
      markers: `color:red|${coordinates.lat},${coordinates.lng}`,
      key: this.apiKey
    });

    return `${baseUrl}?${params.toString()}`;
  }

  // Get configuration for interactive maps
  getInteractiveMapConfig(coordinates) {
    return {
      center: coordinates,
      zoom: 15,
      marker: coordinates,
      map_style: 'roadmap',
      controls: {
        zoom: true,
        streetView: true,
        fullscreen: true
      }
    };
  }

  // Mock amenities for testing without API key
  getMockAmenities(coordinates) {
    return {
      educational: [
        {
          name: "Local Primary School",
          type: "school",
          address: "Nearby area",
          distance: 800,
          coordinates: { lat: coordinates.lat + 0.005, lng: coordinates.lng + 0.005 }
        }
      ],
      healthcare: [
        {
          name: "Community Health Center",
          type: "clinic",
          address: "Local area",
          distance: 1200,
          coordinates: { lat: coordinates.lat - 0.008, lng: coordinates.lng + 0.003 }
        }
      ],
      government: [
        {
          name: "Post Office",
          type: "post_office",
          address: "Main street",
          distance: 600,
          coordinates: { lat: coordinates.lat + 0.003, lng: coordinates.lng - 0.004 }
        }
      ],
      commercial: [
        {
          name: "Local Bank Branch",
          type: "bank",
          address: "Commercial area",
          distance: 900,
          coordinates: { lat: coordinates.lat - 0.006, lng: coordinates.lng + 0.007 }
        }
      ],
      religious: [
        {
          name: "Community Temple",
          type: "temple",
          address: "Religious quarter",
          distance: 500,
          coordinates: { lat: coordinates.lat + 0.002, lng: coordinates.lng - 0.003 }
        }
      ],
      transport: [
        {
          name: "Bus Station",
          type: "bus_station",
          address: "Transport hub",
          distance: 1500,
          coordinates: { lat: coordinates.lat - 0.01, lng: coordinates.lng + 0.008 }
        }
      ]
    };
  }

  // Test Google Maps API connection
  async testConnection() {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          message: 'Google Maps API key not configured',
          error: 'Missing API key'
        };
      }

      // Test with Colombo coordinates
      const testCoordinates = { lat: 6.9271, lng: 79.8612 };

      const response = await this.client.reverseGeocode({
        params: {
          latlng: testCoordinates,
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK') {
        return {
          success: true,
          message: 'Google Maps API connection successful',
          test_location: 'Colombo, Sri Lanka',
          api_status: response.data.status
        };
      } else {
        return {
          success: false,
          message: 'Google Maps API connection failed',
          error: response.data.status
        };
      }

    } catch (error) {
      return {
        success: false,
        message: 'Google Maps API test failed',
        error: error.message
      };
    }
  }
}

// Export singleton instance
const locationService = new LocationService();
module.exports = locationService;