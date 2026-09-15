import { useEffect, RefObject } from 'react';

// Watches a target element and fires a callback once it scrolls into view —
// used to trigger loading the next page of results.
export function useInfiniteScrollTrigger(
  targetRef: RefObject<Element>,
  onTrigger: () => void
) {
  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onTrigger();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [targetRef, onTrigger]);
}
