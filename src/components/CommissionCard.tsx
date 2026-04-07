import type { CommissionCategory } from "../types";

interface Props {
  category: CommissionCategory;
  currency: string;
}

export default function CommissionCard({ category, currency }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-display text-xl text-warm-800 mb-4">
        {category.title}
      </h3>

      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="border-b border-warm-200 text-warm-500">
            <th className="text-left py-2 font-medium">Size</th>
            <th className="text-left py-2 font-medium">Description</th>
            <th className="text-right py-2 font-medium">Price</th>
          </tr>
        </thead>
        <tbody>
          {category.options.map((opt, i) => (
            <tr key={i} className="border-b border-warm-100">
              <td className="py-2 text-warm-800">{opt.size}</td>
              <td className="py-2 text-warm-600">{opt.description}</td>
              <td className="py-2 text-right text-warm-800 font-medium">
                {opt.description === "Starting from" ? "from " : ""}
                {currency}{opt.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {category.addons.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-warm-600 mb-2">Add-ons</h4>
          <ul className="text-sm space-y-1">
            {category.addons.map((addon, i) => (
              <li key={i} className="flex justify-between text-warm-700">
                <span>{addon.description}</span>
                <span className="font-medium">{currency}{addon.price}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {category.included && (
        <p className="text-sm text-warm-600 mb-2">
          <span className="font-medium">Included:</span> {category.included}
        </p>
      )}

      {category.notes && (
        <p className="text-sm text-warm-500 italic">{category.notes}</p>
      )}
    </div>
  );
}
