/**
 * API & AdMob Configuration for Dalat Travel App
 * Supports MockAPI RESTful endpoints and Google AdMob (Test IDs)
 */

export const API_CONFIG = {
  // Đường link Clone dự án mà bạn đã chia sẻ
  MOCK_API_CLONE_URL: 'https://mockapi.io/clone/6ae06809be3bc8fead971b4e',

  /**
   * BASE_URL của MockAPI.
   * Sau khi bạn bấm nút "Clone Project" trên link mockapi.io/clone/6ae06809be3bc8fead971b4e,
   * MockAPI sẽ cấp cho bạn một Endpoint dạng:
   * https://<mã-project-của-bạn>.mockapi.io/api/v1
   * Nếu để trống hoặc mockAPI không phản hồi, ứng dụng sẽ tự động chuyển sang chế độ
   * Fallback nội bộ (AsyncStorage & Local Data) để không bao giờ bị lỗi hay crash.
   */
  MOCK_API_BASE_URL: 'https://6ae06df9be3bc8fead97313e.mockapi.io/api/v1',

  // Bật/tắt kết nối MockAPI (true: thử gọi MockAPI trước; false: dùng storage nội bộ)
  USE_MOCK_API: true,

  // Thời gian chờ tối đa (ms) trước khi tự động fallback sang dữ liệu nội bộ
  REQUEST_TIMEOUT_MS: 3500,
};

export const ADMOB_CONFIG = {
  // Bật/tắt quảng cáo AdMob trong ứng dụng
  IS_ENABLED: true,

  // Mã Ad Unit ID Test chính thức của Google AdMob (Không lo bị khóa tài khoản khi test)
  BANNER_ID: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL_ID: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED_ID: 'ca-app-pub-3940256099942544/5224354917',

  // Tùy chọn test mode
  IS_TEST_MODE: true,
};
