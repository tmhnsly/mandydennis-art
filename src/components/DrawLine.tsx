import { useInView } from "../hooks/useAnimateIn";

export default function DrawLine() {
  const { ref, isInView } = useInView(0.1);
  return (
    <div ref={ref} className={`anim-rule h-px bg-line ${isInView ? "in-view" : ""}`} />
  );
}
