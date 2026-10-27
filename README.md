# ĐÀ LẠT WANDER - ỨNG DỤNG TRA CỨU DỊCH VỤ DU LỊCH ĐÀ LẠT

> Đề tài Khóa luận / Kiểm tra cuối khóa (KTCK) - Phát triển ứng dụng di động  
> Công nghệ: **React Native (TypeScript)** hỗ trợ đa nền tảng (Android, iOS & Web)

---

## 1. THÔNG TIN ĐỀ TÀI
- **Tên đề tài**: Ứng dụng tra cứu dịch vụ du lịch
- **Phạm vi đề tài**: Thành phố Đà Lạt (Lâm Đồng)
- **Đối tượng phục vụ**: Du khách trong và ngoài nước khám phá Đà Lạt, các chủ dịch vụ du lịch, và ban quản trị du lịch địa phương.

---

## 2. PHÂN CHIA NHIỆM VỤ THÀNH VIÊN THEO ĐỀ TÀI

| Thành viên | Phân công nhiệm vụ | Các file & màn hình phụ trách |
|---|---|---|
| **Tuấn Anh** | **Auth và Người dùng** | - `src/screens/auth/LoginScreen.tsx`<br>- `src/screens/auth/RegisterScreen.tsx`<br>- `src/screens/auth/ForgotPasswordScreen.tsx`<br>- `src/screens/user/ProfileScreen.tsx`<br>- `src/screens/user/EditProfileScreen.tsx`<br>- `src/services/authService.ts`<br>- `src/context/AuthContext.tsx` |
| **Bình** | **Trang chủ & Danh sách dịch vụ** | - `src/screens/home/HomeScreen.tsx`<br>- `src/screens/service/ServiceListScreen.tsx`<br>- `src/screens/service/ServiceDetailScreen.tsx`<br>- `src/components/ServiceCard.tsx`<br>- `src/components/CategoryChip.tsx` |
| **Quang** | **Tìm kiếm, Lọc, Sắp xếp & Chatbot** | - `src/screens/search/SearchScreen.tsx`<br>- `src/components/FilterSortModal.tsx`<br>- `src/screens/chatbot/DalatChatbotScreen.tsx`<br>- `src/services/chatbotService.ts` |
| **Minh Anh** | **Đánh giá & Tương tác người dùng** | - `src/screens/review/ReviewListScreen.tsx`<br>- `src/screens/review/AddReviewModal.tsx`<br>- `src/screens/user/FavoritesScreen.tsx`<br>- `src/screens/user/LocationMapScreen.tsx`<br>- `src/screens/user/NotificationScreen.tsx`<br>- `src/components/RatingStars.tsx` |
| **Việt** | **Admin Quản trị hệ thống** | - `src/screens/admin/AdminDashboardScreen.tsx`<br>- `src/screens/admin/ManageServicesScreen.tsx`<br>- `src/screens/admin/ManageCategoriesScreen.tsx`<br>- `src/screens/admin/ManageUsersScreen.tsx`<br>- `src/screens/admin/ManageReviewsScreen.tsx`<br>- `src/screens/admin/ManageNotificationsScreen.tsx`<br>- `src/screens/admin/AdminStatsScreen.tsx`<br>- `src/services/statsService.ts` |

---

## 3. CÁC TÍNH NĂNG ĐÃ TRIỂN KHAI

### A. Chức năng chung:
1. **Đăng nhập / Đăng ký**: Hỗ trợ xác thực người dùng, lưu phiên đăng nhập cục bộ.
2. **Quên mật khẩu**: Quy trình khôi phục mật khẩu thông qua xác thực mã OTP (mặc định demo: `123456`).
3. **Trang chủ**: Thời tiết Đà Lạt se lạnh, gợi ý trang phục/hoạt động, danh mục dạng lướt ngang, điểm đến nổi bật và cẩm nang du lịch.
4. **Danh sách dịch vụ**: Khám phá các địa điểm tham quan, cà phê sống ảo, homestay, ẩm thực đặc sản và tour trải nghiệm.
5. **Xem chi tiết dịch vụ**: Hình ảnh chất lượng cao, khoảng cách tới Chợ Đà Lạt, mức giá, giờ mở cửa, số điện thoại liên hệ, mô tả chi tiết, tọa độ GPS.
6. **Xem đánh giá**: Thống kê điểm trung bình, biểu đồ tỷ lệ sao (1-5 sao) và các nhận xét từ du khách.
7. **Tìm kiếm thông minh**: Tìm kiếm tức thì theo tên, địa chỉ, phường, thẻ tag.
8. **Lọc & Sắp xếp**: Lọc theo danh mục, phường/khu vực, mức giá, số sao tối thiểu; Sắp xếp theo phổ biến, đánh giá, khoảng cách gần nhất, giá thấp/cao.
9. **Đa ngôn ngữ (i18n)**: Chuyển đổi mượt mà giữa Tiếng Việt và English.
10. **Chatbot gợi ý thông minh dựa trên mô tả**:
    - Hiểu ngôn ngữ tự nhiên: "quán cà phê view hoàng hôn", "săn mây sáng sớm", "lẩu gà lá é gần chợ", "homestay lãng mạn cho 2 người".
    - Trả lời lời khuyên du lịch và kèm thẻ dịch vụ có nút "Xem chi tiết".

