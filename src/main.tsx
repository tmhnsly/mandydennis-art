import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SiteSettingsProvider } from "./context/SiteSettings";
import { prefetchAll } from "./lib/content";
import App from "./App";
import "./index.css";

// Pre-fetch all Sanity data before mounting React.
// This populates the cache so getInitial*() returns real data on frame 1.
// If Sanity is slow or unavailable, dummy data is used (no delay > 3s).
prefetchAll().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <SiteSettingsProvider>
          <App />
        </SiteSettingsProvider>
      </BrowserRouter>
    </StrictMode>
  );
});
