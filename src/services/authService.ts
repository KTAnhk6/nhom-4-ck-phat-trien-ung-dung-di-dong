/**
 * Auth & User Service (Assigned to: Tuấn Anh)
 * Handles login, registration, password recovery, profile editing, and account status.
 */

import { Role, User } from '../types';
import { GUEST_USER, storageService } from './storageService';

class AuthService {
  async login(usernameOrEmail: string, passwordPlain: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const cleanInput = usernameOrEmail.trim().toLowerCase();

    const users = await storageService.getUsers();

    const user = users.find(
      u => u.username.toLowerCase() === cleanInput || u.email.toLowerCase() === cleanInput
    );

    if (!user) {
      return { success: false, error: 'Tài khoản không tồn tại trong hệ thống' };
    }

    if (user.status === 'blocked') {
      return { success: false, error: 'Tài khoản của bạn đã bị khóa bởi Quản trị viên' };
    }

    // Mật khẩu mặc định: admin / admin123, các tài khoản mẫu khác / 123456
    const passwords = await storageService.getPasswords();
    if (passwords[user.username.toLowerCase()] !== passwordPlain) {
      return { success: false, error: 'Mật khẩu không chính xác' };
    }

    await storageService.saveCurrentUser(user);
    return { success: true, user };
  }

  async loginAsGuest(): Promise<{ success: boolean; user: User }> {
    await storageService.saveCurrentUser(GUEST_USER);
    return { success: true, user: GUEST_USER };
  }

  async register(data: {
    username: string;
    email: string;
    fullName: string;
    phone: string;
    passwordPlain: string;
    role?: Role;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    const users = await storageService.getUsers();

    if (data.username.trim().toLowerCase() === 'guest' || data.username.trim().toLowerCase() === 'khach') {
      return { success: false, error: 'Tên đăng nhập "guest" là tài khoản hệ thống dành riêng cho Khách' };
    }

    if (users.some(u => u.username.toLowerCase() === data.username.trim().toLowerCase())) {
      return { success: false, error: 'Tên đăng nhập này đã được sử dụng' };
    }

    if (users.some(u => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
      return { success: false, error: 'Địa chỉ Email này đã được đăng ký' };
    }

    const newUser: User = {
      id: `USR_${Date.now()}`,
      username: data.username.trim(),
      email: data.email.trim(),
      fullName: data.fullName.trim(),
      phone: data.phone.trim(),
      avatar: data.role === 'admin'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: data.role || 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await storageService.saveUsers(users);
    const passwords = await storageService.getPasswords();
    passwords[newUser.username.toLowerCase()] = data.passwordPlain;
    await storageService.savePasswords(passwords);
    return { success: true, user: newUser };
  }

  async resetPassword(emailOrPhone: string, newPasswordPlain: string): Promise<{ success: boolean; error?: string }> {
    const users = await storageService.getUsers();
    const clean = emailOrPhone.trim().toLowerCase();

    const user = users.find(
      u => u.email.toLowerCase() === clean || u.phone.includes(clean)
    );

    if (!user) {
      return { success: false, error: 'Không tìm thấy tài khoản với Email/SĐT này' };
    }

    const passwords = await storageService.getPasswords();
    passwords[user.username.toLowerCase()] = newPasswordPlain;
    await storageService.savePasswords(passwords);
    return { success: true };
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    const users = await storageService.getUsers();
    const index = users.findIndex(u => u.id === userId);

    if (index === -1) return null;

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    await storageService.saveUsers(users);

    const currentUser = await storageService.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      await storageService.saveCurrentUser(updatedUser);
    }

    return updatedUser;
  }

  async toggleUserBlock(userId: string): Promise<User | null> {
    const users = await storageService.getUsers();
    const index = users.findIndex(u => u.id === userId);

    if (index === -1) return null;

    const newStatus = users[index].status === 'active' ? 'blocked' : 'active';
    users[index].status = newStatus;
    await storageService.saveUsers(users);

    return users[index];
  }

  async logout(): Promise<void> {
    await storageService.saveCurrentUser(null);
  }
}

export const authService = new AuthService();