### B. Chức năng người dùng:
1. **Trang cá nhân**: Xem và cập nhật thông tin cá nhân (họ tên, email, số điện thoại, ảnh đại diện).
2. **Đánh giá**: Chấm điểm từ 1-5 sao và viết nhận xét trải nghiệm tại các điểm đến.
3. **Vị trí khu du lịch**: Đo khoảng cách chính xác từ mốc Chợ Đà Lạt/Hồ Xuân Hương, hiển thị tọa độ GPS và mở chỉ đường Google Maps.
4. **Lịch sử tìm kiếm**: Lưu giữ từ khóa đã tìm kiếm, xóa lịch sử, tìm nhanh các từ khóa "hot".
5. **Thông báo & Gợi ý**: Nhận thông báo về lễ hội Festival hoa, tour giảm giá và gợi ý món ngon phù hợp với thời tiết.
6. **Yêu thích (Wishlist)**: Lưu lại các địa điểm yêu thích để lên lịch trình đi sau.

### C. Chức năng Admin:
1. **Bảng điều khiển (Dashboard)**: Thống kê số lượng dịch vụ, người dùng, đánh giá, điểm trung bình toàn hệ thống.
2. **Quản lý dịch vụ**: Thêm mới, chỉnh sửa, xóa các điểm du lịch tại Đà Lạt.
3. **Quản lý danh mục**: Thêm/xóa danh mục, kiểm tra ràng buộc không cho xóa danh mục đang có dịch vụ sử dụng.
4. **Quản lý người dùng**: Xem danh sách thành viên, khóa/mở khóa tài khoản.
5. **Quản lý đánh giá**: Kiểm duyệt nhận xét của khách du lịch, ẩn hoặc xóa vĩnh viễn đánh giá vi phạm.
6. **Quản lý thông báo**: Soạn thảo và phát sóng thông báo (lễ hội, ưu đãi, tin tức) kèm liên kết tới toàn bộ ứng dụng.
7. **Thống kê & Báo cáo**: Biểu đồ phân bố dịch vụ theo danh mục, phổ điểm đánh giá sao, Top 5 địa điểm được yêu thích nhất.

---

## 4. HƯỚNG DẪN CÀI ĐẶT & CHẠY ỨNG DỤNG

### Bước 1: Cài đặt thư viện phụ thuộc (nếu chưa có `node_modules`)
```bash
cd ktck
npm install
```

### Bước 2: Chạy thử nghiệm trên Trình duyệt Web (Nhanh và tiện nhất để chấm điểm / Demo)
```bash
npm run web
```
- Ứng dụng sẽ tự động mở trên cổng `http://localhost:3001` (hoặc cổng được Vite cung cấp).
- Giao diện được bao bọc trong khung điện thoại thông minh sắc nét với phong cách Đà Lạt hiện đại.

### Bước 3: Chạy trên Thiết bị Di động (Android / iOS)
```bash
# Khởi động Metro bundler
npm run start

# Hoặc chạy trên máy ảo Android
npm run android
```

---

## 5. TÀI KHOẢN MẪU ĐỂ TEST & CHẤM ĐIỂM
Tại màn hình Đăng nhập (Login) hoặc Trang cá nhân (Profile), đã có sẵn các nút bấm **nhập nhanh tài khoản mẫu**:
- **Quản trị viên (Admin - Việt)**:
  - Tài khoản: `admin`
  - Mật khẩu: `admin123`
- **Thành viên du lịch (Member - Tuấn Anh)**:
  - Tài khoản: `tuananh`
  - Mật khẩu: `123456`
- **Mã OTP khôi phục mật khẩu demo**: `123456`
