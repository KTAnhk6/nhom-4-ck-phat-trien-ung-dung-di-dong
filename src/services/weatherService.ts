/**
 * Real-Time Local Weather Service for Đà Lạt (11.9404°N, 108.4583°E • Độ cao 1.500m)
 * Lấy dữ liệu khí tượng thời gian thực tại TP. Đà Lạt (Open-Meteo API)
 * kết hợp mô hình vi khí hậu cao nguyên Lâm Viên theo khung giờ & mùa thực tế.
 */

export interface LiveDalatWeather {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeedKmh: number;
  rainProbability: number;
  uvIndex: number;
  icon: string;
  conditionVi: string;
  conditionEn: string;
  seasonVi: string;
  seasonEn: string;
  travelTipVi: string;
  travelTipEn: string;
  updatedAtText: string;
  isLiveApi: boolean;
}

const DALAT_LAT = 11.9404;
const DALAT_LON = 108.4583;

function mapWmoCodeToCondition(code: number, hour: number): {
  icon: string;
  conditionVi: string;
  conditionEn: string;
} {
  const isNight = hour >= 18 || hour < 6;

  if (code === 0) {
    return {
      icon: isNight ? '🌙' : '☀️',
      conditionVi: isNight ? 'Trời quang, đêm se lạnh' : 'Nắng trong trẻo cao nguyên',
      conditionEn: isNight ? 'Clear sky & chilly night' : 'Clear highland sunshine',
    };
  }
  if (code === 1 || code === 2) {
    return {
      icon: isNight ? '☁️' : '🌤️',
      conditionVi: isNight ? 'Ít mây, sương lạnh nhẹ' : 'Nắng dịu, mây nhẹ bồng bềnh',
      conditionEn: isNight ? 'Partly cloudy & cool mist' : 'Mild sun & scattered clouds',
    };
  }
  if (code === 3) {
    return {
      icon: '☁️',
      conditionVi: 'Nhiều mây, tiết trời mát lạnh',
      conditionEn: 'Overcast & crisp highland air',
    };
  }
  if (code === 45 || code === 48) {
    return {
      icon: '🌫️',
      conditionVi: 'Sương mù giăng lối phố núi',
      conditionEn: 'Misty highland fog',
    };
  }
  if (code >= 51 && code <= 57) {
    return {
      icon: '🌦️',
      conditionVi: 'Mưa phùn nhẹ & sương lạnh',
      conditionEn: 'Light highland drizzle & mist',
    };
  }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      icon: '🌧️',
      conditionVi: 'Mưa rào phố núi, trời lạnh',
      conditionEn: 'Highland rain showers & chilly',
    };
  }
  if (code >= 95) {
    return {
      icon: '⛈️',
      conditionVi: 'Mưa dông chiều cao nguyên',
      conditionEn: 'Highland thunderstorm',
    };
  }

  return {
    icon: isNight ? '🌙' : '🌤️',
    conditionVi: 'Se lạnh đặc trưng Đà Lạt',
    conditionEn: 'Cool Dalat highland breeze',
  };
}

function getDalatSeasonInfo(month: number): { seasonVi: string; seasonEn: string } {
  // Tháng 11 -> Tháng 4: Mùa khô, săn mây & mùa hoa (Dã quỳ, Mai anh đào, Phượng tím)
  if (month === 11 || month === 12) {
    return {
      seasonVi: 'Mùa lập đông • Săn mây & Dã quỳ',
      seasonEn: 'Early Winter • Cloud Hunting',
    };
  }
  if (month >= 1 && month <= 3) {
    return {
      seasonVi: 'Mùa Xuân • Mai Anh Đào nở rộ',
      seasonEn: 'Spring • Cherry Blossom Season',
    };
  }
  if (month === 4) {
    return {
      seasonVi: 'Giao mùa • Nắng ấm & Phượng tím',
      seasonEn: 'Pleasant Sun & Purple Jacaranda',
    };
  }
  // Tháng 5 -> Tháng 10: Mùa mưa chiều & sương mù lãng mạn
  return {
    seasonVi: 'Mùa sương mù & Mưa chiều phố núi',
    seasonEn: 'Misty Season & Afternoon Showers',
  };
}

