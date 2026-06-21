import { sampleLocation } from './noise';
import { KiReading } from '@/types';

// 20 flavor entries: { minScore, maxScore, hueRange: [min,max], name, text }
const FLAVOR_BANK = [
  { minScore: 85, name: 'Radiant Summit', hues: [30, 50], text: 'A rare convergence of energy crowns this place — vibrant, elevating, impossible to ignore.' },
  { minScore: 75, name: 'Golden Current', hues: [45, 65], text: 'Warmth flows steadily here, like sunlight held in stone. A place that lifts the spirit without effort.' },
  { minScore: 65, name: 'Calm Azure', hues: [195, 220], text: 'A steady, contemplative energy lingers here — the kind of place that rewards slowing down.' },
  { minScore: 60, name: 'Jade Stillness', hues: [130, 160], text: 'Something patient and rooted dwells in this spot. Growth happens quietly, beneath the surface.' },
  { minScore: 55, name: 'Silver Dusk', hues: [220, 250], text: 'Neither urgent nor dormant — a place of gentle transition, good for reflection and soft decisions.' },
  { minScore: 50, name: 'Rose Whisper', hues: [330, 355], text: 'A tender, receptive quality here. Things begun in this spot tend to unfold at their own pace.' },
  { minScore: 45, name: 'Amber Drift', hues: [25, 45], text: 'Unhurried and warm, this location carries an energy suited to patience and long thoughts.' },
  { minScore: 40, name: 'Violet Depth', hues: [270, 300], text: 'An introspective current runs through here — vivid below the surface, subtle above it.' },
  { minScore: 35, name: 'Teal Crossing', hues: [165, 190], text: 'A crossing point. Energy moves through rather than settles — good for journeys and decisions.' },
  { minScore: 0,  name: 'Pearl Quiet',  hues: [200, 230], text: 'Softly neutral, this place holds space without imposing. A blank canvas for whatever you bring.' },
];

const AURA_NAMES_BY_HUE: [number, string][] = [
  [0, 'Crimson'], [20, 'Amber'], [40, 'Gold'], [60, 'Citrine'], [80, 'Lime'],
  [100, 'Emerald'], [140, 'Jade'], [165, 'Teal'], [190, 'Azure'], [220, 'Sapphire'],
  [250, 'Violet'], [280, 'Amethyst'], [310, 'Fuchsia'], [340, 'Rose'], [360, 'Crimson'],
];

function hueToName(hue: number): string {
  let best = AURA_NAMES_BY_HUE[0][1];
  let bestDist = 360;
  for (const [h, name] of AURA_NAMES_BY_HUE) {
    const dist = Math.abs(hue - h);
    if (dist < bestDist) { bestDist = dist; best = name; }
  }
  return best;
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

export function generateReading(lat: number, lng: number, mode: 'permanent' | 'today'): KiReading {
  const dateSalt = mode === 'today'
    ? Math.floor(Date.now() / (1000 * 60 * 60 * 24)) // changes each day
    : 0;

  const { scoreSeed, colorSeed } = sampleLocation(lat, lng, dateSalt);

  const kiScore = Math.round(scoreSeed * 100);

  // Pick flavor entry
  const flavor = FLAVOR_BANK.find(f => kiScore >= f.minScore) ?? FLAVOR_BANK[FLAVOR_BANK.length - 1];

  // Map colorSeed to hue within the flavor's hue range
  const [hMin, hMax] = flavor.hues;
  const hue = Math.round(hMin + colorSeed * (hMax - hMin));
  const auraColor = hslToHex(hue, 70, 60);
  const auraName = `${hueToName(hue)} ${flavor.name.split(' ')[1] ?? flavor.name}`;

  return {
    lat, lng, kiScore,
    auraColor,
    auraName,
    flavorText: flavor.text,
    mode,
  };
}
