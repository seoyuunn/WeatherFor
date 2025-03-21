import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsType } from '../types/settings';

// 기본 설정 값
const DEFAULT_SETTINGS: SettingsType = {
  speechRate: 0.7,  // 느린 발화 속도
  speechPitch: 1.0,
  useHaptics: true,
  autoReadWeather: true,
  fontSize: 'large',
};

// 설정 컨텍스트 인터페이스
interface SettingsContextType {
  settings: SettingsType;
  updateSettings: (newSettings: Partial<SettingsType>) => Promise<void>;
  isLoading: boolean;
  speechRate: number;
  speechPitch: number;
}

// 컨텍스트 생성
const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: async () => {},
  isLoading: true,
  speechRate: DEFAULT_SETTINGS.speechRate,
  speechPitch: DEFAULT_SETTINGS.speechPitch,
});

// 설정 프로바이더 컴포넌트
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // 초기화: 저장된 설정 불러오기
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('user-settings');
        if (savedSettings) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
        }
      } catch (error) {
        console.error('설정을 불러오는 데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // 설정 업데이트 함수
  const updateSettings = async (newSettings: Partial<SettingsType>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem('user-settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('설정을 저장하는 데 실패했습니다:', error);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        isLoading,
        speechRate: settings.speechRate,
        speechPitch: settings.speechPitch,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// 설정 컨텍스트 훅
export const useSettings = () => useContext(SettingsContext);