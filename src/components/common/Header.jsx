import { useState } from "react";
import { useNavigate } from "react-router-dom";
import siteConfig from "../../data/siteConfig.json";
import { useAuth } from "../../contexts/AuthContext";
import AuthModal from "./AuthModal";

export default function Header({ isDark, onToggleTheme, onResetUnit }) {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const handleGoHome = () => {
    if (onResetUnit) onResetUnit();
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface border-b-[3px] border-accent shadow-sm transition-colors duration-200">
        <div className="max-w-[1240px] mx-auto px-5 py-3 flex items-center justify-between gap-3.5 flex-wrap">
          <div
            onClick={handleGoHome}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div
              className="w-9 h-9 rounded-[10px] rotate-45 grid place-items-center shrink-0 shadow-md"
              style={{
                background: "linear-gradient(135deg, var(--accent), #38bdf8)",
              }}
            >
              <span className="-rotate-45 text-white font-extrabold text-base">
                ★
              </span>
            </div>
            <div>
              <h1 className="text-[19px] font-extrabold tracking-wide leading-tight">
                {siteConfig.siteTitle}
              </h1>
              <p className="text-xs text-muted">{siteConfig.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
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

            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] font-bold border-[1.5px] border-border bg-surface-alt hover:border-accent hover:text-accent transition"
            >
              {currentUser ? (
                <>
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.displayName}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-accent text-white text-[11px] flex items-center justify-center">
                      {currentUser.displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span>{currentUser.displayName}</span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-900">
                      ADMIN
                    </span>
                  )}
                </>
              ) : (
                <span>👤 Đăng nhập</span>
              )}
            </button>
          {isAdmin && (
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-bold border-[1.5px] border-amber-400/70 bg-amber-400/15 text-amber-600 dark:text-amber-300 hover:bg-amber-400 hover:text-slate-900 transition"
              >
                Kho ảnh
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}