import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationData } from '../types/location';

// 위치 컨텍스트 인터페이스
interface LocationContextType {
  currentLocation: LocationData | null;
  locationName: string;
  isLoading: boolean;
  error: string | null;
  requestLocationPermission: () => Promise<boolean>;
  updateLocation: (location: LocationData) => Promise<void>;
}

// 컨텍스트 생성
const LocationContext = createContext<LocationContextType>({
  currentLocation: null,
  locationName: '',
  isLoading: true,
  error: null,
  requestLocationPermission: async () => false,
  updateLocation: async () => {},
});

// 위치 프로바이더 컴포넌트
export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 초기화: 저장된 위치 정보 불러오기
  useEffect(() => {
    const loadSavedLocation = async () => {
      try {
        const savedLocation = await AsyncStorage.getItem('user-location');
        if (savedLocation) {
          const parsedLocation = JSON.parse(savedLocation) as LocationData;
          setCurrentLocation(parsedLocation);
          setLocationName(parsedLocation.name);
        }
      } catch (err) {
        console.error('위치 정보를 불러오는 데 실패했습니다:', err);
        setError('저장된 위치 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedLocation();
  }, []);

  // 위치 권한 요청 및 현재 위치 가져오기
  const requestLocationPermission = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('위치 접근 권한이 거부되었습니다.');
        setIsLoading(false);
        return false;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // 위치 정보로부터 주소 가져오기
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      let placeName = '알 수 없는 위치';
      let fullAddress = '';

      if (addressResponse && addressResponse.length > 0) {
        const address = addressResponse[0];
        // 한국 주소 체계에 맞게 조정
        const city = address.city || address.region || '';
        const district = address.district || address.subregion || '';
        
        if (city && district) {
          placeName = `${city} ${district}`;
        } else if (city) {
          placeName = city;
        }
        
        fullAddress = [
          address.street,
          address.district,
          address.city,
          address.region,
          address.postalCode,
          address.country
        ].filter(Boolean).join(', ');
      }

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        name: placeName,
        address: fullAddress
      };

      // 위치 정보 저장 및 상태 업데이트
      await AsyncStorage.setItem('user-location', JSON.stringify(locationData));
      setCurrentLocation(locationData);
      setLocationName(placeName);
      
      return true;
    } catch (err) {
      console.error('위치 정보를 가져오는 데 실패했습니다:', err);
      setError('위치 정보를 가져오는 데 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 위치 정보 수동 업데이트
  const updateLocation = async (location: LocationData) => {
    try {
      await AsyncStorage.setItem('user-location', JSON.stringify(location));
      setCurrentLocation(location);
      setLocationName(location.name);
    } catch (err) {
      console.error('위치 정보를 저장하는 데 실패했습니다:', err);
      setError('위치 정보를 저장하는 데 실패했습니다.');
    }
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        locationName,
        isLoading,
        error,
        requestLocationPermission,
        updateLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// 위치 컨텍스트 훅
export const useLocation = () => useContext(LocationContext);