import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider } from './src/context/SettingsContext';
import { LocationProvider } from './src/context/LocationContext';
import { WeatherProvider } from './src/context/WeatherContext';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import HomeScreen from './src/screens/HomeScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import LocationSetupScreen from './src/screens/LocationSetupScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 스플래시 스크린을 앱이 준비될 때까지 보여줍니다
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialSetupComplete, setInitialSetupComplete] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // 앱 초기화 및 리소스 로드
  useEffect(() => {
    async function prepare() {
      try {
        // 필요한 폰트를 로드합니다
        await Font.loadAsync({
          'large-font': require('./assets/fonts/NanumSquareRoundB.ttf'),
          'large-font-bold': require('./assets/fonts/NanumSquareRoundEB.ttf'),
        });

        // 저장된 위치 정보를 확인합니다
        const locationData = await AsyncStorage.getItem('user-location');
        setInitialSetupComplete(!!locationData);
        
        // 현재 환경 로깅
        const environment = Constants.expoConfig?.extra?.environment || 'development';
        console.log(`Running in ${environment} environment`);

        // 앱 초기화 지연 (개발 중에만 사용)
        if (environment === 'development') {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (e) {
        console.warn('앱 초기화 중 오류:', e);
      } finally {
        // 준비 완료를 표시합니다
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // OTA 업데이트 확인
  useEffect(() => {
    async function checkForUpdates() {
      try {
        const environment = Constants.expoConfig?.extra?.environment || 'development';
        
        // 프로덕션 또는 프리뷰 환경에서만 업데이트 확인
        if (environment === 'production' || environment === 'preview') {
          console.log('업데이트 확인 중...');
          const update = await Updates.checkForUpdateAsync();
          
          if (update.isAvailable) {
            console.log('새 업데이트 발견!');
            setUpdateAvailable(true);
            
            // 업데이트 다운로드
            await Updates.fetchUpdateAsync();
            
            // 선택적: 즉시 업데이트하거나 사용자에게 물어볼 수 있습니다
            Alert.alert(
              '업데이트 완료',
              '새 버전의 앱이 다운로드되었습니다. 지금 적용하시겠습니까?',
              [
                {
                  text: '나중에',
                  style: 'cancel'
                },
                {
                  text: '지금 적용',
                  onPress: async () => {
                    await Updates.reloadAsync();
                  }
                }
              ]
            );
          } else {
            console.log('사용 가능한 업데이트가 없습니다.');
          }
        }
      } catch (error) {
        console.error('업데이트 확인 중 오류:', error);
      }
    }

    if (appIsReady) {
      checkForUpdates();
    }
  }, [appIsReady]);

  useEffect(() => {
    // 앱이 준비되면 스플래시 스크린을 숨깁니다
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <LocationProvider>
          <WeatherProvider>
            <NavigationContainer>
              <StatusBar style="light" backgroundColor="#000000" />
              <Stack.Navigator
                initialRouteName={initialSetupComplete ? "Home" : "LocationSetup"}
                screenOptions={{
                  headerStyle: {
                    backgroundColor: '#000000',
                  },
                  headerTintColor: '#FFEB3B',
                  headerTitleStyle: {
                    fontFamily: 'large-font-bold',
                    fontSize: 24,
                  },
                  contentStyle: {
                    backgroundColor: '#000000',
                  },
                }}
              >
                <Stack.Screen 
                  name="LocationSetup" 
                  component={LocationSetupScreen}
                  options={{ title: '위치 설정', headerShown: false }}
                />
                <Stack.Screen 
                  name="Home" 
                  component={HomeScreen}
                  options={{ title: 'WeatherFor', headerShown: false }}
                />
                <Stack.Screen 
                  name="Weather" 
                  component={WeatherScreen}
                  options={{ title: '날씨 정보' }}
                />
                <Stack.Screen 
                  name="Settings" 
                  component={SettingsScreen}
                  options={{ title: '설정' }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </WeatherProvider>
        </LocationProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}