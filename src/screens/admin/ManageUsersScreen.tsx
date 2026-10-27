/**
 * Manage Users Screen (Assigned to: Việt - Admin)
 * Displays user roster, role tags, and account lock/unlock functionality.
 */

import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { useLanguage } from '../../context/LanguageContext';
import { useTourism } from '../../context/TourismContext';
import { User } from '../../types';
import { storageService } from '../../services/storageService';
import { authService } from '../../services/authService';

export const ManageUsersScreen: React.FC = () => {
  const { t } = useLanguage();
  const { goBack } = useTourism();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  const loadUsers = async () => {
    const list = await storageService.getUsers();
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleBlock = (u: User) => {
    const actionText = u.status === 'active' ? 'khóa' : 'mở khóa';
    Alert.alert(
      'Xác nhận thay đổi',
      `Bạn có chắc chắn muốn ${actionText} tài khoản "${u.username}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: async () => {
            await authService.toggleUserBlock(u.id);
            await loadUsers();
            Alert.alert('Thành công', `Đã ${actionText} tài khoản!`);
          },
        },
      ]
    );
  };

  const filtered = users.filter(
    u =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>{t('manageUsers')}</Text>
          <Text style={styles.headerSubtitle}>
            {users.length} tài khoản thành viên • Phụ trách: Việt
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm theo tên, username, email..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* User list */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isBlocked = item.status === 'blocked';
          const isAdmin = item.role === 'admin';

          return (
            <View style={[styles.userCard, shadows.card]}>
              <View style={styles.cardRow}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.fullName}>{item.fullName}</Text>
                    <View
                      style={[
                        styles.roleBadge,
                        isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeUser,
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleText,
                          isAdmin ? styles.roleTextAdmin : styles.roleTextUser,
                        ]}
                      >
                        {isAdmin ? 'ADMIN' : 'USER'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.usernameText}>@{item.username}</Text>
                  <Text style={styles.contactText}>✉ {item.email}</Text>
                  <Text style={styles.contactText}>📞 {item.phone}</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <View
                  style={[
                    styles.statusBadge,
                    isBlocked ? styles.statusBadgeBlocked : styles.statusBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isBlocked ? styles.statusTextBlocked : styles.statusTextActive,
                    ]}
                  >
                    {isBlocked ? 'ĐÃ KHÓA' : 'HOẠT ĐỘNG'}
                  </Text>
                </View>

                {/* Don't allow blocking main admin */}
                {item.username !== 'admin' && (
                  <TouchableOpacity
                    style={[
                      styles.toggleBtn,
                      isBlocked ? styles.toggleBtnUnblock : styles.toggleBtnBlock,
                    ]}
                    onPress={() => handleToggleBlock(item)}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        isBlocked ? styles.toggleTextUnblock : styles.toggleTextBlock,
                      ]}
                    >
                      {isBlocked ? 'Mở khóa' : 'Khóa tài khoản'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    height: 42,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  userCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fullName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  roleBadgeAdmin: {
    backgroundColor: colors.secondaryMuted,
  },
  roleBadgeUser: {
    backgroundColor: colors.primaryMuted,
  },
  roleText: {
    fontSize: 9,
    fontWeight: '800',
  },
  roleTextAdmin: {
    color: colors.secondary,
  },
  roleTextUser: {
    color: colors.primary,
  },
  usernameText: {
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: '600',
    marginTop: 1,
  },
  contactText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeActive: {
    backgroundColor: colors.successLight,
  },
  statusBadgeBlocked: {
    backgroundColor: colors.dangerLight,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextActive: {
    color: colors.success,
  },
  statusTextBlocked: {
    color: colors.danger,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
  },
  toggleBtnBlock: {
    backgroundColor: colors.dangerLight,
  },
  toggleBtnUnblock: {
    backgroundColor: colors.successLight,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  toggleTextBlock: {
    color: colors.danger,
  },
  toggleTextUnblock: {
    color: colors.success,
  },
});
