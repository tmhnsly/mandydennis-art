import { useRef } from "react";
import { useInView } from "motion/react";

export function useAnimateIn<T extends HTMLElement = HTMLDivElement>(threshold = 0.1) {
  const ref = useRef<T>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
}
