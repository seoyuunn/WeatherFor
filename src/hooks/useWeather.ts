import { useContext } from 'react';
import { WeatherContext } from '../contexts/WeatherContext';

// Hook to access weather data and functions from WeatherContext
export const useWeather = () => {
  const context = useContext(WeatherContext);
  
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  
  return context;
};