import { formatCurrency, formatStatusLabel, formatSubscriptionDateTime } from '@/lib/utils';
import clsx from 'clsx';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

// Map tên service → emoji + màu
const SERVICE_ICONS: Record<string, { emoji: string; color: string }> = {
  'netflix': { emoji: '🎬', color: '#E50914' },
  'spotify': { emoji: '🎵', color: '#1DB954' },
  'youtube': { emoji: '▶️', color: '#FF0000' },
  'claude': { emoji: '🤖', color: '#E96B3B' },
  'chatgpt': { emoji: '💬', color: '#10A37F' },
  'openai': { emoji: '🧠', color: '#10A37F' },
  'github': { emoji: '🐙', color: '#333333' },
  'photoshop': { emoji: '🎨', color: '#31A8FF' },
  'figma': { emoji: '✏️', color: '#F24E1E' },
  'notion': { emoji: '📝', color: '#000000' },
  'slack': { emoji: '💼', color: '#4A154B' },
  'zoom': { emoji: '📹', color: '#2D8CFF' },
  'dropbox': { emoji: '📦', color: '#0061FF' },
  'apple': { emoji: '🍎', color: '#555555' },
  'google': { emoji: '🔍', color: '#4285F4' },
  'microsoft': { emoji: '🪟', color: '#00A4EF' },
  'adobe': { emoji: '🅰️', color: '#FF0000' },
  'default': { emoji: '📱', color: '#888888' },
};

const getServiceIcon = (name: string) => {
  const key = name.toLowerCase().replace(/\s/g, '');
  const match = Object.entries(SERVICE_ICONS).find(([k]) => key.includes(k));
  return match ? match[1] : SERVICE_ICONS['default'];
};

const SubScriptionCard = ({ 
  name, price, billing, currency, color, status, 
  category, plan, expanded, renewalDate, onPress, 
  paymentMethod, startDate, frequency
}: SubscriptionCardProps) => {
  const { emoji, color: iconColor } = getServiceIcon(name);

  return (
    <Pressable 
      onPress={onPress} 
      className={clsx('sub-card', expanded ? 'sub-card-expanded' : 'bg-card')} 
      style={!expanded && color ? { backgroundColor: color } : undefined}
    >
      <View className="sub-head">
        <View className='sub-main'>
          {/* ✅ Thay Image bằng emoji */}
          <View style={{
            width: 44, height: 44, borderRadius: 12,
            backgroundColor: iconColor + '20',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 22 }}>{emoji}</Text>
          </View>

          <View className='sub-copy'>
            <Text numberOfLines={1} className='sub-title'>{name}</Text>
            <Text numberOfLines={1} ellipsizeMode='tail' className='sub-meta'>
              {category?.trim() || plan?.trim() || (renewalDate ? formatSubscriptionDateTime(renewalDate) : 'No details')}
            </Text>
          </View>
        </View>

        <View className='sub-price-box'>
          <Text className='sub-price'>{formatCurrency(price, currency)}</Text>
          <Text className='sub-billing'>{billing ?? frequency}</Text>
        </View>
      </View>

      {expanded && (
        <View className='sub-bdy'>
          <View className='sub-details'>
            {paymentMethod && (
              <View className='sub-row'>
                <View className='sub-row-copy'>
                  <Text className='sub-label'>Payment:</Text>
                  <Text className='sub-value' numberOfLines={1}>{paymentMethod?.trim()}</Text>
                </View>
              </View>
            )}
            <View className='sub-row'>
              <View className='sub-row-copy'>
                <Text className='sub-label'>Category:</Text>
                <Text className='sub-value' numberOfLines={1}>{category?.trim() || plan?.trim()}</Text>
              </View>
            </View>
            <View className='sub-row'>
              <View className='sub-row-copy'>
                <Text className='sub-label'>Started:</Text>
                <Text className='sub-value' numberOfLines={1}>
                  {startDate ? formatSubscriptionDateTime(startDate) : 'N/A'}
                </Text>
              </View>
            </View>
            <View className='sub-row'>
              <View className='sub-row-copy'>
                <Text className='sub-label'>Renewal date:</Text>
                <Text className='sub-value' numberOfLines={1}>
                  {renewalDate ? formatSubscriptionDateTime(renewalDate) : 'N/A'}
                </Text>
              </View>
            </View>
            <View className='sub-row'>
              <View className='sub-row-copy'>
                <Text className='sub-label'>Status:</Text>
                <Text className='sub-value' numberOfLines={1}>
                  {status ? formatStatusLabel(status) : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

export default SubScriptionCard