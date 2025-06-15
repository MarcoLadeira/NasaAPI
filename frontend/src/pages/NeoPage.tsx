import React, { useState } from 'react';
import { useNeoFeed } from '../hooks/useNasaData';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { 
  CalendarIcon, 
  ExclamationTriangleIcon, 
  GlobeAltIcon, 
  ChartBarIcon,
  RocketLaunchIcon,
  ShieldExclamationIcon,
  CubeTransparentIcon,
  InformationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const NeoPage: React.FC = () => {
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const { data: neoData, isLoading, error } = useNeoFeed(startDate, endDate);

  // Function to determine risk level
  const getRiskLevel = (neo: any) => {
    const maxDiameter = neo.estimated_diameter.kilometers.estimated_diameter_max;
    const missDistance = neo.close_approach_data[0]?.miss_distance.kilometers;

    if (neo.is_potentially_hazardous_asteroid) {
      if (maxDiameter > 0.5 && missDistance < 7500000) {
        return <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">High Risk</span>;
      } else if (maxDiameter > 0.1 && missDistance < 10000000) {
        return <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">Medium Risk</span>;
      } else {
        return <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">Potentially Hazardous</span>;
      }
    } else if (maxDiameter > 0.2 && missDistance < 5000000) {
      return <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">Medium Risk</span>;
    } else if (maxDiameter > 0.05 && missDistance < 15000000) {
      return <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">Low-Medium Risk</span>;
    } else {
      return <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Low Risk</span>;
    }
  };

  // Function to provide trajectory likelihood insight
  const getTrajectoryInsight = (neo: any): string => {
    if (neo.is_sentry_object) {
      return 'Monitored by Sentry system for potential future impacts.';
    } else if (neo.is_potentially_hazardous_asteroid) {
      return 'Potentially hazardous, close monitoring advised.';
    } else {
      return 'No immediate impact threat identified.';
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const prepareChartData = (): ChartData<'bar'> => {
    if (!neoData?.data?.near_earth_objects) {
      return {
        labels: [],
        datasets: []
      };
    }

    const dates = Object.keys(neoData.data.near_earth_objects);
    const hazardousCounts = dates.map(
      (date) =>
        neoData.data.near_earth_objects[date].filter(
          (neo: any) => neo.is_potentially_hazardous_asteroid
        ).length
    );
    const nonHazardousCounts = dates.map(
      (date) =>
        neoData.data.near_earth_objects[date].filter(
          (neo: any) => !neo.is_potentially_hazardous_asteroid
        ).length
    );

    return {
      labels: dates.map((date) => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: 'Potentially Hazardous',
          data: hazardousCounts,
          backgroundColor: 'rgba(220, 38, 38, 0.5)',
          borderColor: 'rgb(220, 38, 38)',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Non-Hazardous',
          data: nonHazardousCounts,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
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
      <div className="error-container">
        <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
        <div>
          <h2 className="text-xl font-semibold mb-2">Error Loading NEO Data</h2>
          <p className="text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  const chartData = prepareChartData();

  return (
    <div className="space-y-8">
      <header className="bg-nasa-blue text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-2">Near Earth Objects</h1>
          <p className="text-lg opacity-90">Track and analyze Near Earth Objects (NEOs) - asteroids and comets that orbit the Sun and come within 1.3 astronomical units of Earth.</p>
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
                Start Date
              </label>
              <div className="relative">
                <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  max={endDate}
                  className="input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  min={startDate}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <InformationCircleIcon className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-600">About NEOs</span>
              </div>
              <p className="text-sm text-gray-700">
                Near Earth Objects are asteroids and comets that orbit the Sun and come within 1.3 astronomical units of Earth. NASA's NEO program tracks these objects to assess potential impact hazards.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <ChartBarIcon className="h-6 w-6 text-nasa-blue" />
              <h2 className="text-2xl font-bold text-gray-900">NEO Statistics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RocketLaunchIcon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-600">Total NEOs</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {neoData?.data?.near_earth_objects ? Object.keys(neoData.data.near_earth_objects).length : 0}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-600">Potentially Hazardous</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {neoData?.data?.near_earth_objects ? 
                      Object.values(neoData.data.near_earth_objects).reduce((total: number, neos: any) => 
                        total + (neos as any[]).filter((neo) => neo.is_potentially_hazardous_asteroid).length, 0) 
                      : 0}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-600">Average Diameter</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {neoData?.data?.near_earth_objects ? 
                      (Object.values(neoData.data.near_earth_objects).reduce((total: number, neos: any) => 
                        total + (neos as any[]).reduce((sum: number, neo: any) => 
                          sum + neo.estimated_diameter.kilometers.estimated_diameter_max, 0), 0) / 
                      Object.keys(neoData.data.near_earth_objects).length).toFixed(2)
                      : '0.00'} km
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ArrowPathIcon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-600">Average Velocity</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {neoData?.data?.near_earth_objects ? 
                      (Object.values(neoData.data.near_earth_objects).reduce((total: number, neos: any) => 
                        total + (neos as any[]).reduce((sum: number, neo: any) => 
                          sum + neo.close_approach_data[0].relative_velocity.kilometers_per_hour, 0), 0) / 
                      Object.keys(neoData.data.near_earth_objects).length).toFixed(2)
                      : '0.00'} km/h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <ChartBarIcon className="h-6 w-6 text-nasa-blue" />
          <h2 className="text-2xl font-bold text-gray-900">NEO Size Distribution</h2>
        </div>
        <div className="h-[400px]">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                  labels: {
                    padding: 20,
                    font: {
                      size: 12,
                      family: "'Inter', sans-serif"
                    }
                  }
                },
                title: {
                  display: true,
                  text: 'Near Earth Objects by Date',
                  font: {
                    size: 16,
                    family: "'Inter', sans-serif",
                    weight: 'bold'
                  },
                  padding: 20
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Number of Objects',
                    font: {
                      size: 12,
                      family: "'Inter', sans-serif"
                    }
                  },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                    font: {
                      size: 12,
                      family: "'Inter', sans-serif"
                    }
                  },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                  }
                },
              },
            }}
          />
        </div>
      </div>

      {/* NEO List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="loading-spinner"></div>
        </div>
      ) : error ? (
        <div className="error-container">
          <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Error Loading NEOs</h2>
            <p className="text-sm">Please try again later.</p>
          </div>
        </div>
      ) : neoData?.data?.near_earth_objects ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(neoData.data.near_earth_objects).map(([date, neos]: [string, unknown]) => {
            const neoArray = neos as any[];
            return (
              <div key={date} className="overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {new Date(date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    {neoArray.filter((neo) => neo.is_potentially_hazardous_asteroid).length > 0 && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Potentially Hazardous
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {neoArray.map((neo) => (
                      <div key={neo.id} className="space-y-2 mb-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{neo.name}</span>
                          {getRiskLevel(neo)}
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-700">
                          <span>Est. Max Diameter:</span>
                          <span>{neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)} km</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-700">
                          <span>Close Approach Date:</span>
                          <span>{new Date(neo.close_approach_data[0]?.close_approach_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-700">
                          <span>Miss Distance:</span>
                          <span>{parseInt(neo.close_approach_data[0]?.miss_distance.kilometers).toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-700">
                          <span>Relative Velocity:</span>
                          <span>{parseInt(neo.close_approach_data[0]?.relative_velocity.kilometers_per_hour).toLocaleString()} km/h</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-2 italic">
                          **Trajectory Insight:** {getTrajectoryInsight(neo)}
                        </div>
                        {neo.nasa_jpl_url && (
                          <div className="flex justify-end mt-2">
                            <a
                              href={neo.nasa_jpl_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-nasa-blue hover:underline"
                            >
                              View JPL Data
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center">
          <CubeTransparentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No NEO data available for the selected date range.</p>
        </div>
      )}
    </div>
  );
};

export default NeoPage; 