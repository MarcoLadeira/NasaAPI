import React, { useState, useEffect } from 'react';
import { useApod, useApodRange } from '../hooks/useNasaData';
import NasaImage from '../components/NasaImage';
import { 
  CalendarIcon, 
  ExclamationTriangleIcon, 
  PhotoIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  UserIcon,
  FilmIcon
} from '@heroicons/react/24/outline';

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
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
        <div>
          <h2 className="text-xl font-semibold mb-2">Error Loading APOD</h2>
          <p className="text-sm">
            {(error as any)?.response?.data?.details || 'Please try again later.'}
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedDate('');
            refetch();
          }}
          className="btn-primary mt-4"
        >
          Return to Today's Image
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-nasa-blue to-gray-900 p-8 text-white shadow-xl space-bg">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <PhotoIcon className="h-8 w-8 text-nasa-red" />
            <h1 className="text-4xl font-bold tracking-tight">Astronomy Picture of the Day</h1>
          </div>
          <p className="text-gray-300 mt-2 max-w-2xl">
            Discover the cosmos! Each day a different image or photograph of our fascinating universe is featured, along with a brief explanation written by a professional astronomer.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <label htmlFor="date" className="text-sm font-medium text-gray-700">
            Select Date:
          </label>
        </div>
        <div className="relative">
          <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="date"
            id="date"
            value={selectedDate || new Date().toISOString().split('T')[0]}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
            className="input pl-10"
          />
        </div>
      </div>

      {apodData?.data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card group hover:scale-[1.02] transition-all duration-300">
            <NasaImage
              src={apodData.data.url}
              alt={apodData.data.title}
              title={apodData.data.title}
              description={apodData.data.explanation}
              date={apodData.data.date}
            />
          </div>
          <div className="card space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <FilmIcon className="h-6 w-6 text-nasa-blue" />
              <h2 className="text-2xl font-bold text-gray-900">Image Details</h2>
            </div>
            <dl className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-gray-600" />
                  <dt className="text-sm font-medium text-gray-600">Date</dt>
                </div>
                <dd className="text-sm text-gray-900">
                  {new Date(apodData.data.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </dd>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-600" />
                  <dt className="text-sm font-medium text-gray-600">Copyright</dt>
                </div>
                <dd className="text-sm text-gray-900">
                  {apodData.data.copyright || 'Public Domain'}
                </dd>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <div className="flex items-center space-x-2">
                  <PhotoIcon className="h-5 w-5 text-gray-600" />
                  <dt className="text-sm font-medium text-gray-600">Media Type</dt>
                </div>
                <dd className="text-sm text-gray-900 capitalize">
                  {apodData.data.media_type}
                </dd>
              </div>
              {apodData.data.hdurl && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ArrowDownTrayIcon className="h-5 w-5 text-blue-600" />
                    <dt className="text-sm font-medium text-blue-600">HD Version</dt>
                  </div>
                  <dd>
                    <a
                      href={apodData.data.hdurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm"
                    >
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