"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { stamps } from "@/content";
import { SectionHead } from "./ui";

const inks = ["#d6492f", "#2f5fd6", "#2f7d5b", "#8a3fb5", "#b8741a"];
const shapes = ["rounded-full", "rounded-xl", "rounded-[40%_60%_55%_45%]", "rounded-md"];

export default function Passport() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="passport" className="mx-auto max-w-5xl px-4 py-28 sm:px-6">
      <SectionHead
        kicker="04 · Beyond the code"
        title={<>A passport full of <em>stamps</em></>}
        blurb="Senator, ambassador, mentor, president. At Texas Tech she showed up for nearly everything, and made each place a bit better for whoever came next. Tap a stamp for the story."
      />

      <div className="card relative overflow-hidden p-3 sm:p-5">
        {/* passport page */}
        <div className="grain relative rounded-xl border border-line bg-[color-mix(in_oklab,var(--paper)_88%,var(--accent-2))] p-5 dark:bg-[#1f2420] sm:p-8">
          <div className="mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
            <span>Visas · Texas Tech University</span>
            <span>2022 — 2026</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-5">
            {stamps.map((s, i) => {
              const ink = inks[i % inks.length];
              const rot = ((i * 37) % 22) - 11;
              return (
                <motion.button
                  key={s.title}
                  onClick={() => setOpen(open === i ? null : i)}
                  initial={{ scale: 1.8, opacity: 0, rotate: rot - 20 }}
                  whileInView={{ scale: 1, opacity: 1, rotate: rot }}
                  whileHover={{ scale: 1.06, rotate: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ type: "spring", stiffness: 380, damping: 17, delay: (i % 5) * 0.07 }}
                  style={{ color: ink, borderColor: ink }}
                  className={`mx-auto flex aspect-square w-full max-w-[130px] flex-col items-center justify-center border-[2.5px] border-dashed p-2 text-center ${shapes[i % shapes.length]} ${open === i ? "bg-white/60 dark:bg-white/5" : ""}`}
                >
                  <span className="text-2xl leading-none">{s.icon}</span>
                  <span className="mt-1.5 font-mono text-[9.5px] font-bold uppercase leading-tight tracking-wider">{s.title}</span>
                  <span className="mt-1 text-[9px] leading-tight opacity-70">{s.org}</span>
                  {s.when && <span className="mt-1 font-mono text-[8.5px] opacity-60">{s.when}</span>}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {open !== null && (
              <motion.div
                key={open}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-8 flex items-start gap-4 rounded-xl border border-line bg-surface p-4"
              >
                <span className="text-3xl" style={{ color: inks[open % inks.length] }}>{stamps[open].icon}</span>
                <div>
                  <p className="font-medium">
                    {stamps[open].title} <span className="text-muted">· {stamps[open].org}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">{stamps[open].story}</p>
                </div>
                <button onClick={() => setOpen(null)} className="ml-auto text-muted hover:text-ink" aria-label="Close">✕</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
