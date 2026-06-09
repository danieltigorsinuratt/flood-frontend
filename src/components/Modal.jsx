'use client';

import { useEffect } from 'react';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    useEffect(() => {
        if (!show) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') close();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [show, closeable]);

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    if (!show) return null;

    return (
        <div
            id="modal"
            className="fixed inset-0 z-50 flex items-center overflow-y-auto px-4 py-6 sm:px-0"
            role="dialog"
            aria-modal="true"
        >
            <div
                className="absolute inset-0 bg-slate-950/80"
                onClick={close}
                aria-hidden="true"
            />
            <div
                className={`relative mb-6 w-full transform overflow-hidden rounded-lg border border-slate-600 bg-slate-900 text-white shadow-xl sm:mx-auto sm:w-full ${maxWidthClass}`}
            >
                {children}
            </div>
        </div>
    );
}
