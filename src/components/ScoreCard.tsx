'use client';
import { KiScoreResult } from '@/types';

const FACTOR_LABELS: Record<string, string> = {
  water: 'Water Proximity',
  terrain: 'Terrain (Mountain Backing)',
  green: 'Green Space',
  airQuality: 'Air Quality',
  quiet: 'Quietness',
  geomagnetic: 'Geomagnetic Field',
};

const FACTOR_COLORS: Record<string, string> = {
  water: 'bg-blue-500',
  terrain: 'bg-amber-600',
  green: 'bg-green-500',
  airQuality: 'bg-teal-500',
  quiet: 'bg-purple-500',
  geomagnetic: 'bg-rose-400',
};

function scoreColor(score: number): string {
  if (score >= 70) return 'text-green-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
}

export default function ScoreCard({ result }: { result: KiScoreResult }) {
  const { kiScore, breakdown, explanation, missingFactors } = result;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 w-full max-w-sm">
      <div className="text-center mb-4">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Ki Index</div>
        <div className={`text-6xl font-bold ${scoreColor(kiScore)}`}>{kiScore}</div>
        <div className="text-sm text-gray-500 mt-1">out of 100</div>
      </div>

      <p className="text-sm text-gray-600 mb-4 leading-snug">{explanation}</p>

      <div className="space-y-2">
        {Object.entries(breakdown).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-xs text-gray-600 mb-0.5">
              <span>{FACTOR_LABELS[key] ?? key}</span>
              <span>{value !== null ? value : 'N/A'}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${FACTOR_COLORS[key] ?? 'bg-gray-400'} transition-all`}
                style={{ width: value !== null ? `${value}%` : '0%', opacity: value !== null ? 1 : 0.3 }}
              />
            </div>
          </div>
        ))}
      </div>

      {missingFactors.length > 0 && (
        <p className="text-xs text-amber-600 mt-3">
          Score is partial — unavailable: {missingFactors.join(', ')}.
        </p>
      )}

      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong>Ki Index</strong> — an Environmental Harmony Score inspired by traditional Korean geomancy (pungsu-jiri). Calculated from real environmental data (green space, water, terrain, air quality, noise). <em>This is not a literal measurement of a metaphysical energy field.</em>
        </p>
      </div>
    </div>
  );
}
