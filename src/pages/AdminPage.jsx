import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { resolveImageUrl } from "../utils/helpers";

const CLOUDINARY_FOLDERS = [
  {
    path: "web_sekai/banner_images",
    label: "Banner (5:2)",
    icon: "🖼️",
    hint: "Ảnh banner ngang cho danh sách bên trái",
  },
  {
    path: "web_sekai/bg_image",
    label: "Background (16:9)",
    icon: "🌄",
    hint: "Ảnh nền khung showcase 1920x1080",
  },
  {
    path: "web_sekai/cards",
    label: "Thẻ nhân vật",
    icon: "🃏",
    hint: "Ảnh thẻ Untrained / Trained",
  },
  {
    path: "web_sekai/event_logo",
    label: "Logo Event",
    icon: "✨",
    hint: "Logo PNG tách nền cho từng sự kiện",
  },
  {
    path: "web_sekai/stamp",
    label: "Stamp",
    icon: "🏷️",
    hint: "Sticker / Stamp nhân vật trong game",
  },
];

function formatBytes(bytes = 0) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function AdminPage() {
  const navigate = useNavigate();

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const [activeFolder, setActiveFolder] = useState(CLOUDINARY_FOLDERS[0].path);
  const [assets, setAssets] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState("");
  const [search, setSearch] = useState("");

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const isStampFolder = activeFolder === "web_sekai/stamp";

  const getAccessToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || "";
  };

  const fetchAssets = useCallback(async (folderPath, cursor = "") => {
    setLoadingList(true);
    setListError("");
    try {
      const token = await getAccessToken();
      let url = `/api/cloudinary-assets?folder=${encodeURIComponent(folderPath)}`;
      if (cursor) url += `&next_cursor=${encodeURIComponent(cursor)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Không tải được danh sách ảnh.");
      }

      if (cursor) {
        setAssets((prev) => [...prev, ...(data.resources || [])]);
      } else {
        setAssets(data.resources || []);
      }
      setNextCursor(data.next_cursor || null);
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    setSearch("");
    fetchAssets(activeFolder);
  }, [activeFolder, fetchAssets]);

  const handleUploadFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length === 0) return;

    if (!cloudName || !uploadPreset) {
      setUploadError(
        "Thiếu VITE_CLOUDINARY_CLOUD_NAME hoặc VITE_CLOUDINARY_UPLOAD_PRESET trong .env.local / Vercel."
      );
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadProgress({ done: 0, total: files.length });

    const uploadedItems = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("asset_folder", activeFolder);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error?.message || `Lỗi upload ${file.name}`);
        }

        uploadedItems.push({
          asset_id: data.asset_id,
          public_id: data.public_id,
          display_name:
            data.display_name || data.original_filename || file.name,
          format: data.format,
          width: data.width,
          height: data.height,
          bytes: data.bytes,
          secure_url: data.secure_url,
          created_at: data.created_at,
        });
      } catch (err) {
        errors.push(`${file.name}: ${err.message}`);
      }
      setUploadProgress({ done: i + 1, total: files.length });
    }

    if (uploadedItems.length > 0) {
      setAssets((prev) => [...uploadedItems.reverse(), ...prev]);
    }
    if (errors.length > 0) {
      setUploadError(errors.join(" | "));
    }
    setUploading(false);
  };

  const handleCopyUrl = async (item) => {
    try {
      await navigator.clipboard.writeText(item.secure_url);
      setCopiedId(item.public_id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      alert("Trình duyệt không hỗ trợ tự động copy. URL: " + item.secure_url);
    }
  };

  const handleDeleteAsset = async (item) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa vĩnh viễn ảnh "${item.display_name}" khỏi Cloudinary?\n(Nếu đang gắn link ảnh này trên web thì ảnh sẽ bị lỗi!)`
    );
    if (!confirmed) return;

    setDeletingId(item.public_id);
    try {
      const token = await getAccessToken();
      const res = await fetch(
        `/api/cloudinary-assets?public_id=${encodeURIComponent(item.public_id)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xóa thất bại.");

      setAssets((prev) => prev.filter((a) => a.public_id !== item.public_id));
    } catch (err) {
      alert("Lỗi khi xóa: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredAssets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return assets;
    return assets.filter(
      (a) =>
        (a.display_name || "").toLowerCase().includes(q) ||
        (a.public_id || "").toLowerCase().includes(q)
    );
  }, [assets, search]);

  const currentFolderMeta = CLOUDINARY_FOLDERS.find(
    (f) => f.path === activeFolder
  );

  return (
    <div className="space-y-5">
      {/* Thanh trên cùng */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border-[1.5px] border-border bg-surface hover:border-accent hover:text-accent transition"
          >
            ← Về trang chủ
          </button>
          <div>
            <h1 className="text-xl font-black flex items-center gap-2">
              <span>⚙️ Quản lý kho ảnh Cloudinary</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-900">
                ADMIN
              </span>
            </h1>
            <p className="text-xs text-muted">
              Upload, xem danh sách và lấy link ảnh trực tiếp theo từng thư mục
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={loadingList}
          onClick={() => fetchAssets(activeFolder)}
          className="px-4 py-2 rounded-full text-xs font-bold border-[1.5px] border-border bg-surface hover:border-accent hover:text-accent disabled:opacity-50 transition"
        >
          {loadingList ? "⏳ Đang tải..." : "🔄 Tải lại danh sách"}
        </button>
      </div>

      {/* Chọn thư mục (5 cột trên màn hình lớn) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {CLOUDINARY_FOLDERS.map((folder) => {
          const isActive = activeFolder === folder.path;
          return (
            <button
              key={folder.path}
              type="button"
              onClick={() => setActiveFolder(folder.path)}
              className={`p-3.5 rounded-2xl border-[1.5px] text-left transition ${
                isActive
                  ? "border-accent bg-accent-soft shadow-sm"
                  : "border-border bg-surface hover:border-accent/60"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{folder.icon}</span>
                <span className="text-[10px] font-bold text-muted font-mono">
                  {folder.path.replace("web_sekai/", "")}
                </span>
              </div>
              <div className="font-extrabold text-sm">{folder.label}</div>
              <div className="text-[11px] text-muted line-clamp-1 mt-0.5">
                {folder.hint}
              </div>
            </button>
          );
        })}
      </div>

      {/* Khu vực Upload ảnh vào thư mục đang chọn */}
      <section
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleUploadFiles(e.dataTransfer.files);
        }}
        className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
          isDragging
            ? "border-accent bg-accent-soft"
            : "border-border bg-surface hover:border-accent/60"
        }`}
      >
        <input
          id="cloudinary-file-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            handleUploadFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <div className="max-w-md mx-auto space-y-2.5">
          <div className="text-3xl">{isStampFolder ? "🏷️" : "☁️"}</div>
          <div className="text-sm font-extrabold">
            Upload {isStampFolder ? "Stamp" : "ảnh"} vào thư mục{" "}
            <code className="px-2 py-0.5 rounded bg-surface-alt border border-border text-accent">
              {activeFolder}
            </code>
          </div>
          <p className="text-xs text-muted">
            Kéo thả nhiều file vào đây hoặc bấm nút bên dưới để chọn file từ máy
            tính ({currentFolderMeta?.hint}).
          </p>

          <label
            htmlFor="cloudinary-file-input"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold bg-accent text-white cursor-pointer hover:brightness-105 transition shadow-sm ${
              uploading ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            {uploading
              ? `⏳ Đang tải lên (${uploadProgress.done}/${uploadProgress.total})...`
              : isStampFolder
              ? "📤 Chọn Stamp để Upload"
              : "📤 Chọn ảnh để Upload"}
          </label>

          {uploadError && (
            <p className="text-xs font-semibold text-rose-500 bg-rose-500/10 px-3 py-2 rounded-lg">
              {uploadError}
            </p>
          )}
        </div>
      </section>

      {/* Thư viện ảnh đã có trong thư mục */}
      <section className="bg-surface border-[1.5px] border-border rounded-2xl sekai-shadow overflow-hidden">
        <div className="px-4 py-3 border-b-[1.5px] border-border bg-surface-alt flex items-center justify-between gap-3 flex-wrap">
          <div className="font-extrabold text-sm">
            {currentFolderMeta?.icon} {isStampFolder ? "Stamp" : "Ảnh"} trong{" "}
            <span className="text-accent">{activeFolder}</span> (
            {filteredAssets.length})
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isStampFolder ? "Tìm theo tên stamp..." : "Tìm theo tên file..."
            }
            className="w-full sm:w-64 px-3.5 py-1.5 rounded-full text-xs border-[1.5px] border-border bg-surface outline-none focus:border-accent"
          />
        </div>

        <div className="p-4">
          {listError ? (
            <div className="text-center py-8 text-xs font-semibold text-rose-500 bg-rose-500/10 rounded-xl px-4">
              {listError}
            </div>
          ) : loadingList && assets.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted font-semibold">
              ⏳ Đang tải danh sách từ Cloudinary...
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted">
              Chưa có {isStampFolder ? "stamp" : "ảnh"} nào trong thư mục này.
            </div>
          ) : (
            <div
              className={
                isStampFolder
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              }
            >
              {filteredAssets.map((item) => {
                const isCopied = copiedId === item.public_id;
                const isDeleting = deletingId === item.public_id;

                return (
                  <div
                    key={item.public_id}
                    className="rounded-xl border-[1.5px] border-border bg-surface-alt overflow-hidden flex flex-col"
                  >
                    <div
                      className={`relative bg-slate-900/10 dark:bg-slate-900 flex items-center justify-center overflow-hidden ${
                        isStampFolder ? "aspect-square p-2.5" : "aspect-video"
                      }`}
                    >
                      <img
                        src={resolveImageUrl(item.secure_url)}
                        alt={item.display_name}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                      {item.format && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/65 text-white text-[10px] font-bold uppercase">
                          {item.format}
                        </span>
                      )}
                    </div>

                    <div className="p-3 flex flex-col flex-1 gap-2">
                      <div
                        className="text-xs font-extrabold truncate"
                        title={item.display_name}
                      >
                        {item.display_name}
                      </div>
                      <div className="text-[11px] text-muted flex items-center justify-between">
                        <span>
                          {item.width && item.height
                            ? `${item.width}×${item.height}`
                            : "—"}
                        </span>
                        <span>{formatBytes(item.bytes)}</span>
                      </div>

                      <div className="mt-auto pt-2 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(item)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-[11.5px] font-bold transition ${
                            isCopied
                              ? "bg-emerald-500 text-white"
                              : "bg-accent text-white hover:brightness-105"
                          }`}
                        >
                          {isCopied ? "✓ Đã copy!" : "📋 Copy Link"}
                        </button>

                        <a
                          href={item.secure_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-border bg-surface hover:border-accent text-xs"
                          title="Mở ảnh gốc"
                        >
                          ↗
                        </a>

                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDeleteAsset(item)}
                          className="p-1.5 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white text-xs disabled:opacity-50 transition"
                          title="Xóa ảnh khỏi Cloudinary"
                        >
                          {isDeleting ? "⏳" : "🗑️"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {nextCursor && (
            <div className="mt-5 text-center">
              <button
                type="button"
                disabled={loadingList}
                onClick={() => fetchAssets(activeFolder, nextCursor)}
                className="px-5 py-2 rounded-full text-xs font-bold border-[1.5px] border-border bg-surface-alt hover:border-accent hover:text-accent transition"
              >
                {loadingList ? "Đang tải..." : "Tải thêm"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}