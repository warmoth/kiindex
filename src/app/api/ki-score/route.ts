import { NextRequest, NextResponse } from 'next/server';
import { getGreenScore } from '@/lib/factors/greenSpace';
import { getWaterScore } from '@/lib/factors/water';
import { getTerrainScore } from '@/lib/factors/terrain';
import { getAirQualityScore } from '@/lib/factors/airQuality';
import { getNoiseScore } from '@/lib/factors/noise';
import { getGeomagneticScore } from '@/lib/factors/geomagnetic';
import { computeKiScore, DEFAULT_WEIGHTS } from '@/lib/scoring';
import { getCache, setCache, cacheKey } from '@/lib/cache';
import { KiScoreBreakdown, KiScoreResult, Weights } from '@/types';

async function safeCall(fn: () => Promise<number>, name: string): Promise<number | null> {
  try {
    return await fn();
  } catch (e) {
    console.error(`Factor ${name} failed:`, e);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') ?? '');
  const lng = parseFloat(searchParams.get('lng') ?? '');
  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Invalid lat/lng' }, { status: 400 });
  }

  // Parse optional weight overrides
  const weights: Weights = { ...DEFAULT_WEIGHTS };
  const wParam = searchParams.get('weights');
  if (wParam) {
    try {
      Object.assign(weights, JSON.parse(wParam));
    } catch {
      // ignore invalid weights
    }
  }

  const key = cacheKey(lat, lng);
  const cached = getCache<KiScoreResult>(key);
  if (cached) return NextResponse.json({ ...cached, weights, cached: true });

  const [green, water, terrain, airQuality, quiet, geomagnetic] = await Promise.all([
    safeCall(() => getGreenScore(lat, lng), 'green'),
    safeCall(() => getWaterScore(lat, lng), 'water'),
    safeCall(() => getTerrainScore(lat, lng), 'terrain'),
    safeCall(() => getAirQualityScore(lat, lng), 'airQuality'),
    safeCall(() => getNoiseScore(lat, lng), 'noise'),
    safeCall(() => getGeomagneticScore(lat, lng), 'geomagnetic'),
  ]);

  const breakdown: KiScoreBreakdown = { water, terrain, green, airQuality, quiet, geomagnetic };
  const { score, missingFactors, explanation } = computeKiScore(breakdown, weights);

  const result: KiScoreResult = {
    lat, lng, kiScore: score, breakdown, explanation, weights, missingFactors,
  };

  setCache(key, result);
  return NextResponse.json(result);
}
