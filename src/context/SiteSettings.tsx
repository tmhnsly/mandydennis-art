import { createContext, useContext, useState, useEffect } from "react";
import { getSettings } from "../lib/content";
import type { SiteSettings } from "../types";

// This runs after prefetchAll, so getCached("settings") has real data
import { getInitialSettings } from "../lib/content";

const SiteSettingsContext = createContext<SiteSettings>(getInitialSettings());

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(getInitialSettings);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
