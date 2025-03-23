import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { STRINGS } from '../constants/strings';
import { useTTS } from '../hooks/useTTS';

interface LoadingIndicatorProps {
  customMessage?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ customMessage }) => {
  const { speak } = useTTS();
  const loadingMessage = customMessage || STRINGS.LOADING;
  
  // Speak loading message when component mounts
  useEffect(() => {
    speak(loadingMessage);
    
    // No cleanup needed - the speech will stop when the component unmounts
    // due to the cleanup in useTTS
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>{loadingMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...fonts.style.body,
    color: colors.text,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default LoadingIndicator;