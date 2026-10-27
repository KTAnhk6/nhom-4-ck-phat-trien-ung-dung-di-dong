/**
 * Manage Categories Screen (Assigned to: Việt - Admin)
 * CRUD operations for tourism service categories with constraint validation.
 */

import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
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
import { ServiceCategory } from '../../types';

export const ManageCategoriesScreen: React.FC = () => {
  const { t } = useLanguage();
  const { categories, addCategory, deleteCategory, goBack } = useTourism();

  const [modalVisible, setModalVisible] = useState(false);
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [icon, setIcon] = useState('📍');
  const [description, setDescription] = useState('');

  const sampleIcons = ['🏛️', '☕', '🏡', '🍲', '⛺', '🌸', '🚵', '📸'];

  const handleAddCategory = async () => {
    if (!nameVi.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục tiếng Việt');
      return;
    }

    await addCategory(
      nameVi.trim(),
      nameEn.trim() || nameVi.trim(),
      icon,
      description.trim()
    );

    setNameVi('');
    setNameEn('');
    setDescription('');
    setModalVisible(false);
    Alert.alert('Thành công', 'Đã thêm danh mục mới!');
  };

  const handleDeleteCategory = (cat: ServiceCategory) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa danh mục "${cat.nameVi}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteCategory(cat.id);
            if (!res.success) {
              Alert.alert(
                'Không thể xóa',
                `Danh mục này đang được sử dụng bởi ${res.inUseCount} dịch vụ du lịch. Vui lòng chuyển hoặc xóa các dịch vụ này trước!`
              );
            } else {
              Alert.alert('Thành công', 'Đã xóa danh mục thành công!');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>{t('manageCategories')}</Text>
          <Text style={styles.headerSubtitle}>
            {categories.length} danh mục • Phụ trách: Việt
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+ Thêm mới</Text>
        </TouchableOpacity>
      </View>

      {/* Categories List */}
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.catCard, shadows.card]}>
            <View style={styles.cardHeader}>
              <View style={styles.iconWrap}>
                <Text style={styles.catIcon}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.catNameVi}>{item.nameVi}</Text>
                <Text style={styles.catNameEn}>{item.name}</Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{item.count || 0} dịch vụ</Text>
              </View>
            </View>

            {item.description ? (
              <Text style={styles.catDesc}>{item.description}</Text>
            ) : null}

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteCategory(item)}
              >
                <Text style={styles.deleteText}>🗑️ Xóa danh mục</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, shadows.floating]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('addCategory')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Biểu tượng (Icon)</Text>
            <View style={styles.iconPickerRow}>
              {sampleIcons.map(ic => (
                <TouchableOpacity
                  key={ic}
                  style={[styles.iconChoice, icon === ic && styles.iconChoiceActive]}
                  onPress={() => setIcon(ic)}
                >
                  <Text style={{ fontSize: 18 }}>{ic}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Tên danh mục (Tiếng Việt) *</Text>
            <TextInput
              style={styles.input}
              value={nameVi}
              onChangeText={setNameVi}
              placeholder="Ví dụ: Điểm cắm trại & Glamping"
            />

            <Text style={styles.label}>Tên danh mục (English)</Text>
            <TextInput
              style={styles.input}
              value={nameEn}
              onChangeText={setNameEn}
              placeholder="E.g. Camping & Glamping"
            />

            <Text style={styles.label}>Mô tả danh mục</Text>
            <TextInput
              style={[styles.input, { height: 60 }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Giới thiệu về các dịch vụ trong danh mục..."
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddCategory}>
                <Text style={styles.saveText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.sm,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  catCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catIcon: {
    fontSize: 22,
  },
  catNameVi: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  catNameEn: {
    fontSize: 11,
    color: colors.textMuted,
  },
  countBadge: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  catDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.md,
  },
  modalCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  iconPickerRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  iconChoice: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconChoiceActive: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  input: {
    height: 42,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 13,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.lg,
  },
  cancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: colors.textMuted,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 2,
    height: 42,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: '#FFF',
    fontWeight: '700',
  },
});
