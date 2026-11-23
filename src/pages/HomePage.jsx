import { useState, useEffect, useMemo } from "react";
import eventsData from "../data/events.json";
import { UNITS } from "../constants/units";
import { setDynamicAccent } from "../utils/helpers";
import FilterBar from "../components/home/FilterBar";
import EventCard from "../components/home/EventCard";

export default function HomePage({ selectedUnit, onUnitChange }) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    setDynamicAccent((UNITS[selectedUnit] || UNITS.all).color);
  }, [selectedUnit]);

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return eventsData.filter((ev) => {
      const matchUnit = selectedUnit === "all" || ev.unit === selectedUnit;
      const matchSearch =
        !q ||
        (ev.title || "").toLowerCase().includes(q) ||
        (ev.jpTitle || "").toLowerCase().includes(q) ||
        (ev.number || "").toLowerCase().includes(q);
      return matchUnit && matchSearch;
    });
  }, [selectedUnit, search]);

  return (
    <>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        selectedUnit={selectedUnit}
        onUnitChange={onUnitChange}
      />

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 px-5 bg-surface border-[1.5px] border-dashed border-border rounded-[14px] text-muted">
          Không tìm thấy event nào phù hợp.
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