'use client';

import { motion, useReducedMotion } from 'framer-motion';

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

                <motion.p
                    initial={headingMotion}
                    animate={headingAnimate}
                    transition={
                        reduceMotion
                            ? { duration: 0 }
                            : { ...headingTransition, delay: 0.1 }
                    }
                    className="mt-6 text-lg leading-8 text-slate-600"
                >
                    Pemantauan ketinggian air berbasis IoT — dashboard
                    untuk data &amp; peringatan.
                </motion.p>
            </div>
        </section>
    );
}
