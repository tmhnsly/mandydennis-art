export default function CommissionForm() {
  return (
    <form
      name="commission-enquiry"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="bg-white rounded-lg shadow-sm p-6 space-y-4"
    >
      <input type="hidden" name="form-name" value="commission-enquiry" />
      <p className="hidden">
        <label>
          Don't fill this out: <input name="bot-field" />
        </label>
      </p>

      <h3 className="font-display text-xl text-warm-800">
        Commission Enquiry
      </h3>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-warm-700 mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-2 border border-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-warm-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-2 border border-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400"
        />
      </div>

      <div>
        <label htmlFor="medium" className="block text-sm font-medium text-warm-700 mb-1">
          Preferred Medium
        </label>
        <select
          id="medium"
          name="medium"
          className="w-full px-4 py-2 border border-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 bg-white"
        >
          <option value="">No preference</option>
          <option value="pastel">Pastel</option>
          <option value="watercolour">Watercolour</option>
          <option value="pencil">Pencil</option>
          <option value="oil">Oil</option>
          <option value="mixed media">Mixed Media</option>
        </select>
      </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium text-warm-700 mb-1">
          What would you like commissioned?
        </label>
        <textarea
          id="details"
          name="details"
          rows={4}
          required
          className="w-full px-4 py-2 border border-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 resize-y"
          placeholder="e.g. A pastel portrait of my dog, A4 size..."
        />
      </div>

      <div>
        <label htmlFor="reference" className="block text-sm font-medium text-warm-700 mb-1">
          Reference image (optional)
        </label>
        <input
          type="file"
          id="reference"
          name="reference"
          accept="image/*"
          className="w-full text-sm text-warm-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-warm-200 file:text-warm-700 file:font-medium hover:file:bg-warm-300"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-warm-800 text-white rounded-lg font-medium hover:bg-warm-700 transition-colors"
      >
        Send Enquiry
      </button>
    </form>
  );
}
