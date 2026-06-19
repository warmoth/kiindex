export async function getAirQualityScore(lat: number, lng: number): Promise<number> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) throw new Error('OPENWEATHER_API_KEY not set');
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${key}`;
  const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!resp.ok) throw new Error(`OpenWeatherMap AQ: ${resp.status}`);
  const data = await resp.json();
  const aqi: number = data.list?.[0]?.main?.aqi ?? 3;
  // AQI 1 (good) → 100, AQI 5 (very poor) → 0
  return Math.round(((5 - aqi) / 4) * 100);
}
