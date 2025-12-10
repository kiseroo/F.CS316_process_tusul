export interface RouteResult {
  distanceKm: number;
  timeMinutes: number;
  coordinates: [number, number][]; // [lat, lng]
}

export async function getDrivingRoute(start: [number, number], end: [number, number]): Promise<RouteResult | null> {
  try {
    // OSRM expects lng,lat
    const url = `http://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.routes || data.routes.length === 0) {
      return null;
    }

    const route = data.routes[0];
    // OSRM returns [lng, lat], convert to [lat, lng]
    const coordinates = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);

    return {
      distanceKm: route.distance / 1000,
      timeMinutes: route.duration / 60,
      coordinates: coordinates
    };
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
}
