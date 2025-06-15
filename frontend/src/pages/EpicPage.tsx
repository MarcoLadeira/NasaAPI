import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import NasaImage from '../components/NasaImage';
import Spinner from '../components/Spinner';

interface EpicImage {
  identifier: string;
  caption: string;
  image: string;
  version: string;
  date: string;
  centroid_coordinates: {
    lat: number;
    lon: number;
  };
}

const EpicPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const { data: epicData, isLoading, error } = useQuery({
    queryKey: ['epic', selectedDate],
    queryFn: async () => {
      const response = await axios.get<EpicImage[]>(`http://localhost:3002/api/epic?date=${selectedDate}`);
      return response.data;
    },
    enabled: !!selectedDate,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading EPIC data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Earth Polychromatic Imaging Camera (EPIC)</h1>
        <p className="text-gray-600 mb-4">
          View Earth from the DSCOVR satellite's EPIC camera. Select a date to see images from that day.
        </p>
        <div className="flex items-center gap-4">
          <label htmlFor="date" className="text-gray-700">Select Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {epicData && epicData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {epicData.map((image) => (
            <div key={image.identifier} className="bg-white rounded-lg shadow-md overflow-hidden smooth-transition hover:shadow-lg">
              <NasaImage
                src={`https://epic.gsfc.nasa.gov/archive/natural/${selectedDate.replace(/-/g, '/')}/png/${image.image}.png`}
                alt={`Earth from EPIC on ${selectedDate}`}
                className="w-full h-48 object-cover"
                title="Earth from Space"
                date={new Date(image.date).toLocaleString()}
                description={`Latitude: ${image.centroid_coordinates.lat.toFixed(2)}°N, Longitude: ${image.centroid_coordinates.lon.toFixed(2)}°E`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No images available for the selected date.</p>
        </div>
      )}
    </div>
  );
};

export default EpicPage; 