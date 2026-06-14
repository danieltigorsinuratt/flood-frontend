'use client';

import ApplicationLogo from '@/components/ApplicationLogo';
import Dropdown from '@/components/Dropdown';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';
import { route } from '@/lib/routes';
import {
    AnimatePresence,
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const SIDEBAR_COLLAPSED_KEY = 'iot-flood-sidebar-collapsed';

const easeOutExpo = [0.16, 1, 0.3, 1];
const easeOutSoft = [0.22, 1, 0.36, 1];

function useLgUp() {
    const [lgUp, setLgUp] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        const onChange = () => setLgUp(mq.matches);
        onChange();
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    return lgUp;
}

function SidebarNavLink({ href, active, children, onNavigate }) {
    return (
        <Link
            href={href}
            onClick={onNavigate}
            className={
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ' +
                (active
                    ? 'border-r-2 border-black bg-gray-100 text-black'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black')
            }
        >
            {children}
        </Link>
    );
}

export default function AuthenticatedLayout({
    header,
    title,
    navbarTrailing,
    children,
}) {
    const { user, flash, logout, loading } = useAuth();
    const router = useRouter();
    const path = usePathname() ?? '';

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [loading, user, router]);
    const reduceMotion = useReducedMotion();
    const lgUp = useLgUp();
    const { scrollY } = useScroll();

    /** Navbar kaca: tetap cukup transparan agar konten di bawah (mis. grid) terlihat saat scroll. */
    const navBgAlpha = useTransform(
        scrollY,
        [0, 140],
        reduceMotion ? [0.55, 0.62] : [0.28, 0.62],
    );
    const navBg = useTransform(navBgAlpha, (a) => `rgba(15, 23, 42, ${a})`);
    const navBlurPx = useTransform(
        scrollY,
        [0, 140],
        reduceMotion ? [12, 12] : [8, 18],
    );
    const navBackdrop = useTransform(navBlurPx, (px) => `saturate(1.2) blur(${px}px)`);
    const navBorderAlpha = useTransform(
        scrollY,
        [0, 140],
        reduceMotion ? [0.22, 0.28] : [0.12, 0.35],
    );
    const navBorder = useTransform(
        navBorderAlpha,
        (a) => `rgba(71, 85, 105, ${a})`,
    );

    /** null = memeriksa; true = telemetri hidup; false = terputus */
    const [iotLive, setIotLive] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const check = async () => {
            try {
                // Sumber sama dengan banner "Koneksi IoT Terhubung/Terputus" di dashboard
                const { data } = await axios.get(route('dashboard.iot-connectivity'), {
                    params: { online_timeout: 12 },
                });
                if (!cancelled) {
                    setIotLive(Boolean(data?.live));
                }
            } catch {
                // Jangan paksa offline saat sesi/proxy gagal — hindari false negative
            }
        };

        void check();
        const interval = window.setInterval(check, 15000);
        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, []);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [path]);

    useEffect(() => {
        setDesktopSidebarCollapsed(
            window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1',
        );
    }, []);

    useEffect(() => {
        window.localStorage.setItem(
            SIDEBAR_COLLAPSED_KEY,
            desktopSidebarCollapsed ? '1' : '0',
        );
    }, [desktopSidebarCollapsed]);

    const closeMobile = () => setMobileMenuOpen(false);

    const hasNavbarExtras =
        (title != null && title !== '') || navbarTrailing != null;

    const sidebarOpenMobile = mobileMenuOpen;
    const sidebarOpenDesktop = lgUp && !desktopSidebarCollapsed;

    const sidebarAnimate = reduceMotion
        ? lgUp
            ? {
                  width: desktopSidebarCollapsed ? 0 : 256,
                  opacity: desktopSidebarCollapsed ? 0 : 1,
                  x: 0,
              }
            : {
                  x: mobileMenuOpen ? 0 : -304,
                  opacity: 1,
              }
        : lgUp
          ? {
                width: desktopSidebarCollapsed ? 0 : 256,
                opacity: desktopSidebarCollapsed ? 0 : 1,
                x: 0,
            }
          : {
                x: mobileMenuOpen ? 0 : -304,
                opacity: 1,
            };

    const sidebarTransition = reduceMotion
        ? { duration: 0.15 }
        : lgUp
          ? {
                width: {
                    type: 'tween',
                    duration: 0.62,
                    ease: easeOutSoft,
                },
                opacity: {
                    type: 'tween',
                    duration: 0.38,
                    ease: easeOutExpo,
                },
            }
          : {
                x: sidebarOpenMobile
                    ? {
                          type: 'spring',
                          stiffness: 165,
                          damping: 24,
                          mass: 0.95,
                          restDelta: 0.35,
                          restSpeed: 0.4,
                      }
                    : {
                          type: 'spring',
                          stiffness: 420,
                          damping: 40,
                          mass: 0.72,
                      },
            };

    return (
        <div className="min-h-screen bg-white text-slate-900">
            {flash.success ? (
                <div className="fixed inset-x-0 top-0 z-[60] border-b border-emerald-700 bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white shadow">
                    {flash.success}
                </div>
            ) : null}
            {flash.error ? (
                <div className="fixed inset-x-0 top-0 z-[60] border-b border-red-700 bg-red-600 px-4 py-2 text-center text-sm font-medium text-white shadow">
                    {flash.error}
                </div>
            ) : null}

            <div className="flex min-h-screen">
                <AnimatePresence>
                    {sidebarOpenMobile ? (
                        <motion.div
                            key="sidebar-backdrop"
                            role="presentation"
                            aria-hidden
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={
                                reduceMotion
                                    ? { duration: 0.1 }
                                    : {
                                          duration: 0.42,
                                          ease: easeOutExpo,
                                      }
                            }
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
                            onPointerDown={closeMobile}
                        />
                    ) : null}
                </AnimatePresence>

                <motion.aside
                    layout={false}
                    initial={false}
                    animate={{
                        ...sidebarAnimate,
                        pointerEvents:
                            lgUp && desktopSidebarCollapsed
                                ? 'none'
                                : !lgUp && !mobileMenuOpen
                                  ? 'none'
                                  : 'auto',
                    }}
                    transition={sidebarTransition}
                    className={
                        'fixed inset-y-0 left-0 z-50 flex w-[min(16rem,85vw)] max-w-[16rem] flex-col overflow-hidden border-r border-black bg-white shadow-lg will-change-[transform,width,opacity] lg:shadow-sm ' +
                        (sidebarOpenDesktop ? 'lg:border-black' : 'lg:border-transparent')
                    }
                >
                    <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-black px-3">
                        <Link
                            href="/"
                            className="flex min-w-0 flex-1 items-center gap-2"
                            onClick={closeMobile}
                        >
                            <ApplicationLogo className="h-11 w-auto shrink-0" />
                            <span className="truncate text-sm font-semibold tracking-tight text-black">
                                Flood Monitoring
                            </span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                setDesktopSidebarCollapsed(true);
                            }}
                            className="hidden shrink-0 rounded-md p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-black lg:inline-flex"
                            aria-label="Sembunyikan sidebar"
                            title="Sembunyikan sidebar"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={closeMobile}
                            className="inline-flex shrink-0 rounded-md p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-black lg:hidden"
                            aria-label="Tutup menu"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <nav className="flex min-h-0 flex-1 flex-col space-y-1 overflow-y-auto p-3">
                        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Utama
                        </p>
                        <SidebarNavLink
                            href={route('dashboard')}
                            active={path === '/dashboard'}
                            onNavigate={closeMobile}
                        >
                            <span>Ringkasan</span>
                        </SidebarNavLink>
                        <SidebarNavLink
                            href={route('dashboard.riwayat')}
                            active={path === '/dashboard/riwayat'}
                            onNavigate={closeMobile}
                        >
                            <span>Riwayat</span>
                        </SidebarNavLink>

                        <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Integrasi
                        </p>
                        <SidebarNavLink
                            href={route('dashboard.download')}
                            active={path === '/dashboard/download'}
                            onNavigate={closeMobile}
                        >
                            <span>Download</span>
                        </SidebarNavLink>
                        <SidebarNavLink
                            href={route('dashboard.kalender')}
                            active={path === '/dashboard/kalender'}
                            onNavigate={closeMobile}
                        >
                            <span>Kalender</span>
                        </SidebarNavLink>

                        <div
                            className="mt-4 flex items-center gap-2.5 px-3 py-2"
                            title={
                                iotLive === true
                                    ? 'Telemetri sensor aktif'
                                    : iotLive === false
                                      ? 'Tidak ada telemetri baru'
                                      : 'Memeriksa koneksi…'
                            }
                        >
                            <span
                                className={
                                    'h-2.5 w-2.5 shrink-0 rounded-full ' +
                                    (iotLive === true
                                        ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
                                        : iotLive === false
                                          ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                                          : 'bg-slate-400')
                                }
                                aria-hidden
                            />
                            <span className="text-sm font-medium text-gray-600">
                                {iotLive === true
                                    ? 'online'
                                    : iotLive === false
                                      ? 'offline'
                                      : '…'}
                            </span>
                        </div>
                    </nav>
                </motion.aside>

                <div
                    className={
                        'flex min-h-screen min-w-0 flex-1 flex-col lg:transition-[padding] lg:duration-[620ms] lg:ease-[cubic-bezier(0.22,1,0.36,1)] ' +
                        (sidebarOpenDesktop ? 'lg:pl-64' : 'lg:pl-0')
                    }
                >
                    <motion.header
                        layout={false}
                        initial={
                            reduceMotion ? false : { opacity: 0, y: -10 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={
                            reduceMotion
                                ? { duration: 0.01 }
                                : {
                                      type: 'spring',
                                      stiffness: 420,
                                      damping: 34,
                                      mass: 0.65,
                                  }
                        }
                        style={{
                            backgroundColor: navBg,
                            backdropFilter: navBackdrop,
                            WebkitBackdropFilter: navBackdrop,
                            borderBottomColor: navBorder,
                        }}
                        className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-slate-700/0 px-3 sm:gap-3 sm:px-4"
                    >
                        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                            <button
                                type="button"
                                className="inline-flex rounded-md border border-black bg-white p-2 text-black transition-colors duration-200 hover:bg-gray-100 lg:hidden"
                                onClick={() => setMobileMenuOpen((v) => !v)}
                                aria-label="Buka menu"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                            {desktopSidebarCollapsed ? (
                                <button
                                    type="button"
                                    className="hidden rounded-md border border-black bg-white p-2 text-black transition-colors duration-200 hover:bg-gray-100 lg:inline-flex"
                                    onClick={() => setDesktopSidebarCollapsed(false)}
                                    aria-label="Tampilkan sidebar"
                                    title="Tampilkan sidebar"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            ) : null}
                        </div>

                        {hasNavbarExtras ? (
                            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
                                {title ? (
                                    <h1 className="min-w-0 flex-1 truncate text-sm font-semibold leading-none text-black sm:text-base">
                                        {title}
                                    </h1>
                                ) : (
                                    <div className="min-w-0 flex-1" />
                                )}
                                {navbarTrailing ? (
                                    <div className="flex shrink-0 items-center gap-2">
                                        {navbarTrailing}
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <div className="min-w-0 flex-1" />
                        )}

                        <div className="flex shrink-0 items-center border-l border-black pl-2 sm:pl-3">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex max-w-[9rem] items-center gap-1.5 rounded-md border border-black bg-white py-1.5 pl-2.5 pr-2 text-left text-xs font-medium text-black shadow-sm transition-colors duration-200 hover:bg-gray-100 sm:max-w-[12rem] sm:gap-2 sm:pl-3 sm:text-sm"
                                    >
                                        <span className="truncate">{user?.name ?? 'Pengguna'}</span>
                                        <svg
                                            className="h-4 w-4 shrink-0 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="48">
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href="#"
                                        as="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            void logout();
                                        }}
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </motion.header>

                    {header ? (
                        <div className="border-b border-black bg-white shadow-sm">
                            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </div>
                    ) : null}

                    <main className="flex-1 bg-white text-slate-900">{children}</main>
                </div>
            </div>

        </div>
    );
}
