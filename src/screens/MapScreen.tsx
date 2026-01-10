import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; // App.tsxで定義した型をインポート

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

export default function MapScreen({ route }: Props) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);

  // 詳細画面から渡された「経路データ」を取得（ない場合は undefined）
  const courseCoordinates = route.params?.courseCoordinates;

  useEffect(() => {
    (async () => {
      // 1. 位置情報の権限をリクエスト
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('権限エラー', '位置情報の利用を許可してください');
        setLoading(false);
        return;
      }

      // 2. 現在地を取得
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setLoading(false);
    })();
  }, []);

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
        provider={PROVIDER_DEFAULT}
        showsUserLocation={true}    // 現在地を青いドットで表示
        followsUserLocation={true}  // ユーザーの移動に合わせてカメラを追従
        initialRegion={{
          // 経路がある場合はそのスタート地点、なければ現在地を表示
          latitude: courseCoordinates ? courseCoordinates[0].latitude : (location?.coords.latitude || 35.6812),
          longitude: courseCoordinates ? courseCoordinates[0].longitude : (location?.coords.longitude || 139.7671),
          latitudeDelta: 0.05, // 経路全体が見えやすいように少し広めに設定
          longitudeDelta: 0.05,
        }}
      >
        {/* 経路データが存在する場合のみ、線とピンを描画する */}
        {courseCoordinates && (
          <>
            <Polyline
              coordinates={courseCoordinates}
              strokeColor="#007AFF"
              strokeWidth={4}
            />
            {/* スタート地点のピン */}
            <Marker 
              coordinate={courseCoordinates[0]} 
              title="スタート地点" 
            />
            {/* ゴール地点のピン */}
            <Marker 
              coordinate={courseCoordinates[courseCoordinates.length - 1]} 
              title="ゴール地点" 
              pinColor="green" 
            />
          </>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});