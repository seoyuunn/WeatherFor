import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import AccessibleButton from '../components/AccessibleButton';
import { RootStackParamList } from '../types/navigation';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { STRINGS } from '../constants/strings';
import { useTTS } from '../hooks/useTTS';
import { useLocation } from '../hooks/useLocation';
import { useWeather } from '../hooks/useWeather';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const { speak, stopSpeaking } = useTTS();
  const { location, requestLocation, isLoading } = useLocation();
  const { loadWeatherData } = useWeather();
  const [locationText, setLocationText] = useState<string>('');

  // Preload weather data when the screen mounts for faster access
  useEffect(() => {
    if (location) {
      loadWeatherData(location, true); // Load today's weather
      loadWeatherData(location, false); // Load tomorrow's weather
      setLocationText(location.city);
    }
    
    // Cleanup: stop any ongoing speech when component unmounts
    return () => {
      stopSpeaking();
    };
  }, [location]);

  // Navigate to weather screen for today or tomorrow
  const handleWeatherPress = (isToday: boolean) => {
    stopSpeaking();
    navigation.navigate('Weather', { isToday });
  };

  // Navigate to help screen
  const handleHelpPress = () => {
    stopSpeaking();
    navigation.navigate('Help');
  };

  // Handle refresh location press
  const handleLocationPress = async () => {
    stopSpeaking();
    await requestLocation();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>{STRINGS.APP_NAME}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.locationButton}
        onPress={handleLocationPress}
        accessibilityRole="button"
        accessibilityLabel={STRINGS.CURRENT_LOCATION_LABEL}
        disabled={isLoading}
      >
        <Ionicons name="location" size={24} color={colors.primary} />
        <Text style={styles.locationText}>
          {isLoading ? STRINGS.LOCATION_LOADING : locationText || STRINGS.CURRENT_LOCATION}
        </Text>
        <Ionicons name="refresh" size={20} color={colors.primary} />
      </TouchableOpacity>
      
      <View style={styles.buttonContainer}>
        <AccessibleButton
          title={STRINGS.TODAY_WEATHER}
          accessibilityLabel={STRINGS.TODAY_WEATHER_LABEL}
          onPress={() => handleWeatherPress(true)}
          style={styles.todayButton}
        />
        
        <AccessibleButton
          title={STRINGS.TOMORROW_WEATHER}
          accessibilityLabel={STRINGS.TOMORROW_WEATHER_LABEL}
          onPress={() => handleWeatherPress(false)}
          style={styles.tomorrowButton}
          textStyle={{ color: colors.text }} // 흰색 텍스트로 가독성 확보
        />
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleHelpPress}
          style={styles.helpButton}
          accessibilityRole="button"
          accessibilityLabel={STRINGS.HELP_LABEL}
        >
          <Ionicons name="help-circle" size={40} color={colors.text} />
          <Text style={styles.helpText}>{STRINGS.HELP}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 60,
  },
  title: {
    fontSize: fonts.size.extraLarge,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  locationText: {
    fontSize: fonts.size.medium,
    color: colors.text,
    fontWeight: "500",
    marginHorizontal: 10,
    flex: 1,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  todayButton: {
    marginVertical: 20,
    height: 150,
    backgroundColor: colors.button,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  tomorrowButton: {
    marginVertical: 20,
    height: 150,
    backgroundColor: colors.tomorrowBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    marginBottom: 20,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  helpText: {
    fontSize: fonts.size.medium,
    fontWeight: "regular",
    color: colors.text,
    marginLeft: 10,
  },
});

export default HomeScreen;