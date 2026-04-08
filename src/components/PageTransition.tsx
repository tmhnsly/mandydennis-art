import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function PageTransition({ children }: Props) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === prevPath.current) return;
    prevPath.current = location.pathname;

    // Fade out current page
    setPhase("out");

    const timer = setTimeout(() => {
      // Swap content and fade in
      setDisplayChildren(children);
      window.scrollTo(0, 0);
      setPhase("in");
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  // On first render, just show children
  useEffect(() => {
    setDisplayChildren(children);
  }, [children]);

  return (
    <div
      className={`transition-opacity duration-150 ease-in-out ${
        phase === "out" ? "opacity-0" : "opacity-100"
      }`}
    >
      {displayChildren}
    </div>
  );
}
