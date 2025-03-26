// Text content in Korean for Text-to-Speech
export const STRINGS = {
    APP_NAME: '기상 예보',
    
    // Button labels
    TODAY_WEATHER: '오늘 날씨',
    TOMORROW_WEATHER: '내일 날씨',
    HELP: '도움말',
    BACK: '뒤로 가기',
    CONFIRM: '확인',
    CANCEL: '취소',
    RETRY: '다시 시도',
    
    // Accessibility labels
    TODAY_WEATHER_LABEL: '오늘 날씨 확인하기',
    TOMORROW_WEATHER_LABEL: '내일 날씨 확인하기',
    HELP_LABEL: '도움말 보기',
    BACK_LABEL: '이전 화면으로 돌아가기',
    TAP_TO_REPEAT_LABEL: '날씨 정보를 다시 들으려면 화면을 탭하세요',
    
    // Weather info phrases
    CURRENT_TEMP: '현재 기온은 %s도입니다.',
    HIGH_TEMP: '최고 기온은 %s도입니다.',
    LOW_TEMP: '최저 기온은 %s도입니다.',
    FEELS_LIKE: '체감 기온은 %s도입니다.',
    WEATHER_CONDITION: '날씨는 %s입니다.',
    RAIN_PROBABILITY: '강수 확률은 %s퍼센트입니다.',
    RAIN_AMOUNT: '예상 강수량은 %s밀리미터입니다.',
    
    // Weather conditions in Korean
    WEATHER_CLEAR: '맑음',
    WEATHER_CLOUDY: '구름 많음',
    WEATHER_OVERCAST: '흐림',
    WEATHER_RAIN: '비',
    WEATHER_SNOW: '눈',
    WEATHER_THUNDERSTORM: '천둥번개',
    WEATHER_MIST: '안개',
    WEATHER_DRIZZLE: '이슬비',
    
    // Alerts and warnings
    HEAT_WAVE_ALERT: '폭염 주의보가 발령되었습니다. 실외 활동을 자제하시고 충분한 수분을 섭취하세요.',
    COLD_WAVE_ALERT: '한파 주의보가 발령되었습니다. 따뜻한 옷을 입고 외출 시 주의하세요.',
    DUST_ALERT: '미세먼지 농도가 높습니다. 마스크 착용을 권장합니다.',
    SEVERE_WEATHER_ALERT: '기상 특보가 발효 중입니다. %s',
    
    // Loading and error messages
    LOADING: '날씨 정보를 불러오는 중입니다. 잠시만 기다려주세요.',
    LOCATION_LOADING: '현재 위치를 확인하는 중입니다.',
    LOCATION_ERROR: '위치 정보를 가져올 수 없습니다. 수동으로 위치를 설정해주세요.',
    WEATHER_ERROR: '날씨 정보를 가져오는데 실패했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.',
    GENERIC_ERROR: '오류가 발생했습니다. 다시 시도해주세요.',
    OFFLINE_DATA: '오프라인 상태입니다. 마지막으로 저장된 날씨 정보를 보여드립니다.',
    
    // First launch screen
    WELCOME: '웨더포에 오신 것을 환영합니다.',
    LOCATION_PERMISSION: '정확한 날씨 정보를 위해 위치 접근 권한이 필요합니다.',
    ALLOW_LOCATION: '위치 접근 허용',
    MANUAL_LOCATION: '수동으로 위치 입력',
    SETUP_COMPLETE: '설정이 완료되었습니다. 이제 날씨 정보를 확인할 수 있습니다.',
    
    // Help screen
    HELP_TITLE: '도움말',
    HELP_INTRO: '웨더포는 날씨 음성 안내 앱입니다.',
    HELP_TODAY: '오늘 날씨 버튼을 누르면 현재 날씨 정보를 음성으로 알려드립니다.',
    HELP_TOMORROW: '내일 날씨 버튼을 누르면 내일 날씨 예보를 음성으로 알려드립니다.',
    HELP_REPEAT: '날씨 정보를 다시 들으려면 화면을 탭하세요.',
    HELP_CONTACT: '도움이 필요하면 문의주세요.',
  };
  
  // Storage keys
  export const STORAGE_KEYS = {
    HAS_LAUNCHED: 'weatherfor_has_launched',
    LOCATION: 'weatherfor_location',
    LAST_WEATHER: 'weatherfor_last_weather',
    LAST_FORECAST: 'weatherfor_last_forecast',
    LAST_UPDATED: 'weatherfor_last_updated',
    TTS_SPEED: 'weatherfor_tts_speed',
  };
  
  // API related strings
  export const API = {
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    WEATHER_ENDPOINT: '/weather',
    FORECAST_ENDPOINT: '/forecast',
    UNITS: 'metric', // Celsius for Korea
    LANGUAGE: 'kr',
  };
  
  export default STRINGS;