/**
 * Tourism Context & Navigation State Management
 * Coordinates services, search, filter, favorites, notifications, and screen transitions.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  FilterOptions,
  NotificationItem,
  Review,
  SearchHistoryItem,
  ScreenName,
  ScreenState,
  ServiceCategory,
  TourismService,
} from '../types';
import { tourismService } from '../services/tourismService';

export const DEFAULT_FILTER: FilterOptions = {
  categoryId: 'ALL',
  minPrice: 0,
  maxPrice: 0,
  minRating: 0,
  district: 'ALL',
  sortBy: 'popular',
};

interface TourismContextType {
  // Data
  services: TourismService[];
  categories: ServiceCategory[];
  favorites: string[];
  searchHistory: SearchHistoryItem[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  isLoading: boolean;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filter: FilterOptions;
  setFilter: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilter: () => void;
  filteredServices: TourismService[];

  // Navigation
  currentScreen: ScreenState;
  navigationStack: ScreenState[];
  navigate: (screen: ScreenName, params?: Partial<ScreenState>) => void;
  goBack: () => void;
  navigateToDetail: (serviceId: string) => void;
  navigateToCategory: (categoryId: string) => void;
  navigateToReviews: (serviceId: string) => void;
  navigateToSearch: (initialQuery?: string) => void;

  // Actions
  refreshData: () => Promise<void>;
  toggleFavorite: (serviceId: string) => Promise<boolean>;
  isFavorite: (serviceId: string) => boolean;
  addReview: (data: Omit<Review, 'id' | 'createdAt' | 'status'>) => Promise<Review>;
  toggleReviewStatus: (reviewId: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  addSearchQuery: (query: string) => Promise<void>;
  clearSearchHistory: () => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  broadcastNotification: (data: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => Promise<NotificationItem>;
  addService: (data: Omit<TourismService, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => Promise<TourismService>;
  updateService: (service: TourismService) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addCategory: (nameVi: string, nameEn: string, icon: string, description: string) => Promise<ServiceCategory>;
  deleteCategory: (id: string) => Promise<{ success: boolean; inUseCount?: number }>;
}

const TourismContext = createContext<TourismContextType | undefined>(undefined);

export const TourismProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<TourismService[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filter, setFilter] = useState<FilterOptions>(DEFAULT_FILTER);
  const [filteredServices, setFilteredServices] = useState<TourismService[]>([]);

  // Navigation Stack
  const [currentScreen, setCurrentScreen] = useState<ScreenState>({ name: 'HOME' });
  const [navigationStack, setNavigationStack] = useState<ScreenState[]>([{ name: 'HOME' }]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [srvList, catList, favList, histList, notifList] = await Promise.all([
        tourismService.getAllServices(),
        tourismService.getCategories(),
        tourismService.getFavorites(),
        tourismService.getSearchHistory(),
        tourismService.getNotifications(),
      ]);
      setServices(srvList);
      setCategories(catList);
      setFavorites(favList);
      setSearchHistory(histList);
      setNotifications(notifList);
    } catch (e) {
      console.error('Error loading tourism data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Compute filtered services whenever search, filter or raw services change
  useEffect(() => {
    tourismService
      .filterAndSortServices(services, searchQuery, filter)
      .then(setFilteredServices);
  }, [services, searchQuery, filter]);

  // Navigation methods
  const navigate = (screen: ScreenName, params?: Partial<ScreenState>) => {
    const nextState: ScreenState = { name: screen, ...params };
    setNavigationStack(prev => [...prev, nextState]);
    setCurrentScreen(nextState);
  };

  const goBack = () => {
    if (navigationStack.length > 1) {
      const nextStack = [...navigationStack];
      nextStack.pop();
      const previous = nextStack[nextStack.length - 1];
      setNavigationStack(nextStack);
      setCurrentScreen(previous);
    } else {
      setCurrentScreen({ name: 'HOME' });
    }
  };

  const navigateToDetail = (serviceId: string) => {
    navigate('SERVICE_DETAIL', { serviceId });
  };

  const navigateToCategory = (categoryId: string) => {
    setFilter(prev => ({ ...prev, categoryId }));
    navigate('SERVICE_LIST', { categoryId });
  };

  const navigateToReviews = (serviceId: string) => {
    navigate('REVIEWS', { serviceId });
  };

  const navigateToSearch = (initialQuery?: string) => {
    if (initialQuery !== undefined) {
      setSearchQuery(initialQuery);
    }
    navigate('SEARCH');
  };

  const resetFilter = () => {
    setFilter(DEFAULT_FILTER);
  };

  // Actions
  const toggleFavorite = async (serviceId: string) => {
    const isNowFav = await tourismService.toggleFavorite(serviceId);
    setFavorites(prev =>
      isNowFav ? [...prev, serviceId] : prev.filter(id => id !== serviceId)
    );
    return isNowFav;
  };

  const isFavorite = (serviceId: string) => {
    return favorites.includes(serviceId);
  };

  const addReview = async (data: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const newRev = await tourismService.addReview(data);
    await refreshData();
    return newRev;
  };

  const toggleReviewStatus = async (reviewId: string) => {
    await tourismService.toggleReviewStatus(reviewId);
    await refreshData();
  };

  const deleteReview = async (reviewId: string) => {
    await tourismService.deleteReview(reviewId);
    await refreshData();
  };

  const addSearchQuery = async (query: string) => {
    await tourismService.addSearchHistory(query);
    const hist = await tourismService.getSearchHistory();
    setSearchHistory(hist);
  };

  const clearSearchHistory = async () => {
    await tourismService.clearSearchHistory();
    setSearchHistory([]);
  };

  const markAllNotificationsRead = async () => {
    await tourismService.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const broadcastNotification = async (data: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif = await tourismService.broadcastNotification(data);
    setNotifications(prev => [newNotif, ...prev]);
    return newNotif;
  };

  const addService = async (data: Omit<TourismService, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    const newSrv = await tourismService.addService(data);
    await refreshData();
    return newSrv;
  };

  const updateService = async (service: TourismService) => {
    await tourismService.updateService(service);
    await refreshData();
  };

  const deleteService = async (id: string) => {
    await tourismService.deleteService(id);
    await refreshData();
  };

  const addCategory = async (nameVi: string, nameEn: string, icon: string, description: string) => {
    const newCat = await tourismService.addCategory(nameVi, nameEn, icon, description);
    await refreshData();
    return newCat;
  };

  const deleteCategory = async (id: string) => {
    const res = await tourismService.deleteCategory(id);
    if (res.success) {
      await refreshData();
    }
    return res;
  };

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  return (
    <TourismContext.Provider
      value={{
        services,
        categories,
        favorites,
        searchHistory,
        notifications,
        unreadNotificationCount,
        isLoading,
        searchQuery,
        setSearchQuery,
        filter,
        setFilter,
        resetFilter,
        filteredServices,
        currentScreen,
        navigationStack,
        navigate,
        goBack,
        navigateToDetail,
        navigateToCategory,
        navigateToReviews,
        navigateToSearch,
        refreshData,
        toggleFavorite,
        isFavorite,
        addReview,
        toggleReviewStatus,
        deleteReview,
        addSearchQuery,
        clearSearchHistory,
        markAllNotificationsRead,
        broadcastNotification,
        addService,
        updateService,
        deleteService,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </TourismContext.Provider>
  );
};

export const useTourism = () => {
  const context = useContext(TourismContext);
  if (!context) {
    throw new Error('useTourism must be used within a TourismProvider');
  }
  return context;
};
