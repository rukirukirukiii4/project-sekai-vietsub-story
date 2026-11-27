import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";
import fallbackEvents from "../data/events.json";
import fallbackCharacters from "../data/characters.json";

const DataContext = createContext(null);

function mapDbEventToUi(row) {
  return {
    id: row.id,
    number: row.number || "",
    title: row.title || "",
    jpTitle: row.jp_title || "",
    unit: row.unit || "ln",
    type: row.type || "event",
    keyStory: Boolean(row.key_story),
    date: row.date || "",
    banner: row.banner || "",
    bgImage: row.bg_image || "",
    logo: row.logo || "",
    summary: row.summary || "",
    chapters: Array.isArray(row.chapters) ? row.chapters : [],
    cards: Array.isArray(row.cards) ? row.cards : [],
    sortOrder: row.sort_order ?? 0,
  };
}

function mapUiEventToDb(ev, sortOrder = 0) {
  return {
    id: ev.id,
    number: ev.number || "",
    title: ev.title,
    jp_title: ev.jpTitle || "",
    unit: ev.unit,
    type: ev.type || "event",
    key_story: Boolean(ev.keyStory),
    date: ev.date || "",
    banner: ev.banner || "",
    bg_image: ev.bgImage || "",
    logo: ev.logo || "",
    summary: ev.summary || "",
    chapters: ev.chapters || [],
    cards: ev.cards || [],
    sort_order: ev.sortOrder ?? sortOrder,
  };
}

