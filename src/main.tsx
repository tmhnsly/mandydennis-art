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

// Wait for BOTH fonts and Sanity data before mounting React.
// The loader stays visible until everything is ready — no pop-in.
Promise.all([
  document.fonts.ready,
  prefetchAll(),
]).then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <SiteSettingsProvider>
          <App />
        </SiteSettingsProvider>
      </BrowserRouter>
    </StrictMode>
  );

  // Hide loader after React has painted the first frame
  requestAnimationFrame(() => {
    requestAnimationFrame(hideLoader);
  });
});
