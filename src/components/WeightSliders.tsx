'use client';
import { Weights } from '@/types';

const LABELS: Record<keyof Weights, string> = {
  water: 'Water',
  terrain: 'Terrain',
  green: 'Green Space',
  airQuality: 'Air Quality',
  quiet: 'Quietness',
  geomagnetic: 'Geomagnetic',
};

export default function WeightSliders({
  weights,
  onChange,
}: {
  weights: Weights;
  onChange: (w: Weights) => void;
}) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);

  function update(key: keyof Weights, val: number) {
    onChange({ ...weights, [key]: val });
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-sm">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Adjust Weights
      </div>
      <div className="space-y-3">
        {(Object.keys(weights) as (keyof Weights)[]).map(key => (
          <div key={key}>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{LABELS[key]}</span>
              <span>{Math.round(weights[key] * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={weights[key]}
              onChange={e => update(key, parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">Total weight: {Math.round(total * 100)}% (unnormalized OK)</p>
    </div>
  );
}
