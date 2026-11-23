import { useState } from "react";
import { Link } from "react-router-dom";
import { UNITS } from "../../constants/units";
import { resolveImageUrl } from "../../utils/helpers";
import { useAuth } from "../../contexts/AuthContext";
import { BookOpenIcon, CardStackIcon } from "../common/Icons";

export default function EventCard({ event }) {
  const { getEventProgress } = useAuth();
  const [imgFailed, setImgFailed] = useState(false);

  const unitInfo = UNITS[event.unit] || UNITS.all;
  const { totalCount: totalEp, percent } = getEventProgress(event);
  const totalCards = event.cards?.length || 0;
  const bannerSrc = resolveImageUrl(event.banner);
  const showJpTitle =
    event.jpTitle &&
    event.jpTitle.trim().toLowerCase() !== (event.title || "").trim().toLowerCase();

  return (
    <article
      style={{
        "--card-unit-color": unitInfo.color,
        "--card-accent-text-light": unitInfo.textLight,
        "--card-accent-text-dark": unitInfo.textDark,
      }}
      className="group bg-surface border-[1.5px] border-border rounded-[14px] overflow-hidden sekai-shadow flex flex-col transition duration-200 hover:-translate-y-1 motion-safe-lift hover:border-[var(--card-unit-color)] focus-within:border-[var(--card-unit-color)]"
    >
      <Link
        to={`/event/${event.id}`}
        className="flex flex-col flex-1 focus:outline-none"
      >
        <div
          className="relative aspect-[16/8.5] overflow-hidden flex items-end p-3.5"
          style={{
            background: `linear-gradient(135deg, ${unitInfo.color}, #1e293b)`,
          }}
        >
          {bannerSrc && !imgFailed && (
            <img
              src={bannerSrc}
              alt={event.title}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.12) 60%)",
            }}
          />

          <div className="relative z-10 flex justify-between items-center w-full gap-2">
            {unitInfo.logo ? (
              <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm flex items-center shrink-0">
                <img
                  src={unitInfo.logo}
                  alt={unitInfo.name}
                  className="h-5 w-auto max-w-[105px] object-contain"
                />
              </div>
            ) : (
              <span
                className="px-2.5 py-1 text-xs font-extrabold text-white rounded-md tracking-wide shrink-0"
                style={{ backgroundColor: unitInfo.fill }}
              >
                {unitInfo.name}
              </span>
            )}

            {event.number && (
              <span
                title={event.number}
                className="px-2.5 py-1 text-xs font-bold text-white bg-slate-900/75 backdrop-blur-sm rounded-md truncate max-w-[58%]"
              >
                {event.number}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1 gap-2">
          <h2 className="text-[17px] font-extrabold leading-snug text-balance group-hover:text-accent-text transition-colors">
            {event.title}
          </h2>
          {showJpTitle && (
            <p className="text-xs text-muted leading-snug">{event.jpTitle}</p>
          )}
          {event.summary && (
            <p className="text-sm text-muted leading-relaxed line-clamp-2">
              {event.summary}
            </p>
          )}

          <div className="mt-auto pt-3 border-t border-dashed border-border space-y-2.5">
            {/* Thanh tiến trình đọc */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-muted tabular-nums">
                <span>Tiến độ đọc</span>
                <span
                  className={
                    percent === 100
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "card-unit-text"
                  }
                >
                  {percent}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: percent === 100 ? "#10b981" : unitInfo.color,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-muted tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <BookOpenIcon className="w-3.5 h-3.5" />
                {totalEp} tập
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CardStackIcon className="w-3.5 h-3.5" />
                {totalCards} thẻ
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
