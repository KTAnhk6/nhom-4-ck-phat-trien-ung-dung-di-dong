/**
 * Bottom Navigation Bar
 * 5 primary tabs: Home, Services, Search, AI Chatbot, and Profile.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useTourism } from '../context/TourismContext';
import { useAuth } from '../context/AuthContext';
import { ScreenName } from '../types';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const { currentScreen, navigate } = useTourism();
  const { isAdmin } = useAuth();

  const tabs: { screen: ScreenName; labelKey: any; icon: string }[] = [
    { screen: 'HOME', labelKey: 'navHome', icon: '🏠' },
    { screen: 'SERVICE_LIST', labelKey: 'navServices', icon: '🌲' },
    { screen: 'SEARCH', labelKey: 'navSearch', icon: '🔍' },
    { screen: 'CHATBOT', labelKey: 'navChatbot', icon: '🤖' },
    { screen: 'PROFILE', labelKey: isAdmin ? 'navAdmin' : 'navProfile', icon: isAdmin ? '⚙️' : '👤' },
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
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrapper, active && styles.activeIconWrapper]}>
              <Text style={styles.tabIcon}>{tab.icon}</Text>
            </View>
            <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>
              {t(tab.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 62,
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingBottom: 4,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    width: 32,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconWrapper: {
    backgroundColor: colors.primaryMuted,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 2,
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '800',
  },
});
