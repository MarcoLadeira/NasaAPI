import React from 'react';
import { Link } from 'react-router-dom';
import { PhotoIcon, GlobeAltIcon, SunIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* New Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] pt-16 bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 text-white overflow-hidden flex items-center justify-center p-6 animate-fade-in">
        {/* Enhanced background effects */}
        <div className="absolute inset-0">
          <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-blue-500/15 rounded-full mix-blend-lighten filter blur-[100px] animate-blob animate-space-travel"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-purple-500/15 rounded-full mix-blend-lighten filter blur-[100px] animate-blob animation-delay-500 animate-space-travel"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/10 rounded-full mix-blend-lighten filter blur-[120px] animate-blob animation-delay-250 animate-space-travel"></div>
          {/* Add subtle star effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto p-12 rounded-3xl backdrop-blur-2xl bg-white/5 shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-fade-in-up animation-delay-500 border border-white/10">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-extrabold mb-8 tracking-tighter text-white leading-tight animate-fade-in-down drop-shadow-3xl text-shadow-glow bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
            Journey Beyond the Stars
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-12 opacity-90 font-light leading-relaxed animate-fade-in-down animation-delay-200 text-shadow-glow max-w-4xl mx-auto">
            Unveiling the Cosmos: Access millions of high-resolution images, videos, and real-time data from NASA's incredible missions and scientific discoveries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-fade-in-down animation-delay-600">
            <Link
              to="/nasa-photos"
              className="group w-full sm:w-auto px-14 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl font-semibold rounded-full shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.7)] transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 flex items-center justify-center hover:brightness-110 group-hover:animate-button-glow"
            >
              <PhotoIcon className="h-8 w-8 mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span>Explore Imagery</span>
            </Link>
            <a
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto px-14 py-6 bg-transparent border-2 border-white/30 text-white text-xl font-semibold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 flex items-center justify-center hover:bg-white/10 group-hover:animate-button-glow"
            >
              <RocketLaunchIcon className="h-8 w-8 mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span>Get API Key</span>
            </a>
          </div>
        </div>

        {/* Modern scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-2 bg-white/50 rounded-full animate-scroll-down"></div>
          </div>
          <span className="text-sm text-white/50 font-light">Scroll to explore</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 px-6 bg-gray-50 overflow-hidden">
        <div className="container mx-auto">
          <h2 className="text-5xl md:text-6xl font-extrabold text-center mb-16 text-gray-800 drop-shadow-xl">
            EXPLORE FEATURES
          </h2>

          {/* About This App */}
          <div className="text-center mb-24 max-w-5xl mx-auto">
            <h3 className="text-4xl font-bold text-nasa-blue mb-6 border-b-2 border-nasa-blue inline-block pb-2 px-4 animate-fade-in-up">
              About This App
            </h3>
            <p className="text-xl md:text-3xl leading-relaxed text-gray-700 animate-fade-in-up animation-delay-100">
              This application serves as a comprehensive frontend for the rich collection of <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-nasa-blue underline hover:text-blue-600 font-semibold">REST APIs provided by api.nasa.gov</a>. Dive into a universe of knowledge, from intricate data on distant comets and detailed measurements of Mars to captivating real-time imagery of Earth, all presented through an intuitive and engaging interface.
            </p>
          </div>

          {/* Feature 1: NASA Image and Video Library */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-28">
            <div className="relative group transform hover:scale-105 transition-transform duration-500 rounded-2xl overflow-hidden shadow-2xl hover:shadow-nasa-blue/70 aspect-video">
              <img src="/images/nasa-image-library-screenshot.png" alt="NASA Image and Video Library" className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <PhotoIcon className="h-28 w-28 text-white opacity-70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300" />
                <h3 className="text-white text-4xl font-bold relative z-10">Image & Video Library</h3>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-5xl font-bold text-gray-800 mb-6">Vast Collections at Your Fingertips</h3>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Delve into NASA's official database, featuring over 140,000 photos and videos. Discover breathtaking images of celestial wonders, iconic rocket launches, astronaut life, and much more, all categorized for easy exploration.
              </p>
              <div className="flex items-center justify-end space-x-8">
                <Link to="/nasa-photos" className="px-8 py-4 bg-nasa-blue text-white text-lg font-semibold rounded-full shadow-lg hover:bg-nasa-blue/90 transform hover:scale-105 transition-all duration-300">
                  Browse Photos & Videos
                </Link>
                <a href="https://api.nasa.gov/#image-and-video-library" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-nasa-blue transition-colors text-lg font-medium">
                  About API
                </a>
              </div>
            </div>
          </div>

          {/* Feature 2: Earth Polychromatic Imaging Camera (EPIC) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-28">
            <div className="md:order-2 relative group transform hover:scale-105 transition-transform duration-500 rounded-2xl overflow-hidden shadow-2xl hover:shadow-nasa-blue/70 aspect-video">
              <img alt="Earth Polychromatic Imaging Camera" className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <GlobeAltIcon className="h-28 w-28 text-white opacity-70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300" />
                <h3 className="text-white text-4xl font-bold relative z-10">EPIC: Earth from Afar</h3>
              </div>
            </div>
            <div className="md:order-1 text-left">
              <h3 className="text-5xl font-bold text-gray-800 mb-6">Stunning Daily Views of Earth</h3>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Experience our home planet from a unique perspective. The Earth Polychromatic Imaging Camera (EPIC) on the DSCOVR satellite captures daily full-disk images of Earth from a million miles away, revealing the planet's dynamic beauty.
              </p>
              <div className="flex items-center space-x-6">
                <Link to="/epic" className="px-8 py-4 bg-nasa-blue text-white text-lg font-semibold rounded-full shadow-lg hover:bg-nasa-blue/90 transform hover:scale-105 transition-all duration-300">
                  See Earth's Daily Face
                </Link>
                <a href="https://api.nasa.gov/#epic" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-nasa-blue transition-colors text-lg font-medium">
                  About API
                </a>
              </div>
            </div>
          </div>

          {/* Feature 3: Astronomy Picture of the Day (APOD) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative group transform hover:scale-105 transition-transform duration-500 rounded-2xl overflow-hidden shadow-2xl hover:shadow-nasa-blue/70 aspect-video">
              <img src="/images/apod-screenshot.png" alt="Astronomy Picture of the Day" className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <SunIcon className="h-28 w-28 text-white opacity-70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300" />
                <h3 className="text-white text-4xl font-bold relative z-10">APOD: A Universe a Day</h3>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-5xl font-bold text-gray-800 mb-6">A New Cosmic Wonder, Every Day</h3>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Curated by professional astronomers, the Astronomy Picture of the Day features a captivating image or video of our universe daily. Each entry comes with a concise explanation, offering a fascinating glimpse into cosmic phenomena.
              </p>
              <div className="flex items-center justify-end space-x-8">
                <Link to="/apod" className="px-8 py-4 bg-nasa-blue text-white text-lg font-semibold rounded-full shadow-lg hover:bg-nasa-blue/90 transform hover:scale-105 transition-all duration-300">
                  See Today's APOD
                </Link>
                <a href="https://api.nasa.gov/#apod" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-nasa-blue transition-colors text-lg font-medium">
                  About API
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="py-20 md:py-28 px-6 bg-gray-900 text-white">
        <div className="container mx-auto">
          <h2 className="text-5xl md:text-6xl font-extrabold text-center mb-16 text-white drop-shadow-xl">
            TECHNICAL UNDERPINNINGS
          </h2>
          <p className="text-xl md:text-2xl text-center opacity-90 mb-16 max-w-5xl mx-auto">
            The NASA API Explorer is a modern web application built with a robust front-end and a scalable back-end, showcasing the power of contemporary web development architectures and best practices.
          </p>

          <div className="space-y-20">
            {/* Core Technologies with Images */}
            <div>
              <h3 className="text-4xl font-bold text-blue-300 mb-10 flex items-center justify-center md:justify-start drop-shadow-md">
                <SunIcon className="h-10 w-10 mr-4" /> Core Technologies
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                  <img src="/images/tech/react.png" alt="React logo" className="h-16 w-16 mb-4" />
                  <span className="text-xl font-semibold text-blue-300">React</span>
                </div>
                <div className="flex flex-col items-center p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                  <img src="/images/tech/nodejs.png" alt="Node.js logo" className="h-16 w-16 mb-4" />
                  <span className="text-xl font-semibold text-green-300">Node.js</span>
                </div>
                <div className="flex flex-col items-center p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                  <img src="/images/tech/typescript.png" alt="TypeScript logo" className="h-16 w-16 mb-4" />
                  <span className="text-xl font-semibold text-blue-300">TypeScript</span>
                </div>
                <div className="flex flex-col items-center p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                  <img src="/images/tech/tailwind.png" alt="Tailwind CSS logo" className="h-16 w-16 mb-4" />
                  <span className="text-xl font-semibold text-cyan-300">Tailwind CSS</span>
                </div>
              </div>
            </div>

            {/* Additional Technologies */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                <img src="/images/tech/express.png" alt="Express.js logo" className="h-16 w-16 mb-4" />
                <span className="text-xl font-semibold text-gray-300">Express.js</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-colors duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                <img src="/images/tech/react-query.png" alt="React Query logo" className="h-16 w-16 mb-4" />
                <span className="text-xl font-semibold text-pink-300">React Query</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-colors duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                <img src="/images/tech/heroicons.png" alt="Heroicons logo" className="h-16 w-16 mb-4" />
                <span className="text-xl font-semibold text-purple-300">Heroicons</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-800/90 rounded-xl hover:bg-gray-700/90 transition-colors duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-2">
                <img src="/images/tech/axios.png" alt="Axios logo" className="h-16 w-16 mb-4" />
                <span className="text-xl font-semibold text-blue-300">Axios</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 