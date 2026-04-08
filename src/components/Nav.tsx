import { NavLink, useLocation } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaHome, FaImage, FaPalette, FaCalendarAlt, FaQuestionCircle, FaBars } from "react-icons/fa";
import type { IconType } from "react-icons";

const links: { to: string; label: string; icon: IconType }[] = [
  { to: "/", label: "Home", icon: FaHome },
  { to: "/gallery", label: "Gallery", icon: FaImage },
  { to: "/commissions", label: "Commissions", icon: FaPalette },
  { to: "/events", label: "Events", icon: FaCalendarAlt },
  { to: "/about", label: "About", icon: FaQuestionCircle },
];

function DesktopNav() {
  return (
    <ul className="hidden md:flex gap-1">
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
  );
}

function MobileNav() {
  const location = useLocation();

  return (
    <div className="md:hidden">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="min-w-11 min-h-11 rounded-md flex items-center justify-center text-text-muted hover:text-text hover:bg-text/[0.04] transition-colors"
            aria-label="Menu"
          >
            <FaBars size={16} />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={8}
            className="z-[100] min-w-[var(--width-menu)] rounded-lg border border-line bg-bg/95 backdrop-blur-xl p-1.5 shadow-lg animate-in"
          >
            {links.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
              return (
                <DropdownMenu.Item key={to} asChild>
                  <NavLink
                    to={to}
                    end={to === "/"}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors outline-none cursor-pointer ${
                      isActive
                        ? "text-text bg-text/[0.07]"
                        : "text-text-muted hover:text-text hover:bg-text/[0.04]"
                    }`}
                  >
                    <Icon size={15} className="flex-shrink-0" />
                    {label}
                  </NavLink>
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-bg/90 backdrop-blur-xl">
      <div className="max-w-[var(--width-content)] mx-auto flex items-center justify-between px-[var(--pad-page)] py-2">
        <NavLink
          to="/"
          className="font-display font-bold text-[1.05rem] tracking-tight text-text min-h-11 flex items-center gap-1"
        >
          Mandy <span className="font-serif italic font-normal text-text-mid text-[1.1rem] leading-none">Dennis</span>
        </NavLink>

        <DesktopNav />
        <MobileNav />
      </div>
      <div className="h-px bg-line" />
    </nav>
  );
}
