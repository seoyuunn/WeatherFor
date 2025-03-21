import { useState, useEffect, useCallback } from 'react';
import * as Speech from 'expo-speech';
import { useSettings } from './useSettings';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState<string>('');
  const { speechRate, speechPitch } = useSettings();

  // 음성 출력이 완료되면 상태 업데이트
  useEffect(() => {
    const subscription = Speech.addSpeechEndListener(() => {
      setIsSpeaking(false);
    });

    return () => {
      Speech.removeSpeakingListener(subscription);
    };
  }, []);

  // 텍스트를 음성으로 출력하는 함수
  const speak = useCallback(
    async (text: string, options: Speech.SpeechOptions = {}) => {
      try {
        // 이미 음성 출력 중이면 중지
        if (isSpeaking) {
          await Speech.stop();
        }

        setLastSpokenText(text);
        setIsSpeaking(true);

        // 사용자 설정을 반영한 옵션
        const defaultOptions: Speech.SpeechOptions = {
          language: 'ko-KR',
          pitch: speechPitch,
          rate: speechRate,
          ...options
        };

        await Speech.speak(text, {
          ...defaultOptions,
          onDone: () => setIsSpeaking(false),
          onError: (error) => {
            console.error('Speech error:', error);
            setIsSpeaking(false);
          }
        });
      } catch (error) {
        console.error('Speech error:', error);
        setIsSpeaking(false);
      }
    },
    [isSpeaking, speechRate, speechPitch]
  );

  // 현재 음성 출력을 중지
  const stop = useCallback(async () => {
    if (isSpeaking) {
      await Speech.stop();
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  // 마지막으로 출력한 텍스트를 다시 출력
  const repeatLast = useCallback(() => {
    if (lastSpokenText) {
      speak(lastSpokenText);
    }
  }, [lastSpokenText, speak]);

  return {
    speak,
    stop,
    repeatLast,
    isSpeaking,
    lastSpokenText
  };
}

export default useSpeech;