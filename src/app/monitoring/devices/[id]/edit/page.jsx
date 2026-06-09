import DevicesEditPage from '@/pages/Monitoring/Devices/Edit';

export const metadata = {
  title: 'Monitoring — Edit Perangkat',
};

export default async function Page({ params }) {
  const { id } = await params;
  return <DevicesEditPage deviceId={id} />;
}
