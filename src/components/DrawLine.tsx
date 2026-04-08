import { useAnimateIn } from "../hooks/useAnimateIn";

export default function DrawLine() {
  const ref = useAnimateIn();
  return <div ref={ref} className="animate-rule h-px bg-line" />;
}
