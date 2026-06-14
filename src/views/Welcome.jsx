'use client';

import Flood3DScene from '@/components/water-level/3d';
import WaterLevelChart from '@/components/FloodDashboard/WaterLevelChart';
import axios from '@/lib/axios';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

function SectionHeading({ badge, title, subtitle }) {
    return (
        <div className="mb-12 text-center">
            {badge && (
                <span className="mb-3 inline-block rounded-full border border-black bg-black px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                    {badge}
                </span>
            )}
            <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl lg:text-5xl">
                {title}
            </h2>
            {subtitle && (
                <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 sm:text-lg">
                    {subtitle}
                </p>
            )}
        </div>
    );
}

export default function Welcome() {
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
                        setStatusBanjir('MENUNGGU DATA');
                    }
                }
                setLoadingData(false);
            } catch (error) {
                console.error('Gagal mengambil data IoT:', error);
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

    // Active section tracking
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const sections = ['hero', 'manfaat', 'tujuan', 'monitoring'];
        const observers = [];

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(id);
                    }
                },
                { rootMargin: '-40% 0px -55% 0px' }
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-black selection:text-white">
            <div className="relative flex min-h-screen flex-col">
                <motion.header
                    style={{
                        backgroundColor: navBg,
                        backdropFilter: navBackdrop,
                        WebkitBackdropFilter: navBackdrop,
                        borderBottomColor: navBorder,
                    }}
                    className="sticky top-0 z-40 flex shrink-0 items-center justify-between border-b border-gray-200/0 px-4 py-3 sm:px-6"
                >
                    <Link href="/" className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90">
                        <img src="/img/logo.png" alt="" className="h-10 w-auto shrink-0 object-contain" />
                        <span className="truncate text-xl font-bold tracking-tight text-black">Flood Monitoring</span>
                    </Link>
                    <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
                        <a href="#hero" className={`transition ${activeSection === 'hero' ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}>Beranda</a>
                        <a href="#manfaat" className={`transition ${activeSection === 'manfaat' ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}>Manfaat</a>
                        <a href="#tujuan" className={`transition ${activeSection === 'tujuan' ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}>Tujuan</a>
                        <a href="#monitoring" className={`transition ${activeSection === 'monitoring' ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}>Live Monitoring</a>
                    </nav>
                    <div className="w-[180px]"></div>
                </motion.header>

                <main className="relative flex-1">
                    <section id="hero" className="relative flex min-h-[calc(100vh-56px)] items-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 px-4 py-16 sm:px-6 lg:px-8">
                        <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            <div className="absolute -bottom-1/2 -right-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-t from-gray-200/60 to-transparent blur-3xl"></div>
                            <div className="absolute -top-1/4 -left-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-b from-gray-100/80 to-transparent blur-3xl"></div>
                        </div>
                        <div className="relative z-10 mx-auto w-full max-w-6xl">
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.7 }}
                                >
                                    <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-6xl">
                                        Flood Monitoring System
                                    </h1>
                                    <p className="mt-4 text-base leading-relaxed text-gray-600">
                                        <strong className="text-black">Flood Monitoring System</strong> adalah
                                        platform pemantauan banjir real-time yang mengintegrasikan sensor
                                        ultrasonik ESP32 dengan dashboard web interaktif.
                                    </p>
                                    <p className="mt-3 text-sm leading-relaxed text-gray-500">
                                        Sistem ini secara otomatis mengukur ketinggian air, mengklasifikasikan
                                        tingkat bahaya (Normal, Siaga, Bahaya), dan mengirimkan peringatan
                                        dini kepada pengguna melalui dashboard maupun WebSocket.
                                    </p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay: 0.2 }}
                                    className="flex justify-center"
                                >
                                    <Flood3DScene height={400} className="w-full max-w-lg" />
                                </motion.div>
                            </div>
                        </div>
                    </section>
