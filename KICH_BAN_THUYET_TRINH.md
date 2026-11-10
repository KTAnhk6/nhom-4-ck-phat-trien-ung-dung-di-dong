# 🎤 KỊCH BẢN THUYẾT TRÌNH ĐỒ ÁN: ĐÀ LẠT WANDER (MODERN EDITORIAL EDITION 2026)

**Học phần:** Phát triển Ứng dụng Di động • **Nhóm thực hiện:** Nhóm 4  
**Thời lượng:** 12 – 15 phút (Mỗi thành viên ~2.5 – 3 phút)

| Thành viên | Phân hệ phụ trách | Thời lượng | Trọng tâm Demo |
| :--- | :--- | :--- | :--- |
| **Tuấn Anh** | Xác thực (Auth), Người dùng, Phân quyền RBAC | ~2.5 phút | Form validation, Guest Mode, Profile, Đa ngôn ngữ (VI/EN) |
| **Bình** | Trang chủ, Danh sách 50 dịch vụ, Thời tiết Live | ~3 phút | Theme Modern Editorial, Open-Meteo, 2 nút Web/Maps |
| **Quang** | Tìm kiếm đa trường, Bộ lọc đa tiêu chí, Chatbot AI | ~2.5 phút | Tìm kiếm không dấu, Multi-chips filter, Chatbot nổi |
| **Minh Anh** | Đánh giá (Reviews), Chấm sao, Yêu thích (Wishlist) | ~2.5 phút | Biểu đồ sao động, Chặn Guest review, Đồng bộ Wishlist, Bản đồ cự ly |
| **Việt** | Dashboard Quản trị (Admin), CRUD, CSDL MySQL | ~3 phút | Bảo mật Admin, Thống kê KPI, Quản lý User/Review, 8 bảng MySQL |

- **Học phần:** Phát triển Ứng dụng Di động
- **Nhóm thực hiện:** Nhóm 4
- **Tổng thời lượng:** 12 – 15 phút (Mỗi thành viên ~2.5 – 3 phút)
- **Phong cách:** Chuyên nghiệp, tự tin, nhấn mạnh trải nghiệm người dùng thực tế và chiều sâu kiến trúc kỹ thuật.

---

## CHI TIẾT KỊCH BẢN TỪNG THÀNH VIÊN

### PHẦN 1: MỞ ĐẦU & MODULE AUTH, QUẢN LÝ NGƯỜI DÙNG
**Người trình bày:** **Tuấn Anh**  
**Nhiệm vụ phụ trách:** Xác thực (Authentication), Quản lý người dùng, Phân quyền RBAC.

**Lời thoại thuyết trình:**
> Kính thưa Thầy/Cô và các bạn, em là **Tuấn Anh**, đại diện Nhóm 4 xin phép mở đầu buổi báo cáo đồ án với ứng dụng **Đà Lạt Wander — Cẩm nang du lịch và trải nghiệm số phố núi**.
>
> Để mở đầu luồng trải nghiệm người dùng, em xin trình bày phân hệ **Xác thực và Quản lý Người dùng**:
> 1. **Cơ chế Đăng nhập & Đăng ký linh hoạt:** Hệ thống hỗ trợ xác thực tài khoản an toàn với kiểm tra hợp lệ dữ liệu (form validation: email chuẩn RFC, độ dài mật khẩu tối thiểu, số điện thoại Việt Nam). Đồng thời hỗ trợ tính năng **Quên mật khẩu** thông qua luồng mã OTP xác minh giả lập an toàn (`123456`).
> 2. **Chế độ Khách (Guest Mode) & Phân quyền rạch ròi:** Nhận thấy người dùng du lịch thường muốn trải nghiệm ngay trước khi tạo tài khoản, chúng em xây dựng nút *'Tiếp tục với tư cách Khách'* mà không cần bất kỳ thông tin cá nhân nào. Tuy nhiên, để đảm bảo tính toàn vẹn dữ liệu, tài khoản Guest sẽ bị giới hạn phân quyền: không thể gửi đánh giá, không thể lưu danh sách yêu thích, không thể chỉnh sửa hồ sơ và không thể truy cập khu vực Admin.
> 3. **Quản lý Hồ sơ Cá nhân (Profile) & Đa ngôn ngữ:** Người dùng thành viên có thể cập nhật ảnh đại diện, đổi thông tin cá nhân, chuyển đổi ngôn ngữ **Tiếng Việt / Tiếng Anh (VI/EN)** tức thì, xem trung tâm thông báo và trạng thái đồng bộ CSDL. Toàn bộ phiên đăng nhập được duy trì bền vững qua `AsyncStorage` kết hợp đồng bộ CSDL MySQL.
>
> Sau khi người dùng đăng nhập thành công vào ứng dụng, giao diện chính và hệ sinh thái dịch vụ sẽ được hiển thị. Tiếp theo, em xin mời bạn **Bình** trình bày về phân hệ Trang chủ và Dịch vụ.

