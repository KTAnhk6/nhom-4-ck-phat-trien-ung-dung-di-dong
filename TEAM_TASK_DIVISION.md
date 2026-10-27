# BẢNG PHÂN CHIA NHIỆM VỤ DỰ ÁN CUỐI KHÓA (KTCK)
## Đề tài: Ứng dụng tra cứu dịch vụ du lịch Đà Lạt (Đà Lạt Wander)

---

### 1. TUẤN ANH - PHỤ TRÁCH: AUTH VÀ NGƯỜI DÙNG
- **Chức năng thực hiện**:
  1. Màn hình Đăng nhập (`LoginScreen`): Kiểm tra username/email, mật khẩu, phân quyền role user/admin, cung cấp nút điền nhanh tài khoản demo.
  2. Màn hình Đăng ký (`RegisterScreen`): Nhập họ tên, username, email, số điện thoại, mật khẩu và xác nhận mật khẩu; kiểm tra trùng lặp tài khoản.
  3. Màn hình Quên mật khẩu (`ForgotPasswordScreen`): Xác thực email/SĐT, gửi mã OTP mô phỏng (`123456`), thiết lập mật khẩu mới.
  4. Màn hình Hồ sơ cá nhân (`ProfileScreen`): Xem thông tin người dùng, đổi ngôn ngữ, chuyển đổi nhanh giữa tài khoản User và Admin để demo, đăng xuất an toàn.
  5. Màn hình Chỉnh sửa thông tin (`EditProfileScreen`): Cập nhật họ tên, email, số điện thoại, chọn ảnh đại diện từ mẫu có sẵn hoặc nhập link URL tùy ý.
  6. Xây dựng dịch vụ xác thực (`authService.ts`) & Context quản lý phiên đăng nhập (`AuthContext.tsx`).
- **File phụ trách**:
  - `src/screens/auth/LoginScreen.tsx`
  - `src/screens/auth/RegisterScreen.tsx`
  - `src/screens/auth/ForgotPasswordScreen.tsx`
  - `src/screens/user/ProfileScreen.tsx`
  - `src/screens/user/EditProfileScreen.tsx`
  - `src/services/authService.ts`
  - `src/context/AuthContext.tsx`

---

### 2. BÌNH - PHỤ TRÁCH: TRANG CHỦ & DANH SÁCH DỊCH VỤ
- **Chức năng thực hiện**:
  1. Màn hình Trang chủ (`HomeScreen`):
     - Lời chào du khách & thanh tìm kiếm nhanh.
     - Widget thời tiết Đà Lạt (nhiệt độ, độ ẩm, tình trạng sương mù, mẹo trang phục du lịch theo mùa).
     - Danh mục dịch vụ dạng lướt ngang với icon đặc trưng.
     - Danh sách điểm đến nổi bật dạng băng chuyền ngang (Carousel).
     - Danh sách địa điểm có đánh giá cao nhất.
     - Cẩm nang kinh nghiệm Đà Lạt (săn mây Cầu Đất, chợ Đêm, hoa mai anh đào).
  2. Màn hình Danh sách dịch vụ (`ServiceListScreen`):
     - Thanh tab lọc theo danh mục (Tất cả, Điểm tham quan, Cà phê sống ảo, Khách sạn/Homestay, Ẩm thực, Tour).
     - Hiển thị danh sách dịch vụ kèm hình ảnh, mức giá, số sao, khoảng cách.
     - Nút mở bộ lọc và sắp xếp nâng cao.
  3. Màn hình Chi tiết dịch vụ (`ServiceDetailScreen`):
     - Ảnh bìa lớn, nút quay lại, nút lưu yêu thích.
     - Mức giá (từ thấp đến cao), giờ hoạt động, số điện thoại liên hệ trực tiếp.
     - Địa chỉ chi tiết, khoảng cách tới Chợ Đà Lạt, tọa độ GPS.
     - Phần giới thiệu chi tiết, thẻ tag phong cách.
     - Tóm tắt đánh giá và danh sách địa điểm tương tự liên quan.
  4. Các Component giao diện:
     - Thẻ dịch vụ (`ServiceCard.tsx`) hỗ trợ cả dạng thẻ ngang và dạng danh sách đứng.
     - Nút chip danh mục (`CategoryChip.tsx`).
