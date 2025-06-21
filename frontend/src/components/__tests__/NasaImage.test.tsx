import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NasaImage from '../NasaImage';

describe('NasaImage', () => {
  const defaultProps = {
    src: 'test-image.jpg',
    alt: 'Test Alt Text',
  };

  it('renders without crashing', () => {
    render(<NasaImage {...defaultProps} />);
    expect(screen.getByAltText(/test alt text/i)).toBeInTheDocument();
  });

  it('shows loading spinner initially', () => {
    render(<NasaImage {...defaultProps} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('hides loading spinner and shows image after load', async () => {
    render(<NasaImage {...defaultProps} />);
    const image = screen.getByAltText(/test alt text/i);
    
    // Simulate image loading
    image.dispatchEvent(new Event('load'));

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('opacity-100'); // Check for opacity change after loading
  });

  it('displays title, date, and description when provided', () => {
    const propsWithDetails = {
      ...defaultProps,
      title: 'Test Title',
      date: '2023-01-01',
      description: 'This is a test description.',
    };
    render(<NasaImage {...propsWithDetails} />);
    expect(screen.getByText(/test title/i)).toBeInTheDocument();
    expect(screen.getByText(/2023-01-01/i)).toBeInTheDocument();
    expect(screen.getByText(/this is a test description\./i)).toBeInTheDocument();
  });

  it('renders download button when onDownload prop is provided', () => {
    const handleDownload = jest.fn();
    render(<NasaImage {...defaultProps} onDownload={handleDownload} />);
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('shows error state on image load failure', async () => {
    render(<NasaImage {...defaultProps} />);
    const image = screen.getByAltText(/test alt text/i);
    
    // Simulate image error
    image.dispatchEvent(new Event('error'));

    await waitFor(() => {
      expect(screen.getByText(/failed to load image/i)).toBeInTheDocument();
    });
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });
}); 