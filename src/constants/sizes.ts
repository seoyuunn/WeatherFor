import { Dimensions } from 'react-native';
  
const { width, height } = Dimensions.get('window');

export const SIZES = {
  // 화면 크기
  width,
  height,
  
  // 글꼴 크기
  largeTitle: 32,   // 큰 제목
  title: 28,        // 일반 제목
  subtitle: 24,     // 부제목
  body: 20,         // 본문
  small: 16,        // 작은 텍스트
  
  // 여백 및 간격
  padding: 16,
  margin: 16,
  radius: 12,       // 모서리 둥글기
  
  // 버튼 크기
  buttonHeight: height * 0.2,  // 화면 높이의 20%
  buttonWidth: width * 0.8,    // 화면 너비의 80%
  
  // 아이콘 크기
  iconSmall: 24,
  iconMedium: 32,
  iconLarge: 48
};