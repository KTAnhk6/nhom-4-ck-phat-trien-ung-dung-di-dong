/**
 * Modern Editorial Typography System
 * Phân công và nguyên tắc áp dụng các loại phông chữ:
 * 
 * 1. Times New Roman (Serif Cổ Điển Tạp Chí):
 *    - Sử dụng cho: Tiêu đề tạp chí (Editorial Masthead), Tiêu đề chính màn hình,
 *      Tên địa danh/dịch vụ, Trích dẫn cẩm nang, Số phát hành (VOL / ISSUE N°),
 *      Heading màn hình Đăng nhập & Đăng ký.
 * 
 * 2. Plus Jakarta Sans / System Sans (Sans-Serif Thanh Lịch Hiện Đại):
 *    - Sử dụng cho: Văn bản nội dung chi tiết (Body copy), Nút bấm hành động (Buttons),
 *      Ô nhập liệu (Text Inputs), Nhãn điều hướng (Navigation labels), Badge trạng thái.
 * 
 * 3. Courier New (Monospace / Spec Tag):
 *    - Sử dụng cho: Thông số kỹ thuật (Tọa độ GPS, Khoảng cách km), Cước giá (VND),
 *      Giờ hoạt động, Mã định danh người dùng / dịch vụ, Thẻ phân loại Tag.
 */

import { Platform, StyleSheet } from 'react-native';

export const typography = {
  // Aliases compatible with Viet-admin theme
  primary: Platform.select({
    web: '"Playfair Display", "Times New Roman", Times, Georgia, serif',
    ios: 'Times New Roman',
    android: 'serif',
    default: 'serif',
  }),
  sansBody: Platform.select({
    web: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }),
  numerals: Platform.select({
    web: '"Playfair Display", "Times New Roman", Georgia, serif',
    ios: 'Times New Roman',
    android: 'serif',
    default: 'serif',
  }),

  // 1. Editorial Serif - Times New Roman
  fontEditorial: Platform.select({
    web: "'Times New Roman', Times, 'Cormorant Garamond', Georgia, serif",
    ios: 'Times New Roman',
    android: 'serif',
    default: 'serif',
  }),

  // 2. Modern Sans-Serif
  fontSans: Platform.select({
    web: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }),

  // 3. Monospace / Spec Font
  fontMono: Platform.select({
    web: "'Courier New', Courier, monospace",
    ios: 'Courier',
    android: 'monospace',
    default: 'monospace',
  }),

  // Typography documentation details for in-app guide and personalization
  guide: [
    {
      name: 'Times New Roman',
      category: 'Editorial Serif',
      appliedTo: 'Tiêu đề tạp chí, Tên địa danh, Heading Đăng nhập/Đăng ký, Trích dẫn nghệ thuật, Số báo',
      sample: 'Đà Lạt Wander — Cẩm Nang Thơ Mộng 2026',
      styleSample: { fontFamily: 'Times New Roman', fontStyle: 'italic' },
    },
    {
      name: 'Plus Jakarta Sans',
      category: 'Clean Sans-Serif',
      appliedTo: 'Nội dung bài viết, Nút bấm CTA, Ô nhập liệu Form, Nhãn thanh tác vụ, Đánh giá nhận xét',
      sample: 'Khám phá 50 tọa độ du lịch tuyển chọn tại thành phố ngàn hoa.',
      styleSample: { fontWeight: '500' },
    },
    {
      name: 'Courier New',
      category: 'Monochrome Spec / Monospace',
      appliedTo: 'Cột mốc khoảng cách (km), Tọa độ GPS, Giờ mở cửa, Giá tiền (VND), Thẻ phân loại Tag',
      sample: 'VOL. 2026 • 11.543°N, 108.442°E • 45.000 VND',
      styleSample: { letterSpacing: 0.5 },
    },
  ],
};

export const editorialStyles = StyleSheet.create({
  masthead: {
    fontFamily: typography.fontEditorial,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: typography.fontEditorial,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontFamily: typography.fontEditorial,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  body: {
    fontFamily: typography.fontSans,
    fontSize: 13,
    lineHeight: 20,
  },
  specTag: {
    fontFamily: typography.fontMono,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  issueTag: {
    fontFamily: typography.fontMono,
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});

