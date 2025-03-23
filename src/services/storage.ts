import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData } from '../types/weather';
import { STORAGE_KEYS } from '../constants/strings';

// Save weather data to storage with timestamp
export const saveWeatherToStorage = async (
  weatherData: WeatherData,
  storageKey: string
): Promise<void> => {
  try {
    const dataWithTimestamp = {
      ...weatherData,
      lastUpdated: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(storageKey, JSON.stringify(dataWithTimestamp));
  } catch (error) {
    console.error(`Error saving ${storageKey} to storage:`, error);
    throw error;
  }
};

// Load weather data from storage
export const loadWeatherFromStorage = async (
  storageKey: string
): Promise<WeatherData | null> => {
  try {
    const dataJson = await AsyncStorage.getItem(storageKey);
    
    if (dataJson) {
      return JSON.parse(dataJson) as WeatherData;
    }
    
    return null;
  } catch (error) {
    console.error(`Error loading ${storageKey} from storage:`, error);
    return null;
  }
};

// Clear outdated cache data (older than 1 day)
export const clearOutdatedCache = async (): Promise<void> => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 86400000); // 24 hours in milliseconds
    
    // Check last weather cache
    const weatherJson = await AsyncStorage.getItem(STORAGE_KEYS.LAST_WEATHER);
    if (weatherJson) {
      const weatherData = JSON.parse(weatherJson) as WeatherData;
      const lastUpdated = new Date(weatherData.lastUpdated);
      
      if (lastUpdated < oneDayAgo) {
        await AsyncStorage.removeItem(STORAGE_KEYS.LAST_WEATHER);
      }
    }
    
    // Check last forecast cache
    const forecastJson = await AsyncStorage.getItem(STORAGE_KEYS.LAST_FORECAST);
    if (forecastJson) {
      const forecastData = JSON.parse(forecastJson) as WeatherData;
      const lastUpdated = new Date(forecastData.lastUpdated);
      
      if (lastUpdated < oneDayAgo) {
        await AsyncStorage.removeItem(STORAGE_KEYS.LAST_FORECAST);
      }
    }
  } catch (error) {
    console.error('Error clearing outdated cache:', error);
  }
};

// Get last updated timestamp
export const getLastUpdatedTime = async (
  storageKey: string
): Promise<Date | null> => {
  try {
    const dataJson = await AsyncStorage.getItem(storageKey);
    
    if (dataJson) {
      const data = JSON.parse(dataJson) as WeatherData;
      return new Date(data.lastUpdated);
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting last updated time for ${storageKey}:`, error);
    return null;
  }
};