﻿# NASA Space Explorer

A full-stack web application that showcases NASA's vast collection of space data through an interactive and visually appealing interface. Built as part of a Software Engineer coding challenge, this project demonstrates modern web development practices with React frontend and Node.js backend.

## Live Demo

**Deployed Application:** [https://nasaapi-production.up.railway.app](https://nasaapi-production.up.railway.app)

## Project Overview

This application allows users to explore various NASA APIs including:
- **Astronomy Picture of the Day (APOD)** - Daily stunning space images with detailed descriptions
- **Mars Rover Photos** - Real photos from Curiosity, Opportunity, Spirit, and Perseverance rovers
- **EPIC Earth Images** - High-resolution images of Earth from NASA's DSCOVR satellite
- **Near Earth Objects (NEO)** - Information about asteroids and comets near Earth
- **NASA Image & Video Library** - Searchable collection of NASA's media assets

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **React Query** for data fetching and caching

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **Helmet** for security headers
- **CORS** configuration for cross-origin requests
- **Axios** for NASA API integration

### Deployment
- **Railway** (previously tried Vercel + Render, but switched for unified deployment)
- **Docker** for containerization

## Architecture

The application follows a clean architecture pattern:

```
├── frontend/          # React TypeScript application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript type definitions
│   └── public/            # Static assets
├── backend/           # Node.js Express server
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── config/        # Configuration files
│   │   └── index.ts       # Server entry point
│   └── tests/             # Backend tests
└── Dockerfile         # Docker configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- NASA API key (get one at [https://api.nasa.gov/](https://api.nasa.gov/))

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/MarcoLadeira/NasaAPI.git
   cd NasaAPI
   ```

2. **Set up environment variables**
   ```bash
   # Backend
      cd backend
   cp .env.example .env
   # Add your NASA_API_KEY to .env
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
      npm install
      ```

4. **Start development servers**
   ```bash
   # Backend (runs on port 3002)
   cd backend
   npm run dev
   
   # Frontend (runs on port 3000)
   cd frontend
      npm start
      ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Build

```bash
# Build frontend
      cd frontend
npm run build

# Build backend
cd backend
npm run build
      npm start
      ```

## Key Features

### Frontend Features
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Interactive UI** - Smooth animations and transitions
- **Search & Filter** - Find specific NASA images and videos
- **Loading States** - Proper loading indicators and error handling
- **Image Gallery** - Grid layout with modal views for detailed images
- **Date Selection** - Pick specific dates for APOD and EPIC images

### Backend Features
- **RESTful API** - Clean, well-documented endpoints
- **Error Handling** - Comprehensive error responses
- **Rate Limiting** - Protection against API abuse
- **CORS Configuration** - Secure cross-origin requests
- **Content Security Policy** - Enhanced security headers
- **Health Checks** - Monitoring endpoints for deployment

### Data Visualization
- **Image Galleries** - Grid and masonry layouts
- **Modal Views** - Detailed image information
- **Responsive Grids** - Adaptive layouts for different screen sizes
- **Loading Skeletons** - Smooth loading experiences
- **Error Boundaries** - Graceful error handling

## API Endpoints

### Frontend Routes
- `/` - Home page with overview
- `/apod` - Astronomy Picture of the Day
- `/mars-rover` - Mars Rover photos
- `/epic` - EPIC Earth images
- `/neo` - Near Earth Objects
- `/nasa-photos` - NASA Image Library
- `/nasa-videos` - NASA Video Library

### Backend API Routes
- `GET /api/apod` - Get APOD data
- `GET /api/mars-photos` - Get Mars rover photos
- `GET /api/epic` - Get EPIC Earth images
- `GET /api/neo` - Get Near Earth Objects
- `GET /api/nasa-photos` - Search NASA images
- `GET /api/nasa-videos` - Search NASA videos
- `GET /health` - Health check endpoint

## Deployment Journey

### Initial Approach: Separate Frontend/Backend
Initially, I deployed the frontend on **Vercel** and backend on **Render** to leverage their respective strengths:
- Vercel's excellent React support and global CDN
- Render's reliable Node.js hosting

### Challenge: CORS Issues
However, this setup introduced CORS complications that required extensive configuration and debugging. Despite proper CORS setup, we encountered persistent issues with image loading and API communication.

### Solution: Unified Deployment on Railway
I switched to **Railway** for a unified deployment approach:
- **Single deployment** - Frontend and backend served from the same domain
- **Docker containerization** - Consistent environment across development and production
- **Simplified CORS** - No cross-origin issues since everything runs on the same domain
- **Better performance** - Reduced latency between frontend and backend
- **Easier maintenance** - Single deployment pipeline

### Technical Implementation
The unified deployment uses:
- **Docker** to build both frontend and backend
- **Express static file serving** for the React build
- **React Router fallback** for client-side routing
- **Port 8080** for Railway compatibility

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Security Features

- **Content Security Policy** - Configured to allow NASA domains while maintaining security
- **Helmet.js** - Security headers and protection
- **CORS** - Properly configured for production
- **Environment Variables** - Sensitive data kept secure
- **Input Validation** - API parameter validation

## Design Decisions

### UI/UX Choices
- **Dark theme** - Space-themed aesthetic that's easy on the eyes
- **Card-based layout** - Clean, organized presentation of data
- **Responsive grid** - Adapts to different screen sizes
- **Loading states** - Smooth user experience during data fetching
- **Error handling** - User-friendly error messages

### Technical Choices
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Rapid development and consistent styling
- **React Query** - Efficient data fetching and caching
- **Express.js** - Lightweight, flexible backend framework
- **Docker** - Consistent deployment environment

## Performance Optimizations

- **Image lazy loading** - Improved page load times
- **React Query caching** - Reduced API calls
- **Code splitting** - Smaller bundle sizes
- **Static file serving** - Fast asset delivery
- **Compression** - Reduced bandwidth usage

## Environment Variables

### Backend (.env)
```env
NASA_API_KEY=your_nasa_api_key_here
NODE_ENV=production
PORT=8080
ALLOWED_ORIGINS=https://your-domain.com
```

## Future Enhancements

- [ ] User authentication and favorites
- [ ] Advanced search filters
- [ ] Image download functionality
- [ ] Real-time notifications
- [ ] PWA capabilities
- [ ] More NASA API endpoints
- [ ] Interactive 3D visualizations
- [ ] Social sharing features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## Acknowledgments

- **NASA** for providing the amazing APIs and space data
- **React** and **Node.js** communities for excellent documentation
- **Railway** for seamless deployment experience
- **Tailwind CSS** for the beautiful styling framework

