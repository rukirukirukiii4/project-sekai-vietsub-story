import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import eventsData from "../data/events.json";
import { UNITS } from "../constants/units";
import { setDynamicAccent } from "../utils/helpers";
import { useAuth } from "../contexts/AuthContext";

const EVENT_ROUTE_PREFIX = "/event";

const STORY_FILTERS = [
  { id: "all", label: "Tất cả truyện" },
  { id: "key", label: "✦ Key Story" },
  { id: "main", label: "Main Story" },
  { id: "event", label: "Event Story" },
  { id: "mixed", label: "Mixed Event" },
  { id: "unread", label: "Chưa đọc xong" },
];

function getStoryBadge(ev, unitColor) {
  const type = (ev.type || "").toLowerCase();
  if (type === "main") {
    return { text: "Main Story", bg: unitColor || "#00ccbb", icon: "★" };
  }
  if (ev.keyStory || type === "key") {
    return { text: "Key Story", bg: unitColor || "#884499", icon: "✦" };
  }
  if (ev.unit === "mixed" || type === "mixed") {
    return { text: "Mixed Event", bg: "#f59e0b", icon: "❖" };
  }
  if (type === "compilation") {
    return { text: "Tổng hợp", bg: "#ec4899", icon: "◈" };
  }
  return { text: "Event Story", bg: "#475569", icon: "♪" };
}

