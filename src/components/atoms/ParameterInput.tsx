'use client';

import { Parameter } from '@/lib/advanced-parameters';

interface ParameterInputProps {
  parameter: Parameter;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
}

export function ParameterInput({
  parameter,
  value,
  onChange,
}: ParameterInputProps) {
  switch (parameter.type) {
    case 'select':
      return (
        <div className="space-y-1">
          <label className="text-[8px] font-medium uppercase tracking-wide text-white/50">
            {parameter.label}
          </label>
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded border border-white/10 bg-white/[0.02] px-2 py-1.5 text-[9px] text-white/90 transition-colors hover:border-white/20 focus:border-purple-500/50 focus:outline-none"
          >
            <option value="">Select...</option>
            {parameter.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case 'slider':
      return (
        <div className="space-y-1">
          <label className="flex items-center justify-between text-[8px] font-medium uppercase tracking-wide text-white/50">
            <span>{parameter.label}</span>
            <span className="text-purple-400">
              {value || parameter.default}
            </span>
          </label>
          <input
            type="range"
            min={parameter.min}
            max={parameter.max}
            value={value !== undefined ? value : parameter.default}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-1">
          <label className="text-[8px] font-medium uppercase tracking-wide text-white/50">
            {parameter.label}
          </label>
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={parameter.placeholder}
            rows={3}
            className="w-full rounded border border-white/10 bg-white/[0.02] px-2 py-1.5 text-[9px] text-white/90 transition-colors hover:border-white/20 focus:border-purple-500/50 focus:outline-none"
          />
        </div>
      );

    default:
      return null;
  }
}







