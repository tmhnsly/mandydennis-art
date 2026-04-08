import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { useSiteSettings } from "../context/SiteSettings";

export default function Footer() {
  const settings = useSiteSettings();
  const hasSocials = settings.facebook_url || settings.instagram_url;

  return (
    <footer>
      <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-5 flex items-center justify-between">
        <span className="text-xs text-text-subtle tracking-wide">
          &copy; {new Date().getFullYear()} Mandy Dennis Art
        </span>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-xs text-text-subtle tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Open for commissions
          </span>

          {hasSocials && (
            <div className="flex items-center gap-1 ml-2">
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
