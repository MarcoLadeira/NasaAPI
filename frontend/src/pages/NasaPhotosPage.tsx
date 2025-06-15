import React, { useState, useCallback } from 'react';
import { useNasaPhotos } from '../hooks/useNasaData';
import { debounce } from 'lodash';
import { MagnifyingGlassIcon, ArrowDownTrayIcon, AcademicCapIcon, PhotoIcon, LightBulbIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import NasaImage from '../components/NasaImage';
import Modal from '../components/Modal';

interface NasaPhoto {
  nasa_id: string;
  title: string;
  description: string;
  date_created: string;
  center: string;
  photographer?: string;
  keywords?: string[];
  thumbnail_url: string;
  ai_insights: {
    visual_analysis: string;
    historical_context: string;
    artistic_interpretation: string;
  };
}

const NasaPhotosPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('apollo');
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('apollo');
  const [selectedPhoto, setSelectedPhoto] = useState<NasaPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useNasaPhotos(currentSearchTerm);

  const allPhotos = data?.pages.flatMap(page => page.photos) || [];

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setCurrentSearchTerm(value);
    }, 500),
    [setCurrentSearchTerm]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debouncedSetSearchTerm(e.target.value);
  };

  const openPhotoModal = (photo: NasaPhoto) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const closePhotoModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const handleDownloadPhoto = (e: React.MouseEvent, imageUrl: string, photoId: string) => {
    e.stopPropagation(); // Prevent modal from opening when clicking download
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `NasaPhoto_${photoId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-nasa-blue text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-2">NASA Photo Gallery</h1>
          <p className="text-lg opacity-90">Explore the universe through stunning NASA imagery.</p>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
          <input
            type="text"
            placeholder="Search for celestial events, missions, objects..."
            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-nasa-blue focus:border-nasa-blue"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-nasa-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-4 text-lg text-nasa-blue">Loading photos...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 p-4 bg-red-100 rounded-lg">
            <p className="font-bold">Error loading photos:</p>
            <p>{error.message}</p>
            <p className="text-sm text-gray-600 mt-2">Please try a different search term or check your internet connection.</p>
          </div>
        )}

        {/* Photo Grid */}
        {!isLoading && !error && allPhotos.length === 0 && searchQuery !== '' && (
          <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow">
            <PhotoIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl font-semibold">No photos found for "{currentSearchTerm}".</p>
            <p className="mt-2">Try a different search query or broader terms.</p>
          </div>
        )}

        {!isLoading && !error && allPhotos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPhotos.map((photo) => (
              <div
                key={photo.nasa_id}
                className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 cursor-pointer group hover:scale-[1.02] transition-all duration-300"
                onClick={() => openPhotoModal(photo)}
              >
                <div className="relative h-64 overflow-hidden">
                  <NasaImage
                    src={photo.thumbnail_url}
                    alt={photo.title}
                    title={photo.title}
                    description={photo.description}
                    date={new Date(photo.date_created).toLocaleDateString()}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-lg font-semibold truncate">{photo.title}</h3>
                    <p className="text-sm text-gray-300">{new Date(photo.date_created).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{photo.description || 'No description available.'}</p>
                  <button
                    onClick={(e) => handleDownloadPhoto(e, photo.thumbnail_url, photo.nasa_id)}
                    className="w-full px-4 py-2 bg-nasa-blue text-white rounded-lg hover:bg-nasa-blue/80 transition-colors flex items-center justify-center"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    Download Photo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && !error && hasNextPage && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-8 py-3 bg-nasa-blue text-white rounded-lg shadow-md hover:bg-nasa-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetchingNextPage ? 'Loading more...' : 'Load More Photos'}
            </button>
          </div>
        )}

        {/* Photo Modal */}
        <Modal isOpen={isModalOpen} onClose={closePhotoModal}>
          {selectedPhoto && (
            <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto p-6 overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold text-nasa-blue mb-4">{selectedPhoto.title}</h2>
              <div className="relative h-96 w-full mb-4 overflow-hidden rounded-lg">
                <img src={selectedPhoto.thumbnail_url} alt={selectedPhoto.title} className="w-full h-full object-contain" />
              </div>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">{selectedPhoto.description || 'No description available.'}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800 mb-6">
                <div>
                  <p><strong className="font-semibold">Date Created:</strong> {new Date(selectedPhoto.date_created).toLocaleDateString()}</p>
                  <p><strong className="font-semibold">Center:</strong> {selectedPhoto.center}</p>
                  {selectedPhoto.photographer && <p><strong className="font-semibold">Photographer:</strong> {selectedPhoto.photographer}</p>}
                  {selectedPhoto.keywords && selectedPhoto.keywords.length > 0 && (
                    <p><strong className="font-semibold">Keywords:</strong> {selectedPhoto.keywords.join(', ')}</p>
                  )}
                </div>
              </div>

              {/* AI-Powered Insights */}
              <div className="mt-6 pt-6 border-t border-gray-200 bg-gray-800 p-4 rounded-lg text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-400" /> AI-Powered Insights
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold flex items-center mb-1">
                      <PhotoIcon className="h-5 w-5 mr-2 text-indigo-300" /> Visual Analysis:
                    </p>
                    <p className="text-gray-300 text-sm">{selectedPhoto.ai_insights.visual_analysis}</p>
                  </div>
                  <div>
                    <p className="font-semibold flex items-center mb-1">
                      <AcademicCapIcon className="h-5 w-5 mr-2 text-green-300" /> Historical Context:
                    </p>
                    <p className="text-gray-300 text-sm">{selectedPhoto.ai_insights.historical_context}</p>
                  </div>
                  <div>
                    <p className="font-semibold flex items-center mb-1">
                      <InformationCircleIcon className="h-5 w-5 mr-2 text-purple-300" /> Artistic Interpretation:
                    </p>
                    <p className="text-gray-300 text-sm">{selectedPhoto.ai_insights.artistic_interpretation}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closePhotoModal}
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
};

export default NasaPhotosPage; 