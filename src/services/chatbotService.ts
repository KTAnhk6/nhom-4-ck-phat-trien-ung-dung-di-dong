/**
 * Dalat Travel AI Chatbot Service (Assigned to: Quang - Tìm kiếm, lọc, sắp xếp & Chatbot)
 * Intelligent multi-turn conversational assistant with context retention,
 * non-duplicate continuation recommendations ("thêm đi", "quán khác"),
 * and precise keyword/intent analysis in Vietnamese & English.
 */

import { ChatMessage, TourismService } from '../types';
import { tourismService } from './tourismService';

// Text normalizer: remove Vietnamese tones and non-alphanumeric chars
export function normalizeText(str: string): string {
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

// Checks if a phrase exists with word boundaries
export function hasPhrase(haystack: string, phrase: string): boolean {
  const h = ` ${normalizeText(haystack)} `;
  const p = ` ${normalizeText(phrase)} `;
  return h.includes(p);
}

// Checks if any word from list exists as a standalone token
export function hasAnyWord(haystack: string, words: string[]): boolean {
  const tokens = new Set(normalizeText(haystack).split(' ').filter(Boolean));
  return words.some(w => tokens.has(w));
}

// Extract requested quantity (e.g. "cho tôi 1 quán", "2 quán")
function extractRequestedCount(textNorm: string, defaultCount: number = 3): number {
  const match = textNorm.match(/\b(1|2|3|4|5|mot|hai|ba|bon|nam)\s*(quan|tiem|cho|diem|mon|khach san|homestay)?\b/);
  if (match) {
    const word = match[1];
    if (word === '1' || word === 'mot') return 1;
    if (word === '2' || word === 'hai') return 2;
    if (word === '3' || word === 'ba') return 3;
    if (word === '4' || word === 'bon') return 4;
    if (word === '5' || word === 'nam') return 5;
  }
  return defaultCount;
}

// Common Vietnamese & English stop words that should not be used as content search keywords
const STOP_WORDS = new Set([
  'cho', 'toi', 'minh', 'ban', 'em', 'anh', 'chi', 'di', 'o', 'tai', 'co', 'va', 'la',
  'cac', 'nhung', 'mot', 'hai', 'ba', 'bon', 'nam', '1', '2', '3', '4', '5',
  'quan', 'tiem', 'cho', 'diem', 'dia', 'toa', 'do', 'them', 'nua', 'tiep', 'khac',
  'con', 'khong', 'gi', 'nao', 'sao', 'the', 'thi', 'voi', 'duoc', 'nay', 'do', 'kia',
  'muon', 'can', 'tim', 'hoi', 'xem', 'biet', 'giup', 'nhe', 'nha', 'a', 'oi',
  'hay', 'nhieu', 'it', 'rat', 'qua', 'lam', 've', 'den', 'tu', 'chut', 'phu', 'trach',
  'please', 'show', 'give', 'me', 'the', 'a', 'an', 'some', 'more', 'any', 'is', 'are'
]);

// Map of unique spot aliases for exact name identification
const SPOT_KEY_ALIASES: Record<string, string[]> = {
  SRV_16_TUI_MO_TO: ['tui mo to'],
  SRV_17_CHEO_VEOOO: ['cheo veo', 'cheo veooo'],
  SRV_18_BINH_MINH_OI: ['binh minh oi'],
  SRV_19_LULULOLA_COFFEE: ['lululola', 'lululola coffee'],
  SRV_20_MAY_LANG_THANG: ['may lang thang'],
  SRV_22_BA_QUA_DOI: ['ba qua doi'],
  SRV_23_LOI_CUA_GIO: ['loi cua gio'],
  SRV_24_CAFE_TUNG: ['cafe tung', 'tung cafe'],
  SRV_25_AN_CAFE: ['an cafe', 'quan an cafe'],
  SRV_26_KONG_CAFE: ['kong cafe'],
  SRV_27_HORIZON_COFFEE: ['horizon', 'horizon coffee'],
  SRV_28_LAU_GA_TAO_NGO: ['tao ngo', 'lau ga tao ngo', 'lau ga la e tao ngo'],
  SRV_29_LAU_BO_BA_TOA: ['ba toa', 'quan go', 'lau bo ba toa', 'lau bo quan go'],
  SRV_30_BANH_CAN_LE: ['banh can le', 'quan le'],
  SRV_31_BANH_CAN_NHA_CHUNG: ['banh can nha chung'],
  SRV_32_BANH_MI_XIU_MAI_HOANG_DIEU: ['banh mi xiu mai hoang dieu', 'xiu mai hoang dieu'],
  SRV_33_BANH_MI_COI_XAY_GIO: ['coi xay gio', 'banh mi coi xay gio'],
  SRV_34_BANH_UOT_LONG_GA_TRANG: ['long ga trang', 'banh uot long ga trang'],
  SRV_35_KEM_BO_THANH_THAO: ['kem bo thanh thao', 'thanh thao'],
  SRV_36_NEM_NUONG_BA_HUNG: ['nem nuong ba hung', 'ba hung'],
  SRV_37_CHE_HE: ['che he'],
  SRV_38_NUONG_CHU_QUAN: ['nuong chu', 'chu quan'],
  SRV_39_GA_NUONG_DOI_TRANG: ['ga nuong doi trang', 'doi trang'],
  SRV_40_CHO_DEM_DA_LAT: ['cho dem', 'cho am phu', 'cho dem da lat'],
  SRV_01_QUANG_TRUONG_LAM_VIEN: ['quang truong lam vien', 'lam vien', 'nu hoa atiso'],
  SRV_02_HO_XUAN_HUONG: ['ho xuan huong', 'xuan huong'],
  SRV_03_GA_DA_LAT: ['ga da lat', 'ga xe lua da lat'],
  SRV_04_DINH_1_BAO_DAI: ['dinh 1', 'dinh i', 'king palace', 'dinh 1 bao dai'],
  SRV_05_DINH_3_BAO_DAI: ['dinh 3', 'dinh iii', 'biet dien bao dai', 'dinh 3 bao dai'],
  SRV_06_THIEN_VIEN_TRUC_LAM: ['thien vien truc lam', 'truc lam'],
  SRV_07_HO_TUYEN_LAM: ['ho tuyen lam', 'tuyen lam'],
  SRV_08_CHUA_LINH_PHUOC: ['chua linh phuoc', 'chua ve chai', 'linh phuoc'],
  SRV_09_THAC_DATANLA: ['thac datanla', 'datanla', 'mang truot datanla'],
  SRV_10_THAC_PRENN: ['thac prenn', 'prenn'],
  SRV_11_LANGBIANG: ['langbiang', 'dinh langbiang', 'nui langbiang'],
  SRV_12_DOI_CHE_CAU_DAT: ['doi che cau dat', 'cau dat', 'cau dat farm'],
  SRV_13_DOMAINE_DE_MARIE: ['domaine de marie', 'nha tho mai anh'],
  SRV_14_NHA_THO_CON_GA: ['nha tho con ga', 'nha tho chinh toa'],
  SRV_15_VUON_HOA_THANH_PHO: ['vuon hoa thanh pho', 'vuon hoa da lat'],
  SRV_41_DALAT_PALACE: ['dalat palace', 'khach san palace'],
  SRV_42_ANA_MANDARA: ['ana mandara', 'ana mandara villas'],
  SRV_43_TERRACOTTA_RESORT: ['terracotta', 'terracotta resort'],
  SRV_44_SWISS_BELRESORT: ['swiss belresort', 'swiss bel'],
  SRV_45_MERCURE_DALAT: ['mercure', 'mercure dalat'],
  SRV_46_HOTEL_COLLINE: ['hotel colline', 'colline'],
  SRV_47_THE_KUPID_HILL: ['the kupid', 'kupid hill'],
  SRV_48_DOI_MOT_NGUOI: ['doi mot nguoi', 'doi mot nguoi homestay'],
  SRV_49_NHA_BEN_RUNG: ['nha ben rung'],
  SRV_50_LA_NHA_HOMESTAY: ['la nha', 'la nha homestay'],
};

// Check if message is a continuation intent ("thêm đi", "quán khác", "tiếp đi", etc.)
export function isContinuationIntent(textNorm: string): boolean {
  const continuationPhrases = [
    'them di',
    'cho them',
    'cho them di',
    'them nua',
    'them vai',
    'them quan',
    'them cho',
    'them diem',
    'nua di',
    'tiep di',
    'tiep theo',
    'goi y tiep',
    'goi y them',
    'xem them',
    'con quan nao',
    'con cho nao',
    'con diem nao',
    'con khong',
    'con nua khong',
    'quan khac',
    'cho khac',
    'diem khac',
    'mon khac',
    'doi cho khac',
    'khac di',
    'more',
    'give me more',
    'next',
    'another',
    'anything else',
    'what else',
  ];

  if (continuationPhrases.some(p => textNorm.includes(p))) {
    return true;
  }

  // Short single-word inputs like "thêm", "nữa", "tiếp", "khác"
  const tokens = textNorm.split(' ').filter(Boolean);
  if (tokens.length <= 3) {
    if (tokens.some(t => ['them', 'nua', 'tiep', 'khac', 'more', 'next'].includes(t))) {
      return true;
    }
  }

  return false;
}

// Conversation context extracted from past messages
export interface ConversationContext {
  lastCategory: 'CAT_CAFE' | 'CAT_FOOD' | 'CAT_STAY' | 'CAT_ATTRACTION' | 'ITINERARY' | null;
  lastSubTopic?: string;
  recommendedServiceIds: Set<string>;
}

export function extractHistoryContext(history: ChatMessage[]): ConversationContext {
  const recommendedServiceIds = new Set<string>();
  let lastCategory: ConversationContext['lastCategory'] = null;
  let lastSubTopic: string | undefined = undefined;

  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];

    // Collect all previously shown service IDs to prevent duplication
    if (msg.recommendedServices && Array.isArray(msg.recommendedServices)) {
      msg.recommendedServices.forEach(s => {
        if (s && s.id) recommendedServiceIds.add(s.id);
      });
    }

    // Determine the most recent category context
    if (!lastCategory && msg.contextCategory) {
      lastCategory = msg.contextCategory as any;
      lastSubTopic = msg.contextTopic;
    }

    if (!lastCategory && msg.sender === 'bot' && msg.recommendedServices && msg.recommendedServices.length > 0) {
      const firstCat = msg.recommendedServices[0].categoryId;
      if (
        firstCat === 'CAT_CAFE' ||
        firstCat === 'CAT_FOOD' ||
        firstCat === 'CAT_STAY' ||
        firstCat === 'CAT_ATTRACTION'
      ) {
        lastCategory = firstCat;
      }
    }
  }

  return { lastCategory, lastSubTopic, recommendedServiceIds };
}

