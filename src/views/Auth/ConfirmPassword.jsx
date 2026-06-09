'use client';

import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import axios from '@/lib/axios';
import { route } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ConfirmPassword() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await axios.post(route('password.confirm'), { password });
            router.push('/dashboard');
        } catch (err) {
            setErrors(err.response?.data?.errors ?? {});
        } finally {
            setProcessing(false);
        }
    };

    return (
        <GuestLayout>
            <form onSubmit={submit}>
                <InputLabel htmlFor="password" value="Password" />
                <TextInput
                    id="password"
                    type="password"
                    value={password}
                    className="mt-1 block w-full"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <InputError message={errors.password} className="mt-2" />
                <div className="mt-4 flex justify-end">
                    <PrimaryButton disabled={processing}>Confirm</PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
