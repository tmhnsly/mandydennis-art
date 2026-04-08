import { useState, useEffect } from "react";
import { getCommissions, getInitialCommissions } from "../lib/content";
import { useSiteSettings } from "../context/SiteSettings";
import { useAnimateIn, useInView } from "../hooks/useAnimateIn";
import SectionHeader from "../components/SectionHeader";
import CommissionCard from "../components/CommissionCard";
import CommissionForm from "../components/CommissionForm";
import DrawLine from "../components/DrawLine";
import type { CommissionCategory } from "../types";

export default function CommissionsPage() {
  const settings = useSiteSettings();
  const [commissions, setCommissions] = useState<CommissionCategory[]>(getInitialCommissions);
  const { ref: pricingRef, isInView: pricingInView } = useAnimateIn();
  const { ref: formRef, isInView: formInView } = useInView(0.1);

  useEffect(() => { document.title = "Commissions — Mandy Dennis Art"; }, []);
  useEffect(() => { getCommissions().then(setCommissions); }, []);

  return (
    <>
      {/* Pricing */}
      <div>
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
          <SectionHeader title="Commission Prices" />
          <div ref={pricingRef} className={`anim-fade-up ${pricingInView ? "in-view" : ""}`}>
            <div className="grid gap-5 lg:grid-cols-2 max-w-4xl">
              {commissions.map((cat) => (
                <CommissionCard key={cat.slug} category={cat} currency={settings.currency_symbol} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <DrawLine />

      {/* Enquiry form */}
      <div ref={formRef}>
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
          <SectionHeader title="Get in Touch" />
          <div className={`anim-fade-up ${formInView ? "in-view" : ""} max-w-lg`}>
            <CommissionForm
              heading="Enquiry"
              description="Interested in commissioning a piece, have a question about pricing, or just want to say hello?"
              messageLabel="Tell Mandy what you're after"
              messagePlaceholder="e.g. I'd love a pastel portrait of my two dogs, A4 size..."
            />
          </div>
        </div>
      </div>
      <DrawLine />
    </>
  );
}
