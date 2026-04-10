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

// Prefetch all lazy routes after initial render so navigation is instant
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    import("./pages/GalleryPage");
    import("./pages/CommissionsPage");
    import("./pages/EventsPage");
    import("./pages/AboutPage");
  }, { once: true });
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={null}>
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