- **File phụ trách**:
  - `src/screens/home/HomeScreen.tsx`
  - `src/screens/service/ServiceListScreen.tsx`
  - `src/screens/service/ServiceDetailScreen.tsx`
  - `src/components/ServiceCard.tsx`
  - `src/components/CategoryChip.tsx`

---

### 3. QUANG - PHỤ TRÁCH: TÌM KIẾM, LỌC, SẮP XẾP VÀ CHATBOT
- **Chức năng thực hiện**:
  1. Màn hình Tìm kiếm (`SearchScreen`):
     - Ô tìm kiếm thời gian thực theo tên, địa chỉ, phường, từ khóa liên quan.
     - Lịch sử tìm kiếm gần đây: lưu vết các từ khóa đã gõ, hỗ trợ bấm tìm lại và xóa lịch sử.
     - Từ khóa phổ biến gợi ý (Săn mây, Ngắm hoàng hôn, Lẩu gà lá é, Bánh tráng nướng, Túi Mơ To...).
     - Hiển thị kết quả tìm kiếm với số lượng kết quả tìm thấy.
  2. Modal Lọc & Sắp xếp (`FilterSortModal.tsx`):
     - Sắp xếp theo: Phổ biến nhất, Đánh giá cao nhất, Gần trung tâm nhất, Giá thấp đến cao, Giá cao đến thấp, Tên A-Z.
     - Lọc theo danh mục.
     - Lọc theo đánh giá tối thiểu (4.5★, 4.0★, 3.5★).
     - Lọc theo Phường / Khu vực (Phường 1, Phường 2, Phường 3, Phường 4, Phường 11, Xuân Trường...).
  3. Màn hình Trợ lý AI Đà Lạt (`DalatChatbotScreen`):
     - Trò chuyện thông minh: du khách gõ mô tả sở thích bằng ngôn ngữ tự nhiên (ví dụ: "quán cà phê view hoàng hôn", "chỗ săn mây sáng sớm", "lẩu gà ngon", "homestay lãng mạn cho 2 người").
     - Bot phân tích ý định và trả về lời khuyên du lịch kèm thẻ preview địa điểm có nút bấm "Xem chi tiết".
     - Các nút câu hỏi mẫu nhanh (Quick Prompts).
  4. Dịch vụ phân tích Chatbot (`chatbotService.ts`).
- **File phụ trách**:
  - `src/screens/search/SearchScreen.tsx`
  - `src/components/FilterSortModal.tsx`
  - `src/screens/chatbot/DalatChatbotScreen.tsx`
  - `src/services/chatbotService.ts`

---

### 4. MINH ANH - PHỤ TRÁCH: ĐÁNH GIÁ VÀ TƯƠNG TÁC NGƯỜI DÙNG
- **Chức năng thực hiện**:
  1. Màn hình Danh sách Đánh giá (`ReviewListScreen`):
     - Xem điểm trung bình toàn diện của từng điểm du lịch.
     - Biểu đồ thanh tỷ lệ phân bố số sao (5 sao, 4 sao, 3 sao, 2 sao, 1 sao).
     - Danh sách nhận xét chi tiết kèm ảnh đại diện, tên du khách, ngày đánh giá và bình luận.
  2. Modal Viết Đánh giá (`AddReviewModal`):
     - Cho phép người dùng chọn từ 1 đến 5 sao tương tác.
     - Nhập nội dung nhận xét trải nghiệm thực tế.
     - Tự động tính toán lại điểm trung bình và số lượt đánh giá của địa điểm sau khi gửi.
  3. Màn hình Địa điểm Yêu thích (`FavoritesScreen`):
     - Danh sách các điểm đến mà người dùng đã bấm lưu (tim).
     - Hỗ trợ bỏ lưu hoặc truy cập nhanh vào xem chi tiết.
  4. Màn hình Vị trí & Bản đồ (`LocationMapScreen`):
     - Hiển thị mốc trung tâm Chợ Đà Lạt / Hồ Xuân Hương và tọa độ GPS chuẩn.
     - Đo khoảng cách chính xác theo km tới từng điểm du lịch.
     - Lọc theo khoảng cách và phường.
     - Nút mở liên kết chỉ đường Google Maps.
  5. Màn hình Thông báo & Gợi ý (`NotificationScreen`):
     - Nhận các thông báo về lễ hội, khuyến mãi tour, gợi ý ẩm thực theo thời tiết.
     - Đánh dấu đã đọc / chưa đọc.
     - Chạm vào thông báo để chuyển ngay tới điểm đến được gợi ý.
  6. Component Đánh giá sao (`RatingStars.tsx`):
     - Hỗ trợ cả chế độ hiển thị (display) và chế độ tương tác chấm điểm (interactive).
