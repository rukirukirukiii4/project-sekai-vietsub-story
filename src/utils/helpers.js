export function extractYouTubeId(url) {
  if (!url) return null;
  const clean = String(url).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  const match = clean.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function setDynamicAccent(hex) {
  if (!hex || !hex.startsWith("#")) return;
  document.documentElement.style.setProperty("--accent", hex);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  document.documentElement.style.setProperty(
    "--accent-soft",
    `rgba(${r}, ${g}, ${b}, 0.14)`
  );
  document.documentElement.style.setProperty(
    "--accent-muted",
    `rgba(${r}, ${g}, ${b}, 0.52)`
  );
}

export function formatEpisodeTag(ep, fallbackIndex) {
  const val = ep ?? fallbackIndex + 1;
  return `EP.${String(val).padStart(2, "0")}`;
}

export function resolveImageUrl(path) {
  if (!path) return "";
  const clean = String(path).trim();

  if (/^https?:\/\//i.test(clean)) {
    if (
      clean.includes("res.cloudinary.com") &&
      clean.includes("/image/upload/") &&
      !clean.includes("/image/upload/f_auto")
    ) {
      return clean.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
    }
    return clean;
  }

  return clean.startsWith("/") ? clean : `/${clean}`;
}