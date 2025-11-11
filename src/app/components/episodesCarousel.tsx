"use client"

import React, { useRef, useState, useEffect, ReactElement, cloneElement } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EpisodesCarouselProps {
  children: React.ReactNode;
  title?: string;
  railIndex?: number;
  focusedItemIndex?: number;
  isFocused?: boolean;
  onItemFocus?: (index: number) => void;
}

export function EpisodesCarousel({ 
  children, 
  title,
  railIndex = 0,
  focusedItemIndex = 0,
  isFocused = false,
  onItemFocus
}: EpisodesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      }
    };
  }, [children]);

  // Scroll to focused item when it changes
  useEffect(() => {
    if (isFocused && itemRefs.current[focusedItemIndex] && scrollContainerRef.current) {
      const focusedElement = itemRefs.current[focusedItemIndex];
      const container = scrollContainerRef.current;
      
      if (focusedElement) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = focusedElement.getBoundingClientRect();
        
        // Check if element is outside viewport
        if (elementRect.left < containerRect.left) {
          // Scroll left to show focused item
          container.scrollTo({
            left: container.scrollLeft + (elementRect.left - containerRect.left) - 20,
            behavior: 'smooth'
          });
        } else if (elementRect.right > containerRect.right) {
          // Scroll right to show focused item
          container.scrollTo({
            left: container.scrollLeft + (elementRect.right - containerRect.right) + 20,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [focusedItemIndex, isFocused]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] md:text-[32px] xl:text-[36px] text-white font-bold">{title}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                canScrollLeft ? 'cursor-pointer' : ''
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                canScrollRight ? 'cursor-pointer' : ''
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          </div>
        </div>
      )}
      {!title && (
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
              canScrollLeft ? 'cursor-pointer' : ''
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
              canScrollRight ? 'cursor-pointer' : ''
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>
      )}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {Array.isArray(children) 
          ? children.map((child, index) => {
              if (React.isValidElement(child)) {
                return (
                  <div
                    key={index}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    className={`${isFocused && index === focusedItemIndex ? 'ring-2 ring-[#bc0000] rounded-xl' : ''} p-2`}
                  >
                    {cloneElement(child as ReactElement<any>, {
                      isFocused: isFocused && index === focusedItemIndex,
                      onFocus: () => onItemFocus?.(index)
                    } as any)}
                  </div>
                );
              }
              return child;
            })
          : children
        }
      </div>
    </div>
  );
}

