# Tin Tức Bóng Đá ⚽

Đây là một dự án web đơn giản giúp bạn cập nhật tin tức và kết quả các trận đấu bóng đá mới nhất từ nhiều giải đấu lớn như Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League...

## Tính năng
- Xem lịch thi đấu, kết quả các trận bóng đá nổi bật.
- Lọc theo giải đấu.
- Tìm kiếm đội bóng nhanh chóng.
- Giao diện đẹp, hiện đại, dễ sử dụng.
- Hiển thị trạng thái trận đấu: Chưa diễn ra, Đang thi đấu, Kết thúc, Hoãn, Hủy...

## Công nghệ sử dụng
- **HTML5, CSS3**: Xây dựng giao diện người dùng.
- **JavaScript (ES6)**: Xử lý logic, gọi API, thao tác DOM.
- **API**: Sử dụng [football-data.org](https://www.football-data.org/) để lấy dữ liệu bóng đá (có thể cần đăng ký token miễn phí).

## Hướng dẫn sử dụng
1. **Clone dự án:**
   ```bash
   git clone <link-repo-của-bạn>
   ```
2. **Mở file `Index.html`** bằng trình duyệt web (Chrome, Edge, Firefox...)
3. **(Tùy chọn) Thay token API** trong file `script.js` nếu bạn có token riêng:
   ```js
   this.apiToken = 'YOUR_API_TOKEN';
   ```

## Cấu trúc dự án
```
├── Index.html      # Giao diện chính
├── style.css       # Định dạng giao diện
├── script.js       # Xử lý logic, gọi API, hiển thị dữ liệu
```

## Lưu ý
- Nếu không có token API, trang sẽ hiển thị dữ liệu demo để bạn trải nghiệm giao diện.
- Để lấy dữ liệu thật, hãy đăng ký tài khoản tại [football-data.org](https://www.football-data.org/) và thay token vào file `script.js`.

## Đóng góp
Mọi ý kiến đóng góp, pull request đều được hoan nghênh!

---
**Tác giả:** [Tên của bạn] 