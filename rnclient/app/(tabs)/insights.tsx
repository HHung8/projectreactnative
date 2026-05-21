import dayjs from 'dayjs';
import * as SecureStore from 'expo-secure-store';
import { styled } from 'nativewind';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const SafeAreaView = styled(RNSafeAreaView);
const SCREEN_WIDTH = Dimensions.get('window').width;

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Insights = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(dayjs().day() === 0 ? 6 : dayjs().day() - 1);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      const res = await fetch(`${API_URL}/api/Subscription`, {
        headers: { 'Authorization': `Bearer ${token}`, 'accept': '*/*' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSubscriptions(data);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Tính tổng chi phí monthly
  const monthlyTotal = subscriptions.reduce((sum, s) => {
    if (s.frequency === 'Monthly') return sum + s.price;
    if (s.frequency === 'Yearly') return sum + s.price / 12;
    return sum;
  }, 0);

  // Tính chi phí theo ngày trong tuần (dựa theo renewalDate)
  const dailyData = DAYS.map((_, i) => {
    const total = subscriptions
      .filter(s => {
        const renewDay = dayjs(s.renewalDate).day();
        const adjustedDay = renewDay === 0 ? 6 : renewDay - 1;
        return adjustedDay === i;
      })
      .reduce((sum, s) => sum + s.price, 0);
    return total;
  });

  const maxValue = Math.max(...dailyData, 1);

  // Subscriptions sắp tới (7 ngày)
  const upcomingSubscriptions = subscriptions
    .filter(s => {
      const renewal = dayjs(s.renewalDate);
      const now = dayjs();
      return renewal.isAfter(now) && renewal.diff(now, 'day') <= 30;
    })
    .sort((a, b) => dayjs(a.renewalDate).diff(dayjs(b.renewalDate)));

  const SERVICE_EMOJI: Record<string, string> = {
    'netflix': '🎬', 'spotify': '🎵', 'claude': '🤖',
    'chatgpt': '💬', 'github': '🐙', 'photoshop': '🎨',
    'figma': '✏️', 'notion': '📝', 'default': '📱',
  };

  const getEmoji = (name: string) => {
    const key = name.toLowerCase().replace(/\s/g, '');
    return Object.entries(SERVICE_EMOJI).find(([k]) => key.includes(k))?.[1] ?? '📱';
  };

  const CATEGORY_COLORS: Record<string, string> = {
    'Entertainment': '#FF6B6B',
    'AI Tools': '#4ECDC4',
    'Developer Tools': '#A855F7',
    'Design': '#F59E0B',
    'Productivity': '#10B981',
    'Other': '#6B7280',
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Header */}
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 20 }}>
          Monthly Insights
        </Text>

        {loading && <ActivityIndicator style={{ marginBottom: 20 }} />}

        {/* Bar Chart */}
        <View style={{
          backgroundColor: '#F5F0E8', borderRadius: 20,
          padding: 20, marginBottom: 16,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160 }}>
            {DAYS.map((day, i) => {
              const barHeight = dailyData[i] > 0 ? Math.max((dailyData[i] / maxValue) * 130, 20) : 8;
              const isSelected = i === selectedDay;
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => setSelectedDay(i)}
                  style={{ alignItems: 'center', gap: 8, flex: 1 }}
                >
                  {isSelected && dailyData[i] > 0 && (
                    <View style={{
                      backgroundColor: '#E96B3B', borderRadius: 6,
                      paddingHorizontal: 6, paddingVertical: 2,
                    }}>
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>
                        ${dailyData[i].toLocaleString()}
                      </Text>
                    </View>
                  )}
                  {isSelected && dailyData[i] === 0 && <View style={{ height: 20 }} />}
                  {!isSelected && <View style={{ height: 20 }} />}
                  <View style={{
                    width: 28, height: barHeight,
                    backgroundColor: isSelected ? '#E96B3B' : '#1a1a1a',
                    borderRadius: 6,
                  }} />
                  <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: isSelected ? '700' : '400' }}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Expenses Card */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 16,
          padding: 16, marginBottom: 24,
          shadowColor: '#000', shadowOpacity: 0.05,
          shadowRadius: 8, elevation: 2,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1a1a1a' }}>Expenses</Text>
              <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
                {dayjs().format('MMMM YYYY')}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#EF4444' }}>
                -${monthlyTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={{ fontSize: 12, color: '#10B981', marginTop: 2 }}>
                {subscriptions.length} subscriptions
              </Text>
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 }}>
          By Category
        </Text>
        <View style={{ gap: 10, marginBottom: 24 }}>
          {Object.entries(
            subscriptions.reduce((acc, s) => {
              acc[s.category] = (acc[s.category] || 0) + s.price;
              return acc;
            }, {} as Record<string, number>)
          ).map(([cat, total]) => {
            const color = CATEGORY_COLORS[cat] ?? '#6B7280';
            const percent = monthlyTotal > 0 ? ((total as number) / monthlyTotal) * 100 : 0;
            return (
              <View key={cat} style={{
                backgroundColor: '#fff', borderRadius: 12,
                padding: 14, shadowColor: '#000',
                shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: '#1a1a1a' }}>{cat}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a1a1a' }}>
                    ${(total as number).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
                <View style={{ height: 6, backgroundColor: '#F3F4F6', borderRadius: 3 }}>
                  <View style={{
                    height: 6, borderRadius: 3,
                    backgroundColor: color,
                    width: `${Math.min(percent, 100)}%`,
                  }} />
                </View>
              </View>
            );
          })}
        </View>

        {/* Upcoming */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1a1a1a' }}>Upcoming</Text>
        </View>
        <View style={{ gap: 10 }}>
          {upcomingSubscriptions.length === 0 ? (
            <Text style={{ color: '#9CA3AF', textAlign: 'center', marginTop: 8 }}>
              No upcoming renewals in 30 days
            </Text>
          ) : (
            upcomingSubscriptions.map(s => {
              const color = CATEGORY_COLORS[s.category] ?? '#6B7280';
              const daysLeft = dayjs(s.renewalDate).diff(dayjs(), 'day');
              return (
                <View key={s.id} style={{
                  backgroundColor: color + '25',
                  borderRadius: 16, padding: 16,
                  flexDirection: 'row', alignItems: 'center', gap: 12,
                }}>
                  <View style={{
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: '#fff',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 22 }}>{getEmoji(s.name)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1a1a1a' }}>{s.name}</Text>
                    <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                      {dayjs(s.renewalDate).format('MMM DD')} · {daysLeft} days left
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1a1a1a' }}>
                      ${s.price.toLocaleString()}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#9CA3AF' }}>
                      /{s.frequency === 'Monthly' ? 'mo' : 'yr'}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;