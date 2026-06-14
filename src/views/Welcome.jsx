'use client';

import Hero from '@/components/Hero';
import WaterLevelChart from '@/components/FloodDashboard/WaterLevelChart';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Welcome() {
    const { user, loading } = useAuth();
    const auth = { user: loading ? null : user };
    const canLogin = true;
    const canRegister = true;

    const [waterLevel, setWaterLevel] = useState(0);
    const [statusBanjir, setStatusBanjir] = useState('NORMAL');
    const [chartReadings, setChartReadings] = useState([]);
    const [chartDevice, setChartDevice] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                const response = await axios.get('/landing/chart-data');

                if (response.data) {
                    const readings = response.data.chart_readings || [];
                    const deviceName = response.data.chart_device || null;

                    setChartReadings(readings);
                    setChartDevice(deviceName);

                    if (readings.length > 0) {
                        const sensorLatest = readings[readings.length - 1];
                        setWaterLevel(Number(sensorLatest.water_level) || 0);

                        if (sensorLatest.status) {
                            setStatusBanjir(sensorLatest.status);
                        } else {
                            const level = Number(sensorLatest.water_level) || 0;
                            if (level <= 4) setStatusBanjir('NORMAL');
                            else if (level <= 8) setStatusBanjir('SIAGA');
                            else setStatusBanjir('BAHAYA');
                        }
                    } else {
                        setWaterLevel(0);
                        setStatusBanjir('MENUNGGU DATA SENSOR');
                    }
                }
                setLoadingData(false);
            } catch (error) {
                console.error('Gagal mengambil data IoT untuk publik:', error);
            }
        };

        fetchSensorData();
        const interval = setInterval(fetchSensorData, 5000);
        return () => clearInterval(interval);
    }, []);

    const reduceMotion = useReducedMotion();
    const { scrollY } = useScroll();

    const navBgAlpha = useTransform(scrollY, [0, 140], reduceMotion ? [0.85, 0.95] : [0.7, 0.95]);
    const navBg = useTransform(navBgAlpha, (a) => `rgba(255, 255, 255, ${a})`);

    const navBlurPx = useTransform(scrollY, [0, 140], reduceMotion ? [12, 12] : [8, 18]);
    const navBackdrop = useTransform(navBlurPx, (px) => `saturate(1.2) blur(${px}px)`);

    const navBorderAlpha = useTransform(scrollY, [0, 140], reduceMotion ? [0.15, 0.25] : [0.08, 0.25]);
    const navBorder = useTransform(navBorderAlpha, (a) => `rgba(148, 163, 184, ${a})`);

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-sky-500/35 selection:text-slate-900">
            <div className="relative flex min-h-screen flex-col">
                <motion.header
                    style={{
                        backgroundColor: navBg,
                        backdropFilter: navBackdrop,
                        WebkitBackdropFilter: navBackdrop,
                        borderBottomColor: navBorder,
                    }}
                    className="sticky top-0 z-40 flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/0 px-4 py-3 sm:px-6"
                >
                    <Link href="/" className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90 sm:gap-5">
                        <img src="/img/logo.png" alt="" className="h-10 w-auto shrink-0 object-contain sm:h-12" />
                        <span className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                            Flood Monitoring System
                        </span>
                    </Link>
                </motion.header>

                <main className="relative flex-1">
                    <Hero auth={auth} canLogin={canLogin} canRegister={canRegister} />

                    <section className="relative z-10 border-t border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-12 text-center">
                                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                                    Pantau Ketinggian Air Terkini
                                </h2>
                                <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-500 sm:mt-4">
                                    Data indikator dan grafik fluktuasi real-time langsung dari sensor tanpa perlu login.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">Ketinggian Air</h3>
                                        <p className="text-xs text-slate-400">
                                            {loadingData ? 'Menghubungkan ke IoT...' : 'Sinkronisasi Aktif (5s)'}
                                        </p>
                                    </div>

                                    <div className="my-8 text-center">
                                        <span className="text-6xl font-black tracking-tight text-sky-400">
                                            {waterLevel} <span className="text-2xl font-medium text-slate-500">cm</span>
                                        </span>
                                    </div>

                                    <div className="text-center">
                                        <span
                                            className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ring-inset ${
                                                statusBanjir.toUpperCase() === 'NORMAL'
                                                    ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                                                    : statusBanjir.toUpperCase() === 'SIAGA' ||
                                                        statusBanjir.toUpperCase() === 'WASPADA'
                                                      ? 'bg-amber-500/10 text-amber-400 ring-amber-500/20'
                                                      : 'bg-red-500/10 text-red-400 ring-red-500/20'
                                            }`}
                                        >
                                            Status: {statusBanjir}
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:col-span-2">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            Grafik Tinggi Air {chartDevice ? `— ${chartDevice}` : ''}
                                        </h3>
                                        <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-500/10 px-2 py-1 text-xs font-medium text-sky-400 ring-1 ring-inset ring-sky-500/20">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400"></span>
                                            Live
                                        </span>
                                    </div>

                                    <div className="w-full rounded-xl border border-slate-100 bg-slate-50 p-2">
                                        <WaterLevelChart chartReadings={chartReadings} chartDevice={chartDevice} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="relative border-t border-slate-200 bg-slate-50 py-6 text-center text-xs text-slate-500">
                    Flood Monitoring System
                </footer>
            </div>
        </div>
    );
}
