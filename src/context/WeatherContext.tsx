import React, { createContext, useContext, useState, useEffect } from 'react';
import { WeatherData, WeatherForecast } from '../types/weather';
import { useLocation } from './LocationContext';
import { getCurrentWeather, getWeatherForecast } from '../api/weatherApi';

// 날씨 컨텍스트 인터페이스
interface WeatherContextType {
  todayWeather: WeatherData | null;
  tomorrowWeather: WeatherForecast | null;
  isLoading: boolean;
  error: string | null;
  refreshWeather: () => Promise<void>;
}

// 컨텍스트 생성
const WeatherContext = createContext<WeatherContextType>({
  todayWeather: null,
  tomorrowWeather: null,
  isLoading: false,
  error: null,
  refreshWeather: async () => {},
});

// 날씨 프로바이더 컴포넌트
export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todayWeather, setTodayWeather] = useState<WeatherData | null>(null);
  const [tomorrowWeather, setTomorrowWeather] = useState<WeatherForecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentLocation } = useLocation();

  // 위치가 설정되면 날씨 정보 가져오기
  useEffect(() => {
    if (currentLocation) {
      refreshWeather();
    }
  }, [currentLocation]);

  // 날씨 정보 새로고침
  const refreshWeather = async () => {
    if (!currentLocation) {
      setError('위치 정보가 없습니다. 위치를 설정해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 오늘 날씨 가져오기
      const today = await getCurrentWeather(currentLocation);
      setTodayWeather(today);

      // 내일 날씨 가져오기
      const tomorrow = await getWeatherForecast(currentLocation);
      setTomorrowWeather(tomorrow);
    } catch (err) {
      console.error('날씨 정보를 가져오는 데 실패했습니다:', err);
      setError('날씨 정보를 가져오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        todayWeather,
        tomorrowWeather,
        isLoading,
        error,
        refreshWeather,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

// 날씨 컨텍스트 훅
export const useWeather = () => useContext(WeatherContext);