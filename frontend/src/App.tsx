import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomeIcon, PhotoIcon, GlobeAltIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import ApodPage from './pages/ApodPage';
import MarsRoverPage from './pages/MarsRoverPage';
import NeoPage from './pages/NeoPage';
import EpicPage from './pages/EpicPage';

const queryClient = new QueryClient();

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
        ${isActive 
          ? 'bg-white/10 text-white shadow-lg shadow-white/5' 
          : 'text-gray-300 hover:text-white hover:bg-white/5'
        }`}
    >
      {children}
    </Link>
  );
};

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
          <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Link to="/" className="flex items-center space-x-3 group">
                    <img
                      src="/images/NASA_logo.svg"
                      alt="NASA Logo"
                      className="h-10 w-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                    />
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-blue-500 transition-all duration-300">
                      Explorer
                    </span>
                  </Link>
                </div>

                <div className="hidden md:flex items-center space-x-2">
                  <NavLink to="/">
                    <HomeIcon className="h-5 w-5" />
                    <span>APOD</span>
                  </NavLink>
                  <NavLink to="/mars-rover">
                    <PhotoIcon className="h-5 w-5" />
                    <span>Mars Rover</span>
                  </NavLink>
                  <NavLink to="/neo">
                    <GlobeAltIcon className="h-5 w-5" />
                    <span>NEO</span>
                  </NavLink>
                  <NavLink to="/epic">
                    <ChartBarIcon className="h-5 w-5" />
                    <span>EPIC</span>
                  </NavLink>
                </div>

                <div className="md:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  >
                    <span className="sr-only">Open main menu</span>
                    {!isMobileMenuOpen ? (
                      <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    ) : (
                      <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {isMobileMenuOpen && (
              <div className="md:hidden animate-fade-in bg-gray-800/95 backdrop-blur-sm border-t border-gray-700/50">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <NavLink to="/">
                    <HomeIcon className="h-5 w-5" />
                    <span>APOD</span>
                  </NavLink>
                  <NavLink to="/mars-rover">
                    <PhotoIcon className="h-5 w-5" />
                    <span>Mars Rover</span>
                  </NavLink>
                  <NavLink to="/neo">
                    <GlobeAltIcon className="h-5 w-5" />
                    <span>NEO</span>
                  </NavLink>
                  <NavLink to="/epic">
                    <ChartBarIcon className="h-5 w-5" />
                    <span>EPIC</span>
                  </NavLink>
                </div>
              </div>
            )}
          </nav>

          <main className="flex-grow container mx-auto px-4 py-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
              <Routes>
                <Route path="/" element={<ApodPage />} />
                <Route path="/mars-rover" element={<MarsRoverPage />} />
                <Route path="/neo" element={<NeoPage />} />
                <Route path="/epic" element={<EpicPage />} />
              </Routes>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-2">
                  <img
                    src="/images/NASA_logo.svg"
                    alt="NASA Logo"
                    className="h-6 w-auto object-contain"
                  />
                  <span className="text-sm text-gray-400">
                    Powered by NASA APIs
                  </span>
                </div>
                <div className="mt-4 md:mt-0">
                  <a
                    href="https://api.nasa.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Get your NASA API key
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
