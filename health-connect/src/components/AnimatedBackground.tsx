"use client";

import { useEffect, useRef } from "react";

interface MedicalSymbol {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  type: "cross" | "heartbeat" | "circle" | "dna" | "pill";
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const symbols = useRef<MedicalSymbol[]>([]);
  const particles = useRef<Particle[]>([]);
  const rafId = useRef<number>(0);
  const mouse = useRef({ x: -500, y: -500 });
  const time = useRef(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const symbolTypes: MedicalSymbol["type"][] = ["cross", "heartbeat", "circle", "dna", "pill"];

    const createElements = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      const symbolCount = Math.min(Math.floor((w * h) / 60000), 18);
      symbols.current = [];
      for (let i = 0; i < symbolCount; i++) {
        symbols.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 18 + 14,
          opacity: Math.random() * 0.15 + 0.06,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.008,
          type: symbolTypes[Math.floor(Math.random() * symbolTypes.length)],
          hue: Math.random() > 0.5 ? 174 : Math.random() > 0.5 ? 199 : 272,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.008,
        });
      }

      const particleCount = Math.min(Math.floor((w * h) / 14000), 80);
      particles.current = [];
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2.5 + 0.8,
          opacity: Math.random() * 0.5 + 0.15,
          hue: Math.random() > 0.5 ? 174 : Math.random() > 0.5 ? 199 : 272,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.008,
        });
      }
    };

    const drawCross = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      const arm = size * 0.35;
      const half = size * 0.5;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x - arm, y - half, arm * 2, size, 3);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x - half, y - arm, size, arm * 2, 3);
      ctx.fill();
    };

    const drawHeartbeat = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, t: number) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      const w = size * 2;
      const segX = w / 12;
      const offset = (t * 30) % w;
      ctx.moveTo(x - w / 2, y);
      ctx.lineTo(x - w / 2 + segX * 3, y);
      ctx.lineTo(x - w / 2 + segX * 4, y - size * 0.6);
      ctx.lineTo(x - w / 2 + segX * 5, y + size * 0.8);
      ctx.lineTo(x - w / 2 + segX * 6, y - size * 0.3);
      ctx.lineTo(x - w / 2 + segX * 7, y);
      ctx.lineTo(x + w / 2, y);
      ctx.stroke();
    };

    const drawDna = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, t: number) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i < 20; i++) {
        const progress = i / 19;
        const py = y - size + progress * size * 2;
        const wave = Math.sin(progress * Math.PI * 3 + t * 2) * size * 0.4;
        if (i === 0) ctx.moveTo(x + wave, py);
        else ctx.lineTo(x + wave, py);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i < 20; i++) {
        const progress = i / 19;
        const py = y - size + progress * size * 2;
        const wave = Math.sin(progress * Math.PI * 3 + t * 2 + Math.PI) * size * 0.4;
        if (i === 0) ctx.moveTo(x + wave, py);
        else ctx.lineTo(x + wave, py);
      }
      ctx.stroke();

      for (let i = 2; i < 18; i += 3) {
        const progress = i / 19;
        const py = y - size + progress * size * 2;
        const w1 = Math.sin(progress * Math.PI * 3 + t * 2) * size * 0.4;
        const w2 = Math.sin(progress * Math.PI * 3 + t * 2 + Math.PI) * size * 0.4;
        ctx.beginPath();
        ctx.moveTo(x + w1, py);
        ctx.lineTo(x + w2, py);
        ctx.strokeStyle = color.replace(/[\d.]+\)$/, "0.3)");
        ctx.stroke();
      }
    };

    const drawPill = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      const w = size * 0.4;
      const h = size;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x - w / 2, y - h / 2, w, h, w / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - w / 2, y);
      ctx.lineTo(x + w / 2, y);
      ctx.stroke();
    };

    const drawCircleSymbol = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.12, 0, Math.PI * 2);
      ctx.fill();
    };

    const getColor = (hue: number, alpha: number) => {
      if (hue === 174) return `rgba(20, 184, 166, ${alpha})`;
      if (hue === 199) return `rgba(56, 189, 248, ${alpha})`;
      return `rgba(192, 132, 252, ${alpha})`;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      time.current += 0.016;
      ctx.clearRect(0, 0, w, h);

      const ps = particles.current;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.pulse += p.pulseSpeed;
        const pulseAlpha = Math.sin(p.pulse) * 0.2 + 0.8;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const force = (180 - dist) / 180;
          p.vx -= (dx / dist) * force * 0.03;
          p.vy -= (dy / dist) * force * 0.03;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;

        const alpha = p.opacity * pulseAlpha;
        const color = getColor(p.hue, alpha);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        const glowRadius = p.radius * 4;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        grd.addColorStop(0, getColor(p.hue, alpha * 0.4));
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        for (let j = i + 1; j < ps.length; j++) {
          const p2 = ps[j];
          const lx = p.x - p2.x;
          const ly = p.y - p2.y;
          const ld = Math.sqrt(lx * lx + ly * ly);
          if (ld < 140) {
            const lineAlpha = (1 - ld / 140) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(45, 212, 191, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      const ss = symbols.current;
      for (let i = 0; i < ss.length; i++) {
        const s = ss[i];
        s.pulse += s.pulseSpeed;
        const pulseAlpha = Math.sin(s.pulse) * 0.3 + 0.7;
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotationSpeed;

        if (s.x < -s.size * 2) s.x = w + s.size * 2;
        if (s.x > w + s.size * 2) s.x = -s.size * 2;
        if (s.y < -s.size * 2) s.y = h + s.size * 2;
        if (s.y > h + s.size * 2) s.y = -s.size * 2;

        const dx = mouse.current.x - s.x;
        const dy = mouse.current.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          s.vx -= (dx / dist) * force * 0.015;
          s.vy -= (dy / dist) * force * 0.015;
          s.opacity = Math.min(s.opacity + 0.002, 0.35);
        } else {
          s.opacity = Math.max(s.opacity - 0.001, 0.06);
        }
        s.vx *= 0.995;
        s.vy *= 0.995;

        const alpha = s.opacity * pulseAlpha;
        const color = getColor(s.hue, alpha);

        ctx.save();
        ctx.translate(s.x, s.y);
        if (s.type !== "heartbeat" && s.type !== "dna") {
          ctx.rotate(s.rotation);
        }

        switch (s.type) {
          case "cross":
            drawCross(ctx, 0, 0, s.size, color);
            break;
          case "heartbeat":
            drawHeartbeat(ctx, 0, 0, s.size, color, time.current);
            break;
          case "dna":
            drawDna(ctx, 0, 0, s.size, color, time.current);
            break;
          case "pill":
            drawPill(ctx, 0, 0, s.size, color);
            break;
          case "circle":
            drawCircleSymbol(ctx, 0, 0, s.size, color);
            break;
        }

        ctx.restore();
      }

      const ecgY = h * 0.85;
      const ecgLen = w * 1.2;
      const ecgSpeed = time.current * 80;
      ctx.strokeStyle = "rgba(20, 184, 166, 0.06)";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const progress = ((x + ecgSpeed) % ecgLen) / ecgLen;
        let yOff = 0;
        if (progress > 0.35 && progress < 0.38) {
          yOff = -30 * Math.sin((progress - 0.35) / 0.03 * Math.PI);
        } else if (progress > 0.38 && progress < 0.42) {
          yOff = 50 * Math.sin((progress - 0.38) / 0.04 * Math.PI);
        } else if (progress > 0.42 && progress < 0.45) {
          yOff = -20 * Math.sin((progress - 0.42) / 0.03 * Math.PI);
        } else if (progress > 0.65 && progress < 0.68) {
          yOff = -15 * Math.sin((progress - 0.65) / 0.03 * Math.PI);
        } else if (progress > 0.68 && progress < 0.72) {
          yOff = 25 * Math.sin((progress - 0.68) / 0.04 * Math.PI);
        } else if (progress > 0.72 && progress < 0.75) {
          yOff = -10 * Math.sin((progress - 0.72) / 0.03 * Math.PI);
        }
        const py = ecgY + yOff;
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.stroke();

      const ecgY2 = h * 0.25;
      ctx.strokeStyle = "rgba(192, 132, 252, 0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const progress = ((x + ecgSpeed * 0.6 + 200) % ecgLen) / ecgLen;
        let yOff = 0;
        if (progress > 0.3 && progress < 0.33) {
          yOff = -20 * Math.sin((progress - 0.3) / 0.03 * Math.PI);
        } else if (progress > 0.33 && progress < 0.37) {
          yOff = 35 * Math.sin((progress - 0.33) / 0.04 * Math.PI);
        } else if (progress > 0.37 && progress < 0.40) {
          yOff = -15 * Math.sin((progress - 0.37) / 0.03 * Math.PI);
        }
        const py = ecgY2 + yOff;
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.stroke();

      rafId.current = requestAnimationFrame(animate);
    };

    resize();
    createElements();
    window.addEventListener("resize", () => { resize(); createElements(); });
    window.addEventListener("mousemove", onMouseMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="animated-bg-canvas"
        aria-hidden="true"
      />
      <div className="animated-bg-grid" aria-hidden="true" />
      <div className="animated-bg-vignette" aria-hidden="true" />
    </>
  );
}
