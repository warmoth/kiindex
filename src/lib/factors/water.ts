export async function getWaterScore(lat: number, lng: number): Promise<number> {
  const radius = 1000;
  const query = `
    [out:json][timeout:10];
    (
      way["natural"="water"](around:${radius},${lat},${lng});
      way["waterway"="river"](around:${radius},${lat},${lng});
      way["waterway"="stream"](around:${radius},${lat},${lng});
      way["natural"="coastline"](around:${radius},${lat},${lng});
      relation["natural"="water"](around:${radius},${lat},${lng});
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
  if (!resp.ok) throw new Error(`Overpass water: ${resp.status}`);
  const data = await resp.json();
  const count = data.elements?.length ?? 0;
  return Math.min(100, Math.round((count / 15) * 100));
}
