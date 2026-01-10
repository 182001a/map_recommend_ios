import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { SAMPLE_COURSES } from './CourseListScreen'; // データをインポート

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

export default function CourseDetailScreen({ route, navigation }: Props) {
  const { courseId } = route.params;

  // IDが一致するコースを探す（型を文字列で合わせる）
  const course = SAMPLE_COURSES.find(c => c.id === String(courseId));

  if (!course) {
    return (
      <View style={styles.center}><Text>コースが見つかりません。</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={{
            latitude: course.coordinates[0].latitude,
            longitude: course.coordinates[0].longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Polyline
            coordinates={course.coordinates}
            strokeColor="#007AFF"
            strokeWidth={4}
          />
          <Marker coordinate={course.coordinates[0]} title="スタート" />
          <Marker coordinate={course.coordinates[course.coordinates.length - 1]} title="ゴール" pinColor="green" />
        </MapView>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.distance}>総距離: {course.distance}</Text>
        <Text style={styles.description}>{course.description}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="このコースで散歩を開始する" 
          onPress={() => navigation.navigate('Map')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mapContainer: { height: 200, width: '100%' },
  map: { ...StyleSheet.absoluteFillObject },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  infoBox: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  distance: { color: '#007AFF', fontWeight: '600', marginBottom: 10 },
  description: { fontSize: 16, color: '#333', lineHeight: 24 },
  buttonContainer: { padding: 20, marginTop: 'auto', marginBottom: 30 }
});