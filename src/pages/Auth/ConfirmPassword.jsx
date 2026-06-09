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

export default function ConfirmPasswordPage() {
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
      router.back();
    } catch (err) {
      setErrors(err.response?.data?.errors ?? {});
      setPassword('');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <GuestLayout>
      <div className="mb-4 text-sm text-slate-300">
        This is a secure area of the application. Please confirm your password before continuing.
      </div>

      <form onSubmit={submit}>
        <div>
          <InputLabel htmlFor="password" value="Password" />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={password}
            className="mt-1 block w-full"
            autoComplete="current-password"
            isFocused
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputError message={errors.password?.[0]} className="mt-2" />
        </div>

        <div className="mt-4 flex justify-end">
          <PrimaryButton disabled={processing}>Confirm</PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
