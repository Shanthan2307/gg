"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { iso, lineOnTop, translateAlong } from "../../iso/iso-kit";
import { ALTITUDE, CENTERS, HOME, STATION_PAD, between, legsFor, readoutOf, type Leg, type Phase, type Pose } from "./model";
import { HEIGHT, P, PAD_H, WIDTH } from "./view";

const TOUR_BACK_MS = 6000;
const MOST_DT = 1 / 30;

interface Props {
  label: string;
  ground: string;
  pads: string;
  buildings: string;
  drone: string;
  rims: string;
  digits: string[];
  rotors: [number, number][];
  rotorZ: number;
  rotorR: number;
}

export default function ResQLive({ label, ground, pads, buildings, drone, rims, digits, rotors, rotorZ, rotorR }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const droneG = useRef<SVGGElement>(null);
  const blades = useRef<SVGPathElement>(null);
  const shadow = useRef<SVGGElement>(null);
  const route = useRef<SVGPathElement>(null);
  const digitText = useRef<(SVGTextElement | null)[]>([]);
  const [target, setTarget] = useState(0);
  const [status, setStatus] = useState(readoutOf(CENTERS[0], "matched"));

  // flight state lives in refs: the loop writes attributes and never re-renders per frame
  const pose = useRef<Pose>({ ...HOME });
  const legs = useRef<Leg[]>([]);
  const legFrom = useRef<Pose>({ ...HOME });
  const legT = useRef(0);
  const carrying = useRef(true);
  const spin = useRef(0);
  const touring = useRef(true);
  const resumeAt = useRef(0);
  const targetRef = useRef(0);

  const say = useCallback((text: string) => {
    const slot = stage.current?.closest(".iso-plate")?.querySelector("[data-readout]");
    if (slot && slot.textContent !== text) slot.textContent = text;
  }, []);

  const showTarget = useCallback((i: number) => {
    const c = CENTERS[i];
    c.zip.split("").forEach((d, n) => {
      const el = digitText.current[n];
      if (el) el.textContent = d;
    });
    route.current?.setAttribute("d", lineOnTop(STATION_PAD, c.pad, PAD_H + 0.05, P));
    if (stage.current) stage.current.dataset.target = c.id;
  }, []);

  const draw = useCallback(
    (phase: Phase) => {
      const { x, y, z } = pose.current;
      droneG.current?.setAttribute("transform", translateAlong(P, [x, y, z + PAD_H]));
      shadow.current?.setAttribute("transform", translateAlong(P, [x, y, 0]));
      shadow.current?.setAttribute("opacity", String(0.85 - (z / ALTITUDE) * 0.55));
      const crate = droneG.current?.querySelector<SVGGElement>('[data-part="crate"]');
      if (crate) crate.style.display = carrying.current ? "" : "none";
      const a = spin.current;
      const d = rotors
        .map(([rx, ry], i) => {
          const t = a * (i % 2 ? -1 : 1) + i;
          const dx = Math.cos(t) * (rotorR - 0.8), dy = Math.sin(t) * (rotorR - 0.8);
          return lineOnTop([rx - dx, ry - dy], [rx + dx, ry + dy], rotorZ + 0.2, P);
        })
        .join("");
      blades.current?.setAttribute("d", d);
      const text = readoutOf(CENTERS[targetRef.current], phase);
      say(text);
      setStatus((s) => (s === text ? s : text));
    },
    [rotors, rotorR, rotorZ, say],
  );

  const dispatch = useCallback(
    (i: number, byHand: boolean) => {
      targetRef.current = i;
      setTarget(i);
      showTarget(i);
      if (byHand) {
        touring.current = false;
        resumeAt.current = performance.now() + TOUR_BACK_MS;
      }
      legs.current = legsFor(pose.current, CENTERS[i], carrying.current);
      legFrom.current = { ...pose.current };
      legT.current = 0;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // one designed still: the drone hovers halfway along the route with its crate
        const c = CENTERS[i];
        pose.current = { x: (STATION_PAD[0] + c.pad[0]) / 2, y: (STATION_PAD[1] + c.pad[1]) / 2, z: ALTITUDE };
        carrying.current = true;
        legs.current = [];
        spin.current = 0.6;
        draw("en route");
      }
    },
    [draw, showTarget],
  );

  useEffect(() => {
    const el = stage.current!;
    let frame = 0;
    let last = 0;
    let visible = false;
    let phase: Phase = "matched";
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, MOST_DT) : 1 / 60;
      last = now;
      const leg = legs.current[0];
      if (leg) {
        legT.current += dt / leg.seconds;
        pose.current = between(legFrom.current, leg.to, legT.current);
        phase = leg.phase;
        if (legT.current >= 1) {
          carrying.current = leg.crate;
          pose.current = { ...leg.to };
          legFrom.current = { ...leg.to };
          legT.current = 0;
          legs.current.shift();
        } else if (leg.phase === "delivered") carrying.current = false;
      } else {
        // trip done: the tour picks the next center, or a hand-picked one waits for the tour to resume
        if (touring.current || now > resumeAt.current) {
          touring.current = true;
          dispatch((targetRef.current + 1) % CENTERS.length, false);
        }
      }
      const flying = pose.current.z > 0.05 || (leg && leg.phase !== "delivered" && leg.phase !== "standing by" && leg.phase !== "matched");
      spin.current += dt * (flying ? 26 : 2);
      draw(phase);
      frame = visible ? requestAnimationFrame(tick) : 0;
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting && !matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (visible && !frame) {
          last = 0;
          frame = requestAnimationFrame(tick);
        }
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(el);
    dispatch(0, false);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) draw("matched");
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [dispatch, draw]);

  const onClick = (e: React.MouseEvent) => {
    const id = (e.target as Element).closest<SVGGElement>("[data-center]")?.dataset.center;
    const i = CENTERS.findIndex((c) => c.id === id);
    if (i >= 0) dispatch(i, true);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    dispatch((target + step + CENTERS.length) % CENTERS.length, true);
  };

  const halo = iso([0, 0, 0], P);
  return (
    <>
      <div
        ref={stage}
        className="iso-stage resq-stage"
        tabIndex={0}
        role="group"
        aria-label="ResQ dispatch map. Use the arrow keys to send the drone to another relief center."
        onClick={onClick}
        onKeyDown={onKey}
      >
        <svg className="iso-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label} focusable="false">
          <g dangerouslySetInnerHTML={{ __html: ground }} />
          <g dangerouslySetInnerHTML={{ __html: pads }} />
          <path ref={route} className="iso-line resq-route" data-tone="lit" data-flow="" d="" />
          <g ref={shadow}>
            <ellipse className="resq-shadow" cx={halo[0]} cy={halo[1]} rx={15} ry={8.5} />
          </g>
          <g dangerouslySetInnerHTML={{ __html: buildings }} />
          {digits.map((t, n) => (
            <text
              key={n}
              ref={(el) => {
                digitText.current[n] = el;
              }}
              className="iso-face-text"
              data-tone="hi"
              transform={t}
              fontSize={3.8}
              textAnchor="middle"
            >
              {CENTERS[0].zip[n]}
            </text>
          ))}
          <g ref={droneG} data-part="drone">
            <g dangerouslySetInnerHTML={{ __html: drone }} />
            <g dangerouslySetInnerHTML={{ __html: rims }} />
            {/* blade tips stop in the air, like a pointer tip */}
            <path ref={blades} className="iso-line" data-tone="hi" data-free="" d="" />
          </g>
        </svg>
      </div>
      <div className="resq-picks" role="group" aria-label="Choose a relief request">
        {CENTERS.map((c, i) => (
          <button key={c.id} type="button" className="press resq-pick" aria-pressed={target === i} onClick={() => dispatch(i, true)}>
            <span className="font-mono">{c.zip}</span>
            <span>{c.name.replace("Relief center ", "Center ")}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {status.includes("delivered") || status.includes("matched") ? status : ""}
      </p>
    </>
  );
}