**Hành động Demo thực tế:** Mở màn hình Login → bấm thử nút Guest → sau đó đăng xuất và đăng nhập tài khoản User bình thường (`tuananh` / `123456`) → vào màn Profile kiểm tra thông tin và chuyển thử ngôn ngữ VI/EN.

---

### PHẦN 2: TRANG CHỦ, DANH SÁCH DỊCH VỤ & THỜI TIẾT
**Người trình bày:** **Bình**  
**Nhiệm vụ phụ trách:** Màn hình Home, Chi tiết dịch vụ, Phân loại danh mục, Tích hợp thời tiết Live.

**Lời thoại thuyết trình:**
> Xin chào Thầy/Cô và các bạn, em là **Bình**, phụ trách xây dựng **Màn hình Trang chủ và Không gian Khám phá Dịch vụ**.
>
> Với mục tiêu mang lại cảm xúc thư thái của một ấn phẩm du lịch cao cấp, em tập trung vào 4 điểm nhấn chính:
> 1. **Phong cách Thiết kế Modern Editorial:** Sử dụng tông màu giấy báo ấm áp (`#FAF7F2`), đen mực in (`#181818`) và đỏ đất nung Sepia (`#9E3B24`), kết hợp bộ 3 phông chữ tạp chí (*Times New Roman, Plus Jakarta Sans, Courier New*) cùng bố cục thẻ ảnh tràn viền chất lượng cao mang hơi thở tạp chí Kinfolk/Monocle.
> 2. **Widget Thời tiết Đà Lạt theo Thời gian thực:** Tích hợp trực tiếp **Open-Meteo API** theo đúng tọa độ Đà Lạt (độ cao 1.500m). Widget tự động nhận diện thời gian trong ngày để đưa ra lời khuyên du lịch hữu ích: *sáng sớm săn mây Cầu Đất, trưa dạo thung lũng, chiều ngắm hoàng hôn Xóm Lèo, và tối se lạnh dạo Chợ Đêm*.
> 3. **Cơ cấu 50 Địa danh Chuẩn hóa:** Dịch vụ được chia thành 4 nhóm rõ ràng gồm *Điểm tham quan & Danh thắng (15 điểm), Quán Cafe view đẹp & Sống ảo (12 điểm), Quán ăn & Đặc sản nức tiếng (13 điểm) và Khách sạn, Resort & Homestay (10 điểm)*. Toàn bộ đều có nhãn giờ mở cửa, mức giá và khoảng cách tính từ mốc Chợ Đà Lạt.
> 4. **Màn hình Chi tiết Đa chức năng:** Tại trang chi tiết, em tách bạch rõ các nút bấm điều hướng thiết yếu: nút **🌐 Trang chủ chính thức** (kết nối cổng du lịch chính thống như `visitlamdong.vn` hoặc website riêng), nút **📍 Mở Google Maps (Dẫn đường GPS)** dẫn đường chuẩn xác theo tọa độ GPS và nút **🗺️ Xem vị trí trên bản đồ Đà Lạt**.
>
> Để giúp du khách nhanh chóng tìm kiếm và lựa chọn đúng điểm đến giữa 50 địa danh phong phú, bạn **Quang** sẽ tiếp nối với phân hệ Tìm kiếm, Bộ lọc và Trợ lý ảo AI.

