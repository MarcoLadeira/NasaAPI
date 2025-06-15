import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NasaImage from './NasaImage';

describe('NasaImage', () => {
  test('renders the image with correct alt text', () => {
    const testProps = {
      src: 'test-image.jpg',
      alt: 'Test Alt Text',
      title: 'Test Title',
      date: '2023-01-01',
      description: 'Test Description',
    };

    render(<NasaImage {...testProps} />);

    const imageElement = screen.getByAltText(testProps.alt);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', testProps.src);

    // Check if the title is present, but initially hidden (due to hover)
    // We'll just check for presence in the document here as a basic check
    expect(screen.getByText(testProps.title)).toBeInTheDocument();
  });

  test('displays loading spinner initially', () => {
    const testProps = {
      src: 'test-image.jpg',
      alt: 'Test Alt Text',
    };

    render(<NasaImage {...testProps} />);
    const spinner = screen.getByTestId('loading-spinner'); // Assuming you add data-testid="loading-spinner" to your spinner div
    expect(spinner).toBeInTheDocument();
  });

  test('displays error message on image load failure', async () => {
    const testProps = {
      src: 'invalid-image.jpg',
      alt: 'Broken Image',
    };

    render(<NasaImage {...testProps} />);

    const imageElement = screen.getByAltText(testProps.alt);
    fireEvent.error(imageElement);

    await screen.findByText('Failed to load image');
    expect(screen.getByText('Failed to load image')).toBeInTheDocument();
  });
}); 