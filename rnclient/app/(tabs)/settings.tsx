import { useAuth } from '@/context/AuthContext';
import { styled } from 'nativewind';
import React from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const {logout} = useAuth();
  const handleLogout = async() => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-white mb-6">Settings</Text>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "#e94560",
          borderRadius: 12,
          padding: 16,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          Đăng xuất
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Settings;