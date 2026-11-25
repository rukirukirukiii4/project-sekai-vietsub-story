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

function formatSupabaseUser(user, role = "guest") {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    role,
    displayName:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.display_name ||
      user.email?.split("@")[0] ||
      "User",
    avatarUrl:
      user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
  };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cloudProgress, setCloudProgress] = useState({});
  const [guestProgress, setGuestProgress] = useLocalStorage(
    "sekai_guest_progress_v1",
    {}
  );

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

  const fetchUserRole = useCallback(async (userId) => {
    if (!userId) return "guest";

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Lỗi tải quyền user:", error.message);
      return "guest";
    }
    return data?.role || "guest";
  }, []);

  useEffect(() => {
    let mounted = true;

    const syncSession = async (session) => {
      if (!session?.user) {
        if (!mounted) return;
        setCurrentUser(null);
        setCloudProgress({});
        setAuthLoading(false);
        return;
      }

      const [userRole] = await Promise.all([
        fetchUserRole(session.user.id),
        fetchUserProgress(session.user.id),
      ]);

      if (!mounted) return;
      setCurrentUser(formatSupabaseUser(session.user, userRole));
      setAuthLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProgress, fetchUserRole]);

  // Đăng nhập bằng Google ID Token (không chuyển hướng qua supabase.co)
  const loginWithGoogleIdToken = async (token, nonce) => {
    const { error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token,
      nonce,
    });

    if (error) {
      return { ok: false, message: error.message };
    }
    return { ok: true };
  };

  const logout = async () => {
    window.google?.accounts?.id?.disableAutoSelect?.();
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCloudProgress({});
  };

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

  const role = currentUser?.role || "guest";
  const isAdmin = Boolean(currentUser && role === "admin");

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAdmin,
        authLoading,
        loginWithGoogleIdToken,
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