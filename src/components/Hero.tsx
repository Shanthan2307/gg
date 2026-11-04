"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content";
import SeasonScene from "./SeasonScene";
import { ScrambleText, TactileButton } from "./ui";

/* Constellation background: drifting dots that link to each other and to the cursor */
function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    const mouse = { x: -999, y: -999 };
    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const n = Math.min(70, Math.floor((w * h) / 14000));
    const pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
    }));
    const draw = () => {
      const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#000";
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!reduce) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      }
      ctx.strokeStyle = ink;
      ctx.fillStyle = ink;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.globalAlpha = (1 - d / 110) * 0.12;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 170) {
          ctx.globalAlpha = (1 - md / 170) * 0.45;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.globalAlpha = 0.25;
        ctx.beginPath(); ctx.arc(a.x, a.y, 1.4, 0, Math.PI * 2); ctx.fill();
      }
      // reduced motion: the dots stay put and only redraw when the pointer moves
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      if (reduce) draw();
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}

/* Each face is sized so the name fills about the same width and sits on the same baseline */
const SIGNATURE_FACES = [
  { family: "var(--font-script)", size: 150, y: 125 },
  { family: "var(--font-vibes)", size: 128, y: 118 },
  { family: "var(--font-gothic)", size: 118, y: 118 },
  { family: "var(--font-pinyon)", size: 118, y: 122 },
  { family: "var(--font-display)", size: 138, y: 122, italic: true },
];
const FACE_HOLD_MS = 10000;

/* Signature that draws itself, fills in, and every 10 s redraws in the next face */
function Signature({ text }: { text: string }) {
  const [face, setFace] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setFace((f) => (f + 1) % SIGNATURE_FACES.length), FACE_HOLD_MS);
    return () => clearInterval(id);
  }, []);
  const f = SIGNATURE_FACES[face];
  return (
    <svg viewBox="0 0 520 196" className="h-auto w-full max-w-[560px] lg:max-w-[700px]" role="img" aria-label={text}>
      <AnimatePresence mode="wait">
        <motion.text
          key={face}
          x="10"
          y={f.y}
          style={{ fontFamily: f.family, fontSize: f.size, fontStyle: f.italic ? "italic" : "normal" }}
          fill="var(--ink)"
          stroke="var(--ink)"
          strokeWidth={1.2}
          initial={{ strokeDasharray: 2400, strokeDashoffset: 2400, fillOpacity: 0, opacity: 1 }}
          animate={{ strokeDashoffset: 0, fillOpacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          transition={{ strokeDashoffset: { duration: 2.6, ease: "easeInOut" }, fillOpacity: { delay: 2, duration: 0.8 } }}
        >
          {text}
        </motion.text>
      </AnimatePresence>
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <Constellation />
      <SeasonScene />
      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-5xl flex-col justify-center px-4 pb-48 pt-16 sm:px-6 md:pb-24">
        <div className="flex items-center gap-3">
          <span className="font-gothic text-2xl">Gargi&apos;s</span>
          <span className="text-sm text-muted">Build Log</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 text-xs text-muted backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-matcha" style={{ animation: "breathe 2s infinite" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-matcha" />
          </span>
          {profile.location} · {profile.school}
        </motion.div>

        <div className="mt-4 -ml-2">
          <Signature text={profile.first} />
        </div>

        <h1 className="mt-2 font-display text-3xl leading-snug sm:text-5xl">
          Currently{" "}
          <ScrambleText words={profile.roles} className="font-mono text-[0.62em] italic text-accent" />
        </h1>

        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-muted">{profile.intro}</p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <TactileButton href="#tickets">
            Open the log <span aria-hidden>→</span>
          </TactileButton>
          <a href="#contact" className="inline-block py-1.5 text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
            or say hi
          </a>
          <a href="#hire" className="inline-block py-1.5 text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
            · wanna hire me?
          </a>
        </div>
      </div>
    </section>
  );
}
