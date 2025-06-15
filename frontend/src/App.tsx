import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomeIcon, PhotoIcon, GlobeAltIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import ApodPage from './pages/ApodPage';
import MarsRoverPage from './pages/MarsRoverPage';
import NeoPage from './pages/NeoPage';

// Create a client
const queryClient = new QueryClient();

const Navigation = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'APOD', path: '/apod', icon: PhotoIcon },
    { name: 'Mars Rover', path: '/mars', icon: GlobeAltIcon },
    { name: 'NEO', path: '/neo', icon: ChartBarIcon },
  ];

  return (
    <nav className="bg-nasa-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img
                className="h-8 w-8"
                src="/nasa-logo.png"
                alt="NASA Logo"
              />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const HomePage = () => (
  <div className="text-center py-12">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">
      Welcome to NASA Space Explorer
    </h1>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
      Explore the wonders of space through NASA's vast collection of images, data, and discoveries.
    </p>
  </div>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/apod" element={<ApodPage />} />
              <Route path="/mars" element={<MarsRoverPage />} />
              <Route path="/neo" element={<NeoPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
