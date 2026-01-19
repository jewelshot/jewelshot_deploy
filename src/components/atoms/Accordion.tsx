/**
 * Accordion - Collapsible section component
 * 
 * Matching the Studio's dark theme aesthetic.
 */

'use client';

import React, { useState, ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionProps {
  /** Title shown in the header */
  title: string;
  /** Count badge (optional, e.g., "5 items") */
  count?: number;
  /** Whether initially expanded */
  defaultOpen?: boolean;
  /** Content to show when expanded */
  children: ReactNode;
  /** Additional header content (e.g., action buttons) */
  headerAction?: ReactNode;
  /** Custom class for the container */
  className?: string;
}

export function Accordion({
  title,
  count,
  defaultOpen = true,
  children,
  headerAction,
  className = '',
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-white/5 ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 text-left transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-2">
          <span className="text-white/40 transition-transform duration-200">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-white/50">
            {title}
          </span>
          {count !== undefined && (
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-white/40">
              {count}
            </span>
          )}
        </div>
        {headerAction && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="flex items-center"
          >
            {headerAction}
          </div>
        )}
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Accordion;
