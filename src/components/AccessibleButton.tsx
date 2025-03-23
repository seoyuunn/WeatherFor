import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  AccessibilityState,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { useHaptic } from '../hooks/useHaptic';

interface AccessibleButtonProps {
  onPress: () => void;
  title: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isSecondary?: boolean;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  onPress,
  title,
  accessibilityLabel,
  style,
  textStyle,
  isSecondary = false,
}) => {
  const { triggerHaptic } = useHaptic();
  
  const handlePress = () => {
    // Trigger haptic feedback for user confirmation
    triggerHaptic();
    
    // Call the provided onPress handler
    onPress();
  };

  // Dynamic styles based on primary/secondary button
  const buttonStyle = isSecondary
    ? [styles.button, styles.secondaryButton, style]
    : [styles.button, styles.primaryButton, style];
    
  const buttonTextStyle = isSecondary
    ? [styles.buttonText, styles.secondaryButtonText, textStyle]
    : [styles.buttonText, styles.primaryButtonText, textStyle];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: false } as AccessibilityState}
    >
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    padding: 20,
    minHeight: 130,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
    // Add shadow for clarity (Android)
    elevation: 5,
    // Add shadow for clarity (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonText: {
    ...fonts.style.button,
    textAlign: 'center',
  },
  primaryButtonText: {
    color: colors.buttonText,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
});

export default AccessibleButton;