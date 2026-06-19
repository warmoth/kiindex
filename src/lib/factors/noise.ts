export async function getNoiseScore(lat: number, lng: number): Promise<number> {
  const radius = 500;
  const query = `
    [out:json][timeout:10];
    (
      way["highway"="motorway"](around:${radius},${lat},${lng});
      way["highway"="trunk"](around:${radius},${lat},${lng});
      way["highway"="primary"](around:${radius},${lat},${lng});
    );
    out body;
  `;
  const url = 'https://overpass-api.de/api/interpreter';
  const resp = await fetch(url, {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' },
    signal: AbortSignal.timeout(12000),
  });
  if (!resp.ok) throw new Error(`Overpass noise: ${resp.status}`);
  const data = await resp.json();
  const count = data.elements?.length ?? 0;
  // More major roads = noisier = lower score
  if (count === 0) return 90;
  return Math.max(0, Math.round(90 - count * 15));
}
