import { useInView } from "../hooks/useAnimateIn";
import TextReveal from "./TextReveal";

interface Props {
  title: string;
}

export default function SectionHeader({ title }: Props) {
  const { ref, isInView } = useInView(0.3);

  return (
    <div ref={ref} className="mb-8 md:mb-10">
      <div className="flex items-center gap-4">
        <TextReveal
          as="h1"
          className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-[-0.04em] leading-none flex-shrink-0"
        >
          {title}
        </TextReveal>
        <div className={`anim-rule flex-1 h-px bg-line-strong ${isInView ? "in-view" : ""}`} style={{ transitionDelay: "0.1s" }} />
      </div>
    </div>
  );
}
