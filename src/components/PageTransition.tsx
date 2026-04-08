import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const EXIT_DURATION = 400; // ms — matches exit transition (0.35s + buffer)

export default function PageTransition({ children }: Props) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [exiting, setExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevPath = useRef(location.pathname);
  const pendingChildren = useRef(children);

  // Always keep latest children ref current
  pendingChildren.current = children;

  const completeTransition = useCallback(() => {
    setDisplayChildren(pendingChildren.current);
    setExiting(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.pathname === prevPath.current) {
      // Same route, just update children (e.g. data loaded)
      setDisplayChildren(children);
      return;
    }

    prevPath.current = location.pathname;
    setExiting(true);

    // Wait for exit animations to play, then swap
    const el = containerRef.current;
    if (!el) {
      completeTransition();
      return;
    }

    const onEnd = () => {
      completeTransition();
      el.removeEventListener("transitionend", onEnd);
    };

    el.addEventListener("transitionend", onEnd, { once: true });

    // Safety: if transitionend doesn't fire (no animated elements visible)
    const fallback = setTimeout(completeTransition, EXIT_DURATION);
    return () => clearTimeout(fallback);
  }, [location.pathname, children, completeTransition]);

  return (
    <div ref={containerRef} className={exiting ? "page-exit" : ""}>
      {displayChildren}
    </div>
  );
}
