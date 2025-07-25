/**
 * useIntersectionObserver Hook
 *
 * Custom hook for intersection observer functionality
 * Used for infinite scroll, lazy loading, and visibility tracking
 */

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  freezeOnceVisible?: boolean;
}

interface UseIntersectionObserverReturn {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn => {
  const {
    threshold = 0,
    rootMargin = '0px',
    root = null,
    freezeOnceVisible = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Don't create new observer if frozen and already visible
    if (freezeOnceVisible && isIntersecting) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observer.current.observe(element);

    return () => {
      observer.current?.disconnect();
    };
  }, [elementRef, threshold, rootMargin, root, freezeOnceVisible, isIntersecting]);

  return { isIntersecting, entry };
};
