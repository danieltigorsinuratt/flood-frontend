'use client';

import DangerButton from '@/components/DangerButton';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import Modal from '@/components/Modal';
import SecondaryButton from '@/components/SecondaryButton';
import TextInput from '@/components/TextInput';
import axios from '@/lib/axios';
import { route } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
  const router = useRouter();
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const passwordInput = useRef(null);

  const closeModal = () => {
    setConfirmingUserDeletion(false);
    setErrors({});
    setPassword('');
  };

  const deleteUser = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    try {
      await axios.delete(route('profile.destroy'), { data: { password } });
      closeModal();
      router.push('/login');
    } catch (err) {
      setErrors(err.response?.data?.errors ?? {});
      passwordInput.current?.focus();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-white">Delete Account</h2>
        <p className="mt-1 text-sm text-slate-300">
          Once your account is deleted, all of its resources and data will be permanently deleted.
        </p>
      </header>

      <DangerButton onClick={() => setConfirmingUserDeletion(true)}>Delete Account</DangerButton>

      <Modal show={confirmingUserDeletion} onClose={closeModal}>
        <form onSubmit={deleteUser} className="p-6">
          <h2 className="text-lg font-medium text-white">Are you sure you want to delete your account?</h2>
          <p className="mt-1 text-sm text-slate-300">
            Please enter your password to confirm you would like to permanently delete your account.
          </p>

          <div className="mt-6">
            <InputLabel htmlFor="password" value="Password" className="sr-only" />
            <TextInput
              id="password"
              type="password"
              name="password"
              ref={passwordInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-3/4 border-slate-600 bg-slate-950 text-white placeholder:text-slate-500"
              autoFocus
              placeholder="Password"
            />
            <InputError message={errors.password?.[0]} className="mt-2" />
          </div>

          <div className="mt-6 flex justify-end">
            <SecondaryButton type="button" onClick={closeModal} className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700">
              Cancel
            </SecondaryButton>
            <DangerButton className="ms-3" disabled={processing}>
              Delete Account
            </DangerButton>
          </div>
        </form>
      </Modal>
    </section>
  );
}