- **File phụ trách**:
  - `src/screens/review/ReviewListScreen.tsx`
  - `src/screens/review/AddReviewModal.tsx`
  - `src/screens/user/FavoritesScreen.tsx`
  - `src/screens/user/LocationMapScreen.tsx`
  - `src/screens/user/NotificationScreen.tsx`
  - `src/components/RatingStars.tsx`

---

### 5. VIỆT - PHỤ TRÁCH: ADMIN QUẢN TRỊ HỆ THỐNG
- **Chức năng thực hiện**:
  1. Màn hình Bảng điều khiển Quản trị (`AdminDashboardScreen`):
     - Thống kê các chỉ số cốt lõi: Tổng dịch vụ, Tổng danh mục, Tổng thành viên, Tổng đánh giá, Điểm trung bình hệ thống.
     - Menu truy cập nhanh tới các phân hệ quản lý.
  2. Màn hình Quản lý Dịch vụ (`ManageServicesScreen`):
     - Tìm kiếm và lọc dịch vụ.
     - Thêm dịch vụ du lịch mới (tên, danh mục, địa chỉ, khoảng cách, mức giá, số điện thoại, giờ mở cửa, mô tả, thẻ tag, link ảnh).
     - Chỉnh sửa thông tin dịch vụ đã có.
     - Xóa dịch vụ với hộp thoại xác nhận an toàn.
  3. Màn hình Quản lý Danh mục (`ManageCategoriesScreen`):
     - Thêm mới danh mục du lịch kèm biểu tượng icon.
     - Kiểm tra ràng buộc dữ liệu: Không cho phép xóa danh mục đang có dịch vụ liên kết để tránh mồ côi dữ liệu.
  4. Màn hình Quản lý Người dùng (`ManageUsersScreen`):
     - Xem toàn bộ danh sách thành viên trong hệ thống và vai trò (Admin / User).
     - Khóa (Block) hoặc Mở khóa (Unblock) tài khoản thành viên khi phát hiện vi phạm.
  5. Màn hình Quản lý Đánh giá (`ManageReviewsScreen`):
     - Kiểm duyệt các bài đánh giá của du khách trên toàn hệ thống.
     - Ẩn (Hide) hoặc Hiển thị (Approved) đánh giá.
     - Xóa vĩnh viễn các đánh giá có ngôn từ không phù hợp hoặc spam.
  6. Màn hình Phát sóng Thông báo (`ManageNotificationsScreen`):
     - Soạn thảo và gửi thông báo mới (Lễ hội, Ưu đãi, Gợi ý, Hệ thống) kèm tùy chọn liên kết tới địa điểm du lịch cụ thể.
     - Lưu trữ lịch sử các thông báo đã phát sóng.
  7. Màn hình Thống kê & Báo cáo (`AdminStatsScreen`):
     - Biểu đồ tỷ lệ phân bố dịch vụ theo từng danh mục.
     - Biểu đồ phân bố số sao đánh giá.
     - Bảng xếp hạng Top 5 địa điểm du lịch Đà Lạt được yêu thích và đánh giá cao nhất.
  8. Xây dựng dịch vụ tổng hợp thống kê (`statsService.ts`).
- **File phụ trách**:
  - `src/screens/admin/AdminDashboardScreen.tsx`
  - `src/screens/admin/ManageServicesScreen.tsx`
  - `src/screens/admin/ManageCategoriesScreen.tsx`
  - `src/screens/admin/ManageUsersScreen.tsx`
  - `src/screens/admin/ManageReviewsScreen.tsx`
  - `src/screens/admin/ManageNotificationsScreen.tsx`
  - `src/screens/admin/AdminStatsScreen.tsx`
  - `src/services/statsService.ts`
