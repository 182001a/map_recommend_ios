import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; //
import { fetchWalkingRoute } from '../api/route';
import { Coordinate } from './CourseListScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

export default function MapScreen({ route }: Props) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  // OSRMで計算された「道路に沿った正確な座標配列」を保持するステート
  const [snappedRoute, setSnappedRoute] = useState<Coordinate[] | null>(null);

  // 詳細画面から渡された経由地の座標
  const courseCoordinates = route.params?.courseCoordinates;

  useEffect(() => {
    (async () => {
      // 1. 位置情報の権限をリクエスト
      const { status } = await Location.requestForegroundPermissionsAsync(); //
      if (status !== 'granted') {
        Alert.alert('権限エラー', '位置情報の利用を許可してください'); //
        setLoading(false);
        return;
      }

      // 2. 現在地を取得
      const currentLocation = await Location.getCurrentPositionAsync({}); //
      setLocation(currentLocation);

      // 3. コースデータ（経由地）がある場合、OSRM APIで正確なルートを計算
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT} //
        showsUserLocation={true}    //
        followsUserLocation={true}  //
        initialRegion={{
          // 経路がある場合は開始地点、なければ現在地を表示
          latitude: courseCoordinates ? courseCoordinates[0].latitude : (location?.coords.latitude || 35.6812), //
          longitude: courseCoordinates ? courseCoordinates[0].longitude : (location?.coords.longitude || 139.7671), //
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* 道路に沿った計算済みの経路を表示 */}
        {snappedRoute && (
          <Polyline
            coordinates={snappedRoute}
            strokeColor="#007AFF"
            strokeWidth={5}
          />
        )}

        {/* 元の経由地点（品川駅、恵比寿駅など）にピンを立てる */}
        {courseCoordinates?.map((p, i) => (
          <Marker
            key={i}
            coordinate={p}
            title={i === 0 ? "スタート" : i === courseCoordinates.length - 1 ? "ゴール" : `経由地 ${i}`}
            pinColor={i === courseCoordinates.length - 1 ? "green" : "red"}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, //
  map: { flex: 1 }, //
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }, //
});