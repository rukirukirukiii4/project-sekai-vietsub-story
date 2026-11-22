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
        untrained: "https://imgur.com/a/ZcqO9uX", 
        trained: "https://imgur.com/a/7YacXfK",   
        sideStory1: "",
        sideStory2: ""
      },
      {
        character: "Asahina Mafuyu",
        title: "Hình tượng 「Đứa trẻ ngoan」của tôi",
        rarity: 3,
        untrained: "https://imgur.com/a/vqcbjNV",
        trained: "https://imgur.com/a/3k0ldbX",
        sideStory1: "",
        sideStory2: "" 
      },
      {
        character: "Shinonome Ena",
        title: "Góc máy đẹp nhất",
        rarity: 3,
        untrained: "https://imgur.com/a/rVRbUVJ",
        trained: "https://imgur.com/a/PhKuyZ1",
        sideStory1: "",
        sideStory2: ""
      },
      {
        character: "Akiyama Mizuki",
        title: "Một điều không thể thỏa hiệp",
        rarity: 3, 
        untrained: "https://imgur.com/a/Ndnz84U", 
        trained: "https://imgur.com/a/tqn4nxm",   
        sideStory1: "",
        sideStory2: ""
      }
    ]
  },

  {
    id: "wxs-main-story",
    number: "Main Story Wonderlands x Showtime",
    title: "Main Story Wonderlands x Showtime",
    jpTitle: "ワンダーランズ×ショウタイムメインストーリー",
    unit: "wxs",
    date: "2020",
    banner: "https://bushiroad-music.com/wordpress/wp-content/uploads/2024/08/05135826/e52358e8-9a13-4848-8b8b-047c41501c40-1024x619.png",
    summary: "Tsukasa, chàng trai mang trong mình ước mơ trở thành một ngôi sao, đã may mắn được nhận vào làm bán thời gian tại công viên giải trí Phoenix Wonderland. Ở đó, cậu gặp Emu - cô gái luôn mong muốn khôi phục lại sân khấu bỏ hoang Phoenix Stage trong công viên. Cùng với Rui - một vị đạo diễn lập dị nhưng đầy sáng tạo, và Nene - cô gái rụt rè sở hữu một giọng hát tuyệt vời, họ lập nên nhóm Wonderlands×Showtime. Bốn người họ đã cùng nhau vượt qua những thất bại và mâu thuẫn, để tìm lại niềm vui và phép màu của “sân khấu mang đến nụ cười cho mọi người”.",
    chapters: [
      { ep: "OP", title: "Chap Opening", youtube: "https://youtu.be/8_S-DOtT1WE" },
      { ep: 1, title: "Chap 1: Chào mừng tới Wonder Stage!", youtube: "https://youtu.be/yIDC9sQ9hv8" },
      { ep: 2, title: "Chap 2: Ngôi sao tương lai và Wonderhoyyyy", youtube: "https://youtu.be/J1AhCMXGOt0" },
      { ep: 3, title: "Chap 3: Sekai Xứ sở thần tiên", youtube: "https://youtu.be/nJ7mYgwblng" },
      { ep: 4, title: "Chap 4: Cùng tìm kiếm thành viên nào!", youtube: "https://youtu.be/mhdIYyotHHk" },
      { ep: 5, title: "Chap 5: Vị đạo diễn kỳ lạ", youtube: "https://youtu.be/2jN55sTSW2s" },
      { ep: 6, title: "Chap 6: Thành viên thứ 4?", youtube: "https://youtu.be/MZ7lhAkpxaI" },
      { ep: 7, title: "Chap 7: Nenerobo On Stage!?", youtube: "https://youtu.be/5hOJRqrCg-g" },
      { ep: 8, title: "Chap 8: Thành lập! Show Unit!", youtube: "https://youtu.be/F-5U8HeVMcw" },
      { ep: 9, title: "Chap 9: Người kỳ quặc, phát huy bản lĩnh", youtube: "https://youtu.be/IAqQBMo3gEQ" },
      { ep: 10, title: "Chap 10: Gợi ý của KAITO", youtube: "https://youtu.be/Od49SRCpi3s" },
      { ep: 11, title: "Chap 11: Ước mơ của Emu", youtube: "https://youtu.be/8_vgBzJ2-6U" },
      { ep: 12, title: "Chap 12: Buổi biểu diễn bắt đầu!", youtube: "https://youtu.be/5qZPVZ10Fc4" },
      { ep: 13, title: "Chap 13: Nụ cười đã đánh mất", youtube: "https://youtu.be/JacAj2fLvms" },
      { ep: 14, title: "Chap 14: Cảm xúc ngày ấy", youtube: "https://youtu.be/U69puzeJFEc" },
      { ep: 15, title: "Chap 15: Sân khấu của ông", youtube: "https://youtu.be/YCVzVRjebHg" },
      { ep: 16, title: "Chap 16: Cách để chắc chắn sẽ không thất bại", youtube: "https://youtu.be/ZnKx5DnV6vo" },
      { ep: 17, title: "Chap 17: Nhà giả kim cô đơn", youtube: "https://youtu.be/SVTg1kY0Uc4" },
      { ep: 18, title: "Chap 18: Đáp án cho 「buổi Show tuyệt nhất」", youtube: "https://youtu.be/SVTg1kY0Uc4" },
      { ep: 19, title: "Chap 19: Thế giới vẫn còn chưa bắt đầu mà", youtube: "https://youtu.be/BJireZNtPbM" },
      { ep: 20, title: "Chap 20: Wonderlands x Showtime", youtube: "https://youtu.be/oKjBTIIR6sw" }
    ],
    cards: [
      {
        character: "Tenma Tsukasa",
        title: "Lời chào từ phía bên trong bộ đồ mascot",
        rarity: 3, 
        untrained: "https://storage.sekai.best/sekai-jp-assets/character/member/res013_no003/card_normal.png", 
        trained: "https://storage.sekai.best/sekai-jp-assets/character/member/res013_no003/card_after_training.png",   
        sideStory1: "",
        sideStory2: ""
      },
      {
        character: "Ootori Emu",
        title: "Cùng tham gia cuộc họp bàn chiến lược nào!",
        rarity: 3,
        untrained: "https://storage.sekai.best/sekai-jp-assets/character/member/res014_no003/card_normal.png",
        trained: "https://storage.sekai.best/sekai-jp-assets/character/member/res014_no003/card_after_training.png",
        sideStory1: "",
        sideStory2: "" 
      },
      {
        character: "Kusanagi Nene",
        title: "Đang điều khiển từ phía sau sân khấu",
        rarity: 3,
        untrained: "https://storage.sekai.best/sekai-jp-assets/character/member/res015_no003/card_normal.png",
        trained: "https://storage.sekai.best/sekai-jp-assets/character/member/res015_no003/card_after_training.png",
        sideStory1: "",
        sideStory2: ""
      },
      {
        character: "Kamishiro Rui",
        title: "Nghệ sĩ biểu diễn thoắt ẩn thoắt hiện",
        rarity: 3, 
        untrained: "https://storage.sekai.best/sekai-jp-assets/character/member/res016_no003/card_normal.png", 
        trained: "https://storage.sekai.best/sekai-jp-assets/character/member/res016_no003/card_after_training.png",   
        sideStory1: "",
        sideStory2: ""
      }
    ]
  },

    {
    id: "vbs-main-story",
    number: "Main Story Vivid BAD SQUAD",
    title: "Main Story Vivid BAD SQUAD",
    jpTitle: "Vivid BAD SQUAD メインストーリー",
    unit: "vbs",
    date: "2020",
    banner: "https://img.youtube.com/vi/316Yj9-prpk/maxresdefault.jpg",
    summary: "Sau khi tình cờ nghe An hát trên phố, Kohane - cô gái nhút nhát nhưng đam mê âm nhạc - đã bị cuốn vào thế giới sôi động của âm nhạc đường phố. Sau khi hóa giải mọi hiểu lầm, cô cùng An, Akito và Touya lập nên Vivid BAD SQUAD, mang trong mình ước mơ vượt qua huyền thoại RAD WEEKEND và lan tỏa cảm xúc chân thật qua từng giai điệu.",
    chapters: [
      { ep: "OP", title: "Chap Opening", youtube: "https://youtu.be/I9bU7QeKzRs" },
      { ep: 1, title: "Chap 1: Khu phố với những nét vẽ đường phố", youtube: "https://youtu.be/ZaNrRTi7784" },
      { ep: 2, title: "Chap 2: Bài hát hồi hộp nhất", youtube: "https://youtu.be/p0Y2Btj_Wdk" },
      { ep: 3, title: "Chap 3: WEEKEND GARAGE", youtube: "https://youtu.be/g7vy1_uLlN4" },
      { ep: 4, title: "Chap 4: BAD DOGS", youtube: "https://youtu.be/QYZ66QphbKQ" },
      { ep: 5, title: "Chap 5: Sekai Đường phố", youtube: "https://youtu.be/ULfP8M_6mUI" },
      { ep: 6, title: "Chap 6: Quán cafe bí ẩn", youtube: "https://youtu.be/GEsCv6KcEfE" },
      { ep: 7, title: "Chap 7: Địa điểm luyện tập được ưa chuộng", youtube: "https://youtu.be/yASBcUv3M1k" },
      { ep: 8, title: "Chap 8: Tôi muốn tin rằng cậu cũng nghĩ vậy", youtube: "https://youtu.be/Wq5qM6P1pJs" },
      { ep: 9, title: "Chap 9: Buổi event đầu tiên", youtube: "https://youtu.be/1KFxK1-TOXI" },
      { ep: 10, title: "Chap 10: Lòng quyết tâm được đòi hỏi", youtube: "https://youtu.be/STjxHH4OmJ8" },
      { ep: 11, title: "Chap 11: Dũng khí để mở cánh cửa", youtube: "https://youtu.be/RdpK5P6MBy4" },
      { ep: 12, title: "Chap 12: Chắc chắn tớ sẽ không trốn chạy", youtube: "https://youtu.be/4n4nHVP7Q5w" },
      { ep: 13, title: "Chap 13: Vivids!", youtube: "https://youtu.be/KdJNGb5oHBY" },
      { ep: 14, title: "Chap 14: Cậu có nói nghiêm túc không đấy?", youtube: "https://youtu.be/1IlLfl6nQ2U" },
      { ep: 15, title: "Chap 15: Vì tớ đã được công nhận", youtube: "https://youtu.be/TaF3EsW6r0A" },
      { ep: 16, title: "Chap 16: Người thứ 3", youtube: "https://youtu.be/JFcw-NeTnF0" },
      { ep: 17, title: "Chap 17: Len và MEIKO và vũ khí bí mật", youtube: "https://youtu.be/_Ehr_T717uw" },
      { ep: 18, title: "Chap 18: Tách biệt", youtube: "https://youtu.be/GQgXBhOns3w" },
      { ep: 19, title: "Chap 19: Ready Steady", youtube: "https://youtu.be/axzVcI82dA8" },
      { ep: 20, title: "Chap 20: Vivid BAD SQUAD", youtube: "https://youtu.be/r3ZOpsRXPJY" }
    ],
    cards: [
      {
        character: "Azusawa Kohane",
        title: "Thở một hơi tại Sekai",
        rarity: 3, 
        untrained: "https://storage.sekai.best/sekai-jp-assets/character/member/res013_no003/card_normal.png", 
        trained: "https://storage.sekai.best/sekai-jp-assets/character/member/res013_no003/card_after_training.png",   
        sideStory1: "",
        sideStory2: ""
      },
      {
        character: "Shiraishi An",
        title: "Đang tích cực phụ giúp lắm đây!",
        rarity: 3,
        untrained: "https://storage.sekai.best/sekai-jp-assets/character/member/res014_no003/card_normal.png",
        trained: "https://storage.sekai.best/sekai-jp-assets/character/member/res014_no003/card_after_training.png",
        sideStory1: "",
        sideStory2: "" 
      },
      {
        character: "Shinonome Akito",
        title: "Nỗi bực dọc âm ỉ",
        rarity: 3,
        untrained: "https://storage.sekai.best/sekai-jp-assets/character/member/res015_no003/card_normal.png",
        trained: "https://storage.sekai.best/sekai-jp-assets/character/member/res015_no003/card_after_training.png",
        sideStory1: "",
        sideStory2: ""
      },
      {
        character: "Aoyagi Touya",
        title: "Mối liên kết bị cắt đứt",
        rarity: 3, 
        untrained: "https://storage.sekai.best/sekai-jp-assets/character/member/res016_no003/card_normal.png", 
        trained: "https://storage.sekai.best/sekai-jp-assets/character/member/res016_no003/card_after_training.png",   
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