interface Props {
  delay?: number;
  className?: string;
}

export default function DrawLine({ delay = 1, className = "" }: Props) {
  return (
    <div
      className={`h-px bg-line draw-line draw-line-${delay} ${className}`}
    />
  );
}
