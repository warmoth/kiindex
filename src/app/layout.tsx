import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ki Aura — Location Reading Generator',
  description: 'A generative novelty experience inspired by Korean ki and pungsu-jiri geomancy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">{children}</body>
    </html>
  );
}
