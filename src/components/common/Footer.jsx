import { Link } from "react-router-dom";
import siteConfig from "../../data/siteConfig.json";
// import eventsData from "../../data/events.json";
import { useData } from "../../contexts/DataContext";


export default function Footer() {
  const { events: eventsData } = useData();
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
      <div className="max-w-[1240px] mx-auto px-5 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột 1: Thông tin thương hiệu & Disclaimer */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-[8px] rotate-45 grid place-items-center shrink-0 shadow-sm"
                style={{
                  background: "linear-gradient(135deg, var(--accent), #38bdf8)",
                }}
              >
                <span className="-rotate-45 text-white font-extrabold text-xs">
                  ★
                </span>
              </div>
              <span className="text-lg font-extrabold tracking-wide">
                {siteConfig.siteTitle}
              </span>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              {siteConfig.subtitle}. Dự án phi lợi nhuận thực hiện bởi Project Sekai Vietsub dành
              cho cộng đồng Project Sekai Việt Nam.
            </p>

            <p className="text-[11px] text-muted/80 leading-relaxed">
              Mọi bản quyền nhân vật, hình ảnh và cốt truyện gốc thuộc về{" "}
              <strong className="font-semibold text-muted">
                SEGA / Colorful Palette / Crypton Future Media
              </strong>
              .
            </p>
          </div>

          {/* Cột 2: Thống kê & Điều hướng nhanh */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-accent">
              Kho lưu trữ
            </h3>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-surface-alt border border-border text-xs font-bold">
                📚 {eventsData.length} bộ Story
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-surface-alt border border-border text-xs font-bold">
                🎬 {totalChapters} tập Vietsub
              </span>
            </div>

            <ul className="space-y-1.5 text-xs font-semibold text-muted pt-1">
              <li>
                <Link to="/" className="hover:text-accent transition">
                  → Danh sách Event & Main Story
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hover:text-accent transition"
                >
                  ↑ Quay lên đầu trang
                </button>
              </li>
            </ul>
          </div>

          {/* Cột 3: Kết nối & Kênh Vietsub */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-accent">
              Theo dõi chúng mình
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Đừng quên đăng ký kênh để nhận thông báo sớm nhất khi có tập
              Vietsub mới nhé!
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <a
                href={siteConfig.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-accent text-white hover:brightness-105 transition shadow-sm"
              >
                ▶ {siteConfig.channelName}
              </a>

              {siteConfig.facebookUrl && (
                <a
                  href={siteConfig.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border-[1.5px] border-border bg-surface-alt hover:border-accent hover:text-accent transition"
                >
                  Facebook ↗
                </a>
              )}

              {siteConfig.discordUrl && (
                <a
                  href={siteConfig.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border-[1.5px] border-border bg-surface-alt hover:border-accent hover:text-accent transition"
                >
                  Discord ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Dòng bản quyền dưới cùng */}
        <div className="mt-7 pt-4 border-t border-dashed border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <span>
            © {currentYear} <strong>{siteConfig.siteTitle}</strong>. All rights
            reserved.
          </span>
          <span>Made with ♥ for Project Sekai VN Community</span>
        </div>
      </div>
    </footer>
  );
}