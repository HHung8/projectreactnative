import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "accept": "*/*" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");
      await login(data);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F0E8' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "center", padding: 24 }}
      >
        {/* Logo */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <View style={{
            width: 72, height: 72, borderRadius: 20,
            backgroundColor: '#E96B3B',
            alignItems: "center", justifyContent: "center",
            marginBottom: 16,
            shadowColor: '#E96B3B', shadowOpacity: 0.3,
            shadowRadius: 12, elevation: 6,
          }}>
            <Text style={{ fontSize: 32 }}>💳</Text>
          </View>
          <Text style={{ color: "#1a1a1a", fontSize: 26, fontFamily: "sans-bold" }}>
            Welcome back
          </Text>
          <Text style={{ color: "#9CA3AF", fontSize: 14, marginTop: 4, fontFamily: "sans-regular" }}>
            Sign in to your account
          </Text>
        </View>

        {/* Form */}
        <View style={{
          backgroundColor: "#fff",
          borderRadius: 24, padding: 24,
          shadowColor: '#000', shadowOpacity: 0.06,
          shadowRadius: 16, elevation: 4,
        }}>
          <Text style={labelStyle}>Email</Text>
          <TextInput
            style={inputStyle}
            placeholder="you@example.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={labelStyle}>Password</Text>
          <TextInput
            style={inputStyle}
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            style={{ alignSelf: "flex-end", marginBottom: 20 }}
          >
            <Text style={{ color: "#E96B3B", fontSize: 13, fontFamily: "sans-regular" }}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            style={{
              backgroundColor: "#1a1a1a", borderRadius: 14,
              padding: 16, alignItems: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={{ color: "#fff", fontSize: 16, fontFamily: "sans-semibold" }}>
                  Sign In
                </Text>
            }
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 24 }}>
          <Text style={{ color: "#9CA3AF", fontFamily: "sans-regular" }}>
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
            <Text style={{ color: "#E96B3B", fontFamily: "sans-semibold" }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const labelStyle = {
  color: "#6B7280", fontSize: 13,
  fontFamily: "sans-medium", marginBottom: 8,
};

const inputStyle = {
  backgroundColor: "#F9FAFB",
  borderWidth: 1, borderColor: "#E5E7EB",
  borderRadius: 12, padding: 14,
  color: "#1a1a1a", fontSize: 15,
  fontFamily: "sans-regular", marginBottom: 16,
};