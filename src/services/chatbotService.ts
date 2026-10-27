/**
 * Dalat Travel AI Chatbot Service (Assigned to: Quang)
 * Interprets natural language user prompts and returns intelligent,
 * tailored recommendations with actual matching service preview cards.
 */

import { ChatMessage, TourismService } from '../types';
import { tourismService } from './tourismService';

class DalatChatbotService {
  async processUserMessage(prompt: string): Promise<ChatMessage> {
    const textLower = prompt.toLowerCase();
    const allServices = await tourismService.getAllServices();
    let recommended: TourismService[] = [];
    let responseText = '';

    // 1. Cloud hunting (Săn mây)
    if (
      textLower.includes('săn mây') ||
      textLower.includes('san may') ||
      textLower.includes('cloud') ||
      textLower.includes('bình minh') ||
      textLower.includes('binh minh')
    ) {
      recommended = allServices.filter(
        s => s.tags.some(t => t.toLowerCase().includes('săn mây') || t.toLowerCase().includes('bình minh')) ||
        s.name.toLowerCase().includes('săn mây') ||
        s.categoryId === 'CAT_TOUR'
      );
      responseText =
        '🌲 Để săn mây tại Đà Lạt trọn vẹn nhất, bạn nên thức dậy từ 4h00 - 4h30 sáng nhé! Thời điểm mây cuồn cuộn đẹp nhất là từ 5h00 - 6h30 sáng tại khu vực Đồi Chè Cầu Đất hoặc Trại Mát. Dưới đây là tour và địa điểm săn mây hoàn hảo nhất dành cho bạn:';
    }
    // 2. Sunset view / Cafe view thung lũng / Hoàng hôn
    else if (
      textLower.includes('hoàng hôn') ||
      textLower.includes('hoang hon') ||
      textLower.includes('sunset') ||
      textLower.includes('thung lũng') ||
      textLower.includes('thung lung') ||
      textLower.includes('chill')
    ) {
      recommended = allServices.filter(
        s =>
          s.tags.some(t => t.toLowerCase().includes('hoàng hôn') || t.toLowerCase().includes('chill')) ||
          s.categoryId === 'CAT_CAFE'
      ).slice(0, 3);
      responseText =
        '☕ Hoàng hôn Đà Lạt thường đẹp nhất trong khoảng 16h30 đến 17h30. Khi ánh ráng chiều buông xuống thung lũng thông reo, ngồi nhâm nhi ly trà nóng hay cacao bốc khói thì thật tuyệt vời. Bạn hãy ghé thử những tọa độ view hoàng hôn cực chill này nhé:';
    }
    // 3. Romantic / Dating / Cặp đôi / Lãng mạn
    else if (
      textLower.includes('hẹn hò') ||
      textLower.includes('cặp đôi') ||
      textLower.includes('cap doi') ||
      textLower.includes('lãng mạn') ||
      textLower.includes('lang man') ||
      textLower.includes('người yêu') ||
      textLower.includes('2 người')
    ) {
      recommended = allServices.filter(
        s =>
          s.tags.some(t => t.toLowerCase().includes('lãng mạn') || t.toLowerCase().includes('cặp đôi')) ||
          s.id === 'SRV_TUI_MO_TO' ||
          s.id === 'SRV_CHU_DAU_HOMESTAY' ||
          s.id === 'SRV_LULULOLA_COFFEE'
      ).slice(0, 3);
      responseText =
        '💖 Dành cho chuyến đi lãng mạn 2 người tại xứ sở ngàn hoa: Mình gợi ý bạn ghé Tiệm Cà Phê Túi Mơ To ngắm cúc họa mi, đêm nhạc acoustic Lululola lắng đọng và nghỉ dưỡng tại Chu Đậu Homestay view thung lũng ấm áp nhé!';
    }
    // 4. Food / Ăn uống / Lẩu gà lá é / Bánh tráng nướng
    else if (
      textLower.includes('ăn') ||
      textLower.includes('uống') ||
      textLower.includes('lẩu') ||
      textLower.includes('bánh tráng') ||
      textLower.includes('đặc sản') ||
      textLower.includes('food') ||
      textLower.includes('ngon')
    ) {
      recommended = allServices.filter(s => s.categoryId === 'CAT_FOOD').slice(0, 3);
      responseText =
        '🍲 Đi Đà Lạt se lạnh mà không xì xụp nồi lẩu gà lá é the cay hay cắn miếng bánh tráng nướng giòn rụm thì thật thiếu sót! Đây là những quán ăn đặc sản được du khách bình chọn cao nhất:';
    }
    // 5. Homestay / Khách sạn / Nơi ở
    else if (
      textLower.includes('ở') ||
      textLower.includes('homestay') ||
      textLower.includes('khách sạn') ||
      textLower.includes('hotel') ||
      textLower.includes('phòng') ||
      textLower.includes('nghỉ')
    ) {
      recommended = allServices.filter(s => s.categoryId === 'CAT_STAY').slice(0, 3);
      responseText =
        '🏡 Để có trải nghiệm lưu trú trọn vẹn tại Đà Lạt: Nếu thích đi bộ dạo chợ Đêm bạn nên chọn Khách sạn Colline ngay Dalat Center. Còn nếu thích không gian mộc mạc ngắm đồi thông thì Chu Đậu Homestay là lựa chọn số 1:';
    }
    // 6. Check-in / Tham quan / Địa điểm đẹp / Chụp hình
    else if (
      textLower.includes('chụp hình') ||
      textLower.includes('check-in') ||
      textLower.includes('check in') ||
      textLower.includes('tham quan') ||
      textLower.includes('sống ảo') ||
      textLower.includes('đẹp')
    ) {
      recommended = allServices.filter(
        s => s.isFeatured || s.tags.includes('Check-in')
      ).slice(0, 3);
      responseText =
        '📸 Đà Lạt có vô vàn góc chụp ảnh “triệu like”. Dưới đây là những biểu tượng và tọa độ check-in đẹp mê mẩn không thể bỏ qua:';
    }
    // 7. General / Fallback recommendation
    else {
      // Find matches by tag or keywords
      const matched = allServices.filter(s =>
        s.tags.some(t => textLower.includes(t.toLowerCase())) ||
        s.name.toLowerCase().includes(textLower) ||
        s.description.toLowerCase().includes(textLower)
      );

      if (matched.length > 0) {
        recommended = matched.slice(0, 3);
        responseText = `✨ Dựa trên mô tả của bạn, mình đã tìm thấy ${recommended.length} dịch vụ du lịch Đà Lạt rất phù hợp sau đây:`;
      } else {
        recommended = allServices.filter(s => s.isFeatured).slice(0, 3);
        responseText =
          '🌿 Mình đã ghi nhận yêu cầu của bạn! Dưới đây là những điểm đến đặc sắc và được du khách yêu thích nhất tại Đà Lạt hôm nay:';
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
