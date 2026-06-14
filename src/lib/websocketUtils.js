// WebSocket utility helper untuk frontend

/**
 * Get WebSocket URL berdasarkan environment
 */
export function getWebSocketURL() {
    if (typeof window === 'undefined') {
        return 'ws://localhost:6001';
    }

    // Production environment
    if (process.env.NODE_ENV === 'production') {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = process.env.NEXT_PUBLIC_WEBSOCKET_HOST || window.location.host;
        const port = process.env.NEXT_PUBLIC_WEBSOCKET_PORT || '';
        return `${protocol}//${host}${port ? `:${port}` : ''}`;
    }

    // Development environment
    return process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:6001';
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
