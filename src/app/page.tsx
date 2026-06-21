'use client';
import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import ReadingCard from '@/components/ReadingCard';
import AddressSearch from '@/components/AddressSearch';
import { generateReading } from '@/lib/reading';
import { KiReading } from '@/types';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const [reading, setReading] = useState<KiReading | null>(null);
  const [mode, setMode] = useState<'permanent' | 'today'>('permanent');

  const handleLocation = useCallback((lat: number, lng: number) => {
    setPin({ lat, lng });
    setReading(generateReading(lat, lng, mode));
  }, [mode]);

  function toggleMode() {
    const next = mode === 'permanent' ? 'today' : 'permanent';
    setMode(next);
    if (pin) setReading(generateReading(pin.lat, pin.lng, next));
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Map */}
      <div className="flex-1 relative">
        <Map pin={pin} onMapClick={handleLocation} />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full shadow text-sm text-slate-300 pointer-events-none z-10">
          Click anywhere to receive your Ki reading
        </div>
      </div>

      {/* Side panel */}
      <div className="w-80 bg-slate-950 flex flex-col gap-4 p-4 overflow-y-auto border-l border-slate-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">기 Ki Aura</h1>
          <p className="text-xs text-slate-500 mt-0.5">Location Reading Generator</p>
        </div>

        <AddressSearch onResult={handleLocation} />

        <button
          onClick={toggleMode}
          className="text-xs text-center text-slate-400 hover:text-slate-200 transition"
        >
          Mode: <span className="text-slate-200 font-medium">
            {mode === 'permanent' ? "Permanent (location-fixed)" : "Today's Reading (date-shifted)"}
          </span>
          {' '}— tap to switch
        </button>

        {reading ? (
          <ReadingCard reading={reading} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 text-sm gap-2">
            <span className="text-4xl">☯</span>
            <span>Click the map or search a place</span>
          </div>
        )}

        {pin && (
          <p className="text-xs text-center text-slate-700">
            {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
          </p>
        )}
      </div>
    </div>
  );
}
