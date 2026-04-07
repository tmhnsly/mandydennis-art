import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CommissionsPage from "./pages/CommissionsPage";
import GalleryPage from "./pages/GalleryPage";
import AboutPage from "./pages/AboutPage";
import EventsPage from "./pages/EventsPage";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/commissions" element={<CommissionsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Layout>
  );
}
