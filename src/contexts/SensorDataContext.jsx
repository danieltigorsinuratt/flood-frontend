'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { subscribeToChannel, unsubscribeFromChannel, getReverbStatus } from '@/lib/websocketUtils';

const SensorDataContext = createContext();

export function SensorDataProvider({ children }) {
    const [sensorData, setSensorData] = useState({});
    const [lastUpdate, setLastUpdate] = useState(null);
    const [alertLevels, setAlertLevels] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    const handleSensorUpdate = useCallback((message) => {
        try {
            const data = message.data || message;
            
            if (data && data.device_id) {
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
        } catch (err) {
            console.error('Error processing sensor data:', err);
        }
    }, []);

    // Setup Echo subscription
    useEffect(() => {
        try {
            // Subscribe ke sensor-channel
            const channel = subscribeToChannel('sensor-channel', 'sensor.updated', handleSensorUpdate);
            
            if (channel) {
                setIsConnected(true);
                setError(null);
            }

            // Monitor connection status
            const statusCheck = setInterval(() => {
                const status = getReverbStatus();
                setIsConnected(status.connected);
            }, 5000);

            return () => {
                clearInterval(statusCheck);
                unsubscribeFromChannel('sensor-channel');
            };
        } catch (err) {
            console.error('Error setting up Echo subscription:', err);
            setError(err.message);
            setIsConnected(false);
        }
    }, [handleSensorUpdate]);

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
