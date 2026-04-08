import { flushSync } from "react-dom";

/**
 * Wraps a React state change in a View Transition if supported.
 * Falls back to running the callback immediately if not.
 */
export function withViewTransition(callback: () => void) {
  if (
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    typeof (document as Document & { startViewTransition: (cb: () => void) => unknown }).startViewTransition === "function"
  ) {
    (document as Document & { startViewTransition: (cb: () => void) => unknown })
      .startViewTransition(() => {
        flushSync(callback);
      });
  } else {
    callback();
  }
}
