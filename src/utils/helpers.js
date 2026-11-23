export function extractYouTubeId(url) {
  if (!url) return null;
  const clean = String(url).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  const match = clean.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function setDynamicAccent(unitOrHex) {
  const isObj = unitOrHex && typeof unitOrHex === "object";
  const hex = isObj ? unitOrHex.color : unitOrHex;
  if (!hex || !hex.startsWith("#")) return;

  const root = document.documentElement.style;
  root.setProperty("--accent", hex);

  if (isObj && unitOrHex.fill) {
    root.setProperty("--accent-fill", unitOrHex.fill);
  }
  if (isObj && unitOrHex.textLight) {
    root.setProperty("--accent-text-light", unitOrHex.textLight);
  }
  if (isObj && unitOrHex.textDark) {
    root.setProperty("--accent-text-dark", unitOrHex.textDark);
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  root.setProperty("--accent-soft", `rgba(${r}, ${g}, ${b}, 0.12)`);
  root.setProperty("--accent-soft-dark", `rgba(${r}, ${g}, ${b}, 0.2)`);
  root.setProperty("--accent-muted", `rgba(${r}, ${g}, ${b}, 0.52)`);
}

export function formatEpisodeTag(ep, fallbackIndex) {
  const val = ep ?? fallbackIndex + 1;
  return `EP.${String(val).padStart(2, "0")}`;
}

export function resolveImageUrl(path) {
  if (!path) return "";
  const normalized = String(path).trim().replace(/\\/g, "/");
  if (/^https?:\/\//i.test(normalized)) return normalized;
  const withoutPublic = normalized.replace(/^\/?public\//i, "");
  return withoutPublic.startsWith("/") ? withoutPublic : `/${withoutPublic}`;
}
