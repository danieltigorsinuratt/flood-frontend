'use client';

import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import axios from '@/lib/axios';
import { useState } from 'react';

export default function ForgotPassword({ status }) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { email: err.response?.data?.message ?? 'Gagal mengirim email.' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <GuestLayout>
      <div className="mb-4 text-sm text-slate-400">
        Masukkan alamat email kamu dan kami akan kirimkan link reset password.
      </div>
      {sent && (
        <div className="mb-4 text-sm font-medium text-emerald-400">
          Link reset password telah dikirim ke email kamu.
        </div>
      )}
      <form onSubmit={submit}>
        <div>
          <InputLabel htmlFor="email" value="Email" />
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
        </div>
        <div className="mt-4 flex items-center justify-end">
          <PrimaryButton disabled={processing}>
            {processing ? 'Mengirim…' : 'Kirim Link Reset'}
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
