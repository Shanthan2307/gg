"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Visual } from "@/content";

/* ResQ: donations hop around a ring of fire stations and relief centers until quorum confirms */
function Quorum() {
  const nodes = 8;
  const [confirmed, setConfirmed] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setConfirmed(nodes);
    const id = setInterval(() => setConfirmed((c) => (c + 1) % (nodes + 3)), 650);
    return () => clearInterval(id);
  }, []);
  const R = 62;
  return (
    <svg viewBox="-90 -90 180 180" className="h-full w-full">
      <circle r={R} fill="none" stroke="var(--line)" strokeDasharray="3 4" />
      {Array.from({ length: nodes }, (_, i) => {
        const a = (i / nodes) * Math.PI * 2 - Math.PI / 2;
        const on = i < confirmed;
        const fire = i % 2 === 0;
        return (
          <g key={i} transform={`translate(${Math.cos(a) * R} ${Math.sin(a) * R})`}>
            <circle r={on ? 9 : 7} fill={on ? (fire ? "var(--accent)" : "var(--accent-2)") : "var(--surface)"} stroke="var(--ink)" strokeOpacity={0.3} style={{ transition: "all .3s" }} />
            <text textAnchor="middle" dy="3.5" fontSize="8" fill={on ? "#fff" : "var(--muted)"}>{fire ? "🔥" : "+"}</text>
          </g>
        );
      })}
      <motion.circle
        r="3.5"
        fill="var(--ink)"
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{ originX: "0px", originY: "0px" }}
        cy={-R}
      />
      <text textAnchor="middle" dy="-2" fontSize="20" className="font-display" fill="var(--ink)">{Math.min(confirmed, nodes)}/{nodes}</text>
      <text textAnchor="middle" dy="12" fontSize="7" className="font-mono" fill="var(--muted)" letterSpacing="1">CONFIRMED</text>
    </svg>
  );
}

/* Resona: live oscilloscope; press to "speak" and verify */
function Voice() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"idle" | "listening" | "ok">("idle");
  const stateRef = useRef(state);
  stateRef.current = state;
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let t = 0, raf = 0;
    const draw = () => {
      const w = (c.width = c.clientWidth * 2), h = (c.height = c.clientHeight * 2);
      ctx.clearRect(0, 0, w, h);
      const amp = stateRef.current === "listening" ? 0.38 : stateRef.current === "ok" ? 0.06 : 0.12;
      const ink = getComputedStyle(document.documentElement).getPropertyValue(stateRef.current === "ok" ? "--accent-2" : "--ink").trim();
      ctx.strokeStyle = ink;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const p = x / w;
        const env = Math.sin(p * Math.PI);
        const y = h / 2 + Math.sin(p * 22 + t) * Math.sin(p * 7 - t * 0.6) * h * amp * env + Math.sin(p * 61 + t * 3) * h * amp * 0.25 * env;
        if (x) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.stroke();
      t += 0.08;
      if (!still) raf = requestAnimationFrame(draw);
    };
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  const speak = () => {
    if (state === "listening") return;
    setState("listening");
    setTimeout(() => setState("ok"), 1400);
    setTimeout(() => setState("idle"), 4200);
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3">
      <canvas ref={ref} className="h-16 w-full" />
      <button onClick={speak} className="press relative flex h-8 items-center gap-2 rounded-full border border-line bg-surface px-3 font-mono text-[11px]">
        <AnimatePresence mode="wait">
          {state === "ok" ? (
            <motion.span key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-matcha">
              <svg width="14" height="14" viewBox="0 0 24 24"><motion.path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /></svg>
              voice verified · 187ms
            </motion.span>
          ) : (
            <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {state === "listening" ? "● listening…" : "◉ tap to speak"}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

/* NeuroSole: layered insole slices stacked in 3D, slowly rotating */
function Insole() {
  const layers = 9;
  const path = "M50 6 C72 6 80 30 76 56 C73 78 78 104 70 124 C64 140 36 140 30 124 C24 108 30 86 26 64 C22 38 28 6 50 6 Z";
  return (
    <div className="flex h-full w-full items-center justify-center" style={{ perspective: 600 }}>
      <motion.div
        className="relative h-[140px] w-[100px]"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: 360 }}
        initial={{ rotateX: 58 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: layers }, (_, i) => (
          <svg key={i} viewBox="0 0 100 146" className="absolute inset-0" style={{ transform: `translateZ(${i * 3}px) scale(${1 - i * 0.03})` }}>
            <path d={path} fill={`color-mix(in oklab, var(--accent-2) ${30 + i * 7}%, var(--surface))`} stroke="var(--ink)" strokeOpacity="0.15" />
            {i === layers - 1 &&
              [[50, 30], [42, 60], [55, 70], [48, 112]].map(([x, y], k) => (
                <circle key={k} cx={x} cy={y} r={5 - k * 0.5} fill="var(--accent)" opacity={0.65} style={{ animation: `pulse-dot ${1.4 + k * 0.3}s infinite` }} />
              ))}
          </svg>
        ))}
      </motion.div>
    </div>
  );
}

