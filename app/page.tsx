'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Navigation, MapPin, Globe, CheckCircle, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WorldMap = dynamic(() => import('@/components/WorldMap'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl"></div>
});

export default function Dashboard() {
  const [visited, setVisited] = useState<string[]>(['Mongolia', 'Japan']);
  const [wannaVisit, setWannaVisit] = useState<string[]>(['France', 'Italy', 'United States of America']);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country);
  };

  const toggleStatus = (status: 'visited' | 'wanna') => {
    if (!selectedCountry) return;

    if (status === 'visited') {
      if (visited.includes(selectedCountry)) {
        setVisited(visited.filter(c => c !== selectedCountry));
      } else {
        setVisited([...visited, selectedCountry]);
        setWannaVisit(wannaVisit.filter(c => c !== selectedCountry));
      }
    } else {
      if (wannaVisit.includes(selectedCountry)) {
        setWannaVisit(wannaVisit.filter(c => c !== selectedCountry));
      } else {
        setWannaVisit([...wannaVisit, selectedCountry]);
        setVisited(visited.filter(c => c !== selectedCountry));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Traveler!</h1>
            <p className="text-gray-600">Track your adventures and plan your next journey.</p>
          </div>
          <Link href="/planner">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Plan New Trip
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Countries Visited</p>
              <p className="text-2xl font-bold text-gray-900">{visited.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
              <Bookmark className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Bucket List</p>
              <p className="text-2xl font-bold text-gray-900">{wannaVisit.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">World Coverage</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round((visited.length / 195) * 100)}%</p>
            </div>
          </div>
        </div>

        {/* Interactive World Map */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[500px] relative overflow-hidden">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            Your Travel Map
          </h2>
          <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-100">
            <WorldMap 
              visitedCountries={visited} 
              wannaVisitCountries={wannaVisit} 
              onCountryClick={handleCountryClick} 
            />
          </div>

          {/* Country Selection Modal/Overlay */}
          {selectedCountry && (
            <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-200 z-[1000] animate-in slide-in-from-bottom-4">
              <h3 className="font-bold text-lg mb-2">{selectedCountry}</h3>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={visited.includes(selectedCountry) ? "default" : "outline"}
                  className={visited.includes(selectedCountry) ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => toggleStatus('visited')}
                >
                  Visited
                </Button>
                <Button 
                  size="sm" 
                  variant={wannaVisit.includes(selectedCountry) ? "default" : "outline"}
                  className={wannaVisit.includes(selectedCountry) ? "bg-orange-500 hover:bg-orange-600" : ""}
                  onClick={() => toggleStatus('wanna')}
                >
                  Wanna Visit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedCountry(null)}>Close</Button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Trips Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
              <div className="h-32 bg-gray-100 rounded-xl mb-4 relative overflow-hidden">
                {/* Placeholder for trip image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                  <span className="text-white font-bold">Khuvsgul Lake</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>
                <span className="text-xs text-gray-400">Oct 2023</span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">5 days trip exploring the Blue Pearl of Mongolia. Nature, hiking, and relaxation.</p>
            </div>
            
            {/* Add more trip cards here */}
          </div>
        </div>

      </div>
    </div>
  );
}
