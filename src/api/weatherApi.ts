import { WeatherData, WeatherForecast, WeatherCondition } from '../types/weather';
import { LocationType } from '../types/location';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// OpenWeatherMap API 키 (실제 프로젝트에서는 환경 변수로 관리)
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// 날씨 코드에 따른 상태 매핑
const weatherConditionMap: Record<number, WeatherCondition> = {
  // 맑음 그룹
  800: 'sunny',
  
  // 구름 그룹
  801: 'partlyCloudy',
  802: 'partlyCloudy',
  803: 'cloudy',
  804: 'cloudy',
  
  // 비 그룹
  300: 'lightRain',
  301: 'lightRain',
  302: 'rain',
  310: 'lightRain',
  311: 'rain',
  312: 'rain',
  313: 'rain',
  314: 'rain',
  321: 'rain',
  500: 'lightRain',
  501: 'rain',
  502: 'heavyRain',
  503: 'heavyRain',
  504: 'heavyRain',
  511: 'freezingRain',
  520: 'showers',
  521: 'showers',
  522: 'showers',
  531: 'showers',
  
  // 눈 그룹
  600: 'lightSnow',
  601: 'snow',
  602: 'heavySnow',
  611: 'sleet',
  612: 'sleet',
  613: 'sleet',
  615: 'rainAndSnow',
  616: 'rainAndSnow',
  620: 'snowShower',
  621: 'snowShower',
  622: 'heavySnowShower',
  
  // 천둥번개 그룹
  200: 'thunderstorm',
  201: 'thunderstorm',
  202: 'thunderstorm',
  210: 'thunderstorm',
  211: 'thunderstorm',
  212: 'thunderstorm',
  221: 'thunderstorm',
  230: 'thunderstorm',
  231: 'thunderstorm',
  232: 'thunderstorm',
  
  // 안개/연무 그룹
  701: 'mist',
  711: 'smoke',
  721: 'haze',
  731: 'dust',
  741: 'fog',
  751: 'sand',
  761: 'dust',
  762: 'ash',
  771: 'squall',
  781: 'tornado'
};

