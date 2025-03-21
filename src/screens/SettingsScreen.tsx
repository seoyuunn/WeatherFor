import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { COLORS, SIZES } from '../constants';
import { useSettings } from '../hooks/useSettings';
import { useLocation } from '../hooks/useLocation';
import useSpeech from '../hooks/useSpeech';
import { useHaptics } from '../hooks/useHaptics';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Settings'
>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { settings, updateSettings } = useSettings();
  const { locationName, requestLocationPermission } = useLocation();
  const { speak, stop } = useSpeech();
  const { impactFeedback } = useHaptics();

  // 화면 접근시 음성 안내
  useEffect(() => {
    const introMessage = '설정 화면입니다. 음성 속도, 진동 기능 등을 조절할 수 있습니다.';
    const timer = setTimeout(() => {
      speak(introMessage);
    }, 500);
    
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, []);

  // 뒤로 가기
  const handleBack = () => {
    impactFeedback();
    navigation.goBack();
  };

  // 음성 테스트
  const handleTestSpeech = () => {
    impactFeedback();
    speak('현재 설정된 음성 속도로 테스트하고 있습니다. 이 속도가 듣기 편하신가요?');
  };

  // 위치 정보 업데이트
  const handleUpdateLocation = async () => {
    impactFeedback();
    speak('위치 정보를 업데이트합니다.');
    
    const success = await requestLocationPermission();
    
    if (success) {
      speak('위치 정보가 업데이트되었습니다.');
    } else {
      speak('위치 정보 업데이트에 실패했습니다. 권한을 확인해주세요.');
    }
  };

  // 앱 정보 표시
  const handleShowAbout = () => {
    impactFeedback();
    
    Alert.alert(
      'WeatherFor 앱 정보',
      '버전: 1.0.0\n개발자: WeatherFor 팀\n\n시력이 약한 노인을 위해 설계된 직관적이고 단순한 음성 날씨 안내 서비스입니다.',
      [{ text: '확인', style: 'default' }]
    );
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
        
        <Text style={styles.headerTitle}>설정</Text>
        
        <View style={{ width: 28 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>음성 설정</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>음성 속도</Text>
            <View style={styles.sliderContainer}>
              <Ionicons name="volume-low" size={24} color={COLORS.secondary} />
              <Slider
                style={styles.slider}
                minimumValue={0.5}
                maximumValue={1.0}
                step={0.1}
                value={settings.speechRate}
                minimumTrackTintColor={COLORS.primary}
                maximumTrackTintColor={COLORS.secondary + '40'}
                thumbTintColor={COLORS.primary}
                onValueChange={(value) => updateSettings({ speechRate: value })}
                accessibilityLabel="음성 속도 조절"
                accessibilityHint="슬라이더를 왼쪽으로 움직이면 느려지고, 오른쪽으로 움직이면 빨라집니다."
              />
              <Ionicons name="volume-high" size={24} color={COLORS.secondary} />
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleTestSpeech}
            accessibilityLabel="음성 테스트"
            accessibilityHint="현재 설정된 음성 속도로 테스트합니다"
          >
            <Ionicons name="play-circle-outline" size={24} color={COLORS.primary} />
            <Text style={styles.testButtonText}>음성 테스트</Text>
          </TouchableOpacity>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>날씨 화면 진입 시 자동 음성 안내</Text>
            <Switch
              trackColor={{ false: COLORS.secondary + '40', true: COLORS.primary + '70' }}
              thumbColor={settings.autoReadWeather ? COLORS.primary : COLORS.secondary}
              onValueChange={(value) => updateSettings({ autoReadWeather: value })}
              value={settings.autoReadWeather}
              accessibilityLabel="자동 음성 안내 설정"
              accessibilityHint="켜면 날씨 화면에 진입할 때 자동으로 음성 안내를 제공합니다"
            />
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>접근성 설정</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>진동 피드백 사용</Text>
            <Switch
              trackColor={{ false: COLORS.secondary + '40', true: COLORS.primary + '70' }}
              thumbColor={settings.useHaptics ? COLORS.primary : COLORS.secondary}
              onValueChange={(value) => updateSettings({ useHaptics: value })}
              value={settings.useHaptics}
              accessibilityLabel="진동 피드백 설정"
              accessibilityHint="켜면 버튼을 누를 때 진동 피드백을 제공합니다"
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>글자 크기</Text>
            <View style={styles.fontSizeContainer}>
              <TouchableOpacity
                style={[
                  styles.fontSizeButton,
                  settings.fontSize === 'normal' && styles.selectedFontSizeButton
                ]}
                onPress={() => updateSettings({ fontSize: 'normal' })}
                accessibilityLabel="보통 글자 크기"
              >
                <Text style={[
                  styles.fontSizeButtonText,
                  settings.fontSize === 'normal' && styles.selectedFontSizeButtonText
                ]}>
                  보통
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.fontSizeButton,
                  settings.fontSize === 'large' && styles.selectedFontSizeButton
                ]}
                onPress={() => updateSettings({ fontSize: 'large' })}
                accessibilityLabel="큰 글자 크기"
              >
                <Text style={[
                  styles.fontSizeButtonText,
                  settings.fontSize === 'large' && styles.selectedFontSizeButtonText
                ]}>
                  크게
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.fontSizeButton,
                  settings.fontSize === 'extraLarge' && styles.selectedFontSizeButton
                ]}
                onPress={() => updateSettings({ fontSize: 'extraLarge' })}
                accessibilityLabel="매우 큰 글자 크기"
              >
                <Text style={[
                  styles.fontSizeButtonText,
                  settings.fontSize === 'extraLarge' && styles.selectedFontSizeButtonText
                ]}>
                  아주 크게
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>위치 설정</Text>
          
          <View style={styles.locationInfo}>
            <Ionicons name="location" size={24} color={COLORS.secondary} />
            <Text style={styles.locationText}>
              {locationName ? `현재 위치: ${locationName}` : '위치 정보 없음'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.updateLocationButton}
            onPress={handleUpdateLocation}
            accessibilityLabel="위치 업데이트"
            accessibilityHint="현재 위치 정보를 다시 가져옵니다"
          >
            <Ionicons name="refresh" size={24} color={COLORS.background} />
            <Text style={styles.updateLocationButtonText}>위치 업데이트</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.aboutButton}
          onPress={handleShowAbout}
          accessibilityLabel="앱 정보"
          accessibilityHint="WeatherFor 앱에 대한 정보를 확인합니다"
        >
          <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
          <Text style={styles.aboutButtonText}>앱 정보</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary + '30', // 30% 투명도
  },
  sectionTitle: {
    fontFamily: 'large-font-bold',
    fontSize: SIZES.subtitle,
    color: COLORS.primary,
    marginBottom: SIZES.margin,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
  },
  settingLabel: {
    fontFamily: 'large-font',
    fontSize: SIZES.body,
    color: COLORS.text,
    flex: 1,
    marginRight: SIZES.margin,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: SIZES.margin / 2,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginVertical: SIZES.margin,
  },
  testButtonText: {
    fontFamily: 'large-font',
    fontSize: SIZES.body,
    color: COLORS.primary,
    marginLeft: SIZES.margin,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  fontSizeButton: {
    flex: 1,
    padding: SIZES.padding / 2,
    borderWidth: 1,
    borderColor: COLORS.secondary + '50',
    borderRadius: SIZES.radius,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  selectedFontSizeButton: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  fontSizeButtonText: {
    fontFamily: 'large-font',
    fontSize: SIZES.small,
    color: COLORS.text,
  },
  selectedFontSizeButtonText: {
    color: COLORS.primary,
    fontFamily: 'large-font-bold',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.background + '80',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.secondary + '30',
  },
  locationText: {
    fontFamily: 'large-font',
    fontSize: SIZES.body,
    color: COLORS.text,
    marginLeft: SIZES.margin,
    flex: 1,
  },
  updateLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginTop: SIZES.margin,
  },
  updateLocationButtonText: {
    fontFamily: 'large-font-bold',
    fontSize: SIZES.body,
    color: COLORS.background,
    marginLeft: SIZES.margin,
  },
  aboutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding * 2,
    marginVertical: SIZES.margin,
  },
  aboutButtonText: {
    fontFamily: 'large-font',
    fontSize: SIZES.body,
    color: COLORS.primary,
    marginLeft: SIZES.margin,
  },
});

export default SettingsScreen;