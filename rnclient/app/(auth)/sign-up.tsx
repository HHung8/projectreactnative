import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, ScrollView, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirm) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "accept": "*/*" },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");
      Alert.alert("Thành công 🎉", "Tài khoản đã được tạo!", [
        { text: "Đăng nhập", onPress: () => router.replace("/(auth)/sign-in") },
      ]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F0E8' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 32 }}>

          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 24 }}>
            <Text style={{ color: "#6B7280", fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>

          {/* Logo + Title */}
          <View style={{ marginBottom: 32 }}>
            <View style={{
              width: 56, height: 56, borderRadius: 16,
              backgroundColor: '#E96B3B',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 26 }}>💳</Text>
            </View>
            <Text style={{ color: "#1a1a1a", fontSize: 26, fontFamily: "sans-bold", marginBottom: 4 }}>
              Create account
            </Text>
            <Text style={{ color: "#9CA3AF", fontSize: 14, fontFamily: "sans-regular" }}>
              Start tracking your subscriptions
            </Text>
          </View>

          {/* Form */}
          <View style={{
            backgroundColor: "#fff", borderRadius: 24, padding: 24,
            shadowColor: '#000', shadowOpacity: 0.06,
            shadowRadius: 16, elevation: 4,
          }}>
            {[
              { label: "Full Name", value: fullName, setter: setFullName, placeholder: "John Doe" },
              { label: "Email", value: email, setter: setEmail, placeholder: "you@example.com", keyboard: "email-address" as const },
              { label: "Password", value: password, setter: setPassword, placeholder: "Tối thiểu 6 ký tự", secure: true },
              { label: "Confirm Password", value: confirm, setter: setConfirm, placeholder: "Nhập lại mật khẩu", secure: true },
            ].map((field) => (
              <View key={field.label}>
                <Text style={labelStyle}>{field.label}</Text>
                <TextInput
                  style={inputStyle}
                  placeholder={field.placeholder}
                  placeholderTextColor="#9CA3AF"
                  value={field.value}
                  onChangeText={field.setter}
                  secureTextEntry={field.secure}
                  keyboardType={field.keyboard}
                  autoCapitalize="none"
                />
              </View>
            ))}

            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              style={{
                backgroundColor: "#1a1a1a", borderRadius: 14,
                padding: 16, alignItems: "center", marginTop: 8,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={{ color: "#fff", fontSize: 16, fontFamily: "sans-semibold" }}>
                    Create Account
                  </Text>
              }
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
            <Text style={{ color: "#9CA3AF", fontSize: 13, fontFamily: "sans-regular" }}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ color: "#E96B3B", fontSize: 13, fontFamily: "sans-semibold" }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
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