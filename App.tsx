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
import HomeScreen from './src/screens/HomeScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import LocationSetupScreen from './src/screens/LocationSetupScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { Text, View } from 'react-native';

// 스플래시 스크린을 앱이 준비될 때까지 보여줍니다
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialSetupComplete, setInitialSetupComplete] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // 필요한 폰트를 로드합니다
        await Font.loadAsync({
          'large-font': require('./assets/fonts/NanumSquareRoundB.ttf'),
          'large-font-bold': require('./assets/fonts/NanumSquareRoundEB.ttf'),
        });

        // 저장된 위치 정보를 확인합니다
        // const locationData = await AsyncStorage.getItem('user-location');
        // setInitialSetupComplete(!!locationData);

        // 앱 초기화 지연 (개발 중에만 사용)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // 준비 완료를 표시합니다
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

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