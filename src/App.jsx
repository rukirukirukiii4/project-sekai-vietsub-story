import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HomePage from "./pages/HomePage";
import ReaderPage from "./pages/ReaderPage";

export default function App() {
  const [theme, setTheme] = useLocalStorage("sekai_story_theme_v1", "light");
  const [watchedMap, setWatchedMap] = useLocalStorage("sekai_story_watched_v1", {});
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

  const handleToggleWatched = (key) => {
    setWatchedMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
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
                  watchedMap={watchedMap}
                />
              }
            />
            <Route
              path="/event/:eventId"
              element={
                <ReaderPage
                  watchedMap={watchedMap}
                  onToggleWatched={handleToggleWatched}
                />
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}