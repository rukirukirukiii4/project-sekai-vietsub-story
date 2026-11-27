import { useState, useMemo } from "react";
import { useData } from "../../contexts/DataContext";
import { UNITS } from "../../constants/units";
import { resolveImageUrl } from "../../utils/helpers";

const STORY_TYPES = [
  { value: "event", label: "Event Story" },
  { value: "main", label: "Main Story" },
  { value: "mixed", label: "Mixed Event" },
  { value: "compilation", label: "Tổng hợp (Compilation)" },
];

const createEmptyChapter = (ep = 1) => ({
  ep: String(ep),
  title: "",
  youtube: "",
});

const createEmptyCard = () => ({
  character: "",
  title: "",
  rarity: 4,
  untrained: "",
  trained: "",
  sideStory1: "",
  sideStory2: "",
});

const createInitialForm = () => ({
  id: "",
  number: "",
  title: "",
  jpTitle: "",
  unit: "ln",
  type: "event",
  keyStory: true,
  date: String(new Date().getFullYear()),
  banner: "",
  bgImage: "",
  logo: "",
  summary: "",
  chapters: [createEmptyChapter(1)],
  cards: [createEmptyCard()],
  sortOrder: undefined,
});

export default function StoryBuilder() {
  const { events, characters, saveEvent, deleteEvent } = useData();

  const [form, setForm] = useState(createInitialForm);
  const [editingId, setEditingId] = useState(null); // null = tạo mới, có id = đang sửa
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  const isDuplicateId = useMemo(() => {
    const cleanId = form.id.trim();
    if (!cleanId || editingId === cleanId) return false;
    return events.some((ev) => ev.id === cleanId);
  }, [form.id, editingId, events]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Chọn 1 Event có sẵn để sửa
  const handleSelectEdit = (ev) => {
    setEditingId(ev.id);
    setStatusMsg({ type: "", text: "" });
    setForm({
      id: ev.id,
      number: ev.number || "",
      title: ev.title || "",
      jpTitle: ev.jpTitle || "",
      unit: ev.unit || "ln",
      type: ev.type || "event",
      keyStory: Boolean(ev.keyStory),
      date: ev.date || "",
      banner: ev.banner || "",
      bgImage: ev.bgImage || "",
      logo: ev.logo || "",
      summary: ev.summary || "",
      chapters:
        ev.chapters && ev.chapters.length > 0
          ? ev.chapters.map((c) => ({
              ep: String(c.ep ?? ""),
              title: c.title || "",
              youtube: c.youtube || "",
            }))
          : [createEmptyChapter(1)],
      cards:
        ev.cards && ev.cards.length > 0
          ? ev.cards.map((c) => ({
              character: c.character || "",
              title: c.title || "",
              rarity: Number(c.rarity) || 4,
              untrained: c.untrained || "",
              trained: c.trained || "",
              sideStory1: c.sideStory1 || "",
              sideStory2: c.sideStory2 || "",
            }))
          : [createEmptyCard()],
      sortOrder: ev.sortOrder,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Chapters (ít nhất 1)
  const handleAddChapter = () => {
    setForm((prev) => {
      const lastEp = String(
        prev.chapters[prev.chapters.length - 1]?.ep ?? ""
      ).trim();
      const nextEp = /^\d+$/.test(lastEp)
        ? Number(lastEp) + 1
        : lastEp.toUpperCase() === "OP"
        ? 1
        : prev.chapters.length + 1;

      return {
        ...prev,
        chapters: [...prev.chapters, createEmptyChapter(nextEp)],
      };
    });
  };

  const handleUpdateChapter = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) =>
        i === index ? { ...ch, [field]: value } : ch
      ),
    }));
  };

  const handleRemoveChapter = (index) => {
    if (form.chapters.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index),
    }));
  };

  // Cards (ít nhất 1)
  const handleAddCard = () => {
    setForm((prev) => ({
      ...prev,
      cards: [...prev.cards, createEmptyCard()],
    }));
  };

  const handleUpdateCard = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      cards: prev.cards.map((card, i) =>
        i === index ? { ...card, [field]: value } : card
      ),
    }));
  };

  const handleRemoveCard = (index) => {
    if (form.cards.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }));
  };

  const handleReset = () => {
    setEditingId(null);
    setStatusMsg({ type: "", text: "" });
    setForm(createInitialForm());
  };

  // Bấm HOÀN TẤT -> Lưu thẳng lên Supabase
  const handleSubmitStory = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: "", text: "" });

    const cleanId = form.id.trim();
    const cleanTitle = form.title.trim();

    if (!cleanId || !cleanTitle) {
      setStatusMsg({
        type: "error",
        text: "Vui lòng nhập đầy đủ ID Story và Tên tiếng Việt!",
      });
      return;
    }

    if (isDuplicateId) {
      setStatusMsg({
        type: "error",
        text: `ID "${cleanId}" đã tồn tại! Hãy đổi ID khác hoặc bấm Sửa ở danh sách bên dưới.`,
      });
      return;
    }

    if (form.chapters.some((c) => !c.title.trim())) {
      setStatusMsg({
        type: "error",
        text: "Có tập Chapter chưa nhập tiêu đề!",
      });
      return;
    }

    if (form.cards.some((c) => !c.character.trim() || !c.title.trim())) {
      setStatusMsg({
        type: "error",
        text: "Có Thẻ (Card) chưa nhập tên nhân vật hoặc tên thẻ!",
      });
      return;
    }

    const payload = {
      id: cleanId,
      number: form.number.trim(),
      title: cleanTitle,
      jpTitle: form.jpTitle.trim(),
      unit: form.unit,
      type: form.type,
      keyStory: Boolean(form.keyStory),
      date: form.date.trim(),
      banner: form.banner.trim(),
      bgImage: form.bgImage.trim(),
      logo: form.logo.trim(),
      summary: form.summary.trim(),
      sortOrder: form.sortOrder,
      chapters: form.chapters.map((ch, idx) => {
        const rawEp = String(ch.ep ?? "").trim();
        return {
          ep: /^\d+$/.test(rawEp) ? Number(rawEp) : rawEp || idx + 1,
          title: ch.title.trim(),
          youtube: ch.youtube.trim(),
        };
      }),
      cards: form.cards.map((card) => ({
        character: card.character.trim(),
        title: card.title.trim(),
        rarity: Number(card.rarity) || 4,
        untrained: card.untrained.trim(),
        trained: card.trained.trim(),
        sideStory1: card.sideStory1.trim(),
        sideStory2: card.sideStory2.trim(),
      })),
    };

    setSaving(true);
    const res = await saveEvent(payload);
    setSaving(false);

    if (!res.ok) {
      setStatusMsg({ type: "error", text: "Lỗi lưu Supabase: " + res.message });
      return;
    }

    setStatusMsg({
      type: "success",
      text: editingId
        ? `✓ Đã cập nhật "${cleanTitle}" lên website!`
        : `✓ Đã đăng mới "${cleanTitle}" lên website thành công!`,
    });

    if (!editingId) {
      setForm(createInitialForm());
    }
  };

  const handleDeleteEvent = async (ev) => {
    if (!window.confirm(`Bạn có chắc muốn xóa Story "${ev.title}"?`)) return;
    const res = await deleteEvent(ev.id);
    if (!res.ok) {
      alert("Lỗi xóa: " + res.message);
      return;
    }
    if (editingId === ev.id) handleReset();
  };

  return (
    <div className="space-y-6">
      <datalist id="sekai-character-names">
        {characters.map((c) => (
          <option key={c.id} value={c.name} />
        ))}
      </datalist>

      <form onSubmit={handleSubmitStory} className="space-y-5">
        {/* 1. THÔNG TIN CHUNG */}
        <section className="bg-surface border-[1.5px] border-border rounded-2xl p-4 md:p-5 sekai-shadow space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-border pb-3">
            <div>
              <h2 className="text-base font-extrabold">
                {editingId
                  ? `✏️ Đang chỉnh sửa Story: ${editingId}`
                  : "1. Tạo Story / Event mới"}
              </h2>
              <p className="text-xs text-muted">
                Bấm Hoàn tất ở cuối trang để lưu thẳng lên Database Supabase
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-border bg-surface-alt hover:border-accent transition"
            >
              {editingId ? "✕ Hủy sửa (Tạo mới)" : "🔄 Làm mới Form"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-muted mb-1">
                ID Story *
              </label>
              <input
                type="text"
                disabled={Boolean(editingId)}
                value={form.id}
                onChange={(e) => updateField("id", e.target.value)}
                placeholder='Ví dụ: "3" hoặc "ev3-story"'
                className={`w-full px-3 py-2 rounded-xl text-xs border-[1.5px] bg-surface-alt outline-none focus:border-accent disabled:opacity-60 ${
                  isDuplicateId ? "border-rose-500" : "border-border"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted mb-1">
                Số thứ tự (number)
              </label>
              <input
                type="text"
                value={form.number}
                onChange={(e) => updateField("number", e.target.value)}
                placeholder="Ví dụ: Event #3"
                className="w-full px-3 py-2 rounded-xl text-xs border-[1.5px] border-border bg-surface-alt outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted mb-1">
                Nhóm nhạc (unit)
              </label>
              <select
                value={form.unit}
                onChange={(e) => updateField("unit", e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold border-[1.5px] border-border bg-surface-alt outline-none focus:border-accent"
              >
                {Object.entries(UNITS)
                  .filter(([key]) => key !== "all")
                  .map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.name} ({key})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted mb-1">
                Loại truyện (type)
              </label>
              <select
                value={form.type}
                onChange={(e) => updateField("type", e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold border-[1.5px] border-border bg-surface-alt outline-none focus:border-accent"
              >
                {STORY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-muted mb-1">
                Tên tiếng Việt (title) *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Tên Event tiếng Việt..."
                className="w-full px-3 py-2 rounded-xl text-xs border-[1.5px] border-border bg-surface-alt outline-none focus:border-accent"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-muted mb-1">
                Tên gốc / tiếng Nhật (jpTitle)
              </label>
              <input
                type="text"
                value={form.jpTitle}
                onChange={(e) => updateField("jpTitle", e.target.value)}
                placeholder="Ví dụ: 全力！ワンダーハロウィン！"
                className="w-full px-3 py-2 rounded-xl text-xs border-[1.5px] border-border bg-surface-alt outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted mb-1">
                Năm phát hành (date)
              </label>
              <input
                type="text"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
                placeholder="2020"
                className="w-full px-3 py-2 rounded-xl text-xs border-[1.5px] border-border bg-surface-alt outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-end pb-1.5">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold select-none">
                <input
                  type="checkbox"
                  checked={form.keyStory}
                  onChange={(e) => updateField("keyStory", e.target.checked)}
                  className="w-4 h-4 accent-[var(--accent)] rounded"
                />
                <span>✦ Là Key Story</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {[
              { key: "banner", label: "Link Banner (5:2)" },
              { key: "bgImage", label: "Link Background (16:9)" },
              { key: "logo", label: "Link Logo Event" },
            ].map((imgField) => (
              <div key={imgField.key} className="space-y-1.5">
                <label className="block text-xs font-bold text-muted">
                  {imgField.label}
                </label>
                <input
                  type="text"
                  value={form[imgField.key]}
                  onChange={(e) => updateField(imgField.key, e.target.value)}
                  placeholder="Dán link Cloudinary hoặc /..."
                  className="w-full px-3 py-2 rounded-xl text-xs border-[1.5px] border-border bg-surface-alt outline-none focus:border-accent"
                />
                {form[imgField.key] && (
                  <div className="h-16 rounded-lg border border-border bg-slate-900/10 dark:bg-slate-900 overflow-hidden flex items-center justify-center p-1">
                    <img
                      src={resolveImageUrl(form[imgField.key])}
                      alt={imgField.label}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-muted mb-1">
              Tóm tắt nội dung (summary)
            </label>
            <textarea
              rows={3}
              value={form.summary}
              onChange={(e) => updateField("summary", e.target.value)}
              placeholder="Nhập đoạn tóm tắt ngắn cho Story..."
              className="w-full px-3 py-2 rounded-xl text-xs border-[1.5px] border-border bg-surface-alt outline-none focus:border-accent leading-relaxed"
            />
          </div>
        </section>

        {/* 2. CHAPTERS (Tối thiểu 1) */}
        <section className="bg-surface border-[1.5px] border-border rounded-2xl p-4 md:p-5 sekai-shadow space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-border pb-3">
            <div>
              <h2 className="text-base font-extrabold">
                2. Danh sách Chapter ({form.chapters.length} tập)
              </h2>
              <p className="text-xs text-muted">
                Tối thiểu 1 tập. Ô EP hỗ trợ số (1, 2) hoặc chữ (OP, LN...)
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddChapter}
              className="px-4 py-2 rounded-full text-xs font-extrabold bg-accent text-white hover:brightness-105 transition"
            >
              + Thêm Chapter
            </button>
          </div>

          <div className="space-y-2.5">
            {form.chapters.map((ch, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-[90px_1fr_1fr_auto] gap-2.5 items-center p-3 rounded-xl bg-surface-alt border border-border"
              >
                <input
                  type="text"
                  value={ch.ep}
                  onChange={(e) =>
                    handleUpdateChapter(idx, "ep", e.target.value)
                  }
                  placeholder="EP"
                  className="w-full px-3 py-2 rounded-lg text-xs font-bold text-center border border-border bg-surface outline-none focus:border-accent"
                />
                <input
                  type="text"
                  value={ch.title}
                  onChange={(e) =>
                    handleUpdateChapter(idx, "title", e.target.value)
                  }
                  placeholder={`Tên tập ${idx + 1}...`}
                  className="w-full px-3 py-2 rounded-lg text-xs border border-border bg-surface outline-none focus:border-accent"
                />
                <input
                  type="text"
                  value={ch.youtube}
                  onChange={(e) =>
                    handleUpdateChapter(idx, "youtube", e.target.value)
                  }
                  placeholder="https://youtu.be/..."
                  className="w-full px-3 py-2 rounded-lg text-xs border border-border bg-surface outline-none focus:border-accent"
                />
                <button
                  type="button"
                  disabled={form.chapters.length <= 1}
                  onClick={() => handleRemoveChapter(idx)}
                  className="px-3 py-2 rounded-lg text-xs font-bold border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white disabled:opacity-35 disabled:cursor-not-allowed transition"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. CARDS (Tối thiểu 1) */}
        <section className="bg-surface border-[1.5px] border-border rounded-2xl p-4 md:p-5 sekai-shadow space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-border pb-3">
            <div>
              <h2 className="text-base font-extrabold">
                3. Danh sách Thẻ / Cards ({form.cards.length} thẻ)
              </h2>
              <p className="text-xs text-muted">Tối thiểu 1 thẻ.</p>
            </div>
            <button
              type="button"
              onClick={handleAddCard}
              className="px-4 py-2 rounded-full text-xs font-extrabold bg-accent text-white hover:brightness-105 transition"
            >
              + Thêm Thẻ (Card)
            </button>
          </div>

          <div className="space-y-3.5">
            {form.cards.map((card, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-surface-alt border-[1.5px] border-border space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-accent-soft text-accent">
                    Thẻ #{idx + 1}
                  </span>
                  <button
                    type="button"
                    disabled={form.cards.length <= 1}
                    onClick={() => handleRemoveCard(idx)}
                    className="px-3 py-1 rounded-lg text-xs font-bold border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white disabled:opacity-35 disabled:cursor-not-allowed transition"
                  >
                    🗑️ Xóa thẻ
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    list="sekai-character-names"
                    value={card.character}
                    onChange={(e) =>
                      handleUpdateCard(idx, "character", e.target.value)
                    }
                    placeholder="Nhân vật (ví dụ: Asahina Mafuyu)"
                    className="w-full px-3 py-2 rounded-lg text-xs border border-border bg-surface outline-none focus:border-accent"
                  />
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) =>
                      handleUpdateCard(idx, "title", e.target.value)
                    }
                    placeholder="Tên thẻ..."
                    className="w-full px-3 py-2 rounded-lg text-xs border border-border bg-surface outline-none focus:border-accent"
                  />
                  <select
                    value={card.rarity}
                    onChange={(e) =>
                      handleUpdateCard(idx, "rarity", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 rounded-lg text-xs font-bold border border-border bg-surface outline-none focus:border-accent"
                  >
                    <option value={4}>★★★★ (4 sao)</option>
                    <option value={3}>★★★ (3 sao)</option>
                    <option value={2}>★★ (2 sao)</option>
                    <option value={1}>★ (1 sao)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={card.untrained}
                      onChange={(e) =>
                        handleUpdateCard(idx, "untrained", e.target.value)
                      }
                      placeholder="Link ảnh chưa thức tỉnh (untrained)"
                      className="w-full px-3 py-2 rounded-lg text-xs border border-border bg-surface outline-none focus:border-accent"
                    />
                    {card.untrained && (
                      <img
                        src={resolveImageUrl(card.untrained)}
                        alt="Untrained"
                        className="h-20 rounded-lg border border-border object-cover"
                      />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={card.trained}
                      onChange={(e) =>
                        handleUpdateCard(idx, "trained", e.target.value)
                      }
                      placeholder="Link ảnh đã thức tỉnh (trained - bỏ trống nếu 2★)"
                      className="w-full px-3 py-2 rounded-lg text-xs border border-border bg-surface outline-none focus:border-accent"
                    />
                    {card.trained && (
                      <img
                        src={resolveImageUrl(card.trained)}
                        alt="Trained"
                        className="h-20 rounded-lg border border-border object-cover"
                      />
                    )}
                  </div>

                  <input
                    type="text"
                    value={card.sideStory1}
                    onChange={(e) =>
                      handleUpdateCard(idx, "sideStory1", e.target.value)
                    }
                    placeholder="Link Side Story 1 (tùy chọn)"
                    className="w-full px-3 py-2 rounded-lg text-xs border border-border bg-surface outline-none focus:border-accent"
                  />
                  <input
                    type="text"
                    value={card.sideStory2}
                    onChange={(e) =>
                      handleUpdateCard(idx, "sideStory2", e.target.value)
                    }
                    placeholder="Link Side Story 2 (tùy chọn)"
                    className="w-full px-3 py-2 rounded-lg text-xs border border-border bg-surface outline-none focus:border-accent"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NÚT HOÀN TẤT LƯU THẲNG LÊN SUPABASE */}
        <div className="bg-surface border-[1.5px] border-border rounded-2xl p-4 md:p-5 sekai-shadow flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex-1">
            {statusMsg.text ? (
              <p
                className={`text-xs font-bold px-3 py-2 rounded-xl ${
                  statusMsg.type === "error"
                    ? "text-rose-500 bg-rose-500/10"
                    : "text-emerald-600 bg-emerald-500/10"
                }`}
              >
                {statusMsg.text}
              </p>
            ) : (
              <p className="text-xs text-muted">
                Dữ liệu sẽ được lưu trực tiếp lên Supabase và hiển thị ngay cho
                tất cả người dùng.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-7 py-3 rounded-full text-sm font-black bg-accent text-white hover:brightness-105 disabled:opacity-50 transition shadow-md"
          >
            {saving
              ? "⏳ Đang lưu lên Supabase..."
              : editingId
              ? "💾 Lưu thay đổi Story"
              : "✅ Hoàn tất & Đăng lên Web"}
          </button>
        </div>
      </form>

      {/* DANH SÁCH STORY ĐANG CÓ ĐỂ SỬA / XÓA NHANH */}
      <section className="bg-surface border-[1.5px] border-border rounded-2xl p-4 md:p-5 sekai-shadow space-y-3">
        <h3 className="text-sm font-extrabold">
          📚 Danh sách Story hiện có ({events.length}) — Bấm để Sửa / Xóa
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-alt border border-border"
            >
              <div className="min-w-0">
                <div className="text-xs font-extrabold truncate">
                  {ev.title}
                </div>
                <div className="text-[11px] text-muted truncate">
                  ID: {ev.id} • {ev.chapters?.length || 0} tập •{" "}
                  {ev.cards?.length || 0} thẻ
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSelectEdit(ev)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border border-border bg-surface hover:border-accent hover:text-accent transition"
                >
                  ✏️ Sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteEvent(ev)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white transition"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}