import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, ScrollView, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "http://192.168.3.66:5278";

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSignUp = async () => {
    if(!fullName || !email || !password || !confirm) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin"); 
      return;
    };
    if(password !== confirm) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }
    if(password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "accept": "*/*"},
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || "Đăng ký thất bại");
      Alert.alert("Thafnh công", "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.", [
        { text: "Đăng nhập",
          onPress: () => router.replace("/(auth)/sign-in"),
        },
      ]); 
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Đăng ký thất bại");
    }
    setLoading(false);
  }

 return (
    <LinearGradient colors={["#1a1a2e", "#16213e", "#0f3460"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 48 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 24 }}>
              <Text style={{ color: "#8892b0", fontSize: 16 }}>← Back</Text>
            </TouchableOpacity>

            <Text style={{ color: "#fff", fontSize: 28, fontFamily: "sans-bold", marginBottom: 4 }}>
              Create account
            </Text>
            <Text style={{ color: "#8892b0", fontSize: 14, fontFamily: "sans-regular", marginBottom: 32 }}>
              Start tracking your subscriptions
            </Text>

            <View style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: 20, padding: 24,
              borderWidth: 0.5, borderColor: "rgba(255,255,255,0.1)",
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
                    placeholderTextColor="#8892b0"
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
                  backgroundColor: "#e94560", borderRadius: 12,
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

            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 16 }}>
              <Text style={{ color: "#8892b0", fontSize: 13, fontFamily: "sans-regular" }}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={{ color: "#e94560", fontSize: 13, fontFamily: "sans-semibold" }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const labelStyle = { color: "#8892b0", fontSize: 13, fontFamily: "sans-medium", marginBottom: 8 };
const inputStyle = {
  backgroundColor: "rgba(255,255,255,0.07)",
  borderWidth: 0.5, borderColor: "rgba(255,255,255,0.15)",
  borderRadius: 10, padding: 14,
  color: "#ccd6f6", fontSize: 15,
  fontFamily: "sans-regular", marginBottom: 16,
};