import { Link } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 md:px-12 md:py-6 border-b border-warm-200">
        <Link to="/" className="font-display text-xl md:text-2xl text-warm-900 hover:text-warm-700 transition-colors">
          Mandy Dennis Art
        </Link>
        <Nav />
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
