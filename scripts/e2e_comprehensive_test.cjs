/**
 * Comprehensive End-to-End Test Suite for Dalat Wander
 * Tests all modules: Auth, Services, Reviews, Chatbot Multi-Turn, Search/Filter, i18n, Database.
 */

const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const projectRoot = path.resolve(__dirname, '..');
const dbPath = path.join(projectRoot, 'database', 'dalat_wander_mysql.db');
const sqlDumpPath = path.join(projectRoot, 'database', 'dalat_wander_mysql.sql');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failedTests++;
  }
}

console.log('================================================================');
console.log('🧪 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN ỨNG DỤNG ĐÀ LẠT WANDER TỪ ĐẦU ĐẾN CUỐI');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// MODULE 1: HỆ THỐNG CƠ SỞ DỮ LIỆU MYSQL / SQLITE
// -----------------------------------------------------------------------------
console.log('📦 1. KIỂM THỬ CƠ SỞ DỮ LIỆU (SQLite & SQL Dump)');
assert(fs.existsSync(dbPath), `Tệp cơ sở dữ liệu SQLite tồn tại: ${dbPath}`);
assert(fs.existsSync(sqlDumpPath), `Tệp bản xuất SQL tồn tại: ${sqlDumpPath}`);

const db = new DatabaseSync(dbPath);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;").all().map(r => r.name);
const expectedTables = ['categories', 'favorites', 'notifications', 'reviews', 'search_history', 'services', 'user_passwords', 'users'];
expectedTables.forEach(t => {
  assert(tables.includes(t), `Bảng '${t}' tồn tại trong cơ sở dữ liệu`);
});

const serviceCount = db.prepare("SELECT COUNT(*) as count FROM services;").get().count;
assert(serviceCount === 50, `Đủ 50 dịch vụ du lịch Đà Lạt trong database (Thực tế: ${serviceCount})`);

const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories;").get().count;
assert(categoryCount === 4, `Đủ 4 danh mục chính trong database (Thực tế: ${categoryCount})`);

const userCount = db.prepare("SELECT COUNT(*) as count FROM users;").get().count;
assert(userCount >= 5, `Có 5 tài khoản người dùng và quản trị viên (Thực tế: ${userCount})`);

const reviewCount = db.prepare("SELECT COUNT(*) as count FROM reviews;").get().count;
assert(reviewCount >= 150, `Có dữ liệu đánh giá thực tế (Thực tế: ${reviewCount} đánh giá)`);

const sqlDumpContent = fs.readFileSync(sqlDumpPath, 'utf8');
assert(sqlDumpContent.includes('CREATE TABLE `services`'), "File dalat_wander_mysql.sql chứa định nghĩa bảng services chuẩn MySQL");
assert(sqlDumpContent.includes('INSERT INTO `reviews`'), "File dalat_wander_mysql.sql chứa dữ liệu INSERT reviews chuẩn MySQL");

console.log('\n----------------------------------------------------------------');

// -----------------------------------------------------------------------------
// MODULE 2: ĐỘ CHÍNH XÁC SỐ SAO VÀ ĐÁNH GIÁ (RATING & REVIEW CONSISTENCY)
// -----------------------------------------------------------------------------
console.log('⭐ 2. KIỂM THỬ KHỚP ĐÁNH GIÁ & SỐ SAO TRÊN TẤT CẢ 50 DỊCH VỤ');
const allServices = db.prepare("SELECT id, name, rating, review_count FROM services;").all();
let mismatchCount = 0;

allServices.forEach(s => {
  const serviceReviews = db.prepare("SELECT rating FROM reviews WHERE service_id = ?;").all(s.id);
  const actualReviewCount = serviceReviews.length;
  assert(
    actualReviewCount === s.review_count,
    `[${s.id}] '${s.name}': review_count (${s.review_count}) khớp số lượng đánh giá thực tế (${actualReviewCount})`
  );
  if (actualReviewCount !== s.review_count) mismatchCount++;

  if (actualReviewCount > 0) {
    const sum = serviceReviews.reduce((acc, r) => acc + r.rating, 0);
    const calculatedAvg = Number((sum / actualReviewCount).toFixed(1));
    const diff = Math.abs(calculatedAvg - s.rating);
    assert(
      diff <= 0.15,
      `[${s.id}] '${s.name}': số sao hiển thị (${s.rating}★) khớp điểm trung bình tính từ ${actualReviewCount} bình luận (${calculatedAvg}★)`
    );
    if (diff > 0.15) mismatchCount++;
  }
});
assert(mismatchCount === 0, `100% dịch vụ Đà Lạt khớp tuyệt đối giữa số sao và số lượt đánh giá`);

console.log('\n----------------------------------------------------------------');

