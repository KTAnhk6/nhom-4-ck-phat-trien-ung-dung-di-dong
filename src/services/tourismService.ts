/**
 * Tourism Service Module
 * Handles queries, filtering, sorting, reviews, favorites, search history, and CRUD.
 */

import {
  FilterOptions,
  NotificationItem,
  Review,
  SearchHistoryItem,
  ServiceCategory,
  TourismService,
} from '../types';
import { API_CONFIG } from '../config/apiConfig';
import { mockApiService } from './mockApiService';
import { storageService } from './storageService';

class TourismServiceManager {
  // ================= SERVICES =================

  async getAllServices(): Promise<TourismService[]> {
    if (API_CONFIG.USE_MOCK_API) {
      try {
        const remoteList = await mockApiService.getServices();
        if (remoteList && remoteList.length > 0) {
          // Lưu cache vào local storage để khi offline vẫn mượt mà
          await storageService.saveServices(remoteList);
          return remoteList;
        }
      } catch (e) {
        console.warn('MockAPI offline hoặc chưa clone, fallback dữ liệu nội bộ:', e);
      }
    }
    return await storageService.getServices();
  }

  async getServiceById(id: string): Promise<TourismService | null> {
    if (API_CONFIG.USE_MOCK_API) {
      try {
        const remoteItem = await mockApiService.getServiceById(id);
        if (remoteItem) return remoteItem;
      } catch (e) {
        // fallback to storage
      }
    }
    const list = await storageService.getServices();
    return list.find(s => s.id === id) || null;
  }

  async filterAndSortServices(
    services: TourismService[],
    searchQuery: string,
    filter: FilterOptions
  ): Promise<TourismService[]> {
    let result = [...services];

    // 1. Text Search (name, tags, address, description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          s.tags.some(t => t.toLowerCase().includes(q)) ||
          s.description.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (filter.categoryId && filter.categoryId !== 'ALL') {
      result = result.filter(s => s.categoryId === filter.categoryId);
    }

    // 3. District Filter
    if (filter.district && filter.district !== 'ALL') {
      result = result.filter(s => s.district === filter.district);
    }

    // 4. Rating Filter
    if (filter.minRating > 0) {
      result = result.filter(s => s.rating >= filter.minRating);
    }

    // 5. Price Range Filter
    if (filter.maxPrice > 0) {
      result = result.filter(
        s => s.priceMin >= filter.minPrice && s.priceMin <= filter.maxPrice
      );
    }

    // 6. Sorting
    switch (filter.sortBy) {
      case 'rating_desc':
        result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'price_asc':
        result.sort((a, b) => a.priceMin - b.priceMin);
        break;
      case 'price_desc':
        result.sort((a, b) => b.priceMin - a.priceMin);
        break;
      case 'distance_asc':
        result.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.rating - a.rating);
        break;
    }

