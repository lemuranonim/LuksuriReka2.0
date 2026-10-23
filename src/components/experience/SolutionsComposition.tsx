"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, Vector3 } from "three";
import type { StudioState } from "@/lib/experience";
import { pointOnRoute, solutionPose, solutionRoute, solutionTimeline, tracedRoute, type SolutionPose } from "@/lib/solution-motion";
import { clippedPlane, extrusion, Plate } from "./StudioPrimitives";

interface Palette { pearl: string; surface: string; cyan: string }
interface Motion { elapsed: number; progress: number; light: boolean }
interface Layout { poses: SolutionPose[]; connections: number[]; flows: number[] }
const up = new Vector3(0, 1, 0);

function Module({ index, palette, layout }: { index: number; palette: Palette; layout: RefObject<Layout> }) {
  const body = useRef<Group>(null);
  const shape = useMemo(() => clippedPlane(1.34, 1.55, .095), []);
  const normal = useMemo(() => new Color(palette.pearl), [palette.pearl]);
  const accent = useMemo(() => new Color(palette.cyan), [palette.cyan]);
  const materials = useMemo(() => ({
    face: new MeshStandardMaterial({ color: palette.pearl, metalness: .2, roughness: .48, transparent: true }),
    side: new MeshStandardMaterial({ color: "#4e8e96", metalness: .22, roughness: .55, transparent: true }),
    glyph: new MeshBasicMaterial({ color: palette.surface, transparent: true }),
    socket: new MeshBasicMaterial({ color: palette.cyan, transparent: true }),
  }), [palette.pearl, palette.surface, palette.cyan]);
  useEffect(() => () => Object.values(materials).forEach(material => material.dispose()), [materials]);
  useFrame(() => {
    const pose = layout.current.poses[index];
    if (!body.current) return;
    body.current.position.set(...pose.position);
    body.current.rotation.y = pose.yaw;
    materials.face.color.lerpColors(normal, accent, pose.emphasis * .5);
    for (const material of Object.values(materials)) { material.opacity = pose.reveal; material.depthWrite = pose.reveal > .98; }
    body.current.visible = pose.reveal > .005;
  }, -1);
  return <group ref={body}>
    <mesh material={[materials.face, materials.side]}><extrudeGeometry args={[shape, { ...extrusion, depth: .13 }]} /></mesh>
    <group position={[0, 0, .185]}>
      {index === 0 && <>{[.32, .08, -.14].map((y, i) => <mesh key={y} position={[-.04, y, 0]} material={materials.glyph}><boxGeometry args={[i === 0 ? .78 : i === 1 ? .56 : .65, i === 0 ? .085 : .045, .025]} /></mesh>)}</>}
      {index === 1 && <>{[-.2, .2].flatMap(x => [-.16, .24].map(y => <mesh key={`${x}-${y}`} position={[x, y, 0]} material={materials.glyph}><boxGeometry args={[.25, .25, .025]} /></mesh>))}</>}
      {index === 2 && <>{[-1, 1].map(side => <group key={side}><mesh position={[side * .14, .025, 0]} rotation={[0, 0, side * .57]} material={materials.glyph}><boxGeometry args={[.026, .48, .025]} /></mesh><mesh position={[side * .27, -.18, .015]} material={materials.glyph}><circleGeometry args={[.09, 18]} /></mesh></group>)}<mesh position={[0, .26, .015]} material={materials.glyph}><circleGeometry args={[.09, 18]} /></mesh></>}
      <mesh position={[0, -.49, .005]} material={materials.glyph}><boxGeometry args={[.62, .025, .02]} /></mesh>
    </group>
    <mesh position={[0, -.775, .2]} material={materials.socket}><sphereGeometry args={[.042, 10, 8]} /></mesh>
  </group>;
}

