function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashCoords(lat: number, lng: number, salt: number = 0): number {
  // Round to 4 decimal places (~11m precision)
  const la = Math.round(lat * 10000);
  const lo = Math.round(lng * 10000);
  let h = 2166136261;
  const bytes = [la & 0xff, (la >> 8) & 0xff, (la >> 16) & 0xff, (la >> 24) & 0xff,
                 lo & 0xff, (lo >> 8) & 0xff, (lo >> 16) & 0xff, (lo >> 24) & 0xff,
                 salt & 0xff, (salt >> 8) & 0xff];
  for (const b of bytes) {
    h ^= b;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function valueNoise2D(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  // Smoothstep
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  function rand(cx: number, cy: number): number {
    return mulberry32(hashCoords(cx, cy, seed))();
  }

  const a = rand(ix, iy);
  const b = rand(ix + 1, iy);
  const c = rand(ix, iy + 1);
  const d = rand(ix + 1, iy + 1);

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

export interface NoiseResult {
  scoreSeed: number; // 0–1
  colorSeed: number; // 0–1
}

export function sampleLocation(lat: number, lng: number, dateSalt: number = 0): NoiseResult {
  const seed1 = hashCoords(lat, lng, dateSalt);
  const seed2 = hashCoords(lat, lng, dateSalt + 9999);

  // Layer 3 octaves for texture
  const scale = 0.3;
  let s1 = 0, s2 = 0, amp = 1, total = 0;
  for (let o = 0; o < 3; o++) {
    const freq = Math.pow(2, o);
    s1 += amp * valueNoise2D(lat * scale * freq, lng * scale * freq, seed1);
    s2 += amp * valueNoise2D(lat * scale * freq + 100, lng * scale * freq + 100, seed2);
    total += amp;
    amp *= 0.5;
  }

  return {
    scoreSeed: Math.max(0, Math.min(1, s1 / total)),
    colorSeed: Math.max(0, Math.min(1, s2 / total)),
  };
}
