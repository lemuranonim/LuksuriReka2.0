"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Group, Path, Shape, Vector2, Vector3, type DirectionalLight } from "three";
import { assemblyReveal, type ExperienceMode, type ExperienceStage, type StudioState } from "@/lib/experience";
import outline from "./logo-outline.json";
import SolutionsComposition from "./SolutionsComposition";
import { extrusion, Plate } from "./StudioPrimitives";

interface Palette { ink: string; pearl: string; surface: string; cyan: string; muted: string }
interface Props {
  state: RefObject<StudioState>;
  active: boolean;
  mode: ExperienceMode;
  palette: Palette;
  inspect: boolean;
  onReady: (stage: ExperienceStage) => void;
  onFailure: () => void;
  onSlow: () => void;
}

interface MotionState { elapsed: number; reveal: number; progress: number; light: boolean }

function Logo({ palette, motion }: { palette: Palette; motion: RefObject<MotionState> }) {
  const pieces = useRef<Group>(null);
  const shapes = useMemo(() => outline.outlines.map(item => {
    const shape = new Shape(item.outer.map(([x, y]) => new Vector2(x, y)));
    shape.holes = item.holes.map(points => new Path(points.map(([x, y]) => new Vector2(x, y))));
    return shape;
  }), []);
  useFrame(() => {
    pieces.current?.children.forEach((piece, index) => {
      const offset = 1 - assemblyReveal(motion.current.elapsed, index, motion.current.light);
      const strength = motion.current.light ? .3 : 1;
      piece.position.set((index ? 1 : -1) * offset * .16 * strength, (index ? -1 : 1) * offset * .65 * strength, offset * .7 * strength);
      piece.rotation.z = (index ? -.08 : .08) * offset * strength;
    });
  }, -1);
  return <group ref={pieces}>{shapes.map((shape, index) => <mesh key={index}>
    <extrudeGeometry args={[shape, extrusion]} />
    <meshStandardMaterial attach="material-0" color={palette.pearl} metalness={.3} roughness={.43} />
    <meshStandardMaterial attach="material-1" color={palette.cyan} metalness={.35} roughness={.48} />
  </mesh>)}</group>;
}