/* TerraEngine: wireframe Mars with crop-suitability hot spots */
function Mars() {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const tick = () => {
      setT((v) => v + 0.004);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const R = 58;
  const spots = [[0.3, 0.2], [1.6, -0.4], [2.8, 0.5], [4.1, -0.1], [5.2, 0.35]];
  return (
    <svg viewBox="-80 -80 160 160" className="h-full w-full">
      <defs>
        <radialGradient id="mars" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#e8875a" />
          <stop offset="100%" stopColor="#8a3a22" />
        </radialGradient>
      </defs>
      <circle r={R} fill="url(#mars)" />
      {Array.from({ length: 8 }, (_, i) => {
        const lon = ((i / 8) * Math.PI + t) % Math.PI;
        return <ellipse key={i} rx={Math.abs(Math.cos(lon)) * R} ry={R} fill="none" stroke="#fff" strokeOpacity="0.18" />;
      })}
      {[-0.6, -0.3, 0, 0.3, 0.6].map((l) => (
        <ellipse key={l} cy={Math.sin(l) * R} rx={Math.cos(l) * R} ry={Math.cos(l) * R * 0.12} fill="none" stroke="#fff" strokeOpacity="0.18" />
      ))}
      {spots.map(([lon, lat], i) => {
        const a = lon + t * 3;
        const z = Math.cos(a);
        if (z < 0) return null;
        const x = Math.sin(a) * Math.cos(lat) * R;
        const y = Math.sin(lat) * R;
        return (
          <g key={i} transform={`translate(${x} ${y})`} opacity={z}>
            <circle r={7} fill="#9cf2b7" opacity={0.25}><animate attributeName="r" values="3;9;3" dur="2s" repeatCount="indefinite" /></circle>
            <circle r={2.5} fill="#c9ffd8" />
          </g>
        );
      })}
    </svg>
  );
}

/* Project-16: methane heatmap that ripples across a satellite grid */
function Methane() {
  const cols = 16, rows = 9;
  return (
    <div className="grid h-full w-full place-items-center p-4">
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols * rows }, (_, i) => {
          const x = i % cols, y = Math.floor(i / cols);
          const d = Math.hypot(x - 10, y - 4);
          return (
            <motion.span
              key={i}
              className="block h-[9px] w-[9px] rounded-[2px]"
              animate={{ backgroundColor: ["var(--well)", d < 2 ? "var(--accent)" : d < 4 ? "#f0a35e" : "#e8dcc4", "var(--well)"] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: d * 0.18, ease: "easeInOut" }}
              style={{ backgroundColor: "var(--well)", outline: "1px solid var(--line)" }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function BuildVisual({ kind }: { kind: Visual }) {
  switch (kind) {
    case "quorum": return <Quorum />;
    case "voice": return <Voice />;
    case "insole": return <Insole />;
    case "mars": return <Mars />;
    case "methane": return <Methane />;
    default: return null;
  }
}
