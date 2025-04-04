import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/strings';
import { LocationType } from '../types/weather';

// Request location permissions
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

// Get current device location
export const getCurrentLocation = async (): Promise<LocationType> => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced, // Balance accuracy with battery usage
    });
    
    // Get city and country from coordinates
    const geoLocation = await reverseGeocode(
      location.coords.latitude,
      location.coords.longitude
    );
    
    return {
      type: 'coords',
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      city: geoLocation.city,
      country: geoLocation.country,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    throw error;
  }
};

// Convert coordinates to city/country
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<{ city: string; country: string }> => {
  try {
    const geoCode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    
    if (geoCode.length > 0) {
      return {
        city: geoCode[0].city || geoCode[0].district || geoCode[0].subregion || 'Seongnam-si',
        country: geoCode[0].country || 'KR',
      };
    }
    
    // Default to Seongnam-si, Korea if geocoding fails
    return {
      city: 'Seongnam-si',
      country: 'KR',
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    // Default to Seongnam-si, Korea if geocoding fails
    return {
      city: 'Seongnam-si',
      country: 'KR',
    };
  }
};

// Get location from device storage
export const getLastKnownLocation = async (): Promise<LocationType | null> => {
  try {
    const locationJson = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION);
    
    if (locationJson) {
      return JSON.parse(locationJson) as LocationType;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting stored location:', error);
    return null;
  }
};

// Save location to device storage
export const saveLocation = async (location: LocationType): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(location));
  } catch (error) {
    console.error('Error saving location:', error);
    throw error;
  }
};