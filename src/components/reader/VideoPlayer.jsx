import { extractYouTubeId } from "../../utils/helpers";

export default function VideoPlayer({
  playing,
  isWatched,
  onToggleWatched,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}) {
  const videoId = playing ? extractYouTubeId(playing.youtube) : null;

  return (
    <section className="bg-surface border-[1.5px] border-border rounded-[14px] sekai-shadow overflow-hidden">
      <div className="relative w-full aspect-video bg-slate-900 grid place-items-center">
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            title={playing?.title || "YouTube Video"}
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <div className="text-center text-slate-300 p-6 max-w-md">
            <strong className="block text-base text-white mb-1.5">
              Video đang được cập nhật.
            </strong>
          </div>
        )}
      </div>

      {playing && (
        <div className="p-4 border-t-[1.5px] border-border flex items-center justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <span className="inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-accent-soft text-accent mb-1">
              {playing.badge}
            </span>
            <h3 className="text-base font-extrabold">{playing.title}</h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {videoId && (
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-[12.5px] font-bold border-[1.5px] border-border bg-surface-alt hover:border-accent hover:text-accent transition"
              >
                Mở trên YouTube ↗
              </a>
            )}

            <button
              type="button"
              onClick={onToggleWatched}
              className={`px-3 py-1.5 rounded-lg text-[12.5px] font-bold border-[1.5px] transition ${
                isWatched
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-border bg-surface-alt hover:border-accent hover:text-accent"
              }`}
            >
              {isWatched ? "✓ Đã xem" : "Đánh dấu đã xem"}
            </button>

            {playing.type === "chapter" && (
              <>
                <button
                  type="button"
                  disabled={!hasPrev}
                  onClick={onPrev}
                  className="px-3 py-1.5 rounded-lg text-[12.5px] font-bold border-[1.5px] border-border bg-surface-alt hover:border-accent hover:text-accent disabled:opacity-45 disabled:cursor-not-allowed transition"
                >
                  ◀ Tập trước
                </button>
                <button
                  type="button"
                  disabled={!hasNext}
                  onClick={onNext}
                  className="px-3 py-1.5 rounded-lg text-[12.5px] font-bold border-[1.5px] border-border bg-surface-alt hover:border-accent hover:text-accent disabled:opacity-45 disabled:cursor-not-allowed transition"
                >
                  Tập sau ▶
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}