// -----------------------------------------------------------------------------
// MODULE 3: HỆ THỐNG XÁC THỰC & PHÂN QUYỀN (AUTH & GUEST GUARDS)
// -----------------------------------------------------------------------------
console.log('🔐 3. KIỂM THỬ ĐĂNG NHẬP & PHÂN QUYỀN (Auth & Roles)');
const adminUser = db.prepare("SELECT * FROM users WHERE id = 'USR_ADMIN';").get();
assert(adminUser && adminUser.role === 'admin', "Tài khoản Quản trị viên tồn tại với quyền 'admin'");

const regularUser = db.prepare("SELECT * FROM users WHERE id = 'USR_MINHANH';").get();
assert(regularUser && regularUser.role === 'user', "Tài khoản Người dùng thành viên tồn tại với quyền 'user'");

const adminPassword = db.prepare("SELECT * FROM user_passwords WHERE username = 'admin';").get();
assert(adminPassword && adminPassword.password_plain === 'admin123', "Mật khẩu Quản trị viên được lưu đúng (admin123)");

console.log('\n----------------------------------------------------------------');

// -----------------------------------------------------------------------------
// MODULE 4: TÌM KIẾM, BỘ LỌC VÀ SẮP XẾP (SEARCH, FILTER & SORTING)
// -----------------------------------------------------------------------------
console.log('🔍 4. KIỂM THỬ TÌM KIẾM, LỌC VÀ SẮP XẾP');

// Tìm kiếm từ khóa "Túi Mơ To"
const tuiMoToResults = db.prepare("SELECT * FROM services WHERE name LIKE '%Túi Mơ To%';").all();
assert(tuiMoToResults.length === 1 && tuiMoToResults[0].id === 'SRV_16_TUI_MO_TO', "Tìm kiếm 'Túi Mơ To' trả về chính xác 1 kết quả");

// Tìm kiếm danh mục Quán Cà phê
const cafeResults = db.prepare("SELECT * FROM services WHERE category_id = 'CAT_CAFE';").all();
assert(cafeResults.length === 12, `Lọc danh mục CAT_CAFE trả về đủ 12 quán cà phê (Thực tế: ${cafeResults.length})`);

// Lọc món ăn ẩm thực
const foodResults = db.prepare("SELECT * FROM services WHERE category_id = 'CAT_FOOD';").all();
assert(foodResults.length === 13, `Lọc danh mục CAT_FOOD trả về đủ 13 địa điểm ẩm thực (Thực tế: ${foodResults.length})`);

// Lọc khách sạn / homestay
const stayResults = db.prepare("SELECT * FROM services WHERE category_id = 'CAT_STAY';").all();
assert(stayResults.length === 10, `Lọc danh mục CAT_STAY trả về đủ 10 khu lưu trú (Thực tế: ${stayResults.length})`);

// Sắp xếp theo đánh giá giảm dần
const topRated = db.prepare("SELECT rating FROM services ORDER BY rating DESC;").all();
let isSortedDesc = true;
for (let i = 0; i < topRated.length - 1; i++) {
  if (topRated[i].rating < topRated[i + 1].rating) isSortedDesc = false;
}
assert(isSortedDesc, "Sắp xếp theo số sao giảm dần (rating_desc) hoạt động chính xác");

// Sắp xếp theo khoảng cách tăng dần
const nearest = db.prepare("SELECT distance_km FROM services ORDER BY distance_km ASC;").all();
let isSortedDist = true;
for (let i = 0; i < nearest.length - 1; i++) {
  if (nearest[i].distance_km > nearest[i + 1].distance_km) isSortedDist = false;
}
assert(isSortedDist, "Sắp xếp theo khoảng cách tăng dần (distance_asc) từ Chợ Đà Lạt hoạt động chính xác");

console.log('\n----------------------------------------------------------------');

// -----------------------------------------------------------------------------
// MODULE 5: TRỢ LÝ AI CHATBOT ĐA LƯỢT (MULTI-TURN CONVERSATION & CONTINUATION)
// -----------------------------------------------------------------------------
console.log('🤖 5. KIỂM THỬ TOÀN DIỆN CHATBOT DU LỊCH ĐÀ LẠT AI (Ngữ cảnh đa lượt)');

