import { FaPaw, FaBoxOpen, FaPlus } from "react-icons/fa";
import type { CommissionCategory } from "../types";

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
          {category.title}
        </h3>
      </div>

      {/* Price options */}
      <div className="px-6 py-3">
        {category.options.map((opt, i) => (
          <div
            key={i}
            className="flex items-center py-3.5 border-b border-dotted border-line last:border-b-0 gap-3"
          >
            <span className="font-display font-bold text-base whitespace-nowrap w-28 flex-shrink-0">
              {opt.size}
            </span>
            {opt.description ? (
              <span className="text-text-mid text-sm flex-1">
                {opt.description}
              </span>
            ) : (
              <span className="flex-1" />
            )}
            <span className="font-display font-bold text-lg whitespace-nowrap text-right tabular-nums">
              {opt.description === "Starting from" && (
                <span className="text-text-subtle text-xs font-medium mr-1">from</span>
              )}
              {currency}{opt.price}
            </span>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      {category.addons.length > 0 && (
        <div className="px-6 py-4 border-t border-line bg-text/[0.02]">
          <div className="flex items-center gap-2 mb-3">
            <FaPlus size={10} className="text-text-subtle" />
            <span className="text-[0.65rem] tracking-widest uppercase text-text-subtle font-semibold">
              Add-ons
            </span>
          </div>
          {category.addons.map((addon, i) => (
            <div key={i} className="flex justify-between items-center py-2 text-sm">
              <span className="text-text-mid">{addon.description}</span>
              <span className="font-display font-bold text-text whitespace-nowrap tabular-nums">
                +{currency}{addon.price}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* What's included */}
      {category.included && (
        <div className="px-6 py-4 border-t border-line">
          <div className="flex items-start gap-3">
            <FaBoxOpen size={13} className="text-accent mt-0.5 flex-shrink-0" />
            <p className="text-sm text-text-mid leading-relaxed">
              {category.included}
            </p>
          </div>
        </div>
      )}

      {/* Postage note */}
      {category.notes && (
        <div className="px-6 py-3 border-t border-line-faint bg-text/[0.015]">
          <p className="text-xs text-text-subtle">
            {category.notes.replace("Extra for P&P if required.", "Postage & packaging available if required.")}
          </p>
        </div>
      )}
    </div>
  );
}
