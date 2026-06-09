'use client';

import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import axios from '@/lib/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Register() {
  const router = useRouter();
  const [data, setData] = useState({
    name: '',
    email: '',
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
      await axios.get('/sanctum/csrf-cookie');
      await axios.post('/api/auth/register', data);
      router.push('/dashboard');
    } catch (err) {
      const responseErrors = err.response?.data?.errors ?? {};
      if (Object.keys(responseErrors).length) {
        setErrors(responseErrors);
      } else {
        setErrors({ email: err.response?.data?.message ?? 'Registrasi gagal.' });
      }
      setField('password', '');
      setField('password_confirmation', '');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <GuestLayout>
      <form onSubmit={submit}>
        <div>
          <InputLabel htmlFor="name" value="Name" />
          <TextInput
            id="name"
            name="name"
            value={data.name}
            className="mt-1 block w-full"
            autoComplete="name"
            isFocused={true}
            onChange={(e) => setField('name', e.target.value)}
            required
          />
          <InputError message={errors.name} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="email" value="Email" />
          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoComplete="username"
            onChange={(e) => setField('email', e.target.value)}
            required
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
            autoComplete="new-password"
            onChange={(e) => setField('password', e.target.value)}
            required
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
          <TextInput
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e) => setField('password_confirmation', e.target.value)}
            required
          />
          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="mt-4 flex items-center justify-end">
          <Link
            href="/login"
            className="rounded-md text-sm text-slate-400 underline hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Already registered?
          </Link>
          <PrimaryButton className="ms-4" disabled={processing}>
            {processing ? 'Registering…' : 'Register'}
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
