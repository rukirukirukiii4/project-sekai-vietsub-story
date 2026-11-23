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

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      return { ok: false, message: error.message };
    }
    return { ok: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
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

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading,
        loginWithGoogle,
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