import { useState, useEffect } from "react";
import { getCommissions } from "../lib/content";
import { useSiteSettings } from "../context/SiteSettings";
import CommissionCard from "../components/CommissionCard";
import CommissionForm from "../components/CommissionForm";
import type { CommissionCategory } from "../types";

export default function CommissionsPage() {
  const settings = useSiteSettings();
  const [commissions, setCommissions] = useState<CommissionCategory[]>([]);

  useEffect(() => {
    getCommissions().then(setCommissions);
  }, []);

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl text-warm-800 mb-8">
        Commissions
      </h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
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
  );
}
