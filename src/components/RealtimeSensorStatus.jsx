'use client';

import { useSensorData } from '@/contexts/SensorDataContext';
import { getAlertColor, getAlertLabel, formatWaterLevel } from '@/lib/websocketUtils';

/**
 * Real-time Sensor Status Component
 * Menampilkan status semua sensor dengan live update dari WebSocket
 */
export default function RealtimeSensorStatus() {
    const { sensorData, alertLevels, isConnected, lastUpdate } = useSensorData();

    if (!isConnected) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700">
                    🔌 Connecting to WebSocket server...
                </p>
            </div>
        );
    }

    if (Object.keys(sensorData).length === 0) {
        return (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-600">
                    📡 Waiting for sensor data...
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    Last update: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Never'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Real-time Sensors</h3>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    🟢 {Object.keys(sensorData).length} active
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(sensorData).map(([deviceId, data]) => (
                    <div
                        key={deviceId}
                        className={`p-4 rounded-lg border-2 transition-all ${
                            getAlertColor(alertLevels[deviceId]).split(' ').slice(0, 2).join(' ')
                        } border-current`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="font-semibold text-sm truncate">
                                    {deviceId}
                                </p>
                                <p className="text-xs opacity-75">
                                    Sensor Data
                                </p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                getAlertColor(alertLevels[deviceId])
                            }`}>
                                {getAlertLabel(alertLevels[deviceId])}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs opacity-75">Water Level</span>
                                <span className="font-mono text-sm font-semibold">
                                    {formatWaterLevel(data.water_level)}
                                </span>
                            </div>
                            {data.rainfall !== undefined && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs opacity-75">Rainfall</span>
                                    <span className="font-mono text-sm">
                                        {data.rainfall.toFixed(2)} mm
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between pt-2 border-t border-current border-opacity-20">
                                <span className="text-xs opacity-75">Relay</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${
                                    data.relay_on
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {data.relay_on ? '🔴 ON' : '⚪ OFF'}
                                </span>
                            </div>
                        </div>

                        <p className="text-xs opacity-50 mt-3 pt-3 border-t border-current border-opacity-20">
                            Updated: {data.timestamp
                                ? new Date(data.timestamp).toLocaleTimeString()
                                : new Date(lastUpdate).toLocaleTimeString()
                            }
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-3 rounded">
                <span>📡 Real-time WebSocket connection</span>
                <span>✅ {Object.keys(sensorData).length} devices streaming</span>
            </div>
        </div>
    );
}
