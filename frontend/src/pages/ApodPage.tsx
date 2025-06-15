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
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-nasa-blue to-gray-900 text-white space-bg">
        <div className="relative z-10 p-8">
          <div className="flex items-center space-x-3 mb-2">
            <PhotoIcon className="h-8 w-8 text-nasa-red" />
            <h1 className="text-4xl font-bold tracking-tight">Astronomy Picture of the Day</h1>
          </div>
          <p className="text-gray-300 mt-2 max-w-2xl">
            Discover the cosmos! Each day a different image or photograph of our fascinating universe is featured, along with a brief explanation written by a professional astronomer.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                  <dt className="text-sm font-medium text-gray-600">Copyright</dt>
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
                <div className="flex items-center justify-between">
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

            <div className="mt-8">
              <div className="flex items-center space-x-3 mb-6">
                <Bars3Icon className="h-6 w-6 text-nasa-blue" />
                <h2 className="text-2xl font-bold text-gray-900">Explanation</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {showFullExplanation ? apodData.data.explanation : truncateText(apodData.data.explanation, 300)}
              </p>
              {apodData.data.explanation.length > 300 && (
                <button
                  onClick={() => setShowFullExplanation(!showFullExplanation)}
                  className="text-nasa-blue hover:underline text-sm mt-2 focus:outline-none"
                >
                  {showFullExplanation ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>

            {apodData.data.explanation && getRelatedTopics(apodData.data.explanation).length > 0 && (
              <div className="mt-8">
                <div className="flex items-center space-x-3 mb-6">
                  <TagIcon className="h-6 w-6 text-nasa-blue" />
                  <h2 className="text-2xl font-bold text-gray-900">Related Space Topics</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getRelatedTopics(apodData.data.explanation).map((topic, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {apodData.data.title && apodData.data.explanation && (
              <div className="mt-8">
                <div className="flex items-center space-x-3 mb-6">
                  <LightBulbIcon className="h-6 w-6 text-nasa-blue" />
                  <h2 className="text-2xl font-bold text-gray-900">Suggested Mood/Theme</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                  {getMoodTheme(apodData.data.title, apodData.data.explanation)}
                </span>
              </div>
            )}

            {apodData.data.explanation && (
              <div className="mt-8">
                <div className="flex items-center space-x-3 mb-6">
                  {getSentiment(apodData.data.explanation).icon}
                  <h2 className="text-2xl font-bold text-gray-900">Explanation Sentiment</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                  {getSentiment(apodData.data.explanation).sentiment}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApodPage; 