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

export default function ResetPasswordPage({ token, email }) {
  const router = useRouter();
  const [data, setData] = useState({
    token: token ?? '',
    email: email ?? '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const setField = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    try {
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
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoComplete="username"
            onChange={(e) => setField('email', e.target.value)}
          />
          <InputError message={errors.email?.[0]} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password" value="Password" />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="new-password"
            isFocused
            onChange={(e) => setField('password', e.target.value)}
          />
          <InputError message={errors.password?.[0]} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
          <TextInput
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e) => setField('password_confirmation', e.target.value)}
          />
          <InputError message={errors.password_confirmation?.[0]} className="mt-2" />
        </div>

        <div className="mt-4 flex items-center justify-end">
          <PrimaryButton className="ms-4" disabled={processing}>
            Reset Password
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
