import { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/strings';

// Default speech rate (slower for elderly users)
const DEFAULT_SPEECH_RATE = 0.8;

interface TTSOptions {
  rate?: number;
  pitch?: number;
  language?: string;
}

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(DEFAULT_SPEECH_RATE);
  
  // Load saved speech rate on component mount
  useEffect(() => {
    const loadSpeechRate = async () => {
      try {
        const savedRate = await AsyncStorage.getItem(STORAGE_KEYS.TTS_SPEED);
        if (savedRate !== null) {
          setSpeechRate(parseFloat(savedRate));
        }
      } catch (error) {
        console.error('Failed to load speech rate:', error);
      }
    };
    
    loadSpeechRate();
  }, []);
  
  // Save speech rate when it changes
  useEffect(() => {
    const saveSpeechRate = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.TTS_SPEED, speechRate.toString());
      } catch (error) {
        console.error('Failed to save speech rate:', error);
      }
    };
    
    saveSpeechRate();
  }, [speechRate]);
  
  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);
  
  // Speak text with configurable options
  const speak = async (text: string, options: TTSOptions = {}) => {
    try {
      // Stop any current speech
      await stopSpeaking();
      
      // Configure speech options with defaults
      const speechOptions = {
        rate: options.rate || speechRate,
        pitch: options.pitch || 1.0,
        language: options.language || 'ko-KR', // Korean language
      };
      
      // Start speaking
      setIsSpeaking(true);
      
      await Speech.speak(text, {
        ...speechOptions,
        onDone: () => setIsSpeaking(false),
        onError: (error) => {
          console.error('Speech error:', error);
          setIsSpeaking(false);
        },
        onStopped: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };
  
  // Stop speaking
  const stopSpeaking = async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  };
  
  // Set speech rate
  const setSpeechRateValue = (rate: number) => {
    setSpeechRate(rate);
  };
  
  // Check if TTS is available
  const checkTTSAvailability = async (): Promise<boolean> => {
    try {
      const isAvailable = await Speech.isSpeakingAsync();
      return true; // If we can check status, TTS is available
    } catch (error) {
      console.error('TTS availability check failed:', error);
      return false;
    }
  };
  
  return {
    speak,
    stopSpeaking,
    isSpeaking,
    speechRate,
    setSpeechRate: setSpeechRateValue,
    checkTTSAvailability,
  };
};