import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SiteSettingsProvider } from "./context/SiteSettings";
import { prefetchAll } from "./lib/content";
import App from "./App";
import "./index.css";

function hideLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;
  loader.classList.add("fade-out");
  loader.addEventListener("transitionend", () => loader.remove(), { once: true });
}

// Mount React immediately with dummy/cached data. Pages hydrate from
// Sanity via useEffect (no pop-in for text — only late-arriving images
// fade in on top). Blocking on document.fonts.ready + prefetchAll cost
// 1-2s of spinner on cold cache, especially in Chrome.
const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
createRoot(root).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <SiteSettingsProvider>
        <App />
      </SiteSettingsProvider>
    </BrowserRouter>
  </StrictMode>
);

// Warm the cache in the background so navigation feels instant.
prefetchAll();

// Hide loader after React paints its first frame.
requestAnimationFrame(() => {
  requestAnimationFrame(hideLoader);
});
