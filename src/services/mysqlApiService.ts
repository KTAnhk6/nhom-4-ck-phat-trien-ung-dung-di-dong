/**
 * MySQL Database Client Service
 * Communicates with the backend MySQL Relational Engine (/api/mysql/*)
 * to persist and retrieve categories, services, users, passwords, reviews, favorites, search history, and notifications.
 */

import { API_CONFIG } from '../config/apiConfig';
import {
  NotificationItem,
  Review,
  SearchHistoryItem,
  ServiceCategory,
  TourismService,
  User,
} from '../types';

export interface MysqlDatabaseStatus {
  connected: boolean;
  engine: string;
  config: {
    host: string;
    port: number;
    user: string;
    database: string;
  };
  sqlDumpFile: string;
  dbFile: string;
  tableCounts: {
    categories: number;
    services: number;
    users: number;
    passwords: number;
    reviews: number;
    favorites: number;
    searchHistory: number;
    notifications: number;
  };
  recentQueries: Array<{ sql: string; timestamp: string }>;
}

class MysqlApiClient {
  private getBaseUrl(): string {
    return API_CONFIG.MYSQL_API_BASE_URL || '/api/mysql';
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
    if (!API_CONFIG.USE_MYSQL_DATABASE) return null;
    if (typeof fetch === 'undefined') return null;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch(`${this.getBaseUrl()}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!response.ok) return null;
      return (await response.json()) as T;
    } catch {
      clearTimeout(timer);
      return null;
    }
  }

  async getStatus(): Promise<MysqlDatabaseStatus | null> {
    return await this.request<MysqlDatabaseStatus>('/status');
  }

  async getServices(): Promise<TourismService[] | null> {
    return await this.request<TourismService[]>('/services');
  }

  async saveServices(services: TourismService[]): Promise<boolean> {
    const res = await this.request<{ success: boolean }>('/services', {
      method: 'PUT',
      body: JSON.stringify(services),
    });
    return Boolean(res?.success);
  }

  async getCategories(): Promise<ServiceCategory[] | null> {
    return await this.request<ServiceCategory[]>('/categories');
  }

  async saveCategories(categories: ServiceCategory[]): Promise<boolean> {
    const res = await this.request<{ success: boolean }>('/categories', {
      method: 'PUT',
      body: JSON.stringify(categories),
    });
    return Boolean(res?.success);
  }

  async getUsers(): Promise<User[] | null> {
    return await this.request<User[]>('/users');
  }

  async saveUsers(users: User[]): Promise<boolean> {
    const res = await this.request<{ success: boolean }>('/users', {
      method: 'PUT',
      body: JSON.stringify(users),
    });
    return Boolean(res?.success);
  }

  async getPasswords(): Promise<Record<string, string> | null> {
    return await this.request<Record<string, string>>('/passwords');
  }

  async savePasswords(passwords: Record<string, string>): Promise<boolean> {
    const res = await this.request<{ success: boolean }>('/passwords', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    });
    return Boolean(res?.success);
  }

  async getReviews(): Promise<Review[] | null> {
    return await this.request<Review[]>('/reviews');
  }

  async saveReviews(reviews: Review[]): Promise<boolean> {
    const res = await this.request<{ success: boolean }>('/reviews', {
      method: 'PUT',
      body: JSON.stringify(reviews),
    });
    return Boolean(res?.success);
  }

  async getFavorites(): Promise<string[] | null> {
    return await this.request<string[]>('/favorites');
  }

  async saveFavorites(serviceIds: string[]): Promise<boolean> {
    const res = await this.request<{ success: boolean }>('/favorites', {
      method: 'PUT',
      body: JSON.stringify(serviceIds),
    });
    return Boolean(res?.success);
  }

  async getSearchHistory(): Promise<SearchHistoryItem[] | null> {
    return await this.request<SearchHistoryItem[]>('/search-history');
  }

  async saveSearchHistory(history: SearchHistoryItem[]): Promise<boolean> {
    const res = await this.request<{ success: boolean }>('/search-history', {
      method: 'PUT',
      body: JSON.stringify(history),
    });
    return Boolean(res?.success);
  }

  async getNotifications(): Promise<NotificationItem[] | null> {
    return await this.request<NotificationItem[]>('/notifications');
  }

  async saveNotifications(notifications: NotificationItem[]): Promise<boolean> {
    const res = await this.request<{ success: boolean }>('/notifications', {
      method: 'PUT',
      body: JSON.stringify(notifications),
    });
    return Boolean(res?.success);
  }

  async resetDatabase(): Promise<MysqlDatabaseStatus | null> {
    const res = await this.request<{ success: boolean; status: MysqlDatabaseStatus }>('/reset', {
      method: 'POST',
    });
    return res?.status || null;
  }
}

export const mysqlApiService = new MysqlApiClient();

