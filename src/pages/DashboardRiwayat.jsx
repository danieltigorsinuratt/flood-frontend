'use client';

import DashboardGridLayout from '@/components/FloodDashboard/DashboardGridLayout';
import IotLiveNotifications from '@/components/FloodDashboard/IotLiveNotifications';
import { useIotApiHost } from '@/contexts/IotApiHostContext';
import { WIDGET_TYPE_OPTIONS_RIWAYAT } from '@/lib/dashboardWidgetDefaults';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { formatTimeWib } from '@/lib/wibTime';
import axios from '@/lib/axios';
import { route } from '@/lib/routes';
import { useCallback, useEffect, useRef, useState } from 'react';

const EMPTY_DASH = {
  iot_connectivity: {},
  latest_data: [],
  chart_readings: [],
  chart_readings_by_device: {},
  devices: [],
  commands: [],
  activity_log: [],
  stats: {},
};

export default function DashboardRiwayat() {
  const { baseUrl } = useIotApiHost();
  const [dash, setDash] = useState(EMPTY_DASH);
  const [userLayout, setUserLayout] = useState(null);
  const [layoutLocked, setLayoutLocked] = useState(false);
  const [lastSync, setLastSync] = useState(() => new Date());
  const [nowWib, setNowWib] = useState(() => new Date());

  const refresh = useCallback(async () => {
    try {
      const { data } = await axios.get(route('dashboard.dataset'));
      setDash(data);
      setLastSync(new Date());
    } catch { /* abaikan */ }
  }, []);

  useEffect(() => {
    axios.get('/api/dashboard/user-layout?layout_name=riwayat')
      .then(({ data }) => {
        setUserLayout(data.layout ?? null);
        setLayoutLocked(Boolean(data.layout_locked));
      })
      .catch(() => {});
    refresh();
  }, [refresh]);

  const prevIotBaseRef = useRef(baseUrl);
  useEffect(() => {
    if (prevIotBaseRef.current === baseUrl) return;
    prevIotBaseRef.current = baseUrl;
    refresh().catch(() => {});
  }, [baseUrl, refresh]);

  useEffect(() => {
    const id = window.setInterval(() => setNowWib(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => refresh().catch(() => {}), 20000);
    return () => window.clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    const echo = window.Echo;
    if (!echo) return undefined;
    const channel = echo.channel('sensor-channel');
    const onSensorUpdated = () => refresh().catch(() => {});
    channel.listen('.sensor.updated', onSensorUpdated);
    return () => {
      channel.stopListening('.sensor.updated');
      echo.leave('sensor-channel');
    };
  }, [refresh]);

  return (
    <AuthenticatedLayout
      title="Riwayat"
      navbarTrailing={
        <>
          <span className="hidden flex-wrap items-baseline gap-x-1 text-xs text-slate-400 sm:inline-flex sm:text-sm">
            <span className="font-medium tabular-nums text-white">
              WIB {formatTimeWib(nowWib, { timeStyle: 'medium' })}
            </span>
            <span className="text-slate-500">·</span>
            <span>Data: {formatTimeWib(lastSync, { timeStyle: 'medium' })}</span>
          </span>
          <span className="text-xs tabular-nums text-slate-400 sm:hidden">
            WIB {formatTimeWib(nowWib, { timeStyle: 'short' })}
          </span>
          <button
            type="button"
            onClick={() => refresh().catch(() => {})}
            className="whitespace-nowrap rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-xs font-medium text-white shadow-sm transition-colors duration-200 hover:bg-slate-700 sm:px-3"
          >
            <span className="sm:hidden">Refresh</span>
            <span className="hidden sm:inline">Refresh data</span>
          </button>
        </>
      }
    >
      <div className="py-10">
        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <IotLiveNotifications iotConnectivity={dash.iot_connectivity} />
          </div>
          <div className="px-4 sm:px-0">
            <DashboardGridLayout
              userLayout={userLayout}
              layoutLocked={layoutLocked}
              dash={dash}
              onCommandSent={refresh}
              layoutName="riwayat"
              widgetTypeOptions={WIDGET_TYPE_OPTIONS_RIWAYAT}
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
