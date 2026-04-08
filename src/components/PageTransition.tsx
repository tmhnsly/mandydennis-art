import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function PageTransition({ children }: Props) {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return <>{children}</>;
}
