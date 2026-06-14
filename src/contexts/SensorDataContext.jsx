'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useWebSocket } from '@/lib/useWebSocket';

const SensorDataContext = createContext();

export function SensorDataProvider({ children, wsUrl = 'ws://localhost:6001' }) {
    const [sensorData, setSensorData] = useState({});
    const [lastUpdate, setLastUpdate] = useState(null);
    const [alertLevels, setAlertLevels] = useState({});

    const handleSensorUpdate = useCallback((data) => {
        if (data.device_id) {
            setSensorData((prev) => ({
                ...prev,
                [data.device_id]: data,
            }));
            setAlertLevels((prev) => ({
                ...prev,
                [data.device_id]: data.alert_level || 'normal',
            }));
            setLastUpdate(new Date().toISOString());
        }
    }, []);

    const { isConnected, error } = useWebSocket(
        'sensor-channel',
        handleSensorUpdate,
        wsUrl
    );

    return (
        <SensorDataContext.Provider
            value={{
                sensorData,
                alertLevels,
                lastUpdate,
                isConnected,
                error,
            }}
        >
            {children}
        </SensorDataContext.Provider>
    );
}

export function useSensorData() {
    const context = useContext(SensorDataContext);
    if (!context) {
        throw new Error('useSensorData must be used within SensorDataProvider');
    }
    return context;
}
