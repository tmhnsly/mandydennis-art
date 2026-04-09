import Nav from "./Nav";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Nav />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
