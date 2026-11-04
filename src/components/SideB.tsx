"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "@/content";
import { SectionHead, Stamp, TactileButton, useCopy } from "./ui";

const tracks = [
  { side: "A", title: "Hi, I'm Gargi", length: 20 },
  { side: "B", title: "A song, sung live", length: 34 },
];

function Reel({ spinning, size }: { spinning: boolean; size: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-full bg-[#2a2826]"
      style={{ width: 64, height: 64, boxShadow: `0 0 0 ${size}px #3d3a36` }}
    >
      <div
        className="relative h-9 w-9 rounded-full border-[3px] border-[#fdfaf3] bg-[#e9e3d6]"
        style={{ animation: spinning ? "spin 2.4s linear infinite" : "none" }}
      >
        {[0, 60, 120].map((r) => (
          <span key={r} className="absolute left-1/2 top-1/2 h-[3px] w-full -translate-x-1/2 -translate-y-1/2 bg-[#2a2826]" style={{ transform: `translate(-50%,-50%) rotate(${r}deg)` }} />
        ))}
      </div>
    </div>
  );
}

/* Cassette player: plays a placeholder timeline until real clips are added */
function Cassette() {
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const len = tracks[track].length;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setT((v) => {
        if (v + 0.1 >= len) {
          setPlaying(false);
          return 0;
        }
        return v + 0.1;
      });
    }, 100);
    return () => clearInterval(id);
  }, [playing, len]);

  const p = t / len;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="mx-auto w-full max-w-[420px] rounded-[22px] bg-[#1e1d1b] p-4 shadow-2xl">
      <div className="rounded-xl bg-[#f4efe4] p-4 text-[#2a2826]">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] opacity-75">
          <span>Side {tracks[track].side}</span>
          <span>Gargi · mixtape</span>
        </div>
        <p className="mt-1 font-display text-2xl">{tracks[track].title}</p>
        <div className="mt-3 flex items-center justify-around rounded-lg bg-[#1e1d1b] py-4">
          <Reel spinning={playing} size={Math.round(14 - p * 12)} />
          <div className="h-6 w-20 rounded bg-[#2a2826]" />
          <Reel spinning={playing} size={Math.round(2 + p * 12)} />
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[11px] opacity-70">
          <span>{fmt(t)}</span>
          <span className="mx-3 h-1 flex-1 overflow-hidden rounded-full bg-[#2a2826]/15">
            <span className="block h-full bg-[#d6492f]" style={{ width: `${p * 100}%` }} />
          </span>
          <span>{fmt(len)}</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "⏮", act: () => { setTrack((track + 1) % 2); setT(0); }, aria: "Flip side" },
          { label: playing ? "❚❚" : "▶", act: () => setPlaying(!playing), aria: playing ? "Pause" : "Play" },
          { label: "⏹", act: () => { setPlaying(false); setT(0); }, aria: "Stop" },
        ].map((b) => (
          <button
            key={b.aria}
            onClick={b.act}
            aria-label={b.aria}
            className="rounded-lg bg-[#3a3835] pb-[4px] text-white transition-all active:translate-y-[3px] active:pb-[1px]"
          >
            <span className="block rounded-lg bg-gradient-to-b from-[#5a5752] to-[#44413d] py-2.5 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">{b.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Whisk() {
  return (
    <div className="relative h-16 w-16">
      <div className="absolute bottom-0 left-1/2 h-8 w-16 -translate-x-1/2 rounded-b-full bg-matcha/80" />
      <motion.div
        className="absolute left-1/2 top-0 h-10 w-3 -translate-x-1/2 rounded-b-full border-2 border-[#c9a56b] bg-[#e7cf9f]"
        animate={{ x: ["-90%", "-10%", "-90%"], rotate: [-12, 12, -12] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute bottom-7 h-1.5 w-1.5 rounded-full bg-matcha/50"
          style={{ left: 18 + i * 12 }}
          animate={{ y: [0, -14], opacity: [0.8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </div>
  );
}

export default function SideB() {
  const { copied, copy } = useCopy();
  return (
    <section id="contact" className="mx-auto max-w-5xl px-4 pb-40 pt-28 sm:px-6">
      <SectionHead
        kicker="07 · Side B"
        title={<>Off the clock, <em>on the record</em></>}
        blurb="She's also a professional singer. Flip the tape over, or skip straight to saying hello."
      />
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Cassette />

        <div className="flex flex-col gap-6">
          <div className="card flex items-center gap-4 p-5">
            <Whisk />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Currently</p>
              <p className="font-display text-2xl">matcha + yaps</p>
            </div>
          </div>

          <div className="card p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Say hi</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="break-all font-display text-2xl">{profile.email}</span>
              <button
                onClick={() => copy(profile.email)}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 font-mono text-[11px] text-muted hover:text-ink"
              >
                {copied ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24"><motion.path d="M4 12l5 5L20 6" fill="none" stroke="var(--accent-2)" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /></svg>
                    copied
                  </>
                ) : (
                  "copy"
                )}
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <TactileButton href={`mailto:${profile.email}`}>Write to me ✉</TactileButton>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="press flex items-center rounded-xl border border-line px-4 text-sm hover:bg-well">
                LinkedIn ↗
              </a>
              <a href={profile.x} target="_blank" rel="noopener noreferrer" className="press flex items-center rounded-xl border border-line px-4 text-sm hover:bg-well">
                X ↗
              </a>
              <a href={profile.topmate} target="_blank" rel="noopener noreferrer" className="press flex items-center rounded-xl border border-line px-4 text-sm hover:bg-well">
                Book a call on Topmate ↗
              </a>
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center rounded-xl border border-line px-4 text-sm hover:bg-well">
                  GitHub ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hiring card: a ticket stub that hands over the resume */}
      <article id="hire" className="ticket card relative mt-16 flex flex-col overflow-visible sm:flex-row">
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Admit one · New grad, May 2026</p>
          <h3 className="mt-3 font-display text-4xl leading-none sm:text-5xl">
            Wanna <em>hire me?</em>
          </h3>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
            Full stack and AI engineer with shipped internships, research awards and a drawer full of hackathon tickets. The whole log fits on one page.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <TactileButton href={profile.resume} download="Gargi-Pathak-Resume.pdf">
              Download my resume <span aria-hidden>↓</span>
            </TactileButton>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="press flex h-10 items-center rounded-xl border border-line px-4 text-sm hover:bg-well">
              View in browser ↗
            </a>
            <a href={profile.topmate} target="_blank" rel="noopener noreferrer" className="press flex h-10 items-center rounded-xl border border-line px-4 text-sm hover:bg-well">
              Book a call ↗
            </a>
          </div>
        </div>
        <div className="mx-6 border-t-2 border-dashed border-line sm:mx-0 sm:my-6 sm:border-l-2 sm:border-t-0" />
        <div className="flex items-center justify-center p-6 sm:w-[200px]">
          <Stamp label="Open" sub="to work" rotate={-10} size={110} color="var(--accent-2)" />
        </div>
      </article>

      <footer className="mt-24 text-center font-mono text-[11px] text-muted">
        <p>✂ - - - - - - - - - - - - - - - - - - - - - - -</p>
        <p className="mt-3">THANKS FOR VISITING · BUILT BETWEEN LUBBOCK &amp; SF · © {new Date().getFullYear()} GARGI PATHAK</p>
      </footer>
    </section>
  );
}
