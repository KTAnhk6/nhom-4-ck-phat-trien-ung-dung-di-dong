/**
 * CẨM NANG HƯỚNG DẪN DU LỊCH ĐÀ LẠT
 * BẢN ĐỒ 50 TỌA ĐỘ DU LỊCH, CAFE, ẨM THỰC VÀ LƯU TRÚ TUYỂN CHỌN
 * (Đo đạc cự ly chính xác từ mốc trung tâm: Chợ Đà Lạt)
 * Cập nhật tháng 11/2026
 */

import {
  DalatWeather,
  NotificationItem,
  Review,
  ServiceCategory,
  TourismService,
  User,
} from '../types';

export interface TravelRoute {
  id: string;
  name: string;
  direction: string;
  waypoints: string[];
  schedule: string[];
}

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    "id": "CAT_ATTRACTION",
    "name": "Attractions & Sightseeing",
    "nameVi": "Điểm tham quan & Danh thắng",
    "icon": "🏛️",
    "description": "15 di tích lịch sử, cảnh quan thiên nhiên và thắng cảnh nổi tiếng tại xứ hoa đào.",
    "count": 15
  },
  {
    "id": "CAT_CAFE",
    "name": "Cafes & Photo Spots",
    "nameVi": "Quán Cafe view đẹp & Sống ảo",
    "icon": "☕",
    "description": "12 tọa độ cafe săn mây, ngắm thung lũng đèn đêm và những không gian âm nhạc acoustic lãng mạn.",
    "count": 12
  },
  {
    "id": "CAT_FOOD",
    "name": "Dining & Local Cuisine",
    "nameVi": "Quán ăn & Đặc sản nức tiếng",
    "icon": "🍲",
    "description": "13 tinh hoa ẩm thực phố núi từ lẩu nghi ngút khói đến các món ăn vặt đường phố trứ danh.",
    "count": 13
  },
  {
    "id": "CAT_STAY",
    "name": "Hotels, Resorts & Homestays",
    "nameVi": "Khách sạn, Resort & Homestay",
    "icon": "🏡",
    "description": "10 lựa chọn lưu trú từ khách sạn cổ điển 5 sao, resort hồ Tuyền Lâm đến các homestay view thung lũng.",
    "count": 10
  }
];

