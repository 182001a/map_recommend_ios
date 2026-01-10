import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, User } from '../api/auth';

export default function ProfileScreen() {
  const { token, signOut } = useAuth();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      try {
        const data = await getProfile(token);
        setUserInfo(data);
      } catch (error) {
        Alert.alert("エラー", "ユーザー情報の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoCard}>
        <Text style={styles.label}>ユーザー名</Text>
        <Text style={styles.value}>{userInfo?.username}</Text>

        <Text style={styles.label}>メールアドレス</Text>
        <Text style={styles.value}>{userInfo?.email}</Text>

        <Text style={styles.label}>ユーザーID</Text>
        <Text style={styles.value}>#{userInfo?.id}</Text>
      </View>

      <View style={styles.logoutSection}>
        <Button title="ログアウト" color="red" onPress={signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  infoCard: { backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 3 },
  label: { fontSize: 14, color: '#888', marginBottom: 5 },
  value: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  logoutSection: { marginTop: 40 },
});