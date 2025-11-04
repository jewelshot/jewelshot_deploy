'use client';

import { useState } from 'react';
import { ParameterGroup as ParameterGroupType } from '@/lib/advanced-parameters';
import { ParameterInput } from '@/components/atoms/ParameterInput';

interface ParameterGroupProps {
  group: ParameterGroupType;
  selections: Record<string, string | number>;
  onChange: (paramId: string, value: string | number) => void;
}

export function ParameterGroup({
  group,
  selections,
  onChange,
}: ParameterGroupProps) {
  const [isExpanded, setIsExpanded] = useState(group.defaultExpanded ?? false);

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-200 hover:border-white/15">
      {/* Group Header - Collapsible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-2.5 text-left transition-colors hover:bg-white/[0.03]"
      >
        <span className="text-[10px] font-semibold text-white/90">
          <span className="mr-1.5">{group.icon}</span>
          {group.label}
        </span>
        <svg
          className={`h-3 w-3 text-white/40 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Parameters */}
      {isExpanded && (
        <div className="space-y-2.5 border-t border-white/5 p-2.5 pt-2">
          {group.parameters.map((param) => (
            <ParameterInput
              key={param.id}
              parameter={param}
              value={selections[param.id]}
              onChange={(value) => onChange(param.id, value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}




