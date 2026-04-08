import { useState } from "react";
import { FaCommentDots, FaCheck } from "react-icons/fa";
import { useSiteSettings } from "../context/SiteSettings";

const SIZE_OPTIONS = [
  { label: "A5", desc: "Head portrait", price: 80 },
  { label: "A4", desc: "Head & shoulder", price: 100 },
  { label: "A4", desc: "Full body", price: 120 },
  { label: "A3 / 12×12", desc: "", price: 150 },
  { label: "Larger than A3", desc: "Starting from", price: 300 },
];

const ADDON_OPTIONS = [
  { id: "extra-pet", label: "Extra pet (A3)", price: 50 },
  { id: "background", label: "Specific background", price: 50 },
];

export default function CommissionForm() {
  const { currency_symbol: currency } = useSiteSettings();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [addons, setAddons] = useState<Set<string>>(new Set());

  const toggleAddon = (id: string) => {
    setAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const basePrice = selectedSize !== null ? SIZE_OPTIONS[selectedSize].price : 0;
  const addonTotal = ADDON_OPTIONS.filter((a) => addons.has(a.id)).reduce((sum, a) => sum + a.price, 0);
  const estimatedTotal = basePrice + addonTotal;

  // Build a summary string for the hidden form field
  const summary = [
    selectedSize !== null ? `Size: ${SIZE_OPTIONS[selectedSize].label}${SIZE_OPTIONS[selectedSize].desc ? ` (${SIZE_OPTIONS[selectedSize].desc})` : ""}` : null,
    ...ADDON_OPTIONS.filter((a) => addons.has(a.id)).map((a) => `+ ${a.label}`),
    estimatedTotal > 0 ? `Estimated: ${currency}${estimatedTotal}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <form
      name="commission-enquiry"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="space-y-6"
    >
      <input type="hidden" name="form-name" value="commission-enquiry" />
      <input type="hidden" name="selections" value={summary} />
      <p className="hidden">
        <label>Don't fill this out: <input name="bot-field" /></label>
      </p>

      <div>
        <div className="text-[0.62rem] tracking-widest uppercase text-text-subtle font-medium mb-1">
          Get a quote
        </div>
        <p className="text-[0.95rem] text-text-mid leading-relaxed">
          Select your options for an estimated price, then send an enquiry to Mandy.
        </p>
      </div>

      {/* Size selector */}
      <div>
        <label className="block text-sm font-medium text-text-mid mb-2">
          Size
        </label>
        <div className="flex flex-col gap-1.5">
          {SIZE_OPTIONS.map((opt, i) => {
            const active = selectedSize === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedSize(active ? null : i)}
                className={`min-h-11 px-4 py-2.5 border text-left flex items-center justify-between gap-3 transition-colors ${
                  active
                    ? "border-text bg-text/[0.05]"
                    : "border-line-strong hover:border-text/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-sm border flex items-center justify-center flex-shrink-0 transition-colors ${
                      active ? "border-text bg-text" : "border-line-strong"
                    }`}
                  >
                    {active && <FaCheck size={10} className="text-bg" />}
                  </div>
                  <span className="font-display font-semibold text-[0.9rem]">{opt.label}</span>
                  {opt.desc && (
                    <span className="text-text-muted text-[0.82rem]">{opt.desc}</span>
                  )}
                </div>
                <span className="font-display font-semibold text-[0.9rem] whitespace-nowrap">
                  {opt.desc === "Starting from" ? "from " : ""}{currency}{opt.price}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <label className="block text-sm font-medium text-text-mid mb-2">
          Add-ons
        </label>
        <div className="flex flex-col gap-1.5">
          {ADDON_OPTIONS.map((addon) => {
            const active = addons.has(addon.id);
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => toggleAddon(addon.id)}
                className={`min-h-11 px-4 py-2.5 border text-left flex items-center justify-between gap-3 transition-colors ${
                  active
                    ? "border-text bg-text/[0.05]"
                    : "border-line-strong hover:border-text/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-sm border flex items-center justify-center flex-shrink-0 transition-colors ${
                      active ? "border-text bg-text" : "border-line-strong"
                    }`}
                  >
                    {active && <FaCheck size={10} className="text-bg" />}
                  </div>
                  <span className="text-[0.9rem] text-text-mid">{addon.label}</span>
                </div>
                <span className="font-display font-semibold text-[0.9rem] whitespace-nowrap">
                  +{currency}{addon.price}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Estimated price */}
      {estimatedTotal > 0 && (
        <div className="border border-line-strong px-5 py-4 flex items-baseline justify-between">
          <div>
            <div className="text-[0.62rem] tracking-widest uppercase text-text-subtle font-medium mb-0.5">
              Estimated price
            </div>
            <div className="text-[0.78rem] text-text-muted">
              {selectedSize !== null && SIZE_OPTIONS[selectedSize].label}
              {addons.size > 0 && (
                <span>
                  {" · "}
                  {ADDON_OPTIONS.filter((a) => addons.has(a.id))
                    .map((a) => `+${a.label}`)
                    .join(" · ")}
                </span>
              )}
            </div>
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">
            {currency}{estimatedTotal}
          </span>
        </div>
      )}

      <hr className="border-line" />

      {/* Contact details */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-mid mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full min-h-11 px-4 py-2.5 border border-line-strong bg-transparent rounded-none focus:outline-none focus:ring-1 focus:ring-text text-sm"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-mid mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full min-h-11 px-4 py-2.5 border border-line-strong bg-transparent rounded-none focus:outline-none focus:ring-1 focus:ring-text text-sm"
        />
      </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium text-text-mid mb-1">
          Tell Mandy about your commission
        </label>
        <textarea
          id="details"
          name="details"
          rows={4}
          required
          className="w-full min-h-11 px-4 py-2.5 border border-line-strong bg-transparent rounded-none focus:outline-none focus:ring-1 focus:ring-text text-sm resize-y"
          placeholder="e.g. A portrait of my two dogs sitting together..."
        />
      </div>

      <div>
        <label htmlFor="reference" className="block text-sm font-medium text-text-mid mb-1">
          Reference image (optional)
        </label>
        <input
          type="file"
          id="reference"
          name="reference"
          accept="image/*"
          className="w-full text-sm text-text-muted file:mr-4 file:min-h-11 file:py-2 file:px-4 file:border file:border-line-strong file:bg-transparent file:text-text-mid file:font-medium file:rounded-none hover:file:bg-text/[0.04]"
        />
      </div>

      <button
        type="submit"
        className="w-full min-h-11 py-3 bg-text text-bg font-medium text-sm tracking-wide uppercase flex items-center justify-center gap-2 hover:opacity-85 transition-opacity"
      >
        <FaCommentDots size={14} />
        Send Enquiry
      </button>
    </form>
  );
}
