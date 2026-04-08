import { NavLink } from "react-router-dom";
import { Home, Image, Palette, Calendar, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const links: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/gallery", label: "Gallery", icon: Image },
  { to: "/commissions", label: "Commissions", icon: Palette },
  { to: "/events", label: "Events", icon: Calendar },
  { to: "/about", label: "About", icon: User },
];

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-[clamp(1.5rem,5vw,4rem)] py-3">
        <NavLink
          to="/"
          className="font-display font-bold text-[1.05rem] tracking-tight text-text"
        >
          Mandy Dennis
        </NavLink>

        <ul className="flex gap-0.5">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium tracking-wide uppercase transition-colors ${
                    isActive
                      ? "text-text bg-text/[0.06]"
                      : "text-text-muted hover:text-text hover:bg-text/[0.04]"
                  }`
                }
              >
                <Icon size={15} className="opacity-60" />
                <span className="hidden md:inline">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
