import { getCommissions, getSettings } from "../lib/content";
import CommissionCard from "../components/CommissionCard";
import CommissionForm from "../components/CommissionForm";

const commissions = getCommissions();
const settings = getSettings();

export default function CommissionsPage() {
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
