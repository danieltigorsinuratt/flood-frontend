import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook untuk WebSocket real-time subscription
 * @param {string} channel - Nama channel untuk subscribe
 * @param {Function} onMessage - Callback saat menerima message
 * @param {string} wsUrl - WebSocket URL (default: localhost:6001)
 */
export function useWebSocket(channel, onMessage, wsUrl = 'ws://localhost:6001') {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const connect = useCallback(() => {
        try {
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log(`✅ WebSocket connected to ${channel}`);
                setIsConnected(true);
                setError(null);

                // Subscribe ke channel
                ws.send(JSON.stringify({
                    type: 'subscribe',
                    channel: channel,
                }));
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'message' && onMessage) {
                        onMessage(message.data);
                    } else if (message.type === 'subscription_confirmed') {
                        console.log(`✅ Subscription confirmed: ${message.channel}`);
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                }
            };

            ws.onerror = (err) => {
                console.error('WebSocket error:', err);
                setError('WebSocket connection error');
                setIsConnected(false);
            };

            ws.onclose = () => {
                console.log('🔌 WebSocket disconnected');
                setIsConnected(false);

                // Auto-reconnect after 3 seconds
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log('🔄 Attempting to reconnect...');
                    connect();
                }, 3000);
            };

            wsRef.current = ws;
        } catch (err) {
            console.error('Failed to create WebSocket:', err);
            setError(err.message);
        }
    }, [channel, onMessage, wsUrl]);

    useEffect(() => {
        connect();

        return () => {
            // Cleanup
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    type: 'unsubscribe',
                    channel: channel,
                }));
                wsRef.current.close();
            }
        };
    }, [channel, connect]);

    return {
        isConnected,
        error,
        send: (message) => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify(message));
            }
        },
    };
}
