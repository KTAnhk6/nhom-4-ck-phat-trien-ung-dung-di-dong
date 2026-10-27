/**
 * Project: Dalat Tourism Service Discovery (Dalat Wander)
 * TypeScript Data Models and Interfaces
 */

export type Role = 'user' | 'admin';
export type UserStatus = 'active' | 'blocked';
export type Language = 'vi' | 'en';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  avatar: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  nameVi: string;
  icon: string;
  description: string;
  count?: number;
}

export interface TourismService {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  address: string;
  district: string; // e.g., 'Phường 1', 'Phường 10', 'Lạc Dương', 'Tuyền Lâm'
  distanceKm: number; // Khoảng cách từ Chợ Đà Lạt / Trung tâm
  priceMin: number;
  priceMax: number;
  priceDisplay: string;
  rating: number; // 0 - 5.0
  reviewCount: number;
  openingHours: string;
  phone: string;
  website?: string;
  images: string[];
  tags: string[]; // e.g. ['Hoàng hôn', 'Chill', 'Check-in', 'Lãng mạn', 'Gia đình']
  description: string;
  latitude: number;
  longitude: number;
  isFeatured: boolean;
  isPopular: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  serviceId: string;
  serviceName: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  status: 'approved' | 'hidden';
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
}

export type NotificationType = 'promo' | 'system' | 'suggestion' | 'event';

export interface NotificationItem {
  id: string;
  title: string;
  titleVi: string;
  message: string;
  messageVi: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  linkServiceId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  recommendedServices?: TourismService[];
}

export type SortOption =
  | 'popular'
  | 'rating_desc'
  | 'price_asc'
  | 'price_desc'
  | 'distance_asc'
  | 'name_asc';

export interface FilterOptions {
  categoryId: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  district: string;
  sortBy: SortOption;
}

export type ScreenName =
  | 'HOME'
  | 'SERVICE_LIST'
  | 'SERVICE_DETAIL'
  | 'SEARCH'
  | 'CHATBOT'
  | 'FAVORITES'
  | 'LOCATION_MAP'
  | 'NOTIFICATIONS'
  | 'REVIEWS'
  | 'PROFILE'
  | 'EDIT_PROFILE'
  | 'LOGIN'
  | 'REGISTER'
  | 'FORGOT_PASSWORD'
  | 'ADMIN_DASHBOARD'
  | 'ADMIN_SERVICES'
  | 'ADMIN_CATEGORIES'
  | 'ADMIN_USERS'
  | 'ADMIN_REVIEWS'
  | 'ADMIN_NOTIFICATIONS'
  | 'ADMIN_STATS';

export interface ScreenState {
  name: ScreenName;
  serviceId?: string;
  categoryId?: string;
  searchQuery?: string;
  returnScreen?: ScreenName;
}

export interface DalatWeather {
  temp: number;
  conditionVi: string;
  conditionEn: string;
  icon: string;
  humidity: number;
  seasonVi: string;
  seasonEn: string;
  travelTipVi: string;
  travelTipEn: string;
}
