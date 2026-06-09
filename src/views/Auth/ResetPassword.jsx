'use client';

import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import axios from '@/lib/axios';
import { route } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResetPassword() {
    const router = useRouter();
    const [data, setData] = useState({
        token: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        setData((prev) => ({
            ...prev,
            token: params.get('token') ?? '',
            email: params.get('email') ?? '',
        }));
    }, []);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await axios.get('/sanctum/csrf-cookie');
            await axios.post(route('password.store'), data);
            router.push('/login');
        } catch (err) {
            setErrors(err.response?.data?.errors ?? {});
        } finally {
            setProcessing(false);
        }
    };

    return (
        <GuestLayout>
            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        onChange={(e) => setData({ ...data, password_confirmation: e.target.value })}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>
                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton disabled={processing}>Reset Password</PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
