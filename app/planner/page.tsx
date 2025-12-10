'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, MapPin, Navigation } from 'lucide-react';
import Link from 'next/link';

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-100">Loading Map...</div>
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UserPin {
  id: string;
  coordinates: [number, number];
  type: 'visited' | 'wanna_visit';
}

export default function Planner() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [stage, setStage] = useState<'INITIAL' | 'WAITING_FOR_PINS' | 'WAITING_FOR_INFO' | 'COMPLETED'>('INITIAL');
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
  const [endPoint, setEndPoint] = useState<[number, number] | null>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [userPins, setUserPins] = useState<UserPin[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    handleApiCall('INITIAL');
  }, []);

  const handleApiCall = async (currentStage: string, payload: any = {}) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: currentStage,
          userInputs: payload,
          messages
        })
      });
      const data = await res.json();
      
      if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }
      
      if (data.explanation) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.explanation }]);
      }

      if (data.nextStage) {
        setStage(data.nextStage);
      }

      if (data.fastestRoute) {
        setRouteData(data);
      }

    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, something went wrong." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const newMsg = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    if (stage === 'WAITING_FOR_INFO') {
      handleApiCall('WAITING_FOR_INFO', {
        start: startPoint,
        end: endPoint,
        lastUserMessage: input
      });
    } else {
      // General chat fallback or other stages
    }
  };

  const handleMapClick = (coords: [number, number]) => {
    if (stage === 'WAITING_FOR_PINS') {
      if (!startPoint) {
        setStartPoint(coords);
        setMessages(prev => [...prev, { role: 'assistant', content: "Start point set. Now select destination." }]);
      } else if (!endPoint) {
        setEndPoint(coords);
        setMessages(prev => [...prev, { role: 'assistant', content: "Destination set. Calculating..." }]);
        // Trigger next step
        handleApiCall('WAITING_FOR_PINS', { start: startPoint, end: coords });
      }
    } else {
      // Add user pin
      const newPin: UserPin = {
        id: Date.now().toString(),
        coordinates: coords,
        type: 'wanna_visit' // Default
      };
      setUserPins(prev => [...prev, newPin]);
    }
  };

  const handlePinTypeChange = (id: string, type: 'visited' | 'wanna_visit') => {
    setUserPins(prev => prev.map(p => p.id === id ? { ...p, type } : p));
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-gray-50">
      {/* Left Sidebar - Chat */}
      <div className="w-1/3 min-w-[350px] flex flex-col border-r bg-white shadow-lg z-10">
        <div className="p-4 border-b bg-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-6 w-6" />
            <div>
              <h1 className="text-lg font-bold leading-tight">AI Planner</h1>
              <p className="text-xs opacity-80">New Trip</p>
            </div>
          </div>
          <Link href="/">
            <Button 
              variant="destructive" 
              size="sm" 
              className="h-8 px-3 text-xs"
            >
              Exit Plan
            </Button>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}>
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <Textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[50px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || stage === 'WAITING_FOR_PINS'} className="h-auto">
              <Send className="h-5 w-5" />
            </Button>
          </div>
          {stage === 'WAITING_FOR_PINS' && (
            <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Please interact with the map to set locations.
            </p>
          )}
        </div>
      </div>

      {/* Right Area - Map */}
      <div className="flex-1 relative">
        <Map 
          startPoint={startPoint}
          endPoint={endPoint}
          routePolyline={routeData?.fastestRoute?.polyline}
          recommendedPlaces={routeData?.scenicRoute?.recommendedPlaces || []}
          userPins={userPins}
          onMapClick={handleMapClick}
          onPinTypeChange={handlePinTypeChange}
        />
        
        {/* Top Center Stats Overlay */}
        {routeData?.fastestRoute && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md px-8 py-3 rounded-full shadow-xl z-[1000] flex items-center gap-8 border border-gray-200/50">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Distance</span>
              <span className="text-2xl font-bold text-blue-600 tabular-nums">{routeData.fastestRoute.distanceKm.toFixed(1)} <span className="text-sm font-normal text-gray-400">km</span></span>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Est. Time</span>
              <span className="text-2xl font-bold text-gray-800 tabular-nums">{routeData.fastestRoute.time}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
