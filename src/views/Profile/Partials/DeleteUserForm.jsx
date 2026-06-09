'use client';

import DangerButton from '@/components/DangerButton';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import Modal from '@/components/Modal';
import SecondaryButton from '@/components/SecondaryButton';
import TextInput from '@/components/TextInput';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';
import { route } from '@/lib/routes';
import { useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const { logout } = useAuth();
    const [confirming, setConfirming] = useState(false);
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const destroy = async () => {
        setProcessing(true);
        setErrors({});
        try {
            await axios.delete(route('profile.destroy'), { data: { password } });
            await logout();
        } catch (err) {
            setErrors(err.response?.data?.errors ?? {});
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
            <DangerButton onClick={() => setConfirming(true)}>Delete Account</DangerButton>
            <Modal show={confirming} onClose={() => setConfirming(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Are you sure you want to delete your account?
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Please enter your password to confirm you would like to permanently delete your account.
                    </p>
                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Password" className="sr-only" />
                        <TextInput
                            id="password"
                            type="password"
                            className="mt-1 block w-3/4"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setConfirming(false)}>Cancel</SecondaryButton>
                        <DangerButton className="ms-3" disabled={processing} onClick={destroy}>
                            Delete Account
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
