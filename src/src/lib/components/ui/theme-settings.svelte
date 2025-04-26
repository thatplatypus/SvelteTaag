<script lang="ts">
    import { getContext } from 'svelte';
    import { Label } from '$lib/components/ui/label';
    import * as RadioGroupPrimitive from '$lib/components/ui/radio-group';
    
    const { accentColor, backgroundStyle } = getContext('themeSettings');
    
    let accentColorValue = 'default';
    let backgroundStyleValue = 'default';
    
    accentColor.subscribe(value => {
        accentColorValue = value;
    });
    
    backgroundStyle.subscribe(value => {
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
        accentColor.set(value);
        localStorage.setItem('accentColor', value);
    }
    
    function updateBackgroundStyle(value: string) {
        backgroundStyle.set(value);
        localStorage.setItem('backgroundStyle', value);
        
        if (value === 'matrix' && backgroundStyleValue !== 'matrix') {
            setTimeout(() => {
                const event = new CustomEvent('matrix-enabled');
                window.dispatchEvent(event);
            }, 100);
        }
    }
</script>

<div class="space-y-4">
    <h4 class="font-medium text-sm">Appearance Settings</h4>
    
    <div class="space-y-2">
        <h5 class="text-sm font-medium">Accent Color</h5>
        <RadioGroupPrimitive.Root value={accentColorValue} onValueChange={updateAccentColor}>
            <div class="flex flex-wrap gap-2">
                {#each accentColors as color}
                    <div class="flex items-center">
                        <RadioGroupPrimitive.Item value={color.value} id={`accent-${color.value}`} />
                        <Label for={`accent-${color.value}`} class="ml-2">{color.label}</Label>
                    </div>
                {/each}
            </div>
        </RadioGroupPrimitive.Root>
    </div>
    
    <div class="space-y-2">
        <h5 class="text-sm font-medium">Background Style</h5>
        <RadioGroupPrimitive.Root value={backgroundStyleValue} onValueChange={updateBackgroundStyle}>
            <div class="flex flex-col space-y-1">
                {#each backgroundStyles as style}
                    <div class="flex items-center">
                        <RadioGroupPrimitive.Item value={style.value} id={`bg-${style.value}`} />
                        <Label for={`bg-${style.value}`} class="ml-2">{style.label}</Label>
                    </div>
                {/each}
            </div>
        </RadioGroupPrimitive.Root>
    </div>
</div> 