import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { LocationType } from "../types/weather";
import { WeatherData } from "../types/weather";
import { useLocation } from "../hooks/useLocation";
import { fetchWeatherData, fetchForecastData } from "../services/weather";
import {
  loadWeatherFromStorage,
  saveWeatherToStorage,
} from "../services/storage";
import { STORAGE_KEYS } from "../constants/strings";

interface WeatherContextType {
  weatherData: WeatherData | null;
  forecastData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refreshWeather: () => void;
  loadWeatherData: (location: LocationType, isToday: boolean) => Promise<void>;
}

export const WeatherContext = createContext<WeatherContextType>({
  weatherData: null,
  forecastData: null,
  isLoading: false,
  error: null,
  refreshWeather: () => {},
  loadWeatherData: async () => {},
});

export const useWeather = () => useContext(WeatherContext);

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({
  children,
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  // Load weather data for the current location
  const loadWeatherData = async (
    currentLocation: LocationType,
    isToday: boolean
  ) => {
    if (!currentLocation) return;

    setIsLoading(true);
    setError(null);

    try {
      // First try to load cached weather data
      const cachedData = await loadWeatherFromStorage(
        isToday ? STORAGE_KEYS.LAST_WEATHER : STORAGE_KEYS.LAST_FORECAST
      );

      // If we have cached data less than 1 hour old, use it
      const now = new Date();
      const cacheTime = cachedData?.lastUpdated
        ? new Date(cachedData.lastUpdated)
        : null;
      const cacheValid =
        cacheTime && now.getTime() - cacheTime.getTime() < 3600000; // 1 hour

      if (cachedData && cacheValid) {
        if (isToday) {
          setWeatherData(cachedData);
        } else {
          setForecastData(cachedData);
        }
      } else {
        // Fetch fresh weather data
        let newData: WeatherData;

        if (isToday) {
          newData = await fetchWeatherData(currentLocation);
          setWeatherData(newData);
        } else {
          newData = await fetchForecastData(currentLocation);
          setForecastData(newData);
        }

        // Cache the new weather data
        await saveWeatherToStorage(
          newData,
          isToday ? STORAGE_KEYS.LAST_WEATHER : STORAGE_KEYS.LAST_FORECAST
        );
      }
    } catch (err) {
      console.error("Failed to load weather data:", err);
      setError("Failed to load weather data");

      // Try to load any cached data regardless of age as fallback
      try {
        const cachedData = await loadWeatherFromStorage(
          isToday ? STORAGE_KEYS.LAST_WEATHER : STORAGE_KEYS.LAST_FORECAST
        );

        if (cachedData) {
          if (isToday) {
            setWeatherData(cachedData);
          } else {
            setForecastData(cachedData);
          }
          // Still show error but at least we have some data
          setError("Using offline data. " + (err as Error).message);
        }
      } catch (cacheErr) {
        // No cached data available
        console.error("No cached weather data available:", cacheErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh both today and tomorrow's weather data
  const refreshWeather = async () => {
    if (!location) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch today's weather
      const todayData = await fetchWeatherData(location);
      setWeatherData(todayData);
      await saveWeatherToStorage(todayData, STORAGE_KEYS.LAST_WEATHER);

      // Fetch tomorrow's forecast
      const tomorrowData = await fetchForecastData(location);
      setForecastData(tomorrowData);
      await saveWeatherToStorage(tomorrowData, STORAGE_KEYS.LAST_FORECAST);
    } catch (err) {
      console.error("Failed to refresh weather data:", err);
      setError("Failed to refresh weather data");
    } finally {
      setIsLoading(false);
    }
  };

  // Load weather data when location changes
  useEffect(() => {
    if (location) {
      loadWeatherData(location, true); // Load today's weather
      loadWeatherData(location, false); // Load tomorrow's weather
    }
  }, [location]);

  const value = {
    weatherData,
    forecastData,
    isLoading,
    error,
    refreshWeather,
    loadWeatherData,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};
