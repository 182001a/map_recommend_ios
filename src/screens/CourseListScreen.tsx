import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
// Coordinate type definition for latitude and longitude
type Coordinate = {
  latitude: number;
  longitude: number;
};

// サンプルデータの型定義
export type Course = {
  id: string;
  title: string;
  distance: string;
  description: string;
  coordinates: Coordinate[];
};

export const SAMPLE_COURSES: Course[] = [
{ 
    id: '1', 
    title: '都心縦断・山手線沿い散歩コース', 
    distance: '8.5km', 
    description: '品川から恵比寿を経て代々木公園へ向かう、都会の移り変わりを楽しむロングコースです。',
    coordinates: [
      { latitude: 35.6220, longitude: 139.7470 }, // 1: 出発点（現在地想定：天王洲付近）
      { latitude: 35.6284, longitude: 139.7387 }, // 2: 品川駅
      { latitude: 35.6335, longitude: 139.7330 }, // 高輪台付近（経由地）
      { latitude: 35.6410, longitude: 139.7210 }, // 白金台付近（経由地）
      { latitude: 35.6466, longitude: 139.7101 }, // 3: 恵比寿駅
      { latitude: 35.6585, longitude: 139.7010 }, // 渋谷駅付近（経由地）
      { latitude: 35.6716, longitude: 139.6966 }, // 4: 代々木公園（目的地）
    ]
  },
  { id: '2', title: '渋谷〜原宿ぶらり散歩', distance: '2.5km', description: '都会の景色を楽しみながら歩くオシャレなコース。', coordinates: [] },
  { id: '3', title: '明治神宮パワースポット巡り', distance: '4.0km', description: '都会の喧騒を忘れてリフレッシュできる参道コース。', coordinates: [] },
];

type Props = NativeStackScreenProps<RootStackParamList, 'CourseList'>;

export default function CourseListScreen({ navigation }: Props) {
  const renderItem = ({ item }: { item: Course }) => (
    <TouchableOpacity 
      style={styles.courseItem} 
      onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
    >
      <Text style={styles.courseTitle}>{item.title}</Text>
      <Text style={styles.courseInfo}>距離: {item.distance}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={SAMPLE_COURSES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  courseItem: { backgroundColor: '#fff', padding: 20, marginBottom: 10, borderRadius: 8, elevation: 2 },
  courseTitle: { fontSize: 18, fontWeight: 'bold' },
  courseInfo: { color: '#666', marginTop: 5 },
});