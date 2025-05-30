<script lang="ts">
	import '../app.css';
	import ThemeToggle from '$lib/components/ui/theme-toggle.svelte';
	import ThemeSettingsComponent from '$lib/components/ui/theme-settings.svelte';
	import { setContext, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Settings, Github, HeartHandshake } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as PopoverPrimitive from '$lib/components/ui/popover';
	import type { ThemeSettings, AccentColor, BackgroundStyle } from '$lib/types';
	
	let { children } = $props();
	
	// Create stores for theme settings with default values
	const accentColor = writable<AccentColor>('default');
	const backgroundStyle = writable<BackgroundStyle>('default');
	
	// Set context for use in other components
	setContext<ThemeSettings>('themeSettings', {
		accentColor,
		backgroundStyle
	});
	
	// Load saved settings on mount
	onMount(() => {
		// Load saved theme settings from localStorage
		const savedAccentColor = localStorage.getItem('accentColor') as AccentColor | null;
		if (savedAccentColor) {
			console.log('Layout loading accent from localStorage:', savedAccentColor);
			accentColor.set(savedAccentColor);
		}
		
		const savedBackgroundStyle = localStorage.getItem('backgroundStyle') as BackgroundStyle | null;
		if (savedBackgroundStyle) {
			console.log('Layout loading background from localStorage:', savedBackgroundStyle);
			backgroundStyle.set(savedBackgroundStyle);
		}
	});
</script>

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
		<div class="container flex h-14 items-center">
			<div class="mr-4 flex">
				<a href="/" class="flex items-center space-x-2">
					<span class="font-bold">Text to ASCII Art Generator ✨</span>
				</a>
			</div>
			<div class="flex flex-1 items-center justify-end">
				<nav class="flex items-center space-x-2">																		
					<ThemeToggle />

					<PopoverPrimitive.Root>
						<PopoverPrimitive.Trigger>
							<Button variant="ghost" size="icon">
								<Settings size={20} />
							</Button>
						</PopoverPrimitive.Trigger>
						<PopoverPrimitive.Content class="w-80" align="end">
							<div class="p-4">
								<ThemeSettingsComponent />
							</div>
						</PopoverPrimitive.Content>
					</PopoverPrimitive.Root>					
				</nav>
			</div>
		</div>
	</header>
	<main class="flex-1">
		{@render children()}
	</main>
	<footer class="border-t py-6 md:py-0">
		<div class="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
			<p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
				Built with <a href="https://kit.svelte.dev" target="_blank" rel="noopener noreferrer" class="font-medium underline underline-offset-4">SvelteKit</a>,
				<a href="https://www.shadcn-svelte.com/" target="_blank" rel="noopener noreferrer" class="font-medium underline underline-offset-4">ShadCn</a>,
				<a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" class="font-medium underline underline-offset-4">Tailwind</a>, and
				<a href="https://github.com/patorjk/figlet.js" target="_blank" rel="noopener noreferrer" class="font-medium underline underline-offset-4">figlet.js</a>
			</p>
			<div class="flex items-center space-x-1 rounded-2xl p-[2px] bg-gradient-to-r from-red-500 via-pink-500 to-red-400">
				<span class="rounded-2xl bg-white dark:bg-gray-900 p-1 flex items-center space-x-1">
				<HeartHandshake size={16} class="text-primary" />
				<span class="text-sm text-muted-foreground">Open Source</span>
				<a href="https://github.com/ThatPlatypus/SvelteTaag" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
					<Button variant="ghost" size="icon">
						<Github size={20} />
					</Button>
				</a>
			</span>
			</div>
		</div>
	</footer>
</div>
