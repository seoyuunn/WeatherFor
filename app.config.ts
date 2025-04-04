import 'dotenv/config';

export default {
  expo: {
    name: "WeatherFor",
    slug: "weatherfor",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icons/icon.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/splash/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000"
    },
    android: {
      package: "com.weatherfor",
      adaptiveIcon: {
        foregroundImage: "./assets/icons/adaptive-icon.png",
        backgroundColor: "#000000"
      }
    },
    extra: {
      WEATHER_API_KEY: "2b7d69f740a6512620681f770a8ad5df",
      API_UNITS: "metric",
      API_LANGUAGE: "kr",
      DEFAULT_CITY: "Seongnam-si",
      DEFAULT_COUNTRY: "KR",
      eas: {
        projectId: "ecf86e13-c71d-47ec-8279-0858dd1d2130"
      }
    }
  }
}