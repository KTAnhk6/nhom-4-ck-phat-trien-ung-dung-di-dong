/**
 * Nút chatbot nổi: cục tròn góc dưới bên phải, kéo thả được (tự hít vào mép
 * trái/phải), bấm để mở chatbot, bấm dấu × để tạm tắt đến khi mở lại app.
 */

import React, { useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { shadows } from '../theme/spacing';
import { useTourism } from '../context/TourismContext';
import { Icon } from './Icon';

const SIZE = 56;
const MARGIN = 12;
const TAP_THRESHOLD = 5;

interface FloatingChatButtonProps {
  visible: boolean;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ visible }) => {
  const { navigate } = useTourism();
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);

  const pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const bounds = useRef({ w: 0, h: 0 });
  const current = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const placed = useRef(false);
  const onPressRef = useRef(() => {});
  onPressRef.current = () => navigate('CHATBOT');

  const clamp = (v: number, max: number) => Math.min(Math.max(v, MARGIN), Math.max(max, MARGIN));
  const maxX = () => bounds.current.w - SIZE - MARGIN;
  const maxY = () => bounds.current.h - SIZE - MARGIN;

  const moveTo = (x: number, y: number) => {
    current.current = { x, y };
    pos.setValue({ x, y });
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    bounds.current = { w: width, h: height };
    if (width <= SIZE + 2 * MARGIN || height <= SIZE + 2 * MARGIN) {
      return; // chưa đo xong
    }
    if (!placed.current) {
      placed.current = true;
      moveTo(maxX(), maxY());
      setReady(true);
    } else {
      moveTo(clamp(current.current.x, maxX()), clamp(current.current.y, maxY()));
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragStart.current = { ...current.current };
      },
      onPanResponderMove: (_, g) => {
        moveTo(
          clamp(dragStart.current.x + g.dx, maxX()),
          clamp(dragStart.current.y + g.dy, maxY()),
        );
      },
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) < TAP_THRESHOLD && Math.abs(g.dy) < TAP_THRESHOLD) {
          onPressRef.current();
          return;
        }
        // Hít vào mép gần nhất
        const targetX = current.current.x + SIZE / 2 < bounds.current.w / 2 ? MARGIN : maxX();
        current.current = { x: targetX, y: current.current.y };
        Animated.spring(pos, {
          toValue: current.current,
          useNativeDriver: false,
          friction: 7,
        }).start();
      },
    }),
  ).current;

  if (dismissed) {
    return null;
  }

  return (
    <View
      style={[styles.layer, (!visible || !ready) && styles.hidden]}
      pointerEvents={visible ? 'box-none' : 'none'}
      onLayout={handleLayout}
    >
      <Animated.View
        style={[styles.bubbleWrap, { transform: pos.getTranslateTransform() }]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.bubble, shadows.card]} accessibilityLabel="Chatbot" testID="chat-fab">
          <Icon name="message" size={26} color="#FFF" />
        </View>
        <TouchableOpacity
          style={styles.closeBadge}
          onPress={() => setDismissed(true)}
          activeOpacity={0.8}
          accessibilityLabel="Tạm tắt chatbot"
          testID="chat-fab-close"
        >
          <Icon name="close" size={12} color={colors.text} strokeWidth={2.6} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    zIndex: 50,
  },
  hidden: {
    opacity: 0,
  },
  bubbleWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIZE,
    height: SIZE,
  },
  bubble: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.accentGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
});
