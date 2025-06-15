import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  const getCameraPurpose = (camera: string): string => {
    switch (camera) {
      case 'FHAZ': return 'Front Hazard Avoidance Camera: Used for navigation and obstacle detection.';
      case 'RHAZ': return 'Rear Hazard Avoidance Camera: Used for navigation and obstacle detection.';
      case 'MAST': return 'Mast Camera: Provides panoramic and stereoscopic images.';
      case 'CHEMCAM': return 'Chemistry and Camera Complex: Analyzes the chemical composition of rocks and soil.';
      case 'MAHLI': return 'Mars Hand Lens Imager: Microscopic imaging of rocks and soil.';
      case 'MARDI': return 'Mars Descent Imager: Captures images during landing.';
      case 'NAVCAM': return 'Navigation Camera: Used for navigation and broad terrain imaging.';
      case 'PANCAM': return 'Panoramic Camera: Provides high-resolution panoramic images.';
      case 'MINITES': return 'Miniature Thermal Emission Spectrometer: Analyzes thermal infrared spectra of surfaces.';
      case 'all': return 'Displays photos from all available cameras.';
      default: return 'Select a camera to see its purpose.';
    }
  };

  const getRoverLegacyInsight = (rover: RoverInfo): string => {
    if (rover.status === 'active') {
      return `The ${rover.name} rover is currently active, continuing its mission to explore Mars.`
    } else {
      switch (rover.name) {
        case 'Spirit': return 'Spirit\'s mission concluded after getting stuck, but it significantly advanced our understanding of Martian geology.';
        case 'Opportunity': return 'Opportunity operated far beyond its expected lifespan, revealing incredible insights into Mars\' watery past.';
        default: return 'This rover has completed its mission, providing valuable data for Mars exploration.';
      }
    }
  };

  // AI-like Feature: Smart Sol Suggestion
  const getSmartSolSuggestion = (roverName: string): { sol: number; reason: string } => {
    switch (roverName) {
      case 'curiosity':
        return { sol: 1000, reason: 'First discovery of ancient streambed sediments.' };
      case 'perseverance':
        return { sol: 50, reason: 'Early operations and first major flight of Ingenuity helicopter.' };
      default:
        return { sol: 1, reason: 'First day of operations on Mars.' };
    }
  };

  // AI-like Feature: Predicted Photo Count
  const getPredictedPhotoCount = (roverName: string, sol: number): string => {
    // This is a simplified heuristic, not actual prediction based on real data patterns
    if (roverName === 'curiosity') {
      if (sol < 100) return 'Expected: Low (50-200)';
      if (sol < 2000) return 'Expected: Medium (200-800)';
      return 'Expected: High (800+)';
    } else if (roverName === 'perseverance') {
      if (sol < 50) return 'Expected: Low (30-150)';
      if (sol < 500) return 'Expected: Medium (150-600)';
      return 'Expected: High (600+)';
    }
    return 'Expected: Varies';
  };

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

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSolChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (!isNaN(value) && value >= 0) {
        setSol(value);
        setCurrentPage(1);
      }
    }, 500); // Debounce for 500ms
  }, []);

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
              <select
                value={selectedRover}
                onChange={handleRoverChange}
                className="input"
              >
                {ROVERS.map((rover) => (
                  <option key={rover.value} value={rover.value}>
                    {rover.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Martian Day (Sol)
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
              <select
                value={selectedCamera}
                onChange={handleCameraChange}
                className="input"
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
                  <p className="text-sm text-gray-700 mt-2 italic">
                    {getRoverLegacyInsight(selectedRoverInfo)}
                  </p>
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