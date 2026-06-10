'use client';

import { useSensorData } from '@/contexts/SensorDataContext';
import { getAlertColor, getAlertLabel, formatWaterLevel } from '@/lib/websocketUtils';

/**
 * Real-time Sensor Widget Component
 * Menampilkan live streaming data sensor via WebSocket
 */
export default function RealTimeSensorWidget() {
    const { sensorData, alertLevels, isConnected, lastUpdate } = useSensorData();

    if (!isConnected) {
        return (
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-yellow-400">
                        🔄 Connecting to real-time WebSocket...
                    </p>
                </div>
            </div>
        );
    }

    if (Object.keys(sensorData).length === 0) {
        return (
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-blue-400">
                        📡 Waiting for sensor data...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Live Sensor Data (WebSocket)</h3>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-400">Connected</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(sensorData).map(([deviceId, data]) => {
                    const alertLevel = alertLevels[deviceId] || 'normal';
                    const colorClass = getAlertColor(alertLevel);

                    return (
                        <div
                            key={deviceId}
                            className={`rounded-lg border p-3 transition-all ${
                                alertLevel === 'danger'
                                    ? 'border-red-700 bg-red-950'
                                    : alertLevel === 'warning'
                                    ? 'border-yellow-700 bg-yellow-950'
                                    : 'border-green-700 bg-green-950'
                            }`}
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-xs font-mono text-slate-300 truncate">
                                    {deviceId}
                                </p>
                                <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                                    alertLevel === 'danger'
                                        ? 'bg-red-600 text-white'
                                        : alertLevel === 'warning'
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-green-600 text-white'
                                }`}>
                                    {getAlertLabel(alertLevel)}
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Water Level:</span>
                                    <span className="font-mono font-semibold text-white">
                                        {formatWaterLevel(data.water_level)}
                                    </span>
                                </div>

                                {data.rainfall !== undefined && (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Rainfall:</span>
                                        <span className="font-mono text-slate-300">
                                            {data.rainfall.toFixed(2)} mm
                                        </span>
                                    </div>
                                )}

                                <div className="border-t border-slate-700 pt-1.5 flex justify-between text-xs">
                                    <span className="text-slate-400">Relay:</span>
                                    <span className={`font-bold ${
                                        data.relay_on
                                            ? 'text-red-400'
                                            : 'text-green-400'
                                    }`}>
                                        {data.relay_on ? '🔴 ON' : '⚪ OFF'}
                                    </span>
                                </div>
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                                {data.timestamp
                                    ? new Date(data.timestamp).toLocaleTimeString('id-ID')
                                    : 'N/A'
                                }
                            </p>
                        </div>
                    );
                })}
            </div>

            <p className="mt-3 border-t border-slate-700 pt-2 text-xs text-slate-500">
                ✅ Real-time updates • Last: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString('id-ID') : 'N/A'}
            </p>
        </div>
    );
}
