import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";

// Tạo cặp nonce bảo mật theo chuẩn khuyến nghị của Supabase + Google
async function generateNonce() {
  const rawNonce = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
  );
  const encoded = new TextEncoder().encode(rawNonce);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashedNonce = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return [rawNonce, hashedNonce];
}

export default function AuthModal({ isOpen, onClose }) {
  const { currentUser, isAdmin, loginWithGoogleIdToken, logout } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen || currentUser) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError("Thiếu biến VITE_GOOGLE_CLIENT_ID trong .env.local / Vercel.");
      return;
    }

    let cancelled = false;
    let pollTimer = null;

    const initGoogleButton = async () => {
      if (cancelled || !googleBtnRef.current) return;

      const [rawNonce, hashedNonce] = await generateNonce();
      if (cancelled || !googleBtnRef.current) return;

      const isDarkMode = document.documentElement.classList.contains("dark");

      window.google.accounts.id.initialize({
        client_id: clientId,
        nonce: hashedNonce,
        callback: async (response) => {
          setError("");
          setSubmitting(true);
          const result = await loginWithGoogleIdToken(
            response.credential,
            rawNonce
          );
          setSubmitting(false);

          if (!result.ok) {
            setError(result.message || "Đăng nhập Google thất bại.");
          } else {
            onClose();
          }
        },
      });

      googleBtnRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: isDarkMode ? "filled_black" : "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        locale: "vi",
        width: 300,
      });
    };

    if (window.google?.accounts?.id) {
      initGoogleButton();
    } else {
      // Đợi script Google tải xong nếu mạng chậm
      pollTimer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(pollTimer);
          initGoogleButton();
        }
      }, 150);
    }

    return () => {
      cancelled = true;
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [isOpen, currentUser, loginWithGoogleIdToken, onClose]);

  if (!isOpen) return null;

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

            {submitting ? (
              <div className="py-3 text-sm font-bold text-accent">
                ⏳ Đang xác thực đăng nhập...
              </div>
            ) : (
              <div className="flex justify-center min-h-[44px]">
                <div ref={googleBtnRef} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}