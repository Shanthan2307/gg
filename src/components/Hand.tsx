"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cards } from "@/content";
import { Foil, SectionHead } from "./ui";

function Card({ c }: { c: (typeof cards)[number] }) {
  const red = c.suit === "♥" || c.suit === "♦";
  const color = red ? "text-[#c8352b]" : "text-[#1b1a18]";
  const face = (
    <div className={`relative flex h-full w-full flex-col rounded-[14px] border border-black/10 bg-[#fffdf8] p-3 ${color}`}>
      <div className="leading-none">
        <p className="font-display text-2xl">{c.rank}</p>
        <p className="text-lg">{c.suit}</p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-1 text-center">
        <p className="font-display text-[19px] leading-tight text-[#1b1a18]">{c.title}</p>
        <p className="mt-1.5 text-[10.5px] leading-snug text-[#76726b]">{c.detail}</p>
      </div>
      <div className="rotate-180 self-end leading-none">
        <p className="font-display text-2xl">{c.rank}</p>
        <p className="text-lg">{c.suit}</p>
      </div>
    </div>
  );
  return c.foil ? <Foil className="h-full w-full rounded-[14px]">{face}</Foil> : face;
}

export default function Hand() {
  const [hover, setHover] = useState<number | null>(null);
  const [played, setPlayed] = useState<number | null>(null);
  const n = cards.length;
  // Horizontal gap and tilt per card, kept small enough that the outer cards stay inside the table
  const [layout, setLayout] = useState({ spread: 46, tilt: 5, lift: 175 });
  useEffect(() => {
    const fit = () => setLayout(window.innerWidth < 640 ? { spread: 20, tilt: 3, lift: 112 } : { spread: 46, tilt: 5, lift: 175 });
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <section id="hand" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-28">
      <SectionHead
        kicker="05 · Honors"
        title={<>The hand she&apos;s <em>holding</em></>}
        blurb="Point at a card to thumb through. Tap or click it to play it, and again to put it back. The shiny ones are foil, so drag across them."
      />

      <div
        className="well relative h-[372px] overflow-hidden sm:h-[480px]"
        onClick={(e) => e.target === e.currentTarget && setPlayed(null)}
      >
        {cards.map((c, i) => {
          const off = i - (n - 1) / 2;
          const fan = off * layout.tilt;
          const isPlayed = played === i;
          const lifted = hover === i && played === null;
          return (
            // Outer layer holds the card's place in the fan and is the stable hover target,
            // so lifting the card never pulls it out from under the cursor.
            <motion.button
              key={c.title}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              onClick={() => setPlayed(isPlayed ? null : i)}
             
              aria-pressed={isPlayed}
              className="absolute bottom-6 left-1/2 -ml-[75px] h-[215px] w-[150px] cursor-pointer sm:-ml-[87px] sm:h-[250px] sm:w-[175px]"
              style={{ zIndex: isPlayed ? 50 : lifted ? 40 : i, transformOrigin: "50% 180%" }}
              animate={{ x: isPlayed ? 0 : off * layout.spread, rotate: isPlayed ? 0 : fan }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              {/* Inner layer lifts and straightens so the text reads level */}
              <motion.div
                className="h-full w-full rounded-[14px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)]"
                animate={{
                  y: isPlayed ? -layout.lift : lifted ? -44 : 0,
                  rotate: lifted ? -fan : 0,
                  scale: isPlayed ? 1.08 : 1,
                  filter: played !== null && !isPlayed ? "brightness(0.9) saturate(0.4)" : "brightness(1) saturate(1)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <Card c={c} />
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
