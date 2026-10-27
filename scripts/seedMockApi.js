/**
 * Script đẩy dữ liệu du lịch Đà Lạt lên MockAPI
 * Chạy lệnh: node scripts/seedMockApi.js
 */

const BASE_URL = 'https://6ae06df9be3bc8fead97313e.mockapi.io/api/v1';

// Dữ liệu danh mục
const CATEGORIES = [
  {
    id: 'CAT_ATTRACTION',
    name: 'Attractions & Heritage',
    nameVi: 'Điểm tham quan & Di tích',
    icon: '🏛️',
    description: 'Thắng cảnh tự nhiên, công trình kiến trúc và di tích lịch sử nổi tiếng tại Đà Lạt.',
  },
  {
    id: 'CAT_CAFE',
    name: 'Cafes & Photo Spots',
    nameVi: 'Cà phê & Check-in sống ảo',
    icon: '☕',
    description: 'Quán cà phê view thung lũng, săn mây, ngắm hoàng hôn và phong cách vintage lãng mạn.',
  },
  {
    id: 'CAT_STAY',
    name: 'Homestays & Resorts',
    nameVi: 'Khách sạn & Homestay',
    icon: '🏡',
    description: 'Nơi lưu trú view đồi thông, nhà gỗ ấm cúng và resort nghỉ dưỡng cao cấp.',
  },
  {
    id: 'CAT_FOOD',
    name: 'Local Food & Street Food',
    nameVi: 'Ẩm thực & Món ngon phố núi',
    icon: '🍲',
    description: 'Lẩu gà lá é, lẩu bò Ba Toa, bánh tráng nướng, sữa đậu nành nóng hổi.',
  },
  {
    id: 'CAT_TOUR',
    name: 'Tours & Experiences',
    nameVi: 'Tour & Trải nghiệm thực tế',
    icon: '🎒',
    description: 'Tour săn mây Cầu Đất lúc bình minh, cắm trại qua đêm, hái dâu tây tại vườn.',
  },
];

