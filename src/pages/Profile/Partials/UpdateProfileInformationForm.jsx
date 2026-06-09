'use client';

import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';
import { route } from '@/lib/routes';
import { useEffect, useState } from 'react';

export default function UpdateProfileInformationForm({ className = '' }) {
  const { user, refresh } = useAuth();
  const [data, setData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setData({ name: user.name ?? '', email: user.email ?? '' });
    }
  }, [user]);

  const setField = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    setSaved(false);
    try {
      await axios.patch(route('profile.update'), data);
      await refresh();
      setSaved(true);
    } catch (err) {
      setErrors(err.response?.data?.errors ?? {});
    } finally {
      setProcessing(false);
    }
  };

  if (!user) return null;

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
            onChange={(e) => setField('name', e.target.value)}
            required
            autoComplete="name"
          />
          <InputError message={errors.name?.[0]} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="email" value="Email" className="text-slate-300" />
          <TextInput
            id="email"
            type="email"
            className="mt-1 block w-full border-slate-600 bg-slate-950 text-white"
            value={data.email}
            onChange={(e) => setField('email', e.target.value)}
            required
            autoComplete="username"
          />
          <InputError message={errors.email?.[0]} className="mt-2" />
        </div>

        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing}>Save</PrimaryButton>
          {saved ? <p className="text-sm text-slate-300">Saved.</p> : null}
        </div>
      </form>
    </section>
  );
}
