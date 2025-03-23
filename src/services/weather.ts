import { WEATHER_API_KEY } from '@env';
import { API } from '../constants/strings';
import { 
  LocationType, 
  WeatherData, 
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse
} from '../types/weather';

// Fetch current weather data
export const fetchWeatherData = async (location: LocationType): Promise<WeatherData> => {
  try {
    let url: string;
    
    // Build URL based on location type
    if (location.type === 'coords' && location.latitude && location.longitude) {
      url = `${API.BASE_URL}${API.WEATHER_ENDPOINT}?lat=${location.latitude}&lon=${location.longitude}&units=${API.UNITS}&lang=${API.LANGUAGE}&appid=${WEATHER_API_KEY}`;
    } else {
      // Use city name if coordinates not available
      url = `${API.BASE_URL}${API.WEATHER_ENDPOINT}?q=${location.city},${location.country}&units=${API.UNITS}&lang=${API.LANGUAGE}&appid=${WEATHER_API_KEY}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data: OpenWeatherCurrentResponse = await response.json();
    
    // Transform API response to our WeatherData format
    const weatherData: WeatherData = {
      temp: data.main.temp,
      tempMin: data.main.temp_min,
      tempMax: data.main.temp_max,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      rainAmount: data.rain?.['1h'] || 0,
      timestamp: data.dt,
      lastUpdated: new Date().toISOString(),
    };
    
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Helper function to get tomorrow's forecast
const getTomorrowForecast = (forecastList: OpenWeatherForecastResponse['list']): OpenWeatherForecastResponse['list'][0] => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(12, 0, 0, 0); // Set to noon
  
  // Find the forecast closest to tomorrow at noon
  const tomorrowNoon = tomorrow.getTime() / 1000; // Convert to seconds
  
  let closestForecast = forecastList[0];
  let minDiff = Math.abs(closestForecast.dt - tomorrowNoon);
  
  for (const forecast of forecastList) {
    const diff = Math.abs(forecast.dt - tomorrowNoon);
    if (diff < minDiff) {
      minDiff = diff;
      closestForecast = forecast;
    }
  }
  
  return closestForecast;
};

// Fetch tomorrow's forecast
export const fetchForecastData = async (location: LocationType): Promise<WeatherData> => {
  try {
    let url: string;
    
    // Build URL based on location type
    if (location.type === 'coords' && location.latitude && location.longitude) {
      url = `${API.BASE_URL}${API.FORECAST_ENDPOINT}?lat=${location.latitude}&lon=${location.longitude}&units=${API.UNITS}&lang=${API.LANGUAGE}&appid=${WEATHER_API_KEY}`;
    } else {
      // Use city name if coordinates not available
      url = `${API.BASE_URL}${API.FORECAST_ENDPOINT}?q=${location.city},${location.country}&units=${API.UNITS}&lang=${API.LANGUAGE}&appid=${WEATHER_API_KEY}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }
    
    const data: OpenWeatherForecastResponse = await response.json();
    
    // Get tomorrow's forecast
    const tomorrowForecast = getTomorrowForecast(data.list);
    
    // Calculate min and max temperatures for tomorrow
    let tempMin = tomorrowForecast.main.temp;
    let tempMax = tomorrowForecast.main.temp;
    let rainProbability = tomorrowForecast.pop * 100; // Convert to percentage
    
    // Check all forecasts for tomorrow to find min/max
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    
    const tomorrowStart = tomorrow.getTime() / 1000;
    const tomorrowEnd = dayAfterTomorrow.getTime() / 1000;
    
    const tomorrowForecasts = data.list.filter(
      (forecast) => forecast.dt >= tomorrowStart && forecast.dt < tomorrowEnd
    );
    
    tomorrowForecasts.forEach((forecast) => {
      if (forecast.main.temp_min < tempMin) tempMin = forecast.main.temp_min;
      if (forecast.main.temp_max > tempMax) tempMax = forecast.main.temp_max;
      // Use highest rain probability
      if (forecast.pop * 100 > rainProbability) rainProbability = forecast.pop * 100;
    });
    
    // Transform API response to our WeatherData format
    const forecastData: WeatherData = {
      temp: tomorrowForecast.main.temp,
      tempMin,
      tempMax,
      feelsLike: tomorrowForecast.main.feels_like,
      humidity: tomorrowForecast.main.humidity,
      condition: tomorrowForecast.weather[0].main,
      description: tomorrowForecast.weather[0].description,
      icon: tomorrowForecast.weather[0].icon,
      windSpeed: tomorrowForecast.wind.speed,
      rainProbability: Math.round(rainProbability),
      rainAmount: tomorrowForecast.rain?.['3h'] || 0,
      timestamp: tomorrowForecast.dt,
      lastUpdated: new Date().toISOString(),
    };
    
    return forecastData;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};