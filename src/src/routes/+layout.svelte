<script lang="ts">
	import '../app.css';
	import ThemeToggle from '$lib/components/ui/theme-toggle.svelte';
	import ThemeSettings from '$lib/components/ui/theme-settings.svelte';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { Settings, Github, HeartHandshake } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as PopoverPrimitive from '$lib/components/ui/popover';
	let { children } = $props();
	
	// Create stores for theme settings
	const accentColor = writable('default');
	const backgroundStyle = writable('default');
	
	// Set context for use in other components
	setContext('themeSettings', {
		accentColor,
		backgroundStyle
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
								<ThemeSettings />
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
				<a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" class="font-medium underline underline-offset-4">Tailwind</a>, and
				<a href="https://github.com/patorjk/figlet.js" target="_blank" rel="noopener noreferrer" class="font-medium underline underline-offset-4">figlet.js</a>
			</p>
			<div class="flex items-center space-x-1">
				<span class="text-sm text-muted-foreground">Open Source</span>
				<HeartHandshake size={16} class="text-primary" />
				<a href="https://github.com/ThatPlatypus/SvelteTaag" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
					<Button variant="ghost" size="icon">
						<Github size={20} />
					</Button>
				</a>
			</div>
		</div>
	</footer>
</div>
