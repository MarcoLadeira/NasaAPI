import React, { useState, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomeIcon, PhotoIcon, GlobeAltIcon, ChartBarIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

const ApodPage = lazy(() => import('./pages/ApodPage'));
const MarsRoverPage = lazy(() => import('./pages/MarsRoverPage'));
const NeoPage = lazy(() => import('./pages/NeoPage'));
const EpicPage = lazy(() => import('./pages/EpicPage'));
const NasaVideosPage = lazy(() => import('./pages/NasaVideosPage'));
const NasaPhotosPage = lazy(() => import('./pages/NasaPhotosPage'));
const HomePage = lazy(() => import(/* webpackChunkName: "HomePage" */ './pages/HomePage'));

const queryClient = new QueryClient();

const NavLink = ({ to, children, className = '' }: { to: string; children: React.ReactNode; className?: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`relative flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden group
        ${isActive 
          ? 'text-white' 
          : 'text-gray-300 hover:text-white'
        } ${className}`}
    >
      {/* Active state background */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl backdrop-blur-sm border border-white/10 shadow-[0_0_15px_rgba(59,130,246,0.3)] z-0"></div>
      )}
      {/* Hover effect background */}
      <div className="absolute inset-0 rounded-xl transition-all duration-300 group-hover:bg-white/5 z-0"></div>
      
      {/* Content (icon and text) */}
      <span className="relative z-10 flex items-center space-x-1.5 sm:space-x-2">
        {children}
      </span>
    </Link>
  );
};

// Separate component that uses useLocation
const AppContent: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl h-14 sm:h-16 md:h-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 h-full flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all duration-300"></div>
                <img
                  src="/images/NASA_logo.svg"
                  alt="NASA Logo"
                  className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 relative z-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-blue-500 transition-all duration-300">
                  Explorer
                </span>
                <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  NASA API Interface
                </span>
              </div>
              </Link>
            </div>

          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <NavLink to="/apod">
                <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>APOD</span>
              </NavLink>
              <NavLink to="/mars-rover">
                <PhotoIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Mars Rover</span>
              </NavLink>
              <NavLink to="/neo">
                <GlobeAltIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>NEO</span>
              </NavLink>
              <NavLink to="/epic">
                <ChartBarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>EPIC</span>
              </NavLink>
              <NavLink to="/nasa-videos">
                <VideoCameraIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Videos</span>
              </NavLink>
              <NavLink to="/nasa-photos">
                <PhotoIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Photos</span>
              </NavLink>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden animate-fade-in bg-gray-800/95 backdrop-blur-xl border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink to="/apod" className="w-full">
                <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>APOD</span>
              </NavLink>
              <NavLink to="/mars-rover" className="w-full">
                <PhotoIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Mars Rover</span>
              </NavLink>
              <NavLink to="/neo" className="w-full">
                <GlobeAltIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>NEO</span>
              </NavLink>
              <NavLink to="/epic" className="w-full">
                <ChartBarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>EPIC</span>
              </NavLink>
              <NavLink to="/nasa-videos" className="w-full">
                <VideoCameraIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Videos</span>
              </NavLink>
              <NavLink to="/nasa-photos" className="w-full">
                <PhotoIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Photos</span>
              </NavLink>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Suspense fallback={(
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="loading-spinner"></div>
          </div>
        )}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/apod" element={<ApodPage />} />
            <Route path="/mars-rover" element={<MarsRoverPage />} />
            <Route path="/neo" element={<NeoPage />} />
            <Route path="/epic" element={<EpicPage />} />
            <Route path="/nasa-videos" element={<NasaVideosPage />} />
            <Route path="/nasa-photos" element={<NasaPhotosPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 sm:space-y-3 md:space-y-0">
            <div className="flex items-center space-x-2">
              <img
                src="/images/NASA_logo.svg"
                alt="NASA Logo"
                className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
              />
              <span className="text-xs sm:text-sm text-gray-400">
                Powered by NASA APIs
              </span>
            </div>
            <div>
              <a
                href="https://api.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                Get your NASA API key
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
