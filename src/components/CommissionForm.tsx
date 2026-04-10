import { useState } from "react";
import { FaCommentDots } from "react-icons/fa";
import { useSiteSettings } from "../context/SiteSettings";

interface Props {
  heading?: string;
  description?: string;
  messagePlaceholder?: string;
  messageLabel?: string;
}

export default function CommissionForm({
  heading = "Get in Touch",
  description = "Have a question, want to commission a piece, or just want to say hello? Drop Mandy a message.",
  messageLabel = "Your message",
  messagePlaceholder = "e.g. I'd love a pastel portrait of my two dogs, A4 size...",
}: Props) {
  const settings = useSiteSettings();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const to = settings.contact_email || "mandy@example.com";
    const subject = `Commission enquiry from ${name}`;
    const body = `From: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
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
        <input type="text" id="name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full min-h-11 px-4 py-2.5 border border-line-strong bg-transparent rounded-none focus:outline-none focus:ring-1 focus:ring-text text-sm" />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-mid mb-1">Email</label>
        <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full min-h-11 px-4 py-2.5 border border-line-strong bg-transparent rounded-none focus:outline-none focus:ring-1 focus:ring-text text-sm" />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text-mid mb-1">{messageLabel}</label>
        <textarea id="message" rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-2.5 border border-line-strong bg-transparent rounded-none focus:outline-none focus:ring-1 focus:ring-text text-sm resize-y" placeholder={messagePlaceholder} />
      </div>

      <button type="submit" className="w-full min-h-11 py-3 bg-text text-bg font-medium text-sm tracking-wide uppercase flex items-center justify-center gap-2 hover:opacity-85 transition-opacity cursor-pointer">
        <FaCommentDots size={14} />
        Send Message
      </button>

      {settings.contact_email && (
        <p className="text-xs text-text-subtle text-center">
          Or email directly:{" "}
          <a href={`mailto:${settings.contact_email}`} className="underline hover:text-text">
            {settings.contact_email}
          </a>
        </p>
      )}
    </form>
  );
}