export default function HomePage({ selectedUnit, onUnitChange }) {
  const navigate = useNavigate();
  const { getEventProgress } = useAuth();

  const [search, setSearch] = useState("");
  const [storyFilter, setStoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [activeId, setActiveId] = useState(eventsData[0]?.id || null);

  const [unitDrawerOpen, setUnitDrawerOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const overallStats = useMemo(() => {
    let totalChapters = 0;
    let watchedTotal = 0;

    eventsData.forEach((ev) => {
      const chCount = ev.chapters?.length || 0;
      totalChapters += chCount;
      const prog = getEventProgress?.(ev);
      if (prog) {
        if (Array.isArray(prog.watchedChapters)) {
          watchedTotal += prog.watchedChapters.length;
        } else if (typeof prog.percent === "number") {
          watchedTotal += Math.round((prog.percent / 100) * chCount);
        }
      }
    });

    const percent =
      totalChapters > 0
        ? ((watchedTotal / totalChapters) * 100).toFixed(1)
        : "0.0";
    return { percent, watchedTotal, totalChapters };
  }, [getEventProgress]);

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();

    const list = eventsData.filter((ev) => {
      const matchUnit = selectedUnit === "all" || ev.unit === selectedUnit;
      const matchSearch =
        !q ||
        (ev.title || "").toLowerCase().includes(q) ||
        (ev.jpTitle || "").toLowerCase().includes(q) ||
        (ev.number || "").toLowerCase().includes(q);

      const type = (ev.type || "").toLowerCase();
      const prog = getEventProgress?.(ev) || { percent: 0 };

      let matchStoryType = true;
      if (storyFilter === "key") {
        matchStoryType = Boolean(ev.keyStory) || type === "key";
      } else if (storyFilter === "main") {
        matchStoryType = type === "main";
      } else if (storyFilter === "mixed") {
        matchStoryType = ev.unit === "mixed" || type === "mixed";
      } else if (storyFilter === "event") {
        matchStoryType = type === "event";
      } else if (storyFilter === "unread") {
        matchStoryType = prog.percent < 100;
      }

      return matchUnit && matchSearch && matchStoryType;
    });

    return sortOrder === "desc" ? [...list].reverse() : list;
  }, [selectedUnit, search, storyFilter, sortOrder, getEventProgress]);

  const activeEvent = useMemo(() => {
    return (
      filteredEvents.find((ev) => ev.id === activeId) ||
      filteredEvents[0] ||
      null
    );
  }, [filteredEvents, activeId]);

  useEffect(() => {
    if (activeEvent && activeEvent.id !== activeId) {
      setActiveId(activeEvent.id);
    }
  }, [activeEvent, activeId]);

  useEffect(() => {
    const unitKey =
      selectedUnit !== "all" ? selectedUnit : activeEvent?.unit || "all";
    setDynamicAccent((UNITS[unitKey] || UNITS.all).color);
  }, [selectedUnit, activeEvent]);

  const activeUnitInfo = activeEvent
    ? UNITS[activeEvent.unit] || UNITS.all
    : UNITS[selectedUnit] || UNITS.all;

  const activeProgress = activeEvent
    ? getEventProgress?.(activeEvent) || { watchedChapters: [], percent: 0 }
    : { watchedChapters: [], percent: 0 };

  const activeBadge = activeEvent
    ? getStoryBadge(activeEvent, activeUnitInfo.color)
    : null;

  const currentUnitMeta = UNITS[selectedUnit] || UNITS.all;

  const handleOpenReader = (ev) => {
    if (!ev) return;
    navigate(`${EVENT_ROUTE_PREFIX}/${ev.id}`);
  };

  return (
    <section className="sekai-stage flex flex-col select-none">
      {/* 1. THANH CÔNG CỤ TRÊN CÙNG (TÁCH RIÊNG, KHÔNG CHE ẢNH NỀN) */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-2.5 px-3.5 md:px-5 py-3 bg-[var(--surface)] border-b-[1.5px] border-[var(--border)]">
        {/* Ô tìm kiếm */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên event (tiếng Việt hoặc tiếng Nhật)..."
            className="w-full pl-10 pr-8 py-2 rounded-full text-[13px] font-medium bg-[var(--surface-alt)] border-[1.5px] border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-accent transition"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-[var(--text)]"
              aria-label="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Cụm HUD phải */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tỉ lệ hoàn thành */}
          <div
            className="px-3.5 py-1.5 rounded-xl text-white flex items-center gap-2.5 border border-white/15 shadow-sm"
            style={{ backgroundColor: "var(--stage-hud-bg)" }}
            title={`Đã đọc ${overallStats.watchedTotal}/${overallStats.totalChapters} tập`}
          >
            <div className="leading-tight">
              <div className="text-[10px] text-white/75 font-semibold tracking-wide">
                Tỉ lệ hoàn thành
              </div>
              <div className="text-base font-black tracking-tight tabular-nums">
                {overallStats.percent}%
              </div>
            </div>
            <div className="h-7 w-[1px] bg-white/15 hidden sm:block" />
            <div className="hidden sm:block text-[11px] text-white/80 font-semibold leading-tight">
              <div>{filteredEvents.length} truyện</div>
              <div className="text-[10px] text-teal-300">
                {overallStats.watchedTotal}/{overallStats.totalChapters} tập
              </div>
            </div>
          </div>

          {/* Nút phễu lọc loại truyện */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterMenuOpen((prev) => !prev)}
              className={`h-10 px-3.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-sm transition border-[1.5px] ${
                storyFilter !== "all"
                  ? "bg-accent text-white border-accent"
                  : "bg-[var(--surface-alt)] text-[var(--text)] border-[var(--border)] hover:border-accent"
              }`}
              title="Lọc loại truyện (Key Story, Main Story...)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 .78 1.62L14 13.8V19a1 1 0 0 1-1.45.89l-2-1A1 1 0 0 1 10 18v-4.2L3.22 5.62A1 1 0 0 1 3 5z" />
              </svg>
              <span className="hidden sm:inline">
                {STORY_FILTERS.find((f) => f.id === storyFilter)?.label}
              </span>
            </button>

            {filterMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setFilterMenuOpen(false)}
                />
                <div className="sekai-glass absolute right-0 mt-2 w-48 rounded-2xl p-1.5 shadow-xl z-40">
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-muted uppercase tracking-wider">
                    Loại truyện
                  </div>
                  {STORY_FILTERS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setStoryFilter(f.id);
                        setFilterMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                        storyFilter === f.id
                          ? "bg-accent text-white"
                          : "text-[var(--text)] hover:bg-black/5 dark:hover:bg-white/10"
                      }`}
                    >
                      <span>{f.label}</span>
                      {storyFilter === f.id && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Nút đổi thứ tự */}
          <button
            type="button"
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="h-10 px-3.5 rounded-full text-xs font-bold text-white border border-white/20 flex items-center gap-1.5 hover:brightness-110 transition shadow-sm"
            style={{ backgroundColor: "var(--stage-hud-bg)" }}
          >
            <span>{sortOrder === "asc" ? "Thứ tự phát hành" : "Mới nhất"}</span>
            <span className="w-5 h-5 rounded-full bg-white text-slate-800 inline-flex items-center justify-center text-[10px]">
              {sortOrder === "asc" ? "▼" : "▲"}
            </span>
          </button>
        </div>
      </div>

      {/* 2. THÂN CHÍNH CHIA 2 CỘT TÁCH BIỆT: TRÁI = BANNER | PHẢI = BACKGROUND 16:9 */}
      {filteredEvents.length === 0 ? (
        <div className="py-16 px-6 flex items-center justify-center bg-[var(--surface-alt)]">
          <div className="rounded-2xl p-8 text-center max-w-sm bg-[var(--surface)] border-[1.5px] border-dashed border-[var(--border)]">
            <p className="font-bold text-base mb-1">
              Không tìm thấy truyện phù hợp
            </p>
            <p className="text-xs text-muted mb-4">
              Thử đổi từ khóa, chọn lại nhóm nhạc hoặc đặt lại bộ lọc nhé.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStoryFilter("all");
                onUnitChange("all");
              }}
              className="px-4 py-2 rounded-full text-xs font-bold bg-accent text-white"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] items-stretch">
          {/* CỘT TRÁI ĐỘC LẬP: NÚT LỌC NHÓM + DANH SÁCH BANNER 5:2 */}
          <div className="relative order-2 lg:order-1 bg-[var(--surface-alt)] lg:border-r-[1.5px] border-t-[1.5px] lg:border-t-0 border-[var(--border)]">
            {/* Tab trượt chọn nhóm ở mép trái */}
            <button
              type="button"
              onClick={() => setUnitDrawerOpen(true)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 py-3.5 px-2 rounded-r-2xl text-white border border-l-0 border-white/20 shadow-lg flex flex-col items-center gap-1 hover:pl-3 transition-all"
              style={{ backgroundColor: "var(--stage-drawer-tab)" }}
              title="Lọc theo nhóm nhạc"
            >
              <span className="text-base font-black leading-none">›</span>
              <span className="text-[10px] font-extrabold tracking-tight">
                Nhóm
              </span>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full max-w-[54px] truncate"
                style={{
                  backgroundColor: currentUnitMeta.color || "#00ccbb",
                }}
              >
                {selectedUnit === "all"
                  ? "Tất cả"
                  : currentUnitMeta.shortName || currentUnitMeta.name}
              </span>
            </button>

            {/* Danh sách cuộn khớp đúng chiều cao khung ảnh 16:9 bên phải */}
            <div className="lg:absolute lg:inset-0 max-h-[420px] lg:max-h-none overflow-y-auto sekai-banner-scroll flex flex-col gap-3.5 pl-14 pr-6 py-4">
              {filteredEvents.map((ev) => {
                const isSelected = activeEvent?.id === ev.id;
                const uInfo = UNITS[ev.unit] || UNITS.all;
                const badge = getStoryBadge(ev, uInfo.color);
                const prog = getEventProgress?.(ev) || { percent: 0 };
                const isDone = prog.percent >= 100;

                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setActiveId(ev.id)}
                    onDoubleClick={() => handleOpenReader(ev)}
                    className={`group relative w-full text-left rounded-xl overflow-visible transition-all duration-200 shrink-0 ${
                      isSelected
                        ? "translate-x-2 scale-[1.02] z-10"
                        : "opacity-85 hover:opacity-100 hover:translate-x-1"
                    }`}
                  >
                    {/* Khung banner chuẩn tỉ lệ 5:2 (1000x400 px) */}
                    <div
                      className={`relative w-full aspect-[5/2] rounded-xl overflow-hidden border-2 transition-all ${
                        isSelected
                          ? "border-accent shadow-[0_6px_20px_var(--accent-muted)]"
                          : "border-[var(--border)] group-hover:border-accent/60"
                      }`}
                    >
                      <img
                        src={ev.banner}
                        alt={ev.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                      {/* Ruy-băng loại truyện góc trên trái */}
                      <div
                        className="sekai-ribbon absolute top-0 left-0 pl-2.5 pr-4 py-0.5 text-[10px] font-extrabold text-white tracking-wide shadow flex items-center gap-1"
                        style={{ backgroundColor: badge.bg }}
                      >
                        <span>{badge.icon}</span>
                        <span>{badge.text}</span>
                      </div>

                      {/* Tiêu đề + thanh tiến độ mỏng dưới đáy */}
                      <div className="absolute inset-x-0 bottom-0 px-2.5 pb-1.5 pt-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[12px] font-extrabold text-white drop-shadow line-clamp-1">
                            {ev.title}
                          </span>
                          <span className="text-[10px] font-bold text-teal-200 shrink-0">
                            {prog.percent}%
                          </span>
                        </div>
                        <div className="mt-1 h-1 w-full rounded-full bg-white/25 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${prog.percent}%`,
                              backgroundColor: isDone
                                ? "#4ade80"
                                : uInfo.color || "#5ce6d6",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Huy hiệu ! / ✓ góc trên phải */}
                    <span
                      className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-[11px] font-black text-white flex items-center justify-center shadow-md border border-white/90 ${
                        isDone ? "bg-emerald-500" : "bg-[#ff5588]"
                      }`}
                      title={isDone ? "Đã đọc hoàn thành" : "Còn tập chưa đọc"}
                    >
                      {isDone ? "✓" : "!"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CỘT PHẢI ĐỘC LẬP: KHUNG BACKGROUND 16:9 (1920x1080 px) KHÔNG BỊ BANNER CHE */}
          {activeEvent && (
            <div className="relative order-1 lg:order-2 w-full aspect-[16/9] min-h-[300px] lg:min-h-[460px] overflow-hidden bg-slate-900 flex flex-col justify-end p-5 md:p-7">
              {/* Ảnh nền riêng (bgImage), tự fallback sang banner nếu chưa thêm bgImage */}
              <div
                key={activeEvent.id}
                className="sekai-stage-bg"
                style={{
                  backgroundImage: `url("${activeEvent.bgImage || activeEvent.banner}")`,
                }}
              />
              <div className="sekai-showcase-scrim" />

              {/* Cụm Logo Event + tiêu đề + nút hành động ở góc dưới phải */}
              <div
                key={`info-${activeEvent.id}`}
                className="relative z-10 flex flex-col items-end text-right gap-2.5 sekai-fade-up"
              >
                <div className="w-full max-w-xl flex flex-col items-end">
                  {/* Dải nhãn Unit + Loại truyện + Năm */}
                  <div className="flex items-center justify-end gap-2 flex-wrap mb-2">
                    {activeUnitInfo.logo ? (
                      <span className="bg-white/95 px-2.5 py-1 rounded-lg inline-flex items-center shadow">
                        <img
                          src={activeUnitInfo.logo}
                          alt={activeUnitInfo.name}
                          className="h-5 w-auto max-w-[110px] object-contain"
                        />
                      </span>
                    ) : (
                      <span
                        className="px-2.5 py-1 rounded-md text-[11px] font-extrabold text-white shadow"
                        style={{ backgroundColor: activeUnitInfo.color }}
                      >
                        {activeEvent.unit === "mixed"
                          ? "Mixed Event"
                          : activeUnitInfo.name}
                      </span>
                    )}

                    {activeBadge && (
                      <span
                        className="px-2.5 py-1 rounded-md text-[11px] font-extrabold text-white shadow"
                        style={{ backgroundColor: activeBadge.bg }}
                      >
                        {activeBadge.icon} {activeBadge.text}
                      </span>
                    )}

                    {activeEvent.date && (
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold text-white/90 bg-black/55 backdrop-blur-sm">
                        {activeEvent.date}
                      </span>
                    )}
                  </div>

                  {/* Có ảnh logo -> hiện Logo Event chuẩn game; chưa có -> hiện chữ tiêu đề */}
                  {activeEvent.logo ? (
                    <>
                      <img
                        src={activeEvent.logo}
                        alt={activeEvent.title}
                        className="sekai-event-logo max-h-[88px] sm:max-h-[115px] lg:max-h-[135px] max-w-[260px] sm:max-w-[360px] lg:max-w-[420px] w-auto object-contain object-right"
                      />
                      <p className="mt-1.5 text-sm sm:text-base font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                        {activeEvent.title}
                      </p>
                    </>
                  ) : (
                    <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.8)] leading-tight">
                      {activeEvent.title}
                    </h1>
                  )}

                  {/* Luôn hiện tên tiếng Nhật ở dưới */}
                  {activeEvent.jpTitle && (
                    <p className="text-xs sm:text-sm font-semibold text-white/85 drop-shadow mt-0.5">
                      {activeEvent.jpTitle}
                    </p>
                  )}

                  {/* Thông số tập / thẻ / tiến độ */}
                  <div className="mt-1.5 flex items-center justify-end gap-2.5 text-xs font-bold text-white/90 drop-shadow">
                    <span>📖 {activeEvent.chapters?.length || 0} tập</span>
                    <span>•</span>
                    <span>🃏 {activeEvent.cards?.length || 0} thẻ</span>
                    <span>•</span>
                    <span className="text-teal-300">
                      Tiến độ: {activeProgress.percent}%
                    </span>
                  </div>
                </div>

                {/* Nút (i) và Đọc ngay */}
                <div className="flex items-center gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setInfoModalOpen(true)}
                    className="w-11 h-11 rounded-full bg-white/95 text-slate-800 font-black text-lg shadow-lg hover:scale-105 active:scale-95 transition flex items-center justify-center border-2 border-white"
                    title="Xem tóm tắt và danh sách thẻ"
                    aria-label="Thông tin truyện"
                  >
                    i
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenReader(activeEvent)}
                    className="sekai-confirm-btn h-11 sm:h-12 px-8 sm:px-14 rounded-full font-black text-sm sm:text-base tracking-wide flex items-center gap-2"
                  >
                    <span>Đọc ngay</span>
                    <span className="text-lg leading-none">›</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. NGĂN KÉO CHỌN NHÓM NHẠC */}
      {unitDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setUnitDrawerOpen(false)}
          />
          <aside className="relative z-10 w-[290px] max-w-[85vw] h-full bg-[var(--surface)] border-r border-[var(--border)] p-4 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]">
              <div>
                <h2 className="font-extrabold text-base">Chọn nhóm nhạc</h2>
                <p className="text-xs text-muted">Lọc truyện theo Unit</p>
              </div>
              <button
                type="button"
                onClick={() => setUnitDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--surface-alt)] border border-[var(--border)] flex items-center justify-center font-bold hover:border-accent"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto unit-scrollbar pr-1">
              {Object.entries(UNITS).map(([key, unit]) => {
                const isSelected = selectedUnit === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onUnitChange(key);
                      setUnitDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-[1.5px] transition text-left ${
                      isSelected
                        ? "border-accent bg-[var(--accent-soft)] shadow-sm"
                        : "border-[var(--border)] bg-[var(--surface-alt)] hover:border-accent/60"
                    }`}
                  >
                    <span
                      className="w-3 h-8 rounded-full shrink-0"
                      style={{ backgroundColor: unit.color }}
                    />
                    <div className="flex-1 min-w-0">
                      {unit.logo ? (
                        <div className="inline-flex bg-white/95 px-2 py-1 rounded-md">
                          <img
                            src={unit.logo}
                            alt={unit.name}
                            className="h-5 w-auto max-w-[130px] object-contain"
                          />
                        </div>
                      ) : (
                        <span className="font-extrabold text-sm">
                          {unit.name}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <span className="text-xs font-black text-accent">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {/* 4. MODAL XEM NHANH TÓM TẮT & THẺ EVENT */}
      {infoModalOpen && activeEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setInfoModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl overflow-hidden sekai-fade-up">
            <div className="relative h-44">
              <img
                src={activeEvent.bgImage || activeEvent.banner}
                alt={activeEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <button
                type="button"
                onClick={() => setInfoModalOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white font-bold flex items-center justify-center hover:bg-black/80"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <div className="text-[11px] font-bold text-teal-300 mb-0.5">
                  {activeEvent.number}{" "}
                  {activeEvent.date ? `• ${activeEvent.date}` : ""}
                </div>
                <h3 className="font-black text-lg leading-snug">
                  {activeEvent.title}
                </h3>
                {activeEvent.jpTitle && (
                  <p className="text-xs text-white/80 font-medium mt-0.5">
                    {activeEvent.jpTitle}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto unit-scrollbar">
              {activeEvent.summary && (
                <div className="mb-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">
                    Tóm tắt nội dung
                  </h4>
                  <p className="text-sm leading-relaxed text-[var(--text)]">
                    {activeEvent.summary}
                  </p>
                </div>
              )}

              {activeEvent.cards && activeEvent.cards.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted mb-2">
                    Thẻ xuất hiện ({activeEvent.cards.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {activeEvent.cards.map((card, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] text-xs"
                      >
                        <div className="font-bold truncate">
                          {card.character}
                        </div>
                        <div className="text-[11px] text-muted truncate">
                          {"★".repeat(card.rarity || 3)} {card.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setInfoModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold border border-[var(--border)] bg-[var(--surface-alt)]"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInfoModalOpen(false);
                    handleOpenReader(activeEvent);
                  }}
                  className="sekai-confirm-btn px-6 py-2 rounded-full text-xs font-black"
                >
                  Đọc ngay ›
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}