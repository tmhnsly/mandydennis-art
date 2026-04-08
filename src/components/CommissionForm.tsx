import { FaCommentDots } from "react-icons/fa";

export default function CommissionForm() {
  return (
    <form
      name="commission-enquiry"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="space-y-5"
    >
      <input type="hidden" name="form-name" value="commission-enquiry" />
      <p className="hidden">
        <label>Don't fill this out: <input name="bot-field" /></label>
      </p>

      <div>
        <div className="text-[0.62rem] tracking-widest uppercase text-text-subtle font-medium mb-1">
          Enquiry
        </div>
        <p className="text-[0.95rem] text-text-mid leading-relaxed">
          Interested in a commission? Send Mandy a message and she'll get back to you.
        </p>
      </div>

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
          rows={5}
          required
          className="w-full px-4 py-2.5 border border-line-strong bg-transparent rounded-none focus:outline-none focus:ring-1 focus:ring-text text-sm resize-y"
          placeholder="e.g. I'd love a pastel portrait of my two dogs, A4 size..."
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
