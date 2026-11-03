"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { stack } from "@/content";
import { SectionHead } from "./ui";

/* Fake terminal running `npm install gargi`, one package at a time */
export default function Toolbox() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [typed, setTyped] = useState("");
  const [count, setCount] = useState(0);
  const cmd = "npm install gargi";

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(cmd.slice(0, i));
      if (i >= cmd.length) {
        clearInterval(t);
        let k = 0;
        const p = setInterval(() => {
          k++;
          setCount(k);
          if (k >= stack.length + 1) clearInterval(p);
        }, 70);
      }
    }, 55);
    return () => clearInterval(t);
  }, [inView]);

  const done = count > stack.length;

  return (
    <section className="mx-auto max-w-5xl px-4 py-28 sm:px-6">
      <SectionHead
        kicker="06 · Toolbox"
        title={<>What&apos;s in the <em>kitchen</em></>}
        blurb="Languages, frameworks and clouds she's shipped with, from ASP.NET backends to SageMaker models to Swift apps."
      />
      <div ref={ref} className="overflow-hidden rounded-2xl border border-[#2e2c29] bg-[#161514] font-mono text-[12.5px] text-[#d8d4cc] shadow-xl">
        <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[11px] text-white/40">~/gargi — zsh</span>
        </div>
        <div className="min-h-[260px] p-5">
          <p>
            <span className="text-[#7dffb0]">➜</span> <span className="text-[#8ab4ff]">~</span> {typed}
            {!done && count === 0 && <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-[#d8d4cc]" style={{ animation: "blink 1s steps(1) infinite" }} />}
          </p>
          {count > 0 && (
            <>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {stack.slice(0, count).map((s) => (
                  <span key={s}>
                    <span className="text-[#7dffb0]">+</span> {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-1.5 w-56 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full bg-[#7dffb0] transition-all" style={{ width: `${Math.min(100, (count / stack.length) * 100)}%` }} />
                </span>
                <span className="text-white/50">{Math.min(count, stack.length)}/{stack.length}</span>
              </div>
            </>
          )}
          {done && (
            <p className="mt-4">
              added {stack.length} packages, found <span className="text-[#7dffb0]">0 vulnerabilities</span> and <span className="text-[#febc2e]">1 matcha dependency</span> 🍵
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
