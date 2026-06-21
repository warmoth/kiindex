'use client';
import { useState } from 'react';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export default function AddressSearch({ onResult }: { onResult: (lat: number, lng: number) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=4`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data: NominatimResult[] = await resp.json();
      setResults(data);
    } finally {
      setLoading(false);
    }
  }

  function pick(r: NominatimResult) {
    setResults([]);
    setQuery(r.display_name.split(',')[0]);
    onResult(parseFloat(r.lat), parseFloat(r.lon));
  }

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <input
          className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:border-slate-400 placeholder-slate-500"
          placeholder="Search address or place…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
        />
        <button
          onClick={search}
          className="bg-slate-700 text-white text-sm px-3 py-2 rounded-lg hover:bg-slate-600 transition"
        >
          {loading ? '…' : 'Go'}
        </button>
      </div>
      {results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-slate-800 border border-slate-600 rounded-lg z-50 shadow-lg">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => pick(r)}
              className="w-full text-left text-xs text-slate-300 px-3 py-2 hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg truncate"
            >
              {r.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
