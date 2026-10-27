/**
 * Profile Screen (Assigned to: Tuấn Anh - Auth & User)
 * User dashboard with account details, quick navigation, role switcher, and settings.
 */

import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTourism } from '../../context/TourismContext';

export const ProfileScreen: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { currentUser, isAdmin, logout, switchDemoUser } = useAuth();
  const { navigate, favorites, notifications } = useTourism();

  const handleLogout = () => {
    Alert.alert(t('logout'), t('logoutConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('logout'),
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigate('LOGIN');
        },
      },
    ]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Card */}
      <View style={[styles.profileCard, shadows.card]}>
        <View style={styles.avatarRow}>
          <Image
            source={{
              uri:
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.fullName}>
                {currentUser?.fullName || 'Khách Du Lịch'}
              </Text>
              <View
                style={[
                  styles.roleBadge,
                  isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeUser,
                ]}
              >
                <Text
                  style={[
                    styles.roleBadgeText,
                    isAdmin ? styles.roleBadgeTextAdmin : styles.roleBadgeTextUser,
                  ]}
                >
                  {isAdmin ? 'ADMIN' : 'MEMBER'}
                </Text>
              </View>
            </View>
            <Text style={styles.usernameText}>@{currentUser?.username || 'khach'}</Text>
            <Text style={styles.contactText}>✉ {currentUser?.email || 'N/A'}</Text>
            <Text style={styles.contactText}>📞 {currentUser?.phone || 'N/A'}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigate('EDIT_PROFILE')}
          activeOpacity={0.7}
        >
          <Text style={styles.editBtnText}>✏️ {t('editProfile')}</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Demo Switcher for Grading / Testing */}
      <View style={[styles.sectionCard, shadows.card]}>
        <Text style={styles.sectionTitle}>Chuyển đổi vai trò kiểm tra (Tuấn Anh)</Text>
        <Text style={styles.sectionSubtitle}>
          Nhấn để chuyển nhanh giữa vai trò Người Dùng thường và Quản Trị Viên (Admin).
        </Text>
        <View style={styles.switcherRow}>
          <TouchableOpacity
            style={[styles.switchBtn, !isAdmin && styles.switchBtnActive]}
            onPress={() => switchDemoUser('user')}
          >
            <Text style={[styles.switchText, !isAdmin && styles.switchTextActive]}>
              👤 Người dùng thường (Tuấn Anh)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchBtn, isAdmin && styles.switchBtnActiveAdmin]}
            onPress={() => switchDemoUser('admin')}
          >
            <Text style={[styles.switchText, isAdmin && styles.switchTextActiveAdmin]}>
              ⚙️ Admin Quản trị (Việt)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Admin Quick Action (if admin) */}
      {isAdmin && (
        <View style={[styles.sectionCard, styles.adminCard, shadows.card]}>
          <View style={styles.adminHeader}>
            <Text style={styles.adminTitle}>⚙️ {t('adminDashboard')}</Text>
            <Text style={styles.adminSubtitle}>Phân hệ quản trị (Việt)</Text>
          </View>
          <TouchableOpacity
            style={styles.adminEnterBtn}
            onPress={() => navigate('ADMIN_DASHBOARD')}
          >
            <Text style={styles.adminEnterText}>Mở Trang Quản Trị Admin →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* User Feature Menu Links */}
      <View style={[styles.menuList, shadows.card]}>
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
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>🚪 {t('logout')}</Text>
      </TouchableOpacity>

      <View style={styles.footerInfo}>
        <Text style={styles.versionText}>Đà Lạt Wander v1.0.0 • React Native</Text>
        <Text style={styles.creditText}>
          Nhóm: Tuấn Anh • Bình • Quang • Minh Anh • Việt
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
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: colors.primary,
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
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
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
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  roleBadgeTextAdmin: {
    color: colors.secondary,
  },
  roleBadgeTextUser: {
    color: colors.primary,
  },
  usernameText: {
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: '600',
    marginVertical: 2,
  },
  contactText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  editBtn: {
    marginTop: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardMuted,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  switcherRow: {
    gap: 8,
  },
  switchBtn: {
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardMuted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  switchBtnActive: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },
  switchBtnActiveAdmin: {
    backgroundColor: colors.secondaryMuted,
    borderColor: colors.secondary,
  },
  switchText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  switchTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  switchTextActiveAdmin: {
    color: colors.secondary,
    fontWeight: '700',
  },
  adminCard: {
    backgroundColor: '#FFF8F6',
    borderColor: '#FFD6CC',
  },
  adminHeader: {
    marginBottom: spacing.sm,
  },
  adminTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
  },
  adminSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
  },
  adminEnterBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  adminEnterText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  menuList: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
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
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadBadge: {
    backgroundColor: colors.danger,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  menuArrow: {
    fontSize: 18,
    color: colors.textLight,
  },
  langValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  logoutBtn: {
    height: 46,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
    marginBottom: spacing.lg,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  footerInfo: {
    alignItems: 'center',
    paddingBottom: spacing.xxl,
  },
  versionText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
  },
  creditText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
});
