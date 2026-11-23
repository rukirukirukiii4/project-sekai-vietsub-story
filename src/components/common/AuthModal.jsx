import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function AuthModal({ isOpen, onClose }) {
  const { currentUser, register, login, logout } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setDisplayName("");
    setEmail("");
    setPassword("");
    setError("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      const result =
        mode === "login"
          ? await login({ email, password })
          : await register({ displayName, email, password });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      if (result.needsConfirm) {
        setSuccessMsg(result.message);
        return;
      }

      resetForm();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setSubmitting(true);
    await logout();
    setSubmitting(false);
    resetForm();
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
            {currentUser ? "Thông tin tài khoản" : "Tài khoản SEKAI STORY"}
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
              <div className="w-11 h-11 rounded-full bg-accent text-white font-extrabold text-lg flex items-center justify-center shrink-0">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-base truncate">
                  {currentUser.displayName}
                </div>
                <div className="text-xs text-muted truncate">
                  {currentUser.email}
                </div>
                <div className="text-[11px] font-semibold text-emerald-500 mt-0.5">
                  ✓ Đã xác thực
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
          <div className="p-5">
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-surface-alt border border-border mb-4">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccessMsg("");
                }}
                className={`py-2 rounded-lg text-xs font-extrabold transition ${
                  mode === "login"
                    ? "bg-accent text-white shadow-sm"
                    : "text-muted hover:text-[var(--text)]"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setSuccessMsg("");
                }}
                className={`py-2 rounded-lg text-xs font-extrabold transition ${
                  mode === "register"
                    ? "bg-accent text-white shadow-sm"
                    : "text-muted hover:text-[var(--text)]"
                }`}
              >
                Tạo tài khoản
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-bold text-muted mb-1">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ví dụ: Kanade Fan"
                    className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-border bg-surface-alt text-sm outline-none focus:border-accent"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-muted mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tenban@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-border bg-surface-alt text-sm outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ít nhất 6 ký tự"
                  className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-border bg-surface-alt text-sm outline-none focus:border-accent"
                />
              </div>

              {error && (
                <p className="text-xs font-semibold text-rose-500 bg-rose-500/10 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              {successMsg && (
                <p className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-2 rounded-lg">
                  {successMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl text-sm font-extrabold bg-accent text-white hover:brightness-105 disabled:opacity-50 transition mt-2"
              >
                {submitting
                  ? "Đang xử lý..."
                  : mode === "login"
                  ? "Đăng nhập ngay"
                  : "Tạo tài khoản"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}