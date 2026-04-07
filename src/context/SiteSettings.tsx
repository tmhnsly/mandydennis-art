import { createContext, useContext, useState, useEffect } from "react";
import { getSettings } from "../lib/content";
import type { SiteSettings } from "../types";

const defaults: SiteSettings = {
  tagline: "",
  contact_email: "",
  facebook_url: "",
  currency_symbol: "£",
};

const SiteSettingsContext = createContext<SiteSettings>(defaults);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults);

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