    return result;
  }

  async addService(data: Omit<TourismService, 'id' | 'createdAt' | 'rating' | 'reviewCount'>): Promise<TourismService> {
    const list = await storageService.getServices();
    const newService: TourismService = {
      ...data,
      id: `SRV_${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };

    if (API_CONFIG.USE_MOCK_API) {
      try {
        const created = await mockApiService.createService(newService);
        if (created && created.id) {
          newService.id = String(created.id);
        }
      } catch (e) {
        console.warn('MockAPI create error, saved locally instead:', e);
      }
    }

    list.unshift(newService);
    await storageService.saveServices(list);
    return newService;
  }

  async updateService(service: TourismService): Promise<void> {
    if (API_CONFIG.USE_MOCK_API) {
      try {
        await mockApiService.updateService(service.id, service);
      } catch (e) {
        console.warn('MockAPI update error, updated locally instead:', e);
      }
    }

    const list = await storageService.getServices();
    const index = list.findIndex(s => s.id === service.id);
    if (index !== -1) {
      list[index] = service;
      await storageService.saveServices(list);
    }
  }

  async deleteService(id: string): Promise<void> {
    if (API_CONFIG.USE_MOCK_API) {
      try {
        await mockApiService.deleteService(id);
      } catch (e) {
        console.warn('MockAPI delete error, deleted locally instead:', e);
      }
    }

    const list = await storageService.getServices();
    const filtered = list.filter(s => s.id !== id);
    await storageService.saveServices(filtered);
  }

  // ================= CATEGORIES =================

  async getCategories(): Promise<ServiceCategory[]> {
    let categories: ServiceCategory[] = [];
    if (API_CONFIG.USE_MOCK_API) {
      try {
        const remoteCats = await mockApiService.getCategories();
        if (remoteCats && remoteCats.length > 0) {
          categories = remoteCats;
          await storageService.saveCategories(remoteCats);
        }
      } catch (e) {
        // fallback to storage
      }
    }

    if (categories.length === 0) {
      categories = await storageService.getCategories();
    }

    const services = await storageService.getServices();

    // augment with item counts
    return categories.map(cat => ({
      ...cat,
      count: services.filter(s => s.categoryId === cat.id).length,
    }));
  }

  async addCategory(nameVi: string, nameEn: string, icon: string, description: string): Promise<ServiceCategory> {
    const categories = await storageService.getCategories();
    const newCat: ServiceCategory = {
      id: `CAT_${Date.now()}`,
      name: nameEn || nameVi,
      nameVi,
      icon: icon || '📍',
      description,
    };
    categories.push(newCat);
    await storageService.saveCategories(categories);
    return newCat;
  }

  async deleteCategory(id: string): Promise<{ success: boolean; inUseCount?: number }> {
    const services = await storageService.getServices();
    const inUse = services.filter(s => s.categoryId === id);
    if (inUse.length > 0) {
      return { success: false, inUseCount: inUse.length };
    }

    const categories = await storageService.getCategories();
    const updated = categories.filter(c => c.id !== id);
    await storageService.saveCategories(updated);
    return { success: true };
  }

  // ================= REVIEWS (Minh Anh) =================

  async getReviewsForService(serviceId: string): Promise<Review[]> {
    const all = await storageService.getReviews();
    return all.filter(r => r.serviceId === serviceId && r.status === 'approved');
  }

  async getAllReviews(): Promise<Review[]> {
    return await storageService.getReviews();
  }

  async addReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>): Promise<Review> {
    const all = await storageService.getReviews();
    const newReview: Review = {
      ...reviewData,
      id: `REV_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'approved',
    };
    all.unshift(newReview);
    await storageService.saveReviews(all);

    // Recalculate average rating & reviewCount for the service
    const serviceReviews = all.filter(r => r.serviceId === reviewData.serviceId && r.status === 'approved');
    const totalRating = serviceReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRating / serviceReviews.length).toFixed(1));

    const services = await storageService.getServices();
    const sIndex = services.findIndex(s => s.id === reviewData.serviceId);
    if (sIndex !== -1) {
      services[sIndex].rating = avgRating;
      services[sIndex].reviewCount = serviceReviews.length;
      await storageService.saveServices(services);
    }

    return newReview;
  }

  async toggleReviewStatus(reviewId: string): Promise<void> {
    const all = await storageService.getReviews();
    const index = all.findIndex(r => r.id === reviewId);
    if (index !== -1) {
      all[index].status = all[index].status === 'approved' ? 'hidden' : 'approved';
      await storageService.saveReviews(all);
    }
  }

  async deleteReview(reviewId: string): Promise<void> {
    const all = await storageService.getReviews();
    const updated = all.filter(r => r.id !== reviewId);
    await storageService.saveReviews(updated);
  }

  // ================= FAVORITES =================

  async getFavorites(): Promise<string[]> {
    return await storageService.getFavorites();
  }

  async toggleFavorite(serviceId: string): Promise<boolean> {
    const favs = await storageService.getFavorites();
    const exists = favs.includes(serviceId);
    let updated: string[];
    if (exists) {
      updated = favs.filter(id => id !== serviceId);
    } else {
      updated = [...favs, serviceId];
    }
    await storageService.saveFavorites(updated);
    return !exists;
  }

  // ================= SEARCH HISTORY (Quang) =================

  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    return await storageService.getSearchHistory();
  }

  async addSearchHistory(query: string): Promise<void> {
    if (!query || !query.trim()) return;
    const history = await storageService.getSearchHistory();
    const filtered = history.filter(h => h.query.toLowerCase() !== query.toLowerCase().trim());
    filtered.unshift({
      id: `${Date.now()}`,
      query: query.trim(),
      timestamp: new Date().toISOString(),
    });
    // keep maximum 10 items
    await storageService.saveSearchHistory(filtered.slice(0, 10));
  }

  async clearSearchHistory(): Promise<void> {
    await storageService.saveSearchHistory([]);
  }

  // ================= NOTIFICATIONS =================

  async getNotifications(): Promise<NotificationItem[]> {
    return await storageService.getNotifications();
  }

  async markAllNotificationsRead(): Promise<void> {
    const list = await storageService.getNotifications();
    const updated = list.map(n => ({ ...n, isRead: true }));
    await storageService.saveNotifications(updated);
  }

  async broadcastNotification(data: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>): Promise<NotificationItem> {
    const list = await storageService.getNotifications();
    const newNotif: NotificationItem = {
      ...data,
      id: `NOTIF_${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    list.unshift(newNotif);
    await storageService.saveNotifications(list);
    return newNotif;
  }
}

export const tourismService = new TourismServiceManager();
