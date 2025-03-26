import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types/navigation';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { STRINGS } from '../constants/strings';
import { useTTS } from '../hooks/useTTS';
import { useWeather } from '../hooks/useWeather';
import { useHaptic } from '../hooks/useHaptic';
import LoadingIndicator from '../components/LoadingIndicator';
import WeatherDisplay from '../components/WeatherDisplay';
import AccessibleButton from '../components/AccessibleButton';

type WeatherScreenRouteProp = RouteProp<RootStackParamList, 'Weather'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const WeatherScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<WeatherScreenRouteProp>();
  const { isToday } = route.params;
  
  const { speak, stopSpeaking, isSpeaking } = useTTS();
  const { triggerHaptic } = useHaptic();
  const { 
    weatherData, 
    forecastData, 
    isLoading, 
    error, // For error handling
    refreshWeather 
  } = useWeather();
  
  const [hasSpoken, setHasSpoken] = useState(false);

  // Get relevant data based on whether we're showing today or tomorrow
  const weatherInfo = isToday ? weatherData : forecastData;
  
  // Prepare weather description for TTS
  const getWeatherSpeechText = () => {
    if (!weatherInfo) return '';
    
    const dayText = isToday ? STRINGS.TODAY_WEATHER : STRINGS.TOMORROW_WEATHER;
    const tempText = isToday ? STRINGS.CURRENT_TEMP.replace('%s', Math.round(weatherInfo.temp).toString()) : '';
    const highText = STRINGS.HIGH_TEMP.replace('%s', Math.round(weatherInfo.tempMax).toString());
    const lowText = STRINGS.LOW_TEMP.replace('%s', Math.round(weatherInfo.tempMin).toString());
    const feelsLikeText = STRINGS.FEELS_LIKE.replace('%s', Math.round(weatherInfo.feelsLike).toString());
    
    // Convert condition code to Korean text
    let conditionText = '';
    switch (weatherInfo.condition) {
      case 'Clear':
        conditionText = STRINGS.WEATHER_CLEAR;
        break;
      case 'Clouds':
        conditionText = STRINGS.WEATHER_CLOUDY;
        break;
      case 'Rain':
        conditionText = STRINGS.WEATHER_RAIN;
        break;
      case 'Snow':
        conditionText = STRINGS.WEATHER_SNOW;
        break;
      case 'Thunderstorm':
        conditionText = STRINGS.WEATHER_THUNDERSTORM;
        break;
      case 'Drizzle':
        conditionText = STRINGS.WEATHER_DRIZZLE;
        break;
      case 'Mist':
        conditionText = STRINGS.WEATHER_MIST;
        break;
      default:
        conditionText = weatherInfo.condition;
    }
    

    const weatherConditionText = STRINGS.WEATHER_CONDITION.replace('%s', conditionText);

    // 강수 확률
    let rainText = '';
    if (
      weatherInfo.rainProbability !== undefined &&
      weatherInfo.rainProbability >= 10 // 기준치 이하일 경우 무시
    ) {
      rainText = STRINGS.RAIN_PROBABILITY.replace('%s', Math.round(weatherInfo.rainProbability).toString());
    }
  
    const getRainAmountDescription = (mm: number): string => {
      if (mm < 0.1) return '';
      if (mm <= 2) return '약한 비가 예상됩니다.';
      if (mm <= 10) return '조금 비가 올 것으로 보입니다.';
      if (mm <= 30) return '비가 내릴 것으로 예상됩니다. 우산을 챙기세요.';
      return '많은 비가 예상됩니다. 외출 시 주의하세요.';
    };
    
    // 강수량 (있는 경우)
    let rainAmountText = '';
    if (weatherInfo.rainAmount !== undefined && weatherInfo.rainAmount >= 0.1) {
      const mm = Math.round(weatherInfo.rainAmount);
      const desc = getRainAmountDescription(mm);
      rainAmountText = `예상 강수량은 ${mm}밀리미터로, ${desc}`;
    }
  
    return `${dayText}. ${isToday ? tempText : ''} ${highText} ${lowText} ${feelsLikeText} ${weatherConditionText} ${rainText} ${rainAmountText}`.trim();
  };

  // Speak weather information when data is loaded
  useEffect(() => {
    if (weatherInfo && !hasSpoken && !isLoading) {
      const speechText = getWeatherSpeechText();
      speak(speechText);
      setHasSpoken(true);
    }
    
    // Cleanup: stop speaking when component unmounts
    return () => {
      stopSpeaking();
    };
  }, [weatherInfo, isLoading]);
  
  // Handle tap to repeat weather information
  const handleTapToRepeat = () => {
    if (weatherInfo) {
      triggerHaptic('light');
      const speechText = getWeatherSpeechText();
      speak(speechText);
    }
  };
  
  // Handle back button press
  const handleBackPress = () => {
    stopSpeaking();
    navigation.goBack();
  };
  
  // Handle retry button press on error
  const handleRetry = () => {
    refreshWeather();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel={STRINGS.BACK_LABEL}
        >
          <Ionicons name="arrow-back" size={36} color={isToday ? colors.primary : colors.tomorrowBlue} />
        </TouchableOpacity>
        

        <Text
          style={[
            styles.title,
            isToday ? styles.todayTitle : styles.tomorrowTitle
          ]}
        >
          {isToday ? STRINGS.TODAY_WEATHER : STRINGS.TOMORROW_WEATHER}
        </Text>
      </View>
      
      <View style={styles.content}>
        {isLoading ? (
          <LoadingIndicator />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{STRINGS.WEATHER_ERROR}</Text>
            <AccessibleButton
              title={STRINGS.RETRY}
              onPress={handleRetry}
              style={styles.retryButton}
            />
          </View>
        ) : weatherInfo ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleTapToRepeat}
            style={styles.weatherContainer}
            accessibilityLabel={STRINGS.TAP_TO_REPEAT_LABEL}
            accessibilityRole="button"
          >
            <WeatherDisplay weatherInfo={weatherInfo} isToday={isToday} />
            {/*
            <View style={styles.repeatContainer}>
              <Ionicons name="volume-high" size={32} color={colors.primary} />
              <Text style={styles.repeatText}>{STRINGS.TAP_TO_REPEAT_LABEL}</Text>
            </View>
            */}
          </TouchableOpacity>
        ) : (
          <Text style={styles.noDataText}>{STRINGS.GENERIC_ERROR}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 40
  },
  header: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
  },
  title: {
    marginLeft: 20,
    fontSize: fonts.size.xlarge,
    fontWeight: '600',
    lineHeight: fonts.lineHeight.tight * fonts.size.xlarge,
  },
  todayTitle: {
    color: colors.primary, 
  },
  tomorrowTitle: {
    color: '#1E90FF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 15,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  repeatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
    width: '100%',
    justifyContent: 'center',
  },
  repeatText: {
    color: colors.primary,
    marginLeft: 10,
    fontSize: fonts.size.medium,
    fontWeight: '400',
    lineHeight: fonts.lineHeight.normal * fonts.size.medium,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: fonts.size.medium,
    fontWeight: '400', 
    lineHeight: fonts.lineHeight.normal * fonts.size.medium,
  },
  retryButton: {
    width: '80%',
  },
  noDataText: {
    color: colors.text,
    textAlign: 'center',
    fontSize: fonts.size.medium,
    fontWeight: '400',
    lineHeight: fonts.lineHeight.normal * fonts.size.medium,
  },
});

export default WeatherScreen;