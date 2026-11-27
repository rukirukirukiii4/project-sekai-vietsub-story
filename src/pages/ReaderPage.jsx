import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import eventsData from "../data/events.json";
import { useData } from "../contexts/DataContext";
import { UNITS } from "../constants/units";
import {
  setDynamicAccent,
  formatEpisodeTag,
  resolveImageUrl,
} from "../utils/helpers";
import { useAuth } from "../contexts/AuthContext";
import VideoPlayer from "../components/reader/VideoPlayer";
import ChapterList from "../components/reader/ChapterList";
import GachaCardItem from "../components/reader/GachaCardItem";

export default function ReaderPage() {
  const { events: eventsData, dataLoading } = useData();
  const event = eventsData.find((ev) => ev.id === eventId);
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { markChapterWatched, getEventProgress } = useAuth();

  const storyLabel =
    event?.type?.toLowerCase() === "main"
      ? "MAIN STORY"
      : event?.keyStory || event?.type?.toLowerCase() === "key"
      ? "KEY STORY"
      : "EVENT STORY";

  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!event) return;

    const unitInfo = UNITS[event.unit] || UNITS.all;
    setDynamicAccent(unitInfo.color);

    if (event.chapters && event.chapters.length > 0) {
      const ch = event.chapters[0];
      setPlaying({
        key: `${event.id}__ep_0`,
        type: "chapter",
        badge: `${storyLabel} • ${formatEpisodeTag(ch.ep, 0)}`,
        title: ch.title,
        youtube: ch.youtube,
        epIndex: 0,
      });
      markChapterWatched(event.id, 0);
    } else {
      setPlaying(null);
    }
  }, [eventId, event, storyLabel, markChapterWatched]);

  if (dataLoading && !event) {
    return (
      <div className="py-16 text-center text-sm font-bold text-muted">
        ⏳ Đang tải dữ liệu Story...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12 px-5 bg-surface border-[1.5px] border-dashed border-border rounded-[14px]">
        <p className="text-muted mb-4">Không tìm thấy Event này.</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-full text-sm font-semibold bg-accent text-white"
        >
          ← Quay lại trang chủ
        </button>
      </div>
    );
  }

  const unitInfo = UNITS[event.unit] || UNITS.all;
  const { watchedChapters, percent } = getEventProgress(event);

  const handleSelectChapter = (epIdx) => {
    const ch = event.chapters[epIdx];
    if (!ch) return;
    setPlaying({
      key: `${event.id}__ep_${epIdx}`,
      type: "chapter",
      badge: `${storyLabel} • ${formatEpisodeTag(ch.ep, epIdx)}`,
      title: ch.title,
      youtube: ch.youtube,
      epIndex: epIdx,
    });
    markChapterWatched(event.id, epIdx);

    if (window.innerWidth < 920) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectSideStory = (cardIdx, part) => {
    const card = event.cards[cardIdx];
    if (!card) return;
    setPlaying({
      key: `${event.id}__card_${cardIdx}_ss${part}`,
      type: "side",
      badge: `SIDE STORY ${part} • ${card.character}`,
      title: `${card.title} (Phần ${part})`,
      youtube: part === 1 ? card.sideStory1 : card.sideStory2,
      epIndex: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasPrev = playing?.type === "chapter" && playing.epIndex > 0;
  const hasNext =
    playing?.type === "chapter" && playing.epIndex < event.chapters.length - 1;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold border-[1.5px] border-border bg-surface hover:border-accent hover:text-accent transition sekai-shadow"
        >
          <span className="w-5 h-5 rounded-full bg-[var(--accent-soft)] text-accent inline-flex items-center justify-center text-xs">
            ←
          </span>
          <span>Quay lại chọn truyện</span>
        </button>

        <div className="px-3.5 py-1.5 rounded-full bg-surface border-[1.5px] border-border text-xs font-extrabold flex items-center gap-2">
          <span className="text-muted">Tiến độ:</span>
          <span className="text-accent">{percent}%</span>
        </div>
      </div>

      {/* Header Event phong cách Sekai có nền banner mờ */}
      <section className="relative overflow-hidden bg-surface border-[1.5px] border-border border-l-[6px] border-l-accent rounded-[16px] p-4 md:p-6 mb-5 sekai-shadow">
        {(event.bgImage || event.banner) && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-25 pointer-events-none"
              style={{
                backgroundImage: `url("${resolveImageUrl(
                  event.bgImage || event.banner
                )}")`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)]/90 to-[var(--surface)]/55 pointer-events-none" />
          </>
        )}

        <div className="relative z-10">
          <div className="flex items-center gap-2 flex-wrap mb-2.5">
            {unitInfo.logo ? (
              <div className="bg-slate-100 dark:bg-white/95 px-2.5 py-1 rounded-lg flex items-center shadow-xs">
                <img
                  src={resolveImageUrl(unitInfo.logo)}
                  alt={unitInfo.name}
                  className="h-6 w-auto max-w-[120px] object-contain"
                />
              </div>
            ) : (
              <span
                className="px-2.5 py-1 text-[11px] font-extrabold text-white rounded-md"
                style={{ backgroundColor: unitInfo.color }}
              >
                {event.unit === "mixed" ? "Mixed Event" : unitInfo.name}
              </span>
            )}

            {/* Ruy-băng loại truyện (Main Story / Key Story / Event Story) */}
            <span
              className="sekai-ribbon pl-2.5 pr-4 py-1 text-[11px] font-extrabold text-white"
              style={{
                backgroundColor:
                  event.keyStory || event.type === "main"
                    ? unitInfo.color
                    : "#475569",
              }}
            >
              {event.type?.toLowerCase() === "main"
                ? "★ MAIN STORY"
                : event.keyStory
                ? "✦ KEY STORY"
                : storyLabel}
            </span>

            {event.number && (
              <span className="px-2.5 py-1 text-[11px] font-bold text-white bg-slate-900/75 rounded-md">
                {event.number}
              </span>
            )}
            {event.date && (
              <span className="text-xs text-muted font-semibold">
                {event.date}
              </span>
            )}
          </div>

          <h1 className="text-[22px] md:text-[26px] font-black mb-1">
            {event.title}
          </h1>
          {event.jpTitle && (
            <p className="text-[13px] text-muted font-medium mb-2">
              {event.jpTitle}
            </p>
          )}
          {event.summary && (
            <p className="text-sm text-muted leading-relaxed max-w-4xl">
              {event.summary}
            </p>
          )}
        </div>
      </section>

      {/* Layout 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.75fr_1fr] gap-5 items-start">
        <div className="flex flex-col gap-5">
          <VideoPlayer
            playing={playing}
            hasPrev={hasPrev}
            hasNext={hasNext}
            onPrev={() => handleSelectChapter(playing.epIndex - 1)}
            onNext={() => handleSelectChapter(playing.epIndex + 1)}
          />

          <ChapterList
            eventId={event.id}
            chapters={event.chapters}
            playingKey={playing?.key}
            watchedChapters={watchedChapters}
            percent={percent}
            onSelectChapter={handleSelectChapter}
          />
        </div>

        <aside className="bg-surface border-[1.5px] border-border rounded-[16px] sekai-shadow overflow-hidden">
          <div className="px-4 py-3 border-b-[1.5px] border-border bg-surface-alt flex items-center justify-between font-extrabold text-sm">
            <span>🃏 Thẻ Event & Side Story</span>
            <span className="text-xs text-muted font-semibold">
              {event.cards?.length || 0} thẻ
            </span>
          </div>

          <div className="p-3 flex flex-col gap-3.5">
            {!event.cards || event.cards.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted">
                Chưa có thông tin thẻ cho event này.
              </div>
            ) : (
              event.cards.map((card, idx) => (
                <GachaCardItem
                  key={`${event.id}_card_${idx}`}
                  eventId={event.id}
                  card={card}
                  cardIndex={idx}
                  playingKey={playing?.key}
                  onSelectSideStory={handleSelectSideStory}
                />
              ))
            )}
          </div>
        </aside>
      </div>
    </>
  );
}