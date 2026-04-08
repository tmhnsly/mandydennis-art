import { useState, useEffect } from "react";
import { getCommissions } from "../lib/content";
import { useSiteSettings } from "../context/SiteSettings";
import { motion } from "motion/react";
import { useAnimateIn } from "../hooks/useAnimateIn";
import SectionHeader from "../components/SectionHeader";
import CommissionCard from "../components/CommissionCard";
import CommissionForm from "../components/CommissionForm";
import type { CommissionCategory } from "../types";
import DrawLine from "../components/DrawLine";

export default function CommissionsPage() {
  const settings = useSiteSettings();
  const [commissions, setCommissions] = useState<CommissionCategory[]>([]);
  const { ref: bodyRef, isInView } = useAnimateIn();

  useEffect(() => {
    getCommissions().then(setCommissions);
  }, []);

  return (
    <>
      <div>
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
          <SectionHeader title="Commissions" />

          <motion.div ref={bodyRef} initial={{ opacity: 0, y: 8 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.3 }} className="grid gap-[clamp(1.5rem,4vw,3rem)] lg:grid-cols-2">
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
          </motion.div>
        </div>
      </div>
      <DrawLine />
    </>
  );
}
