import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email address.");
            return;
        }
        if(newPassword !== confirmPassword ) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }
        if(newPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/Auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "*/*",
                },
                body: JSON.stringify({ email, newPassword, confirmPassword  }),
            });
            const data = await response.json();
            if(!response.ok) throw new Error(data.message || "Failed to reset password.");
            Alert.alert("Success", "Password reset successful. Please log in with your new password.", [
                {text: "Đăng nhập ngay", onPress: () => router.replace("/(auth)/sign-in")}
            ]);
        } catch (error) {
            Alert.alert("Error", "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }       
    };
    return (
    <LinearGradient colors={["#1a1a2e", "#16213e", "#0f3460"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "center", padding: 24 }}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 24 }}>
            <Text style={{ color: "#8892b0", fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>

          <Text style={{ color: "#fff", fontSize: 28, fontFamily: "sans-bold", marginBottom: 4 }}>
            Forgot password
          </Text>
          <Text style={{ color: "#8892b0", fontSize: 14, fontFamily: "sans-regular", marginBottom: 32 }}>
            Nhập email và mật khẩu mới của bạn
          </Text>

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

            <Text style={labelStyle}>Mật khẩu mới</Text>
            <TextInput
              style={inputStyle}
              placeholder="Tối thiểu 6 ký tự"
              placeholderTextColor="#8892b0"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <Text style={labelStyle}>Xác nhận mật khẩu</Text>
            <TextInput
              style={inputStyle}
              placeholder="Nhập lại mật khẩu mới"
              placeholderTextColor="#8892b0"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity
              onPress={handleForgotPassword}
              disabled={loading}
              style={{
                backgroundColor: "#e94560", borderRadius: 12,
                padding: 16, alignItems: "center", marginTop: 8,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={{ color: "#fff", fontSize: 16, fontFamily: "sans-semibold" }}>
                    Đổi mật khẩu
                  </Text>
              }
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const labelStyle = {
    color: "#8892b0", fontSize: 13,
    fontFamily : "sans-medium", marginBottom: 8
};

const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 0.5, borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 10, padding: 14,
    color: "#ccd6f6", fontSize: 15,
    fontFamily: "sans-regular", marginBottom: 16,
}