'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { formatDateTimeWib } from '@/lib/wibTime';


/**
 * Hero: heading sederhana tanpa visual tambahan.
 */
export default function Hero() {
    const reduceMotion = useReducedMotion();

    const headingMotion = reduceMotion
        ? false
        : { x: -40, opacity: 0 };
    const headingAnimate = { x: 0, opacity: 1 };
    const headingTransition = reduceMotion
        ? { duration: 0 }
        : { duration: 0.7 };

    return (
        <section className="relative w-full overflow-x-clip bg-white py-32 sm:py-40 lg:py-48">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 xl:px-8">
                <motion.h1
                    initial={headingMotion}
                    animate={headingAnimate}
                    transition={headingTransition}
                    className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl"
                >
                    Flood Monitoring System
                </motion.h1>

                                <div className=”pointer-events-auto absolute inset-0 overflow-hidden rounded-[48px]”>
                                    <svg
                                        ref={svgRef}
                                        viewBox=”0 0 400 200”
                                        className=”absolute bottom-0 h-full w-full touch-none”
                                        preserveAspectRatio=”none”
                                        onMouseMove={(e) => {
                                            updateLineTipFromClient(
                                                e.clientX,
                                                e.clientY,
                                            );
                                        }}
                                        onMouseLeave={() => setLineTip(null)}
                                        onBlur={() => setLineTip(null)}
                                    >
                                        <defs>
                                            <linearGradient
                                                id=”heroLandingWaveGradient”
                                                x1=”0”
                                                y1=”0”
                                                x2=”0”
                                                y2=”1”
                                            >
                                                <stop
                                                    offset=”0%”
                                                    stopColor=”#bae6fd”
                                                    stopOpacity=”0.45”
                                                />
                                                <stop
                                                    offset=”100%”
                                                    stopColor=”#7dd3fc”
                                                    stopOpacity=”0.18”
                                                />
                                            </linearGradient>
                                            <linearGradient
                                                id=”heroSparkLineGradient”
                                                x1=”0%”
                                                y1=”0%”
                                                x2=”100%”
                                                y2=”0%”
                                            >
                                                <stop
                                                    offset=”0%”
                                                    stopColor=”#c084fc”
                                                />
                                                <stop
                                                    offset=”45%”
                                                    stopColor=”#f472b6”
                                                />
                                                <stop
                                                    offset=”100%”
                                                    stopColor=”#a78bfa”
                                                />
                                            </linearGradient>
                                        </defs>
                                        <motion.path
                                            style={{ pointerEvents: 'none' }}
                                            initial={{ d: HERO_WAVE_FALLBACK_D }}
                                            animate={{ d: waveChart.fillPathD }}
                                            transition={
                                                reduceMotion
                                                    ? { duration: 0 }
                                                    : {
                                                          duration: 1.5,
                                                          ease: 'linear',
                                                      }
                                            }
                                            fill=”url(#heroLandingWaveGradient)”
                                        />
                                        {/* Halo di bawah titik “star” — sama path garis */}
                                        {!reduceMotion ? (
                                            <motion.path
                                                style={{ pointerEvents: 'none' }}
                                                initial={{ d: HERO_WAVE_LINE_FALLBACK_D }}
                                                animate={{ d: waveChart.linePathD }}
                                                transition={{
                                                    duration: 1.5,
                                                    ease: 'linear',
                                                }}
                                                fill=”none”
                                                stroke=”#38bdf8”
                                                strokeWidth={6}
                                                strokeLinecap=”round”
                                                strokeLinejoin=”round”
                                                strokeOpacity={0.22}
                                            />
                                        ) : null}

                                        {/* Garis biru gelap (ketinggian) */}
                                        <motion.path
                                            style={{ pointerEvents: 'none' }}
                                            initial={{ d: HERO_WAVE_LINE_FALLBACK_D }}
                                            animate={{ d: waveChart.linePathD }}
                                            transition={
                                                reduceMotion
                                                    ? { duration: 0 }
                                                    : {
                                                          duration: 1.5,
                                                          ease: 'linear',
                                                      }
                                            }
                                            fill=”none”
                                            stroke=”#38bdf8”
                                            strokeWidth={1.5}
                                            strokeLinecap=”round”
                                            strokeLinejoin=”round”
                                        />
                                        {/* Area hover lebar di atas garis */}
                                        <motion.path
                                            style={{
                                                pointerEvents: 'stroke',
                                                cursor: waveChart.hasData
                                                    ? 'crosshair'
                                                    : 'default',
                                            }}
                                            initial={{ d: HERO_WAVE_LINE_FALLBACK_D }}
                                            animate={{ d: waveChart.linePathD }}
                                            transition={
                                                reduceMotion
                                                    ? { duration: 0 }
                                                    : {
                                                          duration: 1.5,
                                                          ease: 'linear',
                                                      }
                                            }
                                            fill=”none”
                                            stroke=”transparent”
                                            strokeWidth={22}
                                        />
                                    </svg>
                                    {lineTip ? (
                                        <div
                                            role=”tooltip”
                                            className=”pointer-events-none fixed z-[100] max-w-[14rem] rounded-lg border border-slate-700/20 bg-slate-900/95 px-3 py-2 text-left text-xs text-white shadow-lg”
                                            style={{
                                                left: lineTip.clientX + 14,
                                                top: lineTip.clientY + 14,
                                            }}
                                        >
                                            <div className=”font-semibold tabular-nums”>
                                                {lineTip.cm} cm
                                            </div>
                                            <div className=”mt-0.5 text-[11px] text-slate-300”>
                                                {lineTip.when}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
