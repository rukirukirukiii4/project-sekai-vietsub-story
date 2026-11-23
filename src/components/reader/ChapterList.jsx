import { extractYouTubeId, formatEpisodeTag } from "../../utils/helpers";

export default function ChapterList({
  eventId,
  chapters = [],
  playingKey,
  watchedMap,
  onSelectChapter,
}) {
  const watchedCount = chapters.filter(
    (_, idx) => watchedMap[`${eventId}__ep_${idx}`]
  ).length;

  return (
    <section className="bg-surface border-[1.5px] border-border rounded-[14px] sekai-shadow overflow-hidden">
      <div className="px-4 py-3 border-b-[1.5px] border-border bg-surface-alt flex items-center justify-between font-extrabold text-sm">
        <span>📖 Danh sách Chapter ({chapters.length} tập)</span>
        <span className="text-xs text-muted font-semibold">
          {watchedCount}/{chapters.length} đã xem
        </span>
      </div>

      <div className="p-3 flex flex-col gap-2">
        {chapters.map((ch, idx) => {
          const key = `${eventId}__ep_${idx}`;
          const isActive = playingKey === key;
          const isDone = !!watchedMap[key];
          const hasLink = !!extractYouTubeId(ch.youtube);

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectChapter(idx)}
              className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] border-[1.5px] transition ${
                isActive
                  ? "border-accent bg-accent-soft"
                  : "border-border bg-surface-alt hover:border-accent hover:translate-x-0.5"
              }`}
            >
              <span className="text-xs font-extrabold px-2 py-1 rounded-[7px] bg-accent text-white min-w-[56px] text-center shrink-0">
                {formatEpisodeTag(ch.ep, idx)}
              </span>

              <span className="flex-1 text-sm font-bold">{ch.title}</span>

              {isDone ? (
                <span className="text-[11.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 whitespace-nowrap">
                  ✓ Đã xem
                </span>
              ) : (
                !hasLink && (
                  <span className="text-[11.5px] font-bold px-2 py-0.5 rounded-full bg-slate-400/20 text-muted whitespace-nowrap">
                    Sắp ra mắt
                  </span>
                )
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}