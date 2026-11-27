import { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { resolveImageUrl } from "../../utils/helpers";

export default function SideStoryBuilder() {
  const { characters, saveSideStory, deleteSideStory } = useData();
  const [selectedCharId, setSelectedCharId] = useState(
    characters[0]?.id || "miku"
  );
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [rarity, setRarity] = useState("4");
  const [icon, setIcon] = useState("");
  const [part1Url, setPart1Url] = useState("");
  const [part2Url, setPart2Url] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const activeChar = characters.find((c) => c.id === selectedCharId);
  const sideStories = activeChar?.sideStories || [];

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setRarity("4");
    setIcon("");
    setPart1Url("");
    setPart2Url("");
  };

  const handleEdit = (ss) => {
    setEditingId(ss.id);
    setTitle(ss.title || "");
    setRarity(String(ss.rarity || "4"));
    setIcon(ss.icon || "");
    setPart1Url(ss.part1Url || "");
    setPart2Url(ss.part2Url || "");
    setMsg({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!title.trim()) {
      setMsg({ type: "error", text: "Vui lòng nhập tên thẻ Side Story." });
      return;
    }

    setSaving(true);
    const id = editingId || `${selectedCharId}-${Date.now()}`;
    const res = await saveSideStory({
      id,
      characterId: selectedCharId,
      title: title.trim(),
      rarity,
      icon: icon.trim(),
      part1Url: part1Url.trim(),
      part2Url: part2Url.trim(),
    });
    setSaving(false);

    if (!res.ok) {
      setMsg({ type: "error", text: "Lỗi lưu: " + res.message });
      return;
    }

    setMsg({
      type: "success",
      text: editingId
        ? "✓ Đã cập nhật thẻ Side Story!"
        : `✓ Đã thêm thẻ mới cho ${activeChar?.name}!`,
    });
    resetForm();
  };

  const handleDelete = async (ss) => {
    if (!window.confirm(`Xóa thẻ "${ss.title}"?`)) return;
    const res = await deleteSideStory(ss.id);
    if (!res.ok) alert("Lỗi xóa: " + res.message);
  };

  return (
    <div className="space-y-5">
      <form
        onSubmit={handleSubmit}
        className="bg-surface border-[1.5px] border-border rounded-2xl p-4 md:p-5 sekai-shadow space-y-4"
      >
        <div className="flex items-center justify-between gap-2 flex-wrap border-b border-border pb-3">
          <h2 className="text-base font-extrabold">
            {editingId
              ? "✏️ Sửa thẻ Side Story"
              : "🃏 Thêm thẻ Side Story mới"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-1 rounded-full text-xs font-bold border border-border bg-surface-alt"
            >
              ✕ Hủy sửa
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-muted mb-1">
              Nhân vật
            </label>
            <select
              disabled={Boolean(editingId)}
              value={selectedCharId}
              onChange={(e) => {
                setSelectedCharId(e.target.value);
                resetForm();
              }}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold border-[1.5px] border-border bg-surface-alt outline-none focus:border-accent disabled:opacity-60"
            >
              {characters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name} ({ch.sideStories?.length || 0} thẻ)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted mb-1">
              Tên thẻ *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Masquerade gò bó"
              className="w-full px-3 py-2 rounded-xl text-xs border-[1.5px] border-border bg-surface-alt outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted mb-1">
              Độ hiếm
            </label>
            <select
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold border-[1.5px] border-border bg-surface-alt outline-none focus:border-accent"
            >
              <option value="4">★★★★ (4 sao)</option>
              <option value="bd">🎂 Birthday (BD)</option>
              <option value="3">★★★ (3 sao)</option>
              <option value="2">★★ (2 sao)</option>
              <option value="1">★ (1 sao)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-muted mb-1">
              Link ảnh Icon thẻ
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="w-full px-3 py-2 rounded-xl text-xs border-[1.5px] border-border bg-surface-alt outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted mb-1">
              Link Facebook Phần 1
            </label>
            <input
              type="text"
              value={part1Url}
              onChange={(e) => setPart1Url(e.target.value)}
              placeholder="https://www.facebook.com/..."
              className="w-full px-3 py-2 rounded-xl text-xs border-[1.5px] border-border bg-surface-alt outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted mb-1">
              Link Facebook Phần 2
            </label>
            <input
              type="text"
              value={part2Url}
              onChange={(e) => setPart2Url(e.target.value)}
              placeholder="https://www.facebook.com/..."
              className="w-full px-3 py-2 rounded-xl text-xs border-[1.5px] border-border bg-surface-alt outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
          <div>
            {msg.text && (
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                  msg.type === "error"
                    ? "text-rose-500 bg-rose-500/10"
                    : "text-emerald-600 bg-emerald-500/10"
                }`}
              >
                {msg.text}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full text-xs font-black bg-accent text-white hover:brightness-105 disabled:opacity-50 transition"
          >
            {saving
              ? "⏳ Đang lưu..."
              : editingId
              ? "💾 Cập nhật Side Story"
              : "✅ Hoàn tất & Thêm thẻ"}
          </button>
        </div>
      </form>

      {/* Danh sách thẻ của nhân vật đang chọn */}
      <section className="bg-surface border-[1.5px] border-border rounded-2xl p-4 md:p-5 sekai-shadow space-y-3">
        <h3 className="text-sm font-extrabold">
          Side Story của {activeChar?.name} ({sideStories.length} thẻ)
        </h3>
        {sideStories.length === 0 ? (
          <p className="text-xs text-muted py-4">
            Nhân vật này chưa có Side Story nào.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {sideStories.map((ss) => (
              <div
                key={ss.id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-surface-alt border border-border"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {ss.icon && (
                    <img
                      src={resolveImageUrl(ss.icon)}
                      alt={ss.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 border border-border"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold truncate">
                      {ss.title}
                    </div>
                    <div className="text-[11px] text-muted">
                      Độ hiếm: {ss.rarity}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(ss)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold border border-border bg-surface hover:border-accent"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ss)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}