// 현재 날씨 정보 가져오기
export const getCurrentWeather = async (location: LocationType): Promise<WeatherData> => {
  try {
    // 네트워크 연결 확인
    const netInfo = await NetInfo.fetch();
    
    // 캐시 키 생성
    const cacheKey = `weather_current_${location.latitude}_${location.longitude}`;
    
    // 네트워크 연결이 없는 경우 캐시된 데이터 반환
    if (!netInfo.isConnected) {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        // 캐시된 데이터가 1시간 이내인 경우에만 사용
        const cacheTime = new Date(parsedData.timestamp);
        const now = new Date();
        if ((now.getTime() - cacheTime.getTime()) < 3600000) { // 1시간 = 3600000ms
          return parsedData.data;
        }
      }
      throw new Error('인터넷 연결이 없고 최신 날씨 데이터도 없습니다.');
    }
    
    // API 요청 URL 구성
    const url = `${BASE_URL}/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric&lang=kr`;
    
    // API 요청
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`날씨 데이터를 가져오는 데 실패했습니다: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 응답 데이터를 앱 형식에 맞게 변환
    const weatherData: WeatherData = {
      location: {
        name: data.name,
        country: data.sys.country,
        latitude: data.coord.lat,
        longitude: data.coord.lon
      },
      current: {
        timestamp: new Date(data.dt * 1000),
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        condition: weatherConditionMap[data.weather[0].id] || 'unknown',
        description: data.weather[0].description,
        icon: data.weather[0].icon
      },
      daily: {
        highTemp: Math.round(data.main.temp_max),
        lowTemp: Math.round(data.main.temp_min),
        sunrise: new Date(data.sys.sunrise * 1000),
        sunset: new Date(data.sys.sunset * 1000),
        pressure: data.main.pressure
      }
    };
    
    // 데이터 캐싱
    await AsyncStorage.setItem(cacheKey, JSON.stringify({
      data: weatherData,
      timestamp: new Date()
    }));
    
    return weatherData;
  } catch (error) {
    console.error('날씨 데이터 가져오기 오류:', error);
    throw error;
  }
};

// 날씨 예보 가져오기 (내일 날짜용)
export const getWeatherForecast = async (location: LocationType): Promise<WeatherForecast> => {
  try {
    // 네트워크 연결 확인
    const netInfo = await NetInfo.fetch();
    
    // 캐시 키 생성
    const cacheKey = `weather_forecast_${location.latitude}_${location.longitude}`;
    
    // 네트워크 연결이 없는 경우 캐시된 데이터 반환
    if (!netInfo.isConnected) {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        // 캐시된 데이터가 3시간 이내인 경우에만 사용
        const cacheTime = new Date(parsedData.timestamp);
        const now = new Date();
        if ((now.getTime() - cacheTime.getTime()) < 10800000) { // 3시간 = 10800000ms
          return parsedData.data;
        }
      }
      throw new Error('인터넷 연결이 없고 최신 예보 데이터도 없습니다.');
    }
    
    // API 요청 URL 구성
    const url = `${BASE_URL}/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric&lang=kr`;
    
    // API 요청
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`날씨 예보 데이터를 가져오는 데 실패했습니다: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 내일 날짜 정보 구하기
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);
    
    // 내일 하루에 대한 예보 필터링
    const tomorrowForecasts = data.list.filter((item: any) => {
      const forecastDate = new Date(item.dt * 1000);
      return forecastDate >= tomorrow && forecastDate <= tomorrowEnd;
    });
    
    if (tomorrowForecasts.length === 0) {
      throw new Error('내일 날씨 예보를 찾을 수 없습니다.');
    }
    
    // 최고/최저 온도 계산
    let highTemp = -100;
    let lowTemp = 100;
    let conditions: WeatherCondition[] = [];
    
    tomorrowForecasts.forEach((forecast: any) => {
      if (forecast.main.temp_max > highTemp) {
        highTemp = forecast.main.temp_max;
      }
      if (forecast.main.temp_min < lowTemp) {
        lowTemp = forecast.main.temp_min;
      }
      const condition = weatherConditionMap[forecast.weather[0].id] || 'unknown';
      conditions.push(condition);
    });
    
    // 가장 빈번한 날씨 상태 찾기
    const conditionCounts = conditions.reduce((acc: Record<string, number>, condition) => {
      acc[condition] = (acc[condition] || 0) + 1;
      return acc;
    }, {});
    
    let mainCondition: WeatherCondition = 'unknown';
    let maxCount = 0;
    
    Object.entries(conditionCounts).forEach(([condition, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mainCondition = condition as WeatherCondition;
      }
    });
    
    // 대표 예보 (낮 12시 경 예보)
    const midDayForecast = tomorrowForecasts.find((forecast: any) => {
      const forecastHour = new Date(forecast.dt * 1000).getHours();
      return forecastHour >= 11 && forecastHour <= 14;
    }) || tomorrowForecasts[Math.floor(tomorrowForecasts.length / 2)];
    
    // 응답 데이터를 앱 형식에 맞게 변환
    const forecastData: WeatherForecast = {
      location: {
        name: data.city.name,
        country: data.city.country,
        latitude: data.city.coord.lat,
        longitude: data.city.coord.lon
      },
      tomorrow: {
        date: tomorrow,
        highTemp: Math.round(highTemp),
        lowTemp: Math.round(lowTemp),
        condition: mainCondition,
        description: midDayForecast.weather[0].description,
        icon: midDayForecast.weather[0].icon,
        humidity: midDayForecast.main.humidity,
        windSpeed: midDayForecast.wind.speed,
        precipitationProbability: Math.round((midDayForecast.pop || 0) * 100),
        pressure: midDayForecast.main.pressure
      }
    };
    
    // 데이터 캐싱
    await AsyncStorage.setItem(cacheKey, JSON.stringify({
      data: forecastData,
      timestamp: new Date()
    }));
    
    return forecastData;
  } catch (error) {
    console.error('날씨 예보 데이터 가져오기 오류:', error);
    throw error;
  }
};

