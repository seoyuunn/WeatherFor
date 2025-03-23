import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types/navigation';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { STRINGS } from '../constants/strings';
import { useTTS } from '../hooks/useTTS';
import AccessibleButton from '../components/AccessibleButton';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const HelpScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const { speak, stopSpeaking } = useTTS();
  
  // Speak help message when component mounts
  useEffect(() => {
    const helpMessage = `${STRINGS.HELP_INTRO} ${STRINGS.HELP_TODAY} ${STRINGS.HELP_TOMORROW} ${STRINGS.HELP_REPEAT}`;
    speak(helpMessage);
    
    return () => {
      stopSpeaking();
    };
  }, []);
  
  // Handle back button press
  const handleBackPress = () => {
    stopSpeaking();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel={STRINGS.BACK_LABEL}
        >
          <Ionicons name="arrow-back" size={36} color={colors.primary} />
          <Text style={styles.backText}>{STRINGS.BACK}</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>{STRINGS.HELP_TITLE}</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.helpSection}>
          <Ionicons name="information-circle" size={60} color={colors.primary} />
          <Text style={styles.helpText}>{STRINGS.HELP_INTRO}</Text>
        </View>
        
        <View style={styles.helpSection}>
          <Ionicons name="sunny" size={60} color={colors.sunny} />
          <Text style={styles.helpText}>{STRINGS.HELP_TODAY}</Text>
        </View>
        
        <View style={styles.helpSection}>
          <Ionicons name="calendar" size={60} color={colors.primary} />
          <Text style={styles.helpText}>{STRINGS.HELP_TOMORROW}</Text>
        </View>
        
        <View style={styles.helpSection}>
          <Ionicons name="volume-high" size={60} color={colors.primary} />
          <Text style={styles.helpText}>{STRINGS.HELP_REPEAT}</Text>
        </View>
        
        <View style={styles.helpSection}>
          <Ionicons name="call" size={60} color={colors.success} />
          <Text style={styles.helpText}>{STRINGS.HELP_CONTACT}</Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <AccessibleButton
          title={STRINGS.BACK}
          onPress={handleBackPress}
          style={styles.backHomeButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backText: {
    ...fonts.style.body,
    color: colors.primary,
    marginLeft: 10,
  },
  title: {
    ...fonts.style.subtitle,
    color: colors.primary,
    marginLeft: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  helpSection: {
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  helpText: {
    ...fonts.style.body,
    color: colors.text,
    textAlign: 'center',
    marginTop: 15,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.card,
  },
  backHomeButton: {
    marginVertical: 0,
  },
});

export default HelpScreen;