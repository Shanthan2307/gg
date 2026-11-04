"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { research } from "@/content";
import { Foil, SectionHead } from "./ui";

/* Stacked peeking cards: click the stack to bring the next poster forward */
export default function Lab() {
  const [order, setOrder] = useState(research.map((_, i) => i));
  const next = () => setOrder((o) => [...o.slice(1), o[0]]);

  return (
    <section id="lab" className="mx-auto max-w-5xl px-4 py-28 sm:px-6">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <div>
          <SectionHead
            kicker="03 · Research"
            title={<>Pages from the <em>lab notebook</em></>}
            blurb="Before the hackathons, there was research. As a freshman she won two awards at Texas Tech's Undergraduate Research Conference, then came back the next year with two more projects."
          />
          <div className="inline-flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
            <span className="text-2xl">⚑</span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">TrUE Scholars Program</p>
              <p className="text-sm">
                Promoted <span className="text-muted line-through">Toreador</span> → <b>Matador</b>
              </p>
            </div>
          </div>
        </div>

        <button onClick={next} className="group relative h-[380px] w-full text-left">
          <span className="sr-only">Show the next research project.</span>
          <AnimatePresence initial={false}>
            {order.map((idx, pos) => {
              const r = research[idx];
              const body = (
                <div className="grain flex h-full flex-col rounded-2xl border border-line bg-paper p-6 text-[#2a2826]">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] opacity-75">
                    <span>URC · {r.year}</span>
                    <span>fig. {idx + 1}</span>
                  </div>
                  <h3 className="mt-5 font-display text-[28px] leading-tight">{r.title}</h3>
                  <p className="mt-4 text-[14px] leading-relaxed opacity-75">{r.note}</p>
                  <div className="mt-auto flex items-end justify-between">
                    {r.award ? (
                      <span className="rounded-full bg-[#2a2826] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#fdf3c8]">
                        🏆 2 awards
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-widest opacity-75">presented</span>
                    )}
                    {pos === 0 && <span className="font-mono text-[10px] opacity-75">tap for next →</span>}
                  </div>
                </div>
              );
              return (
                <motion.div
                  key={idx}
                  className="absolute inset-x-0 top-0 h-[330px]"
                  style={{ zIndex: research.length - pos }}
                  animate={{ y: pos * 18, scale: 1 - pos * 0.05, rotate: pos === 0 ? 0 : pos % 2 ? 2.5 : -2.5, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                >
                  {/* the top page lifts off the stack on hover */}
                  <div className={`h-full transition-transform duration-300 ease-out ${pos === 0 ? "group-hover:-translate-y-2 group-hover:-rotate-1" : ""}`}>
                    {r.award ? <Foil className="h-full rounded-2xl">{body}</Foil> : body}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </button>
      </div>
    </section>
  );
}
