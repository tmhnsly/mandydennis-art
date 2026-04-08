import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PageTransition from "./components/PageTransition";
import HomePage from "./pages/HomePage";

const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const CommissionsPage = lazy(() => import("./pages/CommissionsPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Stable empty shell — same height as a page so no layout shift during lazy load
function PageShell() {
  return <div className="min-h-[50vh]" />;
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<PageShell />}>
        <PageTransition>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/commissions" element={<CommissionsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PageTransition>
      </Suspense>
    </Layout>
  );
}
