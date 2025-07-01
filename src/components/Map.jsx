// src/components/Map.jsx

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from 'react-leaflet';
//import 'leaflet/dist/leaflet.css';
import { useEstablishments } from '../contexts/EstablishmentContext';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for available and occupied parking
const availableIcon = new L.Icon({
  iconUrl: '/images/parking-available.png',
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const occupiedIcon = new L.Icon({
  iconUrl: '/images/parking-occupied.png',
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Custom icon for user's current location
const userLocationIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to handle map centering
const MapController = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center && center[0] !== 0 && center[1] !== 0) {
      // Smoothly animate to the new center
      map.setView(center, zoom || map.getZoom(), {
        animate: true,
        duration: 1.5 // Animation duration in seconds
      });
    }
  }, [center, zoom, map]);

  return null;
};

const Map = () => {
  const { establishments, loading, setSelectedEstablishment } = useEstablishments();
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default fallback (NYC)
  const [mapZoom, setMapZoom] = useState(13);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [centerButtonLoading, setCenterButtonLoading] = useState(false);

  // Function to get user location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve([latitude, longitude]);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000 // 1 minute
        }
      );
    });
  };

  useEffect(() => {
    // Get user's current location on component mount
    getUserLocation()
      .then((userPos) => {
        setUserLocation(userPos);
        setMapCenter(userPos);
        setMapZoom(15); // Zoom closer when user location is found
        setLocationLoading(false);
        setLocationError(null);
        
        console.log('User location found:', userPos);
      })
      .catch((error) => {
        console.error('Error getting location:', error);
        const errorMessage = getLocationErrorMessage(error);
        setLocationError(errorMessage);
        setLocationLoading(false);
        
        // Fallback: Try to center based on establishments if available
        if (establishments && establishments.length > 0) {
          const latSum = establishments.reduce((sum, est) => sum + est.latitude, 0);
          const lngSum = establishments.reduce((sum, est) => sum + est.longitude, 0);
          
          const centerLat = latSum / establishments.length;
          const centerLng = lngSum / establishments.length;
          
          setMapCenter([centerLat, centerLng]);
          setMapZoom(12);
        }
      });
  }, [establishments]);

  // Function to get error message based on error code
  const getLocationErrorMessage = (error) => {
    switch(error.code) {
      case 1: // PERMISSION_DENIED
        return "Location access denied. Please enable location or use manual input.";
      case 2: // POSITION_UNAVAILABLE
        return "Location information unavailable.";
      case 3: // TIMEOUT
        return "Location request timed out.";
      default:
        return "An unknown error occurred while retrieving location.";
    }
  };

  // Function to refresh and center on user location
  const refreshUserLocation = async () => {
    setCenterButtonLoading(true);
    
    try {
      const userPos = await getUserLocation();
      setUserLocation(userPos);
      setMapCenter(userPos);
      setMapZoom(15);
      setLocationError(null);
      
      console.log('Location refreshed:', userPos);
    } catch (error) {
      console.error('Error refreshing location:', error);
      const errorMessage = getLocationErrorMessage(error);
      setLocationError(errorMessage);
    } finally {
      setCenterButtonLoading(false);
    }
  };

  // Function to recenter on existing user location (without refresh)
  const recenterOnUser = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setMapZoom(15);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading map...</div>;
  }

  return (
    <div className="relative">
      {/* Location status indicator */}
      {locationLoading && (
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-md z-[1000] text-sm">
          📍 Getting your location...
        </div>
      )}
      
      {locationError && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md z-[1000] text-sm max-w-xs">
          ⚠️ {locationError}
        </div>
      )}

      {userLocation && !locationLoading && !locationError && (
        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-md z-[1000] text-sm">
          📍 Location found
        </div>
      )}

      {/* Control buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        {/* Center button - Always visible */}
        <button
          onClick={refreshUserLocation}
          disabled={centerButtonLoading}
          className={`
            flex items-center justify-center px-3 py-2 rounded-lg shadow-lg text-white text-sm font-medium transition-all
            ${centerButtonLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            }
          `}
          title="Refresh and center on my location"
        >
          {centerButtonLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Centering...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Center
            </>
          )}
        </button>

        {/* Quick recenter button - Only visible when user location exists */}
        {userLocation && !centerButtonLoading && (
          <button
            onClick={recenterOnUser}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition-colors"
            title="Quick center (no refresh)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        )}
      </div>

      <MapContainer 
        center={[40.7128, -74.0060]} // Keep static initial center
        zoom={13} 
        style={{ height: 'calc(100vh - 64px)', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Map controller for centering */}
        <MapController center={mapCenter} zoom={mapZoom} />
        
        {/* User's current location marker */}
        {userLocation && (
          <Marker 
            position={userLocation}
            icon={userLocationIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold">📍 Your Location</h3>
                <p className="text-sm text-gray-600">You are here</p>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={refreshUserLocation}
                    disabled={centerButtonLoading}
                    className={`
                      px-2 py-1 rounded text-xs font-bold transition-colors
                      ${centerButtonLoading 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-700 text-white'
                      }
                    `}
                  >
                    {centerButtonLoading ? 'Refreshing...' : 'Refresh Location'}
                  </button>
                  <button 
                    onClick={recenterOnUser}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs"
                  >
                    Center Here
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Establishment markers */}
        {establishments.map(establishment => (
          <Marker 
            key={establishment.id}
            position={[establishment.latitude, establishment.longitude]}
            icon={establishment.status === 'Disponible' ? availableIcon : occupiedIcon}
            //
            /* eventHandlers={{
              click: () => {
                console.log('Establishment clicked:', establishment);
                setSelectedEstablishment(establishment);
              },
            }} */
          >
            {/* Tooltip que muestra el nombre permanentemente */}
            <Tooltip 
              permanent={true} 
              direction="bottom" 
              offset={[5, -5]}
              className="establishment-tooltip"
            >
              <div style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#333',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}>
                {establishment.name}
              </div>
            </Tooltip>
            <Popup>
              <div>
                <h3 className="font-bold">{establishment.name}</h3>
                <p>{establishment.address}</p>
                <p className={`font-semibold ${
                  establishment.status === 'Disponible' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {establishment.status}
                </p>
                <button 
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                  onClick={() => {
                    console.log('Establishment viewed:', establishment);
                    setSelectedEstablishment(establishment)}}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;