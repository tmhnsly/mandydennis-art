import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useInView } from "../hooks/useAnimateIn";

interface Props {
  heading: string;
  text: string;
  buttonLabel: string;
  buttonTo: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}

export default function CtaBanner({ heading, text, buttonLabel, buttonTo, secondaryLabel, secondaryTo }: Props) {
  const { ref, isInView } = useInView(0.1);

  return (
    <div ref={ref} className="bg-cta-bg">
      <div className={`anim-fade-up ${isInView ? "in-view" : ""} max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3rem,6vw,4.5rem)] text-center`}>
        <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight mb-2 text-cta-text">
          {heading}
        </h2>
        <p className="text-cta-muted text-[0.95rem] mb-7 max-w-md mx-auto">
          {text}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to={buttonTo}
            className="inline-flex items-center gap-2 min-h-11 px-6 py-3 bg-cta-btn-bg text-cta-btn-text text-[0.8rem] font-medium tracking-wide uppercase hover:opacity-90 transition-opacity"
          >
            <FaArrowRight size={13} />
            {buttonLabel}
          </Link>
          {secondaryLabel && secondaryTo && (
            <Link
              to={secondaryTo}
              className="inline-flex items-center gap-2 min-h-11 px-6 py-3 text-cta-text text-[0.8rem] font-medium tracking-wide uppercase border border-cta-btn-border hover:bg-cta-btn-border/20 transition-colors"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
