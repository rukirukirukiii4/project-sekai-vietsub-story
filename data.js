// =========================================================
// 1. THÔNG TIN CHUNG CỦA WEB (Sửa tên kênh của bạn ở đây)
// =========================================================
const SITE_CONFIG = {
  siteTitle: "SEKAI STORY",
  subtitle: "Kho lưu trữ Event Story & Side Story Vietsub",
  channelName: "Kênh YouTube của chúng mình",
  channelUrl: "https://www.youtube.com/@projectsekaivietsub3019" // Dán link kênh YouTube của bạn vào đây
};

// =========================================================
// 2. DANH SÁCH EVENT
// Các mã "unit" hợp lệ:
//   "ln"    -> Leo/need
//   "mmj"   -> MORE MORE JUMP!
//   "vbs"   -> Vivid BAD SQUAD
//   "wxs"   -> Wonderlands×Showtime
//   "n25"   -> 25-ji, Nightcord de.
//   "vs"    -> Virtual Singer
//   "mixed" -> Mixed Event
// =========================================================
const EVENTS_DATA = [
  {
    id: "n25-sample-01",
    number: "Event #01",
    title: "Cầm tù trong vòng lặp bóng tối",
    jpTitle: "囚われのマリオネット",
    unit: "n25",
    date: "2024",
    banner: "", // Dán link ảnh banner event vào giữa 2 dấu ngoặc kép (để trống web tự tạo nền đẹp)
    summary: "Kanade cùng các thành viên 25-ji tìm kiếm giai điệu có thể cứu rỗi Mafuyu trong thế giới SEKAI trống rỗng.",
    chapters: [
      { ep: 1, title: "Tập 1: Con rối không có dây", youtube: "https://www.youtube.com/watch?v=WF0qiNyTYF4" },
      { ep: 2, title: "Tập 2: Bữa tối im lặng", youtube: "https://www.youtube.com/watch?v=WF0qiNyTYF4" },
      { ep: 3, title: "Tập 3: Vết nứt trong SEKAI", youtube: "" }, // Để trống = Chưa cập nhật
      { ep: 4, title: "Tập 4: Lời nhắn lúc 1 giờ sáng", youtube: "" }
    ],
    cards: [
      {
        character: "Asahina Mafuyu",
        title: "Con rối đánh mất cảm xúc",
        rarity: 4, // Chọn 2, 3 hoặc 4
        untrained: "", // Link ảnh thẻ chưa thức tỉnh
        trained: "",   // Link ảnh thẻ đã thức tỉnh
        sideStory1: "https://www.youtube.com/watch?v=WF0qiNyTYF4",
        sideStory2: "https://www.youtube.com/watch?v=WF0qiNyTYF4"
      },
      {
        character: "Yoisaki Kanade",
        title: "Giai điệu dưới ánh đèn bàn",
        rarity: 4,
        untrained: "",
        trained: "",
        sideStory1: "https://www.youtube.com/watch?v=WF0qiNyTYF4",
        sideStory2: "" // Chưa làm video thì cứ để trống
      },
      {
        character: "Akiyama Mizuki",
        title: "Nụ cười che giấu",
        rarity: 2,
        untrained: "",
        trained: "", // Thẻ 2 sao không có ảnh thức tỉnh -> để trống web tự ẩn nút chuyển
        sideStory1: "",
        sideStory2: ""
      }
    ]
  },

  {
    id: "vbs-sample-02",
    number: "Event #02",
    title: "Vượt qua huyền thoại RAD WEEKEND",
    jpTitle: "いつか、背中あわせのリリックを",
    unit: "vbs",
    date: "2024",
    banner: "",
    summary: "Vivid BAD SQUAD đối mặt với khoảng cách thực lực giữa các thành viên trước đêm diễn tại phố Vivid.",
    chapters: [
      { ep: 1, title: "Tập 1: Đêm nhạc trên phố Vivid", youtube: "https://www.youtube.com/watch?v=qpgM4uIPtTc" },
      { ep: 2, title: "Tập 2: Cộng sự ăn ý", youtube: "https://www.youtube.com/watch?v=qpgM4uIPtTc" },
      { ep: 3, title: "Tập 3: Lời hứa chưa trọn vẹn", youtube: "" }
    ],
    cards: [
      {
        character: "Shiraishi An",
        title: "Ánh đèn sân khấu rực cháy",
        rarity: 4,
        untrained: "",
        trained: "",
        sideStory1: "https://www.youtube.com/watch?v=qpgM4uIPtTc",
        sideStory2: ""
      },
      {
        character: "Azusawa Kohane",
        title: "Bước chân đầu tiên",
        rarity: 4,
        untrained: "",
        trained: "",
        sideStory1: "https://www.youtube.com/watch?v=qpgM4uIPtTc",
        sideStory2: ""
      }
    ]
  },

  {
    id: "wxs-sample-03",
    number: "Event #03",
    title: "Nụ cười tỏa sáng trên sân khấu phép màu",
    jpTitle: "全力！ワンダーハロウィン！",
    unit: "wxs",
    date: "2024",
    banner: "",
    summary: "Tsukasa và Rui lên kế hoạch cho buổi diễn đặc biệt lớn nhất từ trước đến nay tại Phoenix Wonderland.",
    chapters: [
      { ep: 1, title: "Tập 1: Ý tưởng điên rồ của đạo diễn", youtube: "https://www.youtube.com/watch?v=sM2PphbvUgQ" },
      { ep: 2, title: "Tập 2: Buổi tổng duyệt hỗn loạn", youtube: "https://www.youtube.com/watch?v=sM2PphbvUgQ" }
    ],
    cards: [
      {
        character: "Tenma Tsukasa",
        title: "Ngôi sao của tương lai",
        rarity: 4,
        untrained: "",
        trained: "",
        sideStory1: "https://www.youtube.com/watch?v=sM2PphbvUgQ",
        sideStory2: ""
      }
    ]
  }
];

/* =========================================================
   KHUNG MẪU ĐỂ COPY KHI THÊM EVENT MỚI:
   (Copy từ dấu { đến dấu }, dán vào cuối danh sách phía trên,
    nhớ thêm dấu phẩy "," sau dấu } của event trước đó)

  {
    id: "ma-event-moi",
    number: "Event #04",
    title: "Tên Event tiếng Việt",
    jpTitle: "Tên tiếng Nhật hoặc tiếng Anh",
    unit: "mmj",
    date: "2025",
    banner: "",
    summary: "Mô tả ngắn gọn về event.",
    chapters: [
      { ep: 1, title: "Tập 1: Tên tập", youtube: "Dán link YouTube vào đây" },
      { ep: 2, title: "Tập 2: Tên tập", youtube: "" }
    ],
    cards: [
      {
        character: "Tên nhân vật",
        title: "Tên thẻ",
        rarity: 4,
        untrained: "",
        trained: "",
        sideStory1: "",
        sideStory2: ""
      }
    ]
  }
========================================================= */