function buildLocalTravelTip(
  temp: number,
  humidity: number,
  rainProb: number,
  hour: number
): { tipVi: string; tipEn: string } {
  if (rainProb >= 65) {
    return {
      tipVi: `Đà Lạt hiện ${temp}°C (độ ẩm ${humidity}%), khả năng có mưa ${rainProb}%. Bạn nhớ mang theo ô/áo mưa và ghé các quán cafe kính ấm cúng hoặc thưởng thức Lẩu Gà Lá É nóng hổi nhé!`,
      tipEn: `Dalat is ${temp}°C (${humidity}% humidity) with ${rainProb}% chance of rain. Bring an umbrella and enjoy cozy indoor cafes or hot Chicken Hotpot!`,
    };
  }

  if (hour >= 4 && hour < 7) {
    return {
      tipVi: `Sáng sớm Đà Lạt ${temp}°C, độ ẩm ${humidity}% có sương mù dày. Thời điểm vàng để đi săn mây Đồi Chè Cầu Đất, Bình Minh Ơi và thưởng thức bánh mì xíu mại nóng!`,
      tipEn: `Early morning in Dalat is ${temp}°C with ${humidity}% humidity. Perfect time for cloud hunting at Cau Dat Tea Hill and hot Shumai baguette!`,
    };
  }

  if (hour >= 7 && hour < 11) {
    return {
      tipVi: `Buổi sáng Đà Lạt ${temp}°C trong lành, nắng dịu nhẹ. Rất lý tưởng để dạo quanh Hồ Xuân Hương, tham quan Dinh Bảo Đại, Thiền Viện Trúc Lâm hoặc nhâm nhi cà phê sáng.`,
      tipEn: `Morning in Dalat is a crisp ${temp}°C with gentle sun. Ideal for walking around Xuan Huong Lake, Bao Dai Palace, or morning coffee.`,
    };
  }

  if (hour >= 11 && hour < 15) {
    return {
      tipVi: `Giữa trưa Đà Lạt ${temp}°C mát mẻ dưới tán thông. Thích hợp trải nghiệm máng trượt Thác Datanla, thăm Vườn Hoa Thành Phố và nghỉ trưa thưởng thức Bánh Căn, Nem Nướng.`,
      tipEn: `Midday in Dalat is a pleasant ${temp}°C under the pines. Great for Datanla Alpine Coaster, Flower Park, and local lunch specialties.`,
    };
  }

  if (hour >= 15 && hour < 18) {
    return {
      tipVi: `Chiều Đà Lạt hạ nhiệt còn ${temp}°C, trời bắt đầu se lạnh. Khung giờ đẹp nhất để săn hoàng hôn tại Xóm Lèo, Lời Của Gió, Túi Mơ To hoặc nghe nhạc acoustic Lululola.`,
      tipEn: `Afternoon in Dalat cools to ${temp}°C. Best hour to catch the sunset at Xom Leo, Loi Cua Gio, Tui Mo To, or live acoustic shows.`,
    };
  }

  return {
    tipVi: `Đêm Đà Lạt hiện ${temp}°C, sương lạnh buông xuống (độ ẩm ${humidity}%). Hãy mặc áo khoác ấm đi dạo Chợ Đêm Âm Phủ, thưởng thức Lẩu Bò Ba Toa và sữa đậu nành nóng!`,
    tipEn: `Dalat night is ${temp}°C with chilly mist (${humidity}% humidity). Wear a warm jacket to explore the Night Market and enjoy Ba Toa Beef Hotpot!`,
  };
}

/**
 * Mô phỏng chính xác vi khí hậu Đà Lạt theo khung giờ thực tế tại địa phương (khi offline)
 */
