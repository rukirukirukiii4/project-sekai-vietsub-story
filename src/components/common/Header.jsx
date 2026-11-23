import { useNavigate } from "react-router-dom";
import siteConfig from "../../data/siteConfig.json";

export default function Header({ isDark, onToggleTheme, onResetUnit }) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (onResetUnit) onResetUnit();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b-[3px] border-accent shadow-sm transition-colors duration-200">
      <div className="max-w-[1240px] mx-auto px-5 py-3 flex items-center justify-between gap-3.5 flex-wrap">
        <div
          onClick={handleGoHome}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div
            className="w-9 h-9 rounded-[10px] rotate-45 grid place-items-center shrink-0 shadow-md"
            style={{ background: "linear-gradient(135deg, var(--accent), #38bdf8)" }}
          >
            <span className="-rotate-45 text-white font-extrabold text-base">★</span>
          </div>
          <div>
            <h1 className="text-[19px] font-extrabold tracking-wide leading-tight">
              {siteConfig.siteTitle}
            </h1>
            <p className="text-xs text-muted">{siteConfig.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={siteConfig.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold bg-accent text-white hover:brightness-105 transition"
          >
            ▶ {siteConfig.channelName}
          </a>
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold border-[1.5px] border-border bg-surface-alt hover:border-accent hover:text-accent transition"
          >
            {isDark ? "☀️ Giao diện sáng" : "🌙 Giao diện tối"}
          </button>
        </div>
      </div>
    </header>
  );
}