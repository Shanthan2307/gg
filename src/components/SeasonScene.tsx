"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useMode } from "./theme";

/* Ask the ambient layer for a burst of petals or powder from a point on screen */
export const burstFrom = (el: Element | null, fx: number, fy: number, kind: "petals" | "powder") => {
  if (!el) return;
  const r = el.getBoundingClientRect();
  window.dispatchEvent(new CustomEvent("season-burst", { detail: { x: r.left + r.width * fx, y: r.top + r.height * fy, kind } }));
};

/* ---------- Cherry blossom: a branch grows in from the right edge, blooms, then throws petals ---------- */

// branch strokes in growth order: [path, width, delay]
const LIMBS: [string, number, number][] = [
  ["M660 58 C600 66 545 92 470 130", 17, 0],
  ["M470 130 C410 162 350 186 290 236", 12, 0.45],
  ["M545 94 C538 140 552 182 574 214", 6, 0.5],
  ["M470 130 C456 92 432 62 396 40", 7, 0.6],
  ["M290 236 C256 266 232 300 206 350", 7, 0.8],
  ["M380 172 C386 220 376 268 350 318", 5, 0.85],
  ["M290 236 C250 226 212 230 172 210", 4.5, 1.0],
  ["M430 62 C420 42 425 26 442 10", 3, 1.05],
  ["M350 318 C345 344 350 364 361 386", 3, 1.15],
  ["M172 210 C152 200 137 205 120 194", 2.5, 1.2],
  ["M206 350 C196 372 196 392 204 410", 2.5, 1.25],
];

// flowers: [x, y, size, rotation, delay]
const FLOWERS: [number, number, number, number, number][] = [
  [600, 70, 26, 10, 0.4], [520, 108, 30, -12, 0.55], [470, 150, 24, 30, 0.65], [560, 150, 22, 0, 0.7],
  [575, 214, 28, 18, 0.9], [396, 40, 30, -20, 1.0], [438, 14, 20, 40, 1.15], [412, 156, 22, 5, 0.95],
  [350, 200, 28, -8, 1.05], [300, 236, 24, 22, 1.1], [380, 260, 22, -30, 1.2], [350, 318, 30, 12, 1.25],
  [361, 388, 22, -18, 1.35], [256, 266, 24, 35, 1.25], [206, 352, 28, -5, 1.35], [204, 412, 20, 14, 1.45],
  [230, 224, 22, -24, 1.3], [172, 210, 28, 8, 1.4], [120, 194, 22, -16, 1.5], [326, 222, 18, 50, 1.2],
  [488, 96, 18, -40, 0.7], [610, 96, 18, 25, 0.6],
];
const BUDS: [number, number][] = [[455, 116], [540, 186], [418, 82], [332, 290], [268, 300], [190, 384], [145, 214], [590, 52], [372, 230]];

// trig results are rounded so server and client render identical attributes
const round = (v: number) => Math.round(v * 100) / 100;

const PETAL = "M0 0 C-9 -6 -10.5 -18 -4.5 -24 L0 -20.5 L4.5 -24 C10.5 -18 9 -6 0 0Z";

function Flower({ x, y, size, rot, delay }: { x: number; y: number; size: number; rot: number; delay: number }) {
  const k = size / 24;
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: delay + 0.35, type: "spring", stiffness: 260, damping: 14 }}
      style={{ originX: `${x}px`, originY: `${y}px`, transformBox: "view-box" }}
    >
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d={PETAL} transform={`rotate(${a})`} fill="url(#sakura-petal)" stroke="#e98aa5" strokeWidth={0.6 / k} />
        ))}
        <circle r={4.2} fill="#f6c2cf" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <circle key={a} cx={round(Math.cos((a * Math.PI) / 180) * 6.5)} cy={round(Math.sin((a * Math.PI) / 180) * 6.5)} r={1.1} fill="#c2456b" />
        ))}
        <circle r={2} fill="#d4607f" />
      </g>
    </motion.g>
  );
}

