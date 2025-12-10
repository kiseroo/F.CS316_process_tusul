'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface WorldMapProps {
  visitedCountries: string[];
  wannaVisitCountries: string[];
  onCountryClick: (countryName: string) => void;
}

export default function WorldMap({ visitedCountries, wannaVisitCountries, onCountryClick }: WorldMapProps) {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    // Fetch a low-res world GeoJSON
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
      .then(res => res.json())
      .then(data => setGeoJsonData(data))
      .catch(err => console.error("Error loading map data", err));
  }, []);

  const style = (feature: any) => {
    const countryName = feature.properties.name;
    let fillColor = '#e5e7eb'; // default gray
    let color = '#9ca3af'; // border

    if (visitedCountries.includes(countryName)) {
      fillColor = '#22c55e'; // green-500
      color = '#16a34a';
    } else if (wannaVisitCountries.includes(countryName)) {
      fillColor = '#f97316'; // orange-500
      color = '#ea580c';
    }

    return {
      fillColor,
      weight: 1,
      opacity: 1,
      color,
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const countryName = feature.properties.name;
    
    layer.on({
      click: () => onCountryClick(countryName),
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.9
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        // Reset style (simplified, ideally should use geojson.resetStyle)
        layer.setStyle(style(feature));
      }
    });
    
    layer.bindTooltip(countryName, { sticky: true });
  };

  if (!geoJsonData) return <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-xl">Loading World Map...</div>;

  return (
    <MapContainer 
      center={[20, 0]} 
      zoom={2} 
      style={{ height: '100%', width: '100%', background: 'transparent' }}
      scrollWheelZoom={false}
      minZoom={2}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <GeoJSON 
        data={geoJsonData} 
        style={style} 
        onEachFeature={onEachFeature} 
      />
    </MapContainer>
  );
}
