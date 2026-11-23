# ★ SEKAI STORY - Kho Lưu Trữ Event Story & Side Story Vietsub

Website tổng hợp và trình chiếu các câu chuyện (Main Story, Event Story, Side Story) của **Project Sekai: Colorful Stage!** bản Vietsub từ YouTube cua **Project Sekai Vietsub**, được xây dựng bằng ReactJS 

---

## ✨ Tính năng chính

- **Bộ lọc & Tìm kiếm nhanh:** Lọc theo từng Unit qua thanh logo trực quan (`All`, `Virtual Singer`, `Leo/need`, `MORE MORE JUMP!`, `Vivid BAD SQUAD`, `Wonderlands×Showtime`, `25-ji, Nightcord de.`, `Mix`) và tìm kiếm theo tên tiếng Việt, tiếng Nhật hoặc số thứ tự Event.
- **Giao diện biến đổi theo Unit:** Tự động đổi màu chủ đạo (Accent Color) theo Unit đang chọn hoặc theo Event đang xem.
- **Trình phát YouTube tích hợp:** Xem video trực tiếp trên web, chuyển nhanh **Tập trước / Tập sau**, hoặc mở thẳng trên YouTube.
- **Lưu tiến độ đã xem:** Đánh dấu các tập đã xem (tự động lưu trên `localStorage` của trình duyệt, không bị mất khi F5).
- **Thẻ Event & Side Story:** Xem danh sách thẻ đi kèm Event, chuyển đổi ảnh **Chưa thức tỉnh (Untrained) / Đã thức tỉnh (Trained)** và xem nhanh **Side Story 1 & 2**.
- **Dark Mode / Light Mode:** Chuyển đổi qua lại giữa giao diện Sáng và Tối.

---

## 🛠️ Công nghệ sử dụng

- **Frontend:** ReactJS, Vite
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS v3 + SCSS (Dart Sass)
- **Dữ liệu:** JSON (`events.json`, `siteConfig.json`) & `localStorage`

---

## 📁 Cấu trúc thư mục

```text
project-sekai-vietsub-story/
├── public/
│   ├── images/                  # Ảnh thẻ nhân vật (untrained / trained)
│   └── unit_logo/               # Logo các Unit (ln.png, mmj.png, vbs.png, wxs.png, niigo.png)
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── Header.jsx       # Thanh điều hướng, link kênh YouTube, nút đổi theme
│   │   ├── home/
│   │   │   ├── EventCard.jsx    # Thẻ từng Event trên trang chủ
│   │   │   └── FilterBar.jsx    # Thanh tìm kiếm & bộ lọc logo Unit
│   │   └── reader/
│   │       ├── ChapterList.jsx  # Danh sách tập (Chapter)
│   │       ├── GachaCardItem.jsx# Thẻ nhân vật + nút đổi ảnh thức tỉnh + Side Story
│   │       └── VideoPlayer.jsx  # Khung YouTube Embed & điều khiển tập
│   ├── constants/
│   │   └── units.js             # Cấu hình tên, mã màu & logo các Unit
│   ├── data/
│   │   ├── events.json          # Dữ liệu các Event, Chapter và Thẻ
│   │   └── siteConfig.json      # Thông tin cấu hình chung của website
│   ├── hooks/
│   │   └── useLocalStorage.js   # Custom Hook lưu trạng thái trên trình duyệt
│   ├── pages/
│   │   ├── HomePage.jsx         # Trang chủ danh sách Event
│   │   └── ReaderPage.jsx       # Trang xem Video & Side Story
│   ├── styles/
│   │   ├── _variables.scss      # Biến màu CSS cho Light/Dark Mode
│   │   └── main.scss            # Cấu hình Tailwind, họa tiết nền & style chung
│   ├── utils/
│   │   └── helpers.js           # Các hàm xử lý YouTube ID, đường dẫn ảnh, format tập
│   ├── App.jsx                  # Định tuyến (Router) & quản lý Theme
│   └── main.jsx                 # Điểm khởi chạy ứng dụng React
├── index.html
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

---

## 🚀 Hướng dẫn cài đặt & chạy dự án

### 1. Yêu cầu môi trường
- **Node.js** phiên bản `18.x` hoặc `20.x+` (khuyên dùng bản LTS tại [nodejs.org](https://nodejs.org/)).
- Trình quản lý gói **npm** (đi kèm khi cài Node.js).

### 2. Các bước cài đặt

```bash
# Bước 1: Clone dự án về máy
git clone <link-repository-cua-ban>

# Bước 2: Di chuyển vào thư mục dự án
cd project-sekai-vietsub-story

# Bước 3: Cài đặt toàn bộ các gói thư viện
npm install
```

### 3. Chạy dự án ở môi trường phát triển (Development)

```bash
npm run dev
```
Sau khi chạy lệnh thành công, giữ phím `Ctrl` và click vào đường dẫn hiển thị trên Terminal (mặc định là `http://localhost:5173`) để mở website trên trình duyệt.

