import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import NasaImage from '../components/NasaImage';
import { Spinner } from '../components/Spinner';

interface MarsPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  sol: number;
  camera: {
    id: number;
    name: string;
    full_name: string;
  };
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

interface RoverInfo {
  name: string;
  value: string;
  status: 'active' | 'inactive';
  launchDate: string;
  landingDate: string;
  description: string;
}

const API_URL = 'http://localhost:3002';
const PHOTOS_PER_PAGE = 12;

const ROVERS: RoverInfo[] = [
  {
    name: 'Curiosity',
    value: 'curiosity',
    status: 'active',
    launchDate: 'November 26, 2011',
    landingDate: 'August 6, 2012',
    description: 'Exploring Gale Crater to study Mars\' climate and geology, and prepare for human exploration.'
  },
  {
    name: 'Perseverance',
    value: 'perseverance',
    status: 'active',
    launchDate: 'July 30, 2020',
    landingDate: 'February 18, 2021',
    description: 'Searching for signs of ancient life and collecting samples for future return to Earth.'
  },
  {
    name: 'Spirit',
    value: 'spirit',
    status: 'inactive',
    launchDate: 'June 10, 2003',
    landingDate: 'January 4, 2004',
    description: 'Completed its mission in 2010 after getting stuck in soft soil. Operated for 6 years, 2 months, and 19 days.'
  },
  {
    name: 'Opportunity',
    value: 'opportunity',
    status: 'inactive',
    launchDate: 'July 7, 2003',
    landingDate: 'January 25, 2004',
    description: 'Operated for 14 years, 6 months, and 10 days before losing contact during a global dust storm.'
  }
];

export const MarsRoverPage: React.FC = () => {
  const [selectedRover, setSelectedRover] = useState<string>('curiosity');
  const [sol, setSol] = useState<number>(1000);
  const [photos, setPhotos] = useState<MarsPhoto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPhotos, setTotalPhotos] = useState<number>(0);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [selectedRoverInfo, setSelectedRoverInfo] = useState<RoverInfo>(ROVERS[0]);

  useEffect(() => {
    const rover = ROVERS.find(r => r.value === selectedRover);
    if (rover) {
      setSelectedRoverInfo(rover);
    }
  }, [selectedRover]);

  const fetchPhotos = useCallback(async (page: number = 1) => {
    try {
      const response = await axios.get(`${API_URL}/api/mars-photos`, {
        params: {
          rover: selectedRover,
          sol,
          page,
          limit: PHOTOS_PER_PAGE
        }
      });

      if (page === 1) {
        setPhotos(response.data.photos);
      } else {
        setPhotos(prev => [...prev, ...response.data.photos]);
      }
      
      setTotalPhotos(response.data.total);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching photos:', err);
      setError(err.response?.data?.error || 'Failed to fetch photos');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [selectedRover, sol]);

  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    fetchPhotos(1);
  }, [selectedRover, sol, fetchPhotos]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setIsLoadingMore(true);
    fetchPhotos(nextPage);
  };

  const handleRoverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRover(e.target.value);
    setSol(1000); // Reset sol when changing rovers
  };

  const handleSolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setSol(value);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Mars Rover Photos</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Rover
                </label>
                <select
                  value={selectedRover}
                  onChange={handleRoverChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {ROVERS.map(rover => (
                    <option key={rover.value} value={rover.value}>
                      {rover.name} ({rover.status})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sol (Martian Day)
                </label>
                <input
                  type="number"
                  value={sol}
                  onChange={handleSolChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">{selectedRoverInfo.name}</h2>
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="font-medium w-24">Status:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    selectedRoverInfo.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedRoverInfo.status}
                  </span>
                </p>
                <p><span className="font-medium">Launch:</span> {selectedRoverInfo.launchDate}</p>
                <p><span className="font-medium">Landing:</span> {selectedRoverInfo.landingDate}</p>
                <p className="text-sm text-gray-600 mt-2">{selectedRoverInfo.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && <Spinner />}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {!loading && !error && photos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No photos found for the selected criteria.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={`${photo.id}-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden">
            <NasaImage
              src={photo.img_src}
              alt={`Mars photo from ${selectedRoverInfo.name}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-gray-600">
                Camera: {photo.camera.full_name}
              </p>
              <p className="text-sm text-gray-600">
                Sol: {photo.sol}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && photos.length > 0 && photos.length < totalPhotos && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoadingMore ? 'Loading...' : 'Load More Photos'}
          </button>
        </div>
      )}
    </div>
  );
}; 