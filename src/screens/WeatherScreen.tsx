import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { useWeather } from '../hooks/useWeather';
import useSpeech from '../hooks/useSpeech';
import { useHaptics } from '../hooks/useHaptics';
import { getWeatherDescription } from '../api/weatherApi';
import { WeatherData, WeatherForecast } from '../types/weather';

// 네비게이션과 라우트 타입 정의
type RootStackParamList = {
  Home: undefined;
  Weather: { day: 'today' | 'tomorrow' };
  Settings: undefined;
};

type WeatherScreenRouteProp = RouteProp<RootStackParamList, 'Weather'>;
type WeatherScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Weather'>;

// 날씨 상태에 따른 아이콘 매핑
const getWeatherIcon = (condition: string): string => {
  const iconMap: { [key: string]: string } = {
    'sunny': 'sunny',
    'partlyCloudy': 'partly-sunny',
    'cloudy': 'cloudy',
    'lightRain': 'rainy-outline',
    'rain': 'rainy',
    'heavyRain': 'thunderstorm',
    'freezingRain': 'snow',
    'showers': 'rainy',
    'lightSnow': 'snow-outline',
    'snow': 'snow',
    'heavySnow': 'snow',
    'sleet': 'snow',
    'rainAndSnow': 'snow',
    'snowShower': 'snow',
    'heavySnowShower': 'snow',
    'thunderstorm': 'thunderstorm',
    'mist': 'cloud-outline',
    'fog': 'cloud-outline',
    'dust': 'cloudy',
    'unknown': 'help-outline'
  };

  return iconMap[condition] || 'help-outline';
};

