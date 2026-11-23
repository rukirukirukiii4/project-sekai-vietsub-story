import { useState, useEffect } from "react";
import { extractYouTubeId, resolveImageUrl } from "../../utils/helpers";
import {
  PlayIcon,
  SparklesIcon,
  RotateCcwIcon,
  StarFilledIcon,
} from "../common/Icons";

export default function GachaCardItem({
  eventId,
  card,
  cardIndex,
  playingKey,
  onSelectSideStory,
}) {
  const [isTrained, setIsTrained] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const canTrain = Boolean(card.trained);
  const imgSrc = resolveImageUrl(
    canTrain && isTrained ? card.trained : card.untrained
  );

  useEffect(() => {
    setImgFailed(false);
  }, [imgSrc]);

  const rarityCount = Math.max(1, Math.min(4, Number(card.rarity) || 4));
  const ss1Id = extractYouTubeId(card.sideStory1);
  const ss2Id = extractYouTubeId(card.sideStory2);
  const hasAnySideStory = Boolean(ss1Id || ss2Id);
  const ss1Active = playingKey === `${eventId}__card_${cardIndex}_ss1`;
  const ss2Active = playingKey === `${eventId}__card_${cardIndex}_ss2`;

  return (
    <div className="border-[1.5px] border-border rounded-xl overflow-hidden bg-surface-alt">
      <div
        className="relative aspect-[16/9.5] flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--accent), #334155)" }}
      >
        <span
          aria-label={`${rarityCount} sao`}
          className="absolute left-2 top-2 px-2 py-1 rounded-full text-yellow-300 bg-slate-900/75 inline-flex items-center gap-0.5 z-10"
        >
          {Array.from({ length: rarityCount }).map((_, i) => (
            <StarFilledIcon key={i} className="w-3 h-3" />
          ))}
        </span>

        {imgSrc && !imgFailed ? (
          <img
            src={imgSrc}
            alt={card.character}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-white p-4">
            <strong className="block text-[15px] mb-0.5">{card.character}</strong>
            <span className="text-xs text-white/90">
              {isTrained
                ? "Ảnh đã thức tỉnh (Trained)"
                : "Ảnh chưa thức tỉnh (Untrained)"}
            </span>
          </div>
        )}

        {canTrain && (
          <button
            type="button"
            onClick={() => setIsTrained((prev) => !prev)}
            className="absolute right-2 bottom-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-slate-900/80 backdrop-blur-sm border border-white/25 hover:bg-accent-fill hover:border-accent-fill transition"
          >
            {isTrained ? (
              <>
                <RotateCcwIcon className="w-3.5 h-3.5" />
                Xem chưa thức tỉnh
              </>
            ) : (
              <>
                <SparklesIcon className="w-3.5 h-3.5" />
                Xem đã thức tỉnh
              </>
            )}
          </button>
        )}
      </div>

      <div className="p-3">
        <div className="text-sm font-extrabold">{card.character}</div>
        <div className="text-xs text-muted mb-2.5 leading-snug">{card.title}</div>

        {hasAnySideStory ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!ss1Id}
              onClick={() => onSelectSideStory(cardIndex, 1)}
              className={`inline-flex items-center justify-center gap-1.5 min-h-[36px] py-2 px-2 rounded-lg text-xs font-bold border-[1.5px] text-center transition disabled:opacity-45 disabled:cursor-not-allowed ${
                ss1Active
                  ? "bg-accent-fill border-accent-fill text-accent-ink"
                  : "border-border bg-surface hover:border-accent hover:text-accent-text"
              }`}
            >
              {ss1Id ? (
                <>
                  <PlayIcon className="w-3 h-3 shrink-0" />
                  Side Story 1
                </>
              ) : (
                "Side Story 1 · Chưa có"
              )}
            </button>

            <button
              type="button"
              disabled={!ss2Id}
              onClick={() => onSelectSideStory(cardIndex, 2)}
              className={`inline-flex items-center justify-center gap-1.5 min-h-[36px] py-2 px-2 rounded-lg text-xs font-bold border-[1.5px] text-center transition disabled:opacity-45 disabled:cursor-not-allowed ${
                ss2Active
                  ? "bg-accent-fill border-accent-fill text-accent-ink"
                  : "border-border bg-surface hover:border-accent hover:text-accent-text"
              }`}
            >
              {ss2Id ? (
                <>
                  <PlayIcon className="w-3 h-3 shrink-0" />
                  Side Story 2
                </>
              ) : (
                "Side Story 2 · Chưa có"
              )}
            </button>
          </div>
        ) : (
          <p className="text-xs text-muted py-1.5 px-2.5 rounded-lg bg-surface border border-dashed border-border text-center">
            Side Story đang cập nhật
          </p>
        )}
      </div>
    </div>
  );
}
