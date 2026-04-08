import { NavLink } from "react-router-dom";
import { FaPaintBrush, FaHome, FaImage, FaPalette, FaCalendarAlt, FaUser } from "react-icons/fa";
import type { IconType } from "react-icons";

const links: { to: string; label: string; icon: IconType }[] = [
  { to: "/", label: "Home", icon: FaHome },
  { to: "/gallery", label: "Gallery", icon: FaImage },
  { to: "/commissions", label: "Commissions", icon: FaPalette },
  { to: "/events", label: "Events", icon: FaCalendarAlt },
  { to: "/about", label: "About", icon: FaUser },
];

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-bg/90 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-[clamp(1.5rem,5vw,4rem)] py-2">
        <NavLink
          to="/"
          className="font-display font-bold text-[1.05rem] tracking-tight text-text min-h-11 flex items-center gap-2"
        >
          <FaPaintBrush className="text-accent" size={16} />
          Mandy Dennis
        </NavLink>

        <ul className="flex gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-2 min-w-11 min-h-11 px-3 rounded-md text-xs font-medium tracking-wide uppercase transition-colors ${
                    isActive
                      ? "text-text bg-text/[0.07]"
                      : "text-text-muted hover:text-text hover:bg-text/[0.04]"
                  }`
                }
              >
                <Icon size={16} className="flex-shrink-0" />
                <span className="hidden lg:inline">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="h-px bg-line draw-line draw-line-1" />
    </nav>
  );
}
