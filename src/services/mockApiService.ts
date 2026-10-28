/**
 * MockAPI Service Module
 * Handles RESTful communication with mockapi.io endpoints
 * Includes timeout guards and automated data transformation.
 */

import { API_CONFIG } from '../config/apiConfig';
import { ServiceCategory, TourismService, Review } from '../types';

export function normalizeService(raw: any, index: number = 0): TourismService {
  if (!raw || typeof raw !== 'object') {
    raw = {};
  }

  const defaultImages = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
  ];

  const ratingVal =
    typeof raw.rating === 'number'
      ? raw.rating
      : parseFloat(raw.rating) || Number((4.5 + (index % 5) * 0.1).toFixed(1));

  const priceMinVal = Number(raw.priceMin) || 45000;
  const priceMaxVal = Number(raw.priceMax) || 120000;
  const priceDisplayVal =
    raw.priceDisplay ||
    `${priceMinVal.toLocaleString('vi-VN')}đ - ${priceMaxVal.toLocaleString('vi-VN')}đ`;

  const imagesArr =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images
      : raw.avatar
      ? [raw.avatar]
      : [defaultImages[index % defaultImages.length]];

  return {
    id: String(raw.id || `SRV_${Date.now()}_${index}`),
    name: raw.name || `Điểm đến Đà Lạt #${index + 1}`,
    categoryId: raw.categoryId || 'CAT_ATTRACTION',
    categoryName: raw.categoryName || 'Điểm tham quan & Di tích',
    address: raw.address || 'Đà Lạt, Lâm Đồng',
    district: raw.district || 'Phường 10',
    distanceKm: Number(raw.distanceKm) || Number((2.5 + (index % 10) * 1.5).toFixed(1)),
    priceMin: priceMinVal,
    priceMax: priceMaxVal,
    priceDisplay: priceDisplayVal,
    rating: Number(ratingVal.toFixed(1)),
    reviewCount: Number(raw.reviewCount) || (50 + (index % 20) * 15),
    openingHours: raw.openingHours || '07:00 - 22:00',
    phone: raw.phone || '0263 382 1234',
    images: imagesArr,
    tags: Array.isArray(raw.tags) && raw.tags.length > 0 ? raw.tags : ['Check-in', 'Đà Lạt', 'Du lịch'],
    description: raw.description || 'Địa điểm du lịch và trải nghiệm tuyệt vời tại thành phố ngàn hoa Đà Lạt.',
    latitude: Number(raw.latitude) || 11.9404,
    longitude: Number(raw.longitude) || 108.4583,
    isFeatured: raw.isFeatured !== undefined ? Boolean(raw.isFeatured) : index < 6,
    isPopular: raw.isPopular !== undefined ? Boolean(raw.isPopular) : index % 2 === 0,
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

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
    if (!Array.isArray(data)) return [];
    return data.map((item, idx) => normalizeService(item, idx));
  }

  async getServiceById(id: string): Promise<TourismService> {
    const res = await this.fetchWithTimeout(`${this.baseUrl}/services/${id}`);
    if (!res.ok) {
      throw new Error(`MockAPI Lỗi [${res.status}]: Không tìm thấy dịch vụ ID ${id}`);
    }
    const raw = await res.json();
    return normalizeService(raw);
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
