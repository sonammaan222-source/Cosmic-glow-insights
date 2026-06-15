import { useEffect, useRef } from "react";

/**
 * Animated canvas starfield with twinkle + slow parallax drift.
 * Sits behind page content with pointer-events disabled.
 */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    type Star = { x: number; y: number; r: number; a: number; s: number; tw: number };
    let stars: Star[] = [];
    let shootingStars: { x: number; y: number; vx: number; vy: number; life: number }[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const density = Math.floor((w * h) / 6000);
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random() * 0.8 + 0.2,
        s: Math.random() * 0.02 + 0.005,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const spawnShootingStar = () => {
      const fromLeft = Math.random() > 0.5;
      shootingStars.push({
        x: fromLeft ? -50 : w + 50,
        y: Math.random() * h * 0.6,
        vx: fromLeft ? 6 + Math.random() * 4 : -(6 + Math.random() * 4),
        vy: 2 + Math.random() * 2,
        life: 1,
      });
    };

    let lastShoot = 0;
    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // stars
      for (const s of stars) {
        s.tw += s.s;
        const alpha = s.a * (0.5 + 0.5 * Math.sin(s.tw));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 200, ${alpha})`;
        ctx.shadowColor = "rgba(212, 175, 55, 0.6)";
        ctx.shadowBlur = s.r * 4;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // shooting stars
      if (t - lastShoot > 4500 + Math.random() * 4000) {
        spawnShootingStar();
        lastShoot = t;
      }
      shootingStars = shootingStars.filter((ss) => {
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= 0.012;
        if (ss.life <= 0) return false;
        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        grad.addColorStop(0, `rgba(255, 235, 180, ${ss.life})`);
        grad.addColorStop(1, "rgba(255, 235, 180, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        ctx.stroke();
        return true;
      });

      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
