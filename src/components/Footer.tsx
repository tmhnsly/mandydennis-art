import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { useSiteSettings } from "../context/SiteSettings";

export default function Footer() {
  const settings = useSiteSettings();
  const hasSocials = settings.facebook_url || settings.instagram_url;

  return (
    <footer>
      <div className="max-w-[var(--width-content)] mx-auto px-[var(--pad-page)] py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-text-subtle tracking-wide">
          <span>&copy; {new Date().getFullYear()} Mandy Dennis Art</span>
          <span className="text-line">·</span>
          <a
            href="https://tomhinsley.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text transition-colors"
          >
            Site by Tom Hinsley
          </a>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-xs text-text-subtle tracking-wide">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute h-full w-full rounded-full bg-emerald-400/40 animate-[pulse-ring_2s_ease-out_infinite]" />
              <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            Open for commissions
          </span>

          {hasSocials && (
            <div className="flex items-center gap-1">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-11 min-h-11 flex items-center justify-center text-text-subtle hover:text-text transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={15} />
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-11 min-h-11 flex items-center justify-center text-text-subtle hover:text-text transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram size={17} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
