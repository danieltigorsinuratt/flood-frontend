'use client';

import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { Transition } from '@headlessui/react';
import axios from '@/lib/axios';
import { route } from '@/lib/routes';
import { useState } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const [data, setData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await axios.put(route('password.update'), data);
            setData({ current_password: '', password: '', password_confirmation: '' });
            setRecentlySuccessful(true);
            window.setTimeout(() => setRecentlySuccessful(false), 2000);
        } catch (err) {
            setErrors(err.response?.data?.errors ?? {});
        } finally {
            setProcessing(false);
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-white">Update Password</h2>
                <p className="mt-1 text-sm text-slate-300">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="current_password" value="Current Password" className="text-slate-300" />
                    <TextInput
                        id="current_password"
                        type="password"
                        className="mt-1 block w-full border-slate-600 bg-slate-950 text-white"
                        value={data.current_password}
                        onChange={(e) => setData({ ...data, current_password: e.target.value })}
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="password" value="New Password" className="text-slate-300" />
                    <TextInput
                        id="password"
                        type="password"
                        className="mt-1 block w-full border-slate-600 bg-slate-950 text-white"
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-slate-300" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        className="mt-1 block w-full border-slate-600 bg-slate-950 text-white"
                        value={data.password_confirmation}
                        onChange={(e) => setData({ ...data, password_confirmation: e.target.value })}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>
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
