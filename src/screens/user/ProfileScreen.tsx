/**
 * Profile Screen - Modern Editorial Edition (Assigned to: Tuấn Anh - Auth & User)
 * Bảng thông tin cá nhân và menu tính năng người dùng.
 */

import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTourism } from '../../context/TourismContext';

export const ProfileScreen: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { currentUser, isAdmin, isGuest, logout } = useAuth();
  const { navigate, favorites, notifications } = useTourism();

  const handleLogout = async () => {
    await logout();
    navigate('LOGIN');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarRow}>
          {!isGuest && !isAdmin && currentUser?.avatar ? (
            <Image
              source={{ uri: currentUser.avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.defaultAvatarIcon}>👤</Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.fullName}>
                {isGuest ? 'Khách' : currentUser?.fullName}
              </Text>
              <View
                style={[
                  styles.roleBadge,
                  isAdmin
                    ? styles.roleBadgeAdmin
                    : isGuest
                      ? styles.roleBadgeGuest
                      : styles.roleBadgeUser,
                ]}
              >
                <Text
                  style={[
                    styles.roleBadgeText,
                    isAdmin
                      ? styles.roleBadgeTextAdmin
                      : isGuest
                        ? styles.roleBadgeTextGuest
                        : styles.roleBadgeTextUser,
                  ]}
                >
                  {isAdmin ? 'ADMIN' : isGuest ? 'GUEST' : 'MEMBER'}
                </Text>
              </View>
            </View>
            {isGuest ? (
              <Text style={styles.guestSubText}>
                Chưa đăng nhập tài khoản
              </Text>
            ) : (
              <>
                <Text style={styles.usernameText}>@{currentUser?.username}</Text>
                <Text style={styles.contactText}>✉ {currentUser?.email}</Text>
                <Text style={styles.contactText}>📞 {currentUser?.phone}</Text>
              </>
            )}
          </View>
        </View>

        {!isGuest ? (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigate('EDIT_PROFILE')}
            activeOpacity={0.7}
          >
            <Text style={styles.editBtnText}>✏️ {t('editProfile')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.editBtn, styles.loginNavBtn]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.loginNavBtnText}>🔑 Đăng nhập tài khoản</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Admin Quick Action (if admin) */}
      {isAdmin && (
        <View style={[styles.sectionCard, styles.adminCard]}>
          <View style={styles.adminHeader}>
            <Text style={styles.adminTitle}>⚙️ TRANG QUẢN TRỊ HỆ THỐNG</Text>
            <Text style={styles.adminSubtitle}>Phân hệ quản lý toàn diện dành cho Quản trị viên</Text>
          </View>
          <TouchableOpacity
            style={styles.adminEnterBtn}
            onPress={() => navigate('ADMIN_DASHBOARD')}
          >
            <Text style={styles.adminEnterText}>MỞ DASHBOARD QUẢN TRỊ →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* User Feature Menu Links */}
      <View style={styles.menuList}>
        {/* Saved Places / Favorites */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigate('FAVORITES')}
        >
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>❤️</Text>
            <Text style={styles.menuLabel}>{t('savedPlaces')}</Text>
          </View>
          <View style={styles.menuRight}>
            <Text style={styles.countBadge}>{favorites.length}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Tourist Map / Locations */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigate('LOCATION_MAP')}
        >
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>🗺️</Text>
            <Text style={styles.menuLabel}>{t('mapTitle')}</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        {/* Search History */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigate('SEARCH')}
        >
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>🕒</Text>
            <Text style={styles.menuLabel}>{t('searchHistoryTitle')}</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        {/* Notifications & Offers */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigate('NOTIFICATIONS')}
        >
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuLabel}>{t('notificationsTitle')}</Text>
          </View>
          <View style={styles.menuRight}>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            )}
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* AI Travel Assistant shortcut */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigate('CHATBOT')}
        >
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>🤖</Text>
            <Text style={styles.menuLabel}>{t('chatbotTitle')}</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        {/* Language switch */}
        <TouchableOpacity style={styles.menuItem} onPress={toggleLanguage}>
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>🌐</Text>
            <Text style={styles.menuLabel}>{t('languageSwitch')}</Text>
          </View>
          <Text style={styles.langValue}>
            {language === 'vi' ? 'Tiếng Việt 🇻🇳' : 'English 🇬🇧'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout Action */}
      <View style={styles.logoutActionContainer}>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>
            🚪 {isGuest ? 'Quay lại màn hình Đăng nhập' : t('logout')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerInfo}>
        <Text style={styles.versionText}>ĐÀ LẠT WANDER • MODERN EDITORIAL 2026</Text>
        <Text style={styles.creditText}>
          Phân công: Tuấn Anh (Auth) • Bình (Home) • Quang (Search) • Minh Anh (Review) • Việt (Admin)
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  guestAlertCard: {
    backgroundColor: colors.warningLight,
    padding: spacing.md,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.warning,
    marginBottom: spacing.md,
  },
  guestAlertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  guestAlertIcon: {
    fontSize: 14,
  },
  guestAlertTitle: {
    fontFamily: typography.fontSans,
    fontSize: 11,
    fontWeight: '800',
    color: colors.warning,
    letterSpacing: 0.5,
  },
  guestAlertDesc: {
    fontFamily: typography.fontSans,
    fontSize: 11,
    color: colors.text,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  guestLoginBtn: {
    backgroundColor: colors.warning,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 2,
  },
  guestLoginBtnText: {
    fontFamily: typography.fontSans,
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 2,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: colors.border,
  },
  defaultAvatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.cardMuted,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultAvatarIcon: {
    fontSize: 30,
    color: colors.textMuted,
  },
  guestSubText: {
    fontFamily: typography.fontSans,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  userInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  fullName: {
    fontFamily: typography.fontEditorial,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 2,
  },
  roleBadgeAdmin: {
    backgroundColor: colors.secondaryMuted,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  roleBadgeUser: {
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  roleBadgeGuest: {
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  roleBadgeText: {
    fontFamily: typography.fontMono,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  roleBadgeTextAdmin: {
    color: colors.secondary,
  },
  roleBadgeTextUser: {
    color: colors.primary,
  },
  roleBadgeTextGuest: {
    color: colors.warning,
  },
  usernameText: {
    fontFamily: typography.fontMono,
    fontSize: 11,
    color: colors.textMuted,
    marginVertical: 2,
  },
  contactText: {
    fontFamily: typography.fontSans,
    fontSize: 11,
    color: colors.textMuted,
  },
  editBtn: {
    marginTop: spacing.md,
    paddingVertical: 9,
    borderRadius: 2,
    backgroundColor: colors.cardMuted,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  editBtnText: {
    fontFamily: typography.fontSans,
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  loginNavBtn: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  loginNavBtnText: {
    fontFamily: typography.fontSans,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 2,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  adminCard: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondaryMuted,
  },
  adminHeader: {
    marginBottom: spacing.xs,
  },
  adminTitle: {
    fontFamily: typography.fontEditorial,
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 0.5,
  },
  adminSubtitle: {
    fontFamily: typography.fontSans,
    fontSize: 10,
    color: colors.textMuted,
  },
  adminEnterBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    borderRadius: 2,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  adminEnterText: {
    fontFamily: typography.fontSans,
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  menuList: {
    backgroundColor: colors.card,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuIcon: {
    fontSize: 16,
  },
  menuLabel: {
    fontFamily: typography.fontSans,
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countBadge: {
    fontFamily: typography.fontMono,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  menuArrow: {
    fontSize: 18,
    color: colors.textLight,
  },
  unreadBadge: {
    backgroundColor: colors.danger,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  unreadText: {
    fontFamily: typography.fontSans,
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  langValue: {
    fontFamily: typography.fontSans,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  logoutActionContainer: {
    marginBottom: spacing.lg,
  },
  logoutBtn: {
    backgroundColor: colors.card,
    paddingVertical: 12,
    borderRadius: 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  logoutText: {
    fontFamily: typography.fontSans,
    fontSize: 13,
    fontWeight: '700',
    color: colors.danger,
  },
  footerInfo: {
    alignItems: 'center',
    paddingBottom: spacing.xxl,
  },
  versionText: {
    fontFamily: typography.fontMono,
    fontSize: 9,
    letterSpacing: 1,
    color: colors.textMuted,
  },
  creditText: {
    fontFamily: typography.fontSans,
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2,
    textAlign: 'center',
  },
});
