import { useAuth } from '@/context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { styled } from 'nativewind';
import { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { logout } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const name = await SecureStore.getItemAsync('fullName');
      const mail = await SecureStore.getItemAsync('email');
      setFullName(name ?? '');
      setEmail(mail ?? '');
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng xuất", style: "destructive", onPress: async () => await logout() },
    ]);
  };

  const initials = fullName
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View style={{ padding: 20, paddingBottom: 100 }}>

        {/* Header */}
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 24 }}>
          Settings
        </Text>

        {/* Profile Card */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 20,
          padding: 20, marginBottom: 24,
          flexDirection: 'row', alignItems: 'center', gap: 16,
          shadowColor: '#000', shadowOpacity: 0.06,
          shadowRadius: 8, elevation: 2,
        }}>
          <View style={{
            width: 60, height: 60, borderRadius: 30,
            backgroundColor: '#E96B3B',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>
              {initials || '?'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#1a1a1a' }}>
              {fullName || 'User'}
            </Text>
            <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
              {email || ''}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        {[
          { emoji: '🔔', label: 'Notifications', sub: 'Manage alerts' },
          { emoji: '🔒', label: 'Privacy', sub: 'Security settings' },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={{
              backgroundColor: '#fff', borderRadius: 16,
              padding: 16, marginBottom: 10,
              flexDirection: 'row', alignItems: 'center', gap: 14,
              shadowColor: '#000', shadowOpacity: 0.04,
              shadowRadius: 4, elevation: 1,
            }}
          >
            <View style={{
              width: 42, height: 42, borderRadius: 12,
              backgroundColor: '#F5F0E8',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#1a1a1a' }}>
                {item.label}
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 1 }}>
                {item.sub}
              </Text>
            </View>
            <Text style={{ color: '#D1D5DB', fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        ))}

        {/* App Version */}
        <Text style={{ textAlign: 'center', color: '#D1D5DB', fontSize: 12, marginTop: 16, marginBottom: 24 }}>
          Version 1.0.0
        </Text>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: '#FEF2F2', borderRadius: 16,
            padding: 16, alignItems: 'center',
            borderWidth: 1, borderColor: '#FECACA',
          }}
        >
          <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: '600' }}>
            🚪 Đăng xuất
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default Settings;