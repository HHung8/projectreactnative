import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import "../global.css";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  useEffect(() => {
    const isAuthGroup = segments[0] === "(auth)";
    if (!isLoggedIn && !isAuthGroup) {
      router.replace("/(auth)/sign-in");
    } else if (isLoggedIn && isAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, segments])
  return <Stack screenOptions={{ headerShown: false }} />
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf')
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  // Check Token 
  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("accessToken");
      setIsLoggedIn(!!token);
    };
    checkToken();
  }, []);
  useEffect(() => {
    if (fontsLoaded && isLoggedIn !== null) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoggedIn])
  if (!fontsLoaded || isLoggedIn === null) return null;
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}