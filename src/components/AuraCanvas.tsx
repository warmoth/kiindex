'use client';
import { useEffect, useRef } from 'react';

export default function AuraCanvas({ color, score }: { color: string; score: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    // Parse hex color to rgb
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Particles
    const NUM_PARTICLES = Math.round(30 + score * 0.7);
    const particles = Array.from({ length: NUM_PARTICLES }, (_, i) => ({
      angle: (i / NUM_PARTICLES) * Math.PI * 2,
      radius: 20 + Math.random() * 60,
      speed: 0.003 + Math.random() * 0.004,
      size: 1.5 + Math.random() * 3,
      alpha: 0.4 + Math.random() * 0.6,
      drift: (Math.random() - 0.5) * 0.002,
    }));

    let frame = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Radial glow background
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.45);
      glow.addColorStop(0, `rgba(${r},${g},${b},0.35)`);
      glow.addColorStop(0.5, `rgba(${r},${g},${b},0.12)`);
      glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Pulsing ring
      const pulse = 0.85 + 0.15 * Math.sin(frame * 0.025);
      ctx.beginPath();
      ctx.arc(cx, cy, W * 0.32 * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.25)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Particles
      for (const p of particles) {
        p.angle += p.speed + p.drift;
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
        ctx.fill();
      }

      frame++;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [color, score]);

  return <canvas ref={canvasRef} width={220} height={220} className="rounded-full" />;
}
