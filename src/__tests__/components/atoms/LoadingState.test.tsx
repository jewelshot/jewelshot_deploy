/**
 * LoadingState Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingState from '@/components/atoms/LoadingState';

describe('LoadingState', () => {
  it('renders loading spinner', () => {
    const { container } = render(<LoadingState />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingState message="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders without message when not provided', () => {
    const { container } = render(<LoadingState />);
    // Should only have spinner, no text
    expect(container.textContent).toBe('');
  });

  it('renders with custom size', () => {
    const { container, rerender } = render(<LoadingState size="sm" />);
    let spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();

    rerender(<LoadingState size="lg" />);
    spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('centers content by default', () => {
    const { container } = render(<LoadingState />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('flex');
    expect(wrapper.className).toContain('items-center');
    expect(wrapper.className).toContain('justify-center');
  });
});