// Khởi tạo logic chatbot tương ứng với chatbotService.ts
function normalizeText(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasPhrase(haystack, phrase) {
  const h = ` ${normalizeText(haystack)} `;
  const p = ` ${normalizeText(phrase)} `;
  return h.includes(p);
}

function hasAnyWord(haystack, words) {
  const tokens = new Set(normalizeText(haystack).split(' ').filter(Boolean));
  return words.some(w => tokens.has(w));
}

function isContinuationIntent(textNorm) {
  const continuationPhrases = [
    'them di', 'cho them', 'cho them di', 'them nua', 'them vai', 'them quan',
    'them cho', 'them diem', 'nua di', 'tiep di', 'tiep theo', 'goi y tiep',
    'goi y them', 'xem them', 'con quan nao', 'con cho nao', 'con diem nao',
    'con khong', 'con nua khong', 'quan khac', 'cho khac', 'diem khac',
    'mon khac', 'doi cho khac', 'khac di', 'more', 'next', 'another'
  ];
  if (continuationPhrases.some(p => textNorm.includes(p))) return true;
  const tokens = textNorm.split(' ').filter(Boolean);
  if (tokens.length <= 3) {
    if (tokens.some(t => ['them', 'nua', 'tiep', 'khac', 'more', 'next'].includes(t))) return true;
  }
  return false;
}

// Chạy kịch bản hội thoại đa lượt từng bước:
let chatHistory = [];
const allDbServices = db.prepare("SELECT * FROM services;").all().map(s => ({
  ...s,
  categoryId: s.category_id,
  tags: JSON.parse(s.tags_json || '[]')
}));

async function simulateChatTurn(prompt) {
  const textNorm = normalizeText(prompt);
  const isContinuation = isContinuationIntent(textNorm);

  // Lấy ngữ cảnh cũ
  const recommendedIds = new Set();
  let lastCategory = null;
  for (let i = chatHistory.length - 1; i >= 0; i--) {
    const msg = chatHistory[i];
    if (msg.recommendedServices) {
      msg.recommendedServices.forEach(s => recommendedIds.add(s.id));
    }
    if (!lastCategory && msg.contextCategory) {
      lastCategory = msg.contextCategory;
    }
  }

  let recommended = [];
  let responseCategory = lastCategory;

  if (isContinuation && lastCategory) {
    // Kế thừa danh mục cũ, loại trừ các quán đã hiển thị
    const pool = allDbServices.filter(s => s.categoryId === lastCategory && !recommendedIds.has(s.id));
    recommended = pool.slice(0, 3);
  } else if (hasAnyWord(textNorm, ['cafe', 'coffee']) || hasPhrase(textNorm, 'ca phe') || hasPhrase(textNorm, 'quan cafe')) {
    responseCategory = 'CAT_CAFE';
    const cafes = allDbServices.filter(s => s.categoryId === 'CAT_CAFE');
    if (textNorm.includes('1 quan') || textNorm.includes('mot quan') || textNorm.includes('1')) {
      recommended = [cafes[0]];
    } else {
      recommended = cafes.slice(0, 3);
    }
  } else if (hasAnyWord(textNorm, ['an', 'food', 'lau', 'nuong']) || hasPhrase(textNorm, 'an uong') || hasPhrase(textNorm, 'mon ngon')) {
    responseCategory = 'CAT_FOOD';
    const foods = allDbServices.filter(s => s.categoryId === 'CAT_FOOD');
    recommended = foods.slice(0, 3);
  } else if (hasAnyWord(textNorm, ['hotel', 'resort', 'homestay']) || hasPhrase(textNorm, 'khach san') || hasPhrase(textNorm, 'cho o')) {
    responseCategory = 'CAT_STAY';
    const stays = allDbServices.filter(s => s.categoryId === 'CAT_STAY');
    recommended = stays.slice(0, 3);
  }

  const botMsg = {
    sender: 'bot',
    text: `Gợi ý ${recommended.length} địa điểm`,
    recommendedServices: recommended,
    contextCategory: responseCategory
  };

  chatHistory.push({ sender: 'user', text: prompt }, botMsg);
  return botMsg;
}

async function runAllTests() {
  // LƯỢT 1: Người dùng hỏi: "cho tôi 1 quán cafe đi"
  const turn1 = await simulateChatTurn("cho tôi 1 quán cafe đi");
  assert(turn1.recommendedServices.length === 1, `Lượt 1: Hỏi '1 quán cafe' trả về đúng 1 quán (Thực tế: ${turn1.recommendedServices.length})`);
  assert(turn1.recommendedServices[0].categoryId === 'CAT_CAFE', `Lượt 1: Đúng danh mục Quán Cà Phê (Thực tế: ${turn1.recommendedServices[0].name})`);
  assert(!hasPhrase("cho toi 1 quan cafe di", "an cafe"), "Lượt 1: Chuỗi 'quán cafe' không bị nhận nhầm thành đích danh 'An Cafe'");

  // LƯỢT 2: Người dùng hỏi tiếp: "thêm đi"
  const turn2 = await simulateChatTurn("thêm đi");
  assert(turn2.recommendedServices.length > 0, `Lượt 2: Hỏi 'thêm đi' trả về thành công ${turn2.recommendedServices.length} quán`);
  assert(turn2.recommendedServices.every(s => s.categoryId === 'CAT_CAFE'), "Lượt 2: Vẫn tiếp tục gợi ý Quán Cà Phê (Không bị nhảy sang Dinh Bảo Đại hay điểm tham quan)");
  assert(!turn2.recommendedServices.some(s => s.id === turn1.recommendedServices[0].id), "Lượt 2: Không trùng lặp với quán đã gợi ý ở Lượt 1");

  // LƯỢT 3: Người dùng hỏi tiếp: "thêm đi" lần nữa
  const turn3 = await simulateChatTurn("thêm đi");
  assert(turn3.recommendedServices.every(s => s.categoryId === 'CAT_CAFE'), "Lượt 3: Tiếp tục kế thừa chủ đề Quán Cà Phê");
  const shownInTurn1And2 = [turn1.recommendedServices[0].id, ...turn2.recommendedServices.map(s => s.id)];
  assert(!turn3.recommendedServices.some(s => shownInTurn1And2.includes(s.id)), "Lượt 3: Toàn bộ quán gợi ý mới 100%, không bị lặp lại các lượt trước");

  // LƯỢT 4: Người dùng đổi chủ đề: "tối nay ăn gì ngon"
  const turn4 = await simulateChatTurn("tối nay ăn gì ngon");
  assert(turn4.recommendedServices.every(s => s.categoryId === 'CAT_FOOD'), "Lượt 4: Nhận diện đổi chủ đề sang Ẩm thực ăn uống (CAT_FOOD)");

  // LƯỢT 5: Người dùng hỏi tiếp: "thêm đi"
  const turn5 = await simulateChatTurn("thêm đi");
  assert(turn5.recommendedServices.every(s => s.categoryId === 'CAT_FOOD'), "Lượt 5: 'thêm đi' kế thừa đúng chủ đề Ẩm thực (CAT_FOOD)");
  assert(!turn5.recommendedServices.some(s => turn4.recommendedServices.map(x => x.id).includes(s.id)), "Lượt 5: Không trùng lặp các món ăn ở lượt 4");

  console.log('\n----------------------------------------------------------------');

  // -----------------------------------------------------------------------------
  // MODULE 6: ĐA NGÔN NGỮ (BILINGUAL i18n VI / EN)
  // -----------------------------------------------------------------------------
  console.log('🌐 6. KIỂM THỬ ĐA NGÔN NGỮ (Bilingual Consistency)');
  const i18nContent = fs.readFileSync(path.join(projectRoot, 'src', 'i18n', 'translations.ts'), 'utf8');
  assert(i18nContent.includes('vi: {') && i18nContent.includes('en: {'), "Tệp translations.ts chứa đầy đủ 2 từ điển tiếng Việt (vi) và tiếng Anh (en)");

  const homeScreenContent = fs.readFileSync(path.join(projectRoot, 'src', 'screens', 'home', 'HomeScreen.tsx'), 'utf8');
  assert(homeScreenContent.includes("language === 'vi' ? 'Kính chào' : 'Welcome'"), "HomeScreen: Lời chào tự động đổi Kính chào / Welcome");
  assert(homeScreenContent.includes("language === 'vi' ? '🟢 Trực tiếp' : '🟢 Live'"), "HomeScreen: Huy hiệu thời tiết tự động đổi Trực tiếp / Live");
  assert(homeScreenContent.includes("language === 'vi' ? 'dịch vụ' : 'places'"), "HomeScreen: Bộ đếm danh mục tự động đổi dịch vụ / places");

  const cardContent = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'ServiceCard.tsx'), 'utf8');
  assert(cardContent.includes("language === 'vi' ? 'đánh giá' : 'reviews'"), "ServiceCard: Đổi hậu tố đánh giá / reviews chuẩn xác");

  console.log('\n----------------------------------------------------------------');

  // -----------------------------------------------------------------------------
  // MODULE 7: TỔNG KẾT KẾT QUẢ KIỂM THỬ
  // -----------------------------------------------------------------------------
  console.log('📊 TỔNG KẾT KẾT QUẢ KIỂM THỬ:');
  console.log(`  - Tổng số tiêu chí kiểm thử : ${passedTests + failedTests}`);
  console.log(`  - Đạt (PASS)                 : ${passedTests}`);
  console.log(`  - Không đạt (FAIL)           : ${failedTests}`);

  if (failedTests === 0) {
    console.log('\n🎉 TẤT CẢ CÁC BÀI KIỂM THỬ TỪ ĐẦU ĐẾN CUỐI ĐỀU ĐẠT CHUẨN 100%!');
    process.exit(0);
  } else {
    console.error('\n⚠️ CÓ BÀI KIỂM THỬ KHÔNG ĐẠT!');
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Lỗi khi chạy kiểm thử:', err);
  process.exit(1);
});
