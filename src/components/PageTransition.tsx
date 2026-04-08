import { useState, useEffect, useRef, useCallback } from "react";
import { flushSync } from "react-dom";
import { useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const supportsVT = typeof document !== "undefined" && "startViewTransition" in document;

export default function PageTransition({ children }: Props) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [exiting, setExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevPath = useRef(location.pathname);
  const pendingChildren = useRef(children);

  pendingChildren.current = children;

  const swapContent = useCallback(() => {
    setDisplayChildren(pendingChildren.current);
    setExiting(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.pathname === prevPath.current) {
      setDisplayChildren(children);
      return;
    }
    prevPath.current = location.pathname;

    if (supportsVT) {
      // Use View Transitions API — browser handles the animation
      // eslint-disable-next-line
      (document as Document & { startViewTransition: (cb: () => void) => void })
        .startViewTransition(() => {
          flushSync(() => {
            setDisplayChildren(pendingChildren.current);
            window.scrollTo(0, 0);
          });
        });
    } else {
      // Fallback: CSS class-based exit then swap
      setExiting(true);
      const el = containerRef.current;
      if (!el) { swapContent(); return; }

      const onEnd = () => { swapContent(); el.removeEventListener("transitionend", onEnd); };
      el.addEventListener("transitionend", onEnd, { once: true });

      const fallback = window.setTimeout(swapContent, 400);
      return () => clearTimeout(fallback);
    }
  }, [location.pathname, children, swapContent]);

  return (
    <div
      ref={containerRef}
      className={exiting ? "page-exit" : ""}
      style={supportsVT ? { viewTransitionName: "page-content" } : undefined}
    >
      {displayChildren}
    </div>
  );
}
