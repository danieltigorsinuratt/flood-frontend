'use client';

import InputError from '@/components/InputError';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import axios from '@/lib/axios';
import { route } from '@/lib/routes';
import { useState } from 'react';

export default function ForgotPassword({ status }) {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [sent, setSent] = useState(status ?? '');

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await axios.get('/sanctum/csrf-cookie');
            await axios.post(route('password.email'), { email });
            setSent('Link reset password telah dikirim ke email Anda.');
        } catch (err) {
            setErrors(err.response?.data?.errors ?? {});
        } finally {
            setProcessing(false);
        }
    };

    return (
        <GuestLayout>
            {sent ? (
                <div className="mb-4 text-sm font-medium text-green-600">{sent}</div>
            ) : null}
            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputError message={errors.email} className="mt-2" />
                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton disabled={processing}>Email Password Reset Link</PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
