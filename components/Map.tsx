'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = (color: string) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  startPoint: [number, number] | null;
  endPoint: [number, number] | null;
  routePolyline: [number, number][] | null;
  recommendedPlaces: any[];
  userPins: any[];
  onMapClick: (coords: [number, number]) => void;
  onPinTypeChange: (id: string, type: 'visited' | 'wanna_visit') => void;
}

function MapEvents({ onClick }: { onClick: (coords: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function Map({ 
  startPoint, 
  endPoint, 
  routePolyline, 
  recommendedPlaces, 
  userPins,
  onMapClick,
  onPinTypeChange
}: MapProps) {
  
  return (
    <MapContainer center={[47.9188, 106.9176]} zoom={6} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onClick={onMapClick} />

      {startPoint && (
        <Marker position={startPoint} icon={customIcon('green')}>
          <Popup>Start Point</Popup>
        </Marker>
      )}

      {endPoint && (
        <Marker position={endPoint} icon={customIcon('red')}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {routePolyline && (
        <Polyline 
          positions={routePolyline} 
          color="#3b82f6" 
          weight={6} 
          opacity={0.8} 
          lineCap="round"
          lineJoin="round"
        />
      )}

      {recommendedPlaces.map((place, idx) => (
        <Marker key={`rec-${idx}`} position={place.coordinates} icon={customIcon('violet')}>
          <Popup>
            <strong>{place.name}</strong><br/>
            {place.description}<br/>
            <em>{place.matchReason}</em>
          </Popup>
        </Marker>
      ))}

      {userPins.map((pin, idx) => (
        <Marker key={`user-${idx}`} position={pin.coordinates} icon={customIcon(pin.type === 'visited' ? 'green' : 'orange')}>
          <Popup>
            <div className="flex flex-col gap-2">
              <span>Custom Pin</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => onPinTypeChange(pin.id, 'visited')}
                  className="px-2 py-1 bg-green-500 text-white text-xs rounded"
                >
                  Visited
                </button>
                <button 
                  onClick={() => onPinTypeChange(pin.id, 'wanna_visit')}
                  className="px-2 py-1 bg-orange-500 text-white text-xs rounded"
                >
                  Wanna Visit
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
