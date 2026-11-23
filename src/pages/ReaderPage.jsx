import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import eventsData from "../data/events.json";
import { UNITS } from "../constants/units";
import { setDynamicAccent, formatEpisodeTag } from "../utils/helpers";
import { useAuth } from "../contexts/AuthContext";
import VideoPlayer from "../components/reader/VideoPlayer";
import ChapterList from "../components/reader/ChapterList";
import GachaCardItem from "../components/reader/GachaCardItem";
import { ArrowLeftIcon, CardStackIcon } from "../components/common/Icons";

export default function ReaderPage() {
  const { eventId } = useParams();
  const { markChapterWatched, getEventProgress } = useAuth();
  const playerRef = useRef(null);

  const event = eventsData.find((ev) => ev.id === eventId);
  const storyLabel =
    event?.type?.toLowerCase() === "main" ? "MAIN STORY" : "EVENT STORY";

  const [playing, setPlaying] = useState(null);
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSummaryExpanded(false);
    if (!event) return;

    const unitInfo = UNITS[event.unit] || UNITS.all;
    setDynamicAccent(unitInfo);

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
      // Mặc định đánh dấu tập đầu tiên đã xem khi mở Story
      markChapterWatched(event.id, 0);
    } else {
      setPlaying(null);
    }
  }, [eventId, event, storyLabel, markChapterWatched]);

  if (!event) {
    return (
      <div className="text-center py-12 px-5 bg-surface border-[1.5px] border-dashed border-border rounded-[14px]">
        <h1 className="text-xl font-extrabold mb-2">Không tìm thấy Event này</h1>
        <p className="text-sm text-muted mb-5">
          Event bạn tìm có thể đã đổi đường dẫn hoặc chưa được cập nhật.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-accent-fill text-accent-ink hover:brightness-110 transition"
        >
          <ArrowLeftIcon />
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const unitInfo = UNITS[event.unit] || UNITS.all;
  const { watchedChapters, percent } = getEventProgress(event);
  const showJpTitle =
    event.jpTitle &&
    event.jpTitle.trim().toLowerCase() !== (event.title || "").trim().toLowerCase();
  const isLongSummary = (event.summary || "").length > 180;

  const scrollToPlayer = () => {
    if (!playerRef.current) return;
    const rect = playerRef.current.getBoundingClientRect();
    if (rect.top < 72 || rect.bottom > window.innerHeight) {
      playerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
    // Nhấn vào tập nào -> mặc định đánh dấu tập đó đã xem
    markChapterWatched(event.id, epIdx);
    scrollToPlayer();
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
    scrollToPlayer();
  };

  const hasPrev = playing?.type === "chapter" && playing.epIndex > 0;
  const hasNext =
    playing?.type === "chapter" && playing.epIndex < event.chapters.length - 1;

  return (
    <>
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold border-[1.5px] border-border bg-surface-alt hover:border-accent hover:text-accent-text transition"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Quay lại danh sách Event
        </Link>
      </div>

      {/* Header Event */}
      <section className="bg-surface border-[1.5px] border-border rounded-[14px] p-4 md:p-5 mb-5 sekai-shadow">
        <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
          {unitInfo.logo ? (
            <div className="bg-slate-100 dark:bg-white/95 px-2.5 py-1 rounded-lg flex items-center">
              <img
                src={unitInfo.logo}
                alt={unitInfo.name}
                className="h-6 w-auto max-w-[120px] object-contain"
              />
            </div>
          ) : (
            <span
              className="px-2.5 py-1 text-xs font-extrabold text-white rounded-md"
              style={{ backgroundColor: unitInfo.fill }}
            >
              {unitInfo.name}
            </span>
          )}

          {event.number && (
            <span className="px-2.5 py-1 text-xs font-bold text-white bg-slate-900/80 rounded-md">
              {event.number}
            </span>
          )}
          {event.date && (
            <span className="text-xs text-muted font-semibold tabular-nums">
              {event.date}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-[26px] font-extrabold tracking-tight leading-snug text-balance mb-1">
          {event.title}
        </h1>
        {showJpTitle && (
          <p className="text-sm text-muted mb-2">{event.jpTitle}</p>
        )}
        {event.summary && (
          <div className="max-w-[540px]">
            <p
              className={`text-sm text-muted leading-relaxed text-pretty ${
                isLongSummary && !summaryExpanded
                  ? "line-clamp-3 sm:line-clamp-none"
                  : ""
              }`}
            >
              {event.summary}
            </p>
            {isLongSummary && (
              <button
                type="button"
                onClick={() => setSummaryExpanded((prev) => !prev)}
                className="sm:hidden mt-1.5 text-xs font-bold text-accent-text hover:underline"
              >
                {summaryExpanded ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </div>
        )}
      </section>

      {/* Layout 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.75fr_1fr] gap-5 items-start">
        <div className="flex flex-col gap-5">
          <div ref={playerRef} className="scroll-mt-20">
            <VideoPlayer
              playing={playing}
              hasPrev={hasPrev}
              hasNext={hasNext}
              onPrev={() => handleSelectChapter(playing.epIndex - 1)}
              onNext={() => handleSelectChapter(playing.epIndex + 1)}
            />
          </div>

          <ChapterList
            eventId={event.id}
            chapters={event.chapters}
            playingKey={playing?.key}
            watchedChapters={watchedChapters}
            percent={percent}
            onSelectChapter={handleSelectChapter}
          />
        </div>

        <aside className="bg-surface border-[1.5px] border-border rounded-[14px] sekai-shadow overflow-hidden">
          <div className="px-4 py-3 border-b-[1.5px] border-border bg-surface-alt flex items-center justify-between gap-2">
            <h2 className="inline-flex items-center gap-2 font-extrabold text-sm">
              <CardStackIcon className="w-4 h-4 text-accent-text shrink-0" />
              Thẻ Event & Side Story
            </h2>
            <span className="text-xs text-muted font-semibold tabular-nums">
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
