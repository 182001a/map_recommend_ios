import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, TouchableOpacity, Text } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import { RootStackParamList } from '../../App';
import { fetchWalkingDistance, fetchWalkingRoute } from '../api/route';
import { Coordinate } from './CourseListScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

export default function MapScreen({ route }: Props) {
  // MapViewをプログラムから操作するための参照（Ref）
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [snappedRoute, setSnappedRoute] = useState<Coordinate[] | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [distanceLoading, setDistanceLoading] = useState(false);

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

  useEffect(() => {
    if (!courseCoordinates || selectedIndices.length !== 2) {
      setDistanceKm(null);
      setDistanceLoading(false);
      return;
    }

    let isActive = true;
    const [firstIndex, secondIndex] = selectedIndices;
    const from = courseCoordinates[firstIndex];
    const to = courseCoordinates[secondIndex];

    const loadDistance = async () => {
      setDistanceLoading(true);
      const distance = await fetchWalkingDistance(from, to);
      if (isActive) {
        setDistanceKm(distance);
        setDistanceLoading(false);
      }
    };

    loadDistance();

    return () => {
      isActive = false;
    };
  }, [courseCoordinates, selectedIndices]);

  const handleMarkerPress = (index: number) => {
    setSelectedIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((item) => item !== index);
      }
      if (prev.length >= 2) {
        return [index];
      }
      return [...prev, index];
    });
  };

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
            pinColor={selectedIndices.includes(i) ? "gold" : (i === 0 || i === courseCoordinates.length - 1 ? "red" : "blue")}
            onPress={() => handleMarkerPress(i)}
          />
        ))}
      </MapView>

      {courseCoordinates && (
        <View style={styles.distanceCard}>
          <Text style={styles.distanceLabel}>チェックポイント2点を選択</Text>
          {distanceLoading ? (
            <Text style={styles.distanceValue}>距離を計算中...</Text>
          ) : distanceKm !== null ? (
            <Text style={styles.distanceValue}>{distanceKm.toFixed(2)} km</Text>
          ) : (
            <Text style={styles.distanceValue}>-</Text>
          )}
        </View>
      )}

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
  },
  distanceCard: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  distanceLabel: {
    fontSize: 12,
    color: '#666',
  },
  distanceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginTop: 4,
  },
});
