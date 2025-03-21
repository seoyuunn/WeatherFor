export type WeatherCondition = 
  | 'sunny' 
  | 'partlyCloudy' 
  | 'cloudy' 
  | 'lightRain' 
  | 'rain' 
  | 'heavyRain' 
  | 'freezingRain' 
  | 'showers' 
  | 'lightSnow' 
  | 'snow' 
  | 'heavySnow' 
  | 'sleet' 
  | 'rainAndSnow' 
  | 'snowShower' 
  | 'heavySnowShower' 
  | 'thunderstorm' 
  | 'mist' 
  | 'smoke' 
  | 'haze' 
  | 'dust' 
  | 'fog' 
  | 'sand' 
  | 'ash' 
  | 'squall' 
  | 'tornado' 
  | 'unknown';

export interface WeatherLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  timestamp: Date;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  description: string;
  icon: string;
}

export interface DailyWeather {
  highTemp: number;
  lowTemp: number;
  sunrise: Date;
  sunset: Date;
  pressure: number;
}

export interface TomorrowWeather {
  date: Date;
  highTemp: number;
  lowTemp: number;
  condition: WeatherCondition;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitationProbability: number;
  pressure: number;
}

export interface WeatherData {
  location: WeatherLocation;
  current: CurrentWeather;
  daily: DailyWeather;
}

export interface WeatherForecast {
  location: WeatherLocation;
  tomorrow: TomorrowWeather;
}
