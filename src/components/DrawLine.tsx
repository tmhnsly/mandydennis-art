import { useRef } from "react";
import { motion, useInView } from "motion/react";

export default function DrawLine() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0 }}
      animate={isInView ? { scaleX: 1 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-px bg-line origin-left"
    />
  );
}