export const INITIAL_SERVICES: TourismService[] = [
  {
    "id": "SRV_01_QUANG_TRUONG_LAM_VIEN",
    "name": "Quảng trường Lâm Viên",
    "categoryId": "CAT_ATTRACTION",
    "categoryName": "Điểm tham quan & Danh thắng",
    "address": "Đ. Trần Quốc Toản, Phường 1, TP. Đà Lạt",
    "district": "Phường 1",
    "distanceKm": 1.3,
    "priceMin": 0,
    "priceMax": 0,
    "priceDisplay": "Miễn phí",
    "rating": 4.8,
    "reviewCount": 920,
    "openingHours": "Mở cửa 24/7",
    "phone": "0263 382 2222",
    "website": "https://maps.google.com/?q=Quang%20Truong%20Lam%20Vien%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/quang-truong-lam-vien-bieu-tuong-cua-thanh-pho-da-lat-tho-mong-1634561275.jpg"
    ],
    "tags": [
      "Biểu tượng",
      "Nụ Atiso",
      "Hoa Dã Quỳ",
      "Hồ Xuân Hương",
      "Trung tâm",
      "Check-in"
    ],
    "description": "Biểu tượng nụ Atiso & dã quỳ khổng lồ bằng kính màu; trung tâm mua sắm, rạp phim Go! phía dưới.",
    "latitude": 11.9366,
    "longitude": 108.4452,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-01T08:00:00Z"
  },
  {
    "id": "SRV_02_HO_XUAN_HUONG",
    "name": "Hồ Xuân Hương",
    "categoryId": "CAT_ATTRACTION",
    "categoryName": "Điểm tham quan & Danh thắng",
    "address": "Trung tâm Phường 1, TP. Đà Lạt",
    "district": "Phường 1",
    "distanceKm": 0.3,
    "priceMin": 0,
    "priceMax": 100000,
    "priceDisplay": "Miễn phí (Vịt: 60k - 100k/h)",
    "rating": 4.9,
    "reviewCount": 1150,
    "openingHours": "Mở cửa 24/7",
    "phone": "0263 382 1234",
    "website": "https://maps.google.com/?q=Ho%20Xuan%20Huong%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/ho-xuan-huong-diem-den-chua-bao-gio-cu-cua-thanh-pho-mong-mo-1634531109.jpg"
    ],
    "tags": [
      "Trái tim Đà Lạt",
      "Đạp vịt",
      "Xe đạp đôi",
      "Hoàng hôn",
      "Đi dạo",
      "Hồ nước"
    ],
    "description": "Trái tim Đà Lạt; lý tưởng đi dạo sớm, thuê xe đạp đôi quanh hồ (5km) hoặc đón hoàng hôn chiều tà.",
    "latitude": 11.9404,
    "longitude": 108.445,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-01T08:30:00Z"
  },
  {
    "id": "SRV_03_GA_DA_LAT",
    "name": "Ga Đà Lạt",
    "categoryId": "CAT_ATTRACTION",
    "categoryName": "Điểm tham quan & Danh thắng",
    "address": "Đ. Quang Trung, Phường 9, TP. Đà Lạt",
    "district": "Phường 9",
    "distanceKm": 2.8,
    "priceMin": 50000,
    "priceMax": 150000,
    "priceDisplay": "50.000đ/vé (Tàu: 100k - 150k)",
    "rating": 4.7,
    "reviewCount": 560,
    "openingHours": "07:30 - 17:30",
    "phone": "0263 383 4409",
    "website": "https://maps.google.com/?q=Ga%20Da%20Lat%20Quang%20Trung",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/check-in-ga-da-lat-ga-xe-lua-co-nhat-dong-duong-1634469716.jpg"
    ],
    "tags": [
      "Nhà ga cổ",
      "Kiến trúc Art Deco",
      "Tàu hơi nước",
      "Trại Mát",
      "Check-in cổ điển"
    ],
    "description": "Nhà ga cổ nhất Đông Dương kiến trúc Art Deco 3 chóp nhọn; trải nghiệm tàu hơi nước cổ đi Trại Mát.",
    "latitude": 11.9416,
    "longitude": 108.4586,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-02T09:00:00Z"
  },
  {
    "id": "SRV_04_DINH_1_BAO_DAI",
    "name": "Dinh I Bảo Đại (King Palace)",
    "categoryId": "CAT_ATTRACTION",
    "categoryName": "Điểm tham quan & Danh thắng",
    "address": "Đ. Trần Quang Diệu, Phường 10, TP. Đà Lạt",
    "district": "Phường 10",
    "distanceKm": 4.5,
    "priceMin": 90000,
    "priceMax": 150000,
    "priceDisplay": "90.000đ/vé (Trọn gói: 150.000đ)",
    "rating": 4.7,
    "reviewCount": 380,
    "openingHours": "07:30 - 17:30",
    "phone": "0263 382 2222",
    "website": "https://maps.google.com/?q=Dinh%201%20Bao%20Dai%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/dinh-1-da-lat-dinh-bao-dai-dinh-thu-do-so-kieu-au-giua-rung-thong-da-lat-1634544071.jpg"
    ],
    "tags": [
      "King Palace",
      "Biệt điện Bảo Đại",
      "Quý tộc Pháp",
      "Rừng tràm",
      "Lịch sử"
    ],
    "description": "Biệt điện nguy nga trên đồi thông cao nguyên; đậm chất quý tộc Pháp với rừng tràm cổ kính.",
    "latitude": 11.9307,
    "longitude": 108.4682,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-02T10:00:00Z"
  },
  {
    "id": "SRV_05_DINH_3_BAO_DAI",
    "name": "Dinh III Bảo Đại",
    "categoryId": "CAT_ATTRACTION",
    "categoryName": "Điểm tham quan & Danh thắng",
    "address": "Đ. Triệu Việt Vương, Phường 4, TP. Đà Lạt",
    "district": "Phường 4",
    "distanceKm": 2.5,
    "priceMin": 40000,
    "priceMax": 40000,
    "priceDisplay": "40.000đ/vé",
    "rating": 4.6,
    "reviewCount": 420,
    "openingHours": "07:00 - 17:30",
    "phone": "0263 382 2493",
    "website": "https://maps.google.com/?q=Dinh%203%20Bao%20Dai%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/dinh-3-da-lat-biet-dien-vua-bao-dai-kham-pha-kien-truc-co-dien-phap-tai-da-lat-1634649988.jpg"
    ],
    "tags": [
      "Dinh Bảo Đại",
      "Triều Nguyễn",
      "Lịch sử",
      "Hiện vật nguyên vẹn",
      "Đồi thông"
    ],
    "description": "Nơi làm việc và sinh hoạt của gia đình vua Bảo Đại; lưu giữ nguyên vẹn nội thất và hiện vật triều Nguyễn.",
    "latitude": 11.9304,
    "longitude": 108.4299,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-03T08:00:00Z"
  },
  {
    "id": "SRV_06_THIEN_VIEN_TRUC_LAM",
    "name": "Thiền Viện Trúc Lâm",
    "categoryId": "CAT_ATTRACTION",
    "categoryName": "Điểm tham quan & Danh thắng",
    "address": "Đ. Hoa Cẩm Tú Cầu, Phường 3, TP. Đà Lạt",
    "district": "Phường 3",
    "distanceKm": 5.5,
    "priceMin": 0,
    "priceMax": 150000,
    "priceDisplay": "Miễn phí (Cáp treo: 150k khứ hồi)",
    "rating": 4.9,
    "reviewCount": 840,
    "openingHours": "05:00 - 18:00",
    "phone": "0263 382 7565",
    "website": "https://maps.google.com/?q=Thien%20Vien%20Truc%20Lam%20Da%20Lat",
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/e/ee/Zen_Monastery_Truc_Lam_Da_Lat.JPG"
    ],
    "tags": [
      "Thiền viện",
      "Núi Phụng Hoàng",
      "Hồ Tuyền Lâm",
      "Cáp treo",
      "Tâm linh",
      "Thanh tịnh"
    ],
    "description": "Cụm thiền viện phái Trúc Lâm lớn nhất Lâm Đồng trên núi Phụng Hoàng; ngắm nhìn toàn cảnh hồ Tuyền Lâm.",
    "latitude": 11.9048,
    "longitude": 108.435,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-03T09:00:00Z"
  },
  {
    "id": "SRV_07_HO_TUYEN_LAM",
    "name": "Hồ Tuyền Lâm",
    "categoryId": "CAT_ATTRACTION",
    "categoryName": "Điểm tham quan & Danh thắng",
    "address": "Khu du lịch Tuyền Lâm, Phường 4, TP. Đà Lạt",
    "district": "Phường 4",
    "distanceKm": 6.5,
    "priceMin": 0,
    "priceMax": 350000,
    "priceDisplay": "Miễn phí (SUP: 250k - 350k)",
    "rating": 4.9,
    "reviewCount": 780,
    "openingHours": "Mở cửa 24/7",
    "phone": "0263 388 8999",
    "website": "https://maps.google.com/?q=Ho%20Tuyen%20Lam%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/chinh-phuc-net-dep-nen-tho-tai-ho-tuyen-lam-da-lat-1752897999.jpg"
    ],
    "tags": [
      "Sinh thái",
      "Chèo SUP",
      "Cắm trại",
      "Rừng thông ven hồ",
      "Nước ngọt",
      "Hoang sơ"
    ],
    "description": "Khu bảo tồn sinh thái nước ngọt hoang sơ; trải nghiệm chèo thuyền SUP sáng sớm, cắm trại thông ven hồ.",
    "latitude": 11.8953,
    "longitude": 108.4237,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-04T07:30:00Z"
  },
  {
    "id": "SRV_08_CHUA_LINH_PHUOC",
    "name": "Chùa Linh Phước (Chùa Ve Chai)",
    "categoryId": "CAT_ATTRACTION",
    "categoryName": "Điểm tham quan & Danh thắng",
    "address": "120 Tự Phước, Trại Mát, TP. Đà Lạt",
    "district": "Trại Mát",
    "distanceKm": 9,
    "priceMin": 0,
    "priceMax": 0,
    "priceDisplay": "Miễn phí",
    "rating": 4.8,
    "reviewCount": 650,
    "openingHours": "06:30 - 17:30",
    "phone": "0263 370 0109",
    "website": "https://maps.google.com/?q=Chua%20Linh%20Phuoc%20Trai%20Mat%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/chua-linh-phuoc-chua-ve-chai-kham-pha-ngoi-chua-co-11-cai-nhat-va-kien-truc-dac-sac-o-da-lat-1634571814.jpg"
    ],
    "tags": [
      "Chùa Ve Chai",
      "Tượng rồng 49m",
      "Kỷ lục",
      "Mảnh chén sứ",
      "Tâm linh",
      "Trại Mát"
    ],
    "description": "Ngôi chùa giữ nhiều kỷ lục; khảm từ hàng triệu mảnh chén sứ vỡ; tượng rồng dài 49m uốn quanh sân chùa.",
    "latitude": 11.9442,
    "longitude": 108.4989,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-04T11:00:00Z"
  },
  {
    "id": "SRV_09_THAC_DATANLA",
    "name": "Thác Datanla",
    "categoryId": "CAT_ATTRACTION",
    "categoryName": "Điểm tham quan & Danh thắng",
    "address": "Đèo Prenn, QL20, Phường 3, TP. Đà Lạt",
    "district": "Phường 3",
    "distanceKm": 6.5,
    "priceMin": 50000,
    "priceMax": 250000,
    "priceDisplay": "Vé vào: 50.000đ (Máng trượt: 200k - 250k)",
    "rating": 4.8,
    "reviewCount": 890,
    "openingHours": "07:00 - 17:00",
    "phone": "0263 353 3899",
    "website": "https://maps.google.com/?q=Thac%20Datanla%20Deo%20Prenn%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/kham-pha-su-hap-dan-ben-trong-thac-datanla-giua-long-da-lat-mong-mo-1634632325.jpg"
    ],
    "tags": [
      "Thác nước",
      "Máng trượt 2400m",
      "Đu dây Zipline",
      "High Rope",
      "Cảm giác mạnh"
    ],
    "description": "Hệ thống máng trượt uốn lượn xuyên rừng thông dài nhất ĐNÁ (2.400m); trò đu dây zipline mạo hiểm High Rope.",
    "latitude": 11.9029,
    "longitude": 108.4485,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-05T08:00:00Z"
  },
  {
    "id": "SRV_10_THAC_PONGOUR",
    "name": "Thác Pongour",
    "categoryId": "CAT_ATTRACTION",
    "categoryName": "Điểm tham quan & Danh thắng",
    "address": "Xã Tân Thành, Huyện Đức Trọng, Lâm Đồng",
    "district": "Đức Trọng",
    "distanceKm": 48,
    "priceMin": 40000,
    "priceMax": 40000,
    "priceDisplay": "40.000đ/vé",
    "rating": 4.8,
    "reviewCount": 450,
    "openingHours": "07:00 - 17:30",
    "phone": "0263 367 7899",
    "website": "https://maps.google.com/?q=Thac%20Pongour%20Duc%20Trong%20Lam%20Dong",
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/8/84/Pongour_Falls_%286226122698%29.jpg"
    ],
    "tags": [
      "Nam thiên đệ nhất thác",
      "Thác 7 tầng",
      "Kỳ vĩ",
      "Bậc thềm đá",
      "Dã ngoại"
    ],
    "description": "Được mệnh danh 'Nam thiên đệ nhất thác'; bậc thềm đá tự nhiên 7 tầng kỳ vĩ, nước đổ trắng xóa bồng bềnh.",
    "latitude": 11.6888,
    "longitude": 108.2612,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-05T10:00:00Z"
  },
  {
    "id": "SRV_11_DINH_LANGBIANG",
    "name": "Đỉnh Langbiang",
    "categoryId": "CAT_ATTRACTION",
    "categoryName": "Điểm tham quan & Danh thắng",
    "address": "Thị trấn Lạc Dương, Huyện Lạc Dương, Lâm Đồng",
    "district": "Lạc Dương",
    "distanceKm": 12,
    "priceMin": 50000,
    "priceMax": 170000,
    "priceDisplay": "Vé: 50.000đ (Jeep: 120k/người)",
    "rating": 4.8,
    "reviewCount": 910,
    "openingHours": "07:00 - 17:30",
    "phone": "0263 383 9456",
    "website": "https://maps.google.com/?q=Khu%20du%20lich%20Langbiang%20Lac%20Duong",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/kham-pha-dinh-langbiang-noc-nha-cua-da-lat-1634525301.jpg"
    ],
    "tags": [
      "Nóc nhà Tây Nguyên",
      "Đỉnh 2167m",
      "Xe Jeep địa hình",
      "Đỉnh Ra-đa",
      "Suối Vàng Suối Bạc"
    ],
    "description": "Nóc nhà Tây Nguyên (2.167m); đi xe Jeep địa hình chinh phục đỉnh Ra-đa ngắm suối Vàng suối Bạc thơ mộng.",
    "latitude": 12.0469,
    "longitude": 108.4357,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-06T08:00:00Z"
  },
  {
    "id": "SRV_12_DOI_CHE_CAU_DAT",
    "name": "Đồi chè Cầu Đất",
    "categoryId": "CAT_ATTRACTION",
    "categoryName": "Điểm tham quan & Danh thắng",
    "address": "Thôn Trường Thọ, Trạm Hành, TP. Đà Lạt",
    "district": "Trạm Hành",
    "distanceKm": 24,
    "priceMin": 0,
    "priceMax": 100000,
    "priceDisplay": "Miễn phí (Cầu gỗ săn mây: 50k - 100k)",
    "rating": 4.9,
    "reviewCount": 980,
    "openingHours": "05:00 - 17:30",
    "phone": "0263 383 8180",
    "website": "https://maps.google.com/?q=Doi%20che%20Cau%20Dat%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/doi-che-cau-dat-coffee-nong-trai-tu-nhung-nam-1927-1635303396.jpg"
    ],
    "tags": [
      "Săn mây",
      "Đồi chè Cầu Đất",
      "Điện gió",
      "Bình minh 5h30",
      "Cầu gỗ"
    ],
    "description": "Thảm chè xanh ngắt trăm tuổi, cánh quạt điện gió khổng lồ; điểm săn mây bình minh đẹp nhất Đà Lạt lúc 5h30.",
    "latitude": 11.8548,
    "longitude": 108.5728,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-06T09:00:00Z"
  },
  {
    "id": "SRV_13_DOMAINE_DE_MARIE",
    "name": "Nhà thờ Domaine de Marie",
    "categoryId": "CAT_ATTRACTION",
    "categoryName": "Điểm tham quan & Danh thắng",
    "address": "01 Ngô Quyền, Phường 6, TP. Đà Lạt",
    "district": "Phường 6",
    "distanceKm": 2.2,
    "priceMin": 0,
    "priceMax": 0,
    "priceDisplay": "Miễn phí",
    "rating": 4.7,
    "reviewCount": 520,
    "openingHours": "07:00 - 17:00",
    "phone": "0263 382 3422",
    "website": "https://maps.google.com/?q=Nha%20tho%20Domaine%20de%20Marie%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/nha-tho-domaine-de-marie-dau-an-chau-au-giua-long-da-lat-1634674804.jpg"
    ],
    "tags": [
      "Nhà thờ hồng cam",
      "Nhà rông Tây Nguyên",
      "Kiến trúc Pháp",
      "Áo len",
      "Check-in"
    ],
    "description": "Kiến trúc giao thoa giữa nhà rông Tây Nguyên và giáo đường Pháp; màu sơn hồng cam đặc trưng không tháp chuông.",
    "latitude": 11.9472,
    "longitude": 108.4285,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-07T08:00:00Z"
  },
  {
    "id": "SRV_14_NHA_THO_CON_GA",
    "name": "Nhà thờ Con Gà (Chính tòa)",
    "categoryId": "CAT_ATTRACTION",
    "categoryName": "Điểm tham quan & Danh thắng",
    "address": "17 Trần Phú, Phường 3, TP. Đà Lạt",
    "district": "Phường 3",
    "distanceKm": 1,
    "priceMin": 0,
    "priceMax": 0,
    "priceDisplay": "Miễn phí",
    "rating": 4.7,
    "reviewCount": 610,
    "openingHours": "05:30 - 18:30",
    "phone": "0263 382 1421",
    "website": "https://maps.google.com/?q=Nha%20tho%20Chinh%20Toa%20Da%20Lat%2017%20Tran%20Phu",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/nha-tho-con-ga-dam-say-truoc-ve-dep-chau-au-co-kinh-giua-long-da-lat-1634401421.jpg"
    ],
    "tags": [
      "Nhà thờ Con Gà",
      "Chính tòa",
      "Tháp chuông 47m",
      "Kiến trúc Roman",
      "Cổ nhất thành phố"
    ],
    "description": "Nhà thờ Công giáo Roma cổ nhất thành phố; tượng gà trống bằng đồng rỗng trên đỉnh tháp chuông cao 47m.",
    "latitude": 11.9358,
    "longitude": 108.4371,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-07T10:00:00Z"
  },
  {
    "id": "SRV_15_KDL_CHUON_CHUON",
    "name": "KDL Chuồn Chuồn",
    "categoryId": "CAT_ATTRACTION",
    "categoryName": "Điểm tham quan & Danh thắng",
    "address": "Mê Linh, Tà Nung, TP. Đà Lạt",
    "district": "Tà Nung",
    "distanceKm": 18,
    "priceMin": 100000,
    "priceMax": 100000,
    "priceDisplay": "100.000đ/vé (Bao gồm nước uống)",
    "rating": 4.7,
    "reviewCount": 390,
    "openingHours": "07:30 - 17:30",
    "phone": "0263 359 8899",
    "website": "https://maps.google.com/?q=KDL%20Chuon%20Chuon%20Me%20Linh%20Ta%20Nung%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/khu-du-lich-chuon-chuon-khong-gian-phuc-hop-cuc-chill-tai-da-lat-1722219024.jpg"
    ],
    "tags": [
      "Tháp Vọng Cảnh 360",
      "Đèo Tà Nung",
      "Hồ vô cực",
      "Hoa tam giác mạch",
      "Check-in cảnh đẹp"
    ],
    "description": "Tháp Vọng Cảnh 360 độ nhiều tầng nhìn ra đèo Tà Nung, hồ vô cực, đồi hoa tam giác mạch và cà phê bạt ngàn.",
    "latitude": 11.9051,
    "longitude": 108.3375,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-08T08:00:00Z"
  },
  {
    "id": "SRV_16_TUI_MO_TO",
    "name": "Tiệm Cà Phê Túi Mơ To",
    "categoryId": "CAT_CAFE",
    "categoryName": "Quán Cafe view đẹp & Sống ảo",
    "address": "Hẻm 31 Sào Nam, Phường 11, TP. Đà Lạt",
    "district": "Phường 11",
    "distanceKm": 6.5,
    "priceMin": 50000,
    "priceMax": 75000,
    "priceDisplay": "50.000đ – 75.000đ",
    "rating": 4.8,
    "reviewCount": 450,
    "openingHours": "07:00 - 21:30",
    "phone": "0982 736 192",
    "website": "https://maps.google.com/?q=Tiem%20Ca%20Phe%20Tui%20Mo%20To%20Sao%20Nam%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/tiem-ca-phe-tui-mo-to-o-day-co-nhieu-goc-song-ao-lam-ne-1635057379.jpg"
    ],
    "tags": [
      "Cúc họa mi trắng",
      "Nhà gỗ vintage",
      "View thung lũng",
      "Nhà lồng ánh sáng",
      "Lãng mạn"
    ],
    "description": "Vườn cúc họa mi trắng nở quanh năm, nhà gỗ vintage view thung lũng nhà lồng ánh sáng tuyệt đẹp về đêm.",
    "latitude": 11.9482,
    "longitude": 108.4795,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-08T09:00:00Z"
  },
  {
    "id": "SRV_17_CHEO_VEOOO",
    "name": "Cheo Veooo",
    "categoryId": "CAT_CAFE",
    "categoryName": "Quán Cafe view đẹp & Sống ảo",
    "address": "116 Hùng Vương, Hẻm Dã Chiến, TP. Đà Lạt",
    "district": "Phường 11",
    "distanceKm": 5,
    "priceMin": 40000,
    "priceMax": 65000,
    "priceDisplay": "40.000đ – 65.000đ",
    "rating": 4.7,
    "reviewCount": 310,
    "openingHours": "07:30 - 19:30",
    "phone": "0903 884 112",
    "website": "https://maps.google.com/?q=Tiem%20Cafe%20Cheo%20Veooo%20Hung%20Vuong%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/tiem-ca-phe-cheo-veooo-noi-cho-nhung-du-khach-chenh-venh--1635318067.jpg"
    ],
    "tags": [
      "Nhà gỗ nhỏ",
      "Sườn đồi",
      "Hoàng hôn đỏ cam",
      "Mộc mạc",
      "Chill",
      "Dã Chiến"
    ],
    "description": "Căn nhà gỗ nhỏ nép bên sườn đồi, không gian mộc mạc không nhạc xô bồ, ngắm hoàng hôn đỏ cam cực chill.",
    "latitude": 11.9391,
    "longitude": 108.4721,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-09T08:00:00Z"
  },
  {
    "id": "SRV_18_BINH_MINH_OI",
    "name": "Tiệm Cà Phê Bình Minh Ơi",
    "categoryId": "CAT_CAFE",
    "categoryName": "Quán Cafe view đẹp & Sống ảo",
    "address": "89 Hoàng Hoa Thám, Phường 10, TP. Đà Lạt",
    "district": "Phường 10",
    "distanceKm": 5,
    "priceMin": 50000,
    "priceMax": 70000,
    "priceDisplay": "50.000đ – 70.000đ",
    "rating": 4.8,
    "reviewCount": 360,
    "openingHours": "05:00 - 21:00",
    "phone": "0918 223 344",
    "website": "https://maps.google.com/?q=Tiem%20Ca%20Phe%20Binh%20Minh%20Oi%20Hoang%20Hoa%20Tham%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/tiem-ca-phe-binh-minh-oi-chon-thien-duong-san-may-cuc-chill-1694937728.jpg"
    ],
    "tags": [
      "Săn mây sớm",
      "Bình minh",
      "Điểm tâm sáng",
      "Bánh căn",
      "Bánh mì xíu mại",
      "Hoàng Hoa Thám"
    ],
    "description": "Góc săn mây sớm lý tưởng không cần đi xa trung tâm; có phục vụ điểm tâm sáng bánh căn, bánh mì xíu mại.",
    "latitude": 11.9312,
    "longitude": 108.4619,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-09T10:00:00Z"
  },
  {
    "id": "SRV_19_LULULOLA_COFFEE",
    "name": "Lululola Coffee+",
    "categoryId": "CAT_CAFE",
    "categoryName": "Quán Cafe view đẹp & Sống ảo",
    "address": "Đầu đèo Prenn, Đ. 3/4, Phường 3, TP. Đà Lạt",
    "district": "Phường 3",
    "distanceKm": 3.5,
    "priceMin": 50000,
    "priceMax": 1200000,
    "priceDisplay": "Nước: 50k – 80k (Show: 250k - 1tr2)",
    "rating": 4.8,
    "reviewCount": 520,
    "openingHours": "08:00 - 22:30",
    "phone": "0969 998 877",
    "website": "https://maps.google.com/?q=Lululola%20Coffee%20Deo%20Prenn%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/lululola-coffee-da-lat-1694350474.jpg"
    ],
    "tags": [
      "Mini-concert",
      "Acoustic hoàng hôn",
      "Ca sĩ nổi tiếng",
      "View thung lũng thông",
      "Đầu đèo Prenn"
    ],
    "description": "Thánh địa mini-concert acoustic hoàng hôn của các ca sĩ nổi tiếng; view bao trọn thung lũng đồi thông trùng điệp.",
    "latitude": 11.9238,
    "longitude": 108.4411,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "id": "SRV_20_MAY_LANG_THANG",
    "name": "Mây Lang Thang",
    "categoryId": "CAT_CAFE",
    "categoryName": "Quán Cafe view đẹp & Sống ảo",
    "address": "77 Hoàng Hoa Thám, Phường 10, TP. Đà Lạt",
    "district": "Phường 10",
    "distanceKm": 5,
    "priceMin": 55000,
    "priceMax": 1400000,
    "priceDisplay": "Nước: 55k – 80k (Show: 300k - 1tr4)",
    "rating": 4.8,
    "reviewCount": 480,
    "openingHours": "07:00 - 22:30",
    "phone": "0943 456 789",
    "website": "https://maps.google.com/?q=May%20Lang%20Thang%20Cafe%20Hoang%20Hoa%20Tham%20Da%20Lat",
    "images": [
      "https://ticotravel.com.vn/wp-content/uploads/2022/04/May-lang-thang-Da-Lat-11-1024x659.jpeg"
    ],
    "tags": [
      "Sân khấu mây",
      "Đêm nhạc acoustic",
      "Sương mù",
      "Hoàng Hoa Thám",
      "Âm nhạc mộc"
    ],
    "description": "Sân khấu ca nhạc mây bồng bềnh; điểm hẹn của giới trẻ yêu âm nhạc mộc giữa sương mù chiều lộng gió.",
    "latitude": 11.9325,
    "longitude": 108.4608,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-10T09:30:00Z"
  },
  {
    "id": "SRV_21_DALAT_GOLF_CAFE",
    "name": "Dalat Golf Cafe",
    "categoryId": "CAT_CAFE",
    "categoryName": "Quán Cafe view đẹp & Sống ảo",
    "address": "14 Đống Đa, Phường 3, TP. Đà Lạt",
    "district": "Phường 3",
    "distanceKm": 3.5,
    "priceMin": 50000,
    "priceMax": 85000,
    "priceDisplay": "50.000đ – 85.000đ",
    "rating": 4.7,
    "reviewCount": 340,
    "openingHours": "07:00 - 22:00",
    "phone": "0263 358 6888",
    "website": "https://maps.google.com/?q=Dalat%20Golf%20Cafe%2014%20Dong%20Da%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/ca-thanh-pho-mong-mo-nhu-thu-be-lai-bang-mot-quan-da-lat-golf-coffee-voi-view-cuc-xin-1635162263.jpg"
    ],
    "tags": [
      "View 360 độ",
      "Ngắm toàn cảnh thành phố",
      "Phòng kính",
      "Sang trọng",
      "Đống Đa"
    ],
    "description": "View toàn cảnh 360 độ ngắm trọn thành phố từ trên cao; phòng kính sang trọng cùng nhiều tiểu cảnh check-in.",
    "latitude": 11.9215,
    "longitude": 108.4354,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-11T08:00:00Z"
  },
  {
    "id": "SRV_22_BA_QUA_DOI",
    "name": "Tiệm Cafe Ba Quả Đồi",
    "categoryId": "CAT_CAFE",
    "categoryName": "Quán Cafe view đẹp & Sống ảo",
    "address": "Khu Dã Chiến, Phường 11, TP. Đà Lạt",
    "district": "Phường 11",
    "distanceKm": 7,
    "priceMin": 45000,
    "priceMax": 65000,
    "priceDisplay": "45.000đ – 65.000đ",
    "rating": 4.7,
    "reviewCount": 290,
    "openingHours": "07:00 - 19:00",
    "phone": "0979 123 789",
    "website": "https://maps.google.com/?q=Tiem%20Cafe%20Ba%20Qua%20Doi%20Da%20Chien%20Da%20Lat",
    "images": [
      "https://cdn.thoidai.com.vn/stores/news_dataimages/2022/082022/08/14/in_social/b25aa01089c5a36c235d4b383aa6b38d.jpg"
    ],
    "tags": [
      "Ba ngọn đồi thông",
      "Dã Chiến",
      "Không gian mở",
      "Yên bình",
      "Tách biệt khói bụi"
    ],
    "description": "Không gian mở hoàn toàn hướng ra 3 ngọn đồi thông thoai thoải, cảm giác bình yên tách biệt hoàn toàn khói bụi.",
    "latitude": 11.9429,
    "longitude": 108.4776,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-11T10:00:00Z"
  },
  {
    "id": "SRV_23_LOI_CUA_GIO",
    "name": "Lời Của Gió",
    "categoryId": "CAT_CAFE",
    "categoryName": "Quán Cafe view đẹp & Sống ảo",
    "address": "Khu Xóm Lèo, Huỳnh Tấn Phát, TP. Đà Lạt",
    "district": "Phường 11",
    "distanceKm": 8,
    "priceMin": 50000,
    "priceMax": 70000,
    "priceDisplay": "50.000đ – 70.000đ",
    "rating": 4.8,
    "reviewCount": 410,
    "openingHours": "07:30 - 22:00",
    "phone": "0908 556 778",
    "website": "https://maps.google.com/?q=Tiem%20Ca%20Phe%20Loi%20Cua%20Gio%20Xom%20Leo%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/cafe-loi-cua-gio-da-lat-toa-do-chua-lanh-voi-view-hoang-hon-xom-leo-cuc-pham-1779648817.jpg"
    ],
    "tags": [
      "Xóm Lèo",
      "Kinh đô ánh sáng",
      "Nhà lồng Trại Mát",
      "Hoàng hôn 17h00",
      "Lung linh"
    ],
    "description": "Tọa độ ngắm 'kinh đô ánh sáng' nhà lồng Trại Mát rực rỡ nhất Đà Lạt; thời điểm đẹp nhất từ 17h00 - 19h00.",
    "latitude": 11.9542,
    "longitude": 108.4871,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-12T08:00:00Z"
  },
  {
    "id": "SRV_24_CAFE_TUNG",
    "name": "Cafe Tùng",
    "categoryId": "CAT_CAFE",
    "categoryName": "Quán Cafe view đẹp & Sống ảo",
    "address": "06 Khu Hòa Bình, Phường 1, TP. Đà Lạt",
    "district": "Phường 1",
    "distanceKm": 0.2,
    "priceMin": 25000,
    "priceMax": 55000,
    "priceDisplay": "25.000đ – 55.000đ",
    "rating": 4.6,
    "reviewCount": 520,
    "openingHours": "06:00 - 22:00",
    "phone": "0263 382 2589",
    "website": "https://maps.google.com/?q=Ca%20Phe%20Tung%20Khu%20Hoa%20Binh%20Da%20Lat",
    "images": [
      "https://artishotel.vn/wp-content/uploads/2021/10/Untitled-1.jpg"
    ],
    "tags": [
      "Cà phê phin",
      "Lâu đời nhất",
      "Khu Hòa Bình",
      "Trịnh Công Sơn",
      "Khánh Ly",
      "Hoài niệm"
    ],
    "description": "Quán cà phê phin lâu đời nhất Đà Lạt; nơi chứng kiến cuộc hội ngộ của Trịnh Công Sơn & Khánh Ly thập niên 60.",
    "latitude": 11.9422,
    "longitude": 108.4376,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-12T10:00:00Z"
  },
  {
    "id": "SRV_25_AN_CAFE",
    "name": "An Cafe",
    "categoryId": "CAT_CAFE",
    "categoryName": "Quán Cafe view đẹp & Sống ảo",
    "address": "63Bis đường 3/2, Phường 1, TP. Đà Lạt",
    "district": "Phường 1",
    "distanceKm": 0.6,
    "priceMin": 35000,
    "priceMax": 60000,
    "priceDisplay": "35.000đ – 60.000đ",
    "rating": 4.7,
    "reviewCount": 380,
    "openingHours": "07:00 - 22:00",
    "phone": "0975 735 521",
    "website": "https://maps.google.com/?q=An%20Cafe%2063Bis%20Duong%203%20Thang%202%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/an-coffee-chon-binh-yen-xanh-tham-cho-nhung-tam-hon-mong-manh-1635285247.jpg"
    ],
    "tags": [
      "Bậc thang gỗ",
      "Xanh mướt",
      "Organic healthy",
      "Đường 3/2",
      "Sát trung tâm"
    ],
    "description": "Thiết kế bậc thang gỗ phủ cây xanh dọc con dốc thoai thoải; đồ uống organic healthy, vị trí sát trung tâm.",
    "latitude": 11.9398,
    "longitude": 108.4345,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-13T08:00:00Z"
  },
  {
    "id": "SRV_26_KONG_CAFE",
    "name": "Kong Cafe",
    "categoryId": "CAT_CAFE",
    "categoryName": "Quán Cafe view đẹp & Sống ảo",
    "address": "Đồi Dã Chiến, Phường 11, TP. Đà Lạt",
    "district": "Phường 11",
    "distanceKm": 6,
    "priceMin": 35000,
    "priceMax": 55000,
    "priceDisplay": "35.000đ – 55.000đ",
    "rating": 4.6,
    "reviewCount": 290,
    "openingHours": "08:00 - 21:00",
    "phone": "0909 341 234",
    "website": "https://maps.google.com/?q=Kong%20Cafe%20Doi%20Da%20Chien%20Da%20Lat",
    "images": [
      "https://lamdongtours.com/wp-content/uploads/2024/01/Kong-Cafe-Da-Lat.jpeg"
    ],
    "tags": [
      "Đồi Dã Chiến",
      "Không wifi",
      "Văn nghệ sĩ",
      "Dế Choắt",
      "Đồi thông tĩnh lặng"
    ],
    "description": "Không gian hoài niệm mộc mạc của giới văn nghệ sĩ và rapper Dế Choắt; không wifi, ngắm đồi thông tĩnh lặng.",
    "latitude": 11.9388,
    "longitude": 108.4745,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-13T10:00:00Z"
  },
  {
    "id": "SRV_27_HORIZON_COFFEE",
    "name": "Horizon Coffee",
    "categoryId": "CAT_CAFE",
    "categoryName": "Quán Cafe view đẹp & Sống ảo",
    "address": "31/6 đường 3/4, Phường 3, TP. Đà Lạt",
    "district": "Phường 3",
    "distanceKm": 3.5,
    "priceMin": 45000,
    "priceMax": 70000,
    "priceDisplay": "45.000đ – 70.000đ",
    "rating": 4.7,
    "reviewCount": 370,
    "openingHours": "07:00 - 21:30",
    "phone": "0975 668 899",
    "website": "https://maps.google.com/?q=Horizon%20Coffee%2031/6%20Duong%203%20Thang%204%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/horizon-coffee-lac-loi-giua-khu-vuon-tren-may-noi-da-lat-mong-mo-1635201389.jpg"
    ],
    "tags": [
      "Cột đèn hoa sen",
      "Cảm hứng Singapore",
      "Vực sâu đồi thông",
      "Đường 3/4",
      "Check-in"
    ],
    "description": "Thiết kế cột đèn hoa sen khổng lồ lấy cảm hứng từ Singapore, view nhìn thẳng xuống vực sâu đồi thông hun hút.",
    "latitude": 11.922,
    "longitude": 108.4428,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-14T08:00:00Z"
  },
  {
    "id": "SRV_28_LAU_GA_TAO_NGO",
    "name": "Lẩu Gà Lá É Tao Ngộ",
    "categoryId": "CAT_FOOD",
    "categoryName": "Quán ăn & Đặc sản nức tiếng",
    "address": "Số 5 đường 3/4, Phường 3, TP. Đà Lạt",
    "district": "Phường 3",
    "distanceKm": 2,
    "priceMin": 250000,
    "priceMax": 400000,
    "priceDisplay": "250.000đ – 400.000đ (Nồi 2 - 4 người)",
    "rating": 4.8,
    "reviewCount": 890,
    "openingHours": "09:00 - 22:00",
    "phone": "0977 112 233",
    "website": "https://maps.google.com/?q=Lau%20ga%20la%20e%20Tao%20Ngo%20So%205%20Duong%203%20Thang%204%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/diem-danh-10-quan-lau-ga-la-e-noi-tieng-va-dang-thu-nhat-tai-da-lat-1722265910.jpg"
    ],
    "tags": [
      "Lẩu gà lá é",
      "Đặc sản số 1",
      "Đường 3/4",
      "Ớt hiểm xanh",
      "Măng giòn",
      "Quán gốc đông khách"
    ],
    "description": "Món lẩu gà đồi chắc thịt thơm nồng mùi lá é the mát, ớt hiểm xanh và măng giòn; quán gốc đông nghịt khách.",
    "latitude": 11.9288,
    "longitude": 108.4418,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-14T09:00:00Z"
  },
  {
    "id": "SRV_29_LAU_BO_BA_TOA",
    "name": "Lẩu Bò Ba Toa Quán Gỗ",
    "categoryId": "CAT_FOOD",
    "categoryName": "Quán ăn & Đặc sản nức tiếng",
    "address": "1/29 Hoàng Diệu, Phường 5, TP. Đà Lạt",
    "district": "Phường 5",
    "distanceKm": 1.2,
    "priceMin": 250000,
    "priceMax": 450000,
    "priceDisplay": "250.000đ – 450.000đ (Nồi đầy đặn)",
    "rating": 4.8,
    "reviewCount": 950,
    "openingHours": "10:00 - 22:00",
    "phone": "0263 382 8333",
    "website": "https://maps.google.com/?q=Lau%20Bo%20Quan%20Go%20Ba%20Toa%201/29%20Hoang%20Dieu%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/top-8-quan-lau-bo-ba-toa-da-lat-ngon-nuc-tieng-1761092570.jpg"
    ],
    "tags": [
      "Lẩu bò Ba Toa",
      "Quán Gỗ",
      "Xương ống gia truyền",
      "Bắp bò",
      "Gân giòn",
      "Đuôi bò",
      "Chao ớt"
    ],
    "description": "Nước dùng đậm đà gia truyền từ xương ống; đĩa thịt ngập bắp bò, gân giòn, đuôi bò chấm chao ớt cay nồng.",
    "latitude": 11.9429,
    "longitude": 108.4305,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-15T08:00:00Z"
  },
  {
    "id": "SRV_30_BANH_CAN_LE",
    "name": "Bánh Căn Lệ",
    "categoryId": "CAT_FOOD",
    "categoryName": "Quán ăn & Đặc sản nức tiếng",
    "address": "27/44 Yersin, Phường 10, TP. Đà Lạt",
    "district": "Phường 10",
    "distanceKm": 2.5,
    "priceMin": 35000,
    "priceMax": 50000,
    "priceDisplay": "35.000đ – 50.000đ (Dĩa 5 cặp)",
    "rating": 4.7,
    "reviewCount": 620,
    "openingHours": "07:00 - 17:00",
    "phone": "0933 221 144",
    "website": "https://maps.google.com/?q=Banh%20Can%20Le%2027/44%20Yersin%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/review-quan-banh-can-le-da-lat-huong-vi-dan-da-giua-pho-nui-1751638706.jpg"
    ],
    "tags": [
      "Bánh căn đất nung",
      "Trứng cút lòng đào",
      "Bò bằm",
      "Xíu mại mỡ hành",
      "Yersin"
    ],
    "description": "Vỏ bánh đổ khuôn đất nung giòn tan, nhân trứng cút lòng đào hoặc bò bằm; nước chấm xíu mại mỡ hành thơm béo.",
    "latitude": 11.9392,
    "longitude": 108.4528,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-15T10:00:00Z"
  },
  {
    "id": "SRV_31_BANH_CAN_NHA_CHUNG",
    "name": "Bánh Căn Nhà Chung",
    "categoryId": "CAT_FOOD",
    "categoryName": "Quán ăn & Đặc sản nức tiếng",
    "address": "01 Nhà Chung, Phường 3, TP. Đà Lạt",
    "district": "Phường 3",
    "distanceKm": 1.2,
    "priceMin": 35000,
    "priceMax": 55000,
    "priceDisplay": "35.000đ – 55.000đ (Dĩa 5 cặp)",
    "rating": 4.7,
    "reviewCount": 540,
    "openingHours": "06:30 - 18:00",
    "phone": "0908 776 554",
    "website": "https://maps.google.com/?q=Banh%20Can%20Nha%20Chung%201%20Nha%20Chung%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/quan-banh-can-nha-chung-chi-co-trung-va-bot-nhung-nuoc-mam-nhung-lai-cuon-hut-la-ky-1634556817.jpg"
    ],
    "tags": [
      "Bánh căn Nhà Chung",
      "Gần Nhà thờ Con Gà",
      "Nước mắm mỡ hành",
      "Xíu mại to",
      "Chả cây Huế"
    ],
    "description": "Quán bánh căn sát vách nhà thờ Con Gà; nước mắm mỡ hành ngọt nhẹ ăn kèm xíu mại viên to và chả cây Huế.",
    "latitude": 11.9351,
    "longitude": 108.4378,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-16T08:00:00Z"
  },
  {
    "id": "SRV_32_BANH_MI_XIU_MAI_HOANG_DIEU",
    "name": "Bánh Mì Xíu Mại Hoàng Diệu",
    "categoryId": "CAT_FOOD",
    "categoryName": "Quán ăn & Đặc sản nức tiếng",
    "address": "26 Hoàng Diệu, Phường 5, TP. Đà Lạt",
    "district": "Phường 5",
    "distanceKm": 1.5,
    "priceMin": 18000,
    "priceMax": 25000,
    "priceDisplay": "18.000đ – 25.000đ (Phần xíu mại + bánh mì)",
    "rating": 4.8,
    "reviewCount": 810,
    "openingHours": "06:00 - 11:30",
    "phone": "0989 123 890",
    "website": "https://maps.google.com/?q=Banh%20Mi%20Xiu%20Mai%2026%20Hoang%20Dieu%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/top-quan-banh-mi-xiu-mai-hoang-dieu-ngon-nuc-tieng-gia-binh-dan-1762935693.jpg"
    ],
    "tags": [
      "Bánh mì xíu mại",
      "Hoàng Diệu",
      "Điểm tâm sáng",
      "Da heo béo ngậy",
      "Nóng giòn"
    ],
    "description": "Chén nước súp hầm xương ngọt thanh cay nhẹ, xíu mại dai ngon cùng da heo béo ngậy chấm bánh mì nóng giòn.",
    "latitude": 11.9421,
    "longitude": 108.4319,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-16T09:00:00Z"
  },
  {
    "id": "SRV_33_BANH_UOT_LONG_GA_LONG",
    "name": "Bánh Ướt Lòng Gà Long",
    "categoryId": "CAT_FOOD",
    "categoryName": "Quán ăn & Đặc sản nức tiếng",
    "address": "Hẻm 202 Phan Đình Phùng, TP. Đà Lạt",
    "district": "Phường 2",
    "distanceKm": 1.8,
    "priceMin": 35000,
    "priceMax": 50000,
    "priceDisplay": "35.000đ – 50.000đ (Tô đặc biệt)",
    "rating": 4.7,
    "reviewCount": 690,
    "openingHours": "07:00 - 18:00",
    "phone": "0937 889 123",
    "website": "https://maps.google.com/?q=Banh%20Uot%20Long%20Ga%20Long%20Hem%20202%20Phan%20Dinh%20Phung%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/len-da-lat-la-phai-day-som-an-banh-uot-long-ga-chu-dung-ngu-nuong-nua-ban-oi--1634533727.jpg"
    ],
    "tags": [
      "Bánh ướt lòng gà Long",
      "Lòng mề trứng non",
      "Thịt gà xé",
      "Phan Đình Phùng",
      "Chua ngọt"
    ],
    "description": "Bánh ướt mềm dẻo tráng nóng, ăn cùng lòng mề, trứng non béo bùi, thịt gà xé và rau thơm chấm mắm chua ngọt.",
    "latitude": 11.9478,
    "longitude": 108.4362,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-17T08:00:00Z"
  },
  {
    "id": "SRV_34_BANH_UOT_LONG_GA_TRANG",
    "name": "Bánh Ướt Lòng Gà Trang",
    "categoryId": "CAT_FOOD",
    "categoryName": "Quán ăn & Đặc sản nức tiếng",
    "address": "15F Tăng Bạt Hổ, Phường 1, TP. Đà Lạt",
    "district": "Phường 1",
    "distanceKm": 0.5,
    "priceMin": 40000,
    "priceMax": 60000,
    "priceDisplay": "40.000đ – 60.000đ (Tô thập cẩm)",
    "rating": 4.6,
    "reviewCount": 750,
    "openingHours": "06:30 - 21:00",
    "phone": "0263 382 7890",
    "website": "https://maps.google.com/?q=Banh%20Uot%20Long%20Ga%20Trang%2015F%20Tang%20Bat%20Ho%20Da%20Lat",
    "images": [
      "https://thichdalat.net/wp-content/uploads/2025/11/banh-uot-long-ga-trang.jpg"
    ],
    "tags": [
      "Bánh ướt Trang",
      "Tăng Bạt Hổ",
      "Gần Chợ Đà Lạt",
      "Mắm tỏi ớt chuẩn vị",
      "Đầy ắp"
    ],
    "description": "Vị trí cực gần chợ Đà Lạt; đĩa lòng gà đầy ắp, nước mắm tỏi ớt pha chuẩn vị, mở cửa từ sáng sớm đến tối muộn.",
    "latitude": 11.9419,
    "longitude": 108.4367,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-17T09:30:00Z"
  },
  {
    "id": "SRV_35_KEM_BO_THANH_THAO",
    "name": "Kem Bơ Thanh Thảo",
    "categoryId": "CAT_FOOD",
    "categoryName": "Quán ăn & Đặc sản nức tiếng",
    "address": "76 Nguyễn Văn Trỗi, Phường 2, TP. Đà Lạt",
    "district": "Phường 2",
    "distanceKm": 1.2,
    "priceMin": 25000,
    "priceMax": 35000,
    "priceDisplay": "25.000đ – 35.000đ (Ly kem bơ đặc biệt)",
    "rating": 4.8,
    "reviewCount": 880,
    "openingHours": "07:00 - 22:00",
    "phone": "0263 382 8360",
    "website": "https://maps.google.com/?q=Kem%20Bo%20Thanh%20Thao%2076%20Nguyen%20Van%20Troi%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/kem-bo-da-lat-diem-danh-4-quan-kem-bo-gay-nghien-tai-da-lat-1634199367.jpg"
    ],
    "tags": [
      "Kem bơ Thanh Thảo",
      "Bơ sáp 034",
      "Kem dừa béo ngậy",
      "Sữa đặc dừa nạo",
      "Nguyễn Văn Trỗi"
    ],
    "description": "Bơ sáp 034 xay nhuyễn sánh mịn ăn cùng viên kem dừa béo ngậy, chan sữa đặc và rắc dừa nạo sợi giòn ngọt.",
    "latitude": 11.9461,
    "longitude": 108.4379,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-18T08:00:00Z"
  },
  {
    "id": "SRV_36_NEM_NUONG_BA_HUNG",
    "name": "Nem Nướng Bà Hùng",
    "categoryId": "CAT_FOOD",
    "categoryName": "Quán ăn & Đặc sản nức tiếng",
    "address": "328 Phan Đình Phùng, Phường 2, TP. Đà Lạt",
    "district": "Phường 2",
    "distanceKm": 2.5,
    "priceMin": 50000,
    "priceMax": 60000,
    "priceDisplay": "50.000đ – 60.000đ (Suất 1 người)",
    "rating": 4.7,
    "reviewCount": 670,
    "openingHours": "10:00 - 21:00",
    "phone": "0263 382 4344",
    "website": "https://maps.google.com/?q=Nem%20Nuong%20Ba%20Hung%20328%20Phan%20Dinh%20Phung%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/top-6-quan-nuong-cuc-ngon-trong-long-thanh-pho-ngan-hoa-da-lat-1635136485.jpg"
    ],
    "tags": [
      "Nem nướng Bà Hùng",
      "Than hồng",
      "Bánh tráng ram giòn",
      "Rau sống Đà Lạt",
      "Sốt tương gan"
    ],
    "description": "Nem thịt nướng thơm lừng trên than hồng cuốn bánh tráng ram chiên giòn, rau sống Đà Lạt và nước sốt tương gan.",
    "latitude": 11.9512,
    "longitude": 108.4348,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-18T10:00:00Z"
  },
  {
    "id": "SRV_37_NUONG_NGOI_CU_DUC",
    "name": "Nướng Ngói Cu Đức",
    "categoryId": "CAT_FOOD",
    "categoryName": "Quán ăn & Đặc sản nức tiếng",
    "address": "61 Nguyễn Lương Bằng, Phường 2, TP. Đà Lạt",
    "district": "Phường 2",
    "distanceKm": 1.5,
    "priceMin": 120000,
    "priceMax": 220000,
    "priceDisplay": "120.000đ – 220.000đ (Tính theo món)",
    "rating": 4.6,
    "reviewCount": 510,
    "openingHours": "10:00 - 22:30",
    "phone": "0907 686 848",
    "website": "https://maps.google.com/?q=Quan%20Nuong%20Ngoi%20Cu%20Duc%2061%20Nguyen%20Luong%20Bang%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/thit-nuong-ngoi-da-lat-top5-quan-nuong-ngoi-noi-tieng-xu-suong-mu-1634530936.jpg"
    ],
    "tags": [
      "Nướng ngói Cu Đức",
      "Bò tơ",
      "Nầm bò",
      "Heo rừng",
      "Phiến ngói đỏ",
      "Mềm mọng"
    ],
    "description": "Thịt bò tơ, nầm, heo rừng tẩm ướp đậm đà nướng trên phiến ngói đất đỏ rực lửa; giữ nguyên độ mềm mọng tự nhiên.",
    "latitude": 11.9489,
    "longitude": 108.4321,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-19T08:00:00Z"
  },
  {
    "id": "SRV_38_OC_NHOI_THIT_33",
    "name": "Ốc Nhồi Thịt 33",
    "categoryId": "CAT_FOOD",
    "categoryName": "Quán ăn & Đặc sản nức tiếng",
    "address": "33 Hai Bà Trưng, Phường 6, TP. Đà Lạt",
    "district": "Phường 6",
    "distanceKm": 1.3,
    "priceMin": 150000,
    "priceMax": 200000,
    "priceDisplay": "150.000đ – 200.000đ (Thố ốc to)",
    "rating": 4.7,
    "reviewCount": 730,
    "openingHours": "10:00 - 21:30",
    "phone": "0263 382 3233",
    "website": "https://maps.google.com/?q=Quan%20Oc%2033%20Hai%20Ba%20Trung%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/oc-33-da-lat-review-tat-tan-tat-quan-oc-nhoi-thit-huyen-thoai-phai-thu-1784500799.jpg"
    ],
    "tags": [
      "Ốc nhồi thịt 33",
      "Hai Bà Trưng",
      "Giò sống sả cây",
      "Hấp bếp than",
      "Nước mắm gừng ớt"
    ],
    "description": "Ốc bươu băm nhuyễn trộn giò sống nhồi sả cây trong vỏ ốc; hấp nóng hổi trên bếp than chấm nước mắm gừng ớt.",
    "latitude": 11.9448,
    "longitude": 108.4332,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-19T09:30:00Z"
  },
  {
    "id": "SRV_39_GA_NUONG_DOI_TRANG",
    "name": "Gà Nướng Cơm Lam Trên Đỉnh Đồi Trăng",
    "categoryId": "CAT_FOOD",
    "categoryName": "Quán ăn & Đặc sản nức tiếng",
    "address": "27 Triệu Việt Vương, Phường 4, TP. Đà Lạt",
    "district": "Phường 4",
    "distanceKm": 4.5,
    "priceMin": 320000,
    "priceMax": 400000,
    "priceDisplay": "320.000đ – 400.000đ (Nguyên con gà)",
    "rating": 4.8,
    "reviewCount": 460,
    "openingHours": "09:00 - 21:00",
    "phone": "0979 888 666",
    "website": "https://maps.google.com/?q=Ga%20Nuong%20Com%20Lam%20Tren%20Dinh%20Doi%20Trang%2027%20Trieu%20Viet%20Vuong%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/top-10-quan-ga-nuong-com-lam-da-lat-lam-say-long-du-khach-1771817877.jpg"
    ],
    "tags": [
      "Gà nướng cơm lam",
      "Đỉnh Đồi Trăng",
      "Gà thả đồi",
      "Sốt thảo mộc",
      "Muối é",
      "Cơm lam nếp nương"
    ],
    "description": "Gà thả đồi ướp sốt thảo mộc nướng than giòn da chấm muối é; ăn cùng ống cơm lam nếp nương nướng cháy cạnh.",
    "latitude": 11.9211,
    "longitude": 108.4312,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-20T08:00:00Z"
  },
  {
    "id": "SRV_40_CHO_DEM_DA_LAT",
    "name": "Thiên Đường Ăn Vặt Chợ Đêm Đà Lạt",
    "categoryId": "CAT_FOOD",
    "categoryName": "Quán ăn & Đặc sản nức tiếng",
    "address": "Chợ Âm Phủ, Nguyễn Thị Minh Khai, Phường 1, TP. Đà Lạt",
    "district": "Phường 1",
    "distanceKm": 0,
    "priceMin": 15000,
    "priceMax": 35000,
    "priceDisplay": "15.000đ – 35.000đ (Từng món ăn vặt)",
    "rating": 4.7,
    "reviewCount": 1200,
    "openingHours": "17:00 - 02:00",
    "phone": "0263 382 1570",
    "website": "https://maps.google.com/?q=Cho%20Dem%20Da%20Lat%20Nguyen%20Thi%20Minh%20Khai",
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/4/4c/Dalat_night_market_-_panoramio.jpg"
    ],
    "tags": [
      "Chợ Đêm",
      "Chợ Âm Phủ",
      "Pizza Đà Lạt",
      "Bánh tráng nướng",
      "Sữa đậu nành nóng",
      "Khoai lang nướng"
    ],
    "description": "Thưởng thức 'pizza Đà Lạt' bánh tráng nướng trứng giòn cay, ly sữa đậu nành nóng nghi ngút khói, khoai lang nướng.",
    "latitude": 11.9417,
    "longitude": 108.4377,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-20T10:00:00Z"
  },
  {
    "id": "SRV_41_DALAT_PALACE",
    "name": "Dalat Palace Heritage Hotel",
    "categoryId": "CAT_STAY",
    "categoryName": "Khách sạn, Resort & Homestay",
    "address": "12 Trần Phú, Phường 3, TP. Đà Lạt",
    "district": "Phường 3",
    "distanceKm": 1.2,
    "priceMin": 3500000,
    "priceMax": 8500000,
    "priceDisplay": "3.500.000đ – 8.500.000đ (Chuẩn 5 sao di sản)",
    "rating": 4.9,
    "reviewCount": 380,
    "openingHours": "Phục vụ 24/24",
    "phone": "0263 382 5444",
    "website": "https://maps.google.com/?q=Dalat%20Palace%20Heritage%20Hotel%2012%20Tran%20Phu%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/top-10-khach-san-5-sao-da-lat-co-view-dep-voi-vi-tri-dac-dia-1753112068.jpg"
    ],
    "tags": [
      "5 sao di sản",
      "Từ năm 1922",
      "Cổ điển Pháp",
      "View Hồ Xuân Hương",
      "Sang trọng bậc nhất"
    ],
    "description": "Khách sạn cổ điển Pháp sang trọng bậc nhất Đông Dương xây từ năm 1922; view nhìn thẳng hồ Xuân Hương tuyệt mỹ.",
    "latitude": 11.9372,
    "longitude": 108.4418,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-21T08:00:00Z"
  },
  {
    "id": "SRV_42_ANA_MANDARA",
    "name": "Ana Mandara Villas Dalat Resort",
    "categoryId": "CAT_STAY",
    "categoryName": "Khách sạn, Resort & Homestay",
    "address": "Đường Lê Lai, Phường 5, TP. Đà Lạt",
    "district": "Phường 5",
    "distanceKm": 2.5,
    "priceMin": 2400000,
    "priceMax": 6500000,
    "priceDisplay": "2.400.000đ – 6.500.000đ (Quần thể biệt thự 5 sao)",
    "rating": 4.9,
    "reviewCount": 410,
    "openingHours": "Phục vụ 24/24",
    "phone": "0263 355 5888",
    "website": "https://maps.google.com/?q=Ana%20Mandara%20Villas%20Dalat%20Resort%20Le%20Lai%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/ana-mandara-villas-dalat-resort-spa-ngoi-lang-co-kinh-nuoc-phap-1653329782.jpg"
    ],
    "tags": [
      "17 dinh thự Pháp cổ",
      "Thuộc địa Pháp",
      "Rừng thông trăm tuổi",
      "Hồ bơi nước ấm ngoài trời",
      "5 sao"
    ],
    "description": "Cụm 17 dinh thự kiến trúc thuộc địa Pháp cổ ẩn mình giữa rừng thông trăm tuổi; có hồ bơi nước ấm ngoài trời.",
    "latitude": 11.9442,
    "longitude": 108.4215,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-21T09:30:00Z"
  },
  {
    "id": "SRV_43_TERRACOTTA_RESORT",
    "name": "Terracotta Hotel & Resort",
    "categoryId": "CAT_STAY",
    "categoryName": "Khách sạn, Resort & Homestay",
    "address": "Khu Tuyền Lâm, Phường 4, TP. Đà Lạt",
    "district": "Phường 4",
    "distanceKm": 7.5,
    "priceMin": 1500000,
    "priceMax": 4500000,
    "priceDisplay": "1.500.000đ – 4.500.000đ (Resort ven hồ 4 sao)",
    "rating": 4.8,
    "reviewCount": 520,
    "openingHours": "Phục vụ 24/24",
    "phone": "0263 388 3838",
    "website": "https://maps.google.com/?q=Terracotta%20Hotel%20Resort%20Dalat%20Ho%20Tuyen%20Lam",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/terracotta-hotel-resort-dalat-net-binh-yen-ben-doi-thong-1653897264.jpg"
    ],
    "tags": [
      "Bán đảo Hồ Tuyền Lâm",
      "Vườn hoa tú cầu",
      "Hàng thông reo",
      "Resort 4 sao",
      "Bình yên"
    ],
    "description": "Nép mình bên bán đảo hồ Tuyền Lâm; khuôn viên bạt ngàn vườn hoa tú cầu và hàng thông reo bình yên.",
    "latitude": 11.8921,
    "longitude": 108.4285,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-22T08:00:00Z"
  },
  {
    "id": "SRV_44_SWISS_BELRESORT",
    "name": "Swiss-Belresort Tuyền Lâm",
    "categoryId": "CAT_STAY",
    "categoryName": "Khách sạn, Resort & Homestay",
    "address": "Khu Tuyền Lâm, Phường 4, TP. Đà Lạt",
    "district": "Phường 4",
    "distanceKm": 12,
    "priceMin": 1400000,
    "priceMax": 3800000,
    "priceDisplay": "1.400.000đ – 3.800.000đ (Lâu đài nghỉ dưỡng)",
    "rating": 4.8,
    "reviewCount": 440,
    "openingHours": "Phục vụ 24/24",
    "phone": "0263 379 9100",
    "website": "https://maps.google.com/?q=Swiss-Belresort%20Tuyen%20Lam%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/swiss-belresort-tuyen-lam-dalat-toa-lau-dai-giua-ru-ng-thong-1764175087.jpg"
    ],
    "tags": [
      "Lâu đài Anglo-Normand",
      "Miền quê châu Âu",
      "Sân golf 18 lỗ",
      "Sam Tuyền Lâm",
      "Đẳng cấp"
    ],
    "description": "Kiến trúc lâu đài Anglo-Normand phong cách miền quê châu Âu; bao quanh bởi sân golf 18 lỗ Sam Tuyền Lâm xanh mướt.",
    "latitude": 11.8812,
    "longitude": 108.421,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-22T10:00:00Z"
  },
  {
    "id": "SRV_45_MERCURE_DALAT",
    "name": "Mercure Dalat Resort",
    "categoryId": "CAT_STAY",
    "categoryName": "Khách sạn, Resort & Homestay",
    "address": "03 Nguyễn Du, Phường 9, TP. Đà Lạt",
    "district": "Phường 9",
    "distanceKm": 3.2,
    "priceMin": 1800000,
    "priceMax": 4200000,
    "priceDisplay": "1.800.000đ – 4.200.000đ (Resort 4 sao cổ điển)",
    "rating": 4.8,
    "reviewCount": 390,
    "openingHours": "Phục vụ 24/24",
    "phone": "0263 381 0888",
    "website": "https://maps.google.com/?q=Mercure%20Dalat%20Resort%2003%20Nguyen%20Du%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/top-20-resort-da-lat-view-dep-gan-trung-tam-cho-ban-kham-pha-phan-1--1664203876.jpg"
    ],
    "tags": [
      "Resort 4 sao",
      "Ga xe lửa cổ",
      "Đóa hồng nhung",
      "Khu vườn châu Âu",
      "Nguyễn Du"
    ],
    "description": "Không gian kiến trúc lãng mạn lấy cảm hứng từ ga xe lửa và đóa hồng nhung; khu vườn châu Âu lãng mạn.",
    "latitude": 11.9455,
    "longitude": 108.4611,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-23T08:00:00Z"
  },
  {
    "id": "SRV_46_HOTEL_COLLINE",
    "name": "Hôtel Colline",
    "categoryId": "CAT_STAY",
    "categoryName": "Khách sạn, Resort & Homestay",
    "address": "10 Phan Bội Châu, Phường 1, TP. Đà Lạt",
    "district": "Phường 1",
    "distanceKm": 0.3,
    "priceMin": 1300000,
    "priceMax": 3000000,
    "priceDisplay": "1.300.000đ – 3.000.000đ (Khách sạn 4 sao trung tâm)",
    "rating": 4.8,
    "reviewCount": 580,
    "openingHours": "Phục vụ 24/24",
    "phone": "0263 366 5588",
    "website": "https://maps.google.com/?q=Hotel%20Colline%2010%20Phan%20Boi%20Chau%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/hotel-colline-khu-nghi-duong-trieu-view-kho-long-bo-lo-1653488932.jpg"
    ],
    "tags": [
      "Dalat Center",
      "Đi bộ 3 phút xuống Chợ Đêm",
      "4 sao trung tâm",
      "Kiến trúc hiện đại tối giản"
    ],
    "description": "Nằm ngay khu phức hợp Đà Lạt Center; đi bộ 3 phút xuống chợ đêm; kiến trúc hiện đại tối giản cực kỳ thuận tiện.",
    "latitude": 11.9405,
    "longitude": 108.4382,
    "isFeatured": true,
    "isPopular": true,
    "createdAt": "2026-01-23T09:30:00Z"
  },
  {
    "id": "SRV_47_THE_KUPID_HILL",
    "name": "The Kupid Hill Homestay",
    "categoryId": "CAT_STAY",
    "categoryName": "Khách sạn, Resort & Homestay",
    "address": "72 Đặng Thái Thân, Phường 3, TP. Đà Lạt",
    "district": "Phường 3",
    "distanceKm": 3.5,
    "priceMin": 450000,
    "priceMax": 1200000,
    "priceDisplay": "450.000đ – 1.200.000đ (Phòng kính view thông)",
    "rating": 4.7,
    "reviewCount": 340,
    "openingHours": "Phục vụ 24/24",
    "phone": "0899 509 000",
    "website": "https://maps.google.com/?q=The%20Kupid%20Hill%20Homestay%2072%20Dang%20Thai%20Than%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/top-20-homestay-da-lat-dep-so-huu-thiet-ke-trieu-like-phan-1--1666754415.jpg"
    ],
    "tags": [
      "Phòng kính kịch trần",
      "View đồi thông",
      "Trẻ trung",
      "Ánh sáng tự nhiên",
      "Đặng Thái Thân"
    ],
    "description": "Căn phòng kính kịch trần nhìn thẳng thung lũng đồi thông; không gian trẻ trung ngập tràn ánh sáng tự nhiên.",
    "latitude": 11.9258,
    "longitude": 108.451,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-24T08:00:00Z"
  },
  {
    "id": "SRV_48_DOI_MOT_NGUOI",
    "name": "Đợi Một Người Homestay",
    "categoryId": "CAT_STAY",
    "categoryName": "Khách sạn, Resort & Homestay",
    "address": "Đ. Khởi Nghĩa Bắc Sơn, Phường 10, TP. Đà Lạt",
    "district": "Phường 10",
    "distanceKm": 5,
    "priceMin": 600000,
    "priceMax": 1500000,
    "priceDisplay": "600.000đ – 1.500.000đ (Nhà kính mặt hồ)",
    "rating": 4.8,
    "reviewCount": 310,
    "openingHours": "Phục vụ 24/24",
    "phone": "0975 660 573",
    "website": "https://maps.google.com/?q=Doi%20Mot%20Nguoi%20Homestay%20Khoi%20Nghia%20Bac%20Son%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/top-22-nha-nguyen-can-da-lat-gia-tot-cho-thue-theo-ngay-phan-1--1665373457.jpg"
    ],
    "tags": [
      "Nhà kính mặt hồ",
      "Thi vị",
      "Tĩnh lặng",
      "Chữa lành tâm hồn",
      "Khởi Nghĩa Bắc Sơn"
    ],
    "description": "Ngôi nhà kính nhỏ giữa mặt hồ thơ mộng; không gian thi vị, tĩnh lặng cho những ai cần chữa lành tâm hồn.",
    "latitude": 11.9285,
    "longitude": 108.459,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-24T10:00:00Z"
  },
  {
    "id": "SRV_49_NHA_BEN_RUNG",
    "name": "Nhà Bên Rừng Homestay",
    "categoryId": "CAT_STAY",
    "categoryName": "Khách sạn, Resort & Homestay",
    "address": "Tổ 4, Đ. Trúc Lâm Yên Tử, Phường 3, TP. Đà Lạt",
    "district": "Phường 3",
    "distanceKm": 4,
    "priceMin": 50000,
    "priceMax": 1300000,
    "priceDisplay": "500.000đ – 1.300.000đ (Nhà gỗ ven suối)",
    "rating": 4.7,
    "reviewCount": 280,
    "openingHours": "Phục vụ 24/24",
    "phone": "0901 234 567",
    "website": "https://maps.google.com/?q=Nha%20Ben%20Rung%20Homestay%20Truc%20Lam%20Yen%20Tu%20Da%20Lat",
    "images": [
      "https://mia.vn/media/uploads/blog-du-lich/tiem-ca-phe-nha-ben-rung-goc-nho-an-yen-giua-long-da-lat-1663105044.jpg"
    ],
    "tags": [
      "Bungalow gỗ",
      "Ven suối",
      "Tán thông già",
      "Ban công hóng gió",
      "Sương mù sáng sớm"
    ],
    "description": "Những bungalow gỗ mộc mạc nép sát tán thông già; ban công hóng gió ngắm sương mù sáng sớm nguyên sơ.",
    "latitude": 11.911,
    "longitude": 108.439,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-25T08:00:00Z"
  },
  {
    "id": "SRV_50_LA_NHA_HOMESTAY",
    "name": "Là Nhà Homestay",
    "categoryId": "CAT_STAY",
    "categoryName": "Khách sạn, Resort & Homestay",
    "address": "77 Hoàng Diệu, Phường 5, TP. Đà Lạt",
    "district": "Phường 5",
    "distanceKm": 2.5,
    "priceMin": 350000,
    "priceMax": 900000,
    "priceDisplay": "350.000đ – 900.000đ (Dorm & phòng riêng)",
    "rating": 4.7,
    "reviewCount": 420,
    "openingHours": "Phục vụ 24/24",
    "phone": "0903 650 377",
    "website": "https://maps.google.com/?q=La%20Nha%20Homestay%2077%20Hoang%20Dieu%20Da%20Lat",
    "images": [
      "https://pix8.agoda.net/hotelImages/61727728/0/0ed6f15a5cdfc9df98d1fff8ce4fd9c5.jpg"
    ],
    "tags": [
      "Vintage mộc mạc",
      "Tiên phong Đà Lạt",
      "Sân vườn nướng BBQ",
      "Đàn hát guitar",
      "Hoàng Diệu"
    ],
    "description": "Homestay phong cách vintage mộc mạc tiên phong tại Đà Lạt; có sân vườn rộng nướng thịt BBQ và đàn hát guitar.",
    "latitude": 11.944,
    "longitude": 108.4285,
    "isFeatured": false,
    "isPopular": true,
    "createdAt": "2026-01-25T09:30:00Z"
  }
];

