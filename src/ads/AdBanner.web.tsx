/**
 * Banner cho bản web: quảng cáo GPT (ad unit demo của Google),
 * không tải được thì hiển thị khung giả lập.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GptSlot } from './GptSlot.web';
import { WEB_BANNER_SIZES, WEB_BANNER_UNIT } from './adConfig';

const Placeholder: React.FC = () => (
  <View style={styles.placeholder}>
    <Text style={styles.badge}>Ad</Text>
    <Text style={styles.text}>Test Banner Ad (320x50)</Text>
  </View>
);

export const AdBanner: React.FC = () => (
  <View style={styles.container} testID="banner-ad">
    <GptSlot
      unitPath={WEB_BANNER_UNIT}
      sizes={WEB_BANNER_SIZES}
      fallback={<Placeholder />}
      testID="banner-ad-gpt"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  placeholder: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    color: '#fff',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 5,
    borderRadius: 3,
    fontSize: 11,
    fontWeight: '800',
    marginRight: 8,
    overflow: 'hidden',
  },
  text: { color: '#374151', fontSize: 13, fontWeight: '600' },
});
