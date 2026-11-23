// import { useNavigate } from "react-router-dom";
// import { UNITS } from "../../constants/units";
// import { resolveImageUrl } from "../../utils/helpers";

// export default function EventCard({ event, watchedMap }) {
//   const navigate = useNavigate();
//   const unitInfo = UNITS[event.unit] || UNITS.all;
//   const totalEp = event.chapters?.length || 0;
//   const doneEp = (event.chapters || []).filter(
//     (_, idx) => watchedMap[`${event.id}__ep_${idx}`]
//   ).length;
//   const totalCards = event.cards?.length || 0;

//   return (
//     <article
//       onClick={() => navigate(`/event/${event.id}`)}
//       style={{ "--card-unit-color": unitInfo.color }}
//       className="bg-surface border-[1.5px] border-border rounded-[14px] overflow-hidden sekai-shadow cursor-pointer flex flex-col transition duration-200 hover:-translate-y-1 hover:border-[var(--card-unit-color)]"
//     >
//       <div
//         className="relative aspect-[16/8.5] overflow-hidden flex items-end p-3.5"
//         style={{
//           background: `linear-gradient(135deg, ${unitInfo.color}, #1e293b)`,
//         }}
//       >
//         {event.banner && (
//           <img
//             src={resolveImageUrl(event.banner)}
//             alt={event.title}
//             loading="lazy"
//             className="absolute inset-0 w-full h-full object-cover"
//           />
//         )}
//         <div
//           className="absolute inset-0"
//           style={{
//             background:
//               "linear-gradient(to top, rgba(15, 23, 42, 0.78) 0%, rgba(15, 23, 42, 0.1) 60%)",
//           }}
//         />
//         <div className="relative z-10 flex justify-between items-center w-full gap-2">
//           <span
//             className="px-2.5 py-1 text-[11px] font-extrabold text-white rounded-md tracking-wide"
//             style={{ backgroundColor: unitInfo.color }}
//           >
//             {unitInfo.name}
//           </span>
//           {event.number && (
//             <span className="px-2.5 py-1 text-[11px] font-bold text-white bg-slate-900/65 backdrop-blur-sm rounded-md">
//               {event.number}
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="p-4 flex flex-col flex-1 gap-2">
//         <h2 className="text-base font-extrabold leading-snug">{event.title}</h2>
//         {event.jpTitle && (
//           <p className="text-xs text-muted">{event.jpTitle}</p>
//         )}
//         {event.summary && (
//           <p className="text-[13px] text-muted leading-relaxed line-clamp-2">
//             {event.summary}
//           </p>
//         )}

//         <div className="mt-auto pt-2.5 border-t border-dashed border-border flex items-center justify-between text-xs font-semibold text-muted">
//           <span>
//             📖 {doneEp}/{totalEp} tập đã xem
//           </span>
//           <span>🃏 {totalCards} thẻ</span>
//         </div>
//       </div>
//     </article>
//   );
// }

import { useNavigate } from "react-router-dom";
import { UNITS } from "../../constants/units";
import { resolveImageUrl } from "../../utils/helpers";

export default function EventCard({ event, watchedMap }) {
  const navigate = useNavigate();
  const unitInfo = UNITS[event.unit] || UNITS.all;
  const totalEp = event.chapters?.length || 0;
  const doneEp = (event.chapters || []).filter(
    (_, idx) => watchedMap[`${event.id}__ep_${idx}`]
  ).length;
  const totalCards = event.cards?.length || 0;

  return (
    <article
      onClick={() => navigate(`/event/${event.id}`)}
      style={{ "--card-unit-color": unitInfo.color }}
      className="bg-surface border-[1.5px] border-border rounded-[14px] overflow-hidden sekai-shadow cursor-pointer flex flex-col transition duration-200 hover:-translate-y-1 hover:border-[var(--card-unit-color)]"
    >
      <div
        className="relative aspect-[16/8.5] overflow-hidden flex items-end p-3.5"
        style={{
          background: `linear-gradient(135deg, ${unitInfo.color}, #1e293b)`,
        }}
      >
        {event.banner && (
          <img
            src={resolveImageUrl(event.banner)}
            alt={event.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(15, 23, 42, 0.78) 0%, rgba(15, 23, 42, 0.1) 60%)",
          }}
        />

        <div className="relative z-10 flex justify-between items-center w-full gap-2">
          {/* Nếu có logo (và không phải Mix) -> hiện Logo, ngược lại -> giữ Tag màu */}
          {unitInfo.logo ? (
            <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm flex items-center">
              <img
                src={unitInfo.logo}
                alt={unitInfo.name}
                className="h-5 w-auto max-w-[110px] object-contain"
              />
            </div>
          ) : (
            <span
              className="px-2.5 py-1 text-[11px] font-extrabold text-white rounded-md tracking-wide"
              style={{ backgroundColor: unitInfo.color }}
            >
              {event.unit === "mixed" ? "Mixed Event" : unitInfo.name}
            </span>
          )}

          {event.number && (
            <span className="px-2.5 py-1 text-[11px] font-bold text-white bg-slate-900/65 backdrop-blur-sm rounded-md">
              {event.number}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h2 className="text-base font-extrabold leading-snug">{event.title}</h2>
        {event.jpTitle && <p className="text-xs text-muted">{event.jpTitle}</p>}
        {event.summary && (
          <p className="text-[13px] text-muted leading-relaxed line-clamp-2">
            {event.summary}
          </p>
        )}

        <div className="mt-auto pt-2.5 border-t border-dashed border-border flex items-center justify-between text-xs font-semibold text-muted">
          <span>
            📖 {doneEp}/{totalEp} tập đã xem
          </span>
          <span>🃏 {totalCards} thẻ</span>
        </div>
      </div>
    </article>
  );
}