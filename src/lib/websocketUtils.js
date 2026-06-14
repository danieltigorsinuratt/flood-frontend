// Laravel Reverb WebSocket utility helper untuk frontend

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Global Echo instance
let echoInstance = null;

/**
 * Get atau initialize Echo instance untuk Laravel Reverb
 */
export function getEchoInstance() {
    if (echoInstance) {
        return echoInstance;
    }

    if (typeof window === 'undefined') {
        return null;
    }

    const reverbeHost = process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost';
    const reverbePort = process.env.NEXT_PUBLIC_REVERB_PORT || 8080;
    const reverbeScheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http';
    const reverbeAppKey = process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'flood-monitoring-app-key';

    // Setup Pusher (Reverb menggunakan protocol Pusher)
    window.Pusher = Pusher;
    Pusher.logToConsole = true;

    echoInstance = new Echo({
        broadcaster: 'pusher',
        key: reverbeAppKey,
        cluster: 'mt1',
        wsHost: reverbeHost,
        wsPort: reverbePort,
        wssPort: reverbePort,
        scheme: reverbeScheme,
        enabledTransports: ['ws', 'wss'],
        forceTLS: reverbeScheme === 'https',
    });

    return echoInstance;
}

/**
 * Subscribe ke channel untuk listen events
 */
export function subscribeToChannel(channelName, eventName, callback) {
    const echo = getEchoInstance();
    if (!echo) {
        console.error('Echo not initialized');
        return null;
    }

    const channel = echo.channel(channelName);
    channel.listen(`.${eventName}`, callback);
    
    console.log(`✅ Subscribed to ${channelName} listening for ${eventName}`);
    return channel;
}

/**
 * Unsubscribe dari channel
 */
export function unsubscribeFromChannel(channelName) {
    const echo = getEchoInstance();
    if (echo) {
        echo.leave(channelName);
        console.log(`❌ Unsubscribed from ${channelName}`);
    }
}

/**
 * Format alert level ke display color
 */
export function getAlertColor(level) {
    switch (level) {
        case 'danger':
            return 'text-red-600 bg-red-50';
        case 'warning':
            return 'text-yellow-600 bg-yellow-50';
        case 'normal':
        default:
            return 'text-green-600 bg-green-50';
    }
}

/**
 * Format alert level ke label
 */
export function getAlertLabel(level) {
    switch (level) {
        case 'danger':
            return 'AWAS';
        case 'warning':
            return 'SIAGA';
        case 'normal':
        default:
            return 'NORMAL';
    }
}

/**
 * Parse water level ke status readable
 */
export function formatWaterLevel(cm) {
    return `${cm.toFixed(2)} cm`;
}

/**
 * Get Reverb connection status
 */
export function getReverbStatus() {
    const echo = getEchoInstance();
    if (!echo) {
        return { connected: false, status: 'disconnected' };
    }

    // Check Pusher connection
    const pusher = echo.connector;
    if (!pusher) {
        return { connected: false, status: 'initializing' };
    }

    // Check if connection exists and has state property
    if (!pusher.connection || !pusher.connection.state) {
        return { connected: false, status: 'initializing' };
    }

    const state = pusher.connection.state;
    return {
        connected: state === 'connected',
        status: state,
    };
}

