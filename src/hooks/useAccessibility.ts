import { useState, useEffect } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/strings';

interface AccessibilityOptions {
  // TTS speed setting (0.5 to 1.5)
  ttsSpeed: number;
}

export const useAccessibility = () => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState<boolean>(false);
  const [options, setOptions] = useState<AccessibilityOptions>({
    ttsSpeed: 0.8, // Default slower speed for seniors
  });

  // Check if screen reader is enabled
  useEffect(() => {
    const checkScreenReader = async () => {
      const screenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(screenReaderEnabled);
    };

    // Initial check
    checkScreenReader();

    // Listen for accessibility changes
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      screenReaderEnabled => {
        setIsScreenReaderEnabled(screenReaderEnabled);
      }
    );

    // Cleanup
    return () => {
      subscription.remove();
    };
  }, []);

  // Load saved accessibility settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTtsSpeed = await AsyncStorage.getItem(STORAGE_KEYS.TTS_SPEED);
        
        if (savedTtsSpeed !== null) {
          setOptions(prevOptions => ({
            ...prevOptions,
            ttsSpeed: parseFloat(savedTtsSpeed),
          }));
        }
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  // Update TTS speed setting
  const setTtsSpeed = async (speed: number) => {
    try {
      // Constrain to valid range
      const validSpeed = Math.max(0.5, Math.min(1.5, speed));
      
      // Update local state
      setOptions(prevOptions => ({
        ...prevOptions,
        ttsSpeed: validSpeed,
      }));
      
      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.TTS_SPEED, validSpeed.toString());
    } catch (error) {
      console.error('Error saving TTS speed setting:', error);
    }
  };

  // Announce a message using screen reader
  const announce = (message: string) => {
    if (Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(message);
    } else {
      // On Android, we use Speech directly for more reliable behavior
      Speech.speak(message, {
        rate: options.ttsSpeed,
        language: 'ko-KR',
      });
    }
  };

  return {
    isScreenReaderEnabled,
    ttsSpeed: options.ttsSpeed,
    setTtsSpeed,
    announce,
  };
};