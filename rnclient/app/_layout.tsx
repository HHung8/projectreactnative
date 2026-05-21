import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import "../global.css";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // ✅ Chờ segments có giá trị thật mới xử lý
    if (!segments[0]) return;
    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";
    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
    // ✅ Nếu đã ở đúng chỗ thì không làm gì
  }, [isLoggedIn, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
  });

  const [initialLoggedIn, setInitialLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("accessToken");
      setInitialLoggedIn(!!token);
    };
    checkToken();
  }, []);

  useEffect(() => {
    if (fontsLoaded && initialLoggedIn !== null) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initialLoggedIn]);

  if (!fontsLoaded || initialLoggedIn === null) return null;

  return (
    <AuthProvider initialLoggedIn={initialLoggedIn}>
      <RootLayoutNav />
    </AuthProvider>
  );
}