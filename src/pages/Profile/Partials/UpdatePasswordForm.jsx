'use client';

import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import axios from '@/lib/axios';
import { route } from '@/lib/routes';
import { useRef, useState } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
  const passwordInput = useRef(null);
  const currentPasswordInput = useRef(null);
  const [data, setData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [saved, setSaved] = useState(false);

  const setField = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const reset = (...fields) => {
    setData((prev) => {
      const next = { ...prev };
      fields.forEach((f) => { next[f] = ''; });
      return next;
    });
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    setSaved(false);
    try {
      await axios.put(route('password.update'), data);
      reset('current_password', 'password', 'password_confirmation');
      setSaved(true);
    } catch (err) {
      const responseErrors = err.response?.data?.errors ?? {};
      setErrors(responseErrors);
      if (responseErrors.password) {
        reset('password', 'password_confirmation');
        passwordInput.current?.focus();
      }
      if (responseErrors.current_password) {
        reset('current_password');
        currentPasswordInput.current?.focus();
      }
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

      <form onSubmit={updatePassword} className="mt-6 space-y-6">
        <div>
          <InputLabel htmlFor="current_password" value="Current Password" className="text-slate-300" />
          <TextInput
            id="current_password"
            ref={currentPasswordInput}
            value={data.current_password}
            onChange={(e) => setField('current_password', e.target.value)}
            type="password"
            className="mt-1 block w-full border-slate-600 bg-slate-950 text-white"
            autoComplete="current-password"
          />
          <InputError message={errors.current_password?.[0]} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="password" value="New Password" className="text-slate-300" />
          <TextInput
            id="password"
            ref={passwordInput}
            value={data.password}
            onChange={(e) => setField('password', e.target.value)}
            type="password"
            className="mt-1 block w-full border-slate-600 bg-slate-950 text-white"
            autoComplete="new-password"
          />
          <InputError message={errors.password?.[0]} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-slate-300" />
          <TextInput
            id="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) => setField('password_confirmation', e.target.value)}
            type="password"
            className="mt-1 block w-full border-slate-600 bg-slate-950 text-white"
            autoComplete="new-password"
          />
          <InputError message={errors.password_confirmation?.[0]} className="mt-2" />
        </div>

        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing}>Save</PrimaryButton>
          {saved ? <p className="text-sm text-slate-300">Saved.</p> : null}
        </div>
      </form>
    </section>
  );
}
