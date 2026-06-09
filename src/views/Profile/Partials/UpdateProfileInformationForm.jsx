'use client';

import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { Transition } from '@headlessui/react';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';
import { route } from '@/lib/routes';
import { useState } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const { user, refresh } = useAuth();
    const [data, setData] = useState({
        name: user?.name ?? '',
        email: user?.email ?? '',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);
    const [verifySent, setVerifySent] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await axios.patch(route('profile.update'), data);
            await refresh();
            setRecentlySuccessful(true);
            window.setTimeout(() => setRecentlySuccessful(false), 2000);
        } catch (err) {
            setErrors(err.response?.data?.errors ?? {});
        } finally {
            setProcessing(false);
        }
    };

    const resendVerification = async () => {
        try {
            await axios.post(route('verification.send'));
            setVerifySent(true);
        } catch {
            /* abaikan */
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-white">Profile Information</h2>
                <p className="mt-1 text-sm text-slate-300">
                    Update your account&apos;s profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" className="text-slate-300" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full border-slate-600 bg-slate-950 text-white"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-slate-300" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full border-slate-600 bg-slate-950 text-white"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user && !user.email_verified_at && (
                    <div>
                        <p className="mt-2 text-sm text-slate-200">
                            Your email address is unverified.{' '}
                            <button
                                type="button"
                                onClick={resendVerification}
                                className="rounded-md text-sm text-sky-300 underline hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                            >
                                Click here to re-send the verification email.
                            </button>
                        </p>
                        {(status === 'verification-link-sent' || verifySent) && (
                            <div className="mt-2 text-sm font-medium text-emerald-400">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-slate-300">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
