import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useSettings } from './useSettings';

export function useHaptics() {
  const { settings } = useSettings();
  const enabled = settings.useHaptics;

  // 선택 피드백 - 버튼 터치 등의 일반적인 상호작용
  const selectionFeedback = useCallback(() => {
    if (enabled) {
      Haptics.selectionAsync().catch(error => 
        console.error('Haptic feedback error:', error)
      );
    }
  }, [enabled]);

  // 임팩트 피드백 - 강도에 따라 다른 피드백 (경, 중, 강)
  const impactFeedback = useCallback((style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
    if (enabled) {
      Haptics.impactAsync(style).catch(error => 
        console.error('Haptic feedback error:', error)
      );
    }
  }, [enabled]);

  // 알림 피드백 - 성공, 경고, 오류 유형별 피드백
  const notificationFeedback = useCallback((type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success) => {
    if (enabled) {
      Haptics.notificationAsync(type).catch(error => 
        console.error('Haptic feedback error:', error)
      );
    }
  }, [enabled]);

  return {
    selectionFeedback,
    impactFeedback,
    notificationFeedback,
    isEnabled: enabled,
  };
}