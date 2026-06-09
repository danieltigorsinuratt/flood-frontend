'use client';

import PrimaryButton from '@/components/PrimaryButton';
import GuestLayout from '@/layouts/GuestLayout';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';
import { route } from '@/lib/routes';
import Link from 'next/link';
import { useState } from 'react';

export default function VerifyEmailPage({ status }) {
  const { logout } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [sent, setSent] = useState(status === 'verification-link-sent');

  const resend = async () => {
    setProcessing(true);
    try {
      await axios.post(route('verification.send'));
      setSent(true);
    } catch {
      /* abaikan */
    } finally {
      setProcessing(false);
    }
  };

  return (
    <GuestLayout>
      <div className="mb-4 text-sm text-slate-300">
        Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you?
      </div>

      {sent ? (
        <div className="mb-4 text-sm font-medium text-emerald-400">
          A new verification link has been sent to your email address.
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between">
        <PrimaryButton onClick={resend} disabled={processing}>
          Resend Verification Email
        </PrimaryButton>
        <button
          type="button"
          onClick={() => logout()}
          className="text-sm text-slate-400 underline hover:text-slate-200"
        >
          Log Out
        </button>
      </div>
    </GuestLayout>
  );
}
