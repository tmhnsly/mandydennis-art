import { useEffect } from "react";
import { Link } from "react-router-dom";
import DrawLine from "../components/DrawLine";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "Not Found — Mandy Dennis Art";
  }, []);

  return (
    <>
      <div>
        <div className="max-w-[var(--width-content)] mx-auto px-[var(--pad-page)] py-[var(--pad-section)]">
          <h1 className="font-display text-3xl font-bold tracking-tight mb-4">
            Page not found
          </h1>
          <p className="text-text-mid mb-6">
            Sorry, the page you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 min-h-11 px-5 py-3 text-text text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:bg-text hover:text-bg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
      <DrawLine />
    </>
  );
}
