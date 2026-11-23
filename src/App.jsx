import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { ArrowLeftIcon } from "./components/common/Icons";
import HomePage from "./pages/HomePage";
import ReaderPage from "./pages/ReaderPage";

function NotFoundView() {
  return (
    <section className="text-center py-14 px-6 bg-surface border-[1.5px] border-dashed border-border rounded-[14px] sekai-shadow">
      <h1 className="text-2xl font-extrabold mb-2">Không tìm thấy trang</h1>
      <p className="text-sm text-muted mb-5">
        Đường dẫn bạn mở không tồn tại trong kho lưu trữ.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold bg-accent-fill text-accent-ink hover:brightness-110 transition"
      >
        <ArrowLeftIcon />
        Quay lại trang chủ
      </Link>
    </section>
  );
}

export default function App() {
  const [theme, setTheme] = useLocalStorage("sekai_story_theme_v1", "light");
  const [selectedUnit, setSelectedUnit] = useState("all");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleResetUnit = () => setSelectedUnit("all");

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header
            isDark={theme === "dark"}
            onToggleTheme={handleToggleTheme}
            onResetUnit={handleResetUnit}
          />

          <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-5 pt-6 pb-16">
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    selectedUnit={selectedUnit}
                    onUnitChange={setSelectedUnit}
                  />
                }
              />
              <Route path="/event/:eventId" element={<ReaderPage />} />
              <Route path="*" element={<NotFoundView />} />
            </Routes>
          </main>

          <Footer onResetUnit={handleResetUnit} />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
