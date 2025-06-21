import React, { useState, useEffect } from 'react';
import { useApod } from '../hooks/useApod';
import NasaImage from '../components/NasaImage';
import { 
  CalendarIcon, 
  ExclamationTriangleIcon, 
  PhotoIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  UserIcon,
  FilmIcon,
  Bars3Icon,
  TagIcon,
  LightBulbIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ApodPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showFullExplanation, setShowFullExplanation] = useState<boolean>(false);
  const { data: apodData, isLoading, error, refetch } = useApod(selectedDate);

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Helper function to get related topics based on keywords in explanation
  const getRelatedTopics = (explanation: string): string[] => {
    const lowerCaseExplanation = explanation.toLowerCase();
    const topics: string[] = [];

    if (lowerCaseExplanation.includes('galaxy') || lowerCaseExplanation.includes('galaxies')) topics.push('Galaxies');
    if (lowerCaseExplanation.includes('star') || lowerCaseExplanation.includes('stars')) topics.push('Stars');
    if (lowerCaseExplanation.includes('nebula') || lowerCaseExplanation.includes('nebulae')) topics.push('Nebulae');
    if (lowerCaseExplanation.includes('planet') || lowerCaseExplanation.includes('planets')) topics.push('Planets');
    if (lowerCaseExplanation.includes('moon') || lowerCaseExplanation.includes('lunar')) topics.push('Moon');
    if (lowerCaseExplanation.includes('sun') || lowerCaseExplanation.includes('solar')) topics.push('Sun');
    if (lowerCaseExplanation.includes('black hole')) topics.push('Black Holes');
    if (lowerCaseExplanation.includes('comet') || lowerCaseExplanation.includes('asteroid')) topics.push('Comets & Asteroids');
    if (lowerCaseExplanation.includes('telescope')) topics.push('Telescopes');
    if (lowerCaseExplanation.includes('observatory')) topics.push('Observatories');
    if (lowerCaseExplanation.includes('mission') || lowerCaseExplanation.includes('spacecraft')) topics.push('Space Missions');

    return topics;
  };

  // Helper function to suggest mood/theme based on title and explanation
  const getMoodTheme = (title: string, explanation: string): string => {
    const lowerCaseTitle = title.toLowerCase();
    const lowerCaseExplanation = explanation.toLowerCase();

    if (lowerCaseExplanation.includes('mystery') || lowerCaseTitle.includes('mystery') || lowerCaseExplanation.includes('unexplained')) return 'Mysterious';
    if (lowerCaseExplanation.includes('beautiful') || lowerCaseTitle.includes('beautiful') || lowerCaseExplanation.includes('stunning') || lowerCaseExplanation.includes('gorgeous')) return 'Awe-Inspiring';
    if (lowerCaseExplanation.includes('discovery') || lowerCaseTitle.includes('discovery') || lowerCaseExplanation.includes('research') || lowerCaseExplanation.includes('study')) return 'Educational';
    if (lowerCaseExplanation.includes('future') || lowerCaseExplanation.includes('explore') || lowerCaseExplanation.includes('journey')) return 'Inspirational';
    if (lowerCaseExplanation.includes('danger') || lowerCaseExplanation.includes('hazardous') || lowerCaseExplanation.includes('threat')) return 'Cautionary';

    return 'Informative'; // Default theme
  };

  // Helper function for sentiment analysis
  const getSentiment = (text: string): { sentiment: string; icon: React.ReactNode } => {
    const lowerCaseText = text.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;

    // Positive keywords
    const positiveKeywords = ['beautiful', 'stunning', 'amazing', 'fascinating', 'wonderful', 'impressive', 'exciting', 'gorgeous', 'captivating', 'insightful', 'discovery'];
    // Negative keywords
    const negativeKeywords = ['error', 'fail', 'unsuccessful', 'struggle', 'difficult', 'challenge', 'hazardous', 'threat'];

    positiveKeywords.forEach(keyword => {
      if (lowerCaseText.includes(keyword)) {
        positiveScore++;
      }
    });

    negativeKeywords.forEach(keyword => {
      if (lowerCaseText.includes(keyword)) {
        negativeScore++;
      }
    });

    if (positiveScore > negativeScore) {
      return { sentiment: 'Positive', icon: <FaceSmileIcon className="h-5 w-5 text-green-500" /> };
    } else if (negativeScore > positiveScore) {
      return { sentiment: 'Negative', icon: <FaceFrownIcon className="h-5 w-5 text-red-500" /> };
    } else {
      return { sentiment: 'Neutral', icon: <InformationCircleIcon className="h-5 w-5 text-gray-500" /> };
    }
  };

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

  // Handle image download
  const handleDownloadImage = () => {
    if (apodData?.data?.url && apodData.data.media_type === 'image') {
      const link = document.createElement('a');
      link.href = apodData.data.url;
      link.download = `APOD_${apodData.data.date}.jpg`; // Suggest a filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No image available for download.');
    }
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
      <div>
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
      <header className="bg-nasa-blue text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-2">Astronomy Picture of the Day</h1>
          <p className="text-lg opacity-90">Discover the cosmos! Each day a different image or photograph of our fascinating universe is featured, along with a brief explanation written by a professional astronomer.</p>
        </div>
      </header>

      {apodData?.data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="group hover:scale-[1.02] transition-all duration-300">
            <NasaImage
              src={apodData.data.url}
              alt={apodData.data.title}
              title={apodData.data.title}
              description={apodData.data.explanation}
              date={apodData.data.date}
            />
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <FilmIcon className="h-6 w-6 text-nasa-blue" />
              <h2 className="text-2xl font-bold text-gray-900">Image Details</h2>
            </div>
            <dl>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-gray-600" />
                  <dt className="text-sm font-medium text-gray-600">Select Date</dt>
                </div>
                <dd className="relative">
                  <input
                    type="date"
                    id="date"
                    value={selectedDate || new Date().toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="input pl-3 pr-4 py-2 text-sm w-48"
                  />
                  <CalendarIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </dd>
              </div>
              <div className="flex items-center justify-between mb-4">
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-600" />
                  <dt className="text-sm font-medium text-gray-600">Credit</dt>
                </div>
                <dd className="text-sm text-gray-900">
                  {apodData.data.copyright || 'Public Domain'}
                </dd>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <PhotoIcon className="h-5 w-5 text-gray-600" />
                  <dt className="text-sm font-medium text-gray-600">Media Type</dt>
                </div>
                <dd className="text-sm text-gray-900 capitalize">
                  {apodData.data.media_type}
                </dd>
              </div>
              {apodData.data.media_type === 'video' && (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FilmIcon className="h-5 w-5 text-purple-600" />
                    <dt className="text-sm font-medium text-purple-600">Explore More Videos</dt>
                  </div>
                  <dd>
                    <a
                      href="https://images.nasa.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm"
                    >
                      Visit NASA Image and Video Library
                    </a>
                  </dd>
                </div>
              )}
              {apodData.data.hdurl && (
                <div className="flex items-center justify-between mb-4">
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

            <button
              onClick={handleDownloadImage}
              className="btn-primary w-full mt-4 flex items-center justify-center space-x-2"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Download Image</span>
            </button>

            {apodData.data.explanation && (
              <div className="mt-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Bars3Icon className="h-6 w-6 text-nasa-blue" />
                  <h2 className="text-2xl font-bold text-gray-900">Explanation</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {showFullExplanation ? apodData.data.explanation : truncateText(apodData.data.explanation, 250)}
                  {apodData.data.explanation.length > 250 && (
                    <button
                      onClick={() => setShowFullExplanation(!showFullExplanation)}
                      className="text-nasa-blue font-semibold hover:underline ml-2"
                    >
                      {showFullExplanation ? 'Read Less' : 'Read More'}
                    </button>
                  )}
                </p>

                {/* AI Insights Section */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-inner">
                  <div className="flex items-center space-x-2 mb-3 text-blue-800">
                    <LightBulbIcon className="h-5 w-5" />
                    <h3 className="font-semibold">AI Insights</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex items-center space-x-1">
                      <TagIcon className="h-4 w-4 text-blue-600" />
                      <span>Related Topics: {getRelatedTopics(apodData.data.explanation).join(', ') || 'N/A'}</span>
                    </p>
                    <p className="flex items-center space-x-1">
                      {getSentiment(apodData.data.explanation).icon}
                      <span>Sentiment: {getSentiment(apodData.data.explanation).sentiment}</span>
                    </p>
                    <p className="flex items-center space-x-1">
                      <LightBulbIcon className="h-4 w-4 text-blue-600" />
                      <span>Mood/Theme: {getMoodTheme(apodData.data.title, apodData.data.explanation)}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApodPage; 