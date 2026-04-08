import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function PageTransition({ children }: Props) {
  const { pathname } = useLocation();
  const prevPath = useRef(pathname);

  // useLayoutEffect runs before paint — prevents flash at old scroll position
  useLayoutEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  return <>{children}</>;
}
