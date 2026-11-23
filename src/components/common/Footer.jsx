import { Link } from "react-router-dom";
import siteConfig from "../../data/siteConfig.json";
import eventsData from "../../data/events.json";
import {
  StarEmblemIcon,
  BookOpenIcon,
  FilmIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  PlayIcon,
  ExternalLinkIcon,
} from "./Icons";

export default function Footer({ onResetUnit }) {
  const currentYear = new Date().getFullYear();

  const totalChapters = eventsData.reduce(
    (sum, ev) => sum + (ev.chapters?.length || 0),
    0
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-auto bg-surface border-t-[3px] border-accent transition-colors duration-200">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-5 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột 1: Thông tin thương hiệu & Bản quyền gốc */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[7px] rotate-45 grid place-items-center shrink-0 bg-accent-fill text-accent-ink shadow-sm">
                <StarEmblemIcon className="-rotate-45 w-3.5 h-3.5" />
              </div>
              <span className="text-lg font-extrabold tracking-wide">
                {siteConfig.siteTitle}
              </span>
            </div>

            <p className="text-sm text-muted leading-relaxed text-pretty">
              {siteConfig.subtitle}. Dự án phi lợi nhuận do Project Sekai Vietsub
              thực hiện cho cộng đồng Project Sekai Việt Nam.
            </p>

            <p className="text-xs text-muted leading-relaxed text-pretty">
              Bản quyền nhân vật, hình ảnh và cốt truyện gốc thuộc về{" "}
              <strong className="font-semibold text-[var(--text)]">
                SEGA / Colorful Palette / Crypton Future Media
              </strong>
              .
            </p>
          </div>

          {/* Cột 2: Thống kê & Điều hướng nhanh */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-accent-text">
              Kho lưu trữ
            </h3>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-alt border border-border text-xs font-bold tabular-nums">
                <BookOpenIcon className="w-3.5 h-3.5 text-accent-text" />
                {eventsData.length} bộ Story
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-alt border border-border text-xs font-bold tabular-nums">
                <FilmIcon className="w-3.5 h-3.5 text-accent-text" />
                {totalChapters} tập Vietsub
              </span>
            </div>

            <ul className="space-y-2 text-xs font-semibold text-muted pt-1">
              <li>
                <Link
                  to="/"
                  onClick={() => onResetUnit?.()}
                  className="inline-flex items-center gap-1.5 hover:text-accent-text transition"
                >
                  <ArrowRightIcon />
                  Danh sách Event & Main Story
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-1.5 hover:text-accent-text transition"
                >
                  <ArrowUpIcon />
                  Quay lên đầu trang
                </button>
              </li>
            </ul>
          </div>

          {/* Cột 3: Kết nối & Kênh Vietsub */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-accent-text">
              Theo dõi chúng mình
            </h3>
            <p className="text-sm text-muted leading-relaxed text-pretty">
              Đăng ký kênh để nhận thông báo sớm nhất khi có tập Vietsub&nbsp;mới.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <a
                href={siteConfig.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-accent-fill text-accent-ink hover:brightness-110 transition shadow-sm"
              >
                <PlayIcon className="w-3.5 h-3.5" />
                {siteConfig.channelName}
              </a>

              {siteConfig.facebookUrl && (
                <a
                  href={siteConfig.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border-[1.5px] border-border bg-surface-alt hover:border-accent hover:text-accent-text transition"
                >
                  Facebook
                  <ExternalLinkIcon />
                </a>
              )}

              {siteConfig.discordUrl && (
                <a
                  href={siteConfig.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border-[1.5px] border-border bg-surface-alt hover:border-accent hover:text-accent-text transition"
                >
                  Discord
                  <ExternalLinkIcon />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Dòng chân trang */}
        <div className="mt-7 pt-4 border-t border-dashed border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <span>
            © {currentYear} <strong className="text-[var(--text)]">{siteConfig.siteTitle}</strong> · Dự án cộng đồng phi lợi nhuận
          </span>
          <span>Project Sekai Vietsub · Cộng đồng Project Sekai Việt Nam</span>
        </div>
      </div>
    </footer>
  );
}
