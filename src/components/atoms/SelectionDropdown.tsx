import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectionDropdownProps {
  label: string;
  placeholder: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  inline?: boolean; // Label and dropdown on same line
}

/**
 * SelectionDropdown - Glassmorphic dropdown for gender/jewelry selection
 * Matches the UI design with smooth animations
 */
export function SelectionDropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  helperText,
  inline = false,
}: SelectionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      className={inline ? 'flex items-center gap-1.5' : 'relative'}
      ref={dropdownRef}
    >
      {/* Label */}
      <label
        className={`text-[10px] font-medium uppercase tracking-wide text-white/60 ${
          inline ? 'min-w-[50px] shrink-0' : 'mb-2 block'
        }`}
      >
        {label}
        {required && <span className="ml-0.5 text-red-400">*</span>}
        {!inline && helperText && (
          <span className="ml-1 text-[10px] text-white/40">{helperText}</span>
        )}
      </label>

      {/* Dropdown Container (for relative positioning in inline mode) */}
      <div className={inline ? 'relative flex-1' : 'relative'}>
        {/* Dropdown Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-left text-xs transition-all duration-200 ${
            disabled
              ? 'cursor-not-allowed border-white/5 bg-white/[0.01] text-white/20'
              : isOpen
                ? 'border-purple-500/50 bg-white/[0.05] text-white shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                : value
                  ? 'border-purple-500/30 bg-white/[0.03] text-white/90 hover:border-purple-500/40 hover:bg-white/[0.05]'
                  : 'border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:bg-white/[0.03]'
          }`}
        >
          <span className="truncate text-xs">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`ml-1.5 h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            } ${disabled ? 'text-white/20' : 'text-white/60'}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-purple-500/20 bg-[rgba(17,17,17,0.95)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-[24px] backdrop-saturate-[200%]">
            <div className="max-h-[200px] overflow-y-auto py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`flex w-full items-center justify-between px-2.5 py-1.5 text-left text-xs transition-all duration-150 ${
                    value === option.value
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'text-white/80 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <Check className="h-3.5 w-3.5 text-purple-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