const WeatherScreen = () => {
  const navigation = useNavigation<WeatherScreenNavigationProp>();
  const route = useRoute<WeatherScreenRouteProp>();
  const { day } = route.params;
  const { todayWeather, tomorrowWeather, isLoading, error, refreshWeather } = useWeather();
  const { speak, stop, repeatLast, isSpeaking } = useSpeech();
  const { impactFeedback, notificationFeedback } = useHaptics();
  const [weatherText, setWeatherText] = useState<string>('');

  // 날씨 데이터 선택
  const weatherData = day === 'today' ? todayWeather : tomorrowWeather;

  // 날씨 정보 음성 안내
  useEffect(() => {
    if (weatherData && !isLoading) {
      const isToday = day === 'today';
      const description = getWeatherDescription(
        isToday ? weatherData as WeatherData : weatherData as WeatherForecast, 
        isToday
      );
      
      setWeatherText(description);
      
      // 자동 음성 안내
      const timer = setTimeout(() => {
        speak(description);
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        stop();
      };
    }
  }, [weatherData, day, isLoading]);

  // 정보 다시 듣기
  const handleRepeat = () => {
    impactFeedback();
    repeatLast();
  };

  // 새로고침
  const handleRefresh = () => {
    impactFeedback();
    refreshWeather();
  };

  // 뒤로 가기
  const handleBack = () => {
    impactFeedback();
    navigation.goBack();
  };

  // 날씨 데이터 렌더링
  const renderWeatherInfo = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>날씨 정보를 가져오는 중...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="cloud-alert" size={64} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
            accessibilityLabel="새로고침"
            accessibilityHint="날씨 정보를 다시 가져옵니다"
          >
            <Text style={styles.refreshButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!weatherData) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>날씨 정보가 없습니다.</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
            accessibilityLabel="새로고침"
            accessibilityHint="날씨 정보를 다시 가져옵니다"
          >
            <Text style={styles.refreshButtonText}>날씨 가져오기</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (day === 'today' && todayWeather) {
      const { current, daily, location } = todayWeather;
      
      return (
        <ScrollView 
          style={styles.contentContainer}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>{location.name}</Text>
            <Text style={styles.dateText}>오늘</Text>
          </View>
          
          <View style={styles.mainWeatherContainer}>
            <Ionicons 
              name={getWeatherIcon(current.condition) as any}
              size={100} 
              color={COLORS.primary} 
            />
            <Text style={styles.temperatureText}>{current.temperature}°</Text>
            <Text style={styles.descriptionText}>{current.description}</Text>
            <Text style={styles.feelsLikeText}>체감 온도: {current.feelsLike}°</Text>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Ionicons name="thermometer-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.detailLabel}>최고/최저</Text>
              <Text style={styles.detailValue}>{daily.highTemp}° / {daily.lowTemp}°</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.detailLabel}>습도</Text>
              <Text style={styles.detailValue}>{current.humidity}%</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.detailLabel}>기압</Text>
              <Text style={styles.detailValue}>{daily.pressure}hPa</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="wind-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.detailLabel}>풍속</Text>
              <Text style={styles.detailValue}>{current.windSpeed}m/s</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="sunny-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.detailLabel}>일출</Text>
              <Text style={styles.detailValue}>
                {daily.sunrise.getHours()}:{daily.sunrise.getMinutes().toString().padStart(2, '0')}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="moon-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.detailLabel}>일몰</Text>
              <Text style={styles.detailValue}>
                {daily.sunset.getHours()}:{daily.sunset.getMinutes().toString().padStart(2, '0')}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    } else if (day === 'tomorrow' && tomorrowWeather) {
      const { tomorrow, location } = tomorrowWeather;
      
      return (
        <ScrollView 
          style={styles.contentContainer}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>{location.name}</Text>
            <Text style={styles.dateText}>내일</Text>
          </View>
          
          <View style={styles.mainWeatherContainer}>
            <Ionicons 
              name={getWeatherIcon(tomorrow.condition) as any}
              size={100} 
              color={COLORS.primary} 
            />
            <Text style={styles.temperatureRangeText}>{tomorrow.highTemp}° / {tomorrow.lowTemp}°</Text>
            <Text style={styles.descriptionText}>{tomorrow.description}</Text>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Ionicons name="rainy-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.detailLabel}>강수 확률</Text>
              <Text style={styles.detailValue}>{tomorrow.precipitationProbability}%</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.detailLabel}>습도</Text>
              <Text style={styles.detailValue}>{tomorrow.humidity}%</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.detailLabel}>기압</Text>
              <Text style={styles.detailValue}>{tomorrow.pressure}hPa</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="wind-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.detailLabel}>풍속</Text>
              <Text style={styles.detailValue}>{tomorrow.windSpeed}m/s</Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          accessibilityLabel="뒤로 가기"
          accessibilityHint="홈 화면으로 돌아갑니다"
        >
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {day === 'today' ? '오늘 날씨' : '내일 날씨'}
        </Text>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
          accessibilityLabel="새로고침"
          accessibilityHint="날씨 정보를 다시 가져옵니다"
        >
          <Ionicons name="refresh" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      {renderWeatherInfo()}
      
      <TouchableOpacity 
        style={styles.listenButton}
        onPress={handleRepeat}
        accessibilityLabel="다시 듣기"
        accessibilityHint="날씨 정보를 음성으로 다시 들을 수 있습니다"
      >
        <Ionicons 
          name={isSpeaking ? "volume-high" : "volume-medium-outline"} 
          size={32} 
          color={COLORS.background} 
        />
        <Text style={styles.listenButtonText}>
          {isSpeaking ? "음성 안내 중..." : "다시 들으려면 터치하세요"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary + '30', // 30% 투명도
  },
  backButton: {
    padding: SIZES.padding / 2,
  },
  headerTitle: {
    fontFamily: 'large-font-bold',
    fontSize: SIZES.title,
    color: COLORS.primary,
  },
  refreshButton: {
    padding: SIZES.padding / 2,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  loadingText: {
    fontFamily: 'large-font',
    fontSize: SIZES.body,
    color: COLORS.text,
    marginTop: SIZES.margin,
  },
  errorText: {
    fontFamily: 'large-font',
    fontSize: SIZES.body,
    color: COLORS.error,
    textAlign: 'center',
    marginVertical: SIZES.margin,
  },
  refreshButtonText: {
    fontFamily: 'large-font',
    fontSize: SIZES.body,
    color: COLORS.primary,
    marginTop: SIZES.margin,
  },
  locationContainer: {
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  locationText: {
    fontFamily: 'large-font-bold',
    fontSize: SIZES.title,
    color: COLORS.primary,
  },
  dateText: {
    fontFamily: 'large-font',
    fontSize: SIZES.subtitle,
    color: COLORS.secondary,
  },
  mainWeatherContainer: {
    alignItems: 'center',
    marginVertical: SIZES.margin * 2,
  },
  temperatureText: {
    fontFamily: 'large-font-bold',
    fontSize: 80,
    color: COLORS.text,
    marginVertical: SIZES.margin,
  },
  temperatureRangeText: {
    fontFamily: 'large-font-bold',
    fontSize: 42,
    color: COLORS.text,
    marginVertical: SIZES.margin,
  },
  descriptionText: {
    fontFamily: 'large-font',
    fontSize: SIZES.subtitle,
    color: COLORS.secondary,
    textAlign: 'center',
  },
  feelsLikeText: {
    fontFamily: 'large-font',
    fontSize: SIZES.body,
    color: COLORS.text,
    marginTop: SIZES.margin / 2,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SIZES.margin * 2,
  },
  detailItem: {
    width: '48%',
    backgroundColor: COLORS.background + '80', // 80% 투명도
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '30', // 30% 투명도
  },
  detailLabel: {
    fontFamily: 'large-font',
    fontSize: SIZES.body,
    color: COLORS.secondary,
    marginVertical: SIZES.margin / 2,
  },
  detailValue: {
    fontFamily: 'large-font-bold',
    fontSize: SIZES.subtitle,
    color: COLORS.text,
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    margin: SIZES.margin,
  },
  listenButtonText: {
    fontFamily: 'large-font-bold',
    fontSize: SIZES.body,
    color: COLORS.background,
    marginLeft: SIZES.margin,
  }
});

export default WeatherScreen;