export function getRealisticFallbackDalatWeather(now = new Date()): LiveDalatWeather {
  const hour = now.getHours();
  const month = now.getMonth() + 1;

  // Đường cong nhiệt độ chuẩn tại TP. Đà Lạt (độ cao 1.500m) theo giờ trong ngày
  const hourlyTempMap: Record<number, { temp: number; humidity: number; wind: number; uv: number; code: number }> = {
    0: { temp: 14, humidity: 93, wind: 6, uv: 0, code: 45 },
    1: { temp: 14, humidity: 94, wind: 5, uv: 0, code: 45 },
    2: { temp: 13, humidity: 95, wind: 5, uv: 0, code: 45 },
    3: { temp: 13, humidity: 95, wind: 5, uv: 0, code: 45 },
    4: { temp: 13, humidity: 96, wind: 6, uv: 0, code: 45 },
    5: { temp: 14, humidity: 94, wind: 7, uv: 0, code: 45 },
    6: { temp: 15, humidity: 90, wind: 8, uv: 1, code: 2 },
    7: { temp: 17, humidity: 84, wind: 9, uv: 2, code: 1 },
    8: { temp: 19, humidity: 78, wind: 11, uv: 4, code: 1 },
    9: { temp: 20, humidity: 74, wind: 12, uv: 5, code: 1 },
    10: { temp: 21, humidity: 70, wind: 13, uv: 6, code: 1 },
    11: { temp: 22, humidity: 66, wind: 14, uv: 7, code: 1 },
    12: { temp: 23, humidity: 64, wind: 14, uv: 8, code: 2 },
    13: { temp: 23, humidity: 65, wind: 15, uv: 7, code: 2 },
    14: { temp: 22, humidity: 68, wind: 14, uv: 6, code: 2 },
    15: { temp: 21, humidity: 74, wind: 13, uv: 4, code: 2 },
    16: { temp: 19, humidity: 79, wind: 11, uv: 2, code: 2 },
    17: { temp: 18, humidity: 84, wind: 10, uv: 1, code: 2 },
    18: { temp: 17, humidity: 87, wind: 9, uv: 0, code: 2 },
    19: { temp: 16, humidity: 89, wind: 8, uv: 0, code: 1 },
    20: { temp: 16, humidity: 90, wind: 7, uv: 0, code: 1 },
    21: { temp: 15, humidity: 91, wind: 7, uv: 0, code: 1 },
    22: { temp: 15, humidity: 92, wind: 6, uv: 0, code: 45 },
    23: { temp: 14, humidity: 93, wind: 6, uv: 0, code: 45 },
  };

  const slot = hourlyTempMap[hour] || hourlyTempMap[9];
  const isRainySeason = month >= 5 && month <= 10;
  const rainProb = isRainySeason && hour >= 13 && hour <= 18 ? 65 : 15;
  const { icon, conditionVi, conditionEn } = mapWmoCodeToCondition(slot.code, hour);
  const { seasonVi, seasonEn } = getDalatSeasonInfo(month);
  const { tipVi, tipEn } = buildLocalTravelTip(slot.temp, slot.humidity, rainProb, hour);

  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');

  return {
    temp: slot.temp,
    feelsLike: slot.temp - 1,
    tempMin: 13,
    tempMax: 23,
    humidity: slot.humidity,
    windSpeedKmh: slot.wind,
    rainProbability: rainProb,
    uvIndex: slot.uv,
    icon,
    conditionVi,
    conditionEn,
    seasonVi,
    seasonEn,
    travelTipVi: tipVi,
    travelTipEn: tipEn,
    updatedAtText: `${hh}:${mm}`,
    isLiveApi: false,
  };
}

/**
 * Truy vấn dữ liệu thời tiết thực tế tại tọa độ Phường 1, TP. Đà Lạt từ Open-Meteo API
 */
export async function fetchLiveDalatWeather(): Promise<LiveDalatWeather> {
  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth() + 1;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${DALAT_LAT}&longitude=${DALAT_LON}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&timezone=Asia%2FHo_Chi_Minh`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      return getRealisticFallbackDalatWeather(now);
    }

    const data = await res.json();
    const current = data?.current;
    const daily = data?.daily;

    if (!current || typeof current.temperature_2m !== 'number') {
      return getRealisticFallbackDalatWeather(now);
    }

    const temp = Math.round(current.temperature_2m);
    const feelsLike = Math.round(
      typeof current.apparent_temperature === 'number' ? current.apparent_temperature : temp - 1
    );
    const humidity = Math.round(current.relative_humidity_2m ?? 78);
    const windSpeedKmh = Math.round(current.wind_speed_10m ?? 10);
    const uvIndex = Math.round(current.uv_index ?? 0);
    const weatherCode = Number(current.weather_code ?? 1);

    const tempMax = Math.round(daily?.temperature_2m_max?.[0] ?? Math.max(temp + 2, 23));
    const tempMin = Math.round(daily?.temperature_2m_min?.[0] ?? Math.min(temp - 3, 14));
    const rainProbability = Math.round(daily?.precipitation_probability_max?.[0] ?? 20);

    const { icon, conditionVi, conditionEn } = mapWmoCodeToCondition(weatherCode, hour);
    const { seasonVi, seasonEn } = getDalatSeasonInfo(month);
    const { tipVi, tipEn } = buildLocalTravelTip(temp, humidity, rainProbability, hour);

    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');

    return {
      temp,
      feelsLike,
      tempMin,
      tempMax,
      humidity,
      windSpeedKmh,
      rainProbability,
      uvIndex,
      icon,
      conditionVi,
      conditionEn,
      seasonVi,
      seasonEn,
      travelTipVi: tipVi,
      travelTipEn: tipEn,
      updatedAtText: `${hh}:${mm}`,
      isLiveApi: true,
    };
  } catch {
    return getRealisticFallbackDalatWeather(now);
  }
}

