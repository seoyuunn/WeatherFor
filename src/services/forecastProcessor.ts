import { WeatherData } from '../types/weather';
import { getKSTDate, isKSTToday, isKSTTomorrow } from '../utils/dateUtils';

export function processForecastForDay(
  forecastList: any[],
  daySelector: (dt: number) => boolean
): WeatherData | null {
  const dayForecasts = forecastList.filter((f) => daySelector(f.dt));
  if (dayForecasts.length === 0) return null;

  const tempMax = Math.max(...dayForecasts.map((f) => f.main.temp_max));
  const tempMin = Math.min(...dayForecasts.map((f) => f.main.temp_min));
  const rainProbability = Math.round(
    Math.max(...dayForecasts.map((f) => f.pop * 100))
  );

  const midday =
    dayForecasts.find((f) => {
      const hour = getKSTDate(f.dt).getHours();
      return hour >= 12 && hour <= 15;
    }) || dayForecasts[Math.floor(dayForecasts.length / 2)];

  return {
    temp: midday.main.temp,
    tempMin,
    tempMax,
    feelsLike: midday.main.feels_like,
    condition: midday.weather[0].main,
    description: midday.weather[0].description,
    icon: midday.weather[0].icon,
    rainProbability,
    humidity: midday.main.humidity,
    windSpeed: midday.wind.speed,
    timestamp: midday.dt,
    lastUpdated: new Date().toISOString(),
  };
}

export const processForecastForToday = (forecastList: any[]) =>
  processForecastForDay(forecastList, isKSTToday);

export const processForecastForTomorrow = (forecastList: any[]) =>
  processForecastForDay(forecastList, isKSTTomorrow);
