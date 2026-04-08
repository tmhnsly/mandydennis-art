import { PawPrint } from "lucide-react";
import type { CommissionCategory } from "../types";

interface Props {
  category: CommissionCategory;
  currency: string;
}

export default function CommissionCard({ category, currency }: Props) {
  return (
    <div className="border border-line">
      <div className="px-5 py-4 border-b border-line flex items-center gap-2.5">
        <PawPrint size={16} className="text-text-muted" />
        <h3 className="font-display text-[1.05rem] font-semibold tracking-tight">
          {category.title}
        </h3>
      </div>

      <div className="px-5 py-3">
        {category.options.map((opt, i) => (
          <div
            key={i}
            className="grid grid-cols-[4rem_1fr_auto] py-2.5 border-b border-dotted border-line last:border-b-0 items-baseline"
          >
            <span className="font-display font-semibold text-[0.85rem]">{opt.size}</span>
            <span className="text-text-mid text-[0.85rem]">{opt.description}</span>
            <span className="font-display font-semibold text-right text-[0.9rem]">
              {opt.description === "Starting from" ? "from " : ""}
              {currency}{opt.price}
            </span>
          </div>
        ))}
      </div>

      {category.addons.length > 0 && (
        <div className="px-5 py-3 border-t border-line bg-text/[0.015]">
          <div className="text-[0.6rem] tracking-widest uppercase text-text-subtle font-medium mb-1.5">
            Add-ons
          </div>
          {category.addons.map((addon, i) => (
            <div key={i} className="flex justify-between py-1 text-[0.82rem] text-text-mid">
              <span>{addon.description}</span>
              <span className="font-display font-semibold text-text">
                +{currency}{addon.price}
              </span>
            </div>
          ))}
        </div>
      )}

      {(category.included || category.notes) && (
        <div className="px-5 py-3 border-t border-line-faint text-[0.78rem] text-text-subtle italic">
          {category.included && <p>{category.included}</p>}
          {category.notes && <p>{category.notes}</p>}
        </div>
      )}
    </div>
  );
}
