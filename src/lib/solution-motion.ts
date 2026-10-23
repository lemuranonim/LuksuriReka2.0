import { clamp } from "./experience";

export type Point3 = [number, number, number];
export interface SolutionPose { position: Point3; yaw: number; reveal: number; emphasis: number; port: Point3 }
const ease = (t: number) => { const n = clamp(t, 0, 1); return n * n * (3 - 2 * n); };

export function solutionTimeline(elapsed: number, light: boolean) {
  const t = Math.max(0, elapsed) / (light ? .65 : 1);
  const reveals = [0, 1, 2].map(index => ease((t - index * .12) / .72));
  const connections = [0, 1].map(index => ease((t - .46 - index * .12) / .66));
  const flow = clamp((t - 1.25) / .65, 0, 1);
  const phase = t >= 1.9 ? "settled" : t >= 1.25 ? "flow" : t >= .46 ? "connecting" : "assembly";
  return { reveals, connections, flow, phase, settled: t >= 1.9 } as const;
}

export function solutionPose(index: number, reveal: number, emphasis: number, progress: number, light: boolean): SolutionPose {
  const r = clamp(reveal, 0, 1), focus = clamp(emphasis, 0, 1), strength = light ? .3 : 1;
  const entering = 1 - r;
  const x = (index - 1) * (1.62 + entering * .1 * strength);
  const y = (index === 1 ? .08 : -.04) - entering * .35 * strength + focus * .14 * strength;
  const z = .16 + entering * .28 * strength + clamp(progress, 0, 1) * .1 * strength + focus * .28 * strength;
  const yaw = (index - 1) * (-.055 - entering * .12 * strength) + focus * .035 * strength;
  // The socket belongs to the card, including its turn and depth displacement.
  const port: Point3 = [x + Math.sin(yaw) * .2, y - .775, z + Math.cos(yaw) * .2];
  return { position: [x, y, z], yaw, reveal: r, emphasis: focus, port };
}

export function solutionRoute(from: SolutionPose, to: SolutionPose): Point3[] {
  const bus = -1.24;
  return [from.port, [from.port[0], bus, from.port[2]], [to.port[0], bus, to.port[2]], to.port];
}

export function pointOnRoute(points: Point3[], progress: number): Point3 {
  const lengths = points.slice(1).map((point, i) => Math.hypot(...point.map((n, j) => n - points[i][j])));
  let distance = clamp(progress, 0, 1) * lengths.reduce((sum, n) => sum + n, 0);
  for (let i = 0; i < lengths.length; i++) {
    if (distance <= lengths[i] || i === lengths.length - 1) {
      const t = lengths[i] ? clamp(distance / lengths[i], 0, 1) : 0;
      return points[i].map((n, j) => n + (points[i + 1][j] - n) * t) as Point3;
    }
    distance -= lengths[i];
  }
  return points[0];
}

export function tracedRoute(points: Point3[], progress: number) {
  const lengths = points.slice(1).map((point, i) => Math.hypot(...point.map((n, j) => n - points[i][j])));
  const total = lengths.reduce((sum, n) => sum + n, 0);
  let distance = clamp(progress, 0, 1) * total;
  return lengths.map((length, i) => {
    const t = length ? clamp(distance / length, 0, 1) : 0;
    distance -= length;
    return { start: points[i], end: points[i].map((n, j) => n + (points[i + 1][j] - n) * t) as Point3, length: length * t };
  });
}