**Hành động Demo thực tế:** Vuốt nhẹ trang Home → trỏ vào widget Thời tiết sống → bấm vào 1 địa điểm (ví dụ *Tiệm Cà Phê Túi Mơ To* hoặc *Hồ Tuyền Lâm*) xem trang chi tiết → chỉ rõ nút **🌐 Trang chủ chính thức** và nút **📍 Mở Google Maps (Dẫn đường GPS)**.

---

### PHẦN 3: TÌM KIẾM THÔNG MINH, BỘ LỌC ĐA TIÊU CHÍ & CHATBOT AI
**Người trình bày:** **Quang**  
**Nhiệm vụ phụ trách:** Tìm kiếm đa trường, Bộ lọc nâng cao, Sắp xếp động, Trợ lý Chatbot.

**Lời thoại thuyết trình:**
> Kính thưa Thầy/Cô, em là **Quang**, đảm nhiệm phân hệ **Tìm kiếm, Xử lý Dữ liệu và Trợ lý Du lịch Thông minh**.
>
> Để tối ưu hóa trải nghiệm tra cứu cho khách du lịch, phân hệ này được thiết kế với các giải pháp kỹ thuật cụ thể:
> 1. **Tìm kiếm Đa trường & Khử dấu tiếng Việt:** Khung tìm kiếm hỗ trợ tra cứu tức thì theo tên địa danh, địa chỉ, khu vực, từ khóa mô tả và thẻ phân loại (`tags`), áp dụng thuật toán chuẩn hóa chuỗi Unicode (`NFD`) không phân biệt hoa thường và dấu tiếng Việt để người dùng gõ nhanh khi di chuyển, đi kèm **Lịch sử tìm kiếm** và **Từ khóa xu hướng**.
> 2. **Bộ lọc Nâng cao (Filter Chips):** Người dùng có thể kết hợp lọc đồng thời theo:
>    * **Danh mục dịch vụ:** Tham quan, Cà phê, Ăn uống, Lưu trú.
>    * **Mức giá:** Miễn phí, Bình dân (`< 100k`), Trung cấp (`100k - 500k`), Cao cấp (`> 500k`).
>    * **Điểm đánh giá tối thiểu:** Từ `★ 3.5`, `★ 4.0` đến `★ 4.5 trở lên`.
>    * **Khu vực / Phường xã:** Lọc chính xác theo 14 khu vực tại Đà Lạt (Phường 1 → 11, Trại Mát, Cầu Đất, Tà Nung...).
> 3. **Cơ chế Sắp xếp Đa chiều:** Hỗ trợ sắp xếp linh hoạt theo *Phổ biến nhất, Đánh giá cao nhất, Gần trung tâm Chợ Đà Lạt nhất, Giá tăng/giảm dần hoặc Tên A – Z*.
> 4. **Trợ lý Ảo Du lịch (Floating Chatbot):** Nút chat nổi luôn sẵn sàng trên màn hình để giải đáp thắc mắc, gợi ý quán ăn, cà phê săn mây hoặc lịch trình tham quan Đà Lạt dựa trên bộ cơ sở tri thức địa phương được tinh chỉnh sẵn.
>
> Khi du khách đã trải nghiệm các địa danh, nhu cầu để lại phản hồi và chia sẻ cảm nhận là vô cùng quan trọng. Em xin chuyển lời cho bạn **Minh Anh** trình bày về phân hệ Đánh giá và Tương tác.

**Hành động Demo thực tế:** Gõ tìm kiếm không dấu `lau ga la e` → mở Modal Bộ lọc chọn chip danh mục *Ăn uống*, chọn mức giá *Bình dân* / sắp xếp *"Đánh giá cao nhất"* → mở Chatbot nổi và gửi câu hỏi gợi ý lịch trình.

---

### PHẦN 4: ĐÁNH GIÁ, BÌNH LUẬN & TƯƠNG TÁC NGƯỜI DÙNG
**Người trình bày:** **Minh Anh**  
**Nhiệm vụ phụ trách:** Hệ thống Reviews, Chấm điểm sao, Danh sách Yêu thích (Wishlist), Bản đồ khoảng cách & Thông báo.

