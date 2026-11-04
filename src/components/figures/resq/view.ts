// World layout and camera for the ResQ figure. x and y lie on the map, z is up, 1 unit = 20 m.

import { boxCorners, fitProjection, type Plan, type Point3 } from "../../iso/iso-kit";
import { ALTITUDE, CENTERS, STATION_PAD } from "./model";

export const WIDTH = 640;
export const HEIGHT = 400;

export const PLATE: Plan = { x: -150, y: -90, w: 300, d: 180, r: 10 };
export const PLATE_H = 12;
export const FOOT_H = 5;
export const PAD_R = 9;
export const PAD_H = 1;
export const DRONE_TOP = 12; // tallest drone part above its skids

export const STATION: Plan = { x: -128, y: -82, w: 42, d: 30, r: 2 };
export const STATION_H = 22;
export const TOWER: [number, number] = [-95, -73];
export const TOWER_TOP = 42;

export const BUILDINGS: Record<string, Plan> = {
  a: { x: 62, y: -84, w: 32, d: 24, r: 2 },
  b: { x: -118, y: 30, w: 30, d: 24, r: 2 },
  c: { x: 40, y: 8, w: 30, d: 24, r: 2 },
};
export const HEIGHTS: Record<string, number> = { a: 16, b: 21, c: 13 };

export const HILL: Plan = { x: -42, y: 32, w: 74, d: 40, r: 16 };
export const COUNTER: Plan = { x: 112, y: 62, w: 34, d: 20, r: 3 };
export const COUNTER_H = 12;

const flights: Point3[] = [STATION_PAD, ...CENTERS.map((c) => c.pad)].map(([x, y]) => [x, y, PAD_H + ALTITUDE + DRONE_TOP]);

export const P = fitProjection([...boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...flights, [TOWER[0], TOWER[1], TOWER_TOP + 4]], WIDTH, HEIGHT, {
  pad: 18,
  azimuth: 45,
});
