import SubScriptionCard from '@/components/SubScriptionCard';
import * as SecureStore from 'expo-secure-store';
import { styled } from 'nativewind';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const SafeAreaView = styled(RNSafeAreaView);

const subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      // Implementation for fetching subscriptions
      const token = await SecureStore.getItemAsync("accessToken");
      const res = await fetch(`${API_URL}/api/Subscription`,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        }
      });
      const data = await res.json();
      console.log("Fetched subscriptions:", data);
      if(!res.ok) throw new Error(data.message || "Failed to fetch subscriptions.");
      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);



  const filteredSubscriptions = subscriptions.filter((subscription) =>
    subscription.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscription.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscription.plan?.toLowerCase().includes(searchQuery.toLowerCase())
  );

   return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Text className="text-xl font-bold text-black p-5">Subscriptions</Text>
            <TextInput
              className="bg-card rounded-xl px-4 py-3 text-dark mb-4"
              placeholder="Search subscriptions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {loading && <ActivityIndicator style={{ marginVertical: 12 }} />}
          </View>
        }
        renderItem={({ item }) => (
          <SubScriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <Text className="text-center text-gray-400 mt-10">No subscriptions found</Text>
          ) : null
        }
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onRefresh={fetchSubscriptions}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}

export default subscriptions
