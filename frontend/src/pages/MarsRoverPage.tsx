import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import NasaImage from '../components/NasaImage';
import { 
  RocketLaunchIcon, 
  CameraIcon, 
  CalendarIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

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

interface MarsPhotosResponse {
  photos: MarsPhoto[];
  nextPage?: number;
  total?: number;
}

interface RoverInfo {
  name: string;
  value: string;
  status: 'active' | 'inactive';
  launchDate: string;
  landingDate: string;
  description: string;
  image: string;
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
    description: 'Exploring Gale Crater to study Mars\' climate and geology, and prepare for human exploration.',
    image: '/images/curiosity.jpg'
  },
  {
    name: 'Perseverance',
    value: 'perseverance',
    status: 'active',
    launchDate: 'July 30, 2020',
    landingDate: 'February 18, 2021',
    description: 'Searching for signs of ancient life and collecting samples for future return to Earth.',
    image: '/images/perseverance.jpg'
  },
];

const MarsRoverPage: React.FC = () => {
  const [selectedRover, setSelectedRover] = useState<string>('curiosity');
  const [sol, setSol] = useState<number>(1000);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRoverInfo, setSelectedRoverInfo] = useState<RoverInfo>(ROVERS[0]);
  const [selectedCamera, setSelectedCamera] = useState<string>('all');

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['mars-photos', selectedRover, sol, selectedCamera],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(`${API_URL}/api/mars-photos`, {
        params: {
          rover: selectedRover,
          sol,
          page: pageParam,
          limit: PHOTOS_PER_PAGE,
          camera: selectedCamera !== 'all' ? selectedCamera : undefined
        }
      });
      return {
        photos: response.data.photos || [],
        nextPage: pageParam + 1,
        total: response.data.total || 0
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.photos) return undefined;
      return lastPage.photos.length === PHOTOS_PER_PAGE ? lastPage.nextPage : undefined;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
  });

  useEffect(() => {
    const rover = ROVERS.find(r => r.value === selectedRover);
    if (rover) {
      setSelectedRoverInfo(rover);
    }
  }, [selectedRover]);

  const handleRoverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRover(e.target.value);
    setSol(1000); // Reset sol when changing rovers
    setSelectedCamera('all'); // Reset camera selection
    setCurrentPage(1);
  };

  const handleSolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setSol(value);
      setCurrentPage(1);
    }
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCamera(e.target.value);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    fetchNextPage();
  };

  const allPhotos = data?.pages.flatMap(page => page?.photos || []) || [];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-nasa-blue to-gray-900 p-8 text-white shadow-xl space-bg">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <RocketLaunchIcon className="h-8 w-8 text-nasa-red" />
            <h1 className="text-4xl font-bold tracking-tight">Mars Rover Photos</h1>
          </div>
          <p className="text-gray-300 mt-2 max-w-2xl">
            Explore the surface of Mars through the eyes of NASA's rovers. View high-resolution images captured by various cameras on different Martian days (sols).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rover Selection and Controls */}
        <div className="">
          <div className="flex items-center space-x-2 mb-6">
            <RocketLaunchIcon className="h-6 w-6 text-nasa-blue" />
            <h2 className="text-2xl font-bold text-gray-900">Rover Controls</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Rover
              </label>
              <div className="relative">
                <RocketLaunchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={selectedRover}
                  onChange={handleRoverChange}
                  className="input pl-10"
                >
                  {ROVERS.map(rover => (
                    <option key={rover.value} value={rover.value}>
                      {rover.name} ({rover.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sol (Martian Day)
              </label>
              <div className="relative">
                <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="number"
                  value={sol}
                  onChange={handleSolChange}
                  min="0"
                  className="input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Camera
              </label>
              <div className="relative">
                <CameraIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={selectedCamera}
                  onChange={handleCameraChange}
                  className="input pl-10"
                >
                  <option value="all">All Cameras</option>
                  <option value="FHAZ">Front Hazard Avoidance Camera</option>
                  <option value="RHAZ">Rear Hazard Avoidance Camera</option>
                  <option value="MAST">Mast Camera</option>
                  <option value="CHEMCAM">Chemistry and Camera Complex</option>
                  <option value="MAHLI">Mars Hand Lens Imager</option>
                  <option value="MARDI">Mars Descent Imager</option>
                  <option value="NAVCAM">Navigation Camera</option>
                  <option value="PANCAM">Panoramic Camera</option>
                  <option value="MINITES">Miniature Thermal Emission Spectrometer</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Rover Information */}
        <div className="lg:col-span-2">
          <div className="">
            <div className="flex items-start space-x-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                <img
                  src={selectedRoverInfo.image}
                  alt={selectedRoverInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedRoverInfo.name}</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-2">
                      <ArrowPathIcon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-600">Status</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedRoverInfo.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedRoverInfo.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-600">Launch Date</span>
                    </div>
                    <span className="text-gray-900">{selectedRoverInfo.launchDate}</span>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-600">Landing Date</span>
                    </div>
                    <span className="text-gray-900">{selectedRoverInfo.landingDate}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-600">Mission Description</span>
                    </div>
                    <p className="text-gray-700">{selectedRoverInfo.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="loading-spinner"></div>
        </div>
      ) : error ? (
        <div className="error-container">
          <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Photos</h2>
            <p className="text-sm">Please try again later.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPhotos.map((photo) => (
              <div key={photo.id} className="overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                <NasaImage
                  src={photo.img_src}
                  alt={`Mars photo taken by ${photo.rover.name} on sol ${photo.sol}`}
                  title={`${photo.camera.full_name}`}
                  date={photo.earth_date}
                  description={`Sol: ${photo.sol}`}
                />
              </div>
            ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="btn-primary"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More Photos'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MarsRoverPage; 