"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { hackathons } from "@/content";
import BuildVisual from "./BuildVisuals";
import { SectionHead, Stamp } from "./ui";

/* Drag-to-throw for mouse users; touch uses native momentum scrolling */
function useDragScroll(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false, startX = 0, startLeft = 0, lastX = 0, v = 0, raf = 0, moved = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || (e.target as HTMLElement).closest("button,a")) return;
      down = true; moved = false;
      startX = lastX = e.clientX; startLeft = el.scrollLeft;
      cancelAnimationFrame(raf);
      el.style.scrollSnapType = "none";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      v = e.clientX - lastX; lastX = e.clientX;
      if (Math.abs(e.clientX - startX) > 4) moved = true;
      el.scrollLeft = startLeft - (e.clientX - startX);
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      const glide = () => {
        v *= 0.94;
        el.scrollLeft -= v;
        if (Math.abs(v) > 0.5) raf = requestAnimationFrame(glide);
        else el.style.scrollSnapType = "";
      };
      glide();
    };
    const onClick = (e: MouseEvent) => moved && e.preventDefault();
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, [ref]);
}

/* Arc timeline: each hackathon is a dot, linked to the next by an arc */
function ArcTimeline({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const n = hackathons.length;
  const W = 600, gap = W / (n + 1);
  return (
    <svg viewBox={`0 0 ${W} 90`} className="w-full max-w-2xl">
      {hackathons.slice(1).map((_, i) => {
        const x1 = gap * (i + 1), x2 = gap * (i + 2), mid = (x1 + x2) / 2;
        return (
          <motion.path
            key={i}
            d={`M${x1} 70 Q${mid} ${10} ${x2} 70`}
            fill="none"
            stroke={i < active ? "var(--accent)" : "var(--line)"}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
          />
        );
      })}
      {hackathons.map((h, i) => (
        <g key={h.id} onClick={() => onPick(i)} className="cursor-pointer">
          <circle cx={gap * (i + 1)} cy={70} r={i === active ? 7 : 5} fill={i === active ? "var(--accent)" : "var(--surface)"} stroke="var(--ink)" strokeOpacity="0.4" style={{ transition: "all .25s" }} />
          <text x={gap * (i + 1)} y={88} textAnchor="middle" fontSize="10" className="font-mono" fill={i === active ? "var(--ink)" : "var(--muted)"}>
            {h.project}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Ticket({ h, index }: { h: (typeof hackathons)[number]; index: number }) {
  const field = (label: string, value?: string) => (
    <div>
      <p className="text-[9px] uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className={`mt-0.5 text-[12px] ${value ? "" : "text-muted"}`}>{value ?? "TBA"}</p>
    </div>
  );
  return (
    <article className="ticket card relative flex w-[86vw] max-w-[620px] shrink-0 snap-center flex-col overflow-visible sm:flex-row">
      {/* main stub */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          <span>Admit one · No. {String(index + 1).padStart(3, "0")}</span>
          <span>{h.date ?? ""}</span>
        </div>
        <h3 className="mt-3 font-display text-4xl leading-none">{h.project}</h3>
        <p className="mt-1 font-display text-lg italic text-muted">{h.tagline}</p>
        <div className="well mt-4 h-[170px] overflow-hidden">
          <BuildVisual kind={h.visual} />
        </div>
        <p className="mt-4 text-[13.5px] leading-relaxed text-muted">{h.story}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {h.stack.map((s) => (
            <span key={s} className="rounded-md border border-line px-2 py-0.5 font-mono text-[10.5px] text-muted">
              {s}
            </span>
          ))}
        </div>
      </div>
      {/* perforation */}
      <div className="mx-5 border-t-2 border-dashed border-line sm:mx-0 sm:my-5 sm:border-l-2 sm:border-t-0" />
      {/* tear-off stub */}
      <div className="relative grid grid-cols-2 gap-4 p-5 font-mono sm:w-[170px] sm:grid-cols-1 sm:content-start">
        {field("Event", h.event)}
        {field("Place", h.place)}
        {field("Prize", h.prize)}
        {h.link ? (
          <a href={h.link} target="_blank" rel="noopener noreferrer" className="text-[12px] underline underline-offset-4">
            see the build ↗
          </a>
        ) : (
          field("Link")
        )}
        {/* barcode */}
        <div className="col-span-2 mt-2 flex h-8 items-end gap-[2px] sm:col-span-1" aria-hidden>
          {Array.from({ length: 34 }, (_, i) => (
            <span key={i} className="bg-ink" style={{ width: (i * 7) % 3 === 0 ? 2 : 1, height: "100%", opacity: 0.75 }} />
          ))}
        </div>
        {h.result && (
          <div className="absolute right-3 top-3 sm:right-8 sm:top-auto sm:bottom-14">
            <Stamp label={h.result} sub={h.event ? h.event.slice(0, 14) : "Build log"} rotate={-14 + index * 5} />
          </div>
        )}
      </div>
    </article>
  );
}

export default function Tickets() {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const seen = useRef(new Set<number>());
  useDragScroll(scroller);

  useEffect(() => {
    const el = scroller.current!;
    const cards = Array.from(el.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = cards.indexOf(e.target as HTMLElement);
          setActive(i);
          if (!seen.current.has(i) && seen.current.size > 0 && hackathons[i]?.result === "WINNER") {
            setToast(hackathons[i].project);
            setTimeout(() => setToast(null), 2200);
          }
          seen.current.add(i);
        }
      },
      { root: el, threshold: 0.6 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const pick = (i: number) => {
    const el = scroller.current!;
    const card = el.children[i] as HTMLElement;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
  };

  return (
    <section id="tickets" className="relative py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHead
          kicker="01 · Hackathon journey"
          title={<>A drawer full of <em>tickets</em></>}
          blurb="Every hackathon is a weekend-long sprint from blank page to demo day. Here are the ones that came home with a stamp. Drag or swipe to flip through."
        />
        <ArcTimeline active={active} onPick={pick} />
      </div>

      <div
        ref={scroller}
        className="mt-10 flex cursor-grab select-none snap-x snap-mandatory gap-6 overflow-x-auto px-[7vw] pb-10 pt-8 active:cursor-grabbing [scrollbar-width:none] sm:px-[calc(50vw-310px)]"
      >
        {hackathons.map((h, i) => (
          <Ticket key={h.id} h={h} index={i} />
        ))}
      </div>

      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 sm:px-6">
        <button onClick={() => pick(Math.max(0, active - 1))} className="press h-9 w-9 rounded-full border border-line bg-surface" aria-label="Previous ticket">←</button>
        <button onClick={() => pick(Math.min(hackathons.length - 1, active + 1))} className="press h-9 w-9 rounded-full border border-line bg-surface" aria-label="Next ticket">→</button>
        <span className="font-mono text-xs text-muted">
          {String(active + 1).padStart(2, "0")} / {String(hackathons.length).padStart(2, "0")}
        </span>
      </div>

      {/* Achievement unlocked toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2"
          >
            <div className="flex items-center gap-3 rounded-xl border-2 border-[#1b1a18] bg-[#fdf3c8] px-4 py-2.5 font-mono text-[12px] text-[#1b1a18] shadow-[4px_4px_0_#1b1a18]">
              <span className="text-xl">🏆</span>
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] opacity-70">Achievement unlocked</p>
                <p className="font-bold">{toast} · Winner</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
