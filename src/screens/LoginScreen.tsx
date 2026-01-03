import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("エラー", "ユーザー名とパスワードを入力してください");
      return;
    }
    setIsSubmitting(true);
    try {
      await signIn(username, password);
    } catch (e: any) {
      Alert.alert("ログイン失敗", e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Walking App</Text>
      
      <TextInput
        style={styles.input}
        placeholder="ユーザー名"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="パスワード"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      {isSubmitting ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="ログイン" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 30 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
});