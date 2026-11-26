import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import charactersData from "../data/characters.json";
import { UNITS } from "../constants/units";
import { setDynamicAccent } from "../utils/helpers";

// Thay bằng link nhóm kín Facebook của bạn
const FB_GROUP_URL = "https://www.facebook.com/groups/746210381092173";

const RARITY_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "4", label: "★★★★" },
  { id: "bd", label: "🎂 BD" },
  { id: "3", label: "★★★" },
  { id: "2", label: "★★" },
  { id: "1", label: "★" },
];

export default function SideStoryPage() {
  const navigate = useNavigate();

  const defaultCharId =
    charactersData.find((c) => c.id === "miku")?.id ||
    charactersData[0]?.id ||
    "";

  const [selectedCharId, setSelectedCharId] = useState(defaultCharId);
  const [searchCard, setSearchCard] = useState("");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [profileExpanded, setProfileExpanded] = useState(true);

  const activeChar = useMemo(() => {
    return (
      charactersData.find((c) => c.id === selectedCharId) ||
      charactersData[0] ||
      null
    );
  }, [selectedCharId]);

  const activeUnit = activeChar
    ? UNITS[activeChar.unit] || UNITS.all
    : UNITS.all;
  const themeColor = activeChar?.color || activeUnit?.color || "#00ccbb";

  useEffect(() => {
    setDynamicAccent(themeColor);
  }, [themeColor]);

  const handleSelectCharacter = (id) => {
    setSelectedCharId(id);
    setSearchCard("");
    setRarityFilter("all");
  };

  const filteredStories = useMemo(() => {
    if (!activeChar?.sideStories) return [];
    const q = searchCard.trim().toLowerCase();

    const list = activeChar.sideStories.filter((item) => {
      const matchSearch =
        !q || (item.title || "").toLowerCase().includes(q);
      const matchRarity =
        rarityFilter === "all" ||
        String(item.rarity).toLowerCase() === rarityFilter;
      return matchSearch && matchRarity;
    });

    return sortOrder === "desc" ? [...list].reverse() : list;
  }, [activeChar, searchCard, rarityFilter, sortOrder]);

  if (!activeChar) {
    return (
      <div className="text-center py-12 px-5 bg-surface border-[1.5px] border-dashed border-border rounded-[16px]">
        <p className="text-muted mb-3">Chưa có dữ liệu nhân vật.</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-full text-xs font-bold bg-accent text-white"
        >
          ← Quay lại trang chủ
        </button>
      </div>
    );
  }

  const profileRows = [
    { label: "CV", value: activeChar.profile?.cv },
    { label: "Trường", value: activeChar.profile?.school },
    { label: "Lớp", value: activeChar.profile?.grade },
    { label: "Sở thích", value: activeChar.profile?.hobby },
    { label: "Sở trường", value: activeChar.profile?.skill },
    { label: "Món thích", value: activeChar.profile?.favoriteFood },
    { label: "Món ghét", value: activeChar.profile?.dislikedFood },
    { label: "Điểm yếu", value: activeChar.profile?.weakness },
  ].filter((row) => row.value);

  return (
    <section className="flex flex-col gap-3 select-none">
      {/* Thanh điều hướng trên cùng */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold border-[1.5px] border-[var(--border)] bg-[var(--surface)] hover:border-accent hover:text-accent transition sekai-shadow"
        >
          <span className="w-5 h-5 rounded-full bg-[var(--accent-soft)] text-accent inline-flex items-center justify-center text-xs">
            ←
          </span>
          <span>Quay lại Event Story</span>
        </button>

        <a
          href={FB_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold bg-[#1877f2]/12 text-[#1877f2] dark:text-[#60a5fa] border border-[#1877f2]/30 hover:bg-[#1877f2] hover:text-white transition"
        >
          <span>🔒 Side Story lưu trong nhóm kín Facebook — Bấm tham gia nhóm</span>
          <span>↗</span>
        </a>
      </div>

      {/* KHUNG CHÍNH 3 CỘT: [AVATAR TRÒN] | [ẢNH ĐỨNG] | [PROFILE + SIDE STORY] */}
      <div className="sekai-stage relative overflow-hidden bg-[var(--surface)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-15 dark:opacity-20"
          style={{
            background: `radial-gradient(circle at 22% 30%, ${themeColor}, transparent 55%), linear-gradient(135deg, ${themeColor}33 0%, transparent 65%)`,
          }}
        />
        <div
          aria-hidden="true"
          className="sekai-char-watermark pointer-events-none select-none"
          style={{ color: themeColor }}
        >
          {activeChar.enName || activeChar.name}
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[82px_245px_1fr] xl:grid-cols-[86px_270px_1fr] min-h-[calc(100vh-195px)]">
          {/* CỘT 1: DẢI AVATAR TRÒN */}
          <aside className="bg-[var(--surface-alt)]/90 backdrop-blur-md border-b-[1.5px] lg:border-b-0 lg:border-r-[1.5px] border-[var(--border)] flex lg:flex-col items-center gap-2.5 p-2.5 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto lg:max-h-[calc(100vh-195px)] sekai-banner-scroll">
            {charactersData.map((char) => {
              const isSelected = char.id === activeChar.id;
              const cColor = char.color || "#00ccbb";

              return (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => handleSelectCharacter(char.id)}
                  title={char.name}
                  className={`group relative shrink-0 w-14 h-14 rounded-full p-[3px] transition-all duration-200 ${
                    isSelected
                      ? "scale-105 shadow-lg"
                      : "opacity-75 hover:opacity-100 hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: isSelected ? cColor : "transparent",
                    boxShadow: isSelected ? `0 0 0 3px ${cColor}44` : "none",
                  }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-[var(--surface)] border-2 border-white dark:border-slate-800 flex items-center justify-center">
                    {char.avatar ? (
                      <img
                        src={char.avatar}
                        alt={char.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="text-xs font-black"
                        style={{ color: cColor }}
                      >
                        {char.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <span
                      className="absolute -right-0.5 -bottom-0.5 w-4 h-4 rounded-full border-2 border-white text-[9px] text-white font-black flex items-center justify-center"
                      style={{ backgroundColor: cColor }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* CỘT 2: ẢNH ĐỨNG NHÂN VẬT + BẢNG TÊN DỌC */}
          <div
            key={`portrait-${activeChar.id}`}
            className="relative flex items-end justify-center min-h-[260px] lg:min-h-full overflow-hidden border-b-[1.5px] lg:border-b-0 lg:border-r-[1.5px] border-[var(--border)]/60 pt-4 px-3 sekai-fade-up"
          >
            {activeUnit?.logo && (
              <div className="absolute top-3 right-3 z-10 bg-white/90 px-2.5 py-1 rounded-lg shadow-sm">
                <img
                  src={activeUnit.logo}
                  alt={activeUnit.name}
                  className="h-5 w-auto max-w-[100px] object-contain"
                />
              </div>
            )}

            <div className="absolute left-3 bottom-4 z-20 flex items-end gap-1.5 pointer-events-none">
              <div
                className="sekai-vertical-text px-2 py-3 rounded-lg text-white font-black text-base tracking-widest shadow-lg border border-white/25"
                style={{ backgroundColor: "rgba(30, 34, 58, 0.88)" }}
              >
                {activeChar.jpName || activeChar.name}
              </div>
              <div className="sekai-vertical-text text-[10px] font-extrabold tracking-[0.2em] text-slate-700 dark:text-white/80 drop-shadow pb-1">
                {activeChar.enName || activeChar.name.toUpperCase()}
              </div>
            </div>

            {activeChar.portrait ? (
              <img
                src={activeChar.portrait}
                alt={activeChar.name}
                className="relative z-10 max-h-[300px] lg:max-h-[640px] w-auto object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.28)]"
              />
            ) : (
              <div className="relative z-10 py-20 text-center text-xs text-muted">
                Chưa có ảnh đứng ({activeChar.name})
              </div>
            )}
          </div>

          {/* CỘT 3: PROFILE (CHUẨN BỐ CỤC GAME, HIỆN FULL CHỮ) + DANH SÁCH SIDE STORY */}
          <div className="flex flex-col gap-4 p-4 md:p-5 overflow-y-auto lg:max-h-[calc(100vh-195px)] sekai-banner-scroll">
            {/* PHẦN TRÊN: THẺ PROFILE NHÂN VẬT */}
            <div className="rounded-2xl bg-[var(--surface)]/90 backdrop-blur-md border-[1.5px] border-[var(--border)] p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className="w-2.5 h-6 rounded-full"
                    style={{ backgroundColor: themeColor }}
                  />
                  <h1 className="text-lg sm:text-xl font-black">
                    {activeChar.name}
                  </h1>
                  {activeChar.jpName && (
                    <span className="text-xs font-semibold text-muted">
                      {activeChar.jpName}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setProfileExpanded((prev) => !prev)}
                  className="px-3 py-1 rounded-full text-[11px] font-bold border border-[var(--border)] bg-[var(--surface-alt)] hover:border-accent transition shrink-0"
                >
                  {profileExpanded ? "Thu gọn hồ sơ ▲" : "Xem hồ sơ ▼"}
                </button>
              </div>

              {profileExpanded && (
                <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1fr] gap-3 items-start">
                  {/* Cột trái: 1 cột dọc rộng rãi, hiện FULL chữ không cắt */}
                  <div className="flex flex-col gap-1.5 text-xs">
                    {profileRows.map((row) => (
                      <div
                        key={row.label}
                        className="grid grid-cols-[78px_1fr] items-start gap-2.5 px-3 py-1.5 rounded-lg bg-[var(--surface-alt)] border border-[var(--border)]/70"
                      >
                        <span className="font-extrabold text-muted border-r border-[var(--border)] pr-2 leading-snug">
                          {row.label}
                        </span>
                        <span className="font-semibold break-words leading-snug">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Cột phải: Sinh nhật + Chiều cao ở trên, khung giới thiệu ở dưới */}
                  <div className="flex flex-col gap-2">
                    {(activeChar.profile?.birthday ||
                      activeChar.profile?.height) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {activeChar.profile?.birthday && (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-alt)] border border-[var(--border)]/70">
                            <span className="font-extrabold text-muted shrink-0">
                              Sinh nhật
                            </span>
                            <span className="text-[var(--border)]">|</span>
                            <span className="font-bold break-words">
                              {activeChar.profile.birthday}
                            </span>
                          </div>
                        )}
                        {activeChar.profile?.height && (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-alt)] border border-[var(--border)]/70">
                            <span className="font-extrabold text-muted shrink-0">
                              Chiều cao
                            </span>
                            <span className="text-[var(--border)]">|</span>
                            <span className="font-bold break-words">
                              {activeChar.profile.height}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {activeChar.profile?.bio && (
                      <div className="rounded-xl bg-[var(--surface-alt)] border border-[var(--border)]/70 p-3.5 text-xs sm:text-[13px] leading-relaxed text-[var(--text)]">
                        {activeChar.profile.bio}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PHẦN DƯỚI: DANH SÁCH SIDE STORY CỦA NHÂN VẬT */}
            <div className="flex-1 rounded-2xl bg-[var(--surface)]/90 backdrop-blur-md border-[1.5px] border-[var(--border)] p-4 shadow-sm flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-extrabold text-white"
                    style={{ backgroundColor: themeColor }}
                  >
                    Side Story của {activeChar.name}
                  </span>
                  <span className="text-xs font-bold text-muted">
                    ({filteredStories.length} thẻ)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={searchCard}
                    onChange={(e) => setSearchCard(e.target.value)}
                    placeholder="Tìm tên thẻ..."
                    className="w-36 sm:w-44 px-3 py-1.5 rounded-full text-xs bg-[var(--surface-alt)] border border-[var(--border)] focus:outline-none focus:border-accent"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                    }
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-[var(--surface-alt)] border border-[var(--border)] hover:border-accent transition"
                  >
                    {sortOrder === "asc" ? "Mặc định ▼" : "Mới nhất ▲"}
                  </button>
                </div>
              </div>

              {/* Dải lọc độ hiếm */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {RARITY_FILTERS.map((rf) => (
                  <button
                    key={rf.id}
                    type="button"
                    onClick={() => setRarityFilter(rf.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition border ${
                      rarityFilter === rf.id
                        ? "bg-accent text-white border-accent"
                        : "bg-[var(--surface-alt)] text-muted border-[var(--border)] hover:border-accent"
                    }`}
                  >
                    {rf.label}
                  </button>
                ))}
              </div>

              {/* Lưới 2 cột các thẻ Side Story */}
              {filteredStories.length === 0 ? (
                <div className="text-center py-10 text-sm text-muted border-[1.5px] border-dashed border-[var(--border)] rounded-xl">
                  Chưa có Side Story nào khớp với bộ lọc này.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredStories.map((card) => {
                    const isBirthday =
                      String(card.rarity).toLowerCase() === "bd";
                    const starCount = isBirthday ? 0 : Number(card.rarity) || 3;

                    return (
                      <div
                        key={card.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--surface-alt)] border-[1.5px] border-[var(--border)] hover:border-accent/70 transition shadow-xs"
                      >
                        <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm bg-slate-200 dark:bg-slate-800">
                          {card.icon ? (
                            <img
                              src={card.icon}
                              alt={card.title}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-muted">
                              CARD
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-black/65 text-[9px] font-black text-amber-300 text-center py-0.5 leading-none">
                            {isBirthday ? "🎂 BD" : "★".repeat(starCount)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col gap-2">
                          <h3 className="text-xs sm:text-[13px] font-extrabold leading-snug break-words">
                            {card.title}
                          </h3>

                          <div className="grid grid-cols-2 gap-2">
                            {card.part1Url ? (
                              <a
                                href={card.part1Url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sekai-ss-btn"
                                title="Mở Phần 1 trong nhóm Facebook (tab mới)"
                              >
                                <span>Phần 1</span>
                                <span className="text-[10px] opacity-75">↗</span>
                              </a>
                            ) : (
                              <span className="sekai-ss-btn sekai-ss-btn--disabled">
                                Phần 1
                              </span>
                            )}

                            {card.part2Url ? (
                              <a
                                href={card.part2Url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sekai-ss-btn"
                                title="Mở Phần 2 trong nhóm Facebook (tab mới)"
                              >
                                <span>Phần 2</span>
                                <span className="text-[10px] opacity-75">↗</span>
                              </a>
                            ) : (
                              <span className="sekai-ss-btn sekai-ss-btn--disabled">
                                Phần 2
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}