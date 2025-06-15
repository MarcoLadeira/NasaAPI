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
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

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

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const prepareChartData = () => {
    if (!neoData?.data?.near_earth_objects) return null;

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
        },
        {
          label: 'Non-Hazardous',
          data: nonHazardousCounts,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        },
      ],
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nasa-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading NEO Data</h2>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  const chartData = prepareChartData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Near Earth Objects</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              max={endDate}
              className="input max-w-xs"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="endDate" className="text-sm font-medium text-gray-700">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate}
              max={new Date().toISOString().split('T')[0]}
              className="input max-w-xs"
            />
          </div>
        </div>
      </div>

      {chartData && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">NEO Distribution</h2>
          <div className="h-[400px]">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Near Earth Objects by Date',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Objects',
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Date',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {neoData?.data?.near_earth_objects && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(neoData.data.near_earth_objects).map(([date, neos]: [string, any]) => (
            <div key={date} className="card">
              <h3 className="text-xl font-semibold mb-4">
                {new Date(date).toLocaleDateString()}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Objects</p>
                  <p className="text-lg">{neos.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Potentially Hazardous</p>
                  <p className="text-lg text-red-600">
                    {neos.filter((neo: any) => neo.is_potentially_hazardous_asteroid).length}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Largest Object</p>
                  <p className="text-lg">
                    {neos.reduce((largest: any, current: any) =>
                      current.estimated_diameter.kilometers.estimated_diameter_max >
                      largest.estimated_diameter.kilometers.estimated_diameter_max
                        ? current
                        : largest
                    ).name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NeoPage; 