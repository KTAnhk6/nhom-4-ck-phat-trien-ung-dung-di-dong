/**
 * SỔ GHI NHỚ TÀI KHOẢN & MẬT KHẨU HỆ THỐNG
 * Dalat Wander - Modern Editorial KTCK
 * 
 * Quản lý toàn bộ danh sách tài khoản, mật khẩu, vai trò và quyền hạn.
 * Dùng cho giảng viên, hội đồng chấm điểm và người dùng thử nghiệm.
 */

export interface SystemCredential {
  id: string;
  role: 'admin' | 'user' | 'guest';
  roleBadge: string;
  username: string;
  passwordPlain: string;
  fullName: string;
  email: string;
  phone: string;
  description: string;
  permissions: string[];
  isGuest?: boolean;
}

export const SYSTEM_CREDENTIALS: SystemCredential[] = [
  {
    id: 'USR_ADMIN',
    role: 'admin',
    roleBadge: 'QUẢN TRỊ VIÊN (ADMIN)',
    username: 'admin',
    passwordPlain: 'admin123',
    fullName: 'Việt (Admin Quản Trị Hệ Thống)',
    email: 'admin.dalat@wander.vn',
    phone: '0988.776.655',
    description: 'Tài khoản Quản trị viên cấp cao nhất. Có quyền truy cập mọi tính năng quản lý và thống kê.',
    permissions: [
      'Quản lý toàn bộ 50 điểm đến (Thêm mới, Cập nhật, Xóa)',
      'Quản lý danh mục du lịch và kiểm tra ràng buộc dữ liệu',
      'Kiểm duyệt và gỡ bỏ đánh giá vi phạm từ người dùng',
      'Quản lý danh sách thành viên (Khóa / Mở khóa tài khoản)',
      'Phát sóng thông báo toàn hệ thống (Festival, ưu đãi)',
      'Xem biểu đồ phân tích và thống kê hệ thống (Stats Dashboard)',
      'Sử dụng đầy đủ mọi tính năng du lịch của thành viên',
    ],
  },
  {
    id: 'USR_TUANANH',
    role: 'user',
    roleBadge: 'THÀNH VIÊN (MEMBER)',
    username: 'tuananh',
    passwordPlain: '123456',
    fullName: 'Tuấn Anh (Module Auth & Người Dùng)',
    email: 'tuananh@wander.vn',
    phone: '0912.345.671',
    description: 'Tài khoản thành viên tiêu chuẩn. Sử dụng đầy đủ tính năng tra cứu, đánh giá, lưu yêu thích.',
    permissions: [
      'Tra cứu toàn bộ 50 tọa độ du lịch, cafe, ẩm thực, lưu trú',
      'Lưu và quản lý danh sách yêu thích cá nhân (Wishlist)',
      'Chấm điểm từ 1 - 5 sao và viết nhận xét trải nghiệm',
      'Trò chuyện hỏi đáp lịch trình cùng AI Chatbot',
      'Chỉnh sửa hồ sơ cá nhân (Tên, Ảnh đại diện, SĐT, Email)',
      'Nhận thông báo ưu đãi và cẩm nang du lịch Đà Lạt',
    ],
  },
  {
    id: 'USR_BINH',
    role: 'user',
    roleBadge: 'THÀNH VIÊN (MEMBER)',
    username: 'binh',
    passwordPlain: '123456',
    fullName: 'Bình (Module Trang Chủ & Dịch Vụ)',
    email: 'binh@wander.vn',
    phone: '0912.345.672',
    description: 'Tài khoản thành viên thử nghiệm module Trang chủ & Danh mục.',
    permissions: ['Đầy đủ quyền của tài khoản thành viên'],
  },
  {
    id: 'USR_QUANG',
    role: 'user',
    roleBadge: 'THÀNH VIÊN (MEMBER)',
    username: 'quang',
    passwordPlain: '123456',
    fullName: 'Quang (Module Tìm Kiếm & Chatbot)',
    email: 'quang@wander.vn',
    phone: '0912.345.673',
    description: 'Tài khoản thành viên thử nghiệm module Tìm kiếm & AI Chatbot.',
    permissions: ['Đầy đủ quyền của tài khoản thành viên'],
  },
  {
    id: 'USR_MINHANH',
    role: 'user',
    roleBadge: 'THÀNH VIÊN (MEMBER)',
    username: 'minhanh',
    passwordPlain: '123456',
    fullName: 'Minh Anh (Module Đánh Giá & Tương Tác)',
    email: 'minhanh@wander.vn',
    phone: '0912.345.674',
    description: 'Tài khoản thành viên thử nghiệm module Đánh giá & Yêu thích.',
    permissions: ['Đầy đủ quyền của tài khoản thành viên'],
  },
];

