# KIẾN TRÚC THƯ MỤC DỰ ÁN KLINK AI CORE (MVP v2.0)

Tài liệu này trình bày cấu trúc thư mục tối ưu nhất cho dự án nền tảng Video AI & Mạng xã hội, được thiết kế dựa trên kiến trúc **Chia để trị (Divide and Conquer)**. Cấu trúc tuân thủ chặt chẽ các Best Practices của FastAPI và React/Vite, tách biệt hoàn toàn Frontend và Backend, đồng thời chuẩn bị sẵn không gian cho Lõi C++ hiệu năng cao (Phase 2).

---

## 🏗 CẤU TRÚC THƯ MỤC TỔNG THỂ

```text
project_kink/
├── frontend/               # (1) FRONTEND - Giao diện Universal App (Expo / React Native)
├── backend/                # (2) BACKEND - API & Xử lý logic lõi (FastAPI & Python)
├── docker-compose.yml      # Cấu hình khởi tạo nhanh môi trường (MongoDB, Redis) cục bộ
├── .gitignore              # Bỏ qua các file không cần track bằng Git
└── README.md               # Tài liệu tổng quan dự án (file bạn đang đọc)
```

---

## 💻 1. THƯ MỤC FRONTEND (`/frontend`)

Sử dụng **Expo (React Native)** cho phép chiến lược "Code 1 lần, chạy 3 nơi" (Web, iOS, Android). Quản lý state bằng Redux/Zustand và thiết kế theo kiến trúc Universal App.

```text
frontend/
├── app/                    # Sử dụng Expo Router (File-based routing cho cả Web và Mobile)
│   ├── index.tsx           # Trang chủ (Newfeed)
│   └── _layout.tsx         # Cấu trúc bố cục dùng chung (Header, Bottom Tabs)
├── src/
│   ├── components/         # Các UI component dùng chung (NativeWind/Tailwind)
│   ├── store/              # Nơi lưu trữ trạng thái toàn cục (Memory lưu AccessToken chống XSS)
│   └── services/           # Các hàm gọi API (Axios interceptors để bắt lỗi 401 & gọi refresh token)
├── app.json                # Cấu hình app (Tên, Icon, Splash screen) cho iOS/Android
└── package.json            # Quản lý thư viện Node.js
```

---

## ⚙️ 2. THƯ MỤC BACKEND (`/backend`)

Được thiết kế theo **Domain-Driven Design (FastAPI Best Practices)**. Mỗi tính năng được gom vào một module riêng, giúp dễ dàng bảo trì và scale (mở rộng).

