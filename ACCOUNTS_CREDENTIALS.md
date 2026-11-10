# 📜 SỔ GHI NHỚ TÀI KHOẢN & MẬT KHẨU ĐĂNG NHẬP
## ĐÀ LẠT WANDER — MODERN EDITORIAL EDITION (2026)

Tài liệu này lưu trữ toàn bộ danh sách tài khoản, mật khẩu, phân quyền và các giới hạn chức năng trong ứng dụng.

---

## 1. BẢNG TÀI KHOẢN VÀ MẬT KHẨU KIỂM THỬ

| Vai trò | Tên đăng nhập (`Username`) | Mật khẩu (`Password`) | Họ và tên hiển thị | Quyền hạn & Chức năng |
| :--- | :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin` | `admin123` | Việt (Admin Quản Trị) | **Toàn quyền hệ thống**: Quản lý dịch vụ, danh mục, thành viên, duyệt đánh giá, thống kê dashboard. |
| **Thành viên (User)** | `tuananh` | `123456` | Tuấn Anh (Auth & Người dùng) | **Đầy đủ quyền người dùng**: Tra cứu, lưu yêu thích, gửi đánh giá 1-5 sao, chat AI, chỉnh sửa hồ sơ. |
| **Thành viên (User)** | `binh` | `123456` | Bình (Trang chủ & Dịch vụ) | Đầy đủ quyền thành viên. |
| **Thành viên (User)** | `quang` | `123456` | Quang (Tìm kiếm & Chatbot) | Đầy đủ quyền thành viên. |
| **Thành viên (User)** | `minhanh` | `123456` | Minh Anh (Đánh giá & Tương tác) | Đầy đủ quyền thành viên. |

> 💡 **Tài khoản Quản trị viên (Admin):** Là tài khoản cố định của hệ thống (`admin` / `admin123`), không hỗ trợ đăng ký công khai.
> 💡 **Đăng ký tài khoản mới:** Người dùng đăng ký tài khoản thành viên thông thường qua màn hình Đăng ký (như các ứng dụng tiêu chuẩn khác).
> 💡 **Khách (Guest):** Không có tài khoản, mật khẩu, số điện thoại, email hay ảnh đại diện cá nhân (sử dụng avatar mặc định `👤`). Người dùng chỉ cần nhấn nút **"Tiếp tục với tư cách Khách"** trên màn hình Đăng nhập để vào khám phá.
> 💡 **Mã OTP Demo Khôi phục Mật khẩu:** `123456`

---

## 2. QUY ĐỊNH GIỚI HẠN CHỨC NĂNG CHO KHÁCH (GUEST)

**Khách (Guest Mode)** không có tài khoản đăng nhập (không có username, mật khẩu, số điện thoại, email, dùng avatar mặc định) và bị giới hạn các tính năng sau:

1. ❌ **Không thể Viết Đánh giá & Chấm điểm sao**:
   - Khi bấm "Gửi đánh giá" hoặc mở biểu mẫu đánh giá, ứng dụng sẽ hiện thông báo cảnh báo yêu cầu đăng nhập tài khoản Thành viên hoặc Admin.
2. ❌ **Không thể Lưu danh sách Yêu thích (Wishlist)**:
   - Khi bấm biểu tượng trái tim để lưu địa điểm, ứng dụng sẽ chặn thao tác và hiển thị hộp thoại gợi ý "Đăng nhập ngay để lưu lại địa điểm này vào lịch trình cá nhân".
3. ❌ **Không thể Truy cập Khu vực Quản trị (Admin Screens)**:
   - Không xem được trang Dashboard Quản trị, Quản lý dịch vụ, Quản lý người dùng, Thống kê hệ thống.
4. ❌ **Không thể Chỉnh sửa Hồ sơ cá nhân**:
   - Không có thông tin tài khoản, email, số điện thoại và không thể chỉnh sửa hồ sơ.

---

## 3. BẢNG PHÂN BỔ PHÔNG CHỮ (TYPOGRAPHY GUIDE)

Ứng dụng kết hợp hài hòa 3 bộ phông chữ theo phong cách **Modern Editorial**:

| Loại phông | Tên phông chữ | Vùng áp dụng trong ứng dụng | Mục đích thiết kế |
| :--- | :--- | :--- | :--- |
| **Editorial Serif** | **Times New Roman** | • Tiêu đề tạp chí (Editorial Masthead)<br>• Tiêu đề chính màn hình (Đăng nhập, Đăng ký, Trang chủ)<br>• Tên 50 địa danh du lịch Đà Lạt<br>• Trích dẫn cẩm nang và câu châm ngôn nghệ thuật<br>• Số phát hành (`ISSUE N° 04`, `VOL. 2026`) | Tạo cảm giác sang trọng, hoài niệm, đậm chất thơ và phong cách tạp chí cao cấp (Kinfolk / Monocle). |
| **Modern Sans-Serif** | **Plus Jakarta Sans** | • Toàn bộ nội dung mô tả chi tiết (Body copy)<br>• Các nút bấm hành động (CTA Buttons)<br>• Các ô nhập liệu biểu mẫu (Text Inputs)<br>• Nhãn chữ thanh tác vụ điều hướng (Bottom Nav)<br>• Nhận xét, đánh giá của du khách | Tối ưu hóa khả năng đọc nhanh trên màn hình di động, sắc nét và hiện đại. |
| **Monochrome Spec** | **Courier New** | • Khoảng cách cự ly (`1.3 km`, `5.8 km`)<br>• Tọa độ địa lý GPS (`11.940°N, 108.437°E`)<br>• Mức giá (`0 VND`, `45.000 VND`)<br>• Giờ mở cửa (`07:00 - 22:00`)<br>• Mã định danh (`#USR_ADMIN`, `#SRV_01`)<br>• Thẻ chuyên mục Tag | Đóng vai trò phông số liệu kỹ thuật, tạo nét tương phản tinh tế với chất thơ của Times New Roman. |

---

## 4. THANH TÁC VỤ ĐƠN MÀU (SOLID MONOCHROMATIC TASKBAR)

Thanh điều hướng dưới đáy (Bottom Navigation) được thiết kế theo phong cách đơn màu **Obsidian Noir (`#181818`)**:
- Nền đen than chì nguyên khối sang trọng, không loang màu sặc sỡ.
- Viền hairline siêu mảnh tinh xảo (`#282828`).
- Trạng thái kích hoạt (Active) nổi bật với sắc trắng tinh khiết (`#FFFFFF`) và chấm định vị thanh lịch.
- Trạng thái không kích hoạt (Inactive) ẩn nhẹ với tông bạc mờ (`#828282`).
