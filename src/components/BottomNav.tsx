/**
 * Bottom Navigation Bar - Modern Editorial
 * Thanh tác vụ đơn màu (Solid Monochromatic Taskbar)
 * Thiết kế tối giản đơn sắc Obsidian Noir cao cấp, thanh lịch, chuẩn tạp chí.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useLanguage } from '../context/LanguageContext';
import { useTourism } from '../context/TourismContext';
import { useAuth } from '../context/AuthContext';
import { ScreenName } from '../types';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const { currentScreen, navigate } = useTourism();
  const { isAdmin, isGuest } = useAuth();

  const getProfileLabel = () => {
    if (isAdmin) return t('navAdmin');
    if (isGuest) return 'Khách';
    return t('navProfile');
  };

  const tabs: { screen: ScreenName; label: string; icon: string }[] = [
    { screen: 'HOME', label: t('navHome'), icon: '🏠' },
    { screen: 'SERVICE_LIST', label: t('navServices'), icon: '🌲' },
    { screen: 'SEARCH', label: t('navSearch'), icon: '🔍' },
    { screen: 'CHATBOT', label: t('navChatbot'), icon: '🤖' },
    { screen: 'PROFILE', label: getProfileLabel(), icon: isAdmin ? '⚙️' : isGuest ? '👤' : '✨' },
  ];

  const isTabActive = (screen: ScreenName) => {
    if (currentScreen.name === screen) return true;
    if (screen === 'SERVICE_LIST' && currentScreen.name === 'SERVICE_DETAIL') return true;
    if (screen === 'PROFILE' && currentScreen.name.startsWith('ADMIN_')) return true;
    return false;
  };

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const active = isTabActive(tab.screen);
        return (
          <TouchableOpacity
            key={tab.screen}
            style={styles.tabItem}
            onPress={() => navigate(tab.screen)}
            activeOpacity={0.75}
          >
            <Text style={[styles.tabIcon, active && styles.activeTabIcon]}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>
              {tab.label}
            </Text>
            {active ? <View style={styles.activeDot} /> : <View style={styles.inactiveDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: colors.taskbarBg, // Thanh tác vụ đơn màu: Obsidian Noir #181818
    borderTopWidth: 1,
    borderTopColor: colors.taskbarBorder,
    paddingBottom: 2,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 16,
    opacity: 0.65,
  },
  activeTabIcon: {
    opacity: 1,
    transform: [{ scale: 1.08 }],
  },
  tabLabel: {
    fontFamily: typography.fontSans,
    fontSize: 10,
    fontWeight: '500',
    color: colors.taskbarInactive,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  activeTabLabel: {
    color: colors.taskbarActive,
    fontWeight: '700',
  },
  activeDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.taskbarActive,
    marginTop: 2,
  },
  inactiveDot: {
    width: 3,
    height: 3,
    marginTop: 2,
    backgroundColor: 'transparent',
  },
});
