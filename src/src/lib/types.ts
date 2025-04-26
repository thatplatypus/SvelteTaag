import type { Writable } from 'svelte/store';

export type AccentColor = 'default' | 'purple' | 'green' | 'orange' | 'red' | 'pink';
export type BackgroundStyle = 'default' | 'gradient' | 'matrix';

export interface ThemeSettings {
    accentColor: Writable<AccentColor>;
    backgroundStyle: Writable<BackgroundStyle>;
} 