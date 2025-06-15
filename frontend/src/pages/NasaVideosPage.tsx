import React, { useState, useCallback, useEffect } from 'react';
import { useNasaVideos } from '../hooks/useNasaData';
import { 
  VideoCameraIcon, 
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  TagIcon,
  ClockIcon,
  LightBulbIcon,
  SparklesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { debounce } from 'lodash';

interface Video {
  id: string;
  title: string;
  description: string;
  date_created: string;
  keywords: string[];
  thumbnail: string;
  videoUrl: string;
  duration: string;
  center: string;
  photographer: string;
  location: string;
}

interface NasaVideosResponse {
  videos: Video[];
  total: number;
  page: number;
  limit: number;
}

const POPULAR_SEARCHES = [
  'Rocket Launch',
  'Space Station',
  'Mars Rover',
  'Hubble Telescope',
  'Earth from Space',
  'Astronaut Training',
  'Spacewalk',
  'Solar System'
];

const NasaVideosPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showAIInsights, setShowAIInsights] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const { data, isLoading, error, refetch } = useNasaVideos(searchQuery, currentPage);
  const videosData = data?.data as NasaVideosResponse | undefined;

  // AI Feature: Content Analysis
  const analyzeContent = (video: Video): string => {
    const keywords = video.keywords.join(' ').toLowerCase();
    const description = video.description.toLowerCase();
    
    if (keywords.includes('launch') || description.includes('launch')) {
      return 'This video captures a significant space launch event, showcasing rocket propulsion and mission deployment.';
    } else if (keywords.includes('earth') || description.includes('earth')) {
      return 'This video provides a unique perspective of Earth from space, highlighting our planet\'s beauty and fragility.';
    } else if (keywords.includes('mars') || description.includes('mars')) {
      return 'This video explores the Red Planet, offering insights into Martian exploration and scientific discoveries.';
    } else if (keywords.includes('iss') || description.includes('international space station')) {
      return 'This video showcases life and research aboard the International Space Station, demonstrating microgravity science.';
    } else {
      return 'This video presents fascinating space exploration content, contributing to our understanding of the cosmos.';
    }
  };

  // AI Feature: Educational Value Assessment
  const assessEducationalValue = (video: Video): { level: string; topics: string[] } => {
    const keywords = video.keywords.join(' ').toLowerCase();
    const description = video.description.toLowerCase();
    const topics: string[] = [];

    if (keywords.includes('physics') || description.includes('physics')) topics.push('Physics');
    if (keywords.includes('biology') || description.includes('biology')) topics.push('Biology');
    if (keywords.includes('chemistry') || description.includes('chemistry')) topics.push('Chemistry');
    if (keywords.includes('engineering') || description.includes('engineering')) topics.push('Engineering');
    if (keywords.includes('astronomy') || description.includes('astronomy')) topics.push('Astronomy');
    if (keywords.includes('technology') || description.includes('technology')) topics.push('Technology');

    let level = 'Intermediate';
    if (description.includes('basic') || description.includes('introduction')) {
      level = 'Beginner';
    } else if (description.includes('advanced') || description.includes('complex')) {
      level = 'Advanced';
    }

    return { level, topics };
  };

  // AI Feature: Historical Significance
  const assessHistoricalSignificance = (video: Video): string => {
    const date = new Date(video.date_created);
    const now = new Date();
    const yearsAgo = now.getFullYear() - date.getFullYear();

    if (yearsAgo > 20) {
      return 'This is a historical recording that captures a significant moment in space exploration history.';
    } else if (yearsAgo > 10) {
      return 'This video documents an important milestone in recent space exploration.';
    } else {
      return 'This is a contemporary recording showcasing current space exploration efforts.';
    }
  };

  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
      setIsSearching(true);
    }, 500),
    []
  );

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setShowAIInsights(true);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePopularSearch = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1);
    setIsSearching(true);
  };

  const handleRetry = () => {
    refetch();
  };

  useEffect(() => {
    if (videosData) {
      setIsSearching(false);
    }
  }, [videosData]);

  if (error) {
    console.error("Error fetching NASA videos:", error);
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-nasa-blue to-gray-900 p-8 text-white shadow-xl space-bg">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <VideoCameraIcon className="h-8 w-8 text-nasa-red" />
            <h1 className="text-4xl font-bold tracking-tight text-white">NASA Videos</h1>
          </div>
          <p className="text-gray-300 mt-2 max-w-2xl">
            Explore NASA's extensive video collection, from rocket launches to spacewalks, and discover the wonders of space exploration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search and Filters */}
        <div className="space-y-6">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search NASA videos..."
              onChange={(e) => handleSearch(e.target.value)}
              className="input pl-10"
              value={searchQuery}
            />
          </div>

          {/* Popular Searches */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((search) => (
                <button
                  key={search}
                  onClick={() => handlePopularSearch(search)}
                  className="px-3 py-1 bg-nasa-blue/20 text-nasa-blue rounded-full text-sm hover:bg-nasa-blue/30 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* AI Insights will now be in the modal */}
        </div>

        {/* Video Grid */}
        <div className="lg:col-span-2">
          {isLoading && !videosData && (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Videos</h3>
              <p className="text-red-600 mb-4">There was a problem loading the videos. Please try again.</p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Retry
              </button>
            </div>
          )}

          {!isLoading && !error && videosData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videosData.videos.map((video: Video) => (
                  <div
                    key={video.id}
                    className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/50 cursor-pointer hover:border-nasa-blue transition-all duration-300"
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="relative aspect-video">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/75 px-2 py-1 rounded text-sm text-white">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-700 mb-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(video.date_created).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {video.keywords.slice(0, 3).map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-nasa-blue/20 text-nasa-blue rounded-full text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {videosData.videos.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No videos found. Try a different search term.</p>
                </div>
              )}

              {videosData.videos.length > 0 && videosData.videos.length < videosData.total && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-2 bg-nasa-blue text-white rounded-lg hover:bg-nasa-blue/80 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full">
            <div className="relative aspect-video">
              <video
                src={selectedVideo.videoUrl}
                controls
                className="w-full h-full rounded-t-lg"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">{selectedVideo.title}</h2>
              <p className="text-white mb-4">{selectedVideo.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-white">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5" />
                  <span>{selectedVideo.photographer}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5" />
                  <span>{selectedVideo.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5" />
                  <span>{selectedVideo.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-5 w-5" />
                  <span>{selectedVideo.keywords.join(', ')}</span>
                </div>
              </div>

              {/* AI-Powered Insights Section - Moved here */}
              {showAIInsights && (
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">AI-Powered Insights</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <LightBulbIcon className="h-5 w-5 text-nasa-blue flex-shrink-0 mt-1" />
                      <p className="text-sm text-white">{analyzeContent(selectedVideo)}</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <ChartBarIcon className="h-5 w-5 text-nasa-blue flex-shrink-0 mt-1" />
                      <div className="text-sm text-white">
                        <p>Educational Level: {assessEducationalValue(selectedVideo).level}</p>
                        <p>Topics: {assessEducationalValue(selectedVideo).topics.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <SparklesIcon className="h-5 w-5 text-nasa-blue flex-shrink-0 mt-1" />
                      <p className="text-sm text-white">{assessHistoricalSignificance(selectedVideo)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-800 flex justify-end">
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NasaVideosPage; 