function Cable({ index, palette, layout, state, inspect }: { index: number; palette: Palette; layout: RefObject<Layout>; state: RefObject<StudioState>; inspect: boolean }) {
  const segments = useRef<Group>(null);
  const signal = useRef<Mesh>(null);
  const start = useMemo(() => new Vector3(), []);
  const end = useMemo(() => new Vector3(), []);
  const direction = useMemo(() => new Vector3(), []);
  useFrame(() => {
    const current = layout.current;
    const route = solutionRoute(current.poses[index], current.poses[index + 1]);
    const trace = tracedRoute(route, current.connections[index]);
    segments.current?.children.forEach((segment, i) => {
      const piece = trace[i];
      segment.visible = piece.length > .001;
      if (!segment.visible) return;
      start.set(...piece.start); end.set(...piece.end);
      segment.position.copy(start).add(end).multiplyScalar(.5);
      segment.quaternion.setFromUnitVectors(up, direction.copy(end).sub(start).normalize());
      segment.scale.set(1, piece.length, 1);
    });
    if (signal.current) {
      const t = current.flows[index];
      signal.current.visible = t > 0 && t < 1 && current.connections[index] > .99;
      if (signal.current.visible) signal.current.position.set(...pointOnRoute(route, t));
    }
    if (inspect && current.connections[index] === 1 && segments.current && state.current.solutionMetrics) {
      const first = segments.current.children[0], last = segments.current.children[2];
      start.set(0, -.5 * first.scale.y, 0).applyQuaternion(first.quaternion).add(first.position);
      end.set(0, .5 * last.scale.y, 0).applyQuaternion(last.quaternion).add(last.position);
      const error = Math.max(start.distanceTo(direction.set(...route[0])), end.distanceTo(direction.set(...route[3])));
      state.current.solutionMetrics.portError = Math.max(state.current.solutionMetrics.portError ?? 0, error);
    }
  }, -1);
  return <>
    <group ref={segments}>{[0, 1, 2].map(i => <mesh key={i}><cylinderGeometry args={[.018, .018, 1, 8]} /><meshBasicMaterial color={palette.cyan} /></mesh>)}</group>
    <mesh ref={signal} visible={false}><sphereGeometry args={[.052, 12, 8]} /><meshBasicMaterial color="#efffff" /></mesh>
  </>;
}

export default function SolutionsComposition({ state, motion, palette, inspect }: { state: RefObject<StudioState>; motion: RefObject<Motion>; palette: Palette; inspect: boolean }) {
  const { invalidate } = useThree();
  const layout = useRef<Layout>({ poses: [0, 1, 2].map(index => solutionPose(index, 0, 0, 0, false)), connections: [0, 0], flows: [0, 0] });
  const weights = useRef([0, 0, 0]);
  const interaction = useRef({ focus: -1, pulse: 0, elapsed: 10, previousElapsed: 0 });
  useEffect(() => () => { state.current.solutionMoving = false; state.current.solutionMetrics = undefined; }, [state]);
  useFrame((_, delta) => {
    const current = state.current;
    if (!current.visible || current.stage !== "solutions") { current.solutionMoving = false; return; }
    const clock = motion.current;
    const timeline = solutionTimeline(clock.elapsed, clock.light);
    const interactionState = interaction.current;
    const restarted = clock.elapsed < interactionState.previousElapsed;
    if (current.focus !== interactionState.focus || (current.solutionPulse ?? 0) !== interactionState.pulse || restarted) {
      interactionState.elapsed = current.focus >= 0 ? 0 : 10;
      interactionState.focus = current.focus;
      interactionState.pulse = current.solutionPulse ?? 0;
    } else interactionState.elapsed += Math.min(delta, .05);
    interactionState.previousElapsed = clock.elapsed;
    let settling = false;
    const amount = 1 - Math.exp(-Math.min(delta, .05) * 11);
    weights.current = weights.current.map((weight, index) => {
      const target = current.focus === index ? 1 : 0;
      const change = target - weight;
      if (Math.abs(change) < .001) return target;
      settling = true;
      return weight + change * amount;
    });
    const pulseDuration = clock.light ? .42 : .72;
    const interacting = interactionState.elapsed < pulseDuration && current.focus >= 0;
    const flow = interacting ? interactionState.elapsed / pulseDuration : timeline.flow;
    layout.current = {
      poses: timeline.reveals.map((reveal, index) => solutionPose(index, reveal, weights.current[index], clock.progress, clock.light)),
      connections: timeline.connections,
      flows: [0, 1].map(index => current.focus > index ? 1 - flow : flow),
    };
    const moving = !timeline.settled || settling || interacting;
    current.solutionMoving = moving;
    if (inspect) current.solutionMetrics = { phase: interacting && timeline.settled ? "interaction" : timeline.phase, focus: current.focus, connections: [...timeline.connections], portError: null, moving };
    if (moving) invalidate();
  }, -2);
  return <>
    <group position={[.055, -.12, -.43]}><Plate width={5.24} height={3.48} color="#1b4651" /></group>
    <group position={[0, -.08, -.29]}><Plate width={5.12} height={3.4} color={palette.surface} /></group>
    {[0, 1, 2].map(index => <Module key={index} index={index} palette={palette} layout={layout} />)}
    {[0, 1].map(index => <Cable key={index} index={index} palette={palette} layout={layout} state={state} inspect={inspect} />)}
  </>;
}
