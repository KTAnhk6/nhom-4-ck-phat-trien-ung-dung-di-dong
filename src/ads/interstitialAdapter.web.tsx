/**
 * Web adapter: AdMob SDK không chạy trên web nên giả lập interstitial
 * bằng một overlay toàn màn hình để demo/test luồng.
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GptSlot } from './GptSlot.web';
import { WEB_INTERSTITIAL_SIZES, WEB_INTERSTITIAL_UNIT } from './adConfig';

type Listener = (open: boolean) => void;

let listener: Listener | null = null;
let resolveCurrent: ((shown: boolean) => void) | null = null;

export const initAds = async () => {};

export const showInterstitial = (): Promise<boolean> => {
  if (!listener) {
    return Promise.resolve(false);
  }
  return new Promise(resolve => {
    resolveCurrent = resolve;
    listener?.(true);
  });
};

export const InterstitialHost: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    listener = setOpen;
    return () => {
      listener = null;
    };
  }, []);

  if (!open) {
    return null;
  }

  const close = () => {
    setOpen(false);
    resolveCurrent?.(true);
    resolveCurrent = null;
  };

  return (
    <View style={styles.overlay} testID="interstitial-ad">
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={close}
        accessibilityLabel="Đóng quảng cáo"
        testID="interstitial-close"
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
      <Text style={styles.badge}>Ad</Text>
      <GptSlot
        unitPath={WEB_INTERSTITIAL_UNIT}
        sizes={WEB_INTERSTITIAL_SIZES}
        testID="interstitial-ad-gpt"
        fallback={
          <View style={styles.placeholder}>
            <Text style={styles.title}>Test Interstitial Ad</Text>
            <Text style={styles.sub}>Quảng cáo xen kẽ (giả lập trên web)</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  badge: {
    color: '#111827',
    backgroundColor: '#FBBF24',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '800',
    marginBottom: 16,
    overflow: 'hidden',
  },
  placeholder: { alignItems: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  sub: { color: '#9CA3AF', marginTop: 8 },
});
