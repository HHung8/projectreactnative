import CreateSubscriptionModal from "@/components/CreateSubscrptionModal";
import ListHeading from "@/components/ListHeading";
import SubScriptionCard from "@/components/SubScriptionCard";
import UpcomingSubcriptionCard from "@/components/UpcomingSubcriptionCard";
import { HOME_BALANCE, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import * as SecureStore from 'expo-secure-store';
import { styled } from "nativewind";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import "../../global.css";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const SafeAreaView = styled(RNSafeAreaView);
export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedSubscrptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

 const fetchSubscriptions = useCallback(async () => {
  setLoading(true);
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    const res = await fetch(`${API_URL}/api/Subscription`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': '*/*',
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch subscriptions.");
    setSubscriptions(data);
  } catch (error) {
    Alert.alert("Error", "Failed to fetch subscriptions. Please try again.");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const upcomingSubscriptions = subscriptions.filter((s) => {
    const renewalDate = dayjs(s.renewalDate);
    const now = dayjs();
    return renewalDate.isAfter(now) && renewalDate.diff(now, 'day') <= 7;
  })


  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={images.avatar} className="home-avatar" />
                <Text className="home-user-name">{HOME_USER.name}</Text>
              </View>
              {/* <Image source={icons.add} className="home-add-icon" /> */}
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Image source={icons.add} className="home-add-icon" />
              </TouchableOpacity>
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>
              <View className="home-blance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming Subscriptions" />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (<UpcomingSubcriptionCard {...item} />)}
                keyExtractor={(item) => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<Text className="home-empty-state">No upcoming subscriptions</Text>}
              />
            </View>
            <ListHeading title="All Subscriptionssss" />
          </>
        )}
        data={subscriptions} 
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubScriptionCard
            {...item}
            expanded={expandedSubscrptionId === item.id}
            onPress={() => setExpandedSubscriptionId((currentId) => currentId === item.id ? null : item.id)}
          />
        )}
        extraData={expandedSubscrptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text className="home-empty-state">No subscriptions found</Text>}
        contentContainerClassName="pb-30"
      />
      <CreateSubscriptionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={() => {
          setIsModalVisible(false);
          fetchSubscriptions(); // ✅ Refresh sau khi tạo mới
        }}
      />
    </SafeAreaView>
  );
}
