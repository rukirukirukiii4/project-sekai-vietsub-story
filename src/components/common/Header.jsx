import { useState } from "react";
import { Link } from "react-router-dom";
import siteConfig from "../../data/siteConfig.json";
import { useAuth } from "../../contexts/AuthContext";
import AuthModal from "./AuthModal";
import {
  StarEmblemIcon,
  PlayIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
} from "./Icons";

export default function Header({ isDark, onToggleTheme, onResetUnit }) {
  const { currentUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface border-b-[3px] border-accent shadow-sm transition-colors duration-200">
        <div className="max-w-[1240px] mx-auto px-3.5 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
          <Link
            to="/"
            onClick={() => onResetUnit?.()}
            className="flex items-center gap-2 sm:gap-3 min-w-0 rounded-lg"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[9px] rotate-45 grid place-items-center shrink-0 bg-accent-fill text-accent-ink shadow-sm transition-colors duration-200">
              <StarEmblemIcon className="-rotate-45 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </div>
            <div className="min-w-0">
              <span className="block text-[15px] sm:text-[19px] font-extrabold tracking-wide leading-tight whitespace-nowrap">
                {siteConfig.siteTitle}
              </span>
              <p className="hidden sm:block text-xs text-muted truncate">
                {siteConfig.subtitle}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={siteConfig.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={siteConfig.channelName}
              title={siteConfig.channelName}
              className="inline-flex items-center justify-center gap-1.5 h-9 w-9 sm:w-auto sm:px-3.5 rounded-full text-[13px] font-semibold border-[1.5px] border-border bg-surface-alt hover:border-accent hover:text-accent-text transition"
            >
              <PlayIcon className="w-3.5 h-3.5 text-accent-text shrink-0" />
              <span className="hidden md:inline">{siteConfig.channelName}</span>
              <span className="hidden sm:inline md:hidden">YouTube</span>
            </a>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
              title={isDark ? "Giao diện sáng" : "Giao diện tối"}
              className="inline-flex items-center justify-center gap-1.5 h-9 w-9 sm:w-auto sm:px-3.5 rounded-full text-[13px] font-semibold border-[1.5px] border-border bg-surface-alt hover:border-accent hover:text-accent-text transition"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
              <span className="hidden sm:inline">
                {isDark ? "Giao diện sáng" : "Giao diện tối"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 h-9 px-2.5 sm:px-3.5 rounded-full text-xs sm:text-[13px] font-bold border-[1.5px] border-border bg-surface-alt hover:border-accent hover:text-accent-text transition"
            >
              {currentUser ? (
                <>
                  <span className="w-5 h-5 rounded-full bg-accent-fill text-accent-ink text-[11px] flex items-center justify-center shrink-0">
                    {currentUser.displayName.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[96px] sm:max-w-[140px] truncate">
                    {currentUser.displayName}
                  </span>
                </>
              ) : (
                <>
                  <UserIcon className="w-4 h-4 shrink-0" />
                  <span>Đăng nhập</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
