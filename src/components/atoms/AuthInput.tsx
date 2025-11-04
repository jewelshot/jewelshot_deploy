import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AuthInputProps {
  type: 'text' | 'email' | 'password';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: LucideIcon;
  error?: string;
  disabled?: boolean;
}

/**
 * AuthInput - Glassmorphic input field for authentication forms
 * Consistent with Studio UI design
 */
export function AuthInput({
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  disabled = false,
}: AuthInputProps) {
  return (
    <div className="w-full">
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            <Icon className="h-5 w-5 text-white/40" />
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full rounded-xl border bg-white/[0.02] px-4 py-3.5 text-white backdrop-blur-xl transition-all duration-300 placeholder:text-white/40 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${Icon ? 'pl-12' : ''} ${
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
              : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20'
          } `}
        />
      </div>

      {/* Error Message */}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}






