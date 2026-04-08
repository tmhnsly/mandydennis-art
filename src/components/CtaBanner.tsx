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
    <div ref={ref} className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3rem,6vw,5rem)]">
      <div className={`anim-fade-up ${isInView ? "in-view" : ""} border border-line-strong p-[clamp(2rem,5vw,3.5rem)] text-center`}>
        <h2 className="font-display text-[clamp(1.4rem,3vw,1.8rem)] font-bold tracking-tight mb-2">
          {heading}
        </h2>
        <p className="text-text-mid text-[0.95rem] mb-6 max-w-md mx-auto">
          {text}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to={buttonTo}
            className="inline-flex items-center gap-2 min-h-11 px-6 py-3 bg-text text-bg text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:opacity-85 transition-opacity"
          >
            <FaArrowRight size={13} />
            {buttonLabel}
          </Link>
          {secondaryLabel && secondaryTo && (
            <Link
              to={secondaryTo}
              className="inline-flex items-center gap-2 min-h-11 px-6 py-3 text-text text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:bg-text hover:text-bg transition-colors"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
