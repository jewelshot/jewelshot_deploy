/**
 * DeleteButton Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteButton from '@/components/atoms/DeleteButton';

describe('DeleteButton', () => {
  it('renders delete icon', () => {
    const { container } = render(<DeleteButton onClick={() => {}} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    const { container } = render(<DeleteButton onClick={handleClick} />);
    
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    
    if (button) {
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  it('disables button when disabled prop is true', () => {
    const { container } = render(<DeleteButton onClick={() => {}} disabled />);
    const button = container.querySelector('button');
    expect(button).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    const { container } = render(<DeleteButton onClick={handleClick} disabled />);
    
    const button = container.querySelector('button');
    if (button) {
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    }
  });

  it('has hover effect when enabled', () => {
    const { container } = render(<DeleteButton onClick={() => {}} />);
    const button = container.querySelector('button');
    expect(button?.className).toContain('hover:');
  });
});