export function DataProvider({ children }) {
  const [events, setEvents] = useState(fallbackEvents);
  const [characters, setCharacters] = useState(fallbackCharacters);
  const [dataLoading, setDataLoading] = useState(true);
  const [isUsingDbEvents, setIsUsingDbEvents] = useState(false);
  const [isUsingDbChars, setIsUsingDbChars] = useState(false);

  const fetchAllData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [evRes, charRes, ssRes] = await Promise.all([
        supabase
          .from("events")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
        supabase
          .from("characters")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase
          .from("side_stories")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
      ]);

      // 1. Xử lý Events
      if (!evRes.error && evRes.data && evRes.data.length > 0) {
        setEvents(evRes.data.map(mapDbEventToUi));
        setIsUsingDbEvents(true);
      } else {
        setEvents(fallbackEvents);
        setIsUsingDbEvents(false);
      }

      // 2. Xử lý Characters + ghép Side Stories theo từng nhân vật
      if (!charRes.error && charRes.data && charRes.data.length > 0) {
        const ssByChar = {};
        if (!ssRes.error && ssRes.data) {
          ssRes.data.forEach((ss) => {
            if (!ssByChar[ss.character_id]) ssByChar[ss.character_id] = [];
            ssByChar[ss.character_id].push({
              id: ss.id,
              characterId: ss.character_id,
              title: ss.title,
              rarity: ss.rarity,
              icon: ss.icon || "",
              part1Url: ss.part1_url || "",
              part2Url: ss.part2_url || "",
              sortOrder: ss.sort_order ?? 0,
            });
          });
        }

        const mergedChars = charRes.data.map((ch) => ({
          id: ch.id,
          name: ch.name,
          jpName: ch.jp_name || "",
          enName: ch.en_name || "",
          unit: ch.unit,
          color: ch.color || "#00ccbb",
          avatar: ch.avatar || "",
          portrait: ch.portrait || "",
          profile: ch.profile || {},
          sortOrder: ch.sort_order ?? 0,
          sideStories: ssByChar[ch.id] || [],
        }));

        setCharacters(mergedChars);
        setIsUsingDbChars(true);
      } else {
        setCharacters(fallbackCharacters);
        setIsUsingDbChars(false);
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu từ Supabase:", err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Lưu (Thêm mới hoặc Cập nhật) 1 Event vào Supabase
  const saveEvent = async (eventObj) => {
    const existing = events.find((e) => e.id === eventObj.id);
    const maxOrder = events.reduce(
      (max, e, idx) => Math.max(max, e.sortOrder ?? idx),
      -1
    );
    const sortOrder =
      eventObj.sortOrder ?? (existing ? existing.sortOrder : maxOrder + 1);

    const payload = mapUiEventToDb(eventObj, sortOrder);
    const { error } = await supabase
      .from("events")
      .upsert(payload, { onConflict: "id" });

    if (error) return { ok: false, message: error.message };
    await fetchAllData();
    return { ok: true };
  };

  // Xóa 1 Event trên Supabase
  const deleteEvent = async (eventId) => {
    const { error } = await supabase.from("events").delete().eq("id", eventId);
    if (error) return { ok: false, message: error.message };
    await fetchAllData();
    return { ok: true };
  };

  // Lưu (Thêm mới hoặc Cập nhật) 1 Side Story vào bảng side_stories
  const saveSideStory = async (ssObj) => {
    const targetChar = characters.find((c) => c.id === ssObj.characterId);
    const existingList = targetChar?.sideStories || [];
    const existing = existingList.find((s) => s.id === ssObj.id);
    const maxOrder = existingList.reduce(
      (max, s, idx) => Math.max(max, s.sortOrder ?? idx),
      -1
    );

    const payload = {
      id: ssObj.id,
      character_id: ssObj.characterId,
      title: ssObj.title,
      rarity: String(ssObj.rarity || "4"),
      icon: ssObj.icon || "",
      part1_url: ssObj.part1Url || "",
      part2_url: ssObj.part2Url || "",
      sort_order: ssObj.sortOrder ?? (existing ? existing.sortOrder : maxOrder + 1),
    };

    const { error } = await supabase
      .from("side_stories")
      .upsert(payload, { onConflict: "id" });

    if (error) return { ok: false, message: error.message };
    await fetchAllData();
    return { ok: true };
  };

  // Xóa 1 Side Story trên Supabase
  const deleteSideStory = async (ssId) => {
    const { error } = await supabase
      .from("side_stories")
      .delete()
      .eq("id", ssId);
    if (error) return { ok: false, message: error.message };
    await fetchAllData();
    return { ok: true };
  };

  // Đồng bộ 1 lần toàn bộ events.json & characters.json hiện tại lên Supabase
  const migrateJsonToSupabase = async () => {
    // 1. Đẩy Events
    const eventRows = fallbackEvents.map((ev, idx) => mapUiEventToDb(ev, idx));
    const { error: evErr } = await supabase
      .from("events")
      .upsert(eventRows, { onConflict: "id" });
    if (evErr) return { ok: false, message: "Lỗi đẩy Events: " + evErr.message };

    // 2. Đẩy Characters
    const charRows = fallbackCharacters.map((ch, idx) => ({
      id: ch.id,
      name: ch.name,
      jp_name: ch.jpName || "",
      en_name: ch.enName || "",
      unit: ch.unit,
      color: ch.color || "#00ccbb",
      avatar: ch.avatar || "",
      portrait: ch.portrait || "",
      profile: ch.profile || {},
      sort_order: idx,
    }));
    const { error: charErr } = await supabase
      .from("characters")
      .upsert(charRows, { onConflict: "id" });
    if (charErr) {
      return { ok: false, message: "Lỗi đẩy Characters: " + charErr.message };
    }

    // 3. Đẩy toàn bộ Side Stories đang có trong characters.json
    const sideStoryRows = [];
    fallbackCharacters.forEach((ch) => {
      (ch.sideStories || []).forEach((ss, idx) => {
        sideStoryRows.push({
          id: ss.id,
          character_id: ch.id,
          title: ss.title,
          rarity: String(ss.rarity || "4"),
          icon: ss.icon || "",
          part1_url: ss.part1Url || "",
          part2_url: ss.part2Url || "",
          sort_order: idx,
        });
      });
    });

    if (sideStoryRows.length > 0) {
      const { error: ssErr } = await supabase
        .from("side_stories")
        .upsert(sideStoryRows, { onConflict: "id" });
      if (ssErr) {
        return { ok: false, message: "Lỗi đẩy Side Stories: " + ssErr.message };
      }
    }

    await fetchAllData();
    return {
      ok: true,
      counts: {
        events: eventRows.length,
        characters: charRows.length,
        sideStories: sideStoryRows.length,
      },
    };
  };

  return (
    <DataContext.Provider
      value={{
        events,
        characters,
        dataLoading,
        isUsingDbEvents,
        isUsingDbChars,
        refreshData: fetchAllData,
        saveEvent,
        deleteEvent,
        saveSideStory,
        deleteSideStory,
        migrateJsonToSupabase,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData phải được dùng bên trong DataProvider");
  return ctx;
}