**Lời thoại thuyết trình:**
> Kính thưa Thầy/Cô, em là **Minh Anh**, phụ trách phân hệ **Đánh giá, Bình luận và Tương tác Cộng đồng**.
>
> Mục tiêu của phân hệ là tạo ra một cộng đồng chia sẻ trải nghiệm chân thực và minh bạch:
> 1. **Luồng Đánh giá Đa tiêu chí & Biểu đồ Sao (Review Flow):**
>    * Màn hình đánh giá hiển thị trực quan **biểu đồ thanh tỷ lệ sao từ 5★ xuống 1★**. Thành viên đã đăng nhập có thể chấm từ 1 đến 5 sao, chọn thẻ gợi ý cảm nhận nhanh và nhập bình luận chi tiết.
>    * Hệ thống tự động tính toán lại điểm trung bình (`rating`) và tổng số lượt đánh giá (`reviewCount`) của từng địa điểm ngay khi có phản hồi mới.
>    * Kiểm soát chặt chẽ: Tài khoản Khách (Guest) khi nhấn viết đánh giá sẽ được thông báo lịch sự yêu cầu đăng nhập tài khoản.
> 2. **Danh sách Yêu thích Cá nhân hóa (Wishlist) & Bản đồ Khoảng cách:**
>    * Người dùng có thể nhấn biểu tượng trái tim để lưu nhanh các địa điểm muốn đi vào màn hình *'Yêu thích'*, đồng bộ trực tiếp xuống CSDL.
>    * Ngoài ra, màn hình **Bản đồ & Khoảng cách** cho phép tra cứu toàn bộ 50 địa điểm sắp xếp theo cự ly gần nhất từ tâm Chợ Đà Lạt / Hồ Xuân Hương kèm nút dẫn đường GPS.
> 3. **Trung tâm Thông báo Tương tác (Notifications):** Nhận thông báo thời gian thực khi có thông báo hệ thống, gợi ý điểm đến mới hoặc lễ hội, ưu đãi từ Quản trị viên.
>
> Để quản lý vận hành toàn bộ hệ sinh thái dịch vụ, người dùng và nội dung đánh giá một cách tập trung, bạn **Việt** sẽ đại diện nhóm trình bày phân hệ Quản trị Admin.

**Hành động Demo thực tế:** Bấm tim lưu 2 địa điểm vào Wishlist → mở tab Yêu thích kiểm tra → mở 1 địa điểm bấm *"Viết đánh giá"* → chấm 5 sao, nhập nhận xét *"View hoàng hôn cực đẹp, đồ uống ngon"* → gửi và thấy điểm trung bình cùng biểu đồ sao cập nhật tức thì.

---

### PHẦN 5: BẢNG ĐIỀU KHIỂN QUẢN TRỊ ADMIN & KẾT LUẬN TỔNG THỂ
**Người trình bày:** **Việt**  
**Nhiệm vụ phụ trách:** Màn hình Admin Dashboard, Quản lý Dịch vụ/Users/Reviews, Kiến trúc CSDL MySQL/SQLite.

