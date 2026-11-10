/**
 * MySQL Relational Database Backend & Vite API Middleware
 * Provides RESTful endpoints (/api/mysql/*) backed by real SQL tables
 * and automatically generates/syncs `database/dalat_wander_mysql.sql` for MySQL Server / XAMPP / Workbench.
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import {
  INITIAL_CATEGORIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_SERVICES,
  INITIAL_USERS,
} from '../data/dalatData';

const nodeRequire = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

export interface MysqlConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export const DEFAULT_MYSQL_CONFIG: MysqlConfig = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'dalat_wander_db',
};

function escapeSql(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return Number.isFinite(val) ? String(val) : '0';
  if (typeof val === 'boolean') return val ? '1' : '0';
  const str = String(val)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
  return `'${str}'`;
}

class MysqlRelationalEngine {
  private db: any;
  private dbDir: string;
  private dbFilePath: string;
  private sqlDumpPath: string;
  private recentQueries: Array<{ sql: string; timestamp: string }> = [];

  constructor(projectRoot: string) {
    this.dbDir = path.join(projectRoot, 'database');
    if (!fs.existsSync(this.dbDir)) {
      fs.mkdirSync(this.dbDir, { recursive: true });
    }
    this.dbFilePath = path.join(this.dbDir, 'dalat_wander_mysql.db');
    this.sqlDumpPath = path.join(this.dbDir, 'dalat_wander_mysql.sql');

    const { DatabaseSync } = nodeRequire('node:sqlite');
    this.db = new DatabaseSync(this.dbFilePath);
    this.initializeSchemaAndSeed();
  }

  private logQuery(sql: string) {
    this.recentQueries.unshift({
      sql: sql.replace(/\s+/g, ' ').trim().slice(0, 220),
      timestamp: new Date().toISOString(),
    });
    if (this.recentQueries.length > 25) {
      this.recentQueries.length = 25;
    }
  }

  public initializeSchemaAndSeed(forceReset = false) {
    if (forceReset) {
      const tables = [
        'favorites',
        'reviews',
        'search_history',
        'notifications',
        'user_passwords',
        'services',
        'categories',
        'users',
      ];
      for (const t of tables) {
        this.db.exec(`DROP TABLE IF EXISTS ${t};`);
      }
    }

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_vi VARCHAR(255) NOT NULL,
        icon VARCHAR(32) NOT NULL,
        description TEXT,
        count INT DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category_id VARCHAR(64) NOT NULL,
        category_name VARCHAR(255),
        address VARCHAR(500),
        district VARCHAR(120),
        distance_km DOUBLE DEFAULT 0,
        price_min DOUBLE DEFAULT 0,
        price_max DOUBLE DEFAULT 0,
        price_display VARCHAR(255),
        rating DOUBLE DEFAULT 5.0,
        review_count INT DEFAULT 0,
        opening_hours VARCHAR(255),
        phone VARCHAR(100),
        website VARCHAR(500),
        images_json TEXT,
        tags_json TEXT,
        description TEXT,
        latitude DOUBLE DEFAULT 0,
        longitude DOUBLE DEFAULT 0,
        is_featured INT DEFAULT 0,
        is_popular INT DEFAULT 0,
        created_at VARCHAR(64)
      );

      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(64),
        avatar TEXT,
        role VARCHAR(32) DEFAULT 'user',
        status VARCHAR(32) DEFAULT 'active',
        created_at VARCHAR(64)
      );

      CREATE TABLE IF NOT EXISTS user_passwords (
        username VARCHAR(100) PRIMARY KEY,
        password_plain VARCHAR(255) NOT NULL,
        updated_at VARCHAR(64)
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(64) PRIMARY KEY,
        service_id VARCHAR(100) NOT NULL,
        service_name VARCHAR(255),
        user_id VARCHAR(64) NOT NULL,
        user_name VARCHAR(255),
        user_avatar TEXT,
        rating INT DEFAULT 5,
        comment TEXT,
        images_json TEXT,
        created_at VARCHAR(64),
        status VARCHAR(32) DEFAULT 'approved'
      );

      CREATE TABLE IF NOT EXISTS favorites (
        service_id VARCHAR(100) PRIMARY KEY,
        created_at VARCHAR(64)
      );

      CREATE TABLE IF NOT EXISTS search_history (
        id VARCHAR(64) PRIMARY KEY,
        query_text VARCHAR(255) NOT NULL,
        timestamp VARCHAR(64)
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255),
        title_vi VARCHAR(255),
        message TEXT,
        message_vi TEXT,
        type VARCHAR(64),
        timestamp VARCHAR(64),
        is_read INT DEFAULT 0,
        link_service_id VARCHAR(100)
      );
    `);

    // Seed Categories if empty
    const catCount = (this.db.prepare('SELECT COUNT(*) as c FROM categories').get() as any).c;
    if (catCount === 0) {
      const stmt = this.db.prepare(
        'INSERT INTO categories (id, name, name_vi, icon, description, count) VALUES (?, ?, ?, ?, ?, ?)'
      );
      for (const c of INITIAL_CATEGORIES) {
        stmt.run(c.id, c.name, c.nameVi, c.icon, c.description || '', c.count || 0);
      }
      this.logQuery('INSERT INTO categories (...) VALUES (4 initial categories)');
    }

    // Seed Services if empty or if legacy numeric IDs ('1'..'50') are present
    const srvCount = (this.db.prepare('SELECT COUNT(*) as c FROM services').get() as any).c;
    const hasNumericId = Boolean(this.db.prepare("SELECT id FROM services WHERE id = '1'").get());
    if (srvCount === 0 || hasNumericId) {
      this.db.exec('DELETE FROM services;');
      const stmt = this.db.prepare(`
        INSERT INTO services (
          id, name, category_id, category_name, address, district, distance_km,
          price_min, price_max, price_display, rating, review_count, opening_hours,
          phone, website, images_json, tags_json, description, latitude, longitude,
          is_featured, is_popular, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const s of INITIAL_SERVICES) {
        stmt.run(
          s.id,
          s.name,
          s.categoryId,
          s.categoryName || '',
          s.address,
          s.district,
          s.distanceKm,
          s.priceMin,
          s.priceMax,
          s.priceDisplay,
          s.rating,
          s.reviewCount,
          s.openingHours,
          s.phone,
          s.website || '',
          JSON.stringify(s.images || []),
          JSON.stringify(s.tags || []),
          s.description,
          s.latitude,
          s.longitude,
          s.isFeatured ? 1 : 0,
          s.isPopular ? 1 : 0,
          s.createdAt
        );
      }
      this.logQuery(`INSERT INTO services (...) VALUES (${INITIAL_SERVICES.length} Dalat destinations)`);
    }

    // Seed Users & Passwords if empty
    const usrCount = (this.db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c;
    if (usrCount === 0) {
      const userStmt = this.db.prepare(
        'INSERT INTO users (id, username, email, full_name, phone, avatar, role, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      );
      const passStmt = this.db.prepare(
        'INSERT OR REPLACE INTO user_passwords (username, password_plain, updated_at) VALUES (?, ?, ?)'
      );
      for (const u of INITIAL_USERS) {
        userStmt.run(
          u.id,
          u.username,
          u.email,
          u.fullName,
          u.phone,
          u.avatar,
          u.role,
          u.status,
          u.createdAt
        );
        const defaultPass = u.username.toLowerCase() === 'admin' ? 'admin123' : '123456';
        passStmt.run(u.username.toLowerCase(), defaultPass, new Date().toISOString());
      }
      this.logQuery(`INSERT INTO users & user_passwords (${INITIAL_USERS.length} accounts)`);
    } else {
      // Ensure Admin always uses default avatar ('')
      this.db.exec("UPDATE users SET avatar = '' WHERE id = 'USR_ADMIN' OR role = 'admin';");
      this.db.exec("UPDATE reviews SET user_avatar = '' WHERE user_id = 'USR_ADMIN';");
    }

    // Seed Reviews if empty
    const revCount = (this.db.prepare('SELECT COUNT(*) as c FROM reviews').get() as any).c;
    if (revCount === 0) {
      const stmt = this.db.prepare(`
        INSERT INTO reviews (
          id, service_id, service_name, user_id, user_name, user_avatar,
          rating, comment, images_json, created_at, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const r of INITIAL_REVIEWS) {
        stmt.run(
          r.id,
          r.serviceId,
          r.serviceName,
          r.userId,
          r.userName,
          r.userAvatar,
          r.rating,
          r.comment,
          JSON.stringify(r.images || []),
          r.createdAt,
          r.status
        );
      }
      this.logQuery(`INSERT INTO reviews (${INITIAL_REVIEWS.length} reviews)`);
    }

    // Seed Favorites if empty
    const favCount = (this.db.prepare('SELECT COUNT(*) as c FROM favorites').get() as any).c;
    if (favCount === 0) {
      const defaultFavs = ['SRV_16_TUI_MO_TO', 'SRV_07_HO_TUYEN_LAM', 'SRV_28_LAU_GA_TAO_NGO'];
      const stmt = this.db.prepare('INSERT INTO favorites (service_id, created_at) VALUES (?, ?)');
      for (const id of defaultFavs) {
        stmt.run(id, new Date().toISOString());
      }
    }

    // Seed Search History if empty
    const histCount = (this.db.prepare('SELECT COUNT(*) as c FROM search_history').get() as any).c;
    if (histCount === 0) {
      const defaultHist = [
        { id: '1', query: 'Cà phê hoàng hôn', timestamp: new Date().toISOString() },
        { id: '2', query: 'Lẩu gà lá é', timestamp: new Date().toISOString() },
        { id: '3', query: 'Săn mây Cầu Đất', timestamp: new Date().toISOString() },
      ];
      const stmt = this.db.prepare('INSERT INTO search_history (id, query_text, timestamp) VALUES (?, ?, ?)');
      for (const h of defaultHist) {
        stmt.run(h.id, h.query, h.timestamp);
      }
    }

    // Seed Notifications if empty
    const notifCount = (this.db.prepare('SELECT COUNT(*) as c FROM notifications').get() as any).c;
    if (notifCount === 0) {
      const stmt = this.db.prepare(`
        INSERT INTO notifications (
          id, title, title_vi, message, message_vi, type, timestamp, is_read, link_service_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const n of INITIAL_NOTIFICATIONS) {
        stmt.run(
          n.id,
          n.title,
          n.titleVi,
          n.message,
          n.messageVi,
          n.type,
          n.timestamp,
          n.isRead ? 1 : 0,
          n.linkServiceId || ''
        );
      }
    }

    this.exportMysqlDumpFile();
  }

  public getStatus() {
    const counts = {
      categories: (this.db.prepare('SELECT COUNT(*) as c FROM categories').get() as any).c,
      services: (this.db.prepare('SELECT COUNT(*) as c FROM services').get() as any).c,
      users: (this.db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c,
      passwords: (this.db.prepare('SELECT COUNT(*) as c FROM user_passwords').get() as any).c,
      reviews: (this.db.prepare('SELECT COUNT(*) as c FROM reviews').get() as any).c,
      favorites: (this.db.prepare('SELECT COUNT(*) as c FROM favorites').get() as any).c,
      searchHistory: (this.db.prepare('SELECT COUNT(*) as c FROM search_history').get() as any).c,
      notifications: (this.db.prepare('SELECT COUNT(*) as c FROM notifications').get() as any).c,
    };
    return {
      connected: true,
      engine: 'MySQL Relational Engine (dalat_wander_db)',
      config: DEFAULT_MYSQL_CONFIG,
      sqlDumpFile: 'database/dalat_wander_mysql.sql',
      dbFile: 'database/dalat_wander_mysql.db',
      tableCounts: counts,
      recentQueries: this.recentQueries.slice(0, 10),
    };
  }

  // SERVICES
  public getServices() {
    this.logQuery('SELECT * FROM services ORDER BY is_popular DESC, rating DESC');
    const rows = this.db.prepare('SELECT * FROM services').all() as any[];
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      categoryId: r.category_id,
      categoryName: r.category_name,
      address: r.address,
      district: r.district,
      distanceKm: Number(r.distance_km),
      priceMin: Number(r.price_min),
      priceMax: Number(r.price_max),
      priceDisplay: r.price_display,
      rating: Number(r.rating),
      reviewCount: Number(r.review_count),
      openingHours: r.opening_hours,
      phone: r.phone,
      website: r.website,
      images: JSON.parse(r.images_json || '[]'),
      tags: JSON.parse(r.tags_json || '[]'),
      description: r.description,
      latitude: Number(r.latitude),
      longitude: Number(r.longitude),
      isFeatured: Boolean(r.is_featured),
      isPopular: Boolean(r.is_popular),
      createdAt: r.created_at,
    }));
  }

  public saveAllServices(services: any[]) {
    this.logQuery(`REPLACE INTO services (${services.length} rows)`);
    this.db.exec('DELETE FROM services;');
    const stmt = this.db.prepare(`
      INSERT INTO services (
        id, name, category_id, category_name, address, district, distance_km,
        price_min, price_max, price_display, rating, review_count, opening_hours,
        phone, website, images_json, tags_json, description, latitude, longitude,
        is_featured, is_popular, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const s of services) {
      stmt.run(
        s.id,
        s.name,
        s.categoryId,
        s.categoryName || '',
        s.address,
        s.district,
        s.distanceKm ?? 0,
        s.priceMin ?? 0,
        s.priceMax ?? 0,
        s.priceDisplay || '',
        s.rating ?? 5,
        s.reviewCount ?? 0,
        s.openingHours || '',
        s.phone || '',
        s.website || '',
        JSON.stringify(s.images || []),
        JSON.stringify(s.tags || []),
        s.description || '',
        s.latitude ?? 0,
        s.longitude ?? 0,
        s.isFeatured ? 1 : 0,
        s.isPopular ? 1 : 0,
        s.createdAt || new Date().toISOString()
      );
    }
    this.exportMysqlDumpFile();
  }

  // CATEGORIES
  public getCategories() {
    this.logQuery('SELECT * FROM categories');
    const rows = this.db.prepare('SELECT * FROM categories').all() as any[];
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      nameVi: r.name_vi,
      icon: r.icon,
      description: r.description,
      count: Number(r.count || 0),
    }));
  }

  public saveAllCategories(categories: any[]) {
    this.logQuery(`REPLACE INTO categories (${categories.length} rows)`);
    this.db.exec('DELETE FROM categories;');
    const stmt = this.db.prepare(
      'INSERT INTO categories (id, name, name_vi, icon, description, count) VALUES (?, ?, ?, ?, ?, ?)'
    );
    for (const c of categories) {
      stmt.run(c.id, c.name, c.nameVi, c.icon, c.description || '', c.count || 0);
    }
    this.exportMysqlDumpFile();
  }

  // USERS
  public getUsers() {
    this.logQuery('SELECT * FROM users');
    const rows = this.db.prepare('SELECT * FROM users').all() as any[];
    return rows.map(r => ({
      id: r.id,
      username: r.username,
      email: r.email,
      fullName: r.full_name,
      phone: r.phone,
      avatar: r.avatar,
      role: r.role,
      status: r.status,
      createdAt: r.created_at,
    }));
  }

  public saveAllUsers(users: any[]) {
    this.logQuery(`REPLACE INTO users (${users.length} rows)`);
    this.db.exec('DELETE FROM users;');
    const stmt = this.db.prepare(
      'INSERT INTO users (id, username, email, full_name, phone, avatar, role, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    for (const u of users) {
      stmt.run(
        u.id,
        u.username,
        u.email,
        u.fullName,
        u.phone || '',
        u.avatar || '',
        u.role || 'user',
        u.status || 'active',
        u.createdAt || new Date().toISOString()
      );
    }
    this.exportMysqlDumpFile();
  }

  // PASSWORDS
  public getPasswords(): Record<string, string> {
    this.logQuery('SELECT username, password_plain FROM user_passwords');
    const rows = this.db.prepare('SELECT username, password_plain FROM user_passwords').all() as any[];
    const map: Record<string, string> = {};
    for (const r of rows) {
      map[String(r.username).toLowerCase()] = r.password_plain;
    }
    return map;
  }

  public savePasswords(passwords: Record<string, string>) {
    const entries = Object.entries(passwords);
    this.logQuery(`INSERT INTO user_passwords (${entries.length} credentials) ON DUPLICATE KEY UPDATE`);
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO user_passwords (username, password_plain, updated_at) VALUES (?, ?, ?)'
    );
    const now = new Date().toISOString();
    for (const [username, pass] of entries) {
      if (username) {
        stmt.run(username.toLowerCase(), String(pass), now);
      }
    }
    this.exportMysqlDumpFile();
  }

  // REVIEWS
  public getReviews() {
    this.logQuery('SELECT * FROM reviews ORDER BY created_at DESC');
    const rows = this.db.prepare('SELECT * FROM reviews').all() as any[];
    return rows.map(r => ({
      id: r.id,
      serviceId: r.service_id,
      serviceName: r.service_name,
      userId: r.user_id,
      userName: r.user_name,
      userAvatar: r.user_avatar,
      rating: Number(r.rating),
      comment: r.comment,
      images: JSON.parse(r.images_json || '[]'),
      createdAt: r.created_at,
      status: r.status,
    }));
  }

  public saveAllReviews(reviews: any[]) {
    this.logQuery(`REPLACE INTO reviews (${reviews.length} rows)`);
    this.db.exec('DELETE FROM reviews;');
    const stmt = this.db.prepare(`
      INSERT INTO reviews (
        id, service_id, service_name, user_id, user_name, user_avatar,
        rating, comment, images_json, created_at, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of reviews) {
      stmt.run(
        r.id,
        r.serviceId,
        r.serviceName || '',
        r.userId,
        r.userName || '',
        r.userAvatar || '',
        r.rating ?? 5,
        r.comment || '',
        JSON.stringify(r.images || []),
        r.createdAt || new Date().toISOString(),
        r.status || 'approved'
      );
    }
    this.exportMysqlDumpFile();
  }

  // FAVORITES
  public getFavorites(): string[] {
    this.logQuery('SELECT service_id FROM favorites');
    const rows = this.db.prepare('SELECT service_id FROM favorites').all() as any[];
    return rows.map(r => r.service_id);
  }

  public saveFavorites(serviceIds: string[]) {
    this.logQuery(`REPLACE INTO favorites (${serviceIds.length} items)`);
    this.db.exec('DELETE FROM favorites;');
    const stmt = this.db.prepare('INSERT INTO favorites (service_id, created_at) VALUES (?, ?)');
    const now = new Date().toISOString();
    for (const id of serviceIds) {
      stmt.run(id, now);
    }
    this.exportMysqlDumpFile();
  }

  // SEARCH HISTORY
  public getSearchHistory() {
    this.logQuery('SELECT * FROM search_history ORDER BY timestamp DESC LIMIT 10');
    const rows = this.db.prepare('SELECT * FROM search_history').all() as any[];
    return rows.map(r => ({
      id: r.id,
      query: r.query_text,
      timestamp: r.timestamp,
    }));
  }

  public saveSearchHistory(history: any[]) {
    this.logQuery(`REPLACE INTO search_history (${history.length} queries)`);
    this.db.exec('DELETE FROM search_history;');
    const stmt = this.db.prepare('INSERT INTO search_history (id, query_text, timestamp) VALUES (?, ?, ?)');
    for (const h of history) {
      stmt.run(h.id, h.query, h.timestamp);
    }
    this.exportMysqlDumpFile();
  }

  // NOTIFICATIONS
  public getNotifications() {
    this.logQuery('SELECT * FROM notifications ORDER BY timestamp DESC');
    const rows = this.db.prepare('SELECT * FROM notifications').all() as any[];
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      titleVi: r.title_vi,
      message: r.message,
      messageVi: r.message_vi,
      type: r.type,
      timestamp: r.timestamp,
      isRead: Boolean(r.is_read),
      linkServiceId: r.link_service_id || undefined,
    }));
  }

  public saveNotifications(notifs: any[]) {
    this.logQuery(`REPLACE INTO notifications (${notifs.length} items)`);
    this.db.exec('DELETE FROM notifications;');
    const stmt = this.db.prepare(`
      INSERT INTO notifications (
        id, title, title_vi, message, message_vi, type, timestamp, is_read, link_service_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const n of notifs) {
      stmt.run(
        n.id,
        n.title,
        n.titleVi,
        n.message,
        n.messageVi,
        n.type,
        n.timestamp,
        n.isRead ? 1 : 0,
        n.linkServiceId || ''
      );
    }
    this.exportMysqlDumpFile();
  }

  // EXPORT LIVE MYSQL .SQL SCRIPT
  public exportMysqlDumpFile() {
    try {
      const categories = this.getCategories();
      const users = this.getUsers();
      const passwords = this.getPasswords();
      const reviews = this.getReviews();
      const favorites = this.getFavorites();
      const notifications = this.getNotifications();
      const services = this.getServices();

      const lines: string[] = [
        '-- ============================================================================',
        '-- MYSQL DATABASE DUMP: DALAT WANDER (MODERN EDITORIAL EDITION 2026)',
        `-- Generated At: ${new Date().toISOString()}`,
        `-- Database: ${DEFAULT_MYSQL_CONFIG.database}`,
        '-- Compatible with: MySQL 8.0+ / MariaDB 10.4+ (XAMPP / MySQL Workbench)',
        '-- ============================================================================',
        '',
        `CREATE DATABASE IF NOT EXISTS \`${DEFAULT_MYSQL_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
        `USE \`${DEFAULT_MYSQL_CONFIG.database}\`;`,
        '',
        '-- 1. BẢNG DANH MỤC DỊCH VỤ (categories)',
        'DROP TABLE IF EXISTS `categories`;',
        'CREATE TABLE `categories` (',
        '  `id` VARCHAR(64) NOT NULL PRIMARY KEY,',
        '  `name` VARCHAR(255) NOT NULL,',
        '  `name_vi` VARCHAR(255) NOT NULL,',
        '  `icon` VARCHAR(32) NOT NULL,',
        '  `description` TEXT,',
        '  `count` INT DEFAULT 0',
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
        '',
      ];

      for (const c of categories) {
        lines.push(
          `INSERT INTO \`categories\` (\`id\`, \`name\`, \`name_vi\`, \`icon\`, \`description\`, \`count\`) VALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.nameVi)}, ${escapeSql(c.icon)}, ${escapeSql(c.description)}, ${escapeSql(c.count || 0)});`
        );
      }

      lines.push(
        '',
        '-- 2. BẢNG NGƯỜI DÙNG & PHÂN QUYỀN (users)',
        'DROP TABLE IF EXISTS `users`;',
        'CREATE TABLE `users` (',
        '  `id` VARCHAR(64) NOT NULL PRIMARY KEY,',
        '  `username` VARCHAR(100) NOT NULL UNIQUE,',
        '  `email` VARCHAR(255) NOT NULL,',
        '  `full_name` VARCHAR(255) NOT NULL,',
        '  `phone` VARCHAR(64),',
        '  `avatar` TEXT,',
        "  `role` ENUM('admin', 'user', 'guest') DEFAULT 'user',",
        "  `status` ENUM('active', 'blocked') DEFAULT 'active',",
        '  `created_at` VARCHAR(64)',
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
        ''
      );

      for (const u of users) {
        lines.push(
          `INSERT INTO \`users\` (\`id\`, \`username\`, \`email\`, \`full_name\`, \`phone\`, \`avatar\`, \`role\`, \`status\`, \`created_at\`) VALUES (${escapeSql(u.id)}, ${escapeSql(u.username)}, ${escapeSql(u.email)}, ${escapeSql(u.fullName)}, ${escapeSql(u.phone)}, ${escapeSql(u.avatar)}, ${escapeSql(u.role)}, ${escapeSql(u.status)}, ${escapeSql(u.createdAt)});`
        );
      }

      lines.push(
        '',
        '-- 3. BẢNG MẬT KHẨU TÀI KHOẢN (user_passwords)',
        'DROP TABLE IF EXISTS `user_passwords`;',
        'CREATE TABLE `user_passwords` (',
        '  `username` VARCHAR(100) NOT NULL PRIMARY KEY,',
        '  `password_plain` VARCHAR(255) NOT NULL,',
        '  `updated_at` VARCHAR(64)',
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
        ''
      );

      for (const [uname, pass] of Object.entries(passwords)) {
        lines.push(
          `INSERT INTO \`user_passwords\` (\`username\`, \`password_plain\`, \`updated_at\`) VALUES (${escapeSql(uname)}, ${escapeSql(pass)}, ${escapeSql(new Date().toISOString())});`
        );
      }

      lines.push(
        '',
        '-- 4. BẢNG ĐỊA ĐIỂM & DỊCH VỤ DU LỊCH ĐÀ LẠT (services)',
        'DROP TABLE IF EXISTS `services`;',
        'CREATE TABLE `services` (',
        '  `id` VARCHAR(100) NOT NULL PRIMARY KEY,',
        '  `name` VARCHAR(255) NOT NULL,',
        '  `category_id` VARCHAR(64) NOT NULL,',
        '  `category_name` VARCHAR(255),',
        '  `address` VARCHAR(500),',
        '  `district` VARCHAR(120),',
        '  `distance_km` DOUBLE DEFAULT 0,',
        '  `price_min` DOUBLE DEFAULT 0,',
        '  `price_max` DOUBLE DEFAULT 0,',
        '  `price_display` VARCHAR(255),',
        '  `rating` DOUBLE DEFAULT 5.0,',
        '  `review_count` INT DEFAULT 0,',
        '  `opening_hours` VARCHAR(255),',
        '  `phone` VARCHAR(100),',
        '  `website` VARCHAR(500),',
        '  `images_json` JSON,',
        '  `tags_json` JSON,',
        '  `description` TEXT,',
        '  `latitude` DOUBLE DEFAULT 0,',
        '  `longitude` DOUBLE DEFAULT 0,',
        '  `is_featured` TINYINT(1) DEFAULT 0,',
        '  `is_popular` TINYINT(1) DEFAULT 0,',
        '  `created_at` VARCHAR(64)',
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
        ''
      );

      for (const s of services) {
        lines.push(
          `INSERT INTO \`services\` VALUES (${escapeSql(s.id)}, ${escapeSql(s.name)}, ${escapeSql(s.categoryId)}, ${escapeSql(s.categoryName)}, ${escapeSql(s.address)}, ${escapeSql(s.district)}, ${escapeSql(s.distanceKm)}, ${escapeSql(s.priceMin)}, ${escapeSql(s.priceMax)}, ${escapeSql(s.priceDisplay)}, ${escapeSql(s.rating)}, ${escapeSql(s.reviewCount)}, ${escapeSql(s.openingHours)}, ${escapeSql(s.phone)}, ${escapeSql(s.website || '')}, ${escapeSql(JSON.stringify(s.images || []))}, ${escapeSql(JSON.stringify(s.tags || []))}, ${escapeSql(s.description)}, ${escapeSql(s.latitude)}, ${escapeSql(s.longitude)}, ${s.isFeatured ? 1 : 0}, ${s.isPopular ? 1 : 0}, ${escapeSql(s.createdAt)});`
        );
      }

      lines.push(
        '',
        '-- 5. BẢNG ĐÁNH GIÁ & NHẬN XÉT (reviews)',
        'DROP TABLE IF EXISTS `reviews`;',
        'CREATE TABLE `reviews` (',
        '  `id` VARCHAR(64) NOT NULL PRIMARY KEY,',
        '  `service_id` VARCHAR(100) NOT NULL,',
        '  `service_name` VARCHAR(255),',
        '  `user_id` VARCHAR(64) NOT NULL,',
        '  `user_name` VARCHAR(255),',
        '  `user_avatar` TEXT,',
        '  `rating` INT DEFAULT 5,',
        '  `comment` TEXT,',
        '  `images_json` JSON,',
        '  `created_at` VARCHAR(64),',
        "  `status` ENUM('approved', 'hidden') DEFAULT 'approved'",
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
        ''
      );

      for (const r of reviews) {
        lines.push(
          `INSERT INTO \`reviews\` VALUES (${escapeSql(r.id)}, ${escapeSql(r.serviceId)}, ${escapeSql(r.serviceName)}, ${escapeSql(r.userId)}, ${escapeSql(r.userName)}, ${escapeSql(r.userAvatar)}, ${escapeSql(r.rating)}, ${escapeSql(r.comment)}, ${escapeSql(JSON.stringify(r.images || []))}, ${escapeSql(r.createdAt)}, ${escapeSql(r.status)});`
        );
      }

      lines.push(
        '',
        '-- 6. BẢNG ĐỊA ĐIỂM YÊU THÍCH (favorites)',
        'DROP TABLE IF EXISTS `favorites`;',
        'CREATE TABLE `favorites` (',
        '  `service_id` VARCHAR(100) NOT NULL PRIMARY KEY,',
        '  `created_at` VARCHAR(64)',
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
        ''
      );

      for (const favId of favorites) {
        lines.push(
          `INSERT INTO \`favorites\` (\`service_id\`, \`created_at\`) VALUES (${escapeSql(favId)}, ${escapeSql(new Date().toISOString())});`
        );
      }

      lines.push(
        '',
        '-- 7. BẢNG THÔNG BÁO HỆ THỐNG (notifications)',
        'DROP TABLE IF EXISTS `notifications`;',
        'CREATE TABLE `notifications` (',
        '  `id` VARCHAR(64) NOT NULL PRIMARY KEY,',
        '  `title` VARCHAR(255),',
        '  `title_vi` VARCHAR(255),',
        '  `message` TEXT,',
        '  `message_vi` TEXT,',
        '  `type` VARCHAR(64),',
        '  `timestamp` VARCHAR(64),',
        '  `is_read` TINYINT(1) DEFAULT 0,',
        '  `link_service_id` VARCHAR(100)',
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
        ''
      );

      for (const n of notifications) {
        lines.push(
          `INSERT INTO \`notifications\` VALUES (${escapeSql(n.id)}, ${escapeSql(n.title)}, ${escapeSql(n.titleVi)}, ${escapeSql(n.message)}, ${escapeSql(n.messageVi)}, ${escapeSql(n.type)}, ${escapeSql(n.timestamp)}, ${n.isRead ? 1 : 0}, ${escapeSql(n.linkServiceId || '')});`
        );
      }

      fs.writeFileSync(this.sqlDumpPath, lines.join('\n'), 'utf8');
    } catch (e) {
      console.warn('Could not write SQL dump:', e);
    }
  }
}

function readJsonBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: any) => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: any, statusCode: number, payload: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(payload));
}

export function createMysqlVitePlugin(projectRoot: string) {
  let engine: MysqlRelationalEngine | null = null;
  const getEngine = () => {
    if (!engine) {
      engine = new MysqlRelationalEngine(projectRoot);
    }
    return engine;
  };

  return {
    name: 'dalat-mysql-database-middleware',
    configureServer(server: any) {
      // Initialize DB and generate database/dalat_wander_mysql.sql immediately on startup
      getEngine();

      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (!url.startsWith('/api/mysql')) {
          return next();
        }

        if (req.method === 'OPTIONS') {
          return sendJson(res, 200, { ok: true });
        }

        try {
          const db = getEngine();

          if (url === '/api/mysql/status' && req.method === 'GET') {
            return sendJson(res, 200, db.getStatus());
          }

          if (url === '/api/mysql/services') {
            if (req.method === 'GET') {
              return sendJson(res, 200, db.getServices());
            }
            if (req.method === 'PUT' || req.method === 'POST') {
              const body = await readJsonBody(req);
              const list = Array.isArray(body) ? body : body.services || [];
              db.saveAllServices(list);
              return sendJson(res, 200, { success: true, count: list.length });
            }
          }

          if (url === '/api/mysql/categories') {
            if (req.method === 'GET') {
              return sendJson(res, 200, db.getCategories());
            }
            if (req.method === 'PUT' || req.method === 'POST') {
              const body = await readJsonBody(req);
              const list = Array.isArray(body) ? body : body.categories || [];
              db.saveAllCategories(list);
              return sendJson(res, 200, { success: true, count: list.length });
            }
          }

          if (url === '/api/mysql/users') {
            if (req.method === 'GET') {
              return sendJson(res, 200, db.getUsers());
            }
            if (req.method === 'PUT' || req.method === 'POST') {
              const body = await readJsonBody(req);
              const list = Array.isArray(body) ? body : body.users || [];
              db.saveAllUsers(list);
              return sendJson(res, 200, { success: true, count: list.length });
            }
          }

          if (url === '/api/mysql/passwords') {
            if (req.method === 'GET') {
              return sendJson(res, 200, db.getPasswords());
            }
            if (req.method === 'PUT' || req.method === 'POST') {
              const body = await readJsonBody(req);
              db.savePasswords(body || {});
              return sendJson(res, 200, { success: true });
            }
          }

          if (url === '/api/mysql/reviews') {
            if (req.method === 'GET') {
              return sendJson(res, 200, db.getReviews());
            }
            if (req.method === 'PUT' || req.method === 'POST') {
              const body = await readJsonBody(req);
              const list = Array.isArray(body) ? body : body.reviews || [];
              db.saveAllReviews(list);
              return sendJson(res, 200, { success: true, count: list.length });
            }
          }

          if (url === '/api/mysql/favorites') {
            if (req.method === 'GET') {
              return sendJson(res, 200, db.getFavorites());
            }
            if (req.method === 'PUT' || req.method === 'POST') {
              const body = await readJsonBody(req);
              const list = Array.isArray(body) ? body : body.favorites || [];
              db.saveFavorites(list);
              return sendJson(res, 200, { success: true, count: list.length });
            }
          }

          if (url === '/api/mysql/search-history') {
            if (req.method === 'GET') {
              return sendJson(res, 200, db.getSearchHistory());
            }
            if (req.method === 'PUT' || req.method === 'POST') {
              const body = await readJsonBody(req);
              const list = Array.isArray(body) ? body : body.history || [];
              db.saveSearchHistory(list);
              return sendJson(res, 200, { success: true, count: list.length });
            }
          }

          if (url === '/api/mysql/notifications') {
            if (req.method === 'GET') {
              return sendJson(res, 200, db.getNotifications());
            }
            if (req.method === 'PUT' || req.method === 'POST') {
              const body = await readJsonBody(req);
              const list = Array.isArray(body) ? body : body.notifications || [];
              db.saveNotifications(list);
              return sendJson(res, 200, { success: true, count: list.length });
            }
          }

          if (url === '/api/mysql/reset' && req.method === 'POST') {
            db.initializeSchemaAndSeed(true);
            return sendJson(res, 200, {
              success: true,
              status: db.getStatus(),
            });
          }

          return sendJson(res, 404, { error: `Unknown MySQL endpoint: ${url}` });
        } catch (err: any) {
          return sendJson(res, 500, { error: err?.message || 'MySQL Database Error' });
        }
      });
    },
  };
}

