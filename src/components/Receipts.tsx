"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { receipts, sideQuests } from "@/content";
import { SectionHead } from "./ui";

function Printer({ r }: { r: (typeof receipts)[number] }) {
  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      {/* printer body */}
      <div className="relative z-10 rounded-2xl bg-gradient-to-b from-[#3a3835] to-[#24221f] p-3 shadow-xl">
        <div className="flex items-center justify-between px-2 pb-2">
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/50">IMPACT-O-MATIC</span>
          <span className="h-2 w-2 rounded-full bg-[#7dffb0] shadow-[0_0_8px_#7dffb0]" />
        </div>
        <div className="h-2.5 rounded-full bg-black/70 shadow-[inset_0_2px_3px_rgba(0,0,0,0.8)]" />
      </div>
      {/* paper feed */}
      <div className="relative -mt-2 overflow-hidden px-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={r.id}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.25 } }}
            transition={{ duration: 1.1, ease: [0.3, 0.7, 0.3, 1] }}
            className="receipt-edge bg-paper px-5 pb-8 pt-6 font-mono text-[12px] text-[#2a2826] shadow-md"
          >
            <p className="text-center text-[10px] tracking-[0.3em] opacity-75">*** RECEIPT ***</p>
            <p className="mt-3 text-center text-[15px] font-bold uppercase">{r.company}</p>
            <p className="text-center text-[11px] opacity-70">{r.role}</p>
            <p className="text-center text-[11px] opacity-75">{r.city} · {r.when}</p>
            <div className="my-3 border-t border-dashed border-[#2a2826]/40" />
            {r.lines.map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex gap-2 py-0.5"
              >
                <span className="shrink-0">{k}</span>
                <span className="mb-1 flex-1 border-b border-dotted border-[#2a2826]/40" />
                <span className="max-w-[55%] text-right font-bold">{v}</span>
              </motion.div>
            ))}
            <div className="my-3 border-t border-dashed border-[#2a2826]/40" />
            <div className="flex justify-between gap-3 text-[13px] font-bold">
              <span>TOTAL</span>
              <span className="text-right">{r.total}</span>
            </div>
            {r.badge && (
              <motion.p
                initial={{ scale: 1.6, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: -4 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 300, damping: 14 }}
                className="mt-4 inline-block rounded border-2 border-[#d6492f] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#d6492f]"
              >
                ★ {r.badge}
              </motion.p>
            )}
            <p className="mt-5 text-center text-[10px] opacity-75">THANK YOU · COME AGAIN</p>
            <div className="mt-2 flex h-6 justify-center gap-[2px]" aria-hidden>
              {Array.from({ length: 40 }, (_, i) => (
                <span key={i} className="h-full bg-[#2a2826]" style={{ width: (i * 5) % 3 === 0 ? 2 : 1 }} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Receipts() {
  const [sel, setSel] = useState(0);
  return (
    <section id="receipts" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-28">
      <SectionHead
        kicker="02 · Internship journey"
        title={<>Every stop prints a <em>receipt</em></>}
        blurb="From Lubbock to Houston to Berkeley. Pick a stop on the route and watch it print what she delivered there."
      />

      <div className="grid gap-12 md:grid-cols-[1fr_380px]">
        {/* route */}
        <ol className="relative">
          <span className="absolute bottom-3 left-[11px] top-3 w-[2px] bg-[repeating-linear-gradient(to_bottom,var(--line)_0_6px,transparent_6px_12px)]" aria-hidden />
          {receipts.map((r, i) => {
            const on = i === sel;
            return (
              <li key={r.id}>
                <button onClick={() => setSel(i)} className="group relative flex w-full items-start gap-4 rounded-xl py-3 pr-3 text-left">
                  <span
                    className={`relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      on ? "border-accent bg-accent text-white" : "border-line bg-surface text-muted group-hover:border-ink/40"
                    }`}
                  >
                    <span className="text-[10px]">{i + 1}</span>
                  </span>
                  <span className="relative z-10 flex-1 transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                    <span className="block font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">{r.when}</span>
                    <span className={`block text-[17px] transition-colors ${on ? "text-ink" : "text-ink/70 group-hover:text-ink"}`}>
                      {r.company}
                    </span>
                    <span className="block text-[13px] text-muted">{r.role}</span>
                  </span>
                  {on && <motion.span layoutId="route-pill" className="absolute inset-0 -z-0 rounded-xl bg-well" />}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="md:sticky md:top-10 md:self-start">
          <Printer r={receipts[sel]} />
        </div>
      </div>

      {/* side quests */}
      <div className="mt-16 overflow-hidden rounded-xl border border-line bg-surface py-3">
        <motion.div
          className="flex w-max gap-8 font-mono text-[12px] text-muted"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...sideQuests, ...sideQuests].map((s, i) => (
            <span key={i} className="whitespace-nowrap">✦ {s}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
