/**
 * Manage Services Screen (Assigned to: Việt - Admin)
 * CRUD operations for Dalat tourist services (Add, Edit, Delete, Filter).
 */

import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
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
import { TourismService } from '../../types';

export const ManageServicesScreen: React.FC = () => {
  const { t } = useLanguage();
  const {
    services,
    categories,
    addService,
    updateService,
    deleteService,
    goBack,
  } = useTourism();

  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<TourismService | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'CAT_ATTRACTION');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Phường 1');
  const [distanceKm, setDistanceKm] = useState('2.5');
  const [priceMin, setPriceMin] = useState('50000');
  const [priceMax, setPriceMax] = useState('100000');
  const [priceDisplay, setPriceDisplay] = useState('50.000đ - 100.000đ');
  const [openingHours, setOpeningHours] = useState('07:00 - 22:00');
  const [phone, setPhone] = useState('0988123456');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('Đà Lạt, Check-in, Cảnh đẹp');
  const [imageUrl, setImageUrl] = useState('');

  const openAddModal = () => {
    setEditingService(null);
    setName('');
    setCategoryId(categories[0]?.id || 'CAT_ATTRACTION');
    setAddress('');
    setDistrict('Phường 1');
    setDistanceKm('2.5');
    setPriceMin('50000');
    setPriceMax('100000');
    setPriceDisplay('50.000đ - 100.000đ');
    setOpeningHours('07:00 - 22:00');
    setPhone('0988123456');
    setDescription('');
    setTags('Đà Lạt, Check-in, Cảnh đẹp');
    setImageUrl('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80');
    setModalVisible(true);
  };

  const openEditModal = (service: TourismService) => {
    setEditingService(service);
    setName(service.name);
    setCategoryId(service.categoryId);
    setAddress(service.address);
    setDistrict(service.district);
    setDistanceKm(String(service.distanceKm));
    setPriceMin(String(service.priceMin));
    setPriceMax(String(service.priceMax));
    setPriceDisplay(service.priceDisplay);
    setOpeningHours(service.openingHours);
    setPhone(service.phone);
    setDescription(service.description);
    setTags(service.tags.join(', '));
    setImageUrl(service.images[0] || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !address.trim() || !description.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên, địa chỉ và mô tả dịch vụ');
      return;
    }

    const cat = categories.find(c => c.id === categoryId);
    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingService) {
      await updateService({
        ...editingService,
        name: name.trim(),
        categoryId,
        categoryName: cat?.nameVi || 'Dịch vụ',
        address: address.trim(),
        district,
        distanceKm: parseFloat(distanceKm) || 1.0,
        priceMin: parseInt(priceMin, 10) || 0,
        priceMax: parseInt(priceMax, 10) || 0,
        priceDisplay: priceDisplay.trim() || `${priceMin}đ - ${priceMax}đ`,
        openingHours: openingHours.trim(),
        phone: phone.trim(),
        description: description.trim(),
        tags: parsedTags,
        images: imageUrl ? [imageUrl] : editingService.images,
      });
      Alert.alert('Thành công', 'Đã cập nhật dịch vụ du lịch!');
    } else {
      await addService({
        name: name.trim(),
        categoryId,
        categoryName: cat?.nameVi || 'Dịch vụ',
        address: address.trim(),
        district,
        distanceKm: parseFloat(distanceKm) || 1.0,
        priceMin: parseInt(priceMin, 10) || 0,
        priceMax: parseInt(priceMax, 10) || 0,
        priceDisplay: priceDisplay.trim() || `${priceMin}đ - ${priceMax}đ`,
        openingHours: openingHours.trim(),
        phone: phone.trim(),
        description: description.trim(),
        tags: parsedTags,
        images: [
          imageUrl ||
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        ],
        latitude: 11.9405,
        longitude: 108.4382,
        isFeatured: true,
        isPopular: true,
      });
      Alert.alert('Thành công', 'Đã thêm dịch vụ du lịch mới!');
    }

    setModalVisible(false);
  };

  const handleDelete = (service: TourismService) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa dịch vụ "${service.name}" khỏi hệ thống?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await deleteService(service.id);
            Alert.alert('Thành công', 'Đã xóa dịch vụ!');
          },
        },
      ]
    );
  };

  const filtered = services.filter(
    s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase()) ||
      s.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>{t('manageServices')}</Text>
          <Text style={styles.headerSubtitle}>
            {services.length} điểm đến • Phụ trách: Việt
          </Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Text style={styles.addBtnText}>+ Thêm mới</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm dịch vụ theo tên, địa chỉ, khu vực..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Services List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.itemCard, shadows.card]}>
            <View style={styles.itemHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>
                  {item.categoryName} • 📍 {item.district} ({item.distanceKm} km)
                </Text>
              </View>
              <Text style={styles.itemRating}>★ {item.rating.toFixed(1)}</Text>
            </View>

            <Text style={styles.itemPrice}>{item.priceDisplay}</Text>
            <Text style={styles.itemDesc} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => openEditModal(item)}
              >
                <Text style={styles.editBtnText}>✏️ Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.deleteBtnText}>🗑️ Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add / Edit Service Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingService ? t('editService') : t('addService')}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>{t('serviceName')} *</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ví dụ: Tiệm Cà Phê Túi Mơ To" />

              <Text style={styles.inputLabel}>{t('serviceCategory')}</Text>
              <View style={styles.categoryPicker}>
                {categories.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.pickerChip, categoryId === c.id && styles.pickerChipActive]}
                    onPress={() => setCategoryId(c.id)}
                  >
                    <Text style={[styles.pickerChipText, categoryId === c.id && styles.pickerChipTextActive]}>
                      {c.icon} {c.nameVi}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>{t('serviceAddress')} *</Text>
              <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Địa chỉ chi tiết tại Đà Lạt" />

              <View style={styles.inputGrid}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>{t('serviceDistrict')}</Text>
                  <TextInput style={styles.input} value={district} onChangeText={setDistrict} placeholder="Phường 11" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>{t('serviceDistance')}</Text>
                  <TextInput style={styles.input} value={distanceKm} onChangeText={setDistanceKm} keyboardType="numeric" />
                </View>
              </View>

              <Text style={styles.inputLabel}>{t('priceRangeLabel')}</Text>
              <TextInput style={styles.input} value={priceDisplay} onChangeText={setPriceDisplay} placeholder="50.000đ - 100.000đ" />

              <View style={styles.inputGrid}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>{t('serviceHours')}</Text>
                  <TextInput style={styles.input} value={openingHours} onChangeText={setOpeningHours} placeholder="07:00 - 22:00" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>{t('servicePhone')}</Text>
                  <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                </View>
              </View>

              <Text style={styles.inputLabel}>{t('serviceDescription')} *</Text>
              <TextInput style={[styles.input, { height: 70 }]} value={description} onChangeText={setDescription} multiline numberOfLines={3} placeholder="Mô tả trải nghiệm, cảnh quan, nét nổi bật..." />

              <Text style={styles.inputLabel}>{t('serviceTags')}</Text>
              <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="Hoàng hôn, Cà phê, Lãng mạn" />

              <Text style={styles.inputLabel}>URL hình ảnh</Text>
              <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="https://..." />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelModalBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelModalText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveModalBtn} onPress={handleSave}>
                <Text style={styles.saveModalText}>{t('save')}</Text>
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
  itemCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  itemCategory: {
    fontSize: 11,
    color: colors.primaryLight,
    marginTop: 2,
  },
  itemRating: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.star,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    marginTop: 4,
  },
  itemDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  editBtn: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
  },
  editBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  deleteBtn: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
  },
  deleteBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.danger,
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
    maxHeight: '85%',
    padding: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  closeModalText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  modalScroll: {
    paddingVertical: spacing.sm,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginTop: 6,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 13,
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  pickerChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.cardMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pickerChipText: {
    fontSize: 11,
    color: colors.text,
  },
  pickerChipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  cancelModalBtn: {
    flex: 1,
    height: 42,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelModalText: {
    fontWeight: '700',
    color: colors.textMuted,
  },
  saveModalBtn: {
    flex: 2,
    height: 42,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveModalText: {
    fontWeight: '700',
    color: '#FFF',
  },
});
