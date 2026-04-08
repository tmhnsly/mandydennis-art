import { FaPaw } from "react-icons/fa";
import type { CommissionCategory } from "../types";

interface Props {
  category: CommissionCategory;
  currency: string;
}

export default function CommissionCard({ category, currency }: Props) {
  return (
    <div className="border border-line overflow-hidden">
      {/* Header with accent background */}
      <div className="px-6 py-5 bg-text/[0.03] border-b border-line flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
          <FaPaw size={14} className="text-accent" />
        </div>
        <h3 className="font-display text-xl font-bold tracking-tight">
          {category.title}
        </h3>
      </div>

      {/* Price rows */}
      <div className="px-6 py-2">
        {category.options.map((opt, i) => (
          <div
            key={i}
            className="flex items-center py-4 border-b border-dotted border-line last:border-b-0"
          >
            <span className="font-display font-bold text-base whitespace-nowrap w-28 flex-shrink-0">
              {opt.size}
            </span>
            {opt.description ? (
              <span className="text-text-mid text-[0.9rem] flex-1 px-2">
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
          <div className="text-[0.65rem] tracking-widest uppercase text-text-subtle font-semibold mb-3">
            Add-ons
          </div>
          {category.addons.map((addon, i) => (
            <div key={i} className="flex justify-between items-center py-2 text-[0.9rem]">
              <span className="text-text-mid">{addon.description}</span>
              <span className="font-display font-bold text-text whitespace-nowrap tabular-nums">
                +{currency}{addon.price}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Included & notes */}
      {(category.included || category.notes) && (
        <div className="px-6 py-4 border-t border-line-faint space-y-1.5">
          {category.included && (
            <p className="text-sm text-text-muted leading-relaxed">
              <span className="font-medium text-text-mid">Includes:</span>{" "}
              {category.included}
            </p>
          )}
          {category.notes && (
            <p className="text-sm text-text-subtle italic">{category.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
