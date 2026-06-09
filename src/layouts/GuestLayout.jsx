'use client';

import ApplicationLogo from '@/components/ApplicationLogo';
import Link from 'next/link';

export default function GuestLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-950 pt-6 sm:justify-center sm:pt-0">
      <div>
        <Link href="/">
          <ApplicationLogo className="h-28 w-28" />
        </Link>
      </div>

      <div className="mt-6 w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-900 px-6 py-4 shadow-xl sm:max-w-md">
        {children}
      </div>
    </div>
  );
}
