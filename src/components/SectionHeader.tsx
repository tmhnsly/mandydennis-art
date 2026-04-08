import { useAnimateIn } from "../hooks/useAnimateIn";

interface Props {
  title: string;
}

export default function SectionHeader({ title }: Props) {
  const headRef = useAnimateIn();
  const ruleRef = useAnimateIn();

  return (
    <div className="mb-8 md:mb-10">
      <div ref={headRef} className="animate-in flex items-center gap-4">
        <h1 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-[-0.04em] leading-none flex-shrink-0">
          {title}
        </h1>
        <div ref={ruleRef} className="animate-rule flex-1 h-px bg-line-strong" />
      </div>
    </div>
  );
}
