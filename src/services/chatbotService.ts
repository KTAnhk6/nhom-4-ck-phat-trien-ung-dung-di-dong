/**
 * Dalat Travel AI Chatbot Service (Assigned to: Quang)
 * Interprets natural language user prompts in Vietnamese & English.
 * Returns intelligent, tailored recommendations with actual matching service preview cards.
 */

import { ChatMessage, TourismService } from '../types';
import { tourismService } from './tourismService';

function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

class DalatChatbotService {
  async processUserMessage(prompt: string): Promise<ChatMessage> {
    const textRaw = prompt.trim();
    const textLower = textRaw.toLowerCase();
    const textNorm = removeVietnameseTones(textRaw);
    const allServices = await tourismService.getAllServices();
    
    let recommended: TourismService[] = [];
    let responseText = '';

    // 0. Specific Spot Search by Name / Keyword
    const directNameMatch = allServices.filter(s => {
      const sNameNorm = removeVietnameseTones(s.name);
      return textNorm.includes(sNameNorm) || (sNameNorm.length > 5 && textNorm.includes(sNameNorm.slice(0, 8)));
    });

    if (directNameMatch.length > 0 && directNameMatch.length <= 3) {
      recommended = directNameMatch;
      responseText = `✨ Mình đã tìm thấy thông tin chi tiết về ${directNameMatch.map(s => `"${s.name}"`).join(', ')} dành cho bạn:`;
    }
    // 1. Cà phê / Quán Cafe / Coffee / Tiệm nước / Acoustic
    else if (
      textNorm.includes('cafe') ||
      textNorm.includes('ca phe') ||
      textNorm.includes('coffee') ||
      textNorm.includes('quan cafe') ||
      textNorm.includes('tiem cafe') ||
      textNorm.includes('tiem ca phe') ||
      textNorm.includes('uong cafe') ||
      textNorm.includes('quan nuoc') ||
      textNorm.includes('acoustic')
    ) {
      const cafes = allServices.filter(s => s.categoryId === 'CAT_CAFE');
      
      // Sub-filters for specific cafe vibes
      if (textNorm.includes('san may') || textNorm.includes('binh minh')) {
        recommended = cafes.filter(
          s => s.id === 'SRV_18_BINH_MINH_OI' || s.id === 'SRV_16_TUI_MO_TO' || s.tags.includes('Săn mây')
        );
        responseText = '☕ Để vừa uống cà phê vừa săn mây đón bình minh, Tiệm Cà Phê Bình Minh Ơi (89 Hoàng Hoa Thám) và Túi Mơ To là sự lựa chọn số 1. Dưới đây là các tọa độ cafe săn mây tuyệt đẹp:';
      } else if (textNorm.includes('hoang hon') || textNorm.includes('thung lung') || textNorm.includes('chieu')) {
        recommended = cafes.filter(
          s => s.id === 'SRV_17_CHEO_VEOOO' || s.id === 'SRV_23_LOI_CUA_GIO' || s.id === 'SRV_19_LULULOLA_COFFEE' || s.id === 'SRV_22_BA_QUA_DOI'
        );
        responseText = '☕ Hoàng hôn buông xuống thung lũng Đà Lạt là khoảnh khắc kỳ diệu nhất! Mình gợi ý bạn ghé Tiệm Cheo Veooo (Hoàng hôn cam đỏ), Lời Của Gió (ngắm nhà lồng Xóm Lèo) hoặc Lululola:';
      } else if (textNorm.includes('nhac') || textNorm.includes('acoustic') || textNorm.includes('show')) {
        recommended = cafes.filter(
          s => s.id === 'SRV_19_LULULOLA_COFFEE' || s.id === 'SRV_20_MAY_LANG_THANG'
        );
        responseText = '🎶 Thưởng thức đêm nhạc acoustic giữa núi đồi se lạnh là trải nghiệm không thể bỏ qua. Lululola Coffee+ và Mây Lang Thang là 2 thánh địa âm nhạc nổi tiếng nhất Đà Lạt:';
      } else if (textNorm.includes('co dien') || textNorm.includes('vintage') || textNorm.includes('xua') || textNorm.includes('trung tam')) {
        recommended = cafes.filter(
          s => s.id === 'SRV_24_CAFE_TUNG' || s.id === 'SRV_25_AN_CAFE' || s.id === 'SRV_16_TUI_MO_TO'
        );
        responseText = '☕ Nếu bạn yêu thích nét mộc mạc cổ kính: Cafe Tùng (ngay Chợ Hòa Bình từ năm 1958) và An Cafe là những biểu tượng văn hóa cà phê Đà Lạt:';
      } else {
        recommended = cafes.slice(0, 4);
        responseText = '☕ Tuyệt vời! Đà Lạt là thiên đường của những quán cà phê view đồi thông, thung lũng đèn đêm và cúc họa mi thơ mộng. Dưới đây là những tiệm cà phê tiêu biểu nhất dành cho bạn:';
      }
    }
    // 2. Ăn uống / Quán ăn / Ẩm thực / Đặc sản
    else if (
      textNorm.includes('an') ||
      textNorm.includes('an uong') ||
      textNorm.includes('quan an') ||
      textNorm.includes('am thuc') ||
      textNorm.includes('dac san') ||
      textNorm.includes('mon ngon') ||
      textNorm.includes('lau') ||
      textNorm.includes('banh') ||
      textNorm.includes('nuong') ||
      textNorm.includes('kem bo') ||
      textNorm.includes('food')
    ) {
      const foods = allServices.filter(s => s.categoryId === 'CAT_FOOD');

      if (textNorm.includes('lau ga') || textNorm.includes('la e')) {
        recommended = foods.filter(s => s.id === 'SRV_28_LAU_GA_TAO_NGO');
        responseText = '🍲 Nhắc đến Đà Lạt là phải nhắc đến Lẩu Gà Lá É Tao Ngộ (Số 5 đường 3/4) với nước dùng the cay, lá é thơm nồng bốc khói nghi ngút:';
      } else if (textNorm.includes('lau bo') || textNorm.includes('ba toa')) {
        recommended = foods.filter(s => s.id === 'SRV_29_LAU_BO_BA_TOA');
        responseText = '🥩 Lẩu Bò Ba Toa Quán Gỗ (1/29 Hoàng Diệu) nức tiếng với nồi lẩu ngập thịt bắp, đuôi, gân bò chấm chao ớt cay xè:';
      } else if (textNorm.includes('banh can')) {
        recommended = foods.filter(s => s.id === 'SRV_30_BANH_CAN_LE' || s.id === 'SRV_31_BANH_CAN_NHA_CHUNG');
        responseText = '🍳 Bánh căn nóng giòn chấm xíu mại mỡ hành ngập tràn! Gợi ý số 1 là Bánh Căn Lệ (Yersin) và Bánh Căn Nhà Chung:';
      } else if (textNorm.includes('kem bo')) {
        recommended = foods.filter(s => s.id === 'SRV_35_KEM_BO_THANH_THAO');
        responseText = '🍨 Kem Bơ Thanh Thảo (76 Nguyễn Văn Trỗi) - món tráng miệng huyền thoại thơm béo ngậy ai cũng phải thử:';
      } else if (textNorm.includes('cho dem') || textNorm.includes('an vat')) {
        recommended = foods.filter(s => s.id === 'SRV_40_CHO_DEM_DA_LAT');
        responseText = '🍢 Thiên đường ăn vặt Chợ Đêm Đà Lạt (Chợ Âm Phủ) với bánh tráng nướng, dâu lắc, xiên que nướng và sữa đậu nành nóng hổi:';
      } else {
        recommended = foods.slice(0, 4);
        responseText = '🍲 Đi Đà Lạt se lạnh mà không xì xụp nồi lẩu the cay hay thưởng thức các món ăn vặt đường phố trứ danh thì thật thiếu sót! Đây là những quán ăn đặc sản được yêu thích nhất:';
      }
    }
    // 3. Khách sạn / Homestay / Resort / Lưu trú / Nơi ở
    else if (
      textNorm.includes('homestay') ||
      textNorm.includes('khach san') ||
      textNorm.includes('hotel') ||
      textNorm.includes('resort') ||
      textNorm.includes('luu tru') ||
      textNorm.includes('cho o') ||
      textNorm.includes('noi o') ||
      textNorm.includes('phong nghi') ||
      textNorm.includes('nghi duong')
    ) {
      const stays = allServices.filter(s => s.categoryId === 'CAT_STAY');

      if (textNorm.includes('5 sao') || textNorm.includes('sang trong') || textNorm.includes('cao cap')) {
        recommended = stays.filter(s => s.id === 'SRV_41_DALAT_PALACE' || s.id === 'SRV_42_ANA_MANDARA');
        responseText = '🏰 Nghỉ dưỡng chuẩn 5 sao di sản sang trọng: Dalat Palace Hotel kiến trúc Pháp 1922 và Quần thể biệt thự rừng thông Ana Mandara Villas:';
      } else if (textNorm.includes('tuyen lam') || textNorm.includes('ho')) {
        recommended = stays.filter(s => s.id === 'SRV_43_TERRACOTTA_RESORT' || s.id === 'SRV_44_SWISS_BELRESORT');
        responseText = '🌲 Nghỉ dưỡng ven hồ Tuyền Lâm yên bình: Terracotta Resort và lâu đài Swiss-Belresort giữa ngàn thông:';
      } else if (textNorm.includes('homestay') || textNorm.includes('view thung lung') || textNorm.includes('chill')) {
        recommended = stays.filter(s => s.id === 'SRV_48_DOI_MOT_NGUOI' || s.id === 'SRV_47_THE_KUPID_HILL' || s.id === 'SRV_50_LA_NHA_HOMESTAY');
        responseText = '🏡 Những homestay thơ mộng chữa lành tâm hồn: Đợi Một Người (nhà kính mặt hồ), The Kupid Hill (phòng kính view thông) và Là Nhà Homestay:';
      } else {
        recommended = stays.slice(0, 4);
        responseText = '🏡 Lựa chọn không gian lưu trú và nghỉ dưỡng tuyệt vời tại xứ sương mù dành cho chuyến đi của bạn:';
      }
    }
    // 4. Săn mây / Bình minh
    else if (
      textNorm.includes('san may') ||
      textNorm.includes('binh minh') ||
      textNorm.includes('cloud')
    ) {
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
      textNorm.includes('cung duong') ||
      textNorm.includes('lich trinh') ||
      textNorm.includes('lo trinh') ||
      textNorm.includes('itinerary') ||
      textNorm.includes('di dau')
    ) {
      recommended = allServices.filter(
        s =>
          s.id === 'SRV_12_DOI_CHE_CAU_DAT' ||
          s.id === 'SRV_09_THAC_DATANLA' ||
          s.id === 'SRV_03_GA_DA_LAT' ||
          s.id === 'SRV_28_LAU_GA_TAO_NGO'
      ).slice(0, 4);
      responseText =
        '🗺️ Cẩm nang du lịch Đà Lạt gợi ý bạn 3 CUNG ĐƯỜNG KHÁM PHÁ tối ưu cự ly và thời gian nhất:\n\n' +
        '1️⃣ Cung 1 (Đông Nam): Đồi chè Cầu Đất (5h00) ➜ Chùa Ve Chai (8h30) ➜ Túi Mơ To (10h00) ➜ Xóm Lèo ngắm đèn (17h00).\n' +
        '2️⃣ Cung 2 (Phía Nam): Máng trượt Datanla (8h30) ➜ Thiền Viện Trúc Lâm (11h00) ➜ Hồ Tuyền Lâm & Gà nướng Đồi Trăng (12h30) ➜ Lululola acoustic (16h30).\n' +
        '3️⃣ Cung 3 (Trung tâm < 2km): Bánh mì xíu mại Hoàng Diệu (7h00) ➜ Ga Đà Lạt & Dinh III (8h30) ➜ Lẩu bò Ba Toa (12h00) ➜ Chợ Đêm Đà Lạt (18h30).';
    }
    // 6. Điểm tham quan / Danh thắng / Check-in / Sống ảo
    else if (
      textNorm.includes('tham quan') ||
      textNorm.includes('danh thang') ||
      textNorm.includes('diem den') ||
      textNorm.includes('di tich') ||
      textNorm.includes('check in') ||
      textNorm.includes('song ao') ||
      textNorm.includes('chup hinh') ||
      textNorm.includes('bieu tuong')
    ) {
      recommended = allServices.filter(s => s.categoryId === 'CAT_ATTRACTION').slice(0, 4);
      responseText =
        '🏛️ Đà Lạt có những thắng cảnh thiên nhiên và di tích lịch sử nổi tiếng bậc nhất. Dưới đây là những biểu tượng du lịch không thể bỏ qua:';
    }
    // 7. Hẹn hò / Cặp đôi / Lãng mạn
    else if (
      textNorm.includes('hen ho') ||
      textNorm.includes('cap doi') ||
      textNorm.includes('lang man') ||
      textNorm.includes('nguoi yeu') ||
      textNorm.includes('2 nguoi')
    ) {
      recommended = allServices.filter(
        s =>
          s.id === 'SRV_16_TUI_MO_TO' ||
          s.id === 'SRV_48_DOI_MOT_NGUOI' ||
          s.id === 'SRV_19_LULULOLA_COFFEE'
      );
      responseText =
        '💖 Dành cho chuyến đi lãng mạn 2 người: Tiệm Cà Phê Túi Mơ To ngắm cúc họa mi, đêm nhạc acoustic Lululola lắng đọng và Đợi Một Người Homestay view thung lũng ấm áp:';
    }
    // 8. Fuzzy Keyword Matcher
    else {
      const tokens = textNorm.split(/\s+/).filter(w => w.length >= 2);
      const scored = allServices.map(s => {
        let score = 0;
        const nameNorm = removeVietnameseTones(s.name);
        const descNorm = removeVietnameseTones(s.description);
        const tagsNorm = s.tags.map(t => removeVietnameseTones(t)).join(' ');
        const addrNorm = removeVietnameseTones(s.address);

        tokens.forEach(token => {
          if (nameNorm.includes(token)) score += 5;
          if (tagsNorm.includes(token)) score += 3;
          if (descNorm.includes(token)) score += 2;
          if (addrNorm.includes(token)) score += 1;
        });
        return { service: s, score };
      });

      const matched = scored.filter(x => x.score > 0).sort((a, b) => b.score - a.score).map(x => x.service);

      if (matched.length > 0) {
        recommended = matched.slice(0, 4);
        responseText = `✨ Dựa trên câu hỏi "${textRaw}" của bạn, mình đã tìm thấy ${recommended.length} tọa độ Đà Lạt rất phù hợp sau đây:`;
      } else {
        recommended = allServices.filter(s => s.isFeatured).slice(0, 3);
        responseText =
          `🌿 Mình đã ghi nhận câu hỏi của bạn! Dưới đây là những điểm đến đặc sắc và được du khách yêu thích nhất tại Đà Lạt hôm nay:`;
      }
    }

    return {
      id: `BOT_${Date.now()}`,
      sender: 'bot',
      text: responseText,
      timestamp: new Date().toISOString(),
      recommendedServices: recommended,
    };
  }
}

export const chatbotService = new DalatChatbotService();
