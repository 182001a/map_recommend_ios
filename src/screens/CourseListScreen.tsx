import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

// サンプルデータの型定義
export type Course = {
  id: string;
  title: string;
  distance: string;
  description: string;
};

const SAMPLE_COURSES: Course[] = [
  { id: '1', title: '代々木公園のんびりコース', distance: '3.2km', description: '緑豊かな公園を一周する初心者向けコースです。' },
  { id: '2', title: '渋谷〜原宿ぶらり散歩', distance: '2.5km', description: '都会の景色を楽しみながら歩くオシャレなコース。' },
  { id: '3', title: '明治神宮パワースポット巡り', distance: '4.0km', description: '都会の喧騒を忘れてリフレッシュできる参道コース。' },
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