import { useAuth } from "@/context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "http://192.168.3.66:5278";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {login} = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "accept": "*/*"},
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log(`Login response:`, data);
      if(!res.ok) throw new Error(data.message || "Đăng nhập thất bại");
      await login(data);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "center", padding: 24 }}
        >
          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View style={{
              width: 64, height: 64, borderRadius: 32,
              backgroundColor: "#e94560", alignItems: "center",
              justifyContent: "center", marginBottom: 16,
            }}>
              <Text style={{ fontSize: 28 }}>💳</Text>
            </View>
            <Text style={{ color: "#fff", fontSize: 24, fontFamily: "sans-bold" }}>
              Welcome back
            </Text>
            <Text style={{ color: "#8892b0", fontSize: 14, marginTop: 4, fontFamily: "sans-regular" }}>
              Sign in to your account
            </Text>
          </View>

          {/* Form */}
          <View style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: 20, padding: 24,
            borderWidth: 0.5, borderColor: "rgba(255,255,255,0.1)",
          }}>
            <Text style={labelStyle}>Email</Text>
            <TextInput
              style={inputStyle}
              placeholder="you@example.com"
              placeholderTextColor="#8892b0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={labelStyle}>Password</Text>
            <TextInput
              style={inputStyle}
              placeholder="••••••••"
              placeholderTextColor="#8892b0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 20 }}>
              <Text style={{ color: "#e94560", fontSize: 13, fontFamily: "sans-regular" }}>
                Forgot password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSignIn}
              disabled={loading}
              style={{
                backgroundColor: "#e94560", borderRadius: 12,
                padding: 16, alignItems: "center",
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
            <Text style={{ color: "#8892b0", fontFamily: "sans-regular" }}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
              <Text style={{ color: "#e94560", fontFamily: "sans-semibold" }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const labelStyle = {
  color: "#8892b0", fontSize: 13,
  fontFamily: "sans-medium", marginBottom: 8,
};

const inputStyle = {
  backgroundColor: "rgba(255,255,255,0.07)",
  borderWidth: 0.5, borderColor: "rgba(255,255,255,0.15)",
  borderRadius: 10, padding: 14,
  color: "#ccd6f6", fontSize: 15,
  fontFamily: "sans-regular", marginBottom: 16,
};