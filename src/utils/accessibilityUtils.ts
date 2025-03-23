import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

// Check if a screen reader is active (TalkBack or VoiceOver)
export const isScreenReaderEnabled = async (): Promise<boolean> => {
  try {
    const isSpeaking = await Speech.isSpeakingAsync();
    return isSpeaking;
  } catch (error) {
    console.error('Error checking screen reader status:', error);
    return false;
  }
};

// Create accessible props for touchable elements
export const getAccessibleTouchProps = (
  accessibilityLabel: string,
  accessibilityHint?: string
) => {
  const props = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel,
  };

  if (accessibilityHint) {
    return {
      ...props,
      accessibilityHint,
    };
  }

  return props;
};

// Format temperature for accessibility
export const formatTemperatureForAccessibility = (temp: number): string => {
  return `${Math.round(temp)}도`;
};

// Format weather condition for accessibility
export const formatWeatherConditionForAccessibility = (
  condition: string,
  description: string
): string => {
  // Use description if available, fall back to condition
  return description || condition;
};

// Convert date to accessible format (in Korean)
export const formatDateForAccessibility = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const weekday = weekdayNames[date.getDay()];
  
  return `${year}년 ${month}월 ${day}일 ${weekday}`;
};

// Convert time to accessible format (in Korean)
export const formatTimeForAccessibility = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours < 12 ? '오전' : '오후';
  const hour12 = hours % 12 || 12;
  
  return `${ampm} ${hour12}시 ${minutes}분`;
};

// Combine weather data into a complete accessible description
export const getWeatherAccessibleDescription = (
  weatherData: {
    temp: number;
    tempMin: number;
    tempMax: number;
    feelsLike: number;
    condition: string;
    description: string;
    rainProbability?: number;
  },
  isToday: boolean
): string => {
  const timePrefix = isToday ? '오늘' : '내일';
  const temperature = formatTemperatureForAccessibility(weatherData.temp);
  const highTemp = formatTemperatureForAccessibility(weatherData.tempMax);
  const lowTemp = formatTemperatureForAccessibility(weatherData.tempMin);
  const feelsLike = formatTemperatureForAccessibility(weatherData.feelsLike);
  const condition = formatWeatherConditionForAccessibility(
    weatherData.condition,
    weatherData.description
  );
  
  let description = `${timePrefix} 날씨. 현재 온도는 ${temperature}. 최고 기온은 ${highTemp}, 최저 기온은 ${lowTemp}. 체감 온도는 ${feelsLike}. 날씨는 ${condition}`;
  
  if (weatherData.rainProbability !== undefined) {
    description += `. 강수 확률은 ${weatherData.rainProbability}퍼센트`;
  }
  
  return description;
};