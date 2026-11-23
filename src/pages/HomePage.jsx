import { useState, useEffect, useMemo } from "react";
import eventsData from "../data/events.json";
import { UNITS } from "../constants/units";
import { setDynamicAccent } from "../utils/helpers";
import FilterBar from "../components/home/FilterBar";
import EventCard from "../components/home/EventCard";

export default function HomePage({ selectedUnit, onUnitChange }) {
  const [search, setSearch] = useState("");
  const activeUnit = UNITS[selectedUnit] || UNITS.all;

  useEffect(() => {
    setDynamicAccent(activeUnit);
  }, [activeUnit]);

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return eventsData.filter((ev) => {
      const unitName = (UNITS[ev.unit]?.name || "").toLowerCase();
      const matchUnit = selectedUnit === "all" || ev.unit === selectedUnit;
      const matchSearch =
        !q ||
        (ev.title || "").toLowerCase().includes(q) ||
        (ev.jpTitle || "").toLowerCase().includes(q) ||
        (ev.number || "").toLowerCase().includes(q) ||
        unitName.includes(q);
      return matchUnit && matchSearch;
    });
  }, [selectedUnit, search]);

  const hasActiveFilter = selectedUnit !== "all" || search.trim().length > 0;

  return (
    <>
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
        <h1 className="text-2xl sm:text-[26px] font-extrabold tracking-tight leading-tight text-balance">
          {selectedUnit === "all" ? "Danh sách Story Vietsub" : activeUnit.name}
        </h1>
        <p className="text-sm font-semibold text-muted tabular-nums">
          {filteredEvents.length} bộ Story
        </p>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        selectedUnit={selectedUnit}
        onUnitChange={onUnitChange}
      />

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 px-5 bg-surface border-[1.5px] border-dashed border-border rounded-[14px] text-muted space-y-3">
          <p className="text-sm font-medium">
            Không tìm thấy event nào phù hợp với bộ lọc hiện tại.
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                onUnitChange("all");
              }}
              className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-accent-fill text-accent-ink hover:brightness-110 transition"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      )}
    </>
  );
}
