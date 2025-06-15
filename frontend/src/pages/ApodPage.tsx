import React, { useState, useEffect } from 'react';
import { useApod, useApodRange } from '../hooks/useNasaData';
import NasaImage from '../components/NasaImage';
import Spinner from '../components/Spinner';

const ApodPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const { data: apodData, isLoading, error, refetch } = useApod(selectedDate);

  // Reset to today's APOD when component mounts
  useEffect(() => {
    if (!selectedDate) {
      refetch();
    }
  }, [selectedDate, refetch]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];
    
    // If the selected date is today, use empty string to fetch today's APOD
    setSelectedDate(newDate === today ? '' : newDate);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h2 className="text-xl font-semibold mb-2">Error Loading APOD</h2>
            <p className="text-sm">
              {(error as any)?.response?.data?.details || 'Please try again later.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedDate('');
            refetch();
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Return to Today's Image
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Astronomy Picture of the Day</h1>
        <div className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <label htmlFor="date" className="text-sm font-medium text-gray-700">
            Select Date:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate || new Date().toISOString().split('T')[0]}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {apodData?.data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <NasaImage
              src={apodData.data.url}
              alt={apodData.data.title}
              title={apodData.data.title}
              description={apodData.data.explanation}
              date={apodData.data.date}
            />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Image Details</h2>
            <dl className="space-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(apodData.data.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
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
                <dd className="mt-1 text-sm text-gray-900 capitalize">
                  {apodData.data.media_type}
                </dd>
              </div>
              {apodData.data.hdurl && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">HD Version</dt>
                  <dd className="mt-1">
                    <a
                      href={apodData.data.hdurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      View HD Image
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApodPage; 