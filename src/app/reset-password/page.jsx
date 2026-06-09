'use client';

import ResetPasswordPage from '@/pages/Auth/ResetPassword';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';
  return <ResetPasswordPage token={token} email={email} />;
}

export default function Page() {
  return (
    <Suspense fallback={<p className="p-8 text-slate-400">Memuat…</p>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
