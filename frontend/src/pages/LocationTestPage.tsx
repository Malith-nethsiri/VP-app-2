import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LocationAnalysis {
  coordinates: { lat: number; lng: number };
  administrative_location: {
    village_area: string | null;
    pradeshiya_sabha: string | null;
    divisional_secretariat: string | null;
    district: string | null;
    province: string | null;
    postal_code: string | null;
  };
  address: string;
  nearby_amenities: {
    [category: string]: Array<{
      name: string;
      type: string;
      address: string;
      distance: number;
      coordinates: { lat: number; lng: number };
      rating?: number;
    }>;
  };
  map_data: {
    static_map_url: string | null;
    interactive_map_config: any;
  };
}

const LocationTestPage: React.FC = () => {
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LocationAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // Preset locations for quick testing
  const presetLocations = [
    { name: 'Colombo Fort', lat: 6.9344, lng: 79.8428 },
    { name: 'Kandy City', lat: 7.2906, lng: 80.6337 },
    { name: 'Galle Fort', lat: 6.0218, lng: 80.2144 },
    { name: 'Anuradhapura', lat: 8.3114, lng: 80.4037 }
  ];

  const handleCoordinateChange = (field: 'lat' | 'lng', value: string) => {
    setCoordinates(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const usePresetLocation = (preset: { name: string; lat: number; lng: number }) => {
    setCoordinates({ lat: preset.lat.toString(), lng: preset.lng.toString() });
    setError(null);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString()
        });
        setLoading(false);
      },
      (error) => {
        setError('Failed to get current location: ' + error.message);
        setLoading(false);
      }
    );
  };

  const analyzeLocation = async () => {
    if (!coordinates.lat || !coordinates.lng) {
      setError('Please enter valid coordinates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/location/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coordinates: {
            lat: parseFloat(coordinates.lat),
            lng: parseFloat(coordinates.lng)
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.location_data);
      } else {
        setError(data.error || 'Location analysis failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testApiConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/location/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Google Maps API is working correctly!');
      } else {
        alert('❌ Google Maps API connection failed: ' + data.error);
      }
    } catch (err) {
      alert('❌ API test failed: Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{ margin: 0 }}>🌍 Location Intelligence Testing</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={testApiConnection}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              disabled={loading}
            >
              Test API
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <h3>📍 Enter GPS Coordinates</h3>

          {/* Coordinate Inputs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr auto auto',
            gap: '15px',
            alignItems: 'end',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={coordinates.lat}
                onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                placeholder="6.9271"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={coordinates.lng}
                onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                placeholder="79.8612"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white'
                }}
              />
            </div>
            <button
              onClick={getCurrentLocation}
              style={{
                padding: '10px 15px',
                background: 'rgba(76, 175, 80, 0.8)',
                border: 'none',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              disabled={loading}
            >
              📱 Use Current Location
            </button>
            <button
              onClick={analyzeLocation}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                border: 'none',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
              disabled={loading || !coordinates.lat || !coordinates.lng}
            >
              {loading ? 'Analyzing...' : '🔍 Analyze Location'}
            </button>
          </div>

          {/* Preset Locations */}
          <div>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.8 }}>
              Quick test locations:
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {presetLocations.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => usePresetLocation(preset)}
                  style={{
                    padding: '5px 12px',
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            background: 'rgba(244, 67, 54, 0.2)',
            border: '1px solid rgba(244, 67, 54, 0.5)',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            ❌ {error}
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Basic Location Info */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '15px',
              padding: '25px'
            }}>
              <h3>📍 Location Information</h3>
              <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
                <div><strong>Coordinates:</strong> {result.coordinates.lat}, {result.coordinates.lng}</div>
                <div><strong>Address:</strong> {result.address}</div>
                <div><strong>District:</strong> {result.administrative_location.district || 'Not specified'}</div>
                <div><strong>Province:</strong> {result.administrative_location.province || 'Not specified'}</div>
                <div><strong>Postal Code:</strong> {result.administrative_location.postal_code || 'Not specified'}</div>
              </div>
            </div>

            {/* Map Display */}
            {result.map_data.static_map_url && (
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '15px',
                padding: '25px'
              }}>
                <h3>🗺️ Location Map</h3>
                <img
                  src={result.map_data.static_map_url}
                  alt="Property Location Map"
                  style={{
                    maxWidth: '100%',
                    borderRadius: '10px',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}
                />
              </div>
            )}

            {/* Nearby Amenities */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '15px',
              padding: '25px'
            }}>
              <h3>🏢 Nearby Amenities</h3>
              <div style={{ display: 'grid', gap: '20px' }}>
                {Object.entries(result.nearby_amenities).map(([category, amenities]) => (
                  <div key={category}>
                    <h4 style={{
                      margin: '0 0 10px 0',
                      color: '#4ECDC4',
                      textTransform: 'capitalize'
                    }}>
                      {category.replace('_', ' ')} ({amenities.length})
                    </h4>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {amenities.slice(0, 5).map((amenity, index) => (
                        <div
                          key={index}
                          style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '10px',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        >
                          <div style={{ fontWeight: '600' }}>{amenity.name}</div>
                          <div style={{ opacity: 0.8 }}>
                            {amenity.address} • {amenity.distance}m away
                            {amenity.rating && ` • ⭐ ${amenity.rating}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationTestPage;