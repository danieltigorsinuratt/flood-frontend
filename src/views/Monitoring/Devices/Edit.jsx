'use client';

import DangerButton from '@/components/DangerButton';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import axios from '@/lib/axios';
import { route } from '@/lib/routes';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Edit() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState({
        device_id: '',
        name: '',
        location: '',
        status: 'offline',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        axios
            .get(route('monitoring.devices.show', { id }))
            .then(({ data: device }) => {
                setData({
                    device_id: device.device_id,
                    name: device.name,
                    location: device.location,
                    status: device.status,
                });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await axios.put(route('monitoring.devices.update', { id }), data);
            router.push(route('monitoring.devices.index'));
        } catch (err) {
            setErrors(err.response?.data?.errors ?? {});
        } finally {
            setProcessing(false);
        }
    };

    const remove = async () => {
        if (!confirm('Hapus perangkat ini?')) return;
        await axios.delete(route('monitoring.devices.destroy', { id }));
        router.push(route('monitoring.devices.index'));
    };

    if (loading) {
        return (
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white">Edit perangkat</h2>}>
                <div className="py-8 text-center text-slate-400">Memuat…</div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold text-white">Edit perangkat</h2>
                    <Link
                        href={route('monitoring.devices.index')}
                        className="text-sm text-amber-300 hover:text-amber-200"
                    >
                        ← Kembali ke daftar
                    </Link>
                </div>
            }
        >
            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="space-y-6 rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-sm"
                    >
                        <div>
                            <InputLabel htmlFor="device_id" value="Device ID" className="text-slate-300" />
                            <TextInput
                                id="device_id"
                                className="mt-1 block w-full border-slate-600 bg-slate-950 text-white"
                                value={data.device_id}
                                onChange={(e) => setData({ ...data, device_id: e.target.value })}
                                required
                            />
                            <InputError message={errors.device_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="name" value="Nama" className="text-slate-300" />
                            <TextInput
                                id="name"
                                className="mt-1 block w-full border-slate-600 bg-slate-950 text-white"
                                value={data.name}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="location" value="Lokasi" className="text-slate-300" />
                            <TextInput
                                id="location"
                                className="mt-1 block w-full border-slate-600 bg-slate-950 text-white"
                                value={data.location}
                                onChange={(e) => setData({ ...data, location: e.target.value })}
                                required
                            />
                            <InputError message={errors.location} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="status" value="Status" className="text-slate-300" />
                            <select
                                id="status"
                                className="mt-1 block w-full rounded-md border-slate-600 bg-slate-950 text-white shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                value={data.status}
                                onChange={(e) => setData({ ...data, status: e.target.value })}
                            >
                                <option value="offline">Offline</option>
                                <option value="online">Online</option>
                            </select>
                            <InputError message={errors.status} className="mt-2" />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <DangerButton type="button" onClick={remove}>
                                Hapus
                            </DangerButton>
                            <div className="flex gap-2">
                                <Link
                                    href={route('monitoring.devices.index')}
                                    className="inline-flex items-center rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-700"
                                >
                                    Batal
                                </Link>
                                <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
