import { Routes, Route } from "react-router-dom";

function Placeholder({ name }: { name: string }) {
  return <div className="p-8 font-display text-2xl">{name}</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder name="Home" />} />
      <Route path="/gallery" element={<Placeholder name="Gallery" />} />
      <Route path="/commissions" element={<Placeholder name="Commissions" />} />
      <Route path="/events" element={<Placeholder name="Events" />} />
      <Route path="/about" element={<Placeholder name="About" />} />
    </Routes>
  );
}
