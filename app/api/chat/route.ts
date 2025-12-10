import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getDrivingRoute } from '@/lib/osrm';
import { findPlacesNearRoute } from '@/lib/places';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    
    // Initialize OpenAI client inside the handler to avoid build-time errors
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey || 'dummy-key-for-build', // Fallback to allow build to pass without env var
    });

    const body = await req.json();
    const { stage, userInputs, messages } = body;

    // 1. Start Interaction
    if (stage === 'INITIAL') {
      return NextResponse.json({
        message: "Hello! I'm your AI travel assistant. I can help you plan a trip in Mongolia. To get started, please pin your starting place and your destination on the map.",
        nextStage: 'WAITING_FOR_PINS'
      });
    }

    // 2. Ask Additional Travel Information
    if (stage === 'WAITING_FOR_PINS') {
      // User should have sent start/end in userInputs
      if (!userInputs?.start || !userInputs?.end) {
        return NextResponse.json({ message: "Please select both a starting point and a destination on the map." });
      }
      return NextResponse.json({
        message: "Great! I have your route. Now, tell me: How many days are you planning to travel? And what kind of places do you want to visit? (e.g., nature, historical, museums, food)",
        nextStage: 'WAITING_FOR_INFO'
      });
    }

    // 3. Generate Routes
    if (stage === 'WAITING_FOR_INFO') {
      let { start, end, preferences, days, lastUserMessage } = userInputs;
      
      // If days/prefs not explicitly parsed, try to extract from message
      if (!days && lastUserMessage) {
        const daysMatch = lastUserMessage.match(/(\d+)\s*days?/i);
        days = daysMatch ? parseInt(daysMatch[1]) : 3; // Default to 3
        preferences = lastUserMessage; // Treat whole message as prefs
      }

      // A. Calculate Fastest Route
      let drivingRoute = await getDrivingRoute(start, end);
      
      // Fallback to straight line if OSRM fails (common in remote Mongolia)
      if (!drivingRoute) {
        const turf = require('@turf/turf');
        const from = turf.point([start[1], start[0]]);
        const to = turf.point([end[1], end[0]]);
        const distance = turf.distance(from, to, { units: 'kilometers' });
        
        drivingRoute = {
          distanceKm: distance,
          timeMinutes: (distance / 60) * 60, // Assume 60km/h avg speed off-road
          coordinates: [start, end] // Straight line
        };
        // Append a warning to the system prompt
        // systemPrompt += "\nNote: Could not find a road route, using straight line distance.";
      }

      // B. Find Nearby Places
      // Filter places within 3km (or more if needed)
      const nearbyPlaces = findPlacesNearRoute(drivingRoute.coordinates, 5, preferences); // Increased to 5km for better results
      
      // Limit places to avoid token limits, prioritize by relevance if possible (here just taking first 50)
      const candidatePlaces = nearbyPlaces.slice(0, 50).map(p => ({
        id: p.id,
        name: p.name,
        type: p.type,
        desc: p.description,
        coords: p.coordinates
      }));

      // C. Ask AI to generate the response
      const systemPrompt = `
        You are an AI travel-planning assistant.
        The user is planning a ${days}-day trip.
        Preferences: ${preferences}.
        
        I have calculated the fastest driving route:
        - Distance: ${drivingRoute.distanceKm.toFixed(1)} km
        - Time: ${drivingRoute.timeMinutes.toFixed(0)} minutes
        
        Here is a list of candidate places along the route:
        ${JSON.stringify(candidatePlaces)}
        
        Your task:
        1. Select the best places from the candidate list that match the user's preferences.
        2. Create a "Scenic Route" plan.
        3. Return a JSON object with the structure defined below.
        4. Provide a natural language explanation of the route and recommendations.
        
        Output Format (JSON only):
        {
          "fastestRoute": {
            "distanceKm": number,
            "time": string,
            "polyline": [[lat, lng], ...] // Use the provided driving route polyline
          },
          "scenicRoute": {
            "recommendedPlaces": [
              {
                "name": string,
                "coordinates": [lat, lng],
                "description": string,
                "matchReason": string
              }
            ],
            "polyline": [[lat, lng], ...] // Same as fastest for now, or modified if you can logic it (keep simple)
          },
          "explanation": "Natural language summary..."
        }
      `;

      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate the travel plan." }
        ],
        response_format: { type: "json_object" }
      });

      let aiResponse;
      try {
        aiResponse = JSON.parse(completion.choices[0].message.content || "{}");
      } catch (e) {
        // Fallback if AI doesn't return valid JSON
        console.error("AI JSON parse error", e);
        aiResponse = { explanation: completion.choices[0].message.content };
      }

      // Inject the real polyline data back in (to save tokens/accuracy)
      if (!aiResponse.fastestRoute) aiResponse.fastestRoute = {};
      aiResponse.fastestRoute.polyline = drivingRoute.coordinates;
      aiResponse.fastestRoute.distanceKm = drivingRoute.distanceKm;
      aiResponse.fastestRoute.time = `${Math.floor(drivingRoute.timeMinutes / 60)}h ${Math.round(drivingRoute.timeMinutes % 60)}m`;
      
      if (!aiResponse.scenicRoute) aiResponse.scenicRoute = {};
      aiResponse.scenicRoute.polyline = drivingRoute.coordinates; // Use same route for now

      return NextResponse.json({
        ...aiResponse,
        nextStage: 'COMPLETED'
      });
    }

    return NextResponse.json({ message: "Unknown stage." });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "An error occurred while processing your request." }, { status: 500 });
  }
}
