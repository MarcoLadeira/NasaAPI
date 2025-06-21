import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PhotoIcon, GlobeAltIcon, SunIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useApod } from '../hooks/useApod';
import { useEpicImages } from '../hooks/useNasaData';
import useRandomNasaPhoto from '../hooks/useRandomNasaPhoto';
import Spinner from '../components/Spinner';

const getPreviousDay = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 2); // Use 2 days ago to ensure data is available
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const popularSearchTerms = ['galaxy', 'nebula', 'hubble', 'mars', 'supernova'];

const HomePage: React.FC = () => {
  const { data: apodData, isLoading: isApodLoading, error: apodError } = useApod();
  const previousDay = getPreviousDay();
  const { data: epicData, isLoading: isEpicLoading, error: epicError } = useEpicImages(previousDay);

  // useMemo ensures we pick a random search term only once when the component mounts
  const randomSearchTerm = useMemo(() => popularSearchTerms[Math.floor(Math.random() * popularSearchTerms.length)], []);
  const { data: randomPhoto, isLoading: isRandomPhotoLoading, error: randomPhotoError } = useRandomNasaPhoto(randomSearchTerm);

  // Shooting star state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shootingStars, setShootingStars] = useState<Array<{ 
    id: number; 
    x: number; 
    y: number; 
    angle: number; 
    opacity: number;
    type: 'classic' | 'sparkle' | 'comet' | 'meteor';
    size: number;
  }>>([]);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Create shooting stars periodically
  useEffect(() => {
    const createRandomStar = () => {
      const types: Array<'classic' | 'sparkle' | 'comet' | 'meteor'> = ['classic', 'sparkle', 'comet', 'meteor'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      // Avoid image areas - create safe zones
      const pageWidth = window.innerWidth;
      const pageHeight = window.innerHeight;
      
      // Define areas to avoid (image sections)
      const avoidZones = [
        // Hero section (top area)
        { x: 0, y: 0, width: pageWidth, height: pageHeight * 0.4 },
        // Features section (middle area with images)
        { x: pageWidth * 0.1, y: pageHeight * 0.4, width: pageWidth * 0.8, height: pageHeight * 0.4 },
        // Technical section (bottom area)
        { x: 0, y: pageHeight * 0.8, width: pageWidth, height: pageHeight * 0.2 }
      ];
      
      let randomX: number, randomY: number;
      let attempts = 0;
      const maxAttempts = 50;
      
      // Find a safe position
      do {
        randomX = Math.random() * pageWidth;
        randomY = Math.random() * pageHeight;
        attempts++;
        
        // Check if position is in a safe zone
        const isInSafeZone = !avoidZones.some(zone => 
          randomX >= zone.x && 
          randomX <= zone.x + zone.width && 
          randomY >= zone.y && 
          randomY <= zone.y + zone.height
        );
        
        if (isInSafeZone) break;
      } while (attempts < maxAttempts);
      
      // If we can't find a safe position, use edges
      if (attempts >= maxAttempts) {
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
          case 0: // top edge
            randomX = Math.random() * pageWidth;
            randomY = Math.random() * (pageHeight * 0.1);
            break;
          case 1: // right edge
            randomX = pageWidth - (Math.random() * (pageWidth * 0.1));
            randomY = Math.random() * pageHeight;
            break;
          case 2: // bottom edge
            randomX = Math.random() * pageWidth;
            randomY = pageHeight - (Math.random() * (pageHeight * 0.1));
            break;
          case 3: // left edge
            randomX = Math.random() * (pageWidth * 0.1);
            randomY = Math.random() * pageHeight;
            break;
        }
      }
      
      const newStar = {
        id: Date.now() + Math.random(),
        x: randomX,
        y: randomY,
        angle: Math.random() * 360,
        opacity: 1,
        type: randomType,
        size: Math.random() * 0.5 + 0.8 // Random size between 0.8 and 1.3
      };
      
      setShootingStars(prev => [...prev, newStar]);
      
      // Remove star after animation (faster animation)
      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== newStar.id));
      }, 1500); // Reduced from 3000ms to 1500ms
    };

    // Create stars at random intervals (more frequent)
    const interval = setInterval(() => {
      // Random number of stars (1-2 for better performance)
      const starCount = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < starCount; i++) {
        setTimeout(() => createRandomStar(), i * 100); // Reduced delay between stars
      }
    }, 1000 + Math.random() * 2000); // Random interval between 1-3 seconds (faster)

    return () => clearInterval(interval);
  }, []);

  // Render shooting star based on type
  const renderShootingStar = (star: any) => {
    const baseClasses = "absolute animate-shooting-star";
    const style = {
      left: star.x,
      top: star.y,
      transform: `rotate(${star.angle}deg) scale(${star.size})`,
      opacity: star.opacity,
    };

    // All stars now use NASA yellow theme with different effects
    switch (star.type) {
      case 'sparkle':
        return (
          <div key={star.id} className={baseClasses} style={style}>
            <div className="relative">
              {/* Sparkly trail */}
              <div className="w-6 h-1 bg-gradient-to-r from-yellow-300 via-yellow-200 to-transparent rounded-full shadow-[0_0_15px_rgba(255,255,0,0.8)]"></div>
              {/* Sparkle head */}
              <div className="absolute -left-1 -top-1 w-4 h-4 bg-yellow-300 rounded-full shadow-[0_0_20px_rgba(255,255,0,0.9)] animate-pulse"></div>
              {/* Extra sparkles */}
              <div className="absolute -left-2 -top-2 w-2 h-2 bg-yellow-200 rounded-full shadow-[0_0_10px_rgba(255,255,0,0.7)] animate-ping"></div>
              <div className="absolute -left-3 -top-1 w-1 h-1 bg-yellow-100 rounded-full shadow-[0_0_8px_rgba(255,255,0,0.6)] animate-ping" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute -left-4 top-0 w-1 h-1 bg-yellow-50 rounded-full shadow-[0_0_8px_rgba(255,255,0,0.5)] animate-ping" style={{ animationDelay: '0.6s' }}></div>
            </div>
          </div>
        );

      case 'comet':
        return (
          <div key={star.id} className={baseClasses} style={style}>
            <div className="relative">
              {/* Comet tail */}
              <div className="w-8 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-transparent rounded-full shadow-[0_0_12px_rgba(255,255,0,0.8)]"></div>
              {/* Comet head */}
              <div className="absolute -left-1 -top-1 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_18px_rgba(255,255,0,0.9)] animate-pulse"></div>
              {/* Comet trail particles */}
              <div className="absolute -left-2 -top-1 w-1 h-1 bg-yellow-300 rounded-full shadow-[0_0_6px_rgba(255,255,0,0.7)]"></div>
              <div className="absolute -left-3 -top-0.5 w-1 h-1 bg-yellow-200 rounded-full shadow-[0_0_6px_rgba(255,255,0,0.6)]"></div>
              <div className="absolute -left-4 top-0 w-1 h-1 bg-yellow-100 rounded-full shadow-[0_0_6px_rgba(255,255,0,0.5)]"></div>
            </div>
          </div>
        );

      case 'meteor':
        return (
          <div key={star.id} className={baseClasses} style={style}>
            <div className="relative">
              {/* Meteor trail */}
              <div className="w-10 h-1.5 bg-gradient-to-r from-yellow-500 via-yellow-400 to-transparent rounded-full shadow-[0_0_15px_rgba(255,255,0,0.8)]"></div>
              {/* Meteor head */}
              <div className="absolute -left-1 -top-1 w-4 h-4 bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(255,255,0,0.9)] animate-pulse"></div>
              {/* Meteor debris */}
              <div className="absolute -left-2 -top-1 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(255,255,0,0.7)]"></div>
              <div className="absolute -left-3 -top-0.5 w-1 h-1 bg-yellow-300 rounded-full shadow-[0_0_6px_rgba(255,255,0,0.6)]"></div>
              <div className="absolute -left-4 top-0 w-1 h-1 bg-yellow-200 rounded-full shadow-[0_0_6px_rgba(255,255,0,0.5)]"></div>
            </div>
          </div>
        );

      default: // classic
        return (
          <div key={star.id} className={baseClasses} style={style}>
            <div className="relative">
              {/* Main star body */}
              <div className="w-4 h-1 bg-gradient-to-r from-yellow-300 via-yellow-200 to-transparent rounded-full shadow-[0_0_10px_rgba(255,255,0,0.8)]"></div>
              {/* Star head */}
              <div className="absolute -left-1 -top-1 w-3 h-3 bg-yellow-300 rounded-full shadow-[0_0_15px_rgba(255,255,0,0.9)] animate-pulse"></div>
              {/* Sparkle trail */}
              <div className="absolute -left-2 -top-2 w-2 h-2 bg-yellow-200 rounded-full shadow-[0_0_8px_rgba(255,255,0,0.7)] animate-ping"></div>
              <div className="absolute -left-3 -top-1 w-1 h-1 bg-yellow-100 rounded-full shadow-[0_0_5px_rgba(255,255,0,0.6)] animate-ping" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute -left-4 top-0 w-1 h-1 bg-yellow-50 rounded-full shadow-[0_0_5px_rgba(255,255,0,0.5)] animate-ping" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        );
    }
  };

  const epicImage = epicData?.data?.[0];

  return (
    <div className="bg-gray-100 text-gray-900 relative overflow-hidden">
      {/* Shooting Stars Container */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {shootingStars.map((star) => renderShootingStar(star))}
      </div>

      {/* New Hero Section */}
      <section className="relative min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 text-white overflow-hidden flex items-center justify-center p-4 sm:p-6 animate-fade-in">
        {/* Enhanced background effects */}
        <div className="absolute inset-0">
          <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-blue-500/15 rounded-full mix-blend-lighten filter blur-[100px] animate-blob animate-space-travel"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-purple-500/15 rounded-full mix-blend-lighten filter blur-[100px] animate-blob animation-delay-500 animate-space-travel"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/10 rounded-full mix-blend-lighten filter blur-[120px] animate-blob animation-delay-250 animate-space-travel"></div>
          {/* Add subtle star effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto p-6 md:p-12 rounded-3xl backdrop-blur-2xl bg-white/5 shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-fade-in-up animation-delay-500 border border-white/10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4 md:mb-8 tracking-tighter text-white leading-tight animate-fade-in-down drop-shadow-3xl text-shadow-glow bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
            Journey Beyond the Stars
          </h1>
          <p className="text-base md:text-xl lg:text-2xl mb-8 md:mb-12 opacity-90 font-light leading-relaxed animate-fade-in-down animation-delay-200 text-shadow-glow max-w-4xl mx-auto">
            Unveiling the Cosmos: Access millions of high-resolution images, videos, and real-time data from NASA's incredible missions and scientific discoveries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 animate-fade-in-down animation-delay-600">
            <Link
              to="/nasa-photos"
              className="group w-full sm:w-auto px-8 py-4 md:px-14 md:py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base md:text-xl font-semibold rounded-full shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.7)] transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 flex items-center justify-center hover:brightness-110 group-hover:animate-button-glow"
            >
              <PhotoIcon className="h-6 w-6 mr-2 md:h-8 md:w-8 md:mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span>Explore Imagery</span>
            </Link>
            <a
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto px-8 py-4 md:px-14 md:py-6 bg-transparent border-2 border-white/30 text-white text-base md:text-xl font-semibold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 flex items-center justify-center hover:bg-white/10 group-hover:animate-button-glow"
            >
              <RocketLaunchIcon className="h-6 w-6 mr-2 md:h-8 md:w-8 md:mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span>Get API Key</span>
            </a>
          </div>
        </div>

        {/* Modern scroll indicator */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 md:gap-2">
          <div className="w-5 h-8 md:w-6 md:h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-1.5 md:h-2 bg-white/50 rounded-full animate-scroll-down"></div>
          </div>
          <span className="text-xs md:text-sm text-white/50 font-light">Scroll to explore</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-28 px-4 sm:px-6 bg-gray-50 overflow-hidden">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-12 md:mb-16 text-gray-800 drop-shadow-xl">
            EXPLORE FEATURES
          </h2>

          {/* About This App */}
          <div className="text-center mb-16 md:mb-24 max-w-5xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-nasa-blue mb-4 md:mb-6 border-b-2 border-nasa-blue inline-block pb-2 px-3 animate-fade-in-up">
              About This App
            </h3>
            <p className="text-base md:text-xl leading-relaxed text-gray-700 animate-fade-in-up animation-delay-100">
              This application serves as a comprehensive frontend for the rich collection of <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-nasa-blue underline hover:text-blue-600 font-semibold">REST APIs provided by api.nasa.gov</a>. Dive into a universe of knowledge, from intricate data on distant comets and detailed measurements of Mars to captivating real-time imagery of Earth, all presented through an intuitive and engaging interface.
            </p>
          </div>

          {/* Feature 1: NASA Image and Video Library */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mb-16 md:mb-28">
            <div className="relative group transform hover:scale-105 transition-transform duration-500 rounded-2xl overflow-hidden shadow-2xl hover:shadow-nasa-blue/70 aspect-video">
              {isRandomPhotoLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Spinner />
                </div>
              ) : randomPhotoError || !randomPhoto || !randomPhoto.thumbnail_url ? (
                <img src="/images/cosmic-cliffs.jpg" alt="Vast collection of NASA images" className="w-full h-full object-cover" />
              ) : (
                <img 
                  src={randomPhoto.thumbnail_url} 
                  alt={randomPhoto.title || 'A random image from the NASA library'} 
                  className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-110" 
                  onError={(e) => {
                    e.currentTarget.src = '/images/cosmic-cliffs.jpg';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 md:p-8">
                <PhotoIcon className="h-20 w-20 md:h-28 md:w-28 text-white opacity-70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300" />
                <h3 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg relative z-10">Image & Video Library</h3>
              </div>
            </div>
            <div className="text-left md:text-right">
              <h3 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6">Vast Collections at Your Fingertips</h3>
              <p className="text-base md:text-xl text-gray-700 mb-6 md:mb-8 leading-relaxed">
                Delve into NASA's official database, featuring over 140,000 photos and videos. Discover breathtaking images of celestial wonders, iconic rocket launches, astronaut life, and much more, all categorized for easy exploration.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-start md:justify-end gap-4 sm:space-x-8 sm:space-y-0">
                <Link to="/nasa-photos" className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-nasa-blue text-white text-base md:text-lg font-semibold rounded-full shadow-lg hover:bg-nasa-blue/90 transform hover:scale-105 transition-all duration-300">
                  Browse Photos & Videos
                </Link>
              </div>
            </div>
          </div>

          {/* Feature 2: Earth Polychromatic Imaging Camera (EPIC) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mb-16 md:mb-28">
            <div className="md:order-2 relative group transform hover:scale-105 transition-transform duration-500 rounded-2xl overflow-hidden shadow-2xl hover:shadow-nasa-blue/70 aspect-video">
              {isEpicLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Spinner />
                </div>
              ) : epicError || !epicImage ? (
                <img src="/images/epic-earth.png" alt="Fallback EPIC" className="w-full h-full object-cover" />
              ) : (
                <img 
                  src={`https://epic.gsfc.nasa.gov/archive/natural/${previousDay.replace(/-/g, '/')}/png/${epicImage.image}.png`} 
                  alt={epicImage.caption || 'Earth from the EPIC camera'} 
                  className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-110" 
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 md:p-8">
                <GlobeAltIcon className="h-20 w-20 md:h-28 md:w-28 text-white opacity-70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300" />
                <h3 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg relative z-10">EPIC: Earth from Afar</h3>
              </div>
            </div>
            <div className="md:order-1 text-left">
              <h3 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6">Stunning Daily Views of Earth</h3>
              <p className="text-base md:text-xl text-gray-700 mb-6 md:mb-8 leading-relaxed">
                Experience our home planet from a unique perspective. The Earth Polychromatic Imaging Camera (EPIC) on the DSCOVR satellite captures daily full-disk images of Earth from a million miles away, revealing the planet's dynamic beauty.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-start gap-4 sm:space-x-6 sm:space-y-0">
                <Link to="/epic" className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-nasa-blue text-white text-base md:text-lg font-semibold rounded-full shadow-lg hover:bg-nasa-blue/90 transform hover:scale-105 transition-all duration-300">
                  See Earth's Daily Face
                </Link>
              </div>
            </div>
          </div>

          {/* Feature 3: Astronomy Picture of the Day (APOD) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative group transform hover:scale-105 transition-transform duration-500 rounded-2xl overflow-hidden shadow-2xl hover:shadow-nasa-blue/70 aspect-video">
              {isApodLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Spinner />
                </div>
              ) : apodError || !apodData?.data.url ? (
                <img src="/images/pillars-of-creation.jpg" alt="Fallback APOD" className="w-full h-full object-cover" />
              ) : (
                <img src={apodData.data.url} alt={apodData.data.title || 'Astronomy Picture of the Day'} className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-110" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 md:p-8">
                <SunIcon className="h-20 w-20 md:h-28 md:w-28 text-white opacity-70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300" />
                <h3 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg relative z-10">APOD: A Universe a Day</h3>
              </div>
            </div>
            <div className="text-left md:text-right">
              <h3 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6">A New Cosmic Wonder, Every Day</h3>
              <p className="text-base md:text-xl text-gray-700 mb-6 md:mb-8 leading-relaxed">
                Curated by professional astronomers, the Astronomy Picture of the Day features a captivating image or video of our universe daily. Each entry comes with a concise explanation, offering a fascinating glimpse into cosmic phenomena.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-start md:justify-end gap-4 sm:space-x-8 sm:space-y-0">
                <Link to="/apod" className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-nasa-blue text-white text-base md:text-lg font-semibold rounded-full shadow-lg hover:bg-nasa-blue/90 transform hover:scale-105 transition-all duration-300">
                  See Today's APOD
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="py-16 md:py-28 px-4 sm:px-6 bg-gray-900 text-white">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-12 md:mb-16 text-white drop-shadow-xl">
            TECHNICAL UNDERPINNINGS
          </h2>
          <p className="text-base md:text-xl text-center opacity-90 mb-12 md:mb-16 max-w-5xl mx-auto">
            The NASA API Explorer is a modern web application built with a robust front-end and a scalable back-end, showcasing the power of contemporary web development architectures and best practices.
          </p>

          <div className="space-y-16 md:space-y-20">
            {/* Core Technologies with Images */}
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-blue-300 mb-8 md:mb-10 flex items-center justify-center md:justify-start drop-shadow-md">
                <SunIcon className="h-8 w-8 mr-3 md:h-10 md:w-10 md:mr-4" /> Core Technologies
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <div className="flex flex-col items-center p-4 md:p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                  <img src="/images/react.png" alt="React logo" className="h-12 w-12 md:h-16 md:w-16 mb-2 md:mb-4" />
                  <span className="text-base md:text-xl font-semibold text-blue-300">React</span>
                </div>
                <div className="flex flex-col items-center p-4 md:p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                  <img src="/images/Node.js_logo.svg" alt="Node.js logo" className="h-12 w-12 md:h-16 md:w-16 mb-2 md:mb-4" />
                  <span className="text-base md:text-xl font-semibold text-green-300">Node.js</span>
                </div>
                <div className="flex flex-col items-center p-4 md:p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                  <img src="/images/typescrip.png" alt="TypeScript logo" className="h-12 w-12 md:h-16 md:w-16 mb-2 md:mb-4" />
                  <span className="text-base md:text-xl font-semibold text-blue-300">TypeScript</span>
                </div>
                <div className="flex flex-col items-center p-4 md:p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                  <img src="/images/tailwind.png" alt="Tailwind CSS logo" className="h-12 w-12 md:h-16 md:w-16 mb-2 md:mb-4" />
                  <span className="text-base md:text-xl font-semibold text-cyan-300">Tailwind CSS</span>
                </div>
              </div>
            </div>

            {/* Additional Technologies */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="flex flex-col items-center p-4 md:p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                <img src="/images/express-js.png" alt="Express.js logo" className="h-12 w-12 md:h-16 md:w-16 mb-2 md:mb-4" />
                <span className="text-base md:text-xl font-semibold text-gray-300">Express.js</span>
              </div>
              <div className="flex flex-col items-center p-4 md:p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-colors duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                <img src="/images/reactQuery.png" alt="React Query logo" className="h-12 w-12 md:h-16 md:w-16 mb-2 md:mb-4" />
                <span className="text-base md:text-xl font-semibold text-pink-300">React Query</span>
              </div>
              <div className="flex flex-col items-center p-4 md:p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-colors duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                <img src="/images/heroicon.svg" alt="Heroicons logo" className="h-12 w-12 md:h-16 md:w-16 mb-2 md:mb-4" />
                <span className="text-base md:text-xl font-semibold text-purple-300">Heroicons</span>
              </div>
              <div className="flex flex-col items-center p-4 md:p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-colors duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                <img src="/images/axios.png" alt="Axios logo" className="h-12 w-12 md:h-16 md:w-16 mb-2 md:mb-4" />
                <span className="text-base md:text-xl font-semibold text-blue-200">Axios</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 