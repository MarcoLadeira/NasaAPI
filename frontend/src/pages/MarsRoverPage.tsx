import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import NasaImage from '../components/NasaImage';
import Spinner from '../components/Spinner';

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
  {
    name: 'Spirit',
    value: 'spirit',
    status: 'inactive',
    launchDate: 'June 10, 2003',
    landingDate: 'January 4, 2004',
    description: 'Completed its mission in 2010 after getting stuck in soft soil. Operated for 6 years, 2 months, and 19 days.',
    image: '/images/spirit.jpg'
  },
  {
    name: 'Opportunity',
    value: 'opportunity',
    status: 'inactive',
    launchDate: 'July 7, 2003',
    landingDate: 'January 25, 2004',
    description: 'Operated for 14 years, 6 months, and 10 days before losing contact during a global dust storm.',
    image: '/images/opportunity.jpg'
  }
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
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 30, 
  });

  useEffect(() => {
    const rover = ROVERS.find(r => r.value === selectedRover);
    if (rover) {
      setSelectedRoverInfo(rover);
    }
  }, [selectedRover]);

  const handleRoverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRover(e.target.value);
    setSol(1000); 
    setSelectedCamera('all'); 
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Mars Rover Photos</h1>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Rover
                </label>
                <select
                  value={selectedRover}
                  onChange={handleRoverChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                >
                  {ROVERS.map(rover => (
                    <option key={rover.value} value={rover.value}>
                      {rover.name} ({rover.status})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sol (Martian Day)
                </label>
                <input
                  type="number"
                  value={sol}
                  onChange={handleSolChange}
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Camera
                </label>
                <select
                  value={selectedCamera}
                  onChange={handleCameraChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
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

            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start space-x-6">
                  <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={selectedRoverInfo.image}
                      alt={selectedRoverInfo.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedRoverInfo.name}</h2>
                    <div className="space-y-3">
                      <p className="flex items-center">
                        <span className="font-medium w-24">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedRoverInfo.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedRoverInfo.status}
                        </span>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Launch:</span> {selectedRoverInfo.launchDate}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Landing:</span> {selectedRoverInfo.landingDate}
                      </p>
                      <p className="text-gray-600 mt-4">{selectedRoverInfo.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              {isLoading && <Spinner size="lg" />}
              {error && <p className="text-red-500 text-center text-lg">Error: {error.message}</p>}

              {!isLoading && !error && allPhotos.length === 0 && (
                <p className="text-center text-gray-600 text-lg">No photos found for the selected criteria. Try a different Sol or Camera.</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPhotos.map(photo => (
                  <div key={photo.id} className="rounded-lg shadow-md overflow-hidden bg-white relative group smooth-transition aspect-square">
                    <NasaImage 
                      src={photo.img_src}
                      alt={`Mars Rover Photo from ${photo.rover.name}`}
                      title={`Camera: ${photo.camera.full_name}`}
                      date={`Earth Date: ${photo.earth_date}`}
                      description={`Sol: ${photo.sol}`}
                    />
                  </div>
                ))}
              </div>

              {hasNextPage && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="nasa-button px-6 py-3 rounded-lg shadow-md text-lg"
                  >
                    {isFetchingNextPage ? 'Loading more...' : 'Load More Photos'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarsRoverPage; 