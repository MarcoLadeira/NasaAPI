import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import NasaImage from '../components/NasaImage';
import { 
  RocketLaunchIcon, 
  ExclamationTriangleIcon
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

interface RoverInfo {
  name: string;
  value: string;
  status: 'active' | 'inactive';
  launchDate: string;
  landingDate: string;
  description: string;
  image: string;
}

const API_URL = '/api';
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
  // Load initial preferences from localStorage or use defaults
  const getInitialRover = () => localStorage.getItem('marsRoverDefaultRover') || 'curiosity';
  const getInitialSol = () => {
    const savedSol = localStorage.getItem('marsRoverDefaultSol');
    return savedSol ? parseInt(savedSol) : 1000;
  };
  const getInitialCamera = () => localStorage.getItem('marsRoverDefaultCamera') || 'all';

  const [selectedRover, setSelectedRover] = useState<string>(getInitialRover());
  const [sol, setSol] = useState<number>(getInitialSol());
  const [selectedRoverInfo, setSelectedRoverInfo] = useState<RoverInfo>(ROVERS.find(r => r.value === getInitialRover()) || ROVERS[0]);
  const [selectedCamera, setSelectedCamera] = useState<string>(getInitialCamera());

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
      const response = await axios.get(`${API_URL}/mars-photos`, {
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

  // Effect to update rover info when selectedRover changes (also on initial load)
  useEffect(() => {
    const rover = ROVERS.find(r => r.value === selectedRover);
    if (rover) {
      setSelectedRoverInfo(rover);
    }
  }, [selectedRover]);

  // Effects to save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('marsRoverDefaultRover', selectedRover);
  }, [selectedRover]);

  useEffect(() => {
    localStorage.setItem('marsRoverDefaultSol', sol.toString());
  }, [sol]);

  useEffect(() => {
    localStorage.setItem('marsRoverDefaultCamera', selectedCamera);
  }, [selectedCamera]);

  const handleRoverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRover = e.target.value;
    setSelectedRover(newRover);
    setSol(1000); // Reset sol when changing rovers
    setSelectedCamera('all'); // Reset camera selection
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
      }
    }, 500); // Debounce for 500ms
  }, []);

  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCamera(e.target.value);
  };

  // New functions for explicit preference management
  const saveCurrentPreferences = () => {
    localStorage.setItem('marsRoverDefaultRover', selectedRover);
    localStorage.setItem('marsRoverDefaultSol', sol.toString());
    localStorage.setItem('marsRoverDefaultCamera', selectedCamera);
    alert('Your preferences have been saved!');
  };

  const resetPreferences = () => {
    localStorage.removeItem('marsRoverDefaultRover');
    localStorage.removeItem('marsRoverDefaultSol');
    localStorage.removeItem('marsRoverDefaultCamera');
    // Reset state to default values after clearing localStorage
    setSelectedRover('curiosity');
    setSol(1000);
    setSelectedCamera('all');
    alert('Your preferences have been reset to default.');
  };

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const handleDownloadPhoto = (e: React.MouseEvent, imageUrl: string, photoId: number) => {
    e.preventDefault(); // Prevent default link behavior if inside an anchor tag
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `mars_photo_${photoId}.jpg`; // Suggest a filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="text-2xl font-bold mt-4 mb-2">Error Loading Mars Rover Photos</h2>
        <p className="text-gray-600 mb-4">
          {(error as any)?.response?.data?.details || 'Failed to fetch photos. Please try again later.'}
        </p>
        <button
          onClick={() => window.location.reload()} // Simple refresh for now
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  // Get all photos from all pages
  const allPhotos = data?.pages.flatMap(page => page.photos) || [];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <header className="bg-nasa-blue text-white p-6 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <RocketLaunchIcon className="h-8 w-8 text-white" />
            <h1 className="text-4xl font-bold mb-2">Mars Rover Photos</h1>
          </div>
          <p className="text-lg opacity-90 mb-6">
            Explore the Martian landscape through the eyes of NASA's active rovers. Dive into a vast collection of raw and processed images, offering unique perspectives from the surface of the Red Planet.
          </p>
          <div className="bg-nasa-blue/50 p-4 rounded-lg flex items-center space-x-3">
            <span className="text-white font-semibold">Current Rover:</span>
            <span className="text-white text-lg font-bold">{selectedRoverInfo.name}</span>
            <span className="text-white opacity-80">({selectedRoverInfo.status})</span>
          </div>
        </div>
      </header>

      {/* Filters and Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <label htmlFor="rover-select" className="block text-gray-700 text-sm font-bold mb-2">Select Rover:</label>
          <select
            id="rover-select"
            value={selectedRover}
            onChange={handleRoverChange}
            className="input-field"
          >
            {ROVERS.map(rover => (
              <option key={rover.value} value={rover.value}>
                {rover.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sol-input" className="block text-gray-700 text-sm font-bold mb-2">Martian Sol (Day):</label>
          <input
            type="number"
            id="sol-input"
            value={sol}
            onChange={handleSolChange}
            min="1"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="camera-select" className="block text-gray-700 text-sm font-bold mb-2">Select Camera:</label>
          <select
            id="camera-select"
            value={selectedCamera}
            onChange={handleCameraChange}
            className="input-field"
          >
            <option value="all">All Cameras</option>
            {selectedRover === 'curiosity' && (
              <>
                <option value="FHAZ">FHAZ (Front Hazard Avoidance Camera)</option>
                <option value="RHAZ">RHAZ (Rear Hazard Avoidance Camera)</option>
                <option value="MAST">MAST (Mast Camera)</option>
                <option value="CHEMCAM">CHEMCAM (Chemistry and Camera Complex)</option>
                <option value="MAHLI">MAHLI (Mars Hand Lens Imager)</option>
                <option value="MARDI">MARDI (Mars Descent Imager)</option>
                <option value="NAVCAM">NAVCAM (Navigation Camera)</option>
              </>
            )}
            {selectedRover === 'perseverance' && (
              <>
                <option value="FHAZ">FHAZ (Front Hazard Avoidance Camera)</option>
                <option value="RHAZ">RHAZ (Rear Hazard Avoidance Camera)</option>
                <option value="NAVCAM">NAVCAM (Navigation Camera)</option>
                <option value="MAST">MAST (Mastcam-Z)</option>
                <option value="CHEMCAM">CHEMCAM (SuperCam Remote Micro-Imager)</option>
                <option value="SHERLOC_WATSON">SHERLOC_WATSON (SHERLOC Watson Camera)</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-white p-6 rounded-lg shadow-md flex justify-end space-x-4">
        <button onClick={saveCurrentPreferences} className="btn-secondary">
          Save Preferences
        </button>
        <button onClick={resetPreferences} className="btn-secondary-outline">
          Reset Preferences
        </button>
      </div>

      {/* Photo Grid */}
      {allPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allPhotos.map(photo => (
            <NasaImage
              key={photo.id}
              src={photo.img_src}
              alt={`Mars Rover Photo from ${photo.rover.name} - Sol ${photo.sol} - Camera ${photo.camera.name}`}
              title={`Photo by ${photo.rover.name}'s ${photo.camera.full_name}`}
              date={photo.earth_date}
              onDownload={(e: React.MouseEvent<HTMLButtonElement>) => handleDownloadPhoto(e, photo.img_src, photo.id)}
              media_type="image"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600">
          <p className="text-lg">No photos found for the selected criteria.</p>
          <p className="text-md">Try adjusting the Sol (Martian day) or camera filter.</p>
        </div>
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            className="btn-primary px-8 py-3 text-lg"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More Photos'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MarsRoverPage; 