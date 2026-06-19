export interface KiScoreBreakdown {
  water: number | null;
  terrain: number | null;
  green: number | null;
  airQuality: number | null;
  quiet: number | null;
  geomagnetic: number | null;
}

export interface KiScoreResult {
  lat: number;
  lng: number;
  kiScore: number;
  breakdown: KiScoreBreakdown;
  explanation: string;
  weights: Weights;
  missingFactors: string[];
}

export interface Weights {
  water: number;
  terrain: number;
  green: number;
  airQuality: number;
  quiet: number;
  geomagnetic: number;
}