function Blossom() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // once the branch is in bloom it throws a handful of petals across the page
    const t = setTimeout(() => burstFrom(ref.current, 0.55, 0.35, "petals"), 2300);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.svg
      ref={ref}
      viewBox="0 0 640 460"
      preserveAspectRatio="xMaxYMin meet"
      className="h-full w-full"
      aria-hidden
      // the whole branch sways a little from where it leaves the edge
      animate={{ rotate: [0, -1.4, 0, 0.8, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
      style={{ originX: "100%", originY: "12%" }}
    >
      <defs>
        <radialGradient id="sakura-petal" cx="50%" cy="90%" r="90%">
          <stop offset="0%" stopColor="#f39ab3" />
          <stop offset="45%" stopColor="#f9c6d4" />
          <stop offset="100%" stopColor="#fff1f5" />
        </radialGradient>
        <linearGradient id="sakura-bark" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a2e2a" />
          <stop offset="100%" stopColor="#7a4e45" />
        </linearGradient>
      </defs>
      {LIMBS.map(([d, w, delay]) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="url(#sakura-bark)"
          strokeWidth={w}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay, ease: [0.3, 0.7, 0.3, 1] }}
        />
      ))}
      {BUDS.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={4.5}
          fill="#e7809e"
          stroke="#c2456b"
          strokeWidth={0.8}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.1 + i * 0.06, type: "spring", stiffness: 300, damping: 15 }}
          style={{ originX: `${x}px`, originY: `${y}px`, transformBox: "view-box" }}
        />
      ))}
      {FLOWERS.map(([x, y, size, rot, delay], i) => (
        <Flower key={i} x={x} y={y} size={size} rot={rot} delay={delay} />
      ))}
    </motion.svg>
  );
}

/* ---------- Matcha: a chawan being whisked, with a tea caddy, a bamboo scoop and steam ---------- */

const TINES = Array.from({ length: 15 }, (_, i) => {
  const t = i / 14 - 0.5; // -0.5 .. 0.5 across the whisk
  const spread = t * 58;
  const r = (v: number) => Math.round(v * 100) / 100;
  return `M${r(t * 10)} -58 C${r(t * 16)} -40 ${r(spread)} -26 ${r(spread * 0.9)} -4 C${r(spread * 0.7)} 4 ${r(spread * 0.35)} 8 0 8`;
});

function Whisk() {
  return (
    <g>
      {/* handle with bamboo nodes */}
      <rect x={-8} y={-176} width={16} height={122} rx={7} fill="url(#bamboo)" stroke="#a88a4e" strokeWidth={1} />
      <path d="M-8 -132 h16 M-8 -96 h16" stroke="#a88a4e" strokeWidth={1.4} />
      <rect x={-9.5} y={-62} width={19} height={8} rx={3} fill="#7a5b2c" />
      {/* tines fan into a bulb; the inner cluster sits behind */}
      <path d="M-14 -56 C-10 -30 -6 -14 0 -6 C6 -14 10 -30 14 -56" fill="#e9d6a6" opacity={0.7} />
      {TINES.map((d) => (
        <path key={d} d={d} fill="none" stroke="#d9bd7f" strokeWidth={1.6} strokeLinecap="round" />
      ))}
      <path d="M-30 -10 C-20 4 20 4 30 -10" fill="none" stroke="#c6a361" strokeWidth={1.2} />
    </g>
  );
}

