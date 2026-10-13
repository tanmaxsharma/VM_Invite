import { useEffect, useState, type RefObject } from "react";

/** Becomes true the first time `ref`'s element is mostly on screen, and stays true. */
export function useInViewOnce(ref: RefObject<Element | null>, threshold = 0.85) {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (seen || !el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, seen, threshold]);

  return seen;
}
