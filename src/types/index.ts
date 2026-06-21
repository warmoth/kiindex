export interface KiReading {
  lat: number;
  lng: number;
  kiScore: number;
  auraColor: string;
  auraName: string;
  flavorText: string;
  mode: 'permanent' | 'today';
}