function Scene({ state, active, palette, inspect, onReady, onSlow }: Pick<Props, "state" | "active" | "palette" | "inspect" | "onReady" | "onSlow">) {
  const { invalidate, viewport } = useThree();
  const scene = useRef<Group>(null);
  const mark = useRef<Group>(null);
  const identity = useRef<Group>(null);
  const modules = useRef<Group>(null);
  const display = useRef<Group>(null);
  const frontPlate = useRef<Group>(null);
  const backPlate = useRef<Group>(null);
  const workFace = useRef<Group>(null);
  const workflow = useRef<Group>(null);
  const light = useRef<DirectionalLight>(null);
  const firstFrame = useRef(true);
  const lastStage = useRef<ExperienceStage | null>(null);
  const frames = useRef(0);
  const readyCallback = useRef(onReady);
  const slowCallback = useRef(onSlow);
  const samples = useRef({ frames: 0, sum: 0, bad: 0, warmup: 0 });
  const wasMoving = useRef(false);
  const targetPosition = useMemo(() => new Vector3(), []);
  const targetScale = useMemo(() => new Vector3(), []);
  const readyFrame = useRef(0);
  const sequence = useRef<{ stage: ExperienceStage | null; elapsed: number; replay: number }>({ stage: null, elapsed: 0, replay: 0 });
  const motion = useRef<MotionState>({ elapsed: 0, reveal: 0, progress: 0, light: false });

  useEffect(() => {
    state.current.invalidate = invalidate;
    return () => { state.current.invalidate = undefined; };
  }, [state, invalidate]);

  useEffect(() => () => cancelAnimationFrame(readyFrame.current), []);
  useEffect(() => { if (!active) wasMoving.current = false; }, [active]);

  useFrame(({ gl }, delta) => {
    if (!state.current.visible || !scene.current || !mark.current) return;
    const current = state.current;
    const isIdentity = current.stage === "identity", isSolutions = current.stage === "solutions";
    const entering = sequence.current.stage !== current.stage || sequence.current.replay !== (current.replay ?? 0);
    if (entering) { sequence.current.stage = current.stage; sequence.current.elapsed = 0; sequence.current.replay = current.replay ?? 0; }
    else sequence.current.elapsed += Math.min(delta, .05);
    const reveal = assemblyReveal(sequence.current.elapsed, 2, current.reduced);
    const amount = firstFrame.current || entering ? 1 : 1 - Math.exp(-Math.min(delta, .05) * 7);
    const progressChange = Math.abs(motion.current.progress - current.progress);
    motion.current = { elapsed: sequence.current.elapsed, reveal, progress: motion.current.progress + (current.progress - motion.current.progress) * amount, light: current.reduced };
    const travel = current.reduced ? 0 : motion.current.progress;
    const opening = (1 - reveal) * (current.reduced ? .2 : 1);
    const scale = Math.min(viewport.width / 5.7, viewport.height / (isSolutions ? 4.3 : 4.7));
    scene.current.scale.setScalar(scale);
    const targetX = (isIdentity ? -.08 + travel * .16 : isSolutions ? -.12 + travel * .1 : -.12 + travel * .12) - opening * .08;
    const targetY = (isIdentity ? -.32 - travel * .24 : isSolutions ? -.18 + travel * .2 : -.13 + travel * .16) - opening * .18 + (current.reduced ? 0 : current.pointer.x * .1);
    const targetZ = isIdentity ? -.08 : isSolutions ? .02 : .01;
    let change = progressChange + Math.abs(scene.current.rotation.x - targetX) + Math.abs(scene.current.rotation.y - targetY) + Math.abs(scene.current.rotation.z - targetZ);
    scene.current.rotation.x += (targetX - scene.current.rotation.x) * amount;
    scene.current.rotation.y += (targetY - scene.current.rotation.y) * amount;
    scene.current.rotation.z += (targetZ - scene.current.rotation.z) * amount;
    const spread = .12 + travel * .38 + opening * .5;
    targetPosition.set(isIdentity ? 0 : isSolutions ? -2.05 : -1.66, isIdentity ? .05 : isSolutions ? -1.52 : .83, isIdentity ? .18 + spread * .45 : .42);
    change += mark.current.position.distanceTo(targetPosition);
    mark.current.position.lerp(targetPosition, amount);
    const markScale = isIdentity ? 1 : isSolutions ? .08 : .13;
    change += Math.abs(mark.current.scale.x - markScale);
    targetScale.setScalar(markScale);
    mark.current.scale.lerp(targetScale, amount);
    if (identity.current) identity.current.visible = isIdentity;
    if (modules.current) modules.current.visible = isSolutions;
    if (display.current) display.current.visible = !isIdentity && !isSolutions;
    if (frontPlate.current) frontPlate.current.position.z = -.25 - spread * .28;
    if (backPlate.current) {
      backPlate.current.position.set(-.06 - spread * .22, .04 + spread * .13, -.39 - spread * .85);
      backPlate.current.rotation.z = -.055 - spread * .07;
    }
    if (workFace.current) workFace.current.position.z = .18 + opening * .6 + travel * .12;
    if (workflow.current) workflow.current.children.forEach((node, index) => {
      const offset = 1 - assemblyReveal(sequence.current.elapsed, index, current.reduced);
      node.position.y = -offset * (current.reduced ? .12 : .55);
      node.position.z = offset * (current.reduced ? .05 : .4);
    });
    if (light.current) {
      light.current.position.x = -3 + current.pointer.x + opening * 4;
      light.current.position.y = 5 - current.pointer.y * .7;
    }
    firstFrame.current = false;
    if (lastStage.current !== current.stage) {
      const stage = current.stage;
      cancelAnimationFrame(readyFrame.current);
      // Acknowledge only after this composition was actually submitted for a frame.
      readyFrame.current = requestAnimationFrame(() => {
        if (state.current.stage === stage && state.current.visible) {
          lastStage.current = stage;
          readyCallback.current(stage);
        }
      });
    }
    const moving = reveal < 1 || change > .002 || (isSolutions && Boolean(current.solutionMoving));
    if (inspect) state.current.metrics = { stage: current.stage, frames: ++frames.current, calls: gl.info.render.calls, triangles: gl.info.render.triangles, geometries: gl.info.memory.geometries, textures: gl.info.memory.textures, dpr: gl.getPixelRatio(), reveal, progress: motion.current.progress, moving };
    if (moving && !current.reduced) {
      const sample = samples.current;
      if (wasMoving.current && sample.warmup++ > 12) {
        sample.frames++; sample.sum += Math.min(delta, .2);
        if (sample.frames >= 24) {
          if (sample.sum / sample.frames > .04) sample.bad++;
          else sample.bad = 0;
          sample.frames = 0; sample.sum = 0;
          if (sample.bad >= 2) { slowCallback.current(); sample.bad = 0; }
        }
      }
      invalidate();
    } else if (moving) invalidate();
    wasMoving.current = moving;
  }, -3);

  return <>
    <ambientLight intensity={1.2} />
    <directionalLight ref={light} position={[-3, 5, 7]} intensity={3.5} color="#ffffff" />
    <directionalLight position={[4, -2, 3]} intensity={1.2} color={palette.cyan} />
    <group ref={scene}>
      <group ref={identity}><group ref={frontPlate} position={[0, 0, -.25]}><Plate width={4.3} height={4.1} color={palette.surface} depth={.1} /></group><group ref={backPlate} position={[0, 0, -.39]} rotation={[0, 0, -.055]}><Plate width={4.5} height={4.3} color="#24515b" depth={.08} /></group></group>
      <group ref={mark}><Logo palette={palette} motion={motion} /></group>
      <group ref={modules} visible={false}>
        <SolutionsComposition state={state} motion={motion} palette={palette} inspect={inspect} />
      </group>
      <group ref={display} visible={false}>
        <Plate width={5} height={3.1} color={palette.surface} depth={.13} />
        <group ref={workFace} position={[0, -.05, .18]}><Plate width={4.5} height={2.62} color={palette.pearl} depth={.025} />
          <group ref={workflow} position={[0, -.06, .08]}>{[-1.35, 0, 1.35].map((x, i) => <group key={x} position={[x, 0, 0]}><mesh><boxGeometry args={[.85, .78, .035]} /><meshStandardMaterial color={i === 1 ? palette.cyan : "#c3d3d1"} roughness={.7} /></mesh><mesh position={[0, -.64, .01]}><boxGeometry args={[.6, .045, .02]} /><meshBasicMaterial color={palette.surface} /></mesh>{i < 2 && <mesh position={[.68, 0, -.015]}><boxGeometry args={[.5, .025, .02]} /><meshBasicMaterial color={palette.surface} /></mesh>}</group>)}</group>
          <mesh position={[.5, .85, .08]}><boxGeometry args={[2.6, .025, .02]} /><meshBasicMaterial color="#a2b8b6" /></mesh>
        </group>
        <group position={[0, -1.7, -.3]} rotation={[-.3, 0, 0]}><Plate width={4.8} height={.25} color="#24505b" /></group>
      </group>
    </group>
  </>;
}

