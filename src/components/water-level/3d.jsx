'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { subscribeWaterLevelEcho } from './echoBridge';
import { fetchWaterLevels } from './waterLevelApi';

// ─── Model GLB ────────────────────────────────────────────────────────
// File: public/3d/iotfix-v1.glb
// Animasi 100 frame: 1 = aman, 50 = siaga, 100 = bahaya
function FloodModel({ waterLevel }) {
    const group = useRef();
    const { scene, animations } = useGLTF('/3d/iotfix-v1.glb');
    const { actions, mixer } = useAnimations(animations, group);
    const smoothLevel = useRef(0);
    const actionRef = useRef(null);
    const initialized = useRef(false);

    // Inisialisasi animasi sekali saja
    useEffect(() => {
        if (!initialized.current && Object.keys(actions).length > 0) {
            // Ambil action pertama (clip utama)
            const firstAction = Object.values(actions)[0];
            if (firstAction) {
                firstAction.play();
                firstAction.paused = true;
                firstAction.time = 0;
                actionRef.current = firstAction;
                initialized.current = true;
            }
        }
    }, [actions]);

    // Update posisi animasi berdasarkan waterLevel (1–100)
    useFrame((_, delta) => {
        if (!actionRef.current) return;

        const clip = actionRef.current.getClip();
        const duration = clip.duration;

        // Normalisasi level: clamp 0–100, lalu map ke 0–duration
        const target = Math.min(Math.max(waterLevel, 0), 100) / 100 * duration;

        // Smooth interpolation supaya transisi halus
        smoothLevel.current += (target - smoothLevel.current) * Math.min(1, delta / 0.4);

        actionRef.current.time = smoothLevel.current;
        mixer.update(0); // paksa mixer apply frame
    });

    return (
        <group ref={group}>
            <primitive object={scene} />
        </group>
    );
}

// ─── Scene 3D ─────────────────────────────────────────────────────────
function Scene({ waterLevel }) {
    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[8, 14, 6]} intensity={1.0} />
            <directionalLight position={[-6, 4, -8]} intensity={0.35} color="#38bdf8" />
            <FloodModel waterLevel={waterLevel} />
            <OrbitControls
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2}
                enablePan={false}
                minDistance={1.5}
                maxDistance={6}
            />
        </>
    );
}

// ─── Label Status ─────────────────────────────────────────────────────
function getStatus(level) {
    if (level >= 80) return { label: 'BAHAYA', color: 'text-red-500', bg: 'bg-red-500/20 border-red-500/40' };
    if (level >= 50) return { label: 'SIAGA', color: 'text-yellow-400', bg: 'bg-yellow-400/20 border-yellow-400/40' };
    return { label: 'AMAN', color: 'text-emerald-400', bg: 'bg-emerald-400/20 border-emerald-400/40' };
}

// ─── Komponen Utama ───────────────────────────────────────────────────
/**
 * @param {{
 *   sensorId?: string | null,
 *   height?: number,
 *   className?: string,
 * }} props
 */
export default function Flood3DScene({
    sensorId = null,
    height = 400,
    className = '',
}) {
    const [waterLevel, setWaterLevel] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const applyPayload = (payload) => {
            const row = sensorId
                ? payload.levels?.find(
                      (l) => l.sensorId === sensorId || l.id === sensorId,
                  )
                : payload.levels?.[0];
            if (row && typeof row.value === 'number' && !cancelled) {
                setWaterLevel(row.value);
            }
        };

        const pull = async () => {
            try {
                const data = await fetchWaterLevels();
                if (!cancelled) applyPayload(data);
            } catch {
                if (!cancelled) setWaterLevel(0);
            }
        };

        pull();
        const iv = window.setInterval(pull, 8000);
        const off = subscribeWaterLevelEcho((payload) => applyPayload(payload));

        return () => {
            cancelled = true;
            window.clearInterval(iv);
            off();
        };
    }, [sensorId]);

    const status = getStatus(waterLevel);

    return (
        <div className={'relative w-full overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-md ' + className} style={{ height }}>
            <Canvas
                dpr={[1, 2]}
                style={{ width: '100%', height: '100%' }}
                gl={{ alpha: true }}
                onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
                camera={{ position: [0, 1.5, 3.5], fov: 28 }}
            >
                <Suspense fallback={null}>
                    <Scene waterLevel={waterLevel} />
                </Suspense>
            </Canvas>

            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <div className={`rounded-lg border px-3 py-1.5 text-xs font-bold backdrop-blur-sm ${status.bg} ${status.color}`}>
                    {status.label}
                </div>
                <div className="rounded-lg bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    Level: {waterLevel.toFixed(1)}
                </div>
            </div>
        </div>
    );
}

useGLTF.preload('/3d/iotfix-v1.glb');