```text
backend/
├── cpp_core/               # ⚡ (Phase 2) LÕI C++ - Xử lý Video/Audio tốc độ cao
│   ├── CMakeLists.txt      # Cấu hình biên dịch thư viện C++
│   ├── src/                # Mã nguồn C++ (Gọi NVIDIA NVENC, tối ưu phần cứng)
│   ├── include/            # File tiêu đề (.h, .hpp)
│   └── bindings/           # Lớp bọc (wrapper) dùng pybind11/ctypes để Python/FastAPI có thể gọi trực tiếp hàm C++
│
├── src/                    # 🐍 LÕI API - FastAPI Application
│   ├── auth/               # Module 1: Xác thực & Quản lý User
│   │   ├── router.py       # (Các endpoints: /auth/signup, /signin, /refresh, /me)
│   │   ├── schemas.py      # Pydantic models (Validate dữ liệu đầu vào/ra)
│   │   ├── models.py       # Cấu trúc dữ liệu MongoDB cho Collection Users
│   │   ├── dependencies.py # Middleware xác thực (Giải mã JWT, đọc HttpOnly Cookie)
│   │   ├── service.py      # Logic nghiệp vụ (Mã hóa bcrypt, sinh JWT)
│   │   ├── constants.py    # Hằng số cấu hình riêng của auth
│   │   └── exceptions.py   # Các lỗi nghiệp vụ (Vd: UserNotFound, TokenExpired)
│   │
│   ├── assets/             # Module 2: Lưu trữ Object Storage (S3/R2)
│   │   ├── router.py       # (Các endpoints: /assets/upload-signature, /metadata, /)
│   │   ├── schemas.py      
│   │   ├── models.py       # Lịch sử file trên MongoDB (chỉ lưu URL)
│   │   ├── service.py      # Logic sinh Pre-signed URL bằng boto3/Cloudinary
│   │   └── ...
│   │
│   ├── videos/             # Module 3: Hàng đợi Render & Chia nhỏ Video
│   │   ├── router.py       # (Các endpoints: /videos/render, /{id}/status)
│   │   ├── schemas.py      
│   │   ├── models.py       # Quản lý VideoTask (Status tiến độ, số chunk)
│   │   ├── service.py      # Xử lý MongoDB (Tạo Task, Cập nhật trạng thái)
│   │   ├── tasks.py        # Mấu chốt Hàng Đợi: Chứa Worker logic (Redis/Celery) chạy ngầm chia chunk file âm thanh
│   │   └── utils.py        # Các hàm bọc gọi FFmpeg, OpenCV (tạo file tạm trên ổ cứng SSD)
│   │
│   ├── social/             # Module 4: Mạng xã hội (Posts, Likes, Comments, Followers, Notifications)
│   │   ├── router.py       # (Các endpoints API cho Newfeed, Tương tác)
│   │   ├── schemas.py      # Validate dữ liệu (Tạo bài, thả tim, bình luận)
│   │   ├── models.py       # 5 collections mạng xã hội MongoDB
│   │   ├── service.py      # Logic xử lý nghiệp vụ social
│   │   ├── constants.py
│   │   └── exceptions.py
│   │
│   ├── director/           # Module 5: Đạo diễn AI (Phase 2)
│   │   ├── router.py       # (Các endpoints: /director/suggest-style, /extract-knowledge)
│   │   └── service.py      # Gọi LangChain, Qdrant VectorDB
│   │
│   ├── core/               # Cấu hình và Thành phần toàn cục
│   │   ├── config.py       # Load biến môi trường (.env) bằng Pydantic BaseSettings
│   │   ├── exceptions.py   # Trình xử lý ngoại lệ chung (Global Error Handler)
│   │   ├── pagination.py   # Hàm phân trang dùng chung
│   │   └── database.py     # Kết nối tới MongoDB (sử dụng Motor cho bất đồng bộ)
│   │
│   └── main.py             # Entry point gốc của toàn bộ FastAPI App
│
├── tests/                  # Thư mục chứa Unit Test & Integration Test (Tách theo module)
│   ├── auth/
│   ├── assets/
│   └── videos/
│
├── requirements/           # Quản lý thư viện Python
│   ├── base.txt            # Thư viện core
│   ├── dev.txt             # Thư viện cho môi trường dev (pytest, ruff...)
│   └── prod.txt            # Thư viện trên Production
│
├── .env                    # Chứa biến môi trường (Database URI, JWT Secret...)
├── celery_worker.py        # Entry point khởi chạy các GPU Worker chạy ngầm
└── README.md               # Hướng dẫn setup Backend cụ thể
```

---

## 🔗 LIÊN KẾT VÀ TƯƠNG TÁC GIỮA CÁC THÀNH PHẦN

Cấu trúc trên vận hành dựa trên sự phân chia trách nhiệm cực kỳ rạch ròi:

1. **Frontend (`/frontend`) <---> Backend API (`/backend/src`)**:
   - Giao tiếp thông qua RESTful API chuẩn.
   - Frontend không giữ JWT Access Token lâu dài mà để trong Memory, dùng tính năng Interceptor của Axios (`/frontend/src/services`) để tự động bắt lỗi hết hạn, lấy Cookie làm mới token qua `backend/src/auth`.
   - **Upload File**: Frontend gọi `/backend/src/assets` lấy chữ ký, sau đó **tải file thẳng lên Cloud**, không đi qua server API.

2. **Backend API (`/backend/src/videos`) <---> Background Worker (`tasks.py`)**:
   - Khi có request Render Video, `videos/router.py` chỉ làm nhiệm vụ lưu vào Database (`videos/models.py`) và đẩy thông báo cho Redis Queue. Ngay lập tức trả về `HTTP 202 Accepted` cho Frontend.
   - Background Worker (chạy bởi `celery_worker.py`) sẽ lắng nghe Queue, gọi mã trong `tasks.py` để xử lý nặng (Chia chunk, gọi PyTorch).

3. **Backend API (`/backend/src`) <---> Lõi C++ (`/backend/cpp_core`) (Phase 2)**:
   - Các logic gọi phần cứng (như CUDA, OpenCV nâng cao) được code bằng C++ trong thư mục `cpp_core`.
   - Biên dịch C++ ra dạng thư viện chia sẻ (shared library) thông qua cấu hình `CMakeLists.txt` và `bindings`.
   - Các file `utils.py` hoặc `tasks.py` trong `src/videos` của Python sẽ `import` module C++ này để gọi thực thi như một hàm Python thông thường. Cách tiếp cận này giúp dự án vừa có tốc độ code nhanh (Python) vừa có hiệu năng máy móc tối đa (C++).

4. **Kiến trúc Mở Rộng Dài Hạn (Long-term Scaling)**:
   - **Phân trang Cursor:** API Feed mạng xã hội sử dụng Cursor-based pagination.
   - **Redis Cache:** Bảng tin Newfeed được cache trên Redis đảm bảo độ trễ vài mili-giây.
   - **WebSockets:** Hệ thống thông báo (Notifications) được truyền Realtime tới mobile client thông qua kết nối WebSocket của FastAPI.
