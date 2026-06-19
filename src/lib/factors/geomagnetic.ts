export async function getGeomagneticScore(lat: number, lng: number): Promise<number> {
  const url = `https://www.ngdc.noaa.gov/geomag-web/calculators/calculateIgrfwmm?lat1=${lat}&lon1=${lng}&model=WMM&startYear=2025.0&resultFormat=json`;
  const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!resp.ok) throw new Error(`NOAA Geomag: ${resp.status}`);
  const data = await resp.json();
  const f: number = data.result?.[0]?.totalintensity ?? 50000;
  // Normalize 25000–65000 nT to 0–100
  return Math.min(100, Math.max(0, Math.round(((f - 25000) / 40000) * 100)));
}
