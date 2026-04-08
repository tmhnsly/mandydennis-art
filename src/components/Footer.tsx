import { useSiteSettings } from "../context/SiteSettings";

export default function Footer() {
  const settings = useSiteSettings();

  return (
    <footer className="border-t border-line">
      <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-5 flex justify-between items-center">
        <span className="text-xs text-text-subtle tracking-wide">
          &copy; {new Date().getFullYear()} Mandy Dennis Art
        </span>
        {settings.facebook_url ? (
          <a
            href={settings.facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-subtle hover:text-text transition-colors"
          >
            Facebook
          </a>
        ) : (
          <span className="text-xs text-text-subtle tracking-wide">
            Open for commissions
          </span>
        )}
      </div>
    </footer>
  );
}
