import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HomePage from "./pages/HomePage";
import ReaderPage from "./pages/ReaderPage";
import AdminRoute from "./components/common/AdminRoute";
import AdminPage from "./pages/AdminPage";

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

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header
            isDark={theme === "dark"}
            onToggleTheme={handleToggleTheme}
            onResetUnit={() => setSelectedUnit("all")}
          />

          <main className="flex-1 w-full max-w-[1240px] mx-auto px-5 pt-6 pb-16">
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
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}