// 날씨 상태에 따른 음성 설명 텍스트 생성
export const getWeatherDescription = (weatherData: WeatherData | WeatherForecast, isToday: boolean): string => {
  const data = isToday 
    ? (weatherData as WeatherData) 
    : (weatherData as WeatherForecast);
    
  const locationName = data.location.name;
  
  if (isToday) {
    const current = (data as WeatherData).current;
    const daily = (data as WeatherData).daily;
    
    return `${locationName}의 오늘 날씨입니다. 
현재 온도는 ${current.temperature}도이고, 체감 온도는 ${current.feelsLike}도입니다. 
날씨는 ${current.description}이며, 
오늘의 최고 기온은 ${daily.highTemp}도, 최저 기온은 ${daily.lowTemp}도입니다. 
습도는 ${current.humidity}%, 풍속은 ${current.windSpeed}미터입니다.
오늘 해가 뜨는 시간은 ${formatTime(daily.sunrise)}, 해가 지는 시간은 ${formatTime(daily.sunset)}입니다.
${getWeatherAdvice(current.condition, current.temperature, current.humidity)}`;
  } else {
    const tomorrow = (data as WeatherForecast).tomorrow;
    
    return `${locationName}의 내일 날씨입니다. 
예상 기온은 최고 ${tomorrow.highTemp}도, 최저 ${tomorrow.lowTemp}도입니다. 
날씨는 ${tomorrow.description}이 예상됩니다. 
강수 확률은 ${tomorrow.precipitationProbability}%이며, 습도는 ${tomorrow.humidity}%, 풍속은 ${tomorrow.windSpeed}미터가 예상됩니다.
${getWeatherAdvice(tomorrow.condition, Math.round((tomorrow.highTemp + tomorrow.lowTemp) / 2), tomorrow.humidity)}`;
  }
};

// 시간 형식 변환 함수
const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}시 ${minutes}분`;
};

// 날씨에 따른 조언 생성
const getWeatherAdvice = (condition: WeatherCondition, temperature: number, humidity: number): string => {
  let advice = '';
  
  // 온도 기반 조언
  if (temperature >= 35) {
    advice += '폭염이 예상됩니다. 외출을 삼가고 수분을 자주 섭취하세요. ';
  } else if (temperature >= 30) {
    advice += '더운 날씨입니다. 되도록 그늘에서 활동하고 물을 많이 마시세요. ';
  } else if (temperature <= 0) {
    advice += '영하의 날씨입니다. 두꺼운 외투와 장갑, 목도리를 착용하세요. ';
  } else if (temperature <= 5) {
    advice += '추운 날씨입니다. 따뜻한 옷차림이 필요합니다. ';
  }
  
  // 날씨 상태에 따른 조언
  switch (condition) {
    case 'thunderstorm':
      advice += '천둥번개가 칠 수 있으니 외출을 자제하세요. ';
      break;
    case 'rain':
    case 'heavyRain':
    case 'showers':
      advice += '비가 오니 우산을 꼭 챙기세요. ';
      break;
    case 'lightRain':
      advice += '가벼운 비가 예상됩니다. 우산을 준비하세요. ';
      break;
    case 'snow':
    case 'heavySnow':
    case 'snowShower':
      advice += '눈이 오니 미끄럼에 주의하세요. ';
      break;
    case 'fog':
    case 'mist':
      advice += '안개가 예상되니 운전 시 주의하세요. ';
      break;
    case 'sunny':
      if (temperature > 25) {
        advice += '햇볕이 강하니 자외선 차단제를 바르고 모자를 착용하세요. ';
      }
      break;
    case 'dust':
    case 'sand':
      advice += '미세먼지가 많으니 마스크를 착용하세요. ';
      break;
  }
  
  // 습도 기반 조언
  if (humidity > 85 && temperature > 25) {
    advice += '습도가 높아 더 덥게 느껴질 수 있습니다. ';
  } else if (humidity < 30) {
    advice += '습도가 낮아 건조하니 충분한 수분 섭취가 필요합니다. ';
  }
  
  return advice || '특별한 주의사항이 없습니다.';
};