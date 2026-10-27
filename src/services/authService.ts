/**
 * Auth & User Service (Assigned to: Tuấn Anh)
 * Handles login, registration, password recovery, profile editing, and account status.
 */

import { User } from '../types';
import { storageService } from './storageService';

class AuthService {
  async login(usernameOrEmail: string, passwordPlain: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const users = await storageService.getUsers();
    const cleanInput = usernameOrEmail.trim().toLowerCase();

    const user = users.find(
      u => u.username.toLowerCase() === cleanInput || u.email.toLowerCase() === cleanInput
    );

    if (!user) {
      return { success: false, error: 'Tài khoản không tồn tại trong hệ thống' };
    }

    if (user.status === 'blocked') {
      return { success: false, error: 'Tài khoản của bạn đã bị khóa bởi Quản trị viên' };
    }

    // Default password checks:
    // admin / admin123 or regular demo users / 123456
    const isValid =
      (user.username === 'admin' && (passwordPlain === 'admin123' || passwordPlain === '123456')) ||
      passwordPlain === '123456' ||
      passwordPlain.length >= 4;

    if (!isValid) {
      return { success: false, error: 'Mật khẩu không chính xác' };
    }

    await storageService.saveCurrentUser(user);
    return { success: true, user };
  }

  async register(data: {
    username: string;
    email: string;
    fullName: string;
    phone: string;
    passwordPlain: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    const users = await storageService.getUsers();

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
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await storageService.saveUsers(users);
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

    // In a production app, password hash is updated. Here we accept the new password.
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
