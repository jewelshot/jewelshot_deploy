/**
 * DeleteButton Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteButton from '@/components/atoms/DeleteButton';

describe('DeleteButton', () => {
  it('renders delete icon', () => {
    const handleClick = vi.fn();
    const { container } = render(<DeleteButton onClick={handleClick} />);
    
    const icon = container.querySelector('svg.lucide-trash2');
    expect(icon).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    const { container } = render(<DeleteButton onClick={handleClick} />);
    
    const button = container.querySelector('button');
    if (button) {
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  it('has delete title attribute', () => {
    const handleClick = vi.fn();
    const { container } = render(<DeleteButton onClick={handleClick} />);
    
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('title', 'Delete Image');
  });

  it('has hover effect classes', () => {
    const handleClick = vi.fn();
    const { container } = render(<DeleteButton onClick={handleClick} />);
    
    const button = container.querySelector('button');
    expect(button).toHaveClass('hover:bg-red-500/20');
    expect(button).toHaveClass('hover:text-red-300');
  });

  it('renders with correct styling', () => {
    const handleClick = vi.fn();
    const { container } = render(<DeleteButton onClick={handleClick} />);
    
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-red-500/10');
    expect(button).toHaveClass('text-red-400');
    expect(button).toHaveClass('border-red-500/30');
  });
});
