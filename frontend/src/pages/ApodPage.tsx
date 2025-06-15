import React, { useState } from 'react';
import { useApod, useApodRange } from '../hooks/useNasaData';
import NasaImage from '../components/NasaImage';

const ApodPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const { data: apodData, isLoading, error } = useApod(selectedDate);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nasa-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading APOD</h2>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Astronomy Picture of the Day</h1>
        <div className="flex items-center space-x-4">
          <label htmlFor="date" className="text-sm font-medium text-gray-700">
            Select Date:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
            className="input max-w-xs"
          />
        </div>
      </div>

      {apodData?.data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NasaImage
            src={apodData.data.url}
            alt={apodData.data.title}
            title={apodData.data.title}
            description={apodData.data.explanation}
            date={apodData.data.date}
          />
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Image Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(apodData.data.date).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Copyright</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {apodData.data.copyright || 'Public Domain'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Media Type</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {apodData.data.media_type}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">HD Version</dt>
                <dd className="mt-1">
                  {apodData.data.hdurl && (
                    <a
                      href={apodData.data.hdurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-nasa-blue hover:text-blue-700"
                    >
                      View HD Image
                    </a>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApodPage; 