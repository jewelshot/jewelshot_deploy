/**
 * LoadingState Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingState from '@/components/atoms/LoadingState';

describe('LoadingState', () => {
  it('renders loading text', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with correct styling', () => {
    const { container } = render(<LoadingState />);
    const wrapper = container.querySelector('.flex.h-full');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('items-center', 'justify-center');
  });

  it('renders text with correct color', () => {
    const { container } = render(<LoadingState />);
    const text = container.querySelector('.text-white\\/60');
    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent('Loading...');
  });
});
