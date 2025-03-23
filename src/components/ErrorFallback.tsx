import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FallbackProps } from 'react-error-boundary';
import { Ionicons } from '@expo/vector-icons';

import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { STRINGS } from '../constants/strings';
import { useTTS } from '../hooks/useTTS';
import AccessibleButton from './AccessibleButton';

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const { speak } = useTTS();
  
  // Speak error message when component mounts
  useEffect(() => {
    speak(STRINGS.GENERIC_ERROR);
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={80} color={colors.error} />
      
      <Text style={styles.errorTitle}>{STRINGS.GENERIC_ERROR}</Text>
      
      <View style={styles.buttonContainer}>
        <AccessibleButton
          title={STRINGS.RETRY}
          onPress={resetErrorBoundary}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorTitle: {
    color: colors.text,
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  button: {
    backgroundColor: colors.primary,
  },
});

export default ErrorFallback;