import { getSettings } from "../lib/content";

export default function Footer() {
  const settings = getSettings();

  return (
    <footer className="border-t border-warm-200 mt-16 py-8 px-6 text-center text-warm-500 text-sm">
      <p>&copy; {new Date().getFullYear()} Mandy Dennis Art</p>
      {settings.facebook_url && (
        <a
          href={settings.facebook_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 hover:text-warm-700 transition-colors"
        >
          Facebook
        </a>
      )}
    </footer>
  );
}