**Lời thoại thuyết trình:**
> Kính thưa Thầy/Cô và các bạn, em là **Việt**, phụ trách **Phân hệ Quản trị Hệ thống (Admin) và Hạ tầng Cơ sở Dữ liệu**.
>
> Phân hệ Admin là trung tâm chỉ huy đảm bảo ứng dụng vận hành an toàn và chính xác:
> 1. **Bảo mật & Phân quyền Quản trị:** Chỉ tài khoản có vai trò `ADMIN` (`admin` / `admin123`) mới có thể truy cập khu vực này. Mọi hành vi truy cập trái phép từ User hoặc Guest đều bị chặn tuyệt đối.
> 2. **Bảng Thống kê Tổng quan (Admin Dashboard):** Cung cấp các thẻ chỉ số KPI trực quan về tổng số lượng dịch vụ (50 địa danh), tổng số thành viên, tổng số đánh giá, điểm trung bình toàn hệ thống và biểu đồ thống kê phân bố theo danh mục.
> 3. **Quản trị CRUD Toàn diện & Phát sóng Thông báo:**
>    * *Quản lý Dịch vụ & Danh mục:* Thêm địa điểm mới, chỉnh sửa thông tin giá vé/tọa độ, xóa dịch vụ ngừng hoạt động (có kiểm tra ràng buộc danh mục).
>    * *Quản lý Người dùng:* Khóa/mở khóa (`active` / `blocked`) tài khoản vi phạm chính sách cộng đồng.
>    * *Quản lý Đánh giá & Broadcast:* Ẩn/hiện hoặc xóa các bình luận spam, đồng thời hỗ trợ **Phát sóng thông báo (Broadcast)** lễ hội, ưu đãi tới toàn bộ du khách.
> 4. **Hạ tầng Dữ liệu Quan hệ (MySQL / SQLite):** Hệ thống được chuẩn hóa qua schema CSDL gồm **8 bảng liên kết chặt chẽ** (`categories`, `services`, `users`, `user_passwords`, `reviews`, `favorites`, `search_history`, `notifications`), tự động đồng bộ thời gian thực và xuất file dump chuẩn [`database/dalat_wander_mysql.sql`](database/dalat_wander_mysql.sql) tương thích trực tiếp với MySQL Workbench / XAMPP / MariaDB.
>
> **Tổng kết:** Ứng dụng **Đà Lạt Wander** của Nhóm 4 đã hoàn thành đầy đủ các tiêu chuẩn từ giao diện Modern Editorial, trải nghiệm mượt mà, phân quyền chặt chẽ đến cơ sở dữ liệu hoàn chỉnh.
>
> Chúng em xin chân thành cảm ơn Thầy/Cô đã lắng nghe và rất mong nhận được những nhận xét, góp ý quý báu để nhóm hoàn thiện đồ án tốt hơn nữa!

**Hành động Demo thực tế:** Đăng nhập tài khoản `admin` (`admin123`) → vào Profile mở **Bảng điều khiển Admin** xem các thẻ KPI thống kê → mở màn **Quản lý Đánh giá** demo ẩn/duyệt đánh giá → mở màn **Quản lý Người dùng** demo khóa/mở khóa tài khoản.

---

## 🎯 GHI CHÚ PHẢN BIỆN DÀNH CHO CẢ NHÓM (Q&A CHIẾN LƯỢC)

1. **Hỏi về lưu trữ:** *App chạy dữ liệu ở đâu?*
   * **Trả lời:** App vận hành theo kiến trúc **Hybrid 3 tầng linh hoạt**:
     - Tầng 1: Kết nối RESTful API (`/api/mysql/*`) tới **MySQL Relational Engine** lưu trữ 8 bảng dữ liệu thực tế và tự động xuất file [`database/dalat_wander_mysql.sql`](database/dalat_wander_mysql.sql) chuẩn MySQL/MariaDB mỗi khi có thay đổi CRUD.
     - Tầng 2: Tích hợp đồng bộ Cloud REST API qua **MockAPI.io**.
     - Tầng 3: Lưu đệm bền vững tại Client qua `AsyncStorage` giúp ứng dụng hoạt động mượt mà ngay cả khi mất kết nối mạng.

2. **Hỏi về Guest Mode:** *Tại sao lại cho phép Guest vào app?*
   * **Trả lời:** Giảm tỷ lệ người dùng rời bỏ (bounce rate) ngay màn hình đầu tiên, giúp du khách tra cứu nhanh 50 địa điểm, xem thời tiết và hỏi Chatbot AI ngay lập tức; nhưng áp dụng giới hạn phân quyền chặt chẽ (chỉ đọc — không thể chấm sao, bình luận hay lưu Wishlist) để bảo vệ tính xác thực của dữ liệu cộng đồng.

3. **Hỏi về Thời tiết:** *Thời tiết lấy từ đâu, có tốn phí không?*
   * **Trả lời:** Tích hợp **Open-Meteo API** hoàn toàn miễn phí, không cần API Key, cập nhật nhiệt độ và độ ẩm theo tọa độ thực tế của Đà Lạt (`11.9404°B, 108.4583°Đ`, độ cao 1.500m); đi kèm cơ chế fallback thông minh tự động nhận diện 4 khung giờ trong ngày (Sáng sớm – Trưa – Hoàng hôn – Đêm) để gợi ý điểm đến phù hợp.

