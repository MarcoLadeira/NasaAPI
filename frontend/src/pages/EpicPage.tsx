import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import NasaImage from '../components/NasaImage';
import { 
  GlobeAltIcon, 
  CalendarIcon, 
  ExclamationTriangleIcon,
  MapPinIcon,
  PhotoIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface EpicImage {
  identifier: string;
  caption: string;
  image: string;
  version: string;
  date: string;
  centroid_coordinates: {
    lat: number;
    lon: number;
  };
}

const EpicPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const { data: epicData, isLoading, error } = useQuery({
    queryKey: ['epic', selectedDate],
    queryFn: async () => {
      const response = await axios.get<EpicImage[]>(`http://localhost:3002/api/epic?date=${selectedDate}`);
      return response.data;
    },
    enabled: !!selectedDate,
  });

  // Simple AI-like feature: Infer atmospheric conditions from caption
  const getAtmosphericConditions = (caption: string): string => {
    const lowerCaseCaption = caption.toLowerCase();
    if (lowerCaseCaption.includes('cloudy') || lowerCaseCaption.includes('clouds')) {
      if (lowerCaseCaption.includes('partly') || lowerCaseCaption.includes('scattered')) {
        return 'Partially Cloudy';
      } else {
        return 'Cloudy';
      }
    } else if (lowerCaseCaption.includes('clear') || lowerCaseCaption.includes('sun')) {
      return 'Clear Skies';
    } else {
      return 'N/A'; // Or a default if no specific condition is inferred
    }
  };

  // AI-like Feature: Extract prominent features from caption
  const getEpicFeatureSpotlight = (caption: string): string => {
    const lowerCaseCaption = caption.toLowerCase();
    const features: string[] = [];

    if (lowerCaseCaption.includes('north america')) features.push('North America');
    if (lowerCaseCaption.includes('south america')) features.push('South America');
    if (lowerCaseCaption.includes('africa')) features.push('Africa');
    if (lowerCaseCaption.includes('europe')) features.push('Europe');
    if (lowerCaseCaption.includes('asia')) features.push('Asia');
    if (lowerCaseCaption.includes('australia')) features.push('Australia');
    if (lowerCaseCaption.includes('antarctica')) features.push('Antarctica');
    if (lowerCaseCaption.includes('atlantic')) features.push('Atlantic Ocean');
    if (lowerCaseCaption.includes('pacific')) features.push('Pacific Ocean');
    if (lowerCaseCaption.includes('indian ocean')) features.push('Indian Ocean');
    if (lowerCaseCaption.includes('clouds')) features.push('Cloud Formations');
    if (lowerCaseCaption.includes('landmass') || lowerCaseCaption.includes('continent')) features.push('Large Landmass');
    if (lowerCaseCaption.includes('ocean')) features.push('Oceanic Views');

    if (features.length === 0) {
      return 'No specific features highlighted.';
    } else if (features.length === 1) {
      return features[0] + ' visible.';
    } else {
      return features.slice(0, -1).join(', ') + ' and ' + features[features.length - 1] + ' visible.';
    }
  };

  // AI-like Feature: Best Time of Day Insight
  const getTimeOfDayInsight = (dateString: string): string => {
    const date = new Date(dateString);
    const hours = date.getHours();

    if (hours >= 5 && hours < 9) {
      return 'Early Morning Glow';
    } else if (hours >= 9 && hours < 12) {
      return 'Morning Light';
    } else if (hours >= 12 && hours < 16) {
      return 'Mid-day Illumination';
    } else if (hours >= 16 && hours < 19) {
      return 'Late Afternoon Sun';
    } else if (hours >= 19 && hours < 22) {
      return 'Twilight View';
    } else {
      return 'Nightside or Deep Space View';
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const maxDate = new Date().toISOString().split('T')[0];
  const minDate = '2015-06-01'; // Assuming the minimum date is June 1, 2015

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
          <h2 className="text-xl font-semibold mb-2">Error Loading EPIC Data</h2>
          <p className="text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="bg-nasa-blue text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-2">Earth Polychromatic Imaging Camera</h1>
          <p className="text-lg opacity-90">View stunning images of Earth captured by NASA's EPIC camera aboard the DSCOVR satellite. These images show our planet from a unique perspective in space.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Date Selection */}
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <CalendarIcon className="h-6 w-6 text-nasa-blue" />
            <h2 className="text-2xl font-bold text-gray-900">Select Date</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Date
              </label>
              <div className="relative">
                <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  max={maxDate}
                  min={minDate}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <InformationCircleIcon className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-600">About EPIC</span>
              </div>
              <p className="text-sm text-gray-700">
                The Earth Polychromatic Imaging Camera (EPIC) provides a unique perspective of our planet from the Lagrange point 1, approximately 1.5 million kilometers from Earth.
              </p>
            </div>
          </div>
        </div>

        {/* Image Information */}
        <div className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <PhotoIcon className="h-6 w-6 text-nasa-blue" />
              <h2 className="text-2xl font-bold text-gray-900">Image Details</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-600">Date</span>
                </div>
                <span className="text-gray-900">{selectedDate}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-600">Satellite Position</span>
                </div>
                <span className="text-gray-900">Lagrange Point 1</span>
              </div>
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-600">About DSCOVR</span>
                </div>
                <p className="text-gray-700">
                  The Deep Space Climate Observatory (DSCOVR) maintains the nation's real-time solar wind monitoring capabilities, which are critical to the accuracy and lead time of space weather alerts and forecasts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EPIC Images */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="loading-spinner"></div>
        </div>
      ) : error ? (
        <div className="error-container">
          <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Images</h2>
            <p className="text-sm">Please try again later.</p>
          </div>
        </div>
      ) : epicData && epicData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {epicData.map((image) => {
            const imageDate = new Date(image.date);
            const year = imageDate.getFullYear();
            const month = (imageDate.getMonth() + 1).toString().padStart(2, '0');
            const day = imageDate.getDate().toString().padStart(2, '0');
            const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${image.image}.png`;

            return (
              <div key={image.identifier} className="overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                <NasaImage
                  src={imageUrl}
                  alt={`Earth from EPIC on ${image.date}`}
                  title={`Earth from EPIC`}
                  date={image.date}
                  description={`Latitude: ${image.centroid_coordinates.lat.toFixed(2)}°, Longitude: ${image.centroid_coordinates.lon.toFixed(2)}°`}
                />
                <div className="p-4">
                  <p className="text-sm text-gray-700 mt-2">
                    **Conditions:** {getAtmosphericConditions(image.caption)}
                  </p>
                </div>
                <div className="p-4 pt-0">
                  <p className="text-sm text-gray-700 mt-2 italic">
                    **Feature Spotlight:** {getEpicFeatureSpotlight(image.caption)}
                  </p>
                </div>
                <div className="p-4 pt-0">
                  <p className="text-sm text-gray-700 mt-2 italic">
                    **Time of Day Insight:** {getTimeOfDayInsight(image.date)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center">
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No images available for the selected date.</p>
        </div>
      )}
    </div>
  );
};

export default EpicPage; 