import Constants from 'expo-constants';
const { WEATHER_API_KEY } = Constants.expoConfig?.extra ?? {};
import { API } from '../constants/strings';
import { isKSTTomorrow, isKSTToday } from '../utils/dateUtils';
import { 
  LocationType, 
  WeatherData, 
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse
} from '../types/weather';
import { processForecastForToday, processForecastForTomorrow } from './forecastProcessor';

// Fetch current weather data
export const fetchWeatherData = async (location: LocationType): Promise<WeatherData> => {
  try {
    let url: string;

    if (location.type === 'coords' && location.latitude && location.longitude) {
      url = `${API.BASE_URL}${API.FORECAST_ENDPOINT}?lat=${location.latitude}&lon=${location.longitude}&units=${API.UNITS}&lang=${API.LANGUAGE}&appid=${WEATHER_API_KEY}`;
    } else {
      url = `${API.BASE_URL}${API.FORECAST_ENDPOINT}?q=${location.city},${location.country}&units=${API.UNITS}&lang=${API.LANGUAGE}&appid=${WEATHER_API_KEY}`;
    }

    console.log('--- Forecast API Request ---');
    console.log('location:', location);
    
    if (!location.city || !location.country) {
      throw new Error('도시 또는 국가 정보가 누락되었습니다.');
    }

    console.log('API_KEY:', WEATHER_API_KEY);
    console.log('Final URL:', url);
    
    if (!url) {
      throw new Error('날씨 API URL이 설정되지 않았습니다.');
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }

    const forecastJson: OpenWeatherForecastResponse = await response.json();
    const processedToday = processForecastForToday(forecastJson.list);
    if (!processedToday) throw new Error('오늘 날씨 예보를 찾을 수 없습니다.');
    return processedToday;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
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
    const processedTomorrow = processForecastForTomorrow(data.list);
    if (!processedTomorrow) throw new Error('내일 날씨 예보를 찾을 수 없습니다.');
    return processedTomorrow;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};