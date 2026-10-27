/**
 * MockAPI Service Module
 * Handles RESTful communication with mockapi.io endpoints
 * Includes timeout guards and automated data transformation.
 */

import { API_CONFIG } from '../config/apiConfig';
import { ServiceCategory, TourismService, Review } from '../types';

class MockApiService {
  private get baseUrl(): string {
    return API_CONFIG.MOCK_API_BASE_URL.replace(/\/+$/, '');
  }

  /**
   * Helper fetch with timeout
   */
  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(options.headers || {}),
        },
      });
      clearTimeout(timer);
      return response;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  /**
   * Kiểm tra kết nối tới MockAPI
   */
  async checkConnection(): Promise<{ connected: boolean; message: string; url: string }> {
    if (!API_CONFIG.USE_MOCK_API) {
      return { connected: false, message: 'MockAPI đang bị tắt trong cấu hình', url: this.baseUrl };
    }

    try {
      const res = await this.fetchWithTimeout(`${this.baseUrl}/services`);
      if (res.ok) {
        return { connected: true, message: 'Kết nối MockAPI thành công!', url: this.baseUrl };
      }
      return {
        connected: false,
        message: `Máy chủ MockAPI phản hồi mã lỗi HTTP: ${res.status}`,
        url: this.baseUrl,
      };
    } catch (err: any) {
      return {
        connected: false,
        message: `Chưa kết nối được: ${err.message || 'Hết thời gian chờ'}`,
        url: this.baseUrl,
      };
    }
  }

  // ================= SERVICES API =================

  async getServices(): Promise<TourismService[]> {
    const res = await this.fetchWithTimeout(`${this.baseUrl}/services`);
    if (!res.ok) {
      throw new Error(`MockAPI Lỗi [${res.status}]: Không thể lấy danh sách dịch vụ`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }

  async getServiceById(id: string): Promise<TourismService> {
    const res = await this.fetchWithTimeout(`${this.baseUrl}/services/${id}`);
    if (!res.ok) {
      throw new Error(`MockAPI Lỗi [${res.status}]: Không tìm thấy dịch vụ ID ${id}`);
    }
    return await res.json();
  }

  async createService(data: Partial<TourismService>): Promise<TourismService> {
    const res = await this.fetchWithTimeout(`${this.baseUrl}/services`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`MockAPI Lỗi [${res.status}]: Không thể tạo dịch vụ mới`);
    }
    return await res.json();
  }

  async updateService(id: string, data: Partial<TourismService>): Promise<TourismService> {
    const res = await this.fetchWithTimeout(`${this.baseUrl}/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`MockAPI Lỗi [${res.status}]: Không thể cập nhật dịch vụ ID ${id}`);
    }
    return await res.json();
  }

  async deleteService(id: string): Promise<boolean> {
    const res = await this.fetchWithTimeout(`${this.baseUrl}/services/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  }

  // ================= CATEGORIES API =================

  async getCategories(): Promise<ServiceCategory[]> {
    const res = await this.fetchWithTimeout(`${this.baseUrl}/categories`);
    if (!res.ok) {
      throw new Error(`MockAPI Lỗi [${res.status}]: Không thể lấy danh mục`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }

  async createCategory(data: Partial<ServiceCategory>): Promise<ServiceCategory> {
    const res = await this.fetchWithTimeout(`${this.baseUrl}/categories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`MockAPI Lỗi [${res.status}]: Không thể tạo danh mục`);
    }
    return await res.json();
  }

  async deleteCategory(id: string): Promise<boolean> {
    const res = await this.fetchWithTimeout(`${this.baseUrl}/categories/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  }

  // ================= REVIEWS API =================

  async getReviews(): Promise<Review[]> {
    const res = await this.fetchWithTimeout(`${this.baseUrl}/reviews`);
    if (!res.ok) {
      throw new Error(`MockAPI Lỗi [${res.status}]: Không thể lấy danh sách đánh giá`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }

  async createReview(data: Partial<Review>): Promise<Review> {
    const res = await this.fetchWithTimeout(`${this.baseUrl}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`MockAPI Lỗi [${res.status}]: Không thể gửi đánh giá`);
    }
    return await res.json();
  }

  // ================= SEED DATA UTILITY =================
  /**
   * Tiện ích đẩy dữ liệu khởi tạo lên MockAPI nếu MockAPI mới clone về đang trống
   */
  async seedInitialData(
    services: TourismService[],
    categories: ServiceCategory[]
  ): Promise<{ servicesUploaded: number; categoriesUploaded: number }> {
    let servicesUploaded = 0;
    let categoriesUploaded = 0;

    // 1. Upload Categories
    for (const cat of categories) {
      try {
        await this.createCategory(cat);
        categoriesUploaded++;
      } catch (e) {
        console.warn('Seed category error:', e);
      }
    }

    // 2. Upload Services
    for (const srv of services) {
      try {
        await this.createService(srv);
        servicesUploaded++;
      } catch (e) {
        console.warn('Seed service error:', e);
      }
    }

    return { servicesUploaded, categoriesUploaded };
  }
}

export const mockApiService = new MockApiService();
