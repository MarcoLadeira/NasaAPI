import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import ApodPage from './pages/ApodPage';
import MarsRoverPage from './pages/MarsRoverPage';
import NeoPage from './pages/NeoPage';
import EpicPage from './pages/EpicPage';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavItem: React.FC<NavLinkProps> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink 
      to={to} 
      className={`px-4 py-2 rounded-lg text-lg font-medium 
                 ${isActive ? 'bg-nasa-red text-white shadow-md' : 'text-gray-200 hover:text-white hover:bg-nasa-blue-light'}
                 transition-all duration-300 ease-in-out`}
    >
      {children}
    </NavLink>
  );
};

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <nav className="bg-nasa-blue shadow-lg sticky top-0 z-50 py-4 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img src="/images/NASA_logo.svg" alt="NASA Logo" className="h-12 w-12 rounded-full p-1 bg-white shadow-md" />
              <span className="text-white text-3xl font-extrabold tracking-tight">
                NASA Space Explorer
                <p className="text-xs font-normal opacity-80">Discover the Cosmos</p>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              <NavItem to="/">APOD</NavItem>
              <NavItem to="/mars-rover">Mars Rover</NavItem>
              <NavItem to="/neo">NEO</NavItem>
              <NavItem to="/epic">EPIC</NavItem>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={toggleMobileMenu}
                className="text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md p-2"
                aria-label="Toggle navigation"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-nasa-blue-dark py-4 mt-4 rounded-lg shadow-inner">
              <div className="flex flex-col items-center space-y-4">
                <NavItem to="/" onClick={toggleMobileMenu}>APOD</NavItem>
                <NavItem to="/mars-rover" onClick={toggleMobileMenu}>Mars Rover</NavItem>
                <NavItem to="/neo" onClick={toggleMobileMenu}>NEO</NavItem>
                <NavItem to="/epic" onClick={toggleMobileMenu}>EPIC</NavItem>
              </div>
            </div>
          )}
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<ApodPage />} />
            <Route path="/mars-rover" element={<MarsRoverPage />} />
            <Route path="/neo" element={<NeoPage />} />
            <Route path="/epic" element={<EpicPage />} />
          </Routes>
        </main>

        <footer className="bg-nasa-blue-dark text-white py-6 mt-8 shadow-inner">
          <div className="container mx-auto text-center">
            <p className="text-lg mb-2">&copy; {new Date().getFullYear()} NASA Space Explorer. All rights reserved.</p>
            <p className="text-sm opacity-80">
              Data provided by NASA's Open APIs.
            </p>
            <a 
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-nasa-red hover:underline mt-2 inline-block text-sm font-medium"
            >
              Get Your NASA API Key
            </a>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
