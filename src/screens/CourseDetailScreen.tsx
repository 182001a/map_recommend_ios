import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

export default function CourseDetailScreen({ route, navigation }: Props) {
  const { courseId } = route.params;

  // TODO: Replace this with your actual course data source
  const courses = [
    { id: 1, title: 'コース1', distance: '5km', description: '説明1' },
    { id: 2, title: 'コース2', distance: '10km', description: '説明2' },
    // 他のコースデータ
  ];

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <View style={styles.container}>
        <Text>コースが見つかりません。</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{course.title}</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>総距離:</Text>
        <Text style={styles.value}>{course.distance}</Text>
      </View>
      <Text style={styles.description}>{course.description}</Text>
      
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
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  infoBox: { flexDirection: 'row', marginBottom: 20 },
  label: { fontWeight: 'bold', marginRight: 10 },
  value: { color: '#007AFF' },
  description: { fontSize: 16, lineHeight: 24, color: '#333' },
  buttonContainer: { marginTop: 'auto', marginBottom: 30 }
});