// Static art for the ResQ figure, built once as SVG strings on the server.
// Painter's order: plate, map inlays, terrain, pads, [live route + shadow], buildings, [live drone].

import * as k from "../../iso/iso-kit";
import type { Plan, Plane, Point3 } from "../../iso/iso-kit";
import { CENTERS, METERS_PER_UNIT, STATION_PAD } from "./model";
import { HEIGHTS, BUILDINGS, COUNTER, COUNTER_H, FOOT_H, HILL, P, PAD_H, PAD_R, PLATE, PLATE_H, STATION, STATION_H, TOWER, TOWER_TOP } from "./view";

const at = (point: Point3) => k.iso(point, P);
const S = k.solidSvg;
const L = k.lineSvg;
const D = k.dotsSvg;
const depth = ([x, y]: Plane) => k.depthOf([x, y, 0], P);
const byDepth = <T,>(items: T[], where: (item: T) => Plane) => [...items].sort((a, b) => depth(where(a)) - depth(where(b)));

/* A closed outline on the +y face (the one facing lower left) */
function onFrontY(y: number, x0: number, x1: number, z0: number, z1: number, closed = false) {
  return k.pathOf([at([x0, y, z0]), at([x0, y, z1]), at([x1, y, z1]), at([x1, y, z0])], closed);
}

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 24), (p) => p)) {
    out.push(S(k.cylinder(x, y, 8, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 6.2, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.4), { tone: "mid", inner: L(k.sideSeam(PLATE, -4, P), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 11);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  return out.join("");
}

/* The map printed on the plate: a river, a survey grid of dots, a true-scale ruler and a label plate */
function mapInlays() {
  const out: string[] = [];
  const river = (offset: number) =>
    Array.from({ length: 61 }, (_, i): Plane => {
      const x = -149.4 + (298.8 * i) / 60;
      return [x, -8 + offset + 6 * Math.sin(x / 40)];
    });
  out.push(L(k.onTop(river(-2.2), 0, P), { tone: "faint" }), L(k.onTop(river(2.2), 0, P), { tone: "faint" }));
  const grid: Point3[] = [];
  for (let x = -125; x <= 125; x += 25) for (let y = -65; y <= 65; y += 26) grid.push([x, y, 0]);
  out.push(D(k.pointsAt(grid, P), { size: 0.45, tone: "faint" }));

  // 1 unit = 20 m, so a tick every 5 units is 100 m and a major every 25 units is 500 m
  const strip: Plan = { x: -82, y: 80.5, w: 176, d: 6, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 3, strip.x + strip.w - 3, 5, 5, strip.y + 0.6, 0.6, [1.8, 3.4], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 1.6, strip.y + 3, 0.6]), at([strip.x + strip.w - 1.6, strip.y + 3, 0.6])], { size: 0.45 }));
  out.push(`<!-- ruler: 25 units = ${25 * METERS_PER_UNIT} m -->`);

  const label: Plan = { x: -140, y: 74, w: 48, d: 11, r: 1 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3, 0.3), { tone: "mid" }));
  out.push(k.faceTextSvg(k.topMatrix([label.x + 4, label.y + 5.6], 0.8, P, "x"), "RESQ", { size: 3.6, tone: "mid" }));
  for (const [i, y] of [3, 6, 8.6].entries()) {
    out.push(L(k.lineOnTop([label.x + 22, label.y + y], [label.x + 44 - i * 6, label.y + y], 0.8, P), { tone: "faint", free: true }));
  }
  out.push(D([at([label.x + 1.6, label.y + 1.6, 0.8]), at([label.x + label.w - 1.6, label.y + label.d - 1.6, 0.8])], { size: 0.4 }));
  return out.join("");
}

