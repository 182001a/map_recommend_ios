import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, TouchableOpacity, Text } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import { RootStackParamList } from '../../App';
import { fetchWalkingRoute } from '../api/route';
import { Coordinate } from './CourseListScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

export default function MapScreen({ route }: Props) {
  // MapViewをプログラムから操作するための参照（Ref）
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [snappedRoute, setSnappedRoute] = useState<Coordinate[] | null>(null);

  const courseCoordinates = route.params?.courseCoordinates;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('権限エラー', '位置情報の利用を許可してください');
        setLoading(false);
        return;
      }

      // リアルタイムの現在地を監視（デモ用には一回の取得で十分ですが、本来はwatchPositionAsyncを使います）
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      if (courseCoordinates) {
        try {
          const realPath = await fetchWalkingRoute(courseCoordinates);
          setSnappedRoute(realPath);
        } catch (error) {
          console.error("Route calculation error:", error);
        }
      }

      setLoading(false);
    })();
  }, [courseCoordinates]);

  // 現在地にカメラを戻す関数
  const goToCurrentLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000); // 1秒かけて移動
    } else {
      Alert.alert("エラー", "現在地を取得できていません");
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef} // Refを登録
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={true}
        followsUserLocation={false} // 自動追従はオフ
        initialRegion={{
          latitude: courseCoordinates ? courseCoordinates[0].latitude : (location?.coords.latitude || 35.6812),
          longitude: courseCoordinates ? courseCoordinates[0].longitude : (location?.coords.longitude || 139.7671),
          latitudeDelta: courseCoordinates ? 0.15 : 0.01,
          longitudeDelta: courseCoordinates ? 0.15 : 0.01,
        }}
      >
        {snappedRoute && (
          <Polyline coordinates={snappedRoute} strokeColor="#007AFF" strokeWidth={5} />
        )}

        {courseCoordinates?.map((p, i) => (
          <Marker
            key={i}
            coordinate={p}
            title={i === 0 ? "スタート/ゴール" : `経由地`}
            pinColor={i === 0 || i === courseCoordinates.length - 1 ? "red" : "blue"}
          />
        ))}
      </MapView>

      {/* 現在地に戻るボタン */}
      <TouchableOpacity 
        style={styles.locationButton} 
        onPress={goToCurrentLocation}
        activeOpacity={0.7}
      >
        <MaterialIcons name="my-location" size={28} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  locationButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    // 影の設定（iOS/Android両対応）
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 24,
  }
});