import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { useLocation } from '../hooks/useLocation';
import useSpeech from '../hooks/useSpeech';
import { useHaptics } from '../hooks/useHaptics';
import LargeButton from '../components/LargeButton';

type RootStackParamList = {
  Home: undefined;
  LocationSetup: undefined;
};

type LocationSetupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LocationSetup'
>;

const LocationSetupScreen = () => {
  const navigation = useNavigation<LocationSetupScreenNavigationProp>();
  const { isLoading, error, requestLocationPermission, currentLocation } = useLocation();
  const { speak, stop } = useSpeech();
  const { impactFeedback, notificationFeedback } = useHaptics();
  const [setupStarted, setSetupStarted] = useState(false);

  // 첫 화면에 음성 안내
  useEffect(() => {
    const introMessage = '날씨 정보를 제공하기 위해 위치 정보가 필요합니다. 현재 위치를 사용하려면 화면의 위 버튼을, 건너뛰려면 아래 버튼을 눌러주세요.';
    const timer = setTimeout(() => {
      speak(introMessage);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, []);

  // 위치 권한 및 정보 요청 처리
  const handleGetLocation = async () => {
    impactFeedback();
    setSetupStarted(true);
    stop(); // 기존 음성 안내 중지
    
    // 위치 권한 및 정보 요청
    const success = await requestLocationPermission();
    
    if (success) {
      notificationFeedback();
      speak('위치 정보를 성공적으로 가져왔습니다. 홈 화면으로 이동합니다.');
      
      // 잠시 후 홈 화면으로 이동
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }, 2000);
    } else {
      // 실패시 오류 안내 (음성으로도 전달)
      speak('위치 정보를 가져오는 데 실패했습니다. 다시 시도하거나 건너뛰기를 선택해주세요.');
    }
  };

  // 설정 건너뛰기
  const handleSkip = () => {
    impactFeedback();
    
    // 확인 대화상자
    Alert.alert(
      '위치 설정 건너뛰기',
      '위치 정보 없이 계속하시겠습니까? 날씨 정보를 가져오려면 나중에 설정에서 위치를 설정해야 합니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '건너뛰기',
          onPress: () => {
            speak('위치 설정을 건너뛰었습니다. 홈 화면으로 이동합니다.');
            
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            }, 2000);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>위치 설정</Text>
        <Text style={styles.description}>
          날씨 정보를 제공하기 위해 위치 정보가 필요합니다.
        </Text>
        
        {isLoading && setupStarted ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>위치 정보를 가져오는 중...</Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <LargeButton
              title="현재 위치 사용하기"
              onPress={handleGetLocation}
              backgroundColor={COLORS.primary}
              accessibilityLabel="현재 위치 사용하기"
              accessibilityHint="현재 위치 정보를 가져와 날씨 데이터에 사용합니다"
              style={styles.button}
            />
            
            <LargeButton
              title="건너뛰기"
              onPress={handleSkip}
              backgroundColor={COLORS.secondary}
              textColor={COLORS.background}
              accessibilityLabel="건너뛰기"
              accessibilityHint="위치 설정을 건너뛰고 홈 화면으로 이동합니다"
              style={styles.button}
            />
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={32} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={100} color={COLORS.primary} style={styles.icon} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding * 2,
  },
  title: {
    fontFamily: 'large-font-bold',
    fontSize: SIZES.largeTitle,
    color: COLORS.primary,
    marginBottom: SIZES.margin,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'large-font',
    fontSize: SIZES.subtitle,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.margin * 3,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginVertical: SIZES.margin,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: SIZES.margin * 2,
  },
  loadingText: {
    fontFamily: 'large-font',
    fontSize: SIZES.body,
    color: COLORS.text,
    marginTop: SIZES.margin,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error + '20', // 20% 투명도
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.margin * 2,
  },
  errorText: {
    fontFamily: 'large-font',
    fontSize: SIZES.body,
    color: COLORS.error,
    marginLeft: SIZES.margin,
    flex: 1,
  },
  iconContainer: {
    position: 'absolute',
    bottom: SIZES.margin * 2,
    opacity: 0.3,
  },
  icon: {
    transform: [{ rotate: '15deg' }],
  },
});

export default LocationSetupScreen;