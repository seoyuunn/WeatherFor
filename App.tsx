import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from 'react-error-boundary';
import { LocationProvider } from './src/contexts/LocationContext';
import { WeatherProvider } from './src/contexts/WeatherContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorFallback from './src/components/ErrorFallback';
import colors from './src/constants/colors';

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={colors.background} />
        <LocationProvider>
          <WeatherProvider>
            <AppNavigator />
          </WeatherProvider>
        </LocationProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}