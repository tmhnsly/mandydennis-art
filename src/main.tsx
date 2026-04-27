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

// Mount React immediately with dummy/cached data so the rendered DOM
// triggers font requests via its font-family rules. Sanity hydrates in
// the background (the old block on prefetchAll cost 1-2s of spinner).
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

// Keep the loader on top of the mounted-but-fallback-fonts page until
// fonts are ready, then fade. Hides FOUT without blocking React mount.
// Safety timeout: never hold the loader longer than 2s, even if a font
// stalls.
const fontsReady = document.fonts?.ready ?? Promise.resolve();
const fontTimeout = new Promise<void>((r) => setTimeout(r, 2000));
Promise.race([fontsReady, fontTimeout]).then(() => {
  requestAnimationFrame(() => requestAnimationFrame(hideLoader));
});