### 4. Đóng gói sản phẩm (Build Production)

```bash
# Biên dịch code tối ưu vào thư mục dist/
npm run build

# Xem trước bản build production ngay trên máy
npm run preview
```
Thư mục `dist/` sau khi build có thể deploy trực tiếp lên **Vercel**, **Netlify**, **Cloudflare Pages** hoặc **GitHub Pages**.

---

## 📖 Hướng dẫn sử dụng website

### 1. Tìm kiếm & Lọc Event (Trang chủ)
- **Thanh tìm kiếm:** Nhập tên Event bằng tiếng Việt, tiếng Nhật hoặc số thứ tự (ví dụ: `Nightcord`, `Main Story`, `Event #02`) để lọc nhanh.
- **Thanh lọc Unit:** Bấm vào logo của từng nhóm nhạc (hoặc `All` / `Mix`) để chỉ hiển thị các Event thuộc Unit đó. Màu chủ đạo của toàn trang sẽ tự đổi theo Unit được chọn.
- **Đổi giao diện:** Bấm nút **🌙 Giao diện tối / ☀️ Giao diện sáng** ở góc trên bên phải để đổi giữa Light Mode và Dark Mode.

### 2. Xem Story & Side Story (Trang chi tiết)
- Bấm vào bất kỳ thẻ Event nào ở trang chủ để mở trang xem Story.
- **Xem tập:** Chọn tập muốn xem trong danh sách **Danh sách Chapter** hoặc dùng 2 nút **◀ Tập trước / Tập sau ▶** ngay dưới khung video.
- **Đánh dấu đã xem:** Bấm nút **Đánh dấu đã xem** dưới video để lưu lại tiến độ (các tập đã xem sẽ hiện nhãn `✓ Đã xem` và được cộng vào thống kê ở trang chủ).
- **Xem thẻ & Side Story:** Ở cột bên phải (**Thẻ Event & Side Story**):
  - Bấm **✦ Xem đã thức tỉnh / ↺ Xem chưa thức tỉnh** trên góc ảnh thẻ để chuyển đổi giữa 2 trạng thái ảnh.
  - Bấm **▶ Side Story 1** hoặc **▶ Side Story 2** để phát video Side Story tương ứng của nhân vật đó ngay trên trình phát chính.

---

## 📝 Hướng dẫn cập nhật nội dung (Dành cho quản trị viên)

### 1. Đổi tên web & link kênh YouTube
Mở và chỉnh sửa file `src/data/siteConfig.json`:

```json
{
  "siteTitle": "SEKAI STORY",
  "subtitle": "Kho lưu trữ Event Story & Side Story Vietsub",
  "channelName": "Kênh YouTube của chúng mình",
  "channelUrl": "https://www.youtube.com/@ten-kenh-cua-ban"
}
```

### 2. Thêm Event mới
1. Đặt ảnh thẻ nhân vật hoặc banner (nếu lưu cục bộ) vào thư mục `public/images/`.
2. Mở file `src/data/events.json` và thêm một đối tượng mới vào mảng `[...]` theo mẫu sau:

```json
{
  "id": "ma-event-moi",
  "number": "Event #04",
  "title": "Tên Event tiếng Việt",
  "jpTitle": "Tên tiếng Nhật hoặc tiếng Anh",
  "unit": "mmj",
  "date": "2025",
  "banner": "/images/ten-anh-banner.png",
  "summary": "Mô tả ngắn gọn nội dung của Event.",
  "chapters": [
    { "ep": "OP", "title": "Chap Opening", "youtube": "https://youtu.be/..." },
    { "ep": 1, "title": "Tên tập 1", "youtube": "https://youtu.be/..." },
    { "ep": 2, "title": "Tên tập 2", "youtube": "" }
  ],
  "cards": [
    {
      "character": "Tên nhân vật",
      "title": "Tên thẻ",
      "rarity": 4,
      "untrained": "/images/ten-anh-untrained.png",
      "trained": "/images/ten-anh-trained.png",
      "sideStory1": "https://youtu.be/...",
      "sideStory2": ""
    }
  ]
}
```

#### Bảng mã `unit` hợp lệ:
| Mã `unit` | Tên Unit |
| :--- | :--- |
| `"ln"` | Leo/need |
| `"mmj"` | MORE MORE JUMP! |
| `"vbs"` | Vivid BAD SQUAD |
| `"wxs"` | Wonderlands×Showtime |
| `"n25"` | 25-ji, Nightcord de. |
| `"vs"` | Virtual Singer |
| `"mixed"` | Mixed Event |

> **Lưu ý:** Khi chỉnh sửa file `.json`, mọi chuỗi ký tự phải nằm trong dấu ngoặc kép `""` và **không được để dư dấu phẩy `,`** ở phần tử cuối cùng.