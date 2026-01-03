import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";

// 画面一覧の型定義
export type RootStackParamList = {
  Login: undefined;
  Home: undefined; // ログイン後の仮画面
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ログイン状態によって画面を出し分ける中身
function RootNavigator() {
  const { token, loading } = useAuth();

  // 起動時：端末からトークンを読み込んでいる間は「ぐるぐる」を出す
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {token == null ? (
        // 未ログイン：ログイン画面だけを見せる
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        // ログイン済み：メインの画面（ここでは一旦仮）を見せる
        <Stack.Screen
          name="Home"
          component={() => <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><View /></View>}
          options={{ title: "散歩アプリへようこそ！" }}
        />
      )}
    </Stack.Navigator>
  );
}

// アプリの最上位
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider> {/* 1. 状態を配る */}
        <NavigationContainer> {/* 2. ナビゲーションの基盤 */}
          <RootNavigator /> {/* 3. 実際の画面切り替えロジック */}
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}