/* Contour terrain: four stacked lifts cut along wandering contour lines, like a relief model */
const contour = (level: number): Plane[] => {
  const cx = HILL.x + HILL.w / 2, cy = HILL.y + HILL.d / 2;
  const scale = 1 - level * 0.24;
  return Array.from({ length: 72 }, (_, i): Plane => {
    const t = (i / 72) * Math.PI * 2;
    const wobble = 1 + 0.1 * Math.sin(3 * t + level * 0.9) + 0.06 * Math.sin(5 * t + 1.3 + level);
    return [cx + 1.5 * level + Math.cos(t) * (HILL.w / 2) * scale * wobble, cy - level + Math.sin(t) * (HILL.d / 2) * scale * wobble];
  });
};

function terrain() {
  const out: string[] = [];
  for (let level = 0; level < 4; level++) {
    out.push(S(k.extrude(contour(level), level * 2.6, 2.6, P, { convex: false }), { tone: level === 3 ? "mid" : "lo", crease: "faint" }));
  }
  const [px, py] = contour(3).reduce(([ax, ay], [x, y]) => [ax + x / 72, ay + y / 72], [0, 0]);
  const top = 4 * 2.6;
  out.push(L(k.ring(px, py, 1.8, top, P, 14), { tone: "mid" }), D([at([px, py, top])], { size: 0.5, tone: "hi" }));
  return out.join("");
}

function pad([x, y]: Plane, r: number, part: string) {
  const out: string[] = [];
  out.push(S(k.cylinder(x, y, r, 0, PAD_H, P, 40, 0.4), { tone: "mid" }));
  out.push(L(k.ring(x, y, r - 2.4, PAD_H, P, 36), { tone: "lo" }));
  const a = r - 2.4;
  out.push(L(k.lineOnTop([x - a, y], [x + a, y], PAD_H, P) + k.lineOnTop([x, y - a], [x, y + a], PAD_H, P), { tone: "faint" }));
  out.push(D([at([x, y, PAD_H])], { size: 0.6, tone: "mid" }));
  return `<g data-part="${part}">${out.join("")}</g>`;
}

export function pads() {
  return [pad(STATION_PAD, PAD_R + 1.5, "pad-station"), ...CENTERS.map((c) => pad(c.pad, PAD_R, `pad-${c.id}`))].join("");
}

function station() {
  const out: string[] = [];
  const s = STATION;
  out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(s, -2), 0, 0.1, P)}" style="filter:blur(5px)"/>`);
  out.push(S(k.slabOf(s, 0, STATION_H, P, 3, 0.7), { tone: "hi", inner: L(k.sideSeam(s, 14, P, 3), { tone: "faint" }) }));
  out.push(S(k.slabOf(k.insetPlan(s, 1.6), STATION_H, 1.6, P, 3, 0.4), { tone: "mid" }));
  // two engine-bay doors on the face toward the pad, each with roll-up slats
  const face = s.y + s.d;
  for (const x0 of [s.x + 4, s.x + 19]) {
    out.push(L(onFrontY(face, x0, x0 + 12, 0, 11), { tone: "mid" }));
    const slats = [2.2, 4.4, 6.6, 8.8].map((z) => k.segment([x0, face, z], [x0 + 12, face, z], P)).join("");
    out.push(L(slats, { tone: "faint" }));
  }
  // windows on the upper floor
  for (const x0 of [s.x + 5, s.x + 12, s.x + 19, s.x + 26]) out.push(L(onFrontY(face, x0, x0 + 4, 15, 19, true), { tone: "lo" }));
  // hose tower with its beacon
  const [tx, ty] = TOWER;
  out.push(S(k.cylinder(tx, ty, 5, STATION_H + 1.6, TOWER_TOP - STATION_H - 1.6, P, 28), { tone: "hi", inner: L(k.sideArc(tx, ty, 5, 32, P, 18), { tone: "faint" }) }));
  out.push(S(k.cylinder(tx, ty, 5.8, TOWER_TOP, 1.4, P, 28), { tone: "mid" }));
  out.push(S(k.cylinder(tx, ty, 2.4, TOWER_TOP + 1.4, 2.6, P, 20), { tone: "mid", crease: "none", inner: L(k.sideArc(tx, ty, 2.4, TOWER_TOP + 2.7, P, 14), { tone: "red" }) }));
  out.push(D([at([tx, ty, TOWER_TOP + 4])], { size: 0.7, tone: "hi" }));
  out.push(D(k.corners(k.insetPlan(s, 1.6), 2.4).map(([x, y]) => at([x, y, STATION_H + 1.6])), { size: 0.4 }));
  return `<g data-part="station">${out.join("")}</g>`;
}

