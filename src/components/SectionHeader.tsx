import type { LucideIcon } from "lucide-react";
import { useAnimateIn } from "../hooks/useAnimateIn";

interface Props {
  icon: LucideIcon;
  title: string;
}

export default function SectionHeader({ icon: Icon, title }: Props) {
  const headRef = useAnimateIn();
  const ruleRef = useAnimateIn();

  return (
    <div className="mb-8 md:mb-10">
      <div ref={headRef} className="animate-in flex items-center gap-3">
        <div className="w-8 h-8 rounded-md border border-line-strong flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-text-muted" />
        </div>
        <h1 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-[-0.04em] leading-none">
          {title}
        </h1>
        <div ref={ruleRef} className="animate-rule flex-1 h-px bg-line-strong ml-3" />
      </div>
    </div>
  );
}
