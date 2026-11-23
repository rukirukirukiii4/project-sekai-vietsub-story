import { useState } from "react";
import { extractYouTubeId, resolveImageUrl } from "../../utils/helpers";

export default function GachaCardItem({
  eventId,
  card,
  cardIndex,
  playingKey,
  onSelectSideStory,
}) {
  const [isTrained, setIsTrained] = useState(false);

  const canTrain = card.rarity >= 3 || !!card.trained;
  const imgSrc = resolveImageUrl(
    canTrain && isTrained ? card.trained : card.untrained
  );
  const stars = "★".repeat(Math.max(1, Math.min(4, Number(card.rarity) || 4)));

  const ss1Id = extractYouTubeId(card.sideStory1);
  const ss2Id = extractYouTubeId(card.sideStory2);
  const ss1Active = playingKey === `${eventId}__card_${cardIndex}_ss1`;
  const ss2Active = playingKey === `${eventId}__card_${cardIndex}_ss2`;

  return (
    <div className="border-[1.5px] border-border rounded-xl overflow-hidden bg-surface-alt">
      <div
        className="relative aspect-[16/9.5] flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--accent), #334155)" }}
      >
        <span className="absolute left-2 top-2 px-2 py-0.5 rounded-full text-[11px] font-extrabold text-yellow-300 bg-slate-900/70 tracking-wider z-10">
          {stars}
        </span>

        {imgSrc ? (
          <img
            src={imgSrc}
            alt={card.character}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-white p-4">
            <strong className="block text-[15px] mb-0.5">{card.character}</strong>
            <span className="text-xs opacity-85">
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
            className="absolute right-2 bottom-2 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-slate-900/75 backdrop-blur-sm border border-white/25 hover:bg-accent transition"
          >
            {isTrained ? "↺ Xem chưa thức tỉnh" : "✦ Xem đã thức tỉnh"}
          </button>
        )}
      </div>

      <div className="p-3">
        <div className="text-sm font-extrabold">{card.character}</div>
        <div className="text-xs text-muted mb-2.5">{card.title}</div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!ss1Id}
            onClick={() => onSelectSideStory(cardIndex, 1)}
            className={`py-2 px-1.5 rounded-lg text-xs font-bold border-[1.5px] text-center transition disabled:opacity-45 disabled:cursor-not-allowed ${
              ss1Active
                ? "bg-accent border-accent text-white"
                : "border-border bg-surface hover:border-accent hover:text-accent"
            }`}
          >
            {ss1Id ? "▶ Side Story 1" : "Side Story 1 (Chưa có)"}
          </button>

          <button
            type="button"
            disabled={!ss2Id}
            onClick={() => onSelectSideStory(cardIndex, 2)}
            className={`py-2 px-1.5 rounded-lg text-xs font-bold border-[1.5px] text-center transition disabled:opacity-45 disabled:cursor-not-allowed ${
              ss2Active
                ? "bg-accent border-accent text-white"
                : "border-border bg-surface hover:border-accent hover:text-accent"
            }`}
          >
            {ss2Id ? "▶ Side Story 2" : "Side Story 2 (Chưa có)"}
          </button>
        </div>
      </div>
    </div>
  );
}