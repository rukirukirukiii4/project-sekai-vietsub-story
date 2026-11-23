import { extractYouTubeId, formatEpisodeTag } from "../../utils/helpers";

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
        <div className="flex items-center justify-between font-extrabold text-sm">
          <span>📖 Danh sách Chapter ({chapters.length} tập)</span>
          <span
            className={`text-xs font-extrabold ${
              percent === 100 ? "text-emerald-500" : "text-accent"
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
      <div className="p-3 flex flex-col gap-2">
        {chapters.map((ch, idx) => {
          const key = `${eventId}__ep_${idx}`;
          const isActive = playingKey === key;
          const isWatched = !!watchedChapters[idx];
          const hasLink = !!extractYouTubeId(ch.youtube);

          let itemStyle =
            "border-border bg-surface hover:border-accent hover:translate-x-0.5"; // Chưa xem
          if (isActive) {
            itemStyle = "border-accent bg-accent-soft opacity-100"; // Đang phát
          } else if (isWatched) {
            itemStyle =
              "border-border/60 bg-slate-200/50 dark:bg-slate-800/35 opacity-55 hover:opacity-90"; // Đã xem (nền nhạt đi)
          }

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectChapter(idx)}
              className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] border-[1.5px] transition ${itemStyle}`}
            >
              <span
                className={`text-xs font-extrabold px-2 py-1 rounded-[7px] text-white min-w-[56px] text-center shrink-0 transition ${
                  isWatched && !isActive ? "bg-accent/60" : "bg-accent"
                }`}
              >
                {formatEpisodeTag(ch.ep, idx)}
              </span>

              <span className="flex-1 text-sm font-bold">{ch.title}</span>

              {!hasLink && (
                <span className="text-[11.5px] font-bold px-2 py-0.5 rounded-full bg-slate-400/20 text-muted whitespace-nowrap">
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