# 🐳 Whale Sea - Digital Agency Website & Admin Panel

Website giới thiệu dịch vụ, marketing, quảng cáo và quản lý khách hàng chuyên nghiệp dành cho **Whale Sea Premium Agency**.

---

## 🔒 Quy trình cấu hình và bảo mật Environment Variables (Biến môi trường)

Hệ thống được cấu hình tuân thủ quy chuẩn bảo mật cao nhất, tuyệt đối không hard-code các thông tin nhạy cảm (API Keys, Passwords, Mail Credentials) vào source code nhằm tránh rò rỉ dữ liệu khi đẩy lên GitHub.

### 1. Cấu trúc các biến môi trường cần thiết

Dưới đây là các biến môi trường được định nghĩa và sử dụng:

| Tên biến | Môi trường sử dụng | Phạm vi | Mô tả |
| :--- | :--- | :--- | :--- |
| `RESEND_API_KEY` | Server-Side | Bí mật (`Secret`) | API Token kết nối đến hệ thống gửi thư tự động [Resend.com](https://resend.com). |
| `CONTACT_TO_EMAIL` | Server-Side | Bí mật (`Secret`) | Địa chỉ hòm thư nhân sự/quản trị tiếp nhận yêu cầu liên hệ từ khách hàng. |
| `CONTACT_FROM_EMAIL` | Server-Side | Bí mật (`Secret`) | Địa chỉ email người gửi đã được xác thực (verified domain) trên Resend. |
| `ADMIN_PASSWORD` | Server-Side | Bí mật (`Secret`) | Mật mã đăng nhập trang quản trị Admin và dọn dẹp hàng chờ tư vấn. |
| `GEMINI_API_KEY` | Server-Side | Bí mật (`Secret`) | API Key sử dụng mô hình trí tuệ nhân tạo Gemini. |
| `VITE_SITE_URL` | Client-Side (Vite) | Công khai (`Public`) | Đường dẫn URL chính thức của website hỗ trợ SEO canon. |
| `VITE_GA_ID` | Client-Side (Vite) | Công khai (`Public`) | Mã theo dõi Google Analytics 4 để đo lường lượng truy cập. |
| `VITE_CLARITY_ID` | Client-Side (Vite) | Công khai (`Public`) | Mã theo dõi hành vi người dùng Microsoft Clarity. |
| `VITE_SUPABASE_URL` | Client-Side (Vite) | Công khai (`Public`) | URL kết nối database Supabase đám mây (nếu có). |
| `VITE_SUPABASE_ANON_KEY` | Client-Side (Vite) | Công khai (`Public`) | Key kết nối công khai đến Supabase. |

---

### 2. Hướng dẫn chạy & cài đặt môi trường Local Development

Để thiết lập ứng dụng chạy mượt mà ngay trên máy cá nhân của bạn mà vẫn đảm bảo tính bảo mật, hãy tuân thủ các bước sau:

#### Bước 1: Sao chép tệp mẫu môi trường
Mở terminal ở thư mục gốc của project và chạy lệnh sau để dựng tệp cấu hình local:
```bash
cp .env.example .env.local
```

#### Bước 2: Điền thông tin chuẩn bảo mật
Mở tệp `.env.local` vừa tạo bằng Editor (VS Code, Cursor,...) và nhập trực tiếp các giá trị thật của bạn:
* Điền mật mã Admin của riêng bạn vào biến `ADMIN_PASSWORD`.
* Điền API Key Resend và hòm thư nhận mẫu vào `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.

> [!CAUTION]
> Tệp `.env.local` chứa credentials thật của bạn và đã được chặn tự động trong `.gitignore`. **TUYỆT ĐỐI** không sửa `.gitignore` để đẩy tệp này lên GitHub công khai!

#### Bước 3: Khởi động hệ thống
Cài đặt dependencies và chạy thử dev-server cục bộ:
```bash
npm install
npm run dev
```

---

### 3. Cấu hình khi Deploy lên Vercel Production

Khi dự án đã sẵn sàng phát hành trực tuyến trên hạ tầng serverless của Vercel:

1. Truy cập vào **Vercel Dashboard** -> Chọn dự án của bạn.
2. Điều hướng đến **Settings** -> Chọn tab **Environment Variables**.
3. Lần lượt nhập các khóa (`Key`) và giá trị tương ứng (`Value`) như bạn đã định nghĩa trong `.env.local`.
4. Bấm **Save** để lưu lại.
5. **Quan trọng**: Sau khi cập nhật hoặc sửa đổi các biến môi trường trên Vercel, bạn bắt buộc phải thực hiện **Redeploy** (Build lại dự án) để Vercel nạp các giá trị mới nhất vào các serverless functions.

---

### ⚠️ Cảnh báo và hướng dẫn xử lý nếu lỡ commit file `.env` lên GitHub

Nếu trước đây bạn đã từng vô tình commit các tệp `.env` chứa mật mã thật lên kho lưu trữ trực tuyến:

1. Chạy các lệnh Git sau để gỡ bỏ tệp ra khỏi cache theo dõi của Git mà không xóa tệp ở máy local:
   ```bash
   git rm --cached .env
   git rm --cached .env.local
   git rm --cached .env.production
   git commit -m "security: remove environment files from repository tracking"
   git push origin main
   ```

2. **Khuyến cáo khẩn cấp**: Nếu các thông tin như `RESEND_API_KEY` hay mật mã tài khoản đã từng đẩy lên GitHub public, kẻ xấu có thể quét tự động (automated bots). Việc chỉ xóa file trên Git lúc này **là chưa đủ** vì lịch sử commit (`git history`) vẫn lưu lại giá trị cũ. Bạn cần lập tức:
   * Truy cập tài khoản [Resend](https://resend.com) của bạn để xoá bỏ API Key cũ và tạo một API Key mới hoàn toàn.
   * Thay đổi ngay lập tức `ADMIN_PASSWORD` sang chuỗi mật mã mới an toàn hơn.
