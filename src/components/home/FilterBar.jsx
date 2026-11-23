// import { UNITS } from "../../constants/units";

// export default function FilterBar({ search, onSearchChange, selectedUnit, onUnitChange }) {
//   return (
//     <section className="bg-surface border-[1.5px] border-border rounded-[14px] p-4 sekai-shadow mb-6">
//       <div className="flex gap-3 mb-3.5 flex-wrap items-center">
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => onSearchChange(e.target.value)}
//           placeholder="Tìm tên event (tiếng Việt hoặc tiếng Nhật)..."
//           className="flex-1 min-w-[220px] px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-surface-alt text-sm outline-none focus:border-accent transition"
//         />
//       </div>

//       <div className="flex gap-2 overflow-x-auto pb-1.5 unit-scrollbar">
//         {Object.entries(UNITS).map(([key, info]) => {
//           const isActive = selectedUnit === key;
//           return (
//             <button
//               key={key}
//               type="button"
//               onClick={() => onUnitChange(key)}
//               style={
//                 isActive
//                   ? { backgroundColor: info.color, borderColor: info.color }
//                   : undefined
//               }
//               className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap border-[1.5px] transition ${
//                 isActive
//                   ? "text-white shadow-md"
//                   : "border-border bg-surface-alt hover:border-accent"
//               }`}
//             >
//               <span
//                 className="w-2.5 h-2.5 rounded-full shrink-0"
//                 style={{ backgroundColor: isActive ? "#fff" : info.color }}
//               />
//               {info.name}
//             </button>
//           );
//         })}
//       </div>
//     </section>
//   );
// }

import { UNITS } from "../../constants/units";

export default function FilterBar({
  search,
  onSearchChange,
  selectedUnit,
  onUnitChange,
}) {
  return (
    <section className="bg-surface border-[1.5px] border-border rounded-[20px] p-4 sekai-shadow mb-6">
      {/* Thanh tìm kiếm */}
      <div className="mb-3.5">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm tên event (tiếng Việt hoặc tiếng Nhật)..."
          className="w-full px-4 py-2.5 rounded-full border-[1.5px] border-border bg-surface-alt text-sm outline-none focus:border-accent transition"
        />
      </div>

      {/* Thanh chọn Unit dạng Pill như Hình 3 */}
      <div className="rounded-full bg-[#eef2f6] dark:bg-surface-alt border border-border px-2.5 py-1.5 flex items-center justify-between gap-2 overflow-x-auto unit-scrollbar">
        {Object.entries(UNITS).map(([key, info]) => {
          const isActive = selectedUnit === key;
          const isTextButton = key === "all" || key === "mixed";

          // Nút All và Mix
          if (isTextButton) {
            return (
              <button
                key={key}
                type="button"
                onClick={() => onUnitChange(key)}
                title={info.name}
                style={
                  isActive
                    ? { backgroundColor: info.color, color: "#fff" }
                    : undefined
                }
                className={`shrink-0 h-11 min-w-[48px] px-4 rounded-full text-sm font-bold transition-all ${
                  isActive
                    ? "shadow-md scale-105"
                    : "text-slate-700 dark:text-slate-200 bg-slate-300/50 dark:bg-slate-700/60 hover:bg-slate-300/80 dark:hover:bg-slate-700"
                }`}
              >
                {info.name}
              </button>
            );
          }

          // Các Unit có Logo (và fallback chữ cho Virtual Singer nếu chưa có ảnh)
          return (
            <button
              key={key}
              type="button"
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
                  ? "bg-white dark:bg-slate-200 shadow-sm scale-105"
                  : "opacity-80 hover:opacity-100 hover:bg-white/70 dark:hover:bg-slate-200/90"
              }`}
            >
              {info.logo ? (
                <img
                  src={info.logo}
                  alt={info.name}
                  className="h-7 sm:h-8 w-auto max-w-[115px] object-contain select-none"
                />
              ) : (
                <span className="text-[11px] font-semibold tracking-wider leading-[1.15] text-center text-slate-800 uppercase select-none">
                  VIRTUAL
                  <br />
                  SINGER
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}