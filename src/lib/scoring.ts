import { KiScoreBreakdown, Weights } from '@/types';

export const DEFAULT_WEIGHTS: Weights = {
  water: 0.25,
  terrain: 0.20,
  green: 0.20,
  airQuality: 0.15,
  quiet: 0.15,
  geomagnetic: 0.05,
};

export function computeKiScore(
  breakdown: KiScoreBreakdown,
  weights: Weights
): { score: number; missingFactors: string[]; explanation: string } {
  const entries = Object.entries(breakdown) as [keyof KiScoreBreakdown, number | null][];
  const missingFactors: string[] = [];
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [key, value] of entries) {
    if (value === null) {
      missingFactors.push(key);
    } else {
      const w = weights[key] ?? 0;
      weightedSum += value * w;
      totalWeight += w;
    }
  }

  const score = totalWeight > 0 ? Math.round(weightedSum / totalWeight * 100) / 1 : 0;

  const parts: string[] = [];
  if (breakdown.water !== null && breakdown.water >= 70) parts.push('strong water proximity');
  if (breakdown.green !== null && breakdown.green >= 70) parts.push('good green space');
  if (breakdown.quiet !== null && breakdown.quiet >= 70) parts.push('quiet surroundings');
  if (breakdown.terrain !== null && breakdown.terrain >= 70) parts.push('favorable terrain');
  if (breakdown.airQuality !== null && breakdown.airQuality >= 70) parts.push('clean air');
  const lowParts: string[] = [];
  if (breakdown.water !== null && breakdown.water < 40) lowParts.push('limited water nearby');
  if (breakdown.green !== null && breakdown.green < 40) lowParts.push('sparse green space');
  if (breakdown.quiet !== null && breakdown.quiet < 40) lowParts.push('noisy surroundings');
  if (breakdown.airQuality !== null && breakdown.airQuality < 40) lowParts.push('poor air quality');

  let explanation = '';
  if (parts.length > 0) explanation += `Strengths: ${parts.join(', ')}. `;
  if (lowParts.length > 0) explanation += `Challenges: ${lowParts.join(', ')}. `;
  if (missingFactors.length > 0) explanation += `Unavailable data: ${missingFactors.join(', ')}.`;
  if (!explanation) explanation = 'Balanced environmental profile across all factors.';

  return { score: Math.min(100, Math.max(0, Math.round(score))), missingFactors, explanation };
}
