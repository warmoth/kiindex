import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ki Index — Environmental Harmony Score',
  description: 'A map-based environmental harmony score inspired by Korean pungsu-jiri geomancy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
