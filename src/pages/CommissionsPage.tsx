import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { getCommissions } from "../lib/content";
import { useSiteSettings } from "../context/SiteSettings";
import { useAnimateIn } from "../hooks/useAnimateIn";
import SectionHeader from "../components/SectionHeader";
import CommissionCard from "../components/CommissionCard";
import CommissionForm from "../components/CommissionForm";
import type { CommissionCategory } from "../types";

export default function CommissionsPage() {
  const settings = useSiteSettings();
  const [commissions, setCommissions] = useState<CommissionCategory[]>([]);
  const bodyRef = useAnimateIn();

  useEffect(() => {
    getCommissions().then(setCommissions);
  }, []);

  return (
    <div className="border-b border-line">
      <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
        <SectionHeader icon={Palette} title="Commissions" />

        <div ref={bodyRef} className="animate-in grid gap-[clamp(1.5rem,4vw,3rem)] lg:grid-cols-2">
          <div className="space-y-5">
            {commissions.map((cat) => (
              <CommissionCard
                key={cat.slug}
                category={cat}
                currency={settings.currency_symbol}
              />
            ))}
          </div>
          <div>
            <CommissionForm />
          </div>
        </div>
      </div>
    </div>
  );
}