function center(id: string) {
  const b = BUILDINGS[id];
  const BUILDING_H = HEIGHTS[id];
  const out: string[] = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(b, -2), 0, 0.1, P)}" style="filter:blur(5px)"/>`);
  out.push(S(k.slabOf(b, 0, BUILDING_H, P, 3, 0.6), { tone: "hi" }));
  // parapet with a recessed roof
  out.push(L(k.planOutline(k.insetPlan(b, 2), BUILDING_H, P, 3), { tone: "lo" }));
  const unit: Plan = { x: b.x + 6, y: b.y + 5, w: 9, d: 7, r: 1 };
  out.push(S(k.slabOf(unit, BUILDING_H, 3.4, P, 2, 0.3), { tone: "mid" }));
  out.push(D(k.dotGrid(unit.x + 2.1, unit.y + 2.3, 3, 2, 2.4, BUILDING_H + 3.4, P), { size: 0.4, tone: "lo" }));
  // relief cross panel on the roof
  const cx = b.x + b.w - 8, cy = b.y + b.d - 8;
  out.push(L(k.ring(cx, cy, 4.2, BUILDING_H, P, 24), { tone: "mid" }));
  out.push(L(k.lineOnTop([cx - 4.2, cy], [cx + 4.2, cy], BUILDING_H, P) + k.lineOnTop([cx, cy - 4.2], [cx, cy + 4.2], BUILDING_H, P), { tone: "red" }));
  // loading door and windows on the face toward its pad
  const face = b.y + b.d;
  out.push(L(onFrontY(face, b.x + b.w - 12, b.x + b.w - 4, 0, 8), { tone: "mid" }));
  for (const x0 of [b.x + 4, b.x + 10]) out.push(L(onFrontY(face, x0, x0 + 4, 9, 13, true), { tone: "lo" }));
  return `<g data-part="center-${id}" data-center="${id}" class="resq-center">${out.join("")}</g>`;
}

function counter() {
  const c = COUNTER;
  const out: string[] = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(c, 0, 0.1, P)}" style="filter:blur(5px)"/>`);
  out.push(S(k.slabOf(c, 0, COUNTER_H, P, 4, 0.6), { tone: "hi", inner: L(k.sideSeam(c, 3, P, 4), { tone: "faint" }) }));
  const face = c.y + c.d;
  out.push(L(onFrontY(face, c.x + 3, c.x + 26, 4.6, 10.4), { tone: "mid" }));
  out.push(L(k.pathOf([at([c.x + 3, face, 4.6]), at([c.x + 26, face, 4.6])]), { tone: "lo" }));
  const knob: Plane = [c.x + c.w - 6, c.y + 8];
  out.push(S(k.cylinder(knob[0], knob[1], 3.4, COUNTER_H, 4, P, 28), { tone: "mid" }));
  out.push(L(k.knurl(knob[0], knob[1], 3.4, COUNTER_H + 0.4, COUNTER_H + 3.6, 22, P), { tone: "lo" }));
  out.push(L(k.lineOnTop(knob, [knob[0] + 3.4, knob[1]], COUNTER_H + 4, P), { tone: "hi" }));
  out.push(D(k.corners(c, 3).map(([x, y]) => at([x, y, COUNTER_H])), { size: 0.45 }));
  return `<g data-part="counter">${out.join("")}</g>`;
}

/** Digits on the counter window: one transform per wheel, text written live */
export const DIGIT_TRANSFORMS = Array.from({ length: 5 }, (_, i) => k.sideMatrix([COUNTER.x + 5.4 + i * 4.4, COUNTER.y + COUNTER.d], 9.2, P, "left"));

