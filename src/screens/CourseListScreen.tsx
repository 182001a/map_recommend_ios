import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
// Coordinate type definition for latitude and longitude

export type Coordinate = {
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
    id: 'yamanote-outer', 
    title: '山手線一周・外回り（時計回り）', 
    distance: '約34.5km', 
    description: '東京駅から時計回りに全30駅を巡る、山手線完全制覇散歩コースです。',
    coordinates: [
      { latitude: 35.6813, longitude: 139.7661 }, // 東京 (JY01)
      { latitude: 35.6751, longitude: 139.7633 }, // 有楽町 (JY30)
      { latitude: 35.6655, longitude: 139.7596 }, // 新橋 (JY29)
      { latitude: 35.6556, longitude: 139.7567 }, // 浜松町 (JY28)
      { latitude: 35.6457, longitude: 139.7476 }, // 田町 (JY27)
      { latitude: 35.6355, longitude: 139.7407 }, // 高輪ゲートウェイ (JY26)
      { latitude: 35.6302, longitude: 139.7404 }, // 品川 (JY25)
      { latitude: 35.6197, longitude: 139.7286 }, // 大崎 (JY24)
      { latitude: 35.6264, longitude: 139.7234 }, // 五反田 (JY23)
      { latitude: 35.6340, longitude: 139.7158 }, // 目黒 (JY22)
      { latitude: 35.6467, longitude: 139.7101 }, // 恵比寿 (JY21)
      { latitude: 35.6585, longitude: 139.7013 }, // 渋谷 (JY20)
      { latitude: 35.6702, longitude: 139.7027 }, // 原宿 (JY19)
      { latitude: 35.6831, longitude: 139.7020 }, // 代々木 (JY18)
      { latitude: 35.6909, longitude: 139.7003 }, // 新宿 (JY17)
      { latitude: 35.7013, longitude: 139.7000 }, // 新大久保 (JY16)
      { latitude: 35.7123, longitude: 139.7038 }, // 高田馬場 (JY15)
      { latitude: 35.7212, longitude: 139.7066 }, // 目白 (JY14)
      { latitude: 35.7289, longitude: 139.7104 }, // 池袋 (JY13)
      { latitude: 35.7314, longitude: 139.7287 }, // 大塚 (JY12)
      { latitude: 35.7335, longitude: 139.7393 }, // 巣鴨 (JY11)
      { latitude: 35.7365, longitude: 139.7469 }, // 駒込 (JY10)
      { latitude: 35.7381, longitude: 139.7609 }, // 田端 (JY09)
      { latitude: 35.7321, longitude: 139.7668 }, // 西日暮里 (JY08)
      { latitude: 35.7278, longitude: 139.7710 }, // 日暮里 (JY07)
      { latitude: 35.7205, longitude: 139.7788 }, // 鶯谷 (JY06)
      { latitude: 35.7138, longitude: 139.7773 }, // 上野 (JY05)
      { latitude: 35.7074, longitude: 139.7746 }, // 御徒町 (JY04)
      { latitude: 35.6987, longitude: 139.7742 }, // 秋葉原 (JY03)
      { latitude: 35.6917, longitude: 139.7709 }, // 神田 (JY02)
      { latitude: 35.6813, longitude: 139.7661 }, // 東京 (JY01) ※ゴール
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