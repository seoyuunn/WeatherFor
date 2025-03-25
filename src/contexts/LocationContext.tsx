import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { LocationType } from '../types/weather';
import { 
  requestLocationPermission, 
  getCurrentLocation,
  getLastKnownLocation,
  saveLocation 
} from '../services/location';

interface LocationContextType {
  location: LocationType | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  setManualLocation: (city: string, country: string) => Promise<void>;
}

export const LocationContext = createContext<LocationContextType>({
  location: null,
  isLoading: false,
  error: null,
  requestLocation: async () => {},
  setManualLocation: async () => {},
});

export const useLocation = () => useContext(LocationContext);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Request location permission and get current location
  const requestLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const hasPermission = await requestLocationPermission();
      
      if (hasPermission) {
        const currentLocation = await getCurrentLocation();
        setLocation(currentLocation);
        await saveLocation(currentLocation);
      } else {
        throw new Error('Location permission denied');
      }
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Error getting location');
      
      // Try to get last known location as fallback
      try {
        const lastLocation = await getLastKnownLocation();
        if (lastLocation) {
          setLocation(lastLocation);
        }
      } catch (storageErr) {
        console.error('No stored location available:', storageErr);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Set location manually (e.g., when user enters city name)
  const setManualLocation = async (city: string, country: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const manualLocation: LocationType = {
        type: 'city',
        city,
        country,
        latitude: null,
        longitude: null,
      };
      
      setLocation(manualLocation);
      await saveLocation(manualLocation);
    } catch (err) {
      console.error('Error setting manual location:', err);
      setError('Error setting location');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Try to get location on mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        // First try to get the last known location from storage
        const lastLocation = await getLastKnownLocation();
        
        if (lastLocation) {
          setLocation(lastLocation);
        } else {
          // If no stored location, try to request current location
          await requestLocation();
        }
      } catch (err) {
        console.error('Error initializing location:', err);
        setError('Error initializing location');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeLocation();
  }, []);

  const value = {
    location,
    isLoading,
    error,
    requestLocation,
    setManualLocation,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};