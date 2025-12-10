import fs from 'fs';
import path from 'path';
import * as turf from '@turf/turf';

const DATA_PATH = path.join(process.cwd(), 'Archeology_all_data.json');

export interface Place {
  id: number;
  name: string;
  type: string;
  description: string;
  coordinates: [number, number]; // [lat, lng]
  properties: any;
}

let cachedPlaces: Place[] | null = null;

export function getPlaces(): Place[] {
  if (cachedPlaces) return cachedPlaces;

  try {
    const fileContent = fs.readFileSync(DATA_PATH, 'utf-8');
    const data = JSON.parse(fileContent);
    
    cachedPlaces = data.features.map((f: any) => ({
      id: f.properties.FID,
      name: f.properties.Name_TXT,
      type: f.properties.Type_TXT,
      description: f.properties.Sub_type_T || f.properties.Type_TXT,
      // Fix: JSON has Lat/Long_ swapped or named confusingly. 
      // Lat ~ 105 (Longitude), Long_ ~ 41 (Latitude) for Mongolia.
      // We want [lat, lng] for Leaflet.
      coordinates: [f.properties.Long_, f.properties.Lat],
      properties: f.properties
    })).filter((p: Place) => p.coordinates[0] && p.coordinates[1]); // Filter invalid coords

    return cachedPlaces!;
  } catch (error) {
    console.error("Error loading places:", error);
    return [];
  }
}

export function findPlacesNearRoute(routePolyline: [number, number][], radiusKm: number = 3, preferences: string): Place[] {
  const allPlaces = getPlaces();
  const routeLine = turf.lineString(routePolyline.map(p => [p[1], p[0]])); // Turf uses [lng, lat]

  // Filter by distance
  const nearbyPlaces = allPlaces.filter(place => {
    const point = turf.point([place.coordinates[1], place.coordinates[0]]); // [lng, lat]
    const distance = turf.pointToLineDistance(point, routeLine, { units: 'kilometers' });
    return distance <= radiusKm;
  });

  // Filter by preferences (simple keyword match for now, can be enhanced with AI)
  if (!preferences) return nearbyPlaces;

  const lowerPref = preferences.toLowerCase();
  return nearbyPlaces.filter(place => {
    const text = `${place.name} ${place.type} ${place.description}`.toLowerCase();
    // Simple check: if any word in preference matches
    const keywords = lowerPref.split(' ').filter(k => k.length > 2);
    return keywords.some(k => text.includes(k));
  });
}
