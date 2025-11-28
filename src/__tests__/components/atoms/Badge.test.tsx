/**
 * Badge Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '@/components/atoms/Badge';

describe('Badge', () => {
  it('renders NEW badge', () => {
    const { container } = render(<Badge variant="new" />);
    expect(screen.getByText('NEW')).toBeInTheDocument();
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-[#6366f1]');
  });

  it('renders PRO badge', () => {
    const { container } = render(<Badge variant="pro" />);
    expect(screen.getByText('PRO')).toBeInTheDocument();
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-[#f97316]');
  });

  it('renders count badge with number', () => {
    render(<Badge variant="count" count={24} />);
    expect(screen.getByText('24')).toBeInTheDocument();
  });

  it('renders dot badge', () => {
    const { container } = render(<Badge variant="dot" color="green" />);
    const dot = container.querySelector('span');
    expect(dot).toHaveClass('bg-green-500');
  });

  it('renders dot badge with custom color', () => {
    const { container } = render(<Badge variant="dot" color="red" />);
    const dot = container.querySelector('span');
    expect(dot).toHaveClass('bg-red-500');
  });

  it('returns null for count badge without count', () => {
    const { container } = render(<Badge variant="count" />);
    expect(container.textContent).toBe('');
  });
});
