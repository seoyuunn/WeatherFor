const { ENV } = process.env;

export default {
  name: "WeatherFor",
  slug: "weather-for",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icons/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icons/splash.png",
    resizeMode: "contain",
    backgroundColor: "#000000"
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/your-project-id",
    enabled: true,
    checkAutomatically: "ON_LOAD"
  },
  runtimeVersion: {
    policy: "sdkVersion"
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: ENV === "production" 
      ? "com.weatherfor.app" 
      : `com.weatherfor.app.${ENV}`,
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "날씨 정보를 제공하기 위해 위치 정보가 필요합니다.",
      UIBackgroundModes: ["audio"]
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icons/adaptive-icon.png",
      backgroundColor: "#000000"
    },
    package: ENV === "production" 
      ? "com.weatherfor.app" 
      : `com.weatherfor.app.${ENV}`,
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION",
      "INTERNET"
    ],
    versionCode: 1
  },
  web: {
    favicon: "./assets/icons/favicon.png"
  },
  plugins: [
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: "날씨 정보를 제공하기 위해 위치 정보가 필요합니다."
      }
    ],
    "expo-updates"
  ],
  extra: {
    eas: {
      projectId: "your-eas-project-id"
    },
    // 환경별 설정값
    apiBaseUrl: ENV === "production"
      ? "https://api.openweathermap.org/data/2.5"
      : "https://api.openweathermap.org/data/2.5",
    environment: ENV || "development"
  }
};