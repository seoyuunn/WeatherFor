import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { STRINGS } from '../constants/strings';
import { WeatherData } from '../types/weather';

interface WeatherDisplayProps {
  weatherInfo: WeatherData;
  isToday: boolean;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherInfo, isToday }) => {
  // Helper function to get weather icon based on condition
  const getWeatherIcon = () => {
    const condition = weatherInfo.condition.toLowerCase();
    
    if (condition.includes('clear')) {
      return <Ionicons name="sunny" size={80} color={colors.sunny} />;
    } else if (condition.includes('cloud')) {
      return <Ionicons name="cloud" size={80} color={colors.cloudy} />;
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return <Ionicons name="rainy" size={80} color={colors.rainy} />;
    } else if (condition.includes('snow')) {
      return <Ionicons name="snow" size={80} color={colors.snowy} />;
    } else if (condition.includes('thunderstorm')) {
      return <Ionicons name="thunderstorm" size={80} color={colors.stormy} />;
    } else {
      return <Ionicons name="partly-sunny" size={80} color={colors.cloudy} />;
    }
  };
  
  // Helper function to convert condition code to Korean text
  const getConditionText = () => {
    switch (weatherInfo.condition) {
      case 'Clear':
        return STRINGS.WEATHER_CLEAR;
      case 'Clouds':
        return STRINGS.WEATHER_CLOUDY;
      case 'Rain':
        return STRINGS.WEATHER_RAIN;
      case 'Snow':
        return STRINGS.WEATHER_SNOW;
      case 'Thunderstorm':
        return STRINGS.WEATHER_THUNDERSTORM;
      case 'Drizzle':
        return STRINGS.WEATHER_DRIZZLE;
      case 'Mist':
        return STRINGS.WEATHER_MIST;
      default:
        return weatherInfo.condition;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getWeatherIcon()}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.conditionText}>{getConditionText()}</Text>
        
        <View style={styles.tempContainer}>
          {isToday && (
           <Text style={styles.currentTemp}>{Math.round(weatherInfo.temp)}°</Text>
           )}

          <View style={styles.minMaxContainer}>
            <View style={styles.tempRow}>
              <Ionicons name="arrow-up" size={24} color={colors.text} />
              <Text style={styles.highLowTemp}>{Math.round(weatherInfo.tempMax)}°</Text>
            </View>
            <View style={styles.tempRow}>
              <Ionicons name="arrow-down" size={24} color={colors.text} />
              <Text style={styles.highLowTemp}>{Math.round(weatherInfo.tempMin)}°</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="thermometer" size={24} color={colors.info} />
            <Text style={styles.detailText}>
              {STRINGS.FEELS_LIKE.replace('%s', Math.round(weatherInfo.feelsLike).toString())}
            </Text>
          </View>
          
          {weatherInfo.rainProbability !== undefined && (
            <View style={styles.detailRow}>
              <Ionicons name="water" size={24} color={colors.rainy} />
              <Text style={styles.detailText}>
                {STRINGS.RAIN_PROBABILITY.replace('%s', weatherInfo.rainProbability.toString())}
              </Text>
            </View>
          )}
          
          {/* Show alerts if any */}
          {weatherInfo.alerts && weatherInfo.alerts.length > 0 && (
            <View style={styles.alertContainer}>
              <Ionicons name="warning" size={24} color={colors.warning} />
              <Text style={styles.alertText}>{weatherInfo.alerts[0]}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  conditionText: {
    fontSize: fonts.size.large,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
    lineHeight: 48,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  currentTemp: {
    fontSize: 80,
    fontWeight: '700',
    color: colors.text,
    marginRight: 20,
  },
  minMaxContainer: {
    alignItems: 'flex-start',
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  highLowTemp: {
    fontSize: fonts.size.large,
    fontWeight: '400',
    color: colors.text,
    marginLeft: 5,
  },
  detailsContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    fontSize: fonts.size.medium,
    fontWeight: '400',
    color: colors.text,
    marginLeft: 10,
    lineHeight: 42,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderRadius: 10,
    marginTop: 10,
  },
  alertText: {
    fontSize: fonts.size.medium,
    fontWeight: '400',
    color: colors.warning,
    marginLeft: 10,
    flex: 1,
    lineHeight: 42,
  },
});

export default WeatherDisplay;