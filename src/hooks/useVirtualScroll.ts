/**
 * useVirtualScroll Hook
 *
 * Custom hook for virtual scrolling to handle large lists efficiently
 * Calculates visible items and their positions for optimal performance
 */

import { useCallback, useMemo, useState } from 'react';

interface UseVirtualScrollOptions {
  items: any[];
  itemHeight: number | ((index: number) => number);
  containerHeight: number;
  overscan?: number;
  enabled?: boolean;
}

interface VirtualScrollData {
  virtualItems: VirtualItem[];
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  offsetY: number;
  getItemHeight: (index: number) => number;
}

interface VirtualItem {
  index: number;
  start: number;
  end: number;
  size: number;
}

export const useVirtualScroll = (options: UseVirtualScrollOptions): VirtualScrollData => {
  const {
    items,
    itemHeight,
    containerHeight,
    overscan = 3,
    enabled = true,
  } = options;

  const [scrollTop, setScrollTop] = useState(0);

  // Calculate item height function
  const getItemHeight = useCallback((index: number): number => {
    if (typeof itemHeight === 'function') {
      return itemHeight(index);
    }
    return itemHeight;
  }, [itemHeight]);

  // Calculate item offsets and total height
  const { itemOffsets, totalHeight } = useMemo(() => {
    const offsets: number[] = [0];
    let currentOffset = 0;

    for (let i = 0; i < items.length; i++) {
      currentOffset += getItemHeight(i);
      offsets.push(currentOffset);
    }

    return {
      itemOffsets: offsets,
      totalHeight: currentOffset,
    };
  }, [items.length, getItemHeight]);

  // Calculate visible range
  const { startIndex, endIndex } = useMemo(() => {
    if (!enabled || !itemOffsets.length) {
      return {
        startIndex: 0,
        endIndex: items.length - 1,
      };
    }

    let start = 0;
    let end = items.length - 1;

    // Find start index
    for (let i = 0; i < itemOffsets.length - 1; i++) {
      if (itemOffsets[i + 1] > scrollTop) {
        start = Math.max(0, i - overscan);
        break;
      }
    }

    // Find end index
    const viewportBottom = scrollTop + containerHeight;
    for (let i = start; i < itemOffsets.length - 1; i++) {
      if (itemOffsets[i] > viewportBottom) {
        end = Math.min(items.length - 1, i + overscan);
        break;
      }
    }

    return { startIndex: start, endIndex: end };
  }, [scrollTop, containerHeight, itemOffsets, items.length, overscan, enabled]);

  // Create virtual items
  const virtualItems = useMemo(() => {
    if (!enabled) {
      return items.map((_, index) => ({
        index,
        start: itemOffsets[index] || 0,
        end: itemOffsets[index + 1] || 0,
        size: getItemHeight(index),
      }));
    }

    const virtual: VirtualItem[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      virtual.push({
        index: i,
        start: itemOffsets[i] || 0,
        end: itemOffsets[i + 1] || 0,
        size: getItemHeight(i),
      });
    }
    return virtual;
  }, [startIndex, endIndex, itemOffsets, getItemHeight, enabled, items]);

  // Calculate offset for proper positioning
  const offsetY = enabled ? itemOffsets[startIndex] || 0 : 0;

  // Scroll handler
  const handleScroll = useCallback((scrollTop: number) => {
    setScrollTop(scrollTop);
  }, []);

  return {
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    offsetY,
    getItemHeight,
  };
};
