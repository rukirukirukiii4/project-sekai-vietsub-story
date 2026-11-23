import { UNITS } from "../../constants/units";
import { SearchIcon, CloseIcon } from "../common/Icons";

export default function FilterBar({
  search,
  onSearchChange,
  selectedUnit,
  onUnitChange,
}) {
  return (
    <section
      aria-label="Tìm kiếm và lọc theo nhóm"
      className="bg-surface border-[1.5px] border-border rounded-[20px] p-4 sekai-shadow mb-6"
    >
      {/* Thanh tìm kiếm */}
      <div className="relative mb-3.5">
        <SearchIcon className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          aria-label="Tìm kiếm event theo tên tiếng Việt, tiếng Nhật hoặc tên nhóm"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm tên event (tiếng Việt, tiếng Nhật hoặc tên nhóm)..."
          className="w-full pl-10 pr-10 py-2.5 rounded-full border-[1.5px] border-border bg-surface-alt text-sm text-[var(--text)] placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none focus:border-accent transition"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Xóa từ khóa tìm kiếm"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-[var(--text)] hover:bg-border/60 transition"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Thanh chọn Unit */}
      <div className="relative">
        <div
          role="group"
          aria-label="Lọc theo Unit"
          className="rounded-full bg-[#eef2f6] dark:bg-surface-alt border border-border px-2.5 py-1.5 flex items-center lg:justify-between gap-2 overflow-x-auto unit-scrollbar"
        >
          {Object.entries(UNITS).map(([key, info]) => {
            const isActive = selectedUnit === key;
            const isTextButton = key === "all" || key === "mixed";

            if (isTextButton) {
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onUnitChange(key)}
                  title={info.name}
                  style={
                    isActive
                      ? { backgroundColor: info.fill, color: "#ffffff" }
                      : undefined
                  }
                  className={`shrink-0 h-11 min-w-[54px] px-4 rounded-full text-sm font-bold transition-all ${
                    isActive
                      ? "shadow-sm"
                      : "text-slate-700 dark:text-slate-200 bg-slate-200/80 dark:bg-slate-700/70 hover:bg-slate-300/80 dark:hover:bg-slate-700"
                  }`}
                >
                  {info.shortName}
                </button>
              );
            }

            return (
              <button
                key={key}
                type="button"
                aria-pressed={isActive}
                aria-label={info.name}
                onClick={() => onUnitChange(key)}
                title={info.name}
                style={
                  isActive
                    ? {
                        boxShadow: `0 0 0 2px ${info.color}`,
                      }
                    : undefined
                }
                className={`shrink-0 h-11 px-3.5 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-white dark:bg-white shadow-sm"
                    : "bg-transparent dark:bg-white/90 opacity-85 hover:opacity-100 hover:bg-white/80 dark:hover:bg-white"
                }`}
              >
                {info.logo ? (
                  <img
                    src={info.logo}
                    alt={info.name}
                    className="h-7 sm:h-8 w-auto max-w-[115px] object-contain select-none"
                  />
                ) : (
                  <span className="text-xs font-semibold tracking-wider leading-[1.15] text-center text-slate-800 uppercase select-none">
                    {info.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Gợi ý cuộn ngang trên màn hình nhỏ */}
        <div
          aria-hidden="true"
          className="pointer-events-none lg:hidden absolute inset-y-[1px] right-[1px] w-10 rounded-r-full bg-gradient-to-l from-[#eef2f6] dark:from-[#23273b] to-transparent"
        />
      </div>
    </section>
  );
}
