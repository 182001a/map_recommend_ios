import React from "react";
import { ActivityIndicator, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";
import MapScreen from "./src/screens/MapScreen";
import CourseListScreen from "./src/screens/CourseListScreen";
import CourseDetailScreen from "./src/screens/CourseDetailScreen";

// 画面一覧の型定義
export type RootStackParamList = {
  Login: undefined;
  Map: undefined; // ログイン後の地図画面
  CourseList: undefined; // コース一覧画面
  CourseDetail: { courseId: any }; // コース詳細画面
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
        <>
          <Stack.Screen 
            name="Map" 
            component={MapScreen} 
            options={({ navigation }) => ({ 
              title: "散歩マップ",
              headerRight: () => (
                <Button
                  onPress={() => navigation.navigate('CourseList')}
                  title="コース一覧"
                />
              ),
            })} 
          />
          <Stack.Screen name="CourseList" component={CourseListScreen} options={{ title: "コース一覧" }} />
          <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: "コース詳細" }} />
        </>
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