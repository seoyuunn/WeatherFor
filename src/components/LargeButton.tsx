import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  GestureResponderEvent,
  AccessibilityProps
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SIZES } from '../constants';

interface LargeButtonProps extends AccessibilityProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  backgroundColor?: string;
  textColor?: string;
  style?: object;
}

const LargeButton: React.FC<LargeButtonProps> = ({
  title,
  onPress,
  backgroundColor = COLORS.primary,
  textColor = COLORS.buttonText,
  style = {},
  ...accessibilityProps
}) => {
  const handlePress = (event: GestureResponderEvent) => {
    // 햅틱 피드백 제공
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress(event);
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        style
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityHint={`${title} 버튼을 눌러 정보를 들으세요`}
      {...accessibilityProps}
    >
      <Text style={[styles.text, { color: textColor }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: SIZES.buttonHeight,
    width: SIZES.buttonWidth,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZES.margin,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  text: {
    fontFamily: 'large-font-bold',
    fontSize: SIZES.title,
    textAlign: 'center',
    padding: SIZES.padding,
  }
});

export default LargeButton;