/**
 * GalleryGrid Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GalleryGrid, GalleryImage } from '@/components/molecules/GalleryGrid';

const mockImages: GalleryImage[] = [
  {
    id: '1',
    src: 'https://example.com/image1.jpg',
    alt: 'Test Image 1',
    type: 'manual',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    src: 'https://example.com/image2.jpg',
    alt: 'Test Image 2',
    type: 'ai-edited',
    createdAt: new Date('2024-01-02'),
  },
];

describe('GalleryGrid', () => {
  const mockHandlers = {
    onView: vi.fn(),
    onOpenInStudio: vi.fn(),
    onDownload: vi.fn(),
    onDelete: vi.fn(),
    onToggleFavorite: vi.fn(),
    onEditMetadata: vi.fn(),
    isFavorite: vi.fn(() => false),
    getFavoriteOrder: vi.fn(() => 0),
    hasMetadata: vi.fn(() => false),
  };

  it('renders grid with images', () => {
    render(<GalleryGrid images={mockImages} {...mockHandlers} />);
    
    expect(screen.getByText('Test Image 1')).toBeInTheDocument();
    expect(screen.getByText('Test Image 2')).toBeInTheDocument();
  });

  it('renders empty state when no images', () => {
    render(<GalleryGrid images={[]} {...mockHandlers} />);
    
    // Should render empty state
    const grid = screen.queryByRole('grid');
    expect(grid).not.toBeInTheDocument();
  });

  it('calls onView when image is clicked', () => {
    render(<GalleryGrid images={mockImages} {...mockHandlers} />);
    
    const imageCards = screen.getAllByRole('article');
    fireEvent.click(imageCards[0]);
    
    expect(mockHandlers.onView).toHaveBeenCalledWith(mockImages[0]);
  });

  it('displays favorite indicator for favorite images', () => {
    const favoriteCheck = vi.fn((id: string) => id === '1');
    
    render(<GalleryGrid images={mockImages} {...mockHandlers} isFavorite={favoriteCheck} />);
    
    expect(favoriteCheck).toHaveBeenCalled();
  });

  it('calls onToggleFavorite when favorite button is clicked', () => {
    render(<GalleryGrid images={mockImages} {...mockHandlers} />);
    
    const favoriteButtons = screen.getAllByLabelText(/favorite/i);
    fireEvent.click(favoriteButtons[0]);
    
    expect(mockHandlers.onToggleFavorite).toHaveBeenCalledWith(mockImages[0]);
  });

  it('calls onDownload when download button is clicked', () => {
    render(<GalleryGrid images={mockImages} {...mockHandlers} />);
    
    const downloadButtons = screen.getAllByLabelText(/download/i);
    fireEvent.click(downloadButtons[0]);
    
    expect(mockHandlers.onDownload).toHaveBeenCalledWith(mockImages[0]);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<GalleryGrid images={mockImages} {...mockHandlers} />);
    
    const deleteButtons = screen.getAllByLabelText(/delete/i);
    fireEvent.click(deleteButtons[0]);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockImages[0]);
  });

  it('renders correct number of images', () => {
    render(<GalleryGrid images={mockImages} {...mockHandlers} />);
    
    const imageCards = screen.getAllByRole('article');
    expect(imageCards).toHaveLength(2);
  });

  it('displays AI-edited badge for AI images', () => {
    render(<GalleryGrid images={mockImages} {...mockHandlers} />);
    
    expect(screen.getByText(/ai/i)).toBeInTheDocument();
  });
});

