import { useRef } from "react";
import { motion, useInView } from "motion/react";
import TextReveal from "./TextReveal";

interface Props {
  title: string;
}

export default function SectionHeader({ title }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="mb-8 md:mb-10">
      <div className="flex items-center gap-4">
        <TextReveal
          as="h1"
          className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-[-0.04em] leading-none flex-shrink-0"
        >
          {title}
        </TextReveal>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="flex-1 h-px bg-line-strong origin-left"
        />
      </div>
    </div>
  );
}
