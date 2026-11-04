"use client";

import { useEffect, useRef } from "react";
import { useMode, type Mode } from "./theme";

/*
 * Background layer behind the page: falling sakura petals in blossom mode,
 * drifting matcha powder and tea leaves in matcha mode. Scrolling moves them
 * up past you, a little slower than the page, so they read as depth.
 */

interface Bit {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  flip: number;
  kind: "petal" | "leaf" | "dust";
  life: number; // seconds left; Infinity for the ambient ones
  alpha: number;
}

const PARALLAX = 0.35;
const MOST_DT = 1 / 30;

function ambientBit(mode: Mode, w: number, h: number, anywhere: boolean): Bit {
  const blossom = mode === "blossom";
  const kind = blossom ? "petal" : Math.random() < 0.3 ? "leaf" : "dust";
  return {
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : blossom ? -20 : h + 20,
    vx: blossom ? -6 - Math.random() * 14 : (Math.random() - 0.5) * 6,
    vy: blossom ? 14 + Math.random() * 22 : -(6 + Math.random() * 12),
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 1.6,
    size: kind === "dust" ? 1 + Math.random() * 1.8 : kind === "leaf" ? 7 + Math.random() * 6 : 6 + Math.random() * 6,
    flip: Math.random() * Math.PI * 2,
    kind,
    life: Infinity,
    alpha: kind === "dust" ? 0.35 + Math.random() * 0.3 : 0.5 + Math.random() * 0.35,
  };
}

function drawPetal(ctx: CanvasRenderingContext2D, b: Bit) {
  const s = b.size;
  ctx.beginPath();
  ctx.moveTo(0, s);
  ctx.bezierCurveTo(-s * 0.9, s * 0.4, -s * 0.8, -s * 0.7, -s * 0.2, -s);
  ctx.lineTo(0, -s * 0.78);
  ctx.lineTo(s * 0.2, -s);
  ctx.bezierCurveTo(s * 0.8, -s * 0.7, s * 0.9, s * 0.4, 0, s);
  ctx.fillStyle = "#f6b3c6";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, s * 0.8);
  ctx.quadraticCurveTo(-s * 0.1, 0, 0, -s * 0.6);
  ctx.strokeStyle = "rgba(214, 96, 127, 0.45)";
  ctx.lineWidth = 0.8;
  ctx.stroke();
}

function drawLeaf(ctx: CanvasRenderingContext2D, b: Bit) {
  const s = b.size;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(s * 0.7, 0, 0, s);
  ctx.quadraticCurveTo(-s * 0.7, 0, 0, -s);
  ctx.fillStyle = "#86ad48";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.9);
  ctx.lineTo(0, s * 0.9);
  ctx.strokeStyle = "rgba(60, 95, 30, 0.5)";
  ctx.lineWidth = 0.8;
  ctx.stroke();
}

export default function Ambient() {
  const mode = useMode();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    let w = 0, h = 0, raf = 0, last = 0;
    let lastScroll = window.scrollY;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const count = mode === "blossom" ? Math.round(Math.min(52, w / 26)) : Math.round(Math.min(90, w / 15));
    const bits: Bit[] = Array.from({ length: count }, () => ambientBit(mode, w, h, true));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const b of bits) {
        ctx.save();
        ctx.globalAlpha = b.alpha * (b.life < 1 ? b.life : 1);
        ctx.translate(b.x, b.y);
        if (b.kind === "dust") {
          ctx.beginPath();
          ctx.arc(0, 0, b.size, 0, Math.PI * 2);
          ctx.fillStyle = "#7fa63e";
          ctx.fill();
        } else {
          ctx.rotate(b.rot);
          const c = Math.cos(b.flip); // tumbling: the petal turns edge-on and back
          ctx.scale(Math.abs(c) < 0.18 ? 0.18 * (Math.sign(c) || 1) : c, 1);
          if (b.kind === "petal") drawPetal(ctx, b);
          else drawLeaf(ctx, b);
        }
        ctx.restore();
      }
    };

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, MOST_DT) : 1 / 60;
      last = now;
      const scrolled = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      const t = now / 1000;
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i];
        const drag = b.life === Infinity ? 0 : 1.6;
        b.vx -= b.vx * drag * dt;
        b.vy -= b.vy * drag * dt * 0.6;
        if (b.life !== Infinity) b.vy += (mode === "blossom" ? 30 : -14) * dt; // settle into the ambient drift
        const sway = Math.sin(t * 1.3 + b.flip) * (b.kind === "dust" ? 4 : 12);
        b.x += (b.vx + sway) * dt;
        b.y += b.vy * dt - scrolled * PARALLAX;
        b.rot += b.vr * dt;
        b.flip += dt * (b.kind === "petal" ? 2.2 : 1.2);
        if (b.life !== Infinity) {
          b.life -= dt;
          if (b.life <= 0) {
            bits.splice(i, 1);
            continue;
          }
        }
        // ambient bits wrap around the screen
        if (b.life === Infinity) {
          if (b.y > h + 30) Object.assign(b, ambientBit(mode, w, h, false), { y: -20 });
          else if (b.y < -30) Object.assign(b, ambientBit(mode, w, h, false), { y: h + 20 });
          if (b.x < -30) b.x = w + 20;
          else if (b.x > w + 30) b.x = -20;
        }
      }
      draw();
      raf = document.hidden ? 0 : requestAnimationFrame(tick);
    };

    const onBurst = (e: Event) => {
      if (still) return;
      const { x, y, kind } = (e as CustomEvent<{ x: number; y: number; kind: "petals" | "powder" }>).detail;
      const n = kind === "petals" ? 46 : 26;
      for (let i = 0; i < n; i++) {
        const b = ambientBit(mode, w, h, true);
        const a = kind === "petals" ? Math.PI * (0.85 + Math.random() * 0.45) : -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
        const speed = kind === "petals" ? 260 + Math.random() * 420 : 60 + Math.random() * 120;
        Object.assign(b, {
          x: x + (Math.random() - 0.5) * 80,
          y: y + (Math.random() - 0.5) * 50,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          life: kind === "petals" ? 4 + Math.random() * 3 : 1.6 + Math.random() * 1.4,
          kind: kind === "petals" ? "petal" : Math.random() < 0.15 ? "leaf" : "dust",
          size: kind === "petals" ? 7 + Math.random() * 6 : 1.2 + Math.random() * 2,
          alpha: kind === "petals" ? 0.85 : 0.55,
        });
        bits.push(b);
      }
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const onVisible = () => {
      if (!document.hidden && !raf && !still) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("season-burst", onBurst);
    document.addEventListener("visibilitychange", onVisible);
    if (still) draw();
    else raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("season-burst", onBurst);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [mode]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0 h-full w-full" aria-hidden />;
}