export default function StudioCanvas({ state, active, mode, palette, inspect, onReady, onFailure, onSlow }: Props) {
  const contextEvents = useRef<AbortController | null>(null);
  useEffect(() => () => { contextEvents.current?.abort(); state.current.loseContext = undefined; state.current.metrics = undefined; }, [state]);
  return <Canvas orthographic={false} camera={{ position: [0, 0, 10], fov: 34, near: .1, far: 30 }}
    dpr={mode === "light" ? 1 : [1, 1.5]} frameloop={active ? "demand" : "never"}
    gl={{ alpha: true, antialias: mode !== "light", powerPreference: "low-power", preserveDrawingBuffer: false }}
    onCreated={({ gl }) => {
      contextEvents.current?.abort(); contextEvents.current = new AbortController();
      gl.domElement.addEventListener("webglcontextlost", event => { event.preventDefault(); onFailure(); }, { signal: contextEvents.current.signal });
      gl.setClearColor(0x000000, 0); gl.domElement.dataset.lrScene = "studio";
      if (inspect && gl.getContext().getExtension("WEBGL_lose_context")) state.current.loseContext = () => gl.forceContextLoss();
    }}
    fallback={<span className="lr-visually-hidden">Static composition</span>}>
    <Scene state={state} active={active} palette={palette} inspect={inspect} onReady={onReady} onSlow={onSlow} />
  </Canvas>;
}
