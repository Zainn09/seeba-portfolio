"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Center } from "@react-three/drei";
import type { Group } from "three";

const DISPLAY_FONT = "/fonts/space-grotesk-700.woff";
const MONO_FONT = "/fonts/dm-mono-400.woff";

const FRAGMENTS = ["PYTHON", "JAVA", "LOGIC", "BUILD", "LEARN", "SOLVE", "AI", "ML"];

function useMouseRotation(group: React.RefObject<Group>, strength = 0.35) {
  const { size } = useThree();
  useFrame((state) => {
    const el = group.current;
    if (!el) return;
    const t = state.clock.getElapsedTime();
    const mx = state.pointer.x;
    const my = state.pointer.y;
    // gentle idle drift + subtle cursor follow
    el.rotation.y = Math.sin(t * 0.22) * 0.28 + mx * strength;
    el.rotation.x = Math.sin(t * 0.16) * 0.06 - my * strength * 0.5;
    el.position.y = Math.sin(t * 0.6) * 0.07;
    if (size.width < 640) el.rotation.y = Math.sin(t * 0.22) * 0.5;
  });
}

/**
 * "AH" monogram as stacked real-font layers — a lightweight faux-extrusion
 * that reads as a dimensional sculpture without heavy geometry.
 */
function Monogram() {
  const group = useRef<Group>(null);
  useMouseRotation(group, 0.4);
  const layers = useMemo(() => Array.from({ length: 7 }, (_, i) => i), []);

  return (
    <group ref={group}>
      <Center>
        {layers.map((i) => (
          <Text
            key={i}
            font={DISPLAY_FONT}
            fontSize={2.2}
            letterSpacing={0.02}
            position={[0, 0, (i - 3) * 0.022]}
            frustumCulled={false}
            characters="AH"
          >
            AH
            <meshStandardMaterial
              color={i === 3 ? "#B8F56A" : "#0d1420"}
              metalness={0.5}
              roughness={0.35}
              emissive={i === 3 ? "#B8F56A" : "#000000"}
              emissiveIntensity={i === 3 ? 0.28 : 0}
              side={2}
            />
          </Text>
        ))}
      </Center>
    </group>
  );
}

function OrbitRing({
  radius,
  count,
  color,
  spin,
  font,
  tilt = 0.32,
}: {
  radius: number;
  count: number;
  color: string;
  spin: number;
  font: string;
  tilt?: number;
}) {
  const ref = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * spin;
    ref.current.rotation.x = state.pointer.y * -0.08;
  });

  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return {
          angle,
          text: FRAGMENTS[i % FRAGMENTS.length],
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius * 0.42,
          y: Math.sin(angle) * radius * tilt,
        };
      }),
    [count, radius, tilt]
  );

  return (
    <group ref={ref}>
      {items.map((it, i) => (
        <Text
          key={i}
          font={font}
          fontSize={0.19}
          position={[it.x, it.y, it.z]}
          frustumCulled={false}
          characters="PYTHONJAVLOGICBUESAI ML"
          letterSpacing={0.06}
        >
          {it.text}
          <meshBasicMaterial color={color} transparent opacity={0.75} />
        </Text>
      ))}
    </group>
  );
}

export default function AHScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.6], fov: 42 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 5, 6]} intensity={1.6} />
      <pointLight position={[-5, -2, -4]} intensity={0.7} color="#7DE2D1" />
      <Monogram />
      <OrbitRing radius={3.1} count={8} color="#7DE2D1" spin={0.08} font={MONO_FONT} />
      <OrbitRing radius={3.8} count={10} color="#A7B5FF" spin={-0.05} font={MONO_FONT} tilt={0.4} />
    </Canvas>
  );
}
