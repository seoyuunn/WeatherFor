export type RootStackParamList = {
    FirstLaunch: undefined;
    Home: undefined;
    Weather: {
      isToday: boolean;
    };
    Help: undefined;
  };
  
  export type WeatherScreenProps = {
    isToday: boolean;
  };