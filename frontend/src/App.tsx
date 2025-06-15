import React, { useState } from 'react';
import { Outlet, useLocation, NavLink as RouterNavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaGithub } from 'react-icons/fa';
import { GiSpaceSuit } from "react-icons/gi";

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <RouterNavLink
      to={to}
      className={`py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200
        ${isActive ? 'bg-nasa-red text-white shadow-md' : 'text-gray-200 hover:text-white hover:bg-gray-700'}
      `}
    >
      {children}
    </RouterNavLink>
  );
};

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="bg-nasa-blue shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <RouterNavLink to="/" className="flex items-center space-x-3">
                <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                  <img src="/images/NASA_logo.svg" alt="NASA Logo" className="h-8 w-8" />
                </div>
                <span className="text-white text-xl font-bold tracking-tight">
                  Nasa Space Explorer <span className="hidden sm:inline-block text-sm opacity-80 ml-2">Discover the Cosmos</span>
                </span>
              </RouterNavLink>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/apod">APOD</NavLink>
              <NavLink to="/mars-rover">Mars Rover</NavLink>
              <NavLink to="/neo">NEO</NavLink>
              <NavLink to="/epic">EPIC</NavLink>
              <a
                href="https://api.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 py-2 px-4 bg-nasa-red text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200 shadow-md"
              >
                Get API Key
              </a>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <FaTimes className="block h-6 w-6" />
                ) : (
                  <FaBars className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-nasa-blue">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink to="/apod">APOD</NavLink>
              <NavLink to="/mars-rover">Mars Rover</NavLink>
              <NavLink to="/neo">NEO</NavLink>
              <NavLink to="/epic">EPIC</NavLink>
              <a
                href="https://api.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2 px-3 rounded-md text-base font-medium text-white hover:bg-gray-700"
              >
                Get API Key
              </a>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-nasa-blue text-white py-6 mt-8 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-center sm:text-left mb-4 sm:mb-0">&copy; {new Date().getFullYear()} Nasa Space Explorer. All rights reserved.</p>
          <div className="flex space-x-4">
            <a
              href="https://github.com/your-github-username/NasaWebApp_Bounce_Marco"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white smooth-transition"
            >
              <FaGithub className="inline-block mr-1" /> GitHub
            </a>
            <a
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white smooth-transition"
            >
              Get NASA API Key
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
