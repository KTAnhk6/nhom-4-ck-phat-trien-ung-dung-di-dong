/**
 * App Header Component - Modern Editorial
 * Displays magazine masthead, screen titles with Times New Roman, and role status badge.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useLanguage } from '../context/LanguageContext';
import { useTourism } from '../context/TourismContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightAction,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { goBack, unreadNotificationCount, navigate } = useTourism();
  const { isAdmin, isGuest } = useAuth();

  const handleBack = onBack || goBack;

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.logoBadge}>
            <Text style={styles.logoPine}>🌲</Text>
          </View>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title || t('appName')}
          </Text>
          {!title && (
            <View style={styles.subtitleRow}>
              <Text style={styles.subtitleText}>{t('dalatScope')}</Text>
              {isAdmin ? (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>ADMIN</Text>
                </View>
              ) : isGuest ? (
                <TouchableOpacity
                  style={styles.guestBadge}
                  onPress={() => navigate('LOGIN')}
                >
                  <Text style={styles.guestBadgeText}>
                    {language === 'vi' ? 'KHÁCH' : 'GUEST'}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>
      </View>

      <View style={styles.rightRow}>
        {rightAction ? (
          rightAction
        ) : (
          <>
            {/* Language Switcher */}
            <TouchableOpacity
              style={styles.langButton}
              onPress={toggleLanguage}
              activeOpacity={0.7}
            >
              <Text style={styles.langText}>
                {language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
              </Text>
            </TouchableOpacity>

            {/* Notification Bell */}
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="header-notification-bell"
              style={styles.iconButton}
              onPress={() => navigate('NOTIFICATIONS')}
              activeOpacity={0.7}
            >
              <Text style={styles.bellIcon}>🔔</Text>
              {unreadNotificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  backIcon: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '700',
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoPine: {
    fontSize: 16,
  },
  titleContainer: {
    flex: 1,
  },
  titleText: {
    fontFamily: typography.fontEditorial, // Times New Roman
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subtitleText: {
    fontFamily: typography.fontMono,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  adminBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 3,
  },
  adminBadgeText: {
    fontFamily: typography.fontSans,
    color: '#FFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  guestBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 3,
  },
  guestBadgeText: {
    fontFamily: typography.fontSans,
    color: '#FFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    backgroundColor: colors.cardMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langText: {
    fontFamily: typography.fontSans,
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bellIcon: {
    fontSize: 15,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.danger,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontFamily: typography.fontSans,
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
