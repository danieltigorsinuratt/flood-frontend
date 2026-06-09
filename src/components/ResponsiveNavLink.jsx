'use client';

import Link from 'next/link';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    href,
    ...props
}) {
    return (
        <Link
            href={href}
            {...props}
            className={
                'flex w-full items-start border-l-4 py-2 pe-4 ps-3 text-base font-medium transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-indigo-400 bg-slate-800/50 text-white focus:border-indigo-300 focus:bg-slate-800 focus:text-white'
                    : 'border-transparent text-slate-300 hover:border-slate-500 hover:bg-slate-800/50 hover:text-white focus:border-slate-500 focus:bg-slate-800 focus:text-white') +
                className
            }
        >
            {children}
        </Link>
    );
}
