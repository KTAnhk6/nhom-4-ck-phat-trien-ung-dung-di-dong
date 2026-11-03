/**
 * Script đẩy 50 tọa độ du lịch Đà Lạt tuyển chọn lên MockAPI
 * Chạy lệnh: node scripts/seedMockApi.js
 */

const BASE_URL = 'https://6ae06df9be3bc8fead97313e.mockapi.io/api/v1';

// Dữ liệu 4 danh mục chuẩn
const CATEGORIES = [
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

// Dữ liệu 50 địa điểm du lịch Đà Lạt chuẩn cẩm nang
const SERVICES = [
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
    "images": [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1548625361-195fe2062634?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1520645521318-f03a712f0e67?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80"
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
    "images": [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80"
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

async function seed() {
  console.log('--- BẮT ĐẦU ĐỒNG BỘ 50 TỌA ĐỘ DU LỊCH ĐÀ LẠT LÊN MOCKAPI ---');
  console.log('Endpoint: ' + BASE_URL + '\n');

  // 1. Đồng bộ Categories
  console.log('1. Đang kiểm tra / cập nhật danh mục (categories)...');
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
        console.log(`   [FAIL ${res.status}] ${cat.nameVi}`);
      }
    } catch (e) {
      console.log(`   [ERROR] ${cat.nameVi}: ${e.message}`);
    }
  }

  // 2. Đồng bộ 50 Services
  console.log('\n2. Đang tải lên 50 dịch vụ (services)...');
  let successCount = 0;
  for (const srv of SERVICES) {
    try {
      const res = await fetch(`${BASE_URL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(srv),
      });
      if (res.ok) {
        successCount++;
        console.log(`   [${successCount}/50 OK] Đã tạo: ${srv.name}`);
      } else {
        console.log(`   [FAIL ${res.status}] ${srv.name}`);
      }
    } catch (e) {
      console.log(`   [ERROR] ${srv.name}: ${e.message}`);
    }
  }

  console.log(`\n--- HOÀN TẤT ĐỒNG BỘ (${successCount}/50 DỊCH VỤ) ---`);
}

seed();