export const RECOMMENDED_ROUTES: TravelRoute[] = [
  {
    "id": "ROUTE_1",
    "name": "Cung 1: Săn mây Trại Mát & Cầu Đất (Hướng Đông Nam)",
    "direction": "Hướng Đông Nam",
    "waypoints": [
      "Đồi chè Cầu Đất",
      "Chùa Ve Chai",
      "Tiệm Cà Phê Túi Mơ To",
      "Cafe Lời Của Gió (Xóm Lèo)"
    ],
    "schedule": [
      "• 05h00: Khởi hành săn mây tại Đồi chè Cầu Đất.",
      "• 08h30: Ghé Chùa Ve Chai chiêm bái tượng rồng.",
      "• 10h00: Thưởng thức cafe tại Túi Mơ To chụp cúc họa mi.",
      "• 17h00: Đón hoàng hôn ngắm nhà lồng tại Xóm Lèo."
    ]
  },
  {
    "id": "ROUTE_2",
    "name": "Cung 2: Đèo Prenn & Hồ Tuyền Lâm (Hướng Phía Nam)",
    "direction": "Hướng Phía Nam",
    "waypoints": [
      "Thác Datanla",
      "Thiền Viện Trúc Lâm",
      "Hồ Tuyền Lâm",
      "Gà nướng Đồi Trăng",
      "Lululola Coffee+"
    ],
    "schedule": [
      "• 08h30: Trải nghiệm máng trượt xuyên rừng Datanla.",
      "• 11h00: Viếng Thiền Viện Trúc Lâm & ngắm cảnh hồ.",
      "• 12h30: Ăn trưa Gà nướng cơm lam Trên Đỉnh Đồi Trăng.",
      "• 16h30: Thưởng thức đêm nhạc acoustic tại Lululola."
    ]
  },
  {
    "id": "ROUTE_3",
    "name": "Cung 3: Ẩm thực & Dạo phố Trung tâm (Bán kính < 2km)",
    "direction": "Bán kính < 2km",
    "waypoints": [
      "Bánh mì Xíu mại Hoàng Diệu",
      "Ga Đà Lạt",
      "Dinh III Bảo Đại",
      "Lẩu bò Ba Toa",
      "Chợ Đêm Đà Lạt"
    ],
    "schedule": [
      "• 07h00: Ăn sáng Bánh mì xíu mại Hoàng Diệu.",
      "• 08h30: Check-in Ga Đà Lạt và Dinh III Bảo Đại.",
      "• 12h00: Thưởng thức lẩu bò Ba Toa Quán Gỗ.",
      "• 18h30: Dạo bộ Chợ Đêm, ăn bánh tráng nướng, uống sữa hạt."
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    "id": "REV_1",
    "serviceId": "SRV_16_TUI_MO_TO",
    "serviceName": "Tiệm Cà Phê Túi Mơ To",
    "userId": "USR_TUANANH",
    "userName": "Tuấn Anh",
    "userAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    "rating": 5,
    "comment": "Vườn cúc họa mi trắng nở rộ ngút ngàn. Không gian nhà gỗ vintage ấm cúng và view nhìn xuống thung lũng nhà lồng lung linh khi lên đèn!",
    "createdAt": "2026-02-14T10:15:00Z",
    "status": "approved"
  },
  {
    "id": "REV_2",
    "serviceId": "SRV_28_LAU_GA_TAO_NGO",
    "serviceName": "Lẩu Gà Lá É Tao Ngộ",
    "userId": "USR_BINH",
    "userName": "Bình",
    "userAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    "rating": 5,
    "comment": "Thịt gà đồi rất chắc, nước dùng thơm lừng vị lá é và ớt hiểm the the giải cảm cực tốt trong tiết trời se lạnh.",
    "createdAt": "2026-02-20T19:30:00Z",
    "status": "approved"
  },
  {
    "id": "REV_3",
    "serviceId": "SRV_12_DOI_CHE_CAU_DAT",
    "serviceName": "Đồi chè Cầu Đất",
    "userId": "USR_QUANG",
    "userName": "Quang",
    "userAvatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
    "rating": 5,
    "comment": "Dậy sớm từ 4h30 chạy lên cầu gỗ đón biển mây bồng bềnh và ngắm cánh quạt gió khổng lồ dưới ánh bình minh 5h30 quá mãn nhãn!",
    "createdAt": "2026-02-25T06:00:00Z",
    "status": "approved"
  },
  {
    "id": "REV_4",
    "serviceId": "SRV_07_HO_TUYEN_LAM",
    "serviceName": "Hồ Tuyền Lâm",
    "userId": "USR_MINHANH",
    "userName": "Minh Anh",
    "userAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    "rating": 5,
    "comment": "Chèo thuyền SUP sáng sớm trên mặt hồ phẳng lặng như gương, hít thở không khí rừng thông trong lành thật sảng khoái.",
    "createdAt": "2026-03-01T08:00:00Z",
    "status": "approved"
  },
  {
    "id": "REV_5",
    "serviceId": "SRV_29_LAU_BO_BA_TOA",
    "serviceName": "Lẩu Bò Ba Toa Quán Gỗ",
    "userId": "USR_TUANANH",
    "userName": "Tuấn Anh",
    "userAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    "rating": 5,
    "comment": "Nồi lẩu bò ngập tràn bắp bò, gân và đuôi bò mềm rụm. Nước dùng hầm từ xương ống đậm đà đúng chất quán gỗ Ba Toa.",
    "createdAt": "2026-03-02T12:00:00Z",
    "status": "approved"
  },
  {
    "id": "REV_6",
    "serviceId": "SRV_46_HOTEL_COLLINE",
    "serviceName": "Hôtel Colline",
    "userId": "USR_ADMIN",
    "userName": "Việt (Admin)",
    "userAvatar": "",
    "rating": 5,
    "comment": "Vị trí đắc địa ngay Dalat Center, chỉ cần đi bộ 3 phút là xuống ngay chợ đêm. Phòng ốc thiết kế hiện đại sang trọng.",
    "createdAt": "2026-03-03T14:00:00Z",
    "status": "approved"
  }
];

export const INITIAL_USERS: User[] = [
  {
    "id": "USR_ADMIN",
    "username": "admin",
    "email": "admin.dalat@wander.vn",
    "fullName": "Việt (Admin Quản Trị)",
    "phone": "0988776655",
    "avatar": "",
    "role": "admin",
    "status": "active",
    "createdAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "USR_TUANANH",
    "username": "tuananh",
    "email": "tuananh@wander.vn",
    "fullName": "Tuấn Anh (Auth & Người Dùng)",
    "phone": "0912345671",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    "role": "user",
    "status": "active",
    "createdAt": "2026-01-10T00:00:00Z"
  },
  {
    "id": "USR_BINH",
    "username": "binh",
    "email": "binh@wander.vn",
    "fullName": "Bình (Trang Chủ & Dịch Vụ)",
    "phone": "0912345672",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    "role": "user",
    "status": "active",
    "createdAt": "2026-01-10T00:00:00Z"
  },
  {
    "id": "USR_QUANG",
    "username": "quang",
    "email": "quang@wander.vn",
    "fullName": "Quang (Tìm Kiếm & Chatbot)",
    "phone": "0912345673",
    "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
    "role": "user",
    "status": "active",
    "createdAt": "2026-01-10T00:00:00Z"
  },
  {
    "id": "USR_MINHANH",
    "username": "minhanh",
    "email": "minhanh@wander.vn",
    "fullName": "Minh Anh (Đánh Giá & Tương Tác)",
    "phone": "0912345674",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    "role": "user",
    "status": "active",
    "createdAt": "2026-01-10T00:00:00Z"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    "id": "NOTIF_1",
    "title": "Cẩm nang 50 tọa độ du lịch Đà Lạt tuyển chọn 2026",
    "titleVi": "Cẩm nang 50 tọa độ du lịch Đà Lạt tuyển chọn 2026",
    "message": "Khám phá trọn bộ 15 điểm tham quan, 12 quán cafe view đẹp, 13 món ăn đặc sản và 10 nơi lưu trú lý tưởng.",
    "messageVi": "Khám phá trọn bộ 15 điểm tham quan, 12 quán cafe view đẹp, 13 món ăn đặc sản và 10 nơi lưu trú lý tưởng.",
    "type": "event",
    "timestamp": "2026-03-10T09:00:00Z",
    "isRead": false,
    "linkServiceId": "SRV_01_QUANG_TRUONG_LAM_VIEN"
  },
  {
    "id": "NOTIF_2",
    "title": "Gợi ý 3 cung đường khám phá Đà Lạt tiết kiệm thời gian",
    "titleVi": "Gợi ý 3 cung đường khám phá Đà Lạt tiết kiệm thời gian",
    "message": "Lộ trình tối ưu theo từng cụm: Trại Mát & Cầu Đất, Đèo Prenn & Hồ Tuyền Lâm, và Phố cổ Trung tâm.",
    "messageVi": "Lộ trình tối ưu theo từng cụm: Trại Mát & Cầu Đất, Đèo Prenn & Hồ Tuyền Lâm, và Phố cổ Trung tâm.",
    "type": "suggestion",
    "timestamp": "2026-03-08T14:30:00Z",
    "isRead": false,
    "linkServiceId": "SRV_12_DOI_CHE_CAU_DAT"
  },
  {
    "id": "NOTIF_3",
    "title": "Đêm se lạnh 14°C: Thưởng thức Lẩu Gà Lá É & Bò Ba Toa",
    "titleVi": "Đêm se lạnh 14°C: Thưởng thức Lẩu Gà Lá É & Bò Ba Toa",
    "message": "Thời tiết Đà Lạt tối nay rất lý tưởng cho các món lẩu nóng hổi bên bạn bè và gia đình.",
    "messageVi": "Thời tiết Đà Lạt tối nay rất lý tưởng cho các món lẩu nóng hổi bên bạn bè và gia đình.",
    "type": "promo",
    "timestamp": "2026-03-05T18:00:00Z",
    "isRead": true,
    "linkServiceId": "SRV_28_LAU_GA_TAO_NGO"
  }
];

export const DALAT_WEATHER: DalatWeather = {
  temp: 18,
  conditionVi: 'Se lạnh sương mù nhẹ',
  conditionEn: 'Cool & light mist',
  icon: '🌤️',
  humidity: 78,
  seasonVi: 'Mùa khô se lạnh & săn mây',
  seasonEn: 'Crisp dry season & cloud hunting',
  travelTipVi: 'Đà Lạt hôm nay 18°C, đêm hạ còn 14°C. Hãy mang theo áo len và tận hưởng cà phê sáng ngắm sương mù nhé!',
  travelTipEn: 'Dalat is 18°C today, dropping to 14°C at night. Bring a cozy knit jacket and enjoy hot morning coffee in the mist!',
};

export const POPULAR_KEYWORDS = [
  'Quảng trường Lâm Viên',
  'Hồ Xuân Hương',
  'Đồi chè Cầu Đất',
  'Săn mây',
  'Túi Mơ To',
  'Lululola Coffee',
  'Lẩu gà lá é Tao Ngộ',
  'Lẩu bò Ba Toa',
  'Bánh căn Lệ',
  'Bánh mì xíu mại Hoàng Diệu',
  'Kem bơ Thanh Thảo',
  'Thác Datanla',
  'Thiền Viện Trúc Lâm',
  'Hôtel Colline',
  'Chợ Đêm Đà Lạt',
];