// Dữ liệu dịch vụ tiêu biểu
const SERVICES = [
  {
    name: 'Tiệm Cà Phê Túi Mơ To',
    categoryId: 'CAT_CAFE',
    address: 'Hẻm 31 Sào Nam, Phường 11, TP. Đà Lạt',
    district: 'Phường 11',
    distanceKm: 5.8,
    priceMin: 45000,
    priceMax: 85000,
    priceDisplay: '45.000đ - 85.000đ',
    rating: 4.8,
    reviewCount: 342,
    openingHours: '07:00 - 21:30',
    phone: '0938 123 456',
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['Hoàng hôn', 'Cúc họa mi', 'Nhà lồng', 'Sống ảo'],
    description: 'Quán cà phê nhà gỗ view thung lũng đèn lồng tuyệt đẹp với vườn cúc họa mi trắng muốt nở rộ.',
    latitude: 11.9423,
    longitude: 108.4812,
    isFeatured: true,
    isPopular: true,
  },
  {
    name: 'Đồi Chè Cầu Đất & Săn Mây Panorama',
    categoryId: 'CAT_TOUR',
    address: 'Thôn Cầu Đất, Xã Xuân Trường, TP. Đà Lạt',
    district: 'Xuân Trường',
    distanceKm: 23.5,
    priceMin: 60000,
    priceMax: 120000,
    priceDisplay: '60.000đ - 120.000đ',
    rating: 4.9,
    reviewCount: 512,
    openingHours: '04:30 - 17:30',
    phone: '0909 789 012',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['Săn mây', 'Đồi chè', 'Tua-bin gió', 'Bình minh'],
    description: 'Điểm săn mây huyền thoại vào sớm tinh mơ (4h30 - 6h00) ngắm biển mây cuộn trào bồng bềnh.',
    latitude: 11.8541,
    longitude: 108.5723,
    isFeatured: true,
    isPopular: true,
  },
  {
    name: 'Lẩu Gà Lá É Tao Ngộ',
    categoryId: 'CAT_FOOD',
    address: 'Số 5 đường 3 Tháng 4, Phường 3, TP. Đà Lạt',
    district: 'Phường 3',
    distanceKm: 1.8,
    priceMin: 200000,
    priceMax: 350000,
    priceDisplay: '200.000đ - 350.000đ',
    rating: 4.6,
    reviewCount: 680,
    openingHours: '09:00 - 22:00',
    phone: '0977 456 789',
    images: [
      'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['Đặc sản', 'Ấm áp', 'Lẩu gà', 'Lá é'],
    description: 'Món ăn trứ danh sưởi ấm đêm lạnh Đà Lạt với nước lẩu ngọt thanh chua cay nồng nàn vị lá é.',
    latitude: 11.9312,
    longitude: 108.4412,
    isFeatured: true,
    isPopular: true,
  },
  {
    name: 'Cung Nam Phương Hoàng Hậu (Dinh I)',
    categoryId: 'CAT_ATTRACTION',
    address: 'Số 1 Trần Quang Diệu, Phường 10, TP. Đà Lạt',
    district: 'Phường 10',
    distanceKm: 4.2,
    priceMin: 50000,
    priceMax: 90000,
    priceDisplay: '50.000đ - 90.000đ',
    rating: 4.7,
    reviewCount: 290,
    openingHours: '07:30 - 17:30',
    phone: '0263 382 2222',
    images: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['Lịch sử', 'Kiến trúc Pháp', 'Rừng thông', 'Cổ kính'],
    description: 'Dinh thự mang đậm dấu ấn kiến trúc tân cổ điển châu Âu giữa rừng thông cổ thụ tuyệt đẹp.',
    latitude: 11.9284,
    longitude: 108.4682,
    isFeatured: false,
    isPopular: true,
  },
  {
    name: 'Bình Yên House Homestay',
    categoryId: 'CAT_STAY',
    address: 'Tổ 7, Thôn Đa Lộc, Xã Xuân Thọ, TP. Đà Lạt',
    district: 'Xuân Thọ',
    distanceKm: 11.5,
    priceMin: 450000,
    priceMax: 900000,
    priceDisplay: '450.000đ - 900.000đ/đêm',
    rating: 4.8,
    reviewCount: 175,
    openingHours: 'Cả ngày (24/7)',
    phone: '0912 345 678',
    images: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['Homestay', 'View thung lũng', 'Mộc mạc', 'Yên tĩnh'],
    description: 'Căn nhà gỗ nhỏ trên lưng chừng đồi, mở cửa sổ ra là thấy thung lũng hoa và mây trôi lững lờ.',
    latitude: 11.9542,
    longitude: 108.5121,
    isFeatured: false,
    isPopular: true,
  },
];

async function seed() {
  console.log('--- BẮT ĐẦU ĐỒNG BỘ DỮ LIỆU LÊN MOCKAPI ---');
  console.log(`Endpoint: ${BASE_URL}\n`);

  // 1. Đồng bộ Categories
  console.log('1. Đang tải lên danh mục (categories)...');
  for (const cat of CATEGORIES) {
    try {
      const res = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat),
      });
      if (res.ok) {
        console.log(`   [OK] Đã tạo danh mục: ${cat.nameVi}`);
      } else {
        console.log(`   [FAIL ${res.status}] Chưa tạo được: ${cat.nameVi} (Hãy tạo resource 'categories' trên web MockAPI trước)`);
      }
    } catch (e) {
      console.log(`   [ERROR] ${cat.nameVi}: ${e.message}`);
    }
  }

  // 2. Đồng bộ Services
  console.log('\n2. Đang tải lên dịch vụ (services)...');
  for (const srv of SERVICES) {
    try {
      const res = await fetch(`${BASE_URL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(srv),
      });
      if (res.ok) {
        console.log(`   [OK] Đã tạo dịch vụ: ${srv.name}`);
      } else {
        console.log(`   [FAIL ${res.status}] Chưa tạo được: ${srv.name} (Hãy tạo resource 'services' trên web MockAPI trước)`);
      }
    } catch (e) {
      console.log(`   [ERROR] ${srv.name}: ${e.message}`);
    }
  }

  console.log('\n--- HOÀN TẤT KIỂM TRA ĐỒNG BỘ ---');
}

seed();