export function buildings() {
  const parts: { plane: Plane; svg: string }[] = [
    { plane: [STATION.x + STATION.w / 2, STATION.y + STATION.d / 2], svg: station() },
    ...Object.keys(BUILDINGS).map((id) => {
      const b = BUILDINGS[id];
      return { plane: [b.x + b.w / 2, b.y + b.d / 2] as Plane, svg: center(id) };
    }),
    { plane: [COUNTER.x + COUNTER.w / 2, COUNTER.y + COUNTER.d / 2], svg: counter() },
  ];
  return byDepth(parts, (p) => p.plane)
    .map((p) => p.svg)
    .join("");
}

export const ground = () => plate() + mapInlays() + terrain();

/* The drone, built at the world origin with its skids at z = 0. The live layer translates it. */
export const ROTORS: Plane[] = [
  [-17, 0],
  [0, -17],
  [17, 0],
  [0, 17],
];
export const ROTOR_Z = 9.8;
export const ROTOR_R = 7.6;

export function droneParts() {
  const back: string[] = [];
  // skids and legs, back to front
  const skid = (y: number) => S(k.slabOf({ x: -11, y, w: 22, d: 2, r: 1 }, 0, 1.2, P, 3), { tone: "mid" });
  const legs = (y: number) => [-6, 6].map((x) => S(k.slabOf({ x: x - 0.8, y: y + 0.2, w: 1.6, d: 1.6, r: 0.4 }, 1.2, 3.8, P, 2), { tone: "mid", crease: "none" })).join("");
  back.push(skid(-7.5), legs(-7.5));
  const crate = `<g data-part="crate">${S(k.slabOf({ x: -5, y: -5, w: 10, d: 10, r: 0.8 }, 1.2, 4.6, P, 2, 0.3), { tone: "hi" })}${L(
    k.lineOnTop([-5, 0], [5, 0], 5.8, P) + k.lineOnTop([0, -5], [0, 5], 5.8, P),
    { tone: "red" },
  )}</g>`;
  back.push(crate, skid(5.5), legs(5.5));

  const arm = (plan: Plan) => S(k.slabOf(plan, 6.6, 1.6, P, 2, 0.3), { tone: "mid" });
  const motor = ([x, y]: Plane) =>
    S(k.cylinder(x, y, 2.6, 6, 3.4, P, 20), { tone: "hi", inner: L(k.sideArc(x, y, 2.6, 7.6, P, 12), { tone: "faint" }) }) +
    S(k.cylinder(x, y, 1, 9.4, 0.4, P, 12), { tone: "mid", crease: "none" });
  back.push(arm({ x: -16, y: -1.2, w: 9, d: 2.4, r: 0.8 }), arm({ x: -1.2, y: -16, w: 2.4, d: 9, r: 0.8 }));
  back.push(motor(ROTORS[0]), motor(ROTORS[1]));

  const body = S(k.slabOf({ x: -8, y: -8, w: 16, d: 16, r: 4 }, 5, 4.5, P, 6, 0.6), {
    tone: "hi",
    inner: L(k.sideSeam({ x: -8, y: -8, w: 16, d: 16, r: 4 }, 7, P, 6), { tone: "faint" }),
  });
  const gps = S(k.cylinder(0, 0, 3.4, 9.5, 2, P, 28, 0.4), { tone: "hi", lit: true }) + L(k.ring(0, 0, 1.8, 11.5, P, 16), { tone: "lit" });
  const front = [arm({ x: 7, y: -1.2, w: 9, d: 2.4, r: 0.8 }), arm({ x: -1.2, y: 7, w: 2.4, d: 9, r: 0.8 }), motor(ROTORS[2]), motor(ROTORS[3])];
  // nose light on the +x arm
  front.push(D([at([8.2, 0, 7.4])], { size: 0.7, tone: "hi" }));
  return back.join("") + body + `<g data-part="gps">${gps}</g>` + front.join("");
}

/** The rotor discs' rims, drawn faint like a blur; blades are drawn live */
export const rotorRims = () => L(ROTORS.map(([x, y]) => k.ring(x, y, ROTOR_R, ROTOR_Z, P, 36)).join(""), { tone: "faint", dotted: true });
