import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function AuthModal({ isOpen, onClose }) {
  const { currentUser, isAdmin, loginWithGoogle, logout } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError("");
    setSubmitting(true);
    const result = await loginWithGoogle();
    if (!result.ok) {
      setError(result.message || "Không thể kết nối với Google.");
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setSubmitting(true);
    await logout();
    setSubmitting(false);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-surface border-[1.5px] border-border rounded-[16px] sekai-shadow overflow-hidden"
      >
        <div className="px-5 py-4 border-b-[1.5px] border-border bg-surface-alt flex items-center justify-between">
          <h2 className="text-base font-extrabold">
            {currentUser ? "Thông tin tài khoản" : "Đăng nhập SEKAI STORY"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-border/60 flex items-center justify-center font-bold text-muted"
          >
            ✕
          </button>
        </div>

        {currentUser ? (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-surface-alt border border-border">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover shrink-0 border border-border"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-accent text-white font-extrabold text-lg flex items-center justify-center shrink-0">
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-base truncate">
                    {currentUser.displayName}
                  </span>
                  {isAdmin ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-900 shrink-0">
                      ★ ADMIN
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-muted shrink-0">
                      Guest
                    </span>
                  )}
                </div>

                <div className="text-xs text-muted truncate">
                  {currentUser.email}
                </div>

                <div className="text-[11px] font-semibold text-emerald-500 mt-0.5">
                  ✓ Trực tuyến •{" "}
                  {isAdmin ? "Quyền quản trị viên" : "Tài khoản thành viên"}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl text-sm font-bold border-[1.5px] border-rose-500/40 text-rose-500 hover:bg-rose-500 hover:text-white disabled:opacity-50 transition"
            >
              {submitting ? "Đang xử lý..." : "Đăng xuất"}
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4 text-center">
            <p className="text-sm text-muted leading-relaxed">
              Đăng nhập bằng tài khoản Google để lưu và đồng bộ tiến độ đọc
              Story trên mọi thiết bị của bạn.
            </p>

            {error && (
              <p className="text-xs font-semibold text-rose-500 bg-rose-500/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="button"
              disabled={submitting}
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold border-[1.5px] border-border bg-surface-alt hover:border-accent flex items-center justify-center gap-3 transition disabled:opacity-50 shadow-sm"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                />
              </svg>
              <span>
                {submitting ? "Đang chuyển hướng..." : "Tiếp tục với Google"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}