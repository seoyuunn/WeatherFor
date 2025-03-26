import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData } from '../types/weather';

const CACHE_DURATION_MS = 3 * 60 * 60 * 1000; // 3시간

export const storeWeatherData = async (key: 'today' | 'tomorrow', data: WeatherData) => {
  try {
    const item = {
      data,
      cachedAt: Date.now(),
    };
    await AsyncStorage.setItem(`weather_${key}`, JSON.stringify(item));
  } catch (error) {
    console.error(`Error storing weather ${key} data:`, error);
  }
};

export const loadWeatherData = async (key: 'today' | 'tomorrow'): Promise<WeatherData | null> => {
  try {
    const raw = await AsyncStorage.getItem(`weather_${key}`);
    if (!raw) return null;

    const item = JSON.parse(raw);
    const now = Date.now();

    if (now - item.cachedAt < CACHE_DURATION_MS) {
      return item.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error loading weather ${key} data:`, error);
    return null;
  }
};

export const clearWeatherCache = async () => {
  try {
    await AsyncStorage.multiRemove(['weather_today', 'weather_tomorrow']);
  } catch (error) {
    console.error('Error clearing weather cache:', error);
  }
};
