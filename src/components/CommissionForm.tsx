import { useRef, useState } from "react";
import { FaCommentDots, FaImage, FaTimes } from "react-icons/fa";
import { useSiteSettings } from "../context/SiteSettings";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

type FormStatus = "idle" | "sending" | "sent" | "error";

interface Props {
  heading?: string;
  description?: string;
  messagePlaceholder?: string;
  messageLabel?: string;
  showImageUpload?: boolean;
}

export default function CommissionForm({
  heading = "Get in Touch",
  description = "Have a question, want to commission a piece, or just want to say hello? Drop Mandy a message.",
  messageLabel = "Your message",
  messagePlaceholder = "e.g. I'd love a pastel portrait of my two dogs, A4 size...",
  showImageUpload = true,
}: Props) {
  const settings = useSiteSettings();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const form = e.currentTarget;
      const data = new FormData(form);
      const res = await fetch("/", { method: "POST", body: data });
      if (!res.ok) throw new Error("Submit failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    setFileName(null);
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Please upload an image file (JPEG, PNG, WebP, GIF, or HEIC).");
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

  if (status === "sent") {
    return (
      <div className="border border-accent/20 bg-accent/[0.03] p-6 text-center">
        <p className="font-display font-semibold text-lg mb-1">Thanks for getting in touch!</p>
        <p className="text-text-mid text-sm">Mandy will get back to you as soon as she can.</p>
        {settings.contact_email && (
          <p className="text-text-subtle text-xs mt-3">
            You can also email directly:{" "}
            <a href={`mailto:${settings.contact_email}`} className="underline hover:text-text">
              {settings.contact_email}
            </a>
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      name="enquiry"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      encType="multipart/form-data"
      className="space-y-5"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value="enquiry" />
      <p className="hidden">
        <label>Don't fill this out: <input name="bot-field" /></label>
      </p>

      <div>
        <div className="text-[0.62rem] tracking-widest uppercase text-text-subtle font-medium mb-1">
          {heading}
        </div>
        <p className="text-[0.95rem] text-text-mid leading-relaxed">
          {description}
        </p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-mid mb-1">Name</label>
        <input type="text" id="name" name="name" required className="w-full min-h-11 px-4 py-2.5 border border-line-strong bg-transparent rounded-none focus:outline-none focus:ring-1 focus:ring-text text-sm" />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-mid mb-1">Email</label>
        <input type="email" id="email" name="email" required className="w-full min-h-11 px-4 py-2.5 border border-line-strong bg-transparent rounded-none focus:outline-none focus:ring-1 focus:ring-text text-sm" />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text-mid mb-1">{messageLabel}</label>
        <textarea id="message" name="message" rows={5} required className="w-full px-4 py-2.5 border border-line-strong bg-transparent rounded-none focus:outline-none focus:ring-1 focus:ring-text text-sm resize-y" placeholder={messagePlaceholder} />
      </div>

      {showImageUpload && (
        <div>
          <label className="block text-sm font-medium text-text-mid mb-1">Attach an image (optional)</label>
          <input ref={fileRef} type="file" id="reference" name="reference" accept=".jpg,.jpeg,.png,.webp,.gif,.heic,.heif" onChange={handleFileChange} className="hidden" />
          {fileName ? (
            <div className="flex items-center gap-3 min-h-11 px-4 py-2.5 border border-line-strong text-sm">
              <FaImage size={14} className="text-accent flex-shrink-0" />
              <span className="text-text-mid truncate flex-1">{fileName}</span>
              <button type="button" onClick={clearFile} className="text-text-subtle hover:text-text transition-colors p-1" aria-label="Remove file">
                <FaTimes size={12} />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} className="w-full min-h-11 px-4 py-2.5 border border-dashed border-line-strong text-sm text-text-muted flex items-center justify-center gap-2 hover:border-text/40 hover:text-text-mid transition-colors">
              <FaImage size={14} /> Choose an image
            </button>
          )}
          {fileError && <p className="text-sm text-red-600 mt-1.5">{fileError}</p>}
          <p className="text-xs text-text-subtle mt-1">JPEG, PNG, WebP, GIF or HEIC. Max {MAX_SIZE_MB}MB.</p>
        </div>
      )}

      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong. Please try again
          {settings.contact_email && (<> or email <a href={`mailto:${settings.contact_email}`} className="underline">{settings.contact_email}</a></>)}.
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="w-full min-h-11 py-3 bg-text text-bg font-medium text-sm tracking-wide uppercase flex items-center justify-center gap-2 hover:opacity-85 transition-opacity disabled:opacity-50">
        <FaCommentDots size={14} />
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
