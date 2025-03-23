import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import AccessibleButton from '../components/AccessibleButton';
import { RootStackParamList } from '../types/navigation';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { STRINGS, STORAGE_KEYS } from '../constants/strings';
import { useTTS } from '../hooks/useTTS';
import { useLocation } from '../hooks/useLocation';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const FirstLaunchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const { speak, stopSpeaking } = useTTS();
  const { requestLocation, setManualLocation } = useLocation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [city, setCity] = useState('서울');
  const [country, setCountry] = useState('KR');

  // Speak welcome message when screen mounts
  useEffect(() => {
    speak(STRINGS.WELCOME + ' ' + STRINGS.LOCATION_PERMISSION);
    
    return () => {
      stopSpeaking();
    };
  }, []);

  // Request location permission and get location
  const handleAllowLocation = async () => {
    setIsLoading(true);
    try {
      speak(STRINGS.LOCATION_LOADING);
      await requestLocation();
      await completeSetup();
    } catch (error) {
      console.error('Error getting location:', error);
      speak(STRINGS.LOCATION_ERROR);
      setShowManualInput(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Show manual location input
  const handleManualLocation = () => {
    setShowManualInput(true);
    stopSpeaking();
    speak(STRINGS.MANUAL_LOCATION);
  };

  // Submit manual location
  const handleSubmitManualLocation = async () => {
    setIsLoading(true);
    try {
      await setManualLocation(city, country);
      await completeSetup();
    } catch (error) {
      console.error('Error setting manual location:', error);
      speak(STRINGS.GENERIC_ERROR);
      Alert.alert('오류', '위치 설정 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mark setup as complete and navigate to home
  const completeSetup = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_LAUNCHED, 'true');
      speak(STRINGS.SETUP_COMPLETE);
      
      // Short delay to allow speech to complete
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }, 2000);
    } catch (error) {
      console.error('Error completing setup:', error);
      Alert.alert('오류', '설정을 저장하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{STRINGS.APP_NAME}</Text>
            <Text style={styles.subtitle}>{STRINGS.WELCOME}</Text>
          </View>
          
          {!showManualInput ? (
            <View style={styles.permissionContainer}>
              <Ionicons name="location" size={80} color={colors.primary} />
              <Text style={styles.permissionText}>{STRINGS.LOCATION_PERMISSION}</Text>
              
              <View style={styles.buttonContainer}>
                <AccessibleButton
                  title={STRINGS.ALLOW_LOCATION}
                  onPress={handleAllowLocation}
                  disabled={isLoading}
                  style={styles.button}
                />
                
                <AccessibleButton
                  title={STRINGS.MANUAL_LOCATION}
                  onPress={handleManualLocation}
                  isSecondary
                  disabled={isLoading}
                  style={styles.button}
                />
              </View>
            </View>
          ) : (
            <View style={styles.manualInputContainer}>
              <Text style={styles.inputLabel}>도시</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="도시 (예: 서울)"
                placeholderTextColor={colors.textSecondary}
                accessibilityLabel="도시 입력"
              />
              
              <Text style={styles.inputLabel}>국가 코드</Text>
              <TextInput
                style={styles.input}
                value={country}
                onChangeText={setCountry}
                placeholder="국가 코드 (예: KR)"
                placeholderTextColor={colors.textSecondary}
                maxLength={2}
                accessibilityLabel="국가 코드 입력"
              />
              
              <View style={styles.buttonContainer}>
                <AccessibleButton
                  title={STRINGS.CONFIRM}
                  onPress={handleSubmitManualLocation}
                  disabled={isLoading || !city}
                  style={styles.button}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );