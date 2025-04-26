<script lang="ts">
    import { getContext, onMount } from 'svelte';
    import { Label } from '$lib/components/ui/label';
    import * as RadioGroupPrimitive from '$lib/components/ui/radio-group';
    import type { ThemeSettings, AccentColor, BackgroundStyle } from '$lib/types';
    import { Separator } from "$lib/components/ui/separator";    
    const { accentColor, backgroundStyle } = getContext<ThemeSettings>('themeSettings');
    
    let accentColorValue: AccentColor = 'default';
    let backgroundStyleValue: BackgroundStyle = 'default';
    
    accentColor.subscribe(value => {
        console.log('Theme settings component: accent color is now', value);
        accentColorValue = value;
    });
    
    backgroundStyle.subscribe(value => {
        console.log('Theme settings component: background style is now', value);
        backgroundStyleValue = value;
    });
    
    const accentColors = [
        { value: 'default', label: 'Default (Blue)' },
        { value: 'purple', label: 'Purple' },
        { value: 'green', label: 'Green' },
        { value: 'orange', label: 'Orange' },
        { value: 'red', label: 'Red' },
        { value: 'pink', label: 'Pink' }
    ];
    
    const backgroundStyles = [
        { value: 'default', label: 'ShadCN Classic' },
        { value: 'gradient', label: 'Gradient Effect' },
        { value: 'matrix', label: 'Matrix Effect' }
    ];
    
    function updateAccentColor(value: string) {
        console.log('User selected accent color:', value);
        const typedValue = value as AccentColor;
        accentColor.set(typedValue);
        localStorage.setItem('accentColor', value);
    }
    
    function updateBackgroundStyle(value: string) {
        console.log('User selected background style:', value);
        const typedValue = value as BackgroundStyle;
        backgroundStyle.set(typedValue);
        localStorage.setItem('backgroundStyle', value);
        
        if (value === 'matrix') {
            setTimeout(() => {
                console.log('Dispatching matrix-enabled event');
                const event = new CustomEvent('matrix-enabled');
                window.dispatchEvent(event);
            }, 10);
        }
    }
    
    onMount(() => {
        const savedAccentColor = localStorage.getItem('accentColor') as AccentColor | null;
        if (savedAccentColor) {
            console.log('Loading saved accent color:', savedAccentColor);
            accentColor.set(savedAccentColor);
        }
        
        const savedBackgroundStyle = localStorage.getItem('backgroundStyle') as BackgroundStyle | null;
        if (savedBackgroundStyle) {
            console.log('Loading saved background style:', savedBackgroundStyle);
            backgroundStyle.set(savedBackgroundStyle);
        }
    });
</script>

<div class="space-y-4">
    <h4 class="font-medium text-sm">Appearance Settings</h4>
    
    <div class="space-y-2">
        <h5 class="text-sm font-medium">Accent Color</h5>
        <RadioGroupPrimitive.Root 
            value={accentColorValue} 
            onValueChange={updateAccentColor}
            id="accent-color-group"
        >
            <div class="flex flex-wrap gap-2">
                {#each accentColors as color}
                    <div class="flex items-center">
                        <RadioGroupPrimitive.Item 
                            value={color.value} 
                            id={`accent-${color.value}`}
                        />
                        <Label for={`accent-${color.value}`} class="ml-2">{color.label}</Label>
                    </div>
                {/each}
            </div>
        </RadioGroupPrimitive.Root>
    </div>
    <Separator />
    <div class="space-y-2">
        <h5 class="text-sm font-medium">Background Style</h5>
        <RadioGroupPrimitive.Root 
            value={backgroundStyleValue} 
            onValueChange={updateBackgroundStyle}
            id="background-style-group"
        >
            <div class="flex flex-col space-y-1">
                {#each backgroundStyles as style}
                    <div class="flex items-center">
                        <RadioGroupPrimitive.Item 
                            value={style.value} 
                            id={`bg-${style.value}`}
                        />
                        <Label for={`bg-${style.value}`} class="ml-2">{style.label}</Label>
                    </div>
                {/each}
            </div>
        </RadioGroupPrimitive.Root>
    </div>
</div> 