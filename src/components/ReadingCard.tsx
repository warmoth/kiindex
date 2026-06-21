'use client';
import { KiReading } from '@/types';
import AuraCanvas from './AuraCanvas';
import { useRef } from 'react';

function scoreLabel(score: number): string {
  if (score >= 80) return 'Exceptional';
  if (score >= 65) return 'Strong';
  if (score >= 50) return 'Balanced';
  if (score >= 35) return 'Subtle';
  return 'Quiet';
}

export default function ReadingCard({ reading }: { reading: KiReading }) {
  const { kiScore, auraColor, auraName, flavorText } = reading;
  const cardRef = useRef<HTMLDivElement>(null);

  async function handleShare() {
    const { default: html2canvas } = await import('html2canvas');
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { backgroundColor: '#0f172a', scale: 2 });
    const link = document.createElement('a');
    link.download = `ki-aura-${reading.lat.toFixed(4)}-${reading.lng.toFixed(4)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={cardRef}
        className="bg-slate-900 rounded-2xl shadow-xl p-6 flex flex-col items-center gap-3 w-72"
        style={{ border: `1px solid ${auraColor}44` }}
      >
        <AuraCanvas color={auraColor} score={kiScore} />

        <div className="text-center">
          <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: auraColor }}>
            Ki Aura
          </div>
          <div className="text-4xl font-bold text-white">{kiScore}</div>
          <div className="text-sm mt-0.5" style={{ color: auraColor }}>{scoreLabel(kiScore)}</div>
        </div>

        <div className="text-center">
          <div className="text-base font-semibold text-white">{auraName}</div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{flavorText}</p>
        </div>

        <div className="text-xs text-slate-500 text-center leading-relaxed border-t border-slate-700 pt-3 mt-1">
          This is a generative novelty experience inspired by the Korean concept of ki and traditional geomancy (pungsu-jiri). Readings are produced by a deterministic pattern generator tied to your coordinates — not a real measurement of any physical or metaphysical energy.
        </div>
      </div>

      <button
        onClick={handleShare}
        className="text-xs px-4 py-2 rounded-full border text-slate-300 border-slate-600 hover:border-slate-400 transition"
      >
        Save as Image
      </button>
    </div>
  );
}
