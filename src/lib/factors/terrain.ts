function offsetLatLng(lat: number, lng: number, bearingDeg: number, distanceM: number) {
  const R = 6371000;
  const brng = (bearingDeg * Math.PI) / 180;
  const lat1 = (lat * Math.PI) / 180;
  const lng1 = (lng * Math.PI) / 180;
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distanceM / R) +
    Math.cos(lat1) * Math.sin(distanceM / R) * Math.cos(brng)
  );
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(distanceM / R) * Math.cos(lat1),
      Math.cos(distanceM / R) - Math.sin(lat1) * Math.sin(lat2)
    );
  return { lat: (lat2 * 180) / Math.PI, lng: (lng2 * 180) / Math.PI };
}

export async function getTerrainScore(lat: number, lng: number): Promise<number> {
  const distance = 300;
  const bearings = [0, 45, 90, 135, 180, 225, 270, 315];
  const points = [
    { latitude: lat, longitude: lng },
    ...bearings.map(b => {
      const p = offsetLatLng(lat, lng, b, distance);
      return { latitude: p.lat, longitude: p.lng };
    }),
  ];

  const resp = await fetch('https://api.open-elevation.com/api/v1/lookup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locations: points }),
    signal: AbortSignal.timeout(15000),
  });
  if (!resp.ok) throw new Error(`Open-Elevation: ${resp.status}`);
  const data = await resp.json();
  const elevations: number[] = data.results.map((r: { elevation: number }) => r.elevation);

  // bearings: 0=N(index 1), 180=S(index 5)
  const north = elevations[1];
  const south = elevations[5];
  const northSouthDiff = north - south; // positive = mountain backing to north

  // Range: -50m to +50m maps to 0-100
  const score = Math.min(100, Math.max(0, Math.round(((northSouthDiff + 50) / 100) * 100)));
  return score;
}
