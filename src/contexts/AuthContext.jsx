import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AuthContext = createContext(null);

function formatSupabaseUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    displayName:
      user.user_metadata?.display_name || user.email?.split("@")[0] || "User",
  };
}

function translateAuthError(message = "") {
  const msg = message.toLowerCase();
  if (msg.includes("invalid login credentials")) {
    return "Sai email hoặc mật khẩu.";
  }
  if (msg.includes("user already registered")) {
    return "Email này đã được đăng ký.";
  }
  if (msg.includes("email not confirmed")) {
    return "Tài khoản chưa xác nhận email. Vui lòng kiểm tra hộp thư.";
  }
  if (msg.includes("password should be at least")) {
    return "Mật khẩu phải từ 6 ký tự trở lên.";
  }
  return message || "Có lỗi xảy ra, vui lòng thử lại.";
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Tiến độ lưu trên Cloud cho user đã đăng nhập: { [eventId]: { [epIndex]: true } }
  const [cloudProgress, setCloudProgress] = useState({});
  // Tiến độ lưu tạm dưới máy cho chế độ Khách
  const [guestProgress, setGuestProgress] = useLocalStorage(
    "sekai_guest_progress_v1",
    {}
  );

  // Tải tiến độ đọc của user từ Supabase
  const fetchUserProgress = useCallback(async (userId) => {
    if (!userId) {
      setCloudProgress({});
      return;
    }

    const { data, error } = await supabase
      .from("reading_progress")
      .select("event_id, ep_index")
      .eq("user_id", userId);

    if (error) {
      console.error("Lỗi tải tiến độ từ Supabase:", error.message);
      return;
    }

    const mapped = {};
    (data || []).forEach((row) => {
      if (!mapped[row.event_id]) mapped[row.event_id] = {};
      mapped[row.event_id][row.ep_index] = true;
    });
    setCloudProgress(mapped);
  }, []);

  // Lắng nghe trạng thái đăng nhập Supabase
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      const formatted = formatSupabaseUser(session?.user);
      setCurrentUser(formatted);
      if (formatted) {
        fetchUserProgress(formatted.id);
      }
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const formatted = formatSupabaseUser(session?.user);
      setCurrentUser(formatted);
      if (formatted) {
        fetchUserProgress(formatted.id);
      } else {
        setCloudProgress({});
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProgress]);

  // Đăng ký bằng Email + Mật khẩu
  const register = async ({ displayName, email, password }) => {
    const cleanName = displayName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      return { ok: false, message: "Vui lòng nhập đầy đủ thông tin." };
    }
    if (password.length < 6) {
      return { ok: false, message: "Mật khẩu phải từ 6 ký tự trở lên." };
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { display_name: cleanName },
      },
    });

    if (error) {
      return { ok: false, message: translateAuthError(error.message) };
    }

    // Trường hợp Supabase đang bật Confirm Email -> nhắc người dùng check mail
    if (data.user && !data.session) {
      return {
        ok: true,
        needsConfirm: true,
        message:
          "Đăng ký thành công! Vui lòng kiểm tra hộp thư email để xác nhận trước khi đăng nhập.",
      };
    }

    return { ok: true };
  };

  // Đăng nhập
  const login = async ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { ok: false, message: "Vui lòng nhập email và mật khẩu." };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      return { ok: false, message: translateAuthError(error.message) };
    }

    return { ok: true };
  };

  // Đăng xuất
  const logout = async () => {
    await supabase.auth.signOut();
    setCloudProgress({});
  };

  // Đánh dấu tập đã xem (lưu lên Supabase nếu đã login, ngược lại lưu localStorage)
  const markChapterWatched = useCallback(
    async (eventId, epIndex) => {
      if (!eventId || epIndex === null || epIndex === undefined) return;

      if (!currentUser) {
        setGuestProgress((prev) => {
          if (prev[eventId]?.[epIndex]) return prev;
          return {
            ...prev,
            [eventId]: {
              ...(prev[eventId] || {}),
              [epIndex]: true,
            },
          };
        });
        return;
      }

      // Cập nhật state ngay lập tức để thanh tiến trình mượt mà
      let alreadyWatched = false;
      setCloudProgress((prev) => {
        if (prev[eventId]?.[epIndex]) {
          alreadyWatched = true;
          return prev;
        }
        return {
          ...prev,
          [eventId]: {
            ...(prev[eventId] || {}),
            [epIndex]: true,
          },
        };
      });

      if (alreadyWatched) return;

      // Lưu lên Supabase DB
      const { error } = await supabase.from("reading_progress").upsert(
        {
          user_id: currentUser.id,
          event_id: eventId,
          ep_index: epIndex,
        },
        {
          onConflict: "user_id,event_id,ep_index",
          ignoreDuplicates: true,
        }
      );

      if (error) {
        console.error("Lỗi lưu tiến độ lên Supabase:", error.message);
      }
    },
    [currentUser, setGuestProgress]
  );

  // Lấy tiến trình đọc của 1 Story
  const getEventProgress = useCallback(
    (event) => {
      const activeMap = currentUser ? cloudProgress : guestProgress;
      const totalCount = event?.chapters?.length || 0;
      const watchedChapters = activeMap[event?.id] || {};
      const watchedCount = (event?.chapters || []).filter(
        (_, idx) => !!watchedChapters[idx]
      ).length;
      const percent =
        totalCount === 0 ? 0 : Math.round((watchedCount / totalCount) * 100);

      return {
        watchedCount,
        totalCount,
        percent,
        watchedChapters,
      };
    },
    [currentUser, cloudProgress, guestProgress]
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading,
        register,
        login,
        logout,
        markChapterWatched,
        getEventProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được dùng bên trong AuthProvider");
  return ctx;
}