'use client';
import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import ScoreCard from '@/components/ScoreCard';
import WeightSliders from '@/components/WeightSliders';
import { DEFAULT_WEIGHTS } from '@/lib/scoring';
import { KiScoreResult, Weights } from '@/types';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const [result, setResult] = useState<KiScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [showSliders, setShowSliders] = useState(false);

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setPin({ lat, lng });
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const wParam = encodeURIComponent(JSON.stringify(weights));
      const resp = await fetch(`/api/ki-score?lat=${lat}&lng=${lng}&weights=${wParam}`);
      if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
      const data = await resp.json();
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load score');
    } finally {
      setLoading(false);
    }
  }, [weights]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* Map */}
      <div className="flex-1 relative">
        <Map pin={pin} onMapClick={handleMapClick} />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow text-sm text-gray-600 pointer-events-none">
          Click anywhere on the map to get a Ki Index score
        </div>
      </div>

      {/* Side panel */}
      <div className="w-80 flex flex-col gap-3 p-4 overflow-y-auto">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800">Ki Index</h1>
          <p className="text-xs text-gray-500">Environmental Harmony Score</p>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="animate-spin text-3xl mb-2">&#9775;</div>
            <p className="text-sm text-gray-500">Reading environmental data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {result && !loading && <ScoreCard result={result} />}

        {!result && !loading && !error && (
          <div className="bg-white rounded-2xl shadow-lg p-5 text-center text-sm text-gray-400">
            <div className="text-4xl mb-2">&#128506;</div>
            Click the map to score a location
          </div>
        )}

        <button
          onClick={() => setShowSliders(s => !s)}
          className="text-xs text-indigo-600 underline self-center"
        >
          {showSliders ? 'Hide' : 'Adjust'} factor weights
        </button>

        {showSliders && (
          <WeightSliders weights={weights} onChange={setWeights} />
        )}

        {pin && (
          <p className="text-xs text-center text-gray-400">
            {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
          </p>
        )}
      </div>
    </div>
  );
}
