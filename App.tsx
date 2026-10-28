/**
 * Dalat Tourism Service Discovery (Đà Lạt Wander)
 * Final Project (KTCK) - React Native Application
 * 
 * Team Task Division:
 * - Tuấn Anh: Auth & Người dùng (Login, Register, Forgot Password, Profile, Edit Profile)
 * - Bình: Trang chủ & Danh sách dịch vụ (Home, Service List, Categories, Service Detail)
 * - Quang: Tìm kiếm, Lọc, Sắp xếp & Chatbot AI (Search, History, Filters, AI Guide)
 * - Minh Anh: Đánh giá & Tương tác người dùng (Reviews, Add Review, Favorites, Location Map, Notifications)
 * - Việt: Quản trị hệ thống (Admin Dashboard, Services, Categories, Users, Reviews, Notifications, Stats)
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { colors } from './src/theme/colors';

// Google Mobile Ads (Bước 2: Chuẩn BinhGold24 / Google Quickstart)
import mobileAds, {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd as GoogleMobileInterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

// Context Providers
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { TourismProvider, useTourism } from './src/context/TourismContext';

// Components
import { Header } from './src/components/Header';
import { BottomNav } from './src/components/BottomNav';
import { AdBanner } from './src/components/AdBanner';
import { AppOpenAd } from './src/components/AppOpenAd';
import { InterstitialAd } from './src/components/InterstitialAd';

// Screens
import { HomeScreen } from './src/screens/home/HomeScreen';
import { ServiceListScreen } from './src/screens/service/ServiceListScreen';
import { ServiceDetailScreen } from './src/screens/service/ServiceDetailScreen';
import { SearchScreen } from './src/screens/search/SearchScreen';
import { DalatChatbotScreen } from './src/screens/chatbot/DalatChatbotScreen';
import { FavoritesScreen } from './src/screens/user/FavoritesScreen';
import { LocationMapScreen } from './src/screens/user/LocationMapScreen';
import { NotificationScreen } from './src/screens/user/NotificationScreen';
import { ReviewListScreen } from './src/screens/review/ReviewListScreen';
import { ProfileScreen } from './src/screens/user/ProfileScreen';
import { EditProfileScreen } from './src/screens/user/EditProfileScreen';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from './src/screens/auth/ForgotPasswordScreen';
import { AdminDashboardScreen } from './src/screens/admin/AdminDashboardScreen';
import { ManageServicesScreen } from './src/screens/admin/ManageServicesScreen';
import { ManageCategoriesScreen } from './src/screens/admin/ManageCategoriesScreen';
import { ManageUsersScreen } from './src/screens/admin/ManageUsersScreen';
import { ManageReviewsScreen } from './src/screens/admin/ManageReviewsScreen';
import { ManageNotificationsScreen } from './src/screens/admin/ManageNotificationsScreen';
import { AdminStatsScreen } from './src/screens/admin/AdminStatsScreen';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary captured error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorBoundaryContainer}>
          <Text style={styles.errorBoundaryEmoji}>⚠️</Text>
          <Text style={styles.errorBoundaryTitle}>Đã có lỗi hiển thị nội dung</Text>
          <Text style={styles.errorBoundaryDesc}>
            {this.state.error?.message || 'Vui lòng bấm nút bên dưới để thử lại'}
          </Text>
          <TouchableOpacity
            style={styles.errorBoundaryBtn}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.errorBoundaryBtnText}>Tải lại trang</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const MainNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { currentScreen, goBack, isLoading } = useTourism();
  const { currentUser, isLoading: authLoading } = useAuth();

  // Android hardware back button handler
  useEffect(() => {
    const onBackPress = () => {
      if (currentScreen.name !== 'HOME') {
        goBack();
        return true;
      }
      return false;
    };

    const handler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => handler.remove();
  }, [currentScreen, goBack]);

  // Google Mobile Ads Initialization (Bước 2: Khởi tạo AdMob SDK - Tuân thủ React Hook Rules)
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('Google Mobile Ads Initialized:', adapterStatuses);
      })
      .catch(err => {
        console.warn('AdMob SDK init error:', err);
      });
  }, []);

  if (isLoading || authLoading) {
    return (
      <View style={[styles.loadingCenter, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Determine which screens need top Header and Bottom Navigation
  const isAuthScreen =
    currentScreen.name === 'LOGIN' ||
    currentScreen.name === 'REGISTER' ||
    currentScreen.name === 'FORGOT_PASSWORD';

  const isDetailScreen = currentScreen.name === 'SERVICE_DETAIL';

  const showBottomNav =
    currentScreen.name === 'HOME' ||
    currentScreen.name === 'SERVICE_LIST' ||
    currentScreen.name === 'SEARCH' ||
    currentScreen.name === 'CHATBOT' ||
    currentScreen.name === 'PROFILE';

  const showHeader = !isAuthScreen && !isDetailScreen;

  const renderActiveScreen = () => {
    switch (currentScreen.name) {
      // Auth & Profile (Tuấn Anh)
      case 'LOGIN':
        return <LoginScreen />;
      case 'REGISTER':
        return <RegisterScreen />;
      case 'FORGOT_PASSWORD':
        return <ForgotPasswordScreen />;
      case 'PROFILE':
        return <ProfileScreen />;
      case 'EDIT_PROFILE':
        return <EditProfileScreen />;

      // Home & Services (Bình)
      case 'HOME':
        return <HomeScreen />;
      case 'SERVICE_LIST':
        return <ServiceListScreen />;
      case 'SERVICE_DETAIL':
        return <ServiceDetailScreen serviceId={currentScreen.serviceId} />;

      // Search & Chatbot (Quang)
      case 'SEARCH':
        return <SearchScreen />;
      case 'CHATBOT':
        return <DalatChatbotScreen />;

      // Reviews & User Interactions (Minh Anh)
      case 'REVIEWS':
        return <ReviewListScreen serviceId={currentScreen.serviceId} />;
      case 'FAVORITES':
        return <FavoritesScreen />;
      case 'LOCATION_MAP':
        return <LocationMapScreen />;
      case 'NOTIFICATIONS':
        return <NotificationScreen />;

      // Admin Management (Việt)
      case 'ADMIN_DASHBOARD':
        return <AdminDashboardScreen />;
      case 'ADMIN_SERVICES':
        return <ManageServicesScreen />;
      case 'ADMIN_CATEGORIES':
        return <ManageCategoriesScreen />;
      case 'ADMIN_USERS':
        return <ManageUsersScreen />;
      case 'ADMIN_REVIEWS':
        return <ManageReviewsScreen />;
      case 'ADMIN_NOTIFICATIONS':
        return <ManageNotificationsScreen />;
      case 'ADMIN_STATS':
        return <AdminStatsScreen />;

      default:
        return <HomeScreen />;
    }
  };

  return (
    <View
      style={[
        styles.rootContainer,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {showHeader && <Header showBack={currentScreen.name !== 'HOME'} />}
      <View style={styles.screenContainer}>
        <ErrorBoundary>{renderActiveScreen()}</ErrorBoundary>
      </View>

      {/* Google AdMob Banner Ads ở bottom (Mỗi screen đều có banner ads ở bottom theo chuẩn BinhGold24) */}
      <View style={styles.bottomBannerWrapper}>
        <BannerAd
          unitId={TestIds.BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>

      {showBottomNav && <BottomNav />}
      <AppOpenAd />
      <InterstitialAd />
    </View>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <LanguageProvider>
          <AuthProvider>
            <TourismProvider>
              <MainNavigator />
            </TourismProvider>
          </AuthProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorBoundaryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  errorBoundaryEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  errorBoundaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EF4444',
    marginBottom: 6,
  },
  errorBoundaryDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  errorBoundaryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorBoundaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  bottomBannerWrapper: {
    width: '100%',
    zIndex: 10,
  },
});
