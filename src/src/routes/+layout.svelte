<script lang="ts">
	import '../app.css';
	import ThemeToggle from '$lib/components/ui/theme-toggle.svelte';
	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
		<div class="container flex h-14 items-center">
			<div class="mr-4 flex">
				<a href="/" class="flex items-center space-x-2">
					<span class="font-bold">TAAG</span>
				</a>
			</div>
			<div class="flex flex-1 items-center justify-end">
				<nav class="flex items-center space-x-1">
					<ThemeToggle />
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
		</div>
	</footer>
</div>
