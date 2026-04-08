import { useRef } from "react";
import { motion, useInView } from "motion/react";

interface Props {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  /** Split by "word" or "char" */
  by?: "word" | "char";
}

export default function TextReveal({
  children,
  className = "",
  as: Tag = "span",
  delay = 0,
  by = "word",
}: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const units = by === "word" ? children.split(" ") : children.split("");

  return (
    <Tag ref={ref} className={className}>
      {units.map((unit, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : {}}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * 0.03,
            }}
          >
            {unit}
            {by === "word" && i < units.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
