import { extractYouTubeId, formatEpisodeTag } from "../../utils/helpers";
import { BookOpenIcon, CheckIcon } from "../common/Icons";

export default function ChapterList({
  eventId,
  chapters = [],
  playingKey,
  watchedChapters = {},
  percent = 0,
  onSelectChapter,
}) {
  return (
    <section className="bg-surface border-[1.5px] border-border rounded-[14px] sekai-shadow overflow-hidden">
      {/* Header kèm Thanh tiến trình */}
      <div className="px-4 py-3 border-b-[1.5px] border-border bg-surface-alt space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="inline-flex items-center gap-2 font-extrabold text-sm">
            <BookOpenIcon className="w-4 h-4 text-accent-text shrink-0" />
            <span>Danh sách Chapter ({chapters.length} tập)</span>
          </h2>
          <span
            className={`text-xs font-extrabold tabular-nums ${
              percent === 100
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-accent-text"
            }`}
          >
            {percent}%
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${percent}%`,
              backgroundColor: percent === 100 ? "#10b981" : "var(--accent)",
            }}
          />
        </div>
      </div>

      {/* Danh sách tập */}
      <div className="p-3 flex flex-col gap-2 max-h-[540px] overflow-y-auto unit-scrollbar">
        {chapters.map((ch, idx) => {
          const key = `${eventId}__ep_${idx}`;
          const isActive = playingKey === key;
          const isWatched = !!watchedChapters[idx];
          const hasLink = !!extractYouTubeId(ch.youtube);

          let itemStyle =
            "border-border bg-surface hover:border-accent hover:translate-x-0.5 motion-safe-lift";
          if (isActive) {
            itemStyle = "border-accent bg-accent-soft";
          } else if (isWatched) {
            itemStyle =
              "border-border/80 bg-surface-alt hover:border-accent/70";
          }

          return (
            <button
              key={key}
              type="button"
              aria-current={isActive ? "true" : undefined}
              onClick={() => onSelectChapter(idx)}
              className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] border-[1.5px] transition ${itemStyle}`}
            >
              <span
                className={`text-xs font-extrabold px-2 py-1 rounded-[7px] min-w-[58px] text-center shrink-0 tabular-nums transition ${
                  isWatched && !isActive
                    ? "bg-accent-soft text-accent-text"
                    : "bg-accent-fill text-accent-ink"
                }`}
              >
                {formatEpisodeTag(ch.ep, idx)}
              </span>

              <span
                className={`flex-1 text-sm font-bold leading-snug transition ${
                  isWatched && !isActive ? "text-muted" : ""
                }`}
              >
                {ch.title}
              </span>

              {isWatched && (
                <span
                  title="Đã xem"
                  className="inline-flex items-center justify-center text-accent-text shrink-0"
                >
                  <CheckIcon className="w-4 h-4" />
                  <span className="sr-only">Đã xem</span>
                </span>
              )}

              {!hasLink && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-400/20 text-muted whitespace-nowrap">
                  Sắp ra mắt
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
