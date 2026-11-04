"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* Section header, Kitchen style: small label, serif title, muted blurb */
export function SectionHead({ kicker, title, blurb }: { kicker: string; title: React.ReactNode; blurb?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{kicker}</p>
      <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">{title}</h2>
      {blurb && <p className="mt-3 text-[15px] leading-relaxed text-muted">{blurb}</p>}
    </div>
  );
}

/* Scramble-decode: swaps through glyphs before settling on each new word */
const GLYPHS = "!<>-_\\/[]{}—=+*^?#@~$%&01";
export function ScrambleText({ words, interval = 2600, className }: { words: string[]; interval?: number; className?: string }) {
  const [text, setText] = useState(words[0]);
  const idx = useRef(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let raf = 0;
    const id = setInterval(() => {
      const from = words[idx.current];
      idx.current = (idx.current + 1) % words.length;
      const to = words[idx.current];
      const len = Math.max(from.length, to.length);
      const queue = Array.from({ length: len }, (_, i) => ({
        to: to[i] ?? "",
        start: Math.floor(Math.random() * 14),
        end: 14 + Math.floor(Math.random() * 18),
      }));
      frame = 0;
      cancelAnimationFrame(raf);
      const tick = () => {
        let done = 0;
        const out = queue
          .map((q) => {
            if (frame >= q.end) {
              done++;
              return q.to;
            }
            if (frame >= q.start) return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            return from[queue.indexOf(q)] ?? "";
          })
          .join("");
        setText(out);
        frame++;
        if (done < queue.length) raf = requestAnimationFrame(tick);
      };
      tick();
    }, interval);
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, [words, interval]);

  return <span className={className}>{text}</span>;
}

/* Tactile button: shaped face over a darker base that compresses on press */
export function TactileButton({ children, href, onClick }: { children: React.ReactNode; href?: string; onClick?: () => void }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={onClick}
      className="group relative inline-block select-none rounded-[12px] bg-[#2a2826] pb-[5px] outline-none active:pb-[1px] active:translate-y-[4px] transition-all duration-100"
    >
      <span className="flex items-center gap-2 rounded-[11px] border border-white/10 bg-gradient-to-b from-[#55524d] to-[#3b3936] px-5 py-2.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
        {children}
      </span>
    </Tag>
  );
}

/* Odometer: each digit is a rolling column */
// The invisible final digit sets the column's natural width and baseline,
// so rolling digits line up with the prefix, suffix and decimal point.
function Digit({ d, delay }: { d: number; delay: number }) {
  return (
    // clip-path instead of overflow-hidden: overflow would move the inline-block's baseline to its bottom edge
    <span className="relative inline-block [clip-path:inset(0)]">
      <span className="invisible">{d}</span>
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col items-center"
        initial={{ y: "0%" }}
        animate={{ y: `-${d * 10}%` }}
        transition={{ type: "spring", stiffness: 60, damping: 16, delay }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i}>{i}</span>
        ))}
      </motion.span>
    </span>
  );
}

export function Odometer({ value, decimals = 0, prefix, suffix }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const str = value.toFixed(decimals);
  return (
    <span ref={ref} className="inline-block whitespace-nowrap leading-none">
      {prefix && <span className="mr-[0.2em]">{prefix}</span>}
      {str.split("").map((c, i) =>
        /\d/.test(c) ? <Digit key={i} d={inView ? +c : 0} delay={i * 0.08} /> : <span key={i}>{c}</span>,
      )}
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

/* Pointer-reactive foil wrapper */
export function Foil({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--fx", `${x}%`);
    el.style.setProperty("--fy", `${y}%`);
    el.style.setProperty("--fp", `${x}`);
    el.style.setProperty("--fa", `${(x - 50) * 0.6}deg`);
  };
  return (
    <div ref={ref} onPointerMove={move} className={`foil ${className}`}>
      {children}
    </div>
  );
}

/* Gentle 3D tilt following the pointer */
export function Tilt({ children, className = "", max = 8 }: { children: React.ReactNode; className?: string; max?: number }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rx = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width);
        y.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        x.set(0.5);
        y.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}

/* Stamp that thuds down when it scrolls into view */
export function Stamp({ label, sub, color = "var(--accent)", rotate = -12, size = 92 }: { label: string; sub?: string; color?: string; rotate?: number; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ scale: 2.4, opacity: 0, rotate: rotate - 18 }}
      animate={inView ? { scale: 1, opacity: 0.92, rotate } : {}}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      style={{ width: size, height: size, color, borderColor: color }}
      className="pointer-events-none flex flex-col items-center justify-center rounded-full border-[3px] border-double font-mono uppercase mix-blend-multiply dark:mix-blend-normal"
    >
      <span className="text-[11px] font-bold tracking-[0.18em]">{label}</span>
      {sub && <span className="mt-0.5 text-[8px] tracking-widest opacity-80">{sub}</span>}
    </motion.div>
  );
}

export function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };
  return { copied, copy };
}