<section id="monitoring" className="flex min-h-screen items-center bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-6xl">
                            <SectionHeading
                                title="Pantau Ketinggian Air Terkini"
                                subtitle="Data sensor diperbarui setiap 5 detik secara otomatis"
                            />

                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                <motion.div
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="flex flex-col justify-between rounded-2xl border border-black bg-white p-6 shadow-lg"
                                >
                                    <div>
                                        <h3 className="text-lg font-bold text-black">Ketinggian Air</h3>
                                        <p className="text-xs text-gray-500">
                                            {loadingData ? 'Menghubungkan ke IoT...' : 'Sinkronisasi Aktif (5s)'}
                                        </p>
                                    </div>
                                    <div className="my-8 text-center">
                                        <span className="text-6xl font-black tracking-tight text-black">
                                            {waterLevel} <span className="text-2xl font-medium text-gray-400">cm</span>
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <span
                                            className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ring-inset ${
                                                statusBanjir.toUpperCase() === 'NORMAL'
                                                    ? 'bg-black text-white ring-black'
                                                    : statusBanjir.toUpperCase() === 'SIAGA'
                                                      ? 'bg-gray-200 text-gray-700 ring-gray-400'
                                                      : 'bg-red-500 text-white ring-red-500'
                                            }`}
                                        >
                                            Status: {statusBanjir}
                                        </span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="rounded-2xl border border-black bg-white p-6 shadow-lg lg:col-span-2"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-black">
                                            Grafik Tinggi Air {chartDevice ? `— ${chartDevice}` : ''}
                                        </h3>
                                        <span className="inline-flex items-center gap-1.5 rounded-md bg-black px-2.5 py-1 text-xs font-medium text-white">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400"></span>
                                            Live
                                        </span>
                                    </div>
                                    <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2">
                                        <WaterLevelChart chartReadings={chartReadings} chartDevice={chartDevice} />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>
                    
                    <section id="manfaat" className="flex min-h-screen items-center bg-white px-4 py-20 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-12 text-center">
                               
                                <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl lg:text-5xl">
                                    Mengapa Sistem Ini Penting?
                                </h2>
                                <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 sm:text-lg">
                                    Memberikan solusi teknologi untuk mengurangi risiko bencana banjir
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        title: 'Deteksi Dini',
                                        desc: 'Memantau ketinggian air secara real-time dan memberikan peringatan sebelum banjir terjadi.',
                                    },
                                    {
                                        title: 'Data Akurat',
                                        desc: 'Sensor ultrasonik mengukur ketinggian air dengan presisi tinggi dan dikirim langsung ke server.',
                                    },
                                    {
                                        title: 'Peringatan Otomatis',
                                        desc: 'Sistem secara otomatis mengklasifikasi level bahaya dan mengirim notifikasi kepada pengguna.',
                                    },
                                    {
                                        title: 'Akses Dimana Saja',
                                        desc: 'Dashboard web yang dapat diakses dari perangkat apapun, kapan saja, dan di mana saja.',
                                    },
                                    {
                                        title: 'Riwayat & Analisis',
                                        desc: 'Data historis tersimpan dan dapat dianalisis untuk perencanaan mitigasi banjir.',
                                    },
                                    {
                                        title: 'Mudah Dipasang',
                                        desc: 'Perangkat ESP32 yang compact dan ekonomis, mudah dipasang di berbagai lokasi rawan banjir.',
                                    },
                                ].map((item, i) => (
                                    <motion.div
                                        key={item.title}
                                        variants={fadeUp}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: '-60px' }}
                                        transition={{ duration: 0.5, delay: i * 0.08 }}
                                        className="rounded-2xl border border-black bg-white p-6"
                                    >
                                        <h3 className="mb-2 text-lg font-bold text-black">{item.title}</h3>
                                        <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="flex min-h-screen items-center bg-gray-100 px-4 py-24 sm:px-8 lg:px-12">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-16">
                                <span className="text-xl font-bold uppercase tracking-widest text-black">Alur Sistem</span>
                            </div>

                            <div className="flex">
                                {[
                                    {
                                        img: '/alat/sensor.svg',
                                        title: 'SENSOR',
                                        desc: 'Sensor ultrasonik mendeteksi ketinggian air di lokasi pemantauan.',
                                    },
                                    {
                                        img: '/alat/API.svg',
                                        title: 'API',
                                        desc: 'API backend memproses data dari sensor dan menyiapkan untuk disimpan.',
                                    },
                                    {
                                        img: '/alat/database.svg',
                                        title: 'DATABASE',
                                        desc: 'Data tersimpan aman di database untuk riwayat dan analisis.',
                                    },
                                    {
                                        img: '/alat/cloud.svg',
                                        title: 'CLOUD',
                                        desc: 'Server cloud menyimpan dan mengelola data secara terpusat.',
                                    },
                                    {
                                        img: '/alat/web.svg',
                                        title: 'DASHBOARD',
                                        desc: 'Data ditampilkan real-time melalui dashboard web interaktif.',
                                    },
                                ].map((item, i) => (
                                    <div key={item.title} className="group relative min-h-[320px] border-l border-black py-10 pl-8 pr-6 transition-all duration-500 hover:bg-[#c8ff00]">
                                        <img src={item.img} alt={item.title} className="mb-5 h-24 w-24" />
                                        <h3 className="mb-2 text-lg font-bold uppercase tracking-wider text-black">{item.title}</h3>
                                        <p className="text-sm leading-relaxed text-gray-600">{item.desc}</p>
                                        <div className="absolute bottom-10 left-8 text-2xl text-black">→</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="tujuan" className="flex min-h-screen items-center bg-white px-4 py-20 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-6xl">
                            <SectionHeading
                                
                                title="Tujuan Dibuatnya Project Ini"
                                subtitle="Diharapkan sistem ini dapat menjadi solusi nyata dalam penanganan banjir di Indonesia"
                            />
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {[
                                    {
                                        num: '01',
                                        title: 'Menyediakan Sistem Peringatan Dini',
                                        desc: 'Membantu masyarakat dan otoritas terkait untuk mendeteksi potensi banjir sejak dini melalui pemantauan otomatis.',
                                    },
                                    {
                                        num: '02',
                                        title: 'Mendukung Pengambilan Keputusan',
                                        desc: 'Menyediakan data real-time dan historis yang akurat untuk pengambilan keputusan dalam mitigasi bencana.',
                                    },
                                    {
                                        num: '03',
                                        title: 'Memanfaatkan Teknologi IoT',
                                        desc: 'Menerapkan teknologi Internet of Things untuk pemantauan lingkungan yang efisien dan terjangkau.',
                                    },
                                    {
                                        num: '04',
                                        title: 'Meningkatkan Kesadaran Masyarakat',
                                        desc: 'Memberikan akses informasi ketinggian air secara terbuka agar masyarakat lebih waspada terhadap ancaman banjir.',
                                    },
                                ].map((item, i) => (
                                    <motion.div
                                        key={item.num}
                                        variants={fadeUp}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: '-60px' }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="flex gap-5 rounded-2xl border border-black p-6"
                                    >
                                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-lg font-bold text-white">
                                            {item.num}
                                        </span>
                                        <div>
                                            <h3 className="mb-1 text-lg font-bold text-black">{item.title}</h3>
                                            <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    
                </main>

                <footer className="border-t border-black bg-black px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <img src="/img/logo.png" alt="" className="h-8 w-auto object-contain invert" />
                                    <span className="text-lg font-bold text-white">Flood Monitoring</span>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                                    Sistem pemantauan ketinggian air berbasis IoT untuk peringatan dini banjir.
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Akses Cepat</h4>
                                <div className="grid grid-cols-2 gap-8">
                                    <ul className="space-y-2 text-sm text-gray-400">
                                        <li><a href="#hero" className="transition hover:text-white">Beranda</a></li>
                                        <li><a href="#manfaat" className="transition hover:text-white">Manfaat</a></li>
                                    </ul>
                                    <ul className="space-y-2 text-sm text-gray-400">
                                        <li><a href="#tujuan" className="transition hover:text-white">Tujuan</a></li>
                                        <li><a href="#monitoring" className="transition hover:text-white">Live Monitoring</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
                            &copy; {new Date().getFullYear()} Flood Monitoring System. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