function Matcha() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // each whisking burst kicks a little matcha powder into the air
    const puff = () => burstFrom(ref.current, 0.6, 0.62, "powder");
    const first = setTimeout(puff, 1500);
    const id = setInterval(puff, 4800);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  const bubbles = Array.from({ length: 26 }, (_, i) => {
    const a = i * 2.39996;
    const r = Math.sqrt(i / 26);
    return [round(380 + Math.cos(a) * r * 132), round(336 + Math.sin(a) * r * 25), round(1.2 + ((i * 7) % 5) * 0.45)] as const;
  });
  return (
    <svg ref={ref} viewBox="0 0 640 560" preserveAspectRatio="xMaxYMid meet" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="glaze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a9bd86" />
          <stop offset="55%" stopColor="#d9dcc0" />
          <stop offset="100%" stopColor="#efe8d5" />
        </linearGradient>
        <radialGradient id="tea" cx="45%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#d4ea9c" />
          <stop offset="60%" stopColor="#a8cc5f" />
          <stop offset="100%" stopColor="#7fa83b" />
        </radialGradient>
        <linearGradient id="bamboo" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e2c98f" />
          <stop offset="50%" stopColor="#f3e2b5" />
          <stop offset="100%" stopColor="#cdb071" />
        </linearGradient>
        <linearGradient id="lacquer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#24391f" />
          <stop offset="45%" stopColor="#3f5c33" />
          <stop offset="100%" stopColor="#1c2d18" />
        </linearGradient>
        <clipPath id="tea-surface">
          <ellipse cx={380} cy={334} rx={150} ry={31} />
        </clipPath>
      </defs>

      <motion.g initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease: [0.3, 0.7, 0.3, 1] }}>
        <ellipse cx={370} cy={500} rx={250} ry={26} fill="#4e7520" opacity={0.12} />

        {/* natsume tea caddy */}
        <g>
          <ellipse cx={150} cy={468} rx={46} ry={12} fill="#1c2d18" />
          <path d="M104 400 V468 A46 12 0 0 0 196 468 V400Z" fill="url(#lacquer)" />
          <ellipse cx={150} cy={400} rx={46} ry={12} fill="#476a3a" />
          <path d="M104 412 A46 12 0 0 0 196 412" fill="none" stroke="#c9a85a" strokeWidth={1.4} />
          <ellipse cx={136} cy={398} rx={14} ry={3} fill="#6c8f5c" opacity={0.6} />
        </g>

        {/* chashaku scoop with a mound of powder */}
        <path d="M70 512 C150 506 250 500 318 486" fill="none" stroke="#d6b97a" strokeWidth={7} strokeLinecap="round" />
        <path d="M70 512 C150 506 250 500 318 486" fill="none" stroke="#b8975a" strokeWidth={1} strokeDasharray="1 26" />
        <ellipse cx={318} cy={484} rx={14} ry={6} fill="#d6b97a" />
        <ellipse cx={318} cy={480} rx={10} ry={5} fill="#8db24a" />

        {/* chawan */}
        <path d="M206 330 C212 430 290 492 380 492 C470 492 548 430 554 330Z" fill="url(#glaze)" stroke="#8f9b6e" strokeWidth={1.4} />
        {/* glaze drips running down from the rim */}
        {[[240, 380], [300, 420], [372, 410], [450, 428], [520, 376]].map(([x, y], i) => (
          <path key={i} d={`M${x - 14} 334 C${x - 12} ${y - 30} ${x - 6} ${y} ${x} ${y} C${x + 6} ${y} ${x + 12} ${y - 30} ${x + 14} 334Z`} fill="#93ab6c" opacity={0.55} />
        ))}
        <path d="M332 490 L336 508 L424 508 L428 490" fill="#cdbf9e" stroke="#8f9b6e" strokeWidth={1.2} />
        <ellipse cx={380} cy={330} rx={174} ry={38} fill="#e9e4cf" stroke="#8f9b6e" strokeWidth={1.4} />
        <ellipse cx={380} cy={334} rx={150} ry={31} fill="url(#tea)" />

        {/* foam: bubbles shimmer and ripples spread while the whisk works */}
        <g clipPath="url(#tea-surface)">
          {bubbles.map(([x, y, r], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill="#f2f9dc"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.25, 0.9, 0.25] }}
              transition={{ duration: 1.6 + (i % 4) * 0.4, repeat: Infinity, delay: (i % 7) * 0.2 }}
            />
          ))}
          {[0, 1].map((i) => (
            <motion.ellipse
              key={i}
              cx={380}
              cy={334}
              rx={40}
              ry={9}
              fill="none"
              stroke="#eef7d0"
              strokeWidth={1.6}
              animate={{ scale: [0.4, 2.6], opacity: [0.8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: 1 + i * 1.2, ease: "easeOut" }}
              style={{ originX: "380px", originY: "334px", transformBox: "view-box" }}
            />
          ))}
        </g>

        {/* steam */}
        {[330, 384, 436].map((x, i) => (
          <motion.path
            key={x}
            d={`M${x} 292 C${x - 14} 262 ${x + 14} 236 ${x} 204`}
            fill="none"
            stroke="#ffffff"
            strokeWidth={5}
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.75, 0], y: [8, -26] }}
            transition={{ duration: 3.4, repeat: Infinity, delay: 1.2 + i * 1.1, ease: "easeOut" }}
          />
        ))}

        {/* the whisk: an M-shaped zig-zag in bursts, like real whisking */}
        <motion.g
          initial={{ x: 380, y: 280 }}
          animate={{ x: [380, 330, 400, 350, 420, 360, 430, 380, 380], y: [280, 286, 280, 286, 280, 286, 280, 280, 280], rotate: [0, -7, 6, -7, 6, -7, 6, 0, 0] }}
          transition={{ duration: 4.8, times: [0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 1], repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          <Whisk />
        </motion.g>
      </motion.g>
    </svg>
  );
}

/* Hero scene for the current mode, cross-fading when the mode changes */
export default function SeasonScene() {
  const mode = useMode();
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full max-w-[760px] sm:w-[70vw]">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          // on phones the branch hangs over the header softly and the bowl sits in the space under the buttons
          className={
            mode === "blossom"
              ? "absolute right-0 top-0 h-[42%] w-full opacity-60 md:h-[78%] md:opacity-100"
              : "absolute bottom-0 right-[-4%] h-[21%] w-full md:bottom-[6%] md:right-0 md:h-[72%]"
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
        >
          {mode === "blossom" ? <Blossom /> : <Matcha />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
