/**
 * Admin Statistics Service (Assigned to: Việt)
 * Aggregates system metrics, review counts, category breakdowns, and top ratings.
 */

import { storageService } from './storageService';

export interface CategoryStat {
  categoryId: string;
  categoryName: string;
  count: number;
  percentage: number;
}

export interface RatingStat {
  stars: number;
  count: number;
  percentage: number;
}

export interface AdminStatsSummary {
  totalServices: number;
  totalCategories: number;
  totalUsers: number;
  totalReviews: number;
  averageRating: number;
  categoryStats: CategoryStat[];
  ratingDistribution: RatingStat[];
  topServices: { id: string; name: string; rating: number; reviewCount: number; categoryName: string }[];
}

class AdminStatsService {
  async getDashboardSummary(): Promise<AdminStatsSummary> {
    const services = await storageService.getServices();
    const categories = await storageService.getCategories();
    const users = await storageService.getUsers();
    const reviews = await storageService.getReviews();

    const totalServices = services.length;
    const totalCategories = categories.length;
    const totalUsers = users.length;
    const totalReviews = reviews.length;

    // Average rating
    const totalRatingSum = services.reduce((acc, s) => acc + s.rating, 0);
    const averageRating = totalServices > 0 ? Number((totalRatingSum / totalServices).toFixed(1)) : 5.0;

    // Category breakdown
    const categoryStats: CategoryStat[] = categories.map(cat => {
      const count = services.filter(s => s.categoryId === cat.id).length;
      const percentage = totalServices > 0 ? Math.round((count / totalServices) * 100) : 0;
      return {
        categoryId: cat.id,
        categoryName: cat.nameVi,
        count,
        percentage,
      };
    });

    // Rating distribution (1 to 5 stars)
    const ratingDistribution: RatingStat[] = [5, 4, 3, 2, 1].map(stars => {
      const count = reviews.filter(r => Math.round(r.rating) === stars).length;
      const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
      return {
        stars,
        count,
        percentage,
      };
    });

    // Top 5 highest rated services
    const topServices = [...services]
      .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
      .slice(0, 5)
      .map(s => ({
        id: s.id,
        name: s.name,
        rating: s.rating,
        reviewCount: s.reviewCount,
        categoryName: s.categoryName || 'Dịch vụ',
      }));

    return {
      totalServices,
      totalCategories,
      totalUsers,
      totalReviews,
      averageRating,
      categoryStats,
      ratingDistribution,
      topServices,
    };
  }
}

export const statsService = new AdminStatsService();
