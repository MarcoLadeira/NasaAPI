# NASA Web Explorer

Explore the cosmos with this web application, bringing various NASA APIs to life through an engaging and informative experience, enhanced with smart, AI-like features.

## Features

### Astronomy Picture of the Day (APOD)
*   Daily astronomical images with detailed explanations.
*   Browse by date or date range.
*   **Smart Content Summaries**: Get concise overviews of complex astronomical concepts.
*   **Mood/Theme Suggestions**: Discover the emotional or thematic essence of each APOD.

### Near Earth Objects (NEO)
*   Track Near Earth Objects by date range.
*   View detailed information, including hazardous status and close approach data.
*   **Risk Assessments**: Understand the potential impact of hazardous NEOs.

### Earth Polychromatic Imaging Camera (EPIC)
*   See daily images of Earth from NOAA's DSCOVR satellite (natural and enhanced color).
*   **Atmospheric Insights**: Learn about atmospheric conditions visible in the images.
*   **Optimal Viewing Times**: Get insights on the best time of day for viewing based on image quality.

### Mars Rover Photos
*   Browse photos from Curiosity, Opportunity, Spirit, and Perseverance rovers.
*   Filter by Martian Sol and camera type.
*   **Camera Guides**: Understand the purpose of each rover camera.
*   **Rover Legacy**: Discover insights into each rover's mission impact.
*   **Smart Sol Suggestions**: Find optimal Martian Sols for photo viewing.
*   **Predicted Photo Counts**: Get estimates on expected photo counts for a given Sol.

### NASA Videos
*   Browse NASA's vast video library.
*   Search by keywords and enjoy a clean, interactive video player.
*   **Content Analysis**: Gain insights into video themes and subjects.
*   **Educational Value**: See the educational level and topics covered.
*   **Historical Context**: Understand the historical significance of recordings.
*   Easy pagination for endless discovery.

## Technologies

*   **Frontend**: React, TypeScript, Tailwind CSS, React Query
*   **Backend**: Node.js, Express, TypeScript, Axios

## Setup and Run

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd NasaWebApp_Bounce_Marco
    ```

2.  **Get a NASA API Key:**
    *   Go to the [NASA API website](https://api.nasa.gov/).
    *   Request an API key.

3.  **Configure Environment Variables:**
    *   Create a `.env` file in the `backend` directory.
    *   Add your NASA API key to this file:
        ```
        NASA_API_KEY=YOUR_NASA_API_KEY
        ```

4.  **Install Dependencies and Run Backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    The backend server will run on `http://localhost:3002`.

5.  **Install Dependencies and Run Frontend:**
    ```bash
    cd ../frontend
    npm install
    npm start
    ```
    The frontend application will typically open in your browser at `http://localhost:3000`.

## Contributing

Feel free to fork this repository, submit pull requests, or open issues.