class DalatChatbotService {
  // Fallback internal context when caller does not pass history
  private sessionContext: ConversationContext = {
    lastCategory: null,
    lastSubTopic: undefined,
    recommendedServiceIds: new Set<string>(),
  };

  /**
   * Reset the active chatbot session context (e.g. when user clears chat)
   */
  resetSession(): void {
    this.sessionContext = {
      lastCategory: null,
      lastSubTopic: undefined,
      recommendedServiceIds: new Set<string>(),
    };
  }

  /**
   * Main entry point to interpret user prompt and return smart, context-aware reply
   */
  async processUserMessage(prompt: string, history?: ChatMessage[]): Promise<ChatMessage> {
    const textRaw = prompt.trim();
    const textNorm = normalizeText(textRaw);
    const allServices = await tourismService.getAllServices();

    // 1. Resolve conversation context (from history or internal session)
    const ctx: ConversationContext = history && history.length > 0
      ? extractHistoryContext(history)
      : this.sessionContext;

    const isContinuation = isContinuationIntent(textNorm);
    const requestedCount = extractRequestedCount(textNorm, isContinuation ? 3 : 3);

    let recommended: TourismService[] = [];
    let responseText = '';
    let newCategory: ConversationContext['lastCategory'] = ctx.lastCategory;
    let newSubTopic: string | undefined = ctx.lastSubTopic;

    // =========================================================================
    // CASE A: User asks for a CONTINUATION ("thêm đi", "quán khác", "tiếp đi")
    // =========================================================================
    if (isContinuation) {
      // If we already have a previous category context (e.g. CAT_CAFE or CAT_FOOD)
      if (ctx.lastCategory) {
        let pool = allServices.filter(
          s => s.categoryId === ctx.lastCategory && !ctx.recommendedServiceIds.has(s.id)
        );

        // Subtopic prioritization if applicable
        if (ctx.lastSubTopic === 'sunset' || ctx.lastSubTopic === 'cloud') {
          const subPool = pool.filter(s =>
            s.tags.some(t => {
              const tn = normalizeText(t);
              return tn.includes('hoang hon') || tn.includes('san may') || tn.includes('view');
            })
          );
          if (subPool.length > 0) pool = subPool;
        }

        const countToTake = Math.min(requestedCount, pool.length > 0 ? pool.length : 3);
        recommended = pool.slice(0, countToTake);

        if (recommended.length > 0) {
          switch (ctx.lastCategory) {
            case 'CAT_CAFE':
              responseText = `☕ Dưới đây là thêm ${recommended.length} quán cà phê tuyệt vời khác tại Đà Lạt dành cho bạn:`;
              break;
            case 'CAT_FOOD':
              responseText = `🍲 Gợi ý thêm cho bạn ${recommended.length} món ngon và quán ăn đặc sản nổi tiếng khác tại Đà Lạt:`;
              break;
            case 'CAT_STAY':
              responseText = `🏡 Dưới đây là thêm ${recommended.length} lựa chọn homestay / khách sạn nghỉ dưỡng rất được yêu thích:`;
              break;
            case 'CAT_ATTRACTION':
              responseText = `🏛️ Thêm ${recommended.length} địa điểm tham quan & thắng cảnh nổi bật tại xứ sở sương mù:`;
              break;
            default:
              responseText = `✨ Dưới đây là thêm ${recommended.length} địa điểm thú vị khác dành cho bạn:`;
          }
        } else {
          // All spots in this category have been shown!
          const otherFeatured = allServices
            .filter(s => s.categoryId !== ctx.lastCategory && !ctx.recommendedServiceIds.has(s.id) && s.isFeatured)
            .slice(0, 3);
          recommended = otherFeatured;
          responseText = `🌟 Bạn đã khám phá hết các địa điểm nổi bật thuộc chủ đề này rồi! Mình gợi ý thêm những điểm đến đặc sắc khác tại Đà Lạt để bạn tham khảo nhé:`;
        }
      } else {
        // Continuation requested but no prior context exists in session
        const featured = allServices.filter(s => s.isFeatured && !ctx.recommendedServiceIds.has(s.id)).slice(0, 3);
        recommended = featured.length > 0 ? featured : allServices.slice(0, 3);
        responseText = `🌿 Bạn đang muốn tìm thêm về quán cà phê view đẹp, địa điểm ăn uống đặc sản, homestay hay các điểm check-in tham quan? Bạn hãy nhắn cụ thể sở thích của mình nhé! Tạm thời mình gửi bạn vài tọa độ tiêu biểu:`;
      }
    }
    // =========================================================================
    // CASE B: Direct Specific Place Match by Name / Alias
    // =========================================================================
    else {
      // Check for exact spot aliases first (avoids "quan cafe" matching "an cafe")
      let directMatch: TourismService | null = null;
      for (const [srvId, aliases] of Object.entries(SPOT_KEY_ALIASES)) {
        for (const alias of aliases) {
          if (hasPhrase(textNorm, alias)) {
            const found = allServices.find(s => s.id === srvId);
            if (found) {
              directMatch = found;
              break;
            }
          }
        }
        if (directMatch) break;
      }

      if (directMatch) {
        recommended = [directMatch];
        newCategory = directMatch.categoryId as any;
        responseText = `✨ Mình đã tìm thấy thông tin chi tiết về "${directMatch.name}" (${directMatch.categoryName}) tại Đà Lạt dành cho bạn:`;
      }
      // =======================================================================
      // CASE C: Category / Vibe Intent Detection
      // =======================================================================
      // 1. Cà phê / Cafe / Coffee / Acoustic / View
      else if (
        hasAnyWord(textNorm, ['cafe', 'coffee']) ||
        hasPhrase(textNorm, 'ca phe') ||
        hasPhrase(textNorm, 'quan cafe') ||
        hasPhrase(textNorm, 'tiem cafe') ||
        hasPhrase(textNorm, 'tiem ca phe') ||
        hasPhrase(textNorm, 'uong cafe') ||
        hasPhrase(textNorm, 'quan nuoc') ||
        hasPhrase(textNorm, 'acoustic')
      ) {
        newCategory = 'CAT_CAFE';
        const cafes = allServices.filter(s => s.categoryId === 'CAT_CAFE');

        if (hasPhrase(textNorm, 'san may') || hasPhrase(textNorm, 'binh minh')) {
          newSubTopic = 'cloud';
          recommended = cafes.filter(
            s => s.id === 'SRV_18_BINH_MINH_OI' || s.id === 'SRV_16_TUI_MO_TO' || s.tags.includes('Săn mây')
          );
          responseText = '☕ Để vừa uống cà phê vừa săn mây đón bình minh, Tiệm Cà Phê Bình Minh Ơi (89 Hoàng Hoa Thám) và Túi Mơ To là sự lựa chọn số 1. Dưới đây là các tọa độ cafe săn mây tuyệt đẹp:';
        } else if (hasPhrase(textNorm, 'hoang hon') || hasPhrase(textNorm, 'thung lung') || hasPhrase(textNorm, 'chieu')) {
          newSubTopic = 'sunset';
          recommended = cafes.filter(
            s =>
              s.id === 'SRV_17_CHEO_VEOOO' ||
              s.id === 'SRV_23_LOI_CUA_GIO' ||
              s.id === 'SRV_19_LULULOLA_COFFEE' ||
              s.id === 'SRV_22_BA_QUA_DOI'
          );
          responseText = '☕ Hoàng hôn buông xuống thung lũng Đà Lạt là khoảnh khắc kỳ diệu nhất! Mình gợi ý bạn ghé Tiệm Cheo Veooo (Hoàng hôn cam đỏ), Lời Của Gió (ngắm nhà lồng Xóm Lèo) hoặc Lululola:';
        } else if (hasPhrase(textNorm, 'nhac') || hasPhrase(textNorm, 'acoustic') || hasPhrase(textNorm, 'show')) {
          newSubTopic = 'acoustic';
          recommended = cafes.filter(
            s => s.id === 'SRV_19_LULULOLA_COFFEE' || s.id === 'SRV_20_MAY_LANG_THANG'
          );
          responseText = '🎶 Thưởng thức đêm nhạc acoustic giữa núi đồi se lạnh là trải nghiệm không thể bỏ qua. Lululola Coffee+ và Mây Lang Thang là 2 thánh địa âm nhạc nổi tiếng nhất Đà Lạt:';
        } else if (hasPhrase(textNorm, 'co dien') || hasPhrase(textNorm, 'vintage') || hasPhrase(textNorm, 'xua') || hasPhrase(textNorm, 'trung tam')) {
          newSubTopic = 'vintage';
          recommended = cafes.filter(
            s => s.id === 'SRV_24_CAFE_TUNG' || s.id === 'SRV_25_AN_CAFE' || s.id === 'SRV_16_TUI_MO_TO'
          );
          responseText = '☕ Nếu bạn yêu thích nét mộc mạc cổ kính: Cafe Tùng (ngay Chợ Hòa Bình từ năm 1958) và An Cafe là những biểu tượng văn hóa cà phê Đà Lạt:';
        } else {
          newSubTopic = 'general';
          const topCafes = cafes.filter(s => !ctx.recommendedServiceIds.has(s.id));
          const count = requestedCount === 1 ? 1 : Math.min(requestedCount, 3);
          recommended = topCafes.length >= count ? topCafes.slice(0, count) : cafes.slice(0, count);
          responseText =
            count === 1
              ? `☕ Gợi ý tiệm cà phê tiêu biểu nhất dành cho bạn: "${recommended[0]?.name}" view đẹp, không gian thơ mộng rất được du khách yêu thích:`
              : `☕ Tuyệt vời! Đà Lạt là thiên đường của những quán cà phê view đồi thông, thung lũng đèn đêm và cúc họa mi thơ mộng. Dưới đây là những tiệm cà phê tiêu biểu nhất dành cho bạn:`;
        }
      }
      // 2. Ăn uống / Quán ăn / Ẩm thực / Đặc sản
      else if (
        hasAnyWord(textNorm, ['food', 'lau', 'nuong', 'an']) ||
        hasPhrase(textNorm, 'an uong') ||
        hasPhrase(textNorm, 'quan an') ||
        hasPhrase(textNorm, 'am thuc') ||
        hasPhrase(textNorm, 'dac san') ||
        hasPhrase(textNorm, 'mon ngon') ||
        hasPhrase(textNorm, 'an toi') ||
        hasPhrase(textNorm, 'an trua') ||
        hasPhrase(textNorm, 'an sang') ||
        hasPhrase(textNorm, 'an vat') ||
        hasPhrase(textNorm, 'banh can') ||
        hasPhrase(textNorm, 'banh mi') ||
        hasPhrase(textNorm, 'kem bo')
      ) {
        newCategory = 'CAT_FOOD';
        const foods = allServices.filter(s => s.categoryId === 'CAT_FOOD');

        if (hasPhrase(textNorm, 'lau ga') || hasPhrase(textNorm, 'la e')) {
          newSubTopic = 'chicken_hotpot';
          recommended = foods.filter(s => s.id === 'SRV_28_LAU_GA_TAO_NGO');
          responseText = '🍲 Nhắc đến Đà Lạt là phải nhắc đến Lẩu Gà Lá É Tao Ngộ (Số 5 đường 3/4) với nước dùng the cay, lá é thơm nồng bốc khói nghi ngút:';
        } else if (hasPhrase(textNorm, 'lau bo') || hasPhrase(textNorm, 'ba toa')) {
          newSubTopic = 'beef_hotpot';
          recommended = foods.filter(s => s.id === 'SRV_29_LAU_BO_BA_TOA');
          responseText = '🥩 Lẩu Bò Ba Toa Quán Gỗ (1/29 Hoàng Diệu) nức tiếng với nồi lẩu ngập thịt bắp, đuôi, gân bò chấm chao ớt cay xè:';
        } else if (hasPhrase(textNorm, 'banh can')) {
          newSubTopic = 'banh_can';
          recommended = foods.filter(s => s.id === 'SRV_30_BANH_CAN_LE' || s.id === 'SRV_31_BANH_CAN_NHA_CHUNG');
          responseText = '🍳 Bánh căn nóng giòn chấm xíu mại mỡ hành ngập tràn! Gợi ý số 1 là Bánh Căn Lệ (Yersin) và Bánh Căn Nhà Chung:';
        } else if (hasPhrase(textNorm, 'kem bo')) {
          newSubTopic = 'kem_bo';
          recommended = foods.filter(s => s.id === 'SRV_35_KEM_BO_THANH_THAO');
          responseText = '🍨 Kem Bơ Thanh Thảo (76 Nguyễn Văn Trỗi) - món tráng miệng huyền thoại thơm béo ngậy ai cũng phải thử:';
        } else if (hasPhrase(textNorm, 'cho dem') || hasPhrase(textNorm, 'an vat')) {
          newSubTopic = 'street_food';
          recommended = foods.filter(s => s.id === 'SRV_40_CHO_DEM_DA_LAT');
          responseText = '🍢 Thiên đường ăn vặt Chợ Đêm Đà Lạt (Chợ Âm Phủ) với bánh tráng nướng, dâu lắc, xiên que nướng và sữa đậu nành nóng hổi:';
        } else {
          newSubTopic = 'general';
          const topFoods = foods.filter(s => !ctx.recommendedServiceIds.has(s.id));
          const count = requestedCount === 1 ? 1 : Math.min(requestedCount, 3);
          recommended = topFoods.length >= count ? topFoods.slice(0, count) : foods.slice(0, count);
          responseText =
            count === 1
              ? `🍲 Gợi ý quán ăn đặc sản nổi tiếng nhất dành cho bạn: "${recommended[0]?.name}":`
              : `🍲 Đi Đà Lạt se lạnh mà không xì xụp nồi lẩu the cay hay thưởng thức các món ăn vặt đường phố trứ danh thì thật thiếu sót! Đây là những quán ăn đặc sản được yêu thích nhất:`;
        }
      }
      // 3. Khách sạn / Homestay / Resort / Lưu trú / Nơi ở
      else if (
        hasAnyWord(textNorm, ['hotel', 'resort', 'homestay']) ||
        hasPhrase(textNorm, 'khach san') ||
        hasPhrase(textNorm, 'nha nghi') ||
        hasPhrase(textNorm, 'luu tru') ||
        hasPhrase(textNorm, 'cho o') ||
        hasPhrase(textNorm, 'noi o') ||
        hasPhrase(textNorm, 'phong nghi') ||
        hasPhrase(textNorm, 'nghi duong')
      ) {
        newCategory = 'CAT_STAY';
        const stays = allServices.filter(s => s.categoryId === 'CAT_STAY');

        if (hasPhrase(textNorm, '5 sao') || hasPhrase(textNorm, 'sang trong') || hasPhrase(textNorm, 'cao cap')) {
          newSubTopic = 'luxury';
          recommended = stays.filter(s => s.id === 'SRV_41_DALAT_PALACE' || s.id === 'SRV_42_ANA_MANDARA');
          responseText = '🏰 Nghỉ dưỡng chuẩn 5 sao di sản sang trọng: Dalat Palace Hotel kiến trúc Pháp 1922 và Quần thể biệt thự rừng thông Ana Mandara Villas:';
        } else if (hasPhrase(textNorm, 'tuyen lam') || hasPhrase(textNorm, 'ven ho')) {
          newSubTopic = 'lake';
          recommended = stays.filter(s => s.id === 'SRV_43_TERRACOTTA_RESORT' || s.id === 'SRV_44_SWISS_BELRESORT');
          responseText = '🌲 Nghỉ dưỡng ven hồ Tuyền Lâm yên bình: Terracotta Resort và lâu đài Swiss-Belresort giữa ngàn thông:';
        } else if (hasPhrase(textNorm, 'homestay') || hasPhrase(textNorm, 'view thung lung') || hasPhrase(textNorm, 'chill')) {
          newSubTopic = 'homestay';
          recommended = stays.filter(s => s.id === 'SRV_48_DOI_MOT_NGUOI' || s.id === 'SRV_47_THE_KUPID_HILL' || s.id === 'SRV_50_LA_NHA_HOMESTAY');
          responseText = '🏡 Những homestay thơ mộng chữa lành tâm hồn: Đợi Một Người (nhà kính mặt hồ), The Kupid Hill (phòng kính view thông) và Là Nhà Homestay:';
        } else {
          newSubTopic = 'general';
          const topStays = stays.filter(s => !ctx.recommendedServiceIds.has(s.id));
          const count = requestedCount === 1 ? 1 : Math.min(requestedCount, 3);
          recommended = topStays.length >= count ? topStays.slice(0, count) : stays.slice(0, count);
          responseText = '🏡 Lựa chọn không gian lưu trú và nghỉ dưỡng tuyệt vời tại xứ sương mù dành cho chuyến đi của bạn:';
        }
      }
      // 4. Săn mây / Bình minh
      else if (
        hasPhrase(textNorm, 'san may') ||
        hasPhrase(textNorm, 'binh minh') ||
        hasPhrase(textNorm, 'cloud')
      ) {
        newCategory = 'CAT_ATTRACTION';
        newSubTopic = 'cloud';
        recommended = allServices.filter(
          s =>
            s.id === 'SRV_12_DOI_CHE_CAU_DAT' ||
            s.id === 'SRV_18_BINH_MINH_OI' ||
            s.id === 'SRV_16_TUI_MO_TO'
        );
        responseText =
          '🌲 Để săn mây tại Đà Lạt trọn vẹn nhất, bạn nên xuất phát từ 4h30 - 5h00 sáng nhé! Tọa độ săn mây biển mây cuồn cuộn đẹp nhất là Đồi Chè Cầu Đất hoặc Tiệm Cà Phê Bình Minh Ơi (Hoàng Hoa Thám):';
      }
      // 5. Cung đường / Lộ trình / Lịch trình
      else if (
        hasPhrase(textNorm, 'cung duong') ||
        hasPhrase(textNorm, 'lich trinh') ||
        hasPhrase(textNorm, 'lo trinh') ||
        hasPhrase(textNorm, 'itinerary') ||
        hasPhrase(textNorm, 'di dau') ||
        hasPhrase(textNorm, 'choi gi')
      ) {
        newCategory = 'ITINERARY';
        recommended = allServices
          .filter(
            s =>
              s.id === 'SRV_12_DOI_CHE_CAU_DAT' ||
              s.id === 'SRV_09_THAC_DATANLA' ||
              s.id === 'SRV_03_GA_DA_LAT' ||
              s.id === 'SRV_28_LAU_GA_TAO_NGO'
          )
          .slice(0, 4);
        responseText =
          '🗺️ Cẩm nang du lịch Đà Lạt gợi ý bạn 3 CUNG ĐƯỜNG KHÁM PHÁ tối ưu cự ly và thời gian nhất:\n\n' +
          '1️⃣ Cung 1 (Đông Nam): Đồi chè Cầu Đất (5h00) ➜ Chùa Ve Chai (8h30) ➜ Túi Mơ To (10h00) ➜ Xóm Lèo ngắm đèn (17h00).\n' +
          '2️⃣ Cung 2 (Phía Nam): Máng trượt Datanla (8h30) ➜ Thiền Viện Trúc Lâm (11h00) ➜ Hồ Tuyền Lâm & Gà nướng Đồi Trăng (12h30) ➜ Lululola acoustic (16h30).\n' +
          '3️⃣ Cung 3 (Trung tâm < 2km): Bánh mì xíu mại Hoàng Diệu (7h00) ➜ Ga Đà Lạt & Dinh III (8h30) ➜ Lẩu bò Ba Toa (12h00) ➜ Chợ Đêm Đà Lạt (18h30).';
      }
      // 6. Điểm tham quan / Danh thắng / Check-in / Sống ảo
      else if (
        hasPhrase(textNorm, 'tham quan') ||
        hasPhrase(textNorm, 'danh thang') ||
        hasPhrase(textNorm, 'diem den') ||
        hasPhrase(textNorm, 'di tich') ||
        hasPhrase(textNorm, 'check in') ||
        hasPhrase(textNorm, 'song ao') ||
        hasPhrase(textNorm, 'chup hinh') ||
        hasPhrase(textNorm, 'chup anh') ||
        hasPhrase(textNorm, 'bieu tuong')
      ) {
        newCategory = 'CAT_ATTRACTION';
        const attractions = allServices.filter(s => s.categoryId === 'CAT_ATTRACTION');
        const count = requestedCount === 1 ? 1 : Math.min(requestedCount, 3);
        const topAttrs = attractions.filter(s => !ctx.recommendedServiceIds.has(s.id));
        recommended = topAttrs.length >= count ? topAttrs.slice(0, count) : attractions.slice(0, count);
        responseText =
          '🏛️ Đà Lạt có những thắng cảnh thiên nhiên và di tích lịch sử nổi tiếng bậc nhất. Dưới đây là những biểu tượng du lịch không thể bỏ qua:';
      }
      // 7. Hẹn hò / Cặp đôi / Lãng mạn
      else if (
        hasPhrase(textNorm, 'hen ho') ||
        hasPhrase(textNorm, 'cap doi') ||
        hasPhrase(textNorm, 'lang man') ||
        hasPhrase(textNorm, 'nguoi yeu') ||
        hasPhrase(textNorm, '2 nguoi')
      ) {
        newCategory = 'CAT_CAFE';
        recommended = allServices.filter(
          s =>
            s.id === 'SRV_16_TUI_MO_TO' ||
            s.id === 'SRV_48_DOI_MOT_NGUOI' ||
            s.id === 'SRV_19_LULULOLA_COFFEE'
        );
        responseText =
          '💖 Dành cho chuyến đi lãng mạn 2 người: Tiệm Cà Phê Túi Mơ To ngắm cúc họa mi, đêm nhạc acoustic Lululola lắng đọng và Đợi Một Người Homestay view thung lũng ấm áp:';
      }
      // 8. Robust Fuzzy Keyword Matcher with Stop Words Filtering
      else {
        // Filter out stop words and short tokens (< 3 chars)
        const contentTokens = textNorm
          .split(/\s+/)
          .filter(w => w.length >= 3 && !STOP_WORDS.has(w));

        if (contentTokens.length > 0) {
          const scored = allServices.map(s => {
            let score = 0;
            const nameNorm = ` ${normalizeText(s.name)} `;
            const descNorm = ` ${normalizeText(s.description)} `;
            const tagsNorm = s.tags.map(t => ` ${normalizeText(t)} `).join(' ');
            const addrNorm = ` ${normalizeText(s.address)} `;

            contentTokens.forEach(token => {
              const paddedToken = ` ${token} `;
              if (nameNorm.includes(paddedToken)) score += 8;
              else if (nameNorm.includes(token)) score += 4;

              if (tagsNorm.includes(paddedToken)) score += 5;
              else if (tagsNorm.includes(token)) score += 2;

              if (descNorm.includes(paddedToken)) score += 3;
              if (addrNorm.includes(paddedToken)) score += 2;
            });

            // Don't repeat already shown places
            if (ctx.recommendedServiceIds.has(s.id)) {
              score = Math.floor(score * 0.3);
            }

            return { service: s, score };
          });

          const matched = scored
            .filter(x => x.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(x => x.service);

          if (matched.length > 0) {
            const count = Math.min(requestedCount, matched.length);
            recommended = matched.slice(0, count);
            if (recommended.length > 0) {
              newCategory = recommended[0].categoryId as any;
            }
            responseText = `✨ Dựa trên câu hỏi "${textRaw}" của bạn, mình đã tìm thấy ${recommended.length} tọa độ Đà Lạt rất phù hợp sau đây:`;
          }
        }

        // Ultimate fallback if no match found
        if (recommended.length === 0) {
          recommended = allServices.filter(s => s.isFeatured && !ctx.recommendedServiceIds.has(s.id)).slice(0, 3);
          if (recommended.length === 0) {
            recommended = allServices.filter(s => s.isFeatured).slice(0, 3);
          }
          responseText =
            `🌿 Mình đã ghi nhận câu hỏi của bạn! Dưới đây là những điểm đến đặc sắc và được du khách yêu thích nhất tại Đà Lạt hôm nay:`;
        }
      }
    }

    // Update session context with recommended services
    const updatedRecommendedIds = new Set(ctx.recommendedServiceIds);
    recommended.forEach(s => {
      if (s && s.id) updatedRecommendedIds.add(s.id);
    });

    this.sessionContext = {
      lastCategory: newCategory,
      lastSubTopic: newSubTopic,
      recommendedServiceIds: updatedRecommendedIds,
    };

    return {
      id: `BOT_${Date.now()}`,
      sender: 'bot',
      text: responseText,
      timestamp: new Date().toISOString(),
      recommendedServices: recommended,
      contextCategory: newCategory || undefined,
      contextTopic: newSubTopic || undefined,
    };
  }
}

export const chatbotService = new DalatChatbotService();
