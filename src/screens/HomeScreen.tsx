import React, { useEffect } from 'react';
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
  const { location } = useLocation();
  const { loadWeatherData } = useWeather();

  // Preload weather data when the screen mounts for faster access
  useEffect(() => {
    if (location) {
      loadWeatherData(location, true); // Load today's weather
      loadWeatherData(location, false); // Load tomorrow's weather
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>{STRINGS.APP_NAME}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <AccessibleButton
          title={STRINGS.TODAY_WEATHER}
          accessibilityLabel={STRINGS.TODAY_WEATHER_LABEL}
          onPress={() => handleWeatherPress(true)}
          style={styles.mainButton}
        />
        
        <AccessibleButton
          title={STRINGS.TOMORROW_WEATHER}
          accessibilityLabel={STRINGS.TOMORROW_WEATHER_LABEL}
          onPress={() => handleWeatherPress(false)}
          style={styles.mainButton}
        />
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleHelpPress}
          style={styles.helpButton}
          accessibilityRole="button"
          accessibilityLabel={STRINGS.HELP_LABEL}
        >
          <Ionicons name="help-circle" size={40} color={colors.primary} />
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
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: fonts.size.extraLarge,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  mainButton: {
    marginVertical: 20,
    height: 150,
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
    fontSize: fonts.size.large,
    fontWeight: "bold",
    color: colors.primary,
    marginLeft: 10,
  },
});

export default HomeScreen;