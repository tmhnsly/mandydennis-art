import { FaPaw, FaCheck, FaTruck } from "react-icons/fa";
import type { CommissionCategory } from "../types";

const MEDIUMS = ["pastels", "pastel", "watercolours", "watercolour", "pencil", "oil", "charcoal", "acrylic", "ink", "mixed media"];

function StylisedTitle({ text }: { text: string }) {
  // Find the last medium word in the title and italicise it in serif
  const words = text.split(" ");
  const lastMediumIdx = words.reduce((acc, w, i) =>
    MEDIUMS.includes(w.toLowerCase()) ? i : acc, -1);
  if (lastMediumIdx === -1) return <>{text}</>;
  return (
    <>
      {words.slice(0, lastMediumIdx).join(" ")}{" "}
      <span className="font-serif italic font-normal text-text-mid">
        {words.slice(lastMediumIdx).join(" ")}
      </span>
    </>
  );
}

interface Props {
  category: CommissionCategory;
  currency: string;
}

export default function CommissionCard({ category, currency }: Props) {
  return (
    <div className="border border-line overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 bg-text/[0.03] border-b border-line flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
          <FaPaw size={14} className="text-accent" />
        </div>
        <h3 className="font-display text-xl font-bold tracking-tight">
          <StylisedTitle text={category.title} />
        </h3>
      </div>

      {/* Price options — each as a clear row */}
      <div className="divide-y divide-dotted divide-line">
        {category.options.map((opt, i) => (
          <div key={i} className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-[0.95rem]">
                {opt.size}
              </div>
              {opt.description && (
                <div className="text-text-muted text-sm mt-0.5">
                  {opt.description}
                </div>
              )}
            </div>
            <div className="font-display font-bold text-xl tabular-nums whitespace-nowrap">
              {opt.description === "Starting from" && (
                <span className="text-text-subtle text-xs font-medium mr-1">from</span>
              )}
              {currency}{opt.price}
            </div>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      {category.addons.length > 0 && (
        <div className="border-t border-line bg-text/[0.02]">
          <div className="px-6 pt-4 pb-1">
            <span className="text-[0.65rem] tracking-widest uppercase text-text-subtle font-semibold">
              Optional extras
            </span>
          </div>
          <div className="divide-y divide-dotted divide-line">
            {category.addons.map((addon, i) => (
              <div key={i} className="px-6 py-3 flex items-center justify-between gap-4">
                <span className="text-text-mid text-sm">{addon.description}</span>
                <span className="font-display font-bold text-base tabular-nums whitespace-nowrap">
                  +{currency}{addon.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What's included + notes */}
      {(category.included || category.notes) && (
        <div className="border-t border-line px-6 py-4 space-y-2.5">
          {category.included && (
            <div className="flex items-start gap-2.5">
              <FaCheck size={11} className="text-accent mt-1 flex-shrink-0" />
              <p className="text-sm text-text-mid leading-relaxed">
                {category.included}
              </p>
            </div>
          )}
          {category.notes && (
            <div className="flex items-start gap-2.5">
              <FaTruck size={11} className="text-text-subtle mt-1 flex-shrink-0" />
              <p className="text-sm text-text-muted leading-relaxed">
                {category.notes.replace("Extra for P&P if required.", "Postage & packaging available if required.")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
