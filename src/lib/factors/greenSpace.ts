export async function getGreenScore(lat: number, lng: number): Promise<number> {
  const radius = 500;
  const query = `
    [out:json][timeout:10];
    (
      way["leisure"="park"](around:${radius},${lat},${lng});
      way["natural"="wood"](around:${radius},${lat},${lng});
      way["landuse"="forest"](around:${radius},${lat},${lng});
      relation["leisure"="park"](around:${radius},${lat},${lng});
    );
    out body;
    >;
    out skel qt;
  `;
  const url = 'https://overpass-api.de/api/interpreter';
  const resp = await fetch(url, {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' },
    signal: AbortSignal.timeout(12000),
  });
  if (!resp.ok) throw new Error(`Overpass green: ${resp.status}`);
  const data = await resp.json();
  const count = data.elements?.length ?? 0;
  // Simple scoring: more elements = greener. Cap at 20 for score 100.
  return Math.min(100, Math.round((count / 20) * 100));
}
