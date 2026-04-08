import { useInView } from "../hooks/useAnimateIn";

interface Props {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
}

export default function TextReveal({
  children,
  className = "",
  as: Tag = "span",
  delay = 0,
}: Props) {
  const { ref, isInView } = useInView<HTMLSpanElement>(0.1);

  const words = children.split(" ");

  return (
    <Tag className={className}>
      <span ref={ref}>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.1em] pr-[0.05em]">
            <span
              className={`anim-word ${isInView ? "in-view" : ""}`}
              style={{ transitionDelay: `${delay + i * 0.04}s` }}
            >
              {word}
            </span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </span>
    </Tag>
  );
}
