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
    id: "n25-main-story",
    number: "Main Story Niigo",
    title: "Main Story 25-ji, Nightcord de.",
    jpTitle: "25時、ナイトコードで。メインストーリー",
    unit: "n25",
    date: "2020",
    banner: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWs8zxkqMSTbGzAT4n07YxGTKlb2BcJE_uf9sqTWvyy_j5AR0WDlMO-w_&s=10",
    summary: "Câu chuyện của 25ji, Nightcord de. xoay quanh bốn người bạn - Kanade, Mafuyu, Ena và Mizuki - những người mang trong mình những nỗi cô đơn và tổn thương khác nhau. Họ gặp nhau qua một ứng dụng mang tên Nightcord, nơi họ cùng nhau sáng tác nhạc vào “25 giờ”. Trong quá trình làm nhạc, cả bốn dần bộc lộ những mặt tối sâu kín của bản thân và học cách đối diện với chúng. Câu chuyện là hành trình họ dùng âm nhạc để kết nối, để cứu rỗi nhau, và cũng để tìm lại chính mình trong một thế giới đầy cô đơn và tuyệt vọng.",
    chapters: [
      { ep: "OP", title: "Chap Opening", youtube: "https://youtu.be/eJkywpfP0xU" },
      { ep: 1, title: "Chap 1: Hội nhóm vào lúc nửa đêm", youtube: "https://youtu.be/l1reqZUZFjE" },
      { ep: 2, title: "Chap 2: Miku trắng", youtube: "https://youtu.be/bM0S1IMNQoA" },
      { ep: 3, title: "Chap 3: OWN", youtube: "https://youtu.be/i6HqbQrIFA0" },
      { ep: 4, title: "Chap 4: Đứa trẻ ngoan", youtube: "https://youtu.be/VguojXHrKvI" },
      { ep: 5, title: "Chap 5: Yuki biến mất", youtube: "https://youtu.be/JoJje_EEgQ4" },
      { ep: 6, title: "Chap 6: Sekai Không người", youtube: "https://youtu.be/6_37hqH3tu4" },
      { ep: 7, title: "Chap 7: Các cậu đều muốn biến mất mà", youtube: "https://youtu.be/MUEetjEzsH4" },
      { ep: 8, title: "Chap 8: Tranh vẽ của người tầm thường", youtube: "https://youtu.be/BQ1_OnkNxTE" },
      { ep: 9, title: "Chap 9: Dù cho, mình đã muốn được là chính mình mà", youtube: "https://youtu.be/79C-r4wfjDk" },
      { ep: 10, title: "Chap 10: Thanh âm còn thiếu sót", youtube: "https://youtu.be/4k3P5prbC8w" },
      { ep: 11, title: "Chap 11: Thứ âm nhạc khiến người ta hạnh phúc", youtube: "https://youtu.be/Om9gN2aERPg" },
      { ep: 12, title: "Chap 12: Chỉ một bài hát", youtube: "https://youtu.be/bhuh4OmwpSE" },
      { ep: 13, title: "Chap 13: Cái 「Tôi」 chẳng có ở nơi nào", youtube: "https://youtu.be/q66BLgD-c40" },
      { ep: 14, title: "Chap 14: 「Cô đơn thật đấy nhỉ」", youtube: "https://youtu.be/pydlEL-Tidc" },
      { ep: 15, title: "Chap 15: Trước khi cậu ấy biến mất", youtube: "https://youtu.be/QrWb7hGrfDw" },
      { ep: 16, title: "Chap 16: Sụp đổ", youtube: "https://youtu.be/Xay9fyDNTNU" },
      { ep: 17, title: "Chap 17: Lời nguyền của hai người", youtube: "https://youtu.be/FnadJmyXnYQ" },
      { ep: 18, title: "Chap 18: Dù thế nhưng tớ vẫn muốn cứu cậu", youtube: "https://youtu.be/klIQkakGiMY" },
      { ep: 19, title: "Chap 19: Tương lai được viết nên từ niềm hối tiếc", youtube: "https://youtu.be/NSn8vORfcjo" },
      { ep: 20, title: "Chap 20: 25-ji, Nightcord de.", youtube: "https://youtu.be/BWagRTt3EO8" }
    ],
    cards: [
      {
        character: "Yoisaki Kanade",
        title: "Phía bên kia màn hình...",
        rarity: 3, 
        untrained: "https://storage.sekai.best/sekai-jp-assets/character/member/res017_no003/card_normal.png", 
        trained: "https://storage.sekai.best/sekai-jp-assets/character/member/res017_no003/card_after_training.png",   
        sideStory1: "",
        sideStory2: ""
      },
      {
        character: "Asahina Mafuyu",
        title: "Hình tượng「Đứa trẻ ngoan」của tôi",
        rarity: 3,
        untrained: "https://storage.sekai.best/sekai-jp-assets/character/member/res018_no003/card_normal.png",
        trained: "https://storage.sekai.best/sekai-jp-assets/character/member/res018_no003/card_after_training.png",
        sideStory1: "",
        sideStory2: "" 
      },
      {
        character: "Shinonome Ena",
        title: "Góc máy đẹp nhất",
        rarity: 3,
        untrained: "https://storage.sekai.best/sekai-jp-assets/character/member/res019_no003/card_normal.png",
        trained: "https://storage.sekai.best/sekai-jp-assets/character/member/res019_no003/card_after_training.png",
        sideStory1: "",
        sideStory2: ""
      },
      {
        character: "Akiyama Mizuki",
        title: "Một điều không thể thỏa hiệp",
        rarity: 3, 
        untrained: "https://storage.sekai.best/sekai-jp-assets/character/member/res020_no003/card_normal.png", 
        trained: "https://storage.sekai.best/sekai-jp-assets/character/member/res020_no003/card_after_training.png",   
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