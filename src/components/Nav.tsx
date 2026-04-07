import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/commissions", label: "Commissions" },
  { to: "/events", label: "Events" },
  { to: "/about", label: "About" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Desktop nav */}
      <ul className="hidden md:flex gap-8">
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `font-body text-sm tracking-wide uppercase transition-colors hover:text-warm-700 ${
                  isActive ? "text-warm-800 font-semibold" : "text-warm-500"
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span className={`block w-6 h-0.5 bg-warm-800 transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-6 h-0.5 bg-warm-800 transition-opacity ${open ? "opacity-0" : ""}`} />
        <span className={`block w-6 h-0.5 bg-warm-800 transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Mobile dropdown */}
      {open && (
        <ul className="md:hidden absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg py-2 min-w-48 z-50">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-3 text-sm tracking-wide uppercase transition-colors hover:bg-warm-100 ${
                    isActive ? "text-warm-800 font-semibold" : "text-warm-500"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
