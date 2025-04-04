import Constants from 'expo-constants';

const extra = Constants.manifest2?.extra ?? Constants.extra ?? {};
const WEATHER_API_KEY = extra.WEATHER_API_KEY ?? '';
const API_UNITS = extra.API_UNITS ?? 'metric';
const API_LANGUAGE = extra.API_LANGUAGE ?? 'kr';

// API 기본 설정
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// API 호출 기본 함수
export const fetchFromAPI = async (endpoint: string, params: Record<string, string>) => {
  try {
    // API 키와 기본 매개변수 추가
    const queryParams = new URLSearchParams({
      ...params,
      appid: WEATHER_API_KEY,
      units: API_UNITS || 'metric',
      lang: API_LANGUAGE || 'kr'
    });
    
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}?${queryParams.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API 호출 오류:', error);
    throw error;
  }
};

// 오프라인 상태 확인
export const isNetworkAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://www.google.com', { 
      method: 'HEAD',
      cache: 'no-cache'
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};