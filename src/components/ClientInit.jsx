'use client';

import { primeWaterLevelEchoBridge } from '@/components/water-level/echoBridge';
import { useEffect } from 'react';

export default function ClientInit() {
    useEffect(() => {
        primeWaterLevelEchoBridge();
    }, []);
    return null;
}
