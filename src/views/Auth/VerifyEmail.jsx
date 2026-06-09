'use client';

import PrimaryButton from '@/components/PrimaryButton';
import GuestLayout from '@/layouts/GuestLayout';
import axios from '@/lib/axios';
import { route } from '@/lib/routes';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function VerifyEmail({ status }) {
    const { logout } = useAuth();
    const [processing, setProcessing] = useState(false);
    const [sent, setSent] = useState(status === 'verification-link-sent');

    const resend = async () => {
        setProcessing(true);
        try {
            await axios.post(route('verification.send'));
            setSent(true);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <GuestLayout>
            <div className="mb-4 text-sm text-gray-600">
                Thanks for signing up! Before getting started, could you verify your email address by clicking on the
                link we just emailed to you? If you didn&apos;t receive the email, we will gladly send you another.
            </div>
            {sent ? (
                <div className="mb-4 text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            ) : null}
            <div className="mt-4 flex items-center justify-between">
                <PrimaryButton onClick={resend} disabled={processing}>
                    Resend Verification Email
                </PrimaryButton>
                <button
                    type="button"
                    onClick={() => logout()}
                    className="rounded-md text-sm text-gray-600 underline hover:text-gray-900"
                >
                    Log Out
                </button>
            </div>
        </GuestLayout>
    );
}
