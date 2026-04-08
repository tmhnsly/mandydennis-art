import { FaPaw } from "react-icons/fa";
import type { CommissionCategory } from "../types";

interface Props {
  category: CommissionCategory;
  currency: string;
}

export default function CommissionCard({ category, currency }: Props) {
  return (
    <div className="border border-line">
      <div className="px-6 py-5 border-b border-line flex items-center gap-2.5">
        <FaPaw size={16} className="text-text-muted flex-shrink-0" />
        <h3 className="font-display text-lg font-semibold tracking-tight">
          {category.title}
        </h3>
      </div>

      <div className="px-6 py-4">
        {category.options.map((opt, i) => (
          <div
            key={i}
            className="flex items-baseline py-3 border-b border-dotted border-line last:border-b-0 gap-4"
          >
            <span className="font-display font-semibold text-[0.95rem] whitespace-nowrap min-w-[6rem]">
              {opt.size}
            </span>
            {opt.description && (
              <span className="text-text-mid text-[0.9rem] flex-1">
                {opt.description}
              </span>
            )}
            <span className={`font-display font-semibold text-[0.95rem] whitespace-nowrap text-right ${!opt.description ? "ml-auto" : ""}`}>
              {opt.description === "Starting from" ? "from " : ""}
              {currency}{opt.price}
            </span>
          </div>
        ))}
      </div>

      {category.addons.length > 0 && (
        <div className="px-6 py-4 border-t border-line bg-text/[0.015]">
          <div className="text-[0.62rem] tracking-widest uppercase text-text-subtle font-medium mb-2">
            Add-ons
          </div>
          {category.addons.map((addon, i) => (
            <div key={i} className="flex justify-between items-baseline py-1.5 text-[0.9rem] text-text-mid">
              <span>{addon.description}</span>
              <span className="font-display font-semibold text-text whitespace-nowrap">
                +{currency}{addon.price}
              </span>
            </div>
          ))}
        </div>
      )}

      {(category.included || category.notes) && (
        <div className="px-6 py-4 border-t border-line-faint space-y-1">
          {category.included && (
            <p className="text-[0.82rem] text-text-muted">{category.included}</p>
          )}
          {category.notes && (
            <p className="text-[0.82rem] text-text-subtle italic">{category.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
