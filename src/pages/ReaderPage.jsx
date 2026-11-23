import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import eventsData from "../data/events.json";
import { UNITS } from "../constants/units";
import { setDynamicAccent, formatEpisodeTag } from "../utils/helpers";
import VideoPlayer from "../components/reader/VideoPlayer";
import ChapterList from "../components/reader/ChapterList";
import GachaCardItem from "../components/reader/GachaCardItem";

export default function ReaderPage({ watchedMap, onToggleWatched }) {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const event = eventsData.find((ev) => ev.id === eventId);
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
        badge: `MAIN STORY • ${formatEpisodeTag(ch.ep, 0)}`,
        title: ch.title,
        youtube: ch.youtube,
        epIndex: 0,
      });
    } else {
      setPlaying(null);
    }
  }, [eventId, event]);

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

  const handleSelectChapter = (epIdx) => {
    const ch = event.chapters[epIdx];
    if (!ch) return;
    setPlaying({
      key: `${event.id}__ep_${epIdx}`,
      type: "chapter",
      badge: `MAIN STORY • ${formatEpisodeTag(ch.ep, epIdx)}`,
      title: ch.title,
      youtube: ch.youtube,
      epIndex: epIdx,
    });
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
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold border-[1.5px] border-border bg-surface-alt hover:border-accent hover:text-accent transition"
        >
          ← Quay lại danh sách Event
        </button>
      </div>

      {/* Header Event */}
      <section className="bg-surface border-[1.5px] border-border border-l-[6px] border-l-accent rounded-[14px] p-4 md:p-5 mb-5 sekai-shadow">
        <div className="flex items-center gap-2.5 flex-wrap mb-2">
          {unitInfo.logo ? (
            <div className="bg-slate-100 dark:bg-white/90 px-2.5 py-1 rounded-lg flex items-center">
              <img
                src={unitInfo.logo}
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

          {event.number && (
            <span className="px-2.5 py-1 text-[11px] font-bold text-white bg-slate-900/70 rounded-md">
              {event.number}
            </span>
          )}
          {event.date && (
            <span className="text-xs text-muted font-semibold">{event.date}</span>
          )}
        </div>
        <h1 className="text-[22px] font-extrabold mb-1">{event.title}</h1>
        {event.jpTitle && (
          <p className="text-[13px] text-muted mb-1.5">{event.jpTitle}</p>
        )}
        {event.summary && (
          <p className="text-sm text-muted leading-relaxed">{event.summary}</p>
        )}
      </section>

      {/* Layout 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.75fr_1fr] gap-5 items-start">
        <div className="flex flex-col gap-5">
          <VideoPlayer
            playing={playing}
            isWatched={playing ? !!watchedMap[playing.key] : false}
            onToggleWatched={() => playing && onToggleWatched(playing.key)}
            hasPrev={hasPrev}
            hasNext={hasNext}
            onPrev={() => handleSelectChapter(playing.epIndex - 1)}
            onNext={() => handleSelectChapter(playing.epIndex + 1)}
          />

          <ChapterList
            eventId={event.id}
            chapters={event.chapters}
            playingKey={playing?.key}
            watchedMap={watchedMap}
            onSelectChapter={handleSelectChapter}
          />
        </div>

        <aside className="bg-surface border-[1.5px] border-border rounded-[14px] sekai-shadow overflow-hidden">
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