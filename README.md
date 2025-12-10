# AI Travel Planner

This is an AI-powered travel planning application for Mongolia.

## Features
- **Interactive Map**: Pin start and end locations.
- **AI Chat Assistant**: Guides you through the planning process.
- **Route Generation**: Calculates the fastest driving route and suggests scenic stops.
- **Places Database**: Uses a local JSON database of archaeological sites and places.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration
- **OpenRouter API Key**: Configured in `app/api/chat/route.ts`.
- **Data Source**: `Archeology_all_data.json` in the root directory.

## Technologies
- Next.js 15
- Tailwind CSS
- Leaflet (Maps)
- OpenRouter (AI)
- OSRM (Routing)
- Turf.js (Geospatial Analysis)
