import { useState, useEffect } from "react";
import { getCommissions, getInitialCommissions } from "../lib/content";
import { useSiteSettings } from "../context/SiteSettings";
import { useAnimateIn } from "../hooks/useAnimateIn";
import SectionHeader from "../components/SectionHeader";
import CommissionCard from "../components/CommissionCard";
import CommissionForm from "../components/CommissionForm";
import DrawLine from "../components/DrawLine";
import type { CommissionCategory } from "../types";

export default function CommissionsPage() {
  const settings = useSiteSettings();
  const [commissions, setCommissions] = useState<CommissionCategory[]>(getInitialCommissions);
  const { ref: bodyRef, isInView } = useAnimateIn();

  useEffect(() => { document.title = "Commissions — Mandy Dennis Art"; }, []);
  useEffect(() => { getCommissions().then(setCommissions); }, []);

  return (
    <>
      <div>
        <div className="max-w-[var(--width-content)] mx-auto px-[var(--pad-page)] py-[var(--pad-section)]">
          <SectionHeader title="Commissions" />

          <div ref={bodyRef} className={`anim-fade-up ${isInView ? "in-view" : ""} grid gap-[clamp(2rem,5vw,3.5rem)] lg:grid-cols-[1fr_minmax(0,420px)]`}>
            {/* Left — pricing */}
            <div className="space-y-5">
              {commissions.map((cat) => (
                <CommissionCard key={cat.slug} category={cat} currency={settings.currency_symbol} />
              ))}
            </div>

            {/* Right — enquiry form */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <CommissionForm
                heading="Get in Touch"
                description="Interested in commissioning a piece, have a question about pricing, or just want to say hello?"
                messageLabel="Tell Mandy what you're after"
                messagePlaceholder="e.g. I'd love a pastel portrait of my two dogs, A4 size..."
              />
            </div>
          </div>
        </div>
      </div>
      <DrawLine />
    </>
  );
}
