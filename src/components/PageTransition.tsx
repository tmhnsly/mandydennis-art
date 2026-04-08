import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  children: React.ReactNode;
}

export default function PageTransition({ children }: Props) {
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const isFirstRender = useRef(true);

  // Don't animate the very first render
  if (isFirstRender.current) {
    isFirstRender.current = false;
  }

  // Scroll to top on route change
  if (location.pathname !== prevPath.current) {
    prevPath.current = location.pathname;
    window.scrollTo(0, 0);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
