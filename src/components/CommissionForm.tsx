import { useRef, useState } from "react";
import { FaCommentDots, FaImage, FaTimes } from "react-icons/fa";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function CommissionForm() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    setFileName(null);

    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Please upload an image file (JPEG, PNG, WebP, or GIF).");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setFileError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setFileName(file.name);
  };

  const clearFile = () => {
    if (fileRef.current) fileRef.current.value = "";
    setFileName(null);
    setFileError(null);
  };

  return (
    <form
      name="commission-enquiry"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      encType="multipart/form-data"
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
        <label className="block text-sm font-medium text-text-mid mb-1">
          Reference image (optional)
        </label>
        <input
          ref={fileRef}
          type="file"
          id="reference"
          name="reference"
          accept=".jpg,.jpeg,.png,.webp,.gif"
          onChange={handleFileChange}
          className="hidden"
        />
        {fileName ? (
          <div className="flex items-center gap-3 min-h-11 px-4 py-2.5 border border-line-strong text-sm">
            <FaImage size={14} className="text-accent flex-shrink-0" />
            <span className="text-text-mid truncate flex-1">{fileName}</span>
            <button
              type="button"
              onClick={clearFile}
              className="text-text-subtle hover:text-text transition-colors p-1"
              aria-label="Remove file"
            >
              <FaTimes size={12} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full min-h-11 px-4 py-2.5 border border-dashed border-line-strong text-sm text-text-muted flex items-center justify-center gap-2 hover:border-text/40 hover:text-text-mid transition-colors"
          >
            <FaImage size={14} />
            Choose an image
          </button>
        )}
        {fileError && (
          <p className="text-sm text-red-600 mt-1.5">{fileError}</p>
        )}
        <p className="text-xs text-text-subtle mt-1">JPEG, PNG, WebP or GIF. Max {MAX_SIZE_MB}MB.</p>
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
