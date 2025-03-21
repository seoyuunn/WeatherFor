import React, { useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Text 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LargeButton from '../components/LargeButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import useSpeech from '../hooks/useSpeech';
import { useLocation } from '../hooks/useLocation';
import { useWeather } from '../hooks/useWeather';

type RootStackParamList = {
  Home: undefined;
  Weather: { day: 'today' | 'tomorrow' };
  Settings: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { speak } = useSpeech();
  const { currentLocation, locationName } = useLocation();
  
  // 앱이 시작되면 환영 메시지 재생
  useEffect(() => {
    const welcomeMessage = locationName 
      ? `${locationName}의 날씨 정보 서비스입니다. 오늘 또는 내일 날씨 버튼을 눌러주세요.`
      : '날씨 정보 서비스입니다. 오늘 또는 내일 날씨 버튼을 눌러주세요.';
    
    const timer = setTimeout(() => {
      speak(welcomeMessage);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [locationName]);

  const handleTodayPress = () => {
    navigation.navigate('Weather', { day: 'today' });
  };

  const handleTomorrowPress = () => {
    navigation.navigate('Weather', { day: 'tomorrow' });
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>WeatherFor</Text>
          <Text style={styles.subtitle}>
            {locationName ? `${locationName}의 날씨` : '날씨 정보'}
          </Text>
          
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={handleSettingsPress}
            accessibilityLabel="설정"
            accessibilityHint="설정 화면으로 이동합니다"
          >
            <MaterialCommunityIcons 
              name="cog" 
              size={SIZES.iconLarge} 
              color={COLORS.primary} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonContainer}>
          <LargeButton
            title="오늘 날씨"
            onPress={handleTodayPress}
            backgroundColor={COLORS.primary}
            accessibilityLabel="오늘 날씨"
            accessibilityHint="오늘의 날씨 정보를 음성으로 들을 수 있습니다"
          />
          
          <LargeButton
            title="내일 날씨"
            onPress={handleTomorrowPress}
            backgroundColor={COLORS.secondary}
            accessibilityLabel="내일 날씨"
            accessibilityHint="내일의 날씨 정보를 음성으로 들을 수 있습니다"
          />
        </View>
        
        <Text style={styles.instruction}>
          버튼을 누르면 음성으로 안내됩니다
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SIZES.margin * 2,
    position: 'relative',
  },
  title: {
    fontFamily: 'large-font-bold',
    fontSize: SIZES.largeTitle,
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'large-font',
    fontSize: SIZES.subtitle,
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: SIZES.margin / 2,
  },
  settingsButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: SIZES.padding,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  instruction: {
    fontFamily: 'large-font',
    fontSize: SIZES.body,
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: SIZES.margin,
  },
});

export default HomeScreen;