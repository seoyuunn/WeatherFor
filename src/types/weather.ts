// Location types
export interface LocationType {
    type: 'coords' | 'city';
    latitude: number | null;
    longitude: number | null;
    city: string;
    country: string;
  }
  
  // Weather data structure
  export interface WeatherData {
    temp: number;
    tempMin: number;
    tempMax: number;
    feelsLike: number;
    humidity: number;
    condition: string;
    description: string;
    icon: string;
    windSpeed: number;
    rainProbability?: number; // Optional for current weather
    rainAmount?: number; // Optional, may not be available
    alerts?: string[]; // Optional weather alerts
    timestamp: number;
    lastUpdated: string; // ISO date string for cache invalidation
  }
  
  // OpenWeatherMap API response interfaces
  export interface OpenWeatherCurrentResponse {
    coord: {
      lon: number;
      lat: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
    rain?: {
      '1h'?: number;
      '3h'?: number;
    };
    clouds: {
      all: number;
    };
    dt: number;
    sys: {
      country: string;
      sunrise: number;
      sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
  }
  
  export interface OpenWeatherForecastResponse {
    list: Array<{
      dt: number;
      main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
      };
      weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
      }>;
      clouds: {
        all: number;
      };
      wind: {
        speed: number;
        deg: number;
      };
      pop: number; // Probability of precipitation
      rain?: {
        '3h'?: number;
      };
      sys: {
        pod: string; // Part of day (d = day, n = night)
      };
      dt_txt: string;
    }>;
    city: {
      id: number;
      name: string;
      country: string;
      sunrise: number;
      sunset: number;
    };
  }
  
  export interface OpenWeatherAlertsResponse {
    alerts?: Array<{
      sender_name: string;
      event: string;
      start: number;
      end: number;
      description: string;
    }>;
  }