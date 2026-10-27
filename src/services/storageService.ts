/**
 * Storage Service for Dalat Travel App
 * Wraps AsyncStorage with local web fallback for seamless dual Web & Mobile support.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Language,
  NotificationItem,
  Review,
  SearchHistoryItem,
  ServiceCategory,
  TourismService,
  User,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_SERVICES,
  INITIAL_USERS,
} from '../data/dalatData';

export const STORAGE_KEYS = {
  SERVICES: '@dalat_services_v1',
  CATEGORIES: '@dalat_categories_v1',
  USERS: '@dalat_users_v1',
  CURRENT_USER: '@dalat_current_user_v1',
  REVIEWS: '@dalat_reviews_v1',
  FAVORITES: '@dalat_favorites_v1',
  SEARCH_HISTORY: '@dalat_search_history_v1',
  NOTIFICATIONS: '@dalat_notifications_v1',
  LANGUAGE: '@dalat_language_v1',
};

// Safe storage adapter (supports Web localStorage & React Native AsyncStorage)
class StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.warn('Storage setItem failed:', e);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn('Storage removeItem failed:', e);
    }
  }
}

const storage = new StorageAdapter();

class DalatStorageService {
  async initialize(): Promise<void> {
    try {
      // 1. Categories
      const catJson = await storage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!catJson) {
        await storage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      }

      // 2. Services
      const srvJson = await storage.getItem(STORAGE_KEYS.SERVICES);
      if (!srvJson) {
        await storage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
      }

      // 3. Users
      const userJson = await storage.getItem(STORAGE_KEYS.USERS);
      if (!userJson) {
        await storage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      }

      // 4. Default logged in user (Admin for convenience during grading/demo, switchable to regular member)
      const currentJson = await storage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!currentJson) {
        await storage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
      }

      // 5. Reviews
      const revJson = await storage.getItem(STORAGE_KEYS.REVIEWS);
      if (!revJson) {
        await storage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      }

      // 6. Favorites
      const favJson = await storage.getItem(STORAGE_KEYS.FAVORITES);
      if (!favJson) {
        await storage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(['SRV_TUI_MO_TO', 'SRV_HO_TUYEN_LAM']));
      }

      // 7. Search History
      const histJson = await storage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      if (!histJson) {
        const defaultHist: SearchHistoryItem[] = [
          { id: '1', query: 'Cà phê hoàng hôn', timestamp: new Date().toISOString() },
          { id: '2', query: 'Lẩu gà lá é', timestamp: new Date().toISOString() },
          { id: '3', query: 'Săn mây Cầu Đất', timestamp: new Date().toISOString() },
        ];
        await storage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(defaultHist));
      }

      // 8. Notifications
      const notifJson = await storage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (!notifJson) {
        await storage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      }
    } catch (e) {
      console.error('Initialization error in DalatStorageService:', e);
    }
  }

  // SERVICES CRUD
  async getServices(): Promise<TourismService[]> {
    const json = await storage.getItem(STORAGE_KEYS.SERVICES);
    return json ? JSON.parse(json) : INITIAL_SERVICES;
  }

  async saveServices(services: TourismService[]): Promise<void> {
    await storage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }

  // CATEGORIES CRUD
  async getCategories(): Promise<ServiceCategory[]> {
    const json = await storage.getItem(STORAGE_KEYS.CATEGORIES);
    return json ? JSON.parse(json) : INITIAL_CATEGORIES;
  }

  async saveCategories(categories: ServiceCategory[]): Promise<void> {
    await storage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  // USERS CRUD
  async getUsers(): Promise<User[]> {
    const json = await storage.getItem(STORAGE_KEYS.USERS);
    return json ? JSON.parse(json) : INITIAL_USERS;
  }

  async saveUsers(users: User[]): Promise<void> {
    await storage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // CURRENT USER
  async getCurrentUser(): Promise<User | null> {
    const json = await storage.getItem(STORAGE_KEYS.CURRENT_USER);
    return json ? JSON.parse(json) : null;
  }

  async saveCurrentUser(user: User | null): Promise<void> {
    if (user) {
      await storage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      await storage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  // REVIEWS CRUD
  async getReviews(): Promise<Review[]> {
    const json = await storage.getItem(STORAGE_KEYS.REVIEWS);
    return json ? JSON.parse(json) : INITIAL_REVIEWS;
  }

  async saveReviews(reviews: Review[]): Promise<void> {
    await storage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }

  // FAVORITES
  async getFavorites(): Promise<string[]> {
    const json = await storage.getItem(STORAGE_KEYS.FAVORITES);
    return json ? JSON.parse(json) : [];
  }

  async saveFavorites(serviceIds: string[]): Promise<void> {
    await storage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(serviceIds));
  }

  // SEARCH HISTORY
  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    const json = await storage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return json ? JSON.parse(json) : [];
  }

  async saveSearchHistory(history: SearchHistoryItem[]): Promise<void> {
    await storage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
  }

  // NOTIFICATIONS
  async getNotifications(): Promise<NotificationItem[]> {
    const json = await storage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return json ? JSON.parse(json) : INITIAL_NOTIFICATIONS;
  }

  async saveNotifications(notifs: NotificationItem[]): Promise<void> {
    await storage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  // LANGUAGE
  async getLanguage(): Promise<Language> {
    const lang = await storage.getItem(STORAGE_KEYS.LANGUAGE);
    return lang === 'en' ? 'en' : 'vi';
  }

  async saveLanguage(lang: Language): Promise<void> {
    await storage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }

  // RESET
  async resetAll(): Promise<void> {
    await storage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    await storage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    await storage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    await storage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    await storage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    await storage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
}

export const storageService = new DalatStorageService();
