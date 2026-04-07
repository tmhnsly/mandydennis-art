import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";

function Placeholder({ name }: { name: string }) {
  return (
    <div className="px-6 py-12 md:px-12">
      <h1 className="font-display text-3xl text-warm-800">{name}</h1>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/commissions" element={<Placeholder name="Commissions" />} />
        <Route path="/events" element={<Placeholder name="Events" />} />
        <Route path="/about" element={<Placeholder name="About" />} />
      </Routes>
    </Layout>
  );
}
