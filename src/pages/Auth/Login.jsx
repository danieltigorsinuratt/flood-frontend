'use client';

import Checkbox from '@/components/Checkbox';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login({ status, canResetPassword = true }) {
  const { login } = useAuth();
  const router = useRouter();
  const [data, setData] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const setField = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    try {
      await login({ email: data.email, password: data.password, remember: data.remember });
      router.push('/dashboard');
    } catch (err) {
      const responseErrors = err.response?.data?.errors ?? {};
      const message = err.response?.data?.message ?? 'Login gagal.';
      if (Object.keys(responseErrors).length) {
        setErrors(responseErrors);
      } else {
        setErrors({ email: message });
      }
      setField('password', '');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <GuestLayout>
      {status && (
        <div className="mb-4 text-sm font-medium text-emerald-400">{status}</div>
      )}

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
            isFocused={true}
            onChange={(e) => setField('email', e.target.value)}
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password" value="Password" />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="current-password"
            onChange={(e) => setField('password', e.target.value)}
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="mt-4 block">
          <label className="flex items-center">
            <Checkbox
              name="remember"
              checked={data.remember}
              onChange={(e) => setField('remember', e.target.checked)}
            />
            <span className="ms-2 text-sm text-slate-300">Remember me</span>
          </label>
        </div>

        <div className="mt-4 flex items-center justify-end">
          {canResetPassword && (
            <Link
              href="/forgot-password"
              className="rounded-md text-sm text-slate-400 underline hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Forgot your password?
            </Link>
          )}
          <PrimaryButton className="ms-4" disabled={processing}>
            {processing ? 'Logging in…' : 'Log in'}
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
