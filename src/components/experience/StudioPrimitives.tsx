import { useMemo } from "react";
import { Shape, Vector2 } from "three";

export const extrusion = { depth: .16, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .022, bevelThickness: .022, curveSegments: 6 };

export function clippedPlane(width: number, height: number, corner = .14) {
  const x = width / 2, y = height / 2;
  return new Shape([[-x + corner, -y], [x - corner, -y], [x, -y + corner], [x, y - corner], [x - corner, y], [-x + corner, y], [-x, y - corner], [-x, -y + corner]].map(([a, b]) => new Vector2(a, b)));
}

export function Plate({ width, height, color, depth = .08 }: { width: number; height: number; color: string; depth?: number }) {
  const shape = useMemo(() => clippedPlane(width, height), [width, height]);
  return <mesh><extrudeGeometry args={[shape, { ...extrusion, depth, bevelSize: .016, bevelThickness: .016 }]} /><meshStandardMaterial color={color} roughness={.6} metalness={.18} /></mesh>;
}
