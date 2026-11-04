// ResQ dispatch model: pure numbers, no DOM. Everything the figure moves or prints comes from here.
// The map is a model, not a real survey: 1 world unit = 20 m, a delivery drone cruises at 15 m/s,
// and the ZIP codes are real Lubbock ZIPs standing in for a fire-season request.

import type { Plane } from "../../iso/iso-kit";

export const METERS_PER_UNIT = 20;
export const CRUISE_MS = 15;
export const ALTITUDE = 58; // world units above the map while cruising
export const STATION_PAD: Plane = [-70, -36];

export interface Center {
  id: string;
  name: string;
  zip: string;
  pad: Plane;
}

export const CENTERS: Center[] = [
  { id: "a", name: "Relief center A", zip: "79415", pad: [106, -40] },
  { id: "b", name: "Relief center B", zip: "79401", pad: [-62, 66] },
  { id: "c", name: "Relief center C", zip: "79423", pad: [92, 46] },
];

export const distanceUnits = (a: Plane, b: Plane) => Math.hypot(b[0] - a[0], b[1] - a[1]);
export const km = (c: Center) => (distanceUnits(STATION_PAD, c.pad) * METERS_PER_UNIT) / 1000;
export const etaMin = (c: Center) => Math.round((km(c) * 1000) / CRUISE_MS / 60);

// Flights are time-lapsed legs, each eased from where the drone is to where it goes next,
// so a new request mid-flight never makes the drone jump.
export const LIFT_S = 1.1;
export const HOLD_S = 1.4;
export const REST_S = 0.8;

export type Phase = "matched" | "en route" | "delivered" | "returning" | "standing by";

export interface Pose {
  x: number;
  y: number;
  z: number;
}

export const HOME: Pose = { x: STATION_PAD[0], y: STATION_PAD[1], z: 0 };

export interface Leg {
  to: Pose;
  seconds: number;
  phase: Phase;
  crate: boolean;
}

const liftS = (dz: number) => Math.max(0.15, (LIFT_S * Math.abs(dz)) / ALTITUDE);
const cruiseS = (a: Plane, b: Plane) => (distanceUnits(a, b) < 0.5 ? 0 : 1.2 + distanceUnits(a, b) / 110);

/**
 * Every leg of a delivery to `c`, starting from wherever the drone is now.
 * Still carrying a crate: it reroutes straight to the new center. Empty and away: it fetches a new crate first.
 */
export function legsFor(from: Pose, c: Center, carrying: boolean): Leg[] {
  const [sx, sy] = STATION_PAD;
  const [tx, ty] = c.pad;
  const legs: Leg[] = [];
  let here = from;
  const atHome = (p: Pose) => p.z < 0.01 && Math.hypot(p.x - sx, p.y - sy) < 0.5;
  if (!carrying && !atHome(here)) {
    legs.push({ to: { ...here, z: ALTITUDE }, seconds: liftS(ALTITUDE - here.z), phase: "returning", crate: false });
    legs.push({ to: { x: sx, y: sy, z: ALTITUDE }, seconds: cruiseS([here.x, here.y], STATION_PAD), phase: "returning", crate: false });
    legs.push({ to: HOME, seconds: LIFT_S, phase: "returning", crate: false });
    here = HOME;
  }
  if (atHome(here)) legs.push({ to: here, seconds: 0.5, phase: "matched", crate: true });
  legs.push({ to: { ...here, z: ALTITUDE }, seconds: liftS(ALTITUDE - here.z), phase: "en route", crate: true });
  legs.push({ to: { x: tx, y: ty, z: ALTITUDE }, seconds: cruiseS([here.x, here.y], c.pad), phase: "en route", crate: true });
  legs.push({ to: { x: tx, y: ty, z: 0 }, seconds: LIFT_S, phase: "en route", crate: true });
  legs.push({ to: { x: tx, y: ty, z: 0 }, seconds: HOLD_S, phase: "delivered", crate: false });
  legs.push({ to: { x: tx, y: ty, z: ALTITUDE }, seconds: LIFT_S, phase: "returning", crate: false });
  legs.push({ to: { x: sx, y: sy, z: ALTITUDE }, seconds: cruiseS(c.pad, STATION_PAD), phase: "returning", crate: false });
  legs.push({ to: HOME, seconds: LIFT_S, phase: "returning", crate: false });
  legs.push({ to: HOME, seconds: REST_S, phase: "standing by", crate: true });
  return legs.filter((leg) => leg.seconds > 0);
}

export const ease = (t: number) => {
  const u = Math.min(1, Math.max(0, t));
  return u * u * (3 - 2 * u);
};

export const between = (a: Pose, b: Pose, t: number): Pose => {
  const u = ease(t);
  return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, z: a.z + (b.z - a.z) * u };
};

export const readoutOf = (c: Center, phase: Phase) => `ZIP ${c.zip} · ${phase} · ${km(c).toFixed(1)} km · ${etaMin(c)} min`;
