<script lang="ts">
	import { onMount, getContext, afterUpdate } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
	import { animate, stagger } from 'motion';
	import figlet from 'figlet';
	import { Label } from '$lib/components/ui/label';
	import * as RadioGroupPrimitive from '$lib/components/ui/radio-group';
	import type { ThemeSettings, AccentColor, BackgroundStyle } from '$lib/types';

	// Counter to force reactivity updates - declared early to avoid initialization errors
	let tickCounter = 0;
	
	// Get theme settings from context
	const { accentColor, backgroundStyle } = getContext<ThemeSettings>('themeSettings');
	
	// Reactive local values derived from the stores
	let accentColorValue: AccentColor = 'default';
	let backgroundStyleValue: BackgroundStyle = 'default';
	
	// Subscribe to store updates directly
	accentColor.subscribe(value => {
		console.log('Page received accent color update:', value);
		accentColorValue = value;
		tickCounter++; // Force reactivity
		
		// Update matrix color if it's active
		if (backgroundStyleValue === 'matrix' && window.matrixInterval) {
			initMatrixEffect();
		}
	});
	
	backgroundStyle.subscribe(value => {
		console.log('Page received background style update:', value);
		backgroundStyleValue = value;
		tickCounter++; // Force reactivity
		
		// Initialize matrix effect if needed
		if (value === 'matrix') {
			setTimeout(() => initMatrixEffect(), 10);
		}
	});

	// Define text and font variables
	let text = 'Type Something';
	let font = 'Standard';
	let horizontalLayout = 'default';
	let asciiArt = '';
	let fonts: string[] = [];
	let loading = true;
	let copying = false;
	let shareSuccess = false;
	let favoriteFont = 'Standard';
	let recentFonts: string[] = [];
	let popularFonts = ['Standard', 'Graffiti', 'ANSI Shadow', 'Slant', 'Small', 'Big', 'Banner'];
	let fontsLoaded = false;
	let currentFont = ''; // Track current font for debugging
	let fontChangeCount = 0; // Track how many times the font has been changed
	let debugMessages: string[] = [];
	
	// Define accent color and background style options
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
	
	const layoutOptions = [
		{ value: 'default', label: 'Default' },
		{ value: 'full', label: 'Full' },
		{ value: 'fitted', label: 'Fitted' },
		{ value: 'controlled smushing', label: 'Controlled Smushing' },
		{ value: 'universal smushing', label: 'Universal Smushing' }
	];

	// Reactive computation for the gradient class
	$: gradientClass = getAccentGradient(accentColorValue);
	
	// Helper function to get the gradient class based on accent color
	function getAccentGradient(accent: AccentColor) {
		console.log('Computing gradient class for:', accent);
		
		switch (accent) {
			case 'purple':
				return 'from-purple-600 to-indigo-600';
			case 'green':
				return 'from-green-600 to-emerald-600';
			case 'orange':
				return 'from-orange-600 to-amber-600';
			case 'red':
				return 'from-red-600 to-rose-600';
			case 'pink':
				return 'from-pink-600 to-fuchsia-600';
			default:
				return 'from-primary to-sky-600';
		}
	}

	// Listen for theme change events from settings
	function handleThemeChanged(event: CustomEvent) {
		console.log('Received theme-changed event:', event.detail);
		// Force a component update
		tickCounter++;
	}

	onMount(() => {
		// Add listener for theme changes from settings component
		document.addEventListener('theme-changed', handleThemeChanged as EventListener);
		
		console.log('Initial theme values on mount:', accentColorValue, backgroundStyleValue);
		
		figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts/' });
		
		const savedFont = localStorage.getItem('favoriteFont');
		if (savedFont) {
			favoriteFont = savedFont;
			font = savedFont;
		}
		
		const savedLayout = localStorage.getItem('preferredLayout');
		if (savedLayout) {
			horizontalLayout = savedLayout;
		}
		
		const savedRecentFonts = localStorage.getItem('recentFonts');
		if (savedRecentFonts) {
			try {
				recentFonts = JSON.parse(savedRecentFonts);
			} catch (e) {
				console.error('Error parsing recent fonts:', e);
			}
		}
		
		if (backgroundStyleValue === 'matrix') {
			initMatrixEffect();
		}
		
		window.addEventListener('matrix-enabled', initMatrixEffect);
		
		loadInitialFonts();
		
		return () => {
			// Clean up event listeners
			document.removeEventListener('theme-changed', handleThemeChanged as EventListener);
			window.removeEventListener('matrix-enabled', initMatrixEffect);
		};
	});

	function loadInitialFonts() {
		let loadedCount = 0;
		const fontsToLoad = [...popularFonts, favoriteFont, ...recentFonts.slice(0, 3)];
		
		const uniqueFonts = Array.from(new Set(fontsToLoad));

		uniqueFonts.forEach(fontName => {
			fetch(`https://unpkg.com/figlet/fonts/${fontName}.flf`)
				.then(response => {
					if (!response.ok) {
						throw new Error(`Failed to load font: ${fontName}`);
					}
					return response.text();
				})
				.then(fontData => {
					figlet.parseFont(fontName, fontData);
					loadedCount++;
					
					if (loadedCount === 1 && !fontsLoaded) {
						generateAsciiArt();
					}
					
					if (loadedCount === uniqueFonts.length) {
						loadAllFonts();
					}
				})
				.catch(err => {
					console.error(`Error loading font ${fontName}:`, err);
					loadedCount++;
					
					if (loadedCount === uniqueFonts.length) {
						loadAllFonts();
					}
				});
		});
		
		animate('.header-char', 
			{ opacity: [0, 1], y: [20, 0] }, 
			{ delay: stagger(0.05), duration: 0.5 }
		);
	}

	function loadAllFonts() {
		const allFonts = [
			'Standard', 'Graffiti', 'ANSI Shadow', 'Slant', 'Small', 'Big', 'Banner',
			'Poison', 'Calvin S', 'Dancing Font', 'Ghost', 'Doom', 'Script', 'Shadow',
			'Isometric1', 'Isometric2', 'Isometric3', 'Isometric4', 'Block', 'Bulbhead',
			'Digital', 'Ivrit', 'Lean', 'Mini', 'Mnemonic', 'Small Slant', 'Sub-Zero',
			'Swamp Land', 'Alligator', 'Alligator2', 'Alpha', 'Avatar', 'Binary', 'Bold',
			'Caligraphy', 'Contessa', 'Crawford', 'Cricket', 'Cyberlarge', 'Cybermedium',
			'Cybersmall', 'Delta Corps Priest 1', 'Diamond', 'Electronic', 'Elite', 'Flower Power',
			'Future', 'Gothic', 'Graffiti', 'Italic', 'LCD', 'Larry 3D', 'Lean', 'Letters',
			'Linux', 'Lockergnome', 'Madrid', 'Merlin1', 'Merlin2', 'Modular', 'Morse', 'Moscow',
			'NScript', 'Nancyj', 'O8', 'Ogre', 'Rectangles', 'Relief', 'Roman', 'Rot13',
			'Rounded', 'Rozzo', 'Runic', 'Runyc', 'S Blood', 'Santa Clara', 'Shimrod', 'Speed',
			'Stampatello', 'Star Strips', 'Star Wars', 'Stellar', 'Stick Letters', 'Stop',
			'Straight', 'Stronger Than All', 'Sunset', 'Tanja', 'Tengwar', 'Thin', 'THIS',
			'Ticksslant', 'Train', 'Trek', 'Twisted', 'USA Flag', 'Varsity', 'Wavy', 'Weird'
		];
		
		fonts = allFonts.sort();
		fontsLoaded = true;
		loading = false;
	}

	function loadFont(fontName: string) {
		return new Promise<void>((resolve, reject) => {
			fetch(`https://unpkg.com/figlet/fonts/${fontName}.flf`)
				.then(response => {
					if (!response.ok) {
						throw new Error(`Failed to load font: ${fontName}`);
					}
					return response.text();
				})
				.then(fontData => {
					figlet.parseFont(fontName, fontData);
					const message = `Font loaded: ${fontName}`;
					console.log(message);
					debugMessages = [...debugMessages, message];
					resolve();
				})
				.catch(error => {
					console.error(`Error loading font ${fontName}:`, error);
					debugMessages = [...debugMessages, `Error loading font: ${fontName}`];
					reject(error);
				});
		});
	}

	function generateAsciiArt() {
		loading = true;
		const message = `Generating with font: "${font}", layout: "${horizontalLayout}", change count: ${fontChangeCount}`;
		console.log(message);
		debugMessages = [...debugMessages, message];
		currentFont = font;
		
		if (font !== favoriteFont && !recentFonts.includes(font)) {
			recentFonts = [font, ...recentFonts.slice(0, 4)];
			localStorage.setItem('recentFonts', JSON.stringify(recentFonts));
		}
		
		loadFont(font)
			.then(() => {
				try {
					const result = figlet.textSync(text, { 
						font, 
						horizontalLayout 
					});
					console.log(`Generated ASCII art with font: ${font}`);
					debugMessages = [...debugMessages, `Generated ASCII art with font: ${font}`];
					asciiArt = result;
					loading = false;
					
					const container = document.querySelector('.ascii-container');
					if (container) {
						animate('.ascii-container', 
							{ opacity: [0, 1] }, 
							{ duration: 0.3 }
						);
					}
				} catch (error) {
					console.error(`Error in figlet.textSync: ${error}`);
					debugMessages = [...debugMessages, `Error in figlet.textSync: ${error}`];
					asciiArt = `Error generating ASCII art: ${error}`;
					loading = false;
				}
			})
			.catch(error => {
				console.error('Error generating ASCII art:', error);
				debugMessages = [...debugMessages, `Error generating ASCII art: ${error}`];
				asciiArt = `Error: Could not load font "${font}"`;
				loading = false;
			});
	}

	function copyToClipboard() {
		if (navigator.clipboard && asciiArt) {
			copying = true;
			navigator.clipboard.writeText(asciiArt)
				.then(() => {
					animate('.copy-icon', 
						{ scale: [1, 1.2, 1] }, 
						{ duration: 0.3 }
					);
					setTimeout(() => {
						copying = false;
					}, 2000);
				})
				.catch((err) => {
					console.error('Failed to copy:', err);
					copying = false;
				});
		}
	}

	function shareAsciiArt() {
		if (navigator.share) {
			shareSuccess = false;
			navigator.share({
				title: 'ASCII Art Generated with TAAG',
				text: asciiArt
			}).then(() => {
				shareSuccess = true;
				animate('.share-icon', 
					{ rotate: [0, 360] }, 
					{ duration: 0.5 }
				);
				setTimeout(() => {
					shareSuccess = false;
				}, 2000);
			}).catch((err) => {
				console.error('Failed to share:', err);
			});
		}
	}

	function setFavoriteFont() {
		favoriteFont = font;
		localStorage.setItem('favoriteFont', favoriteFont);
		animate('.favorite-icon', 
			{ scale: [1, 1.3, 1] }, 
			{ duration: 0.3 }
		);
	}

	function handleTextChange(e: Event) {
		text = (e.target as HTMLInputElement).value;
	}

	function handleFontChange(value: any) {
		if (value && value.value !== undefined) {
			fontChangeCount++;
			const selected = value.value;
			const message = `Font selected/changed to: ${selected} (change #${fontChangeCount})`;
			console.log(message);
			debugMessages = [...debugMessages, message];
			font = selected.toString();
		}
	}

	function handleLayoutChange(value: any) {
		if (value && value.value !== undefined) {
			const selected = value.value;
			const message = `Layout selected: ${selected}`;
			console.log(message);
			debugMessages = [...debugMessages, message];
			horizontalLayout = selected.toString();
			localStorage.setItem('preferredLayout', horizontalLayout);
		}
	}
	
	function resetFontToStandard() {
		font = 'Standard';
		const message = 'Font reset to Standard';
		console.log(message);
		debugMessages = [...debugMessages, message];
		generateAsciiArt();
	}
	
	function updateAccentColor(value: string) {
		accentColor.set(value as AccentColor);
		localStorage.setItem('accentColor', value);
	}
	
	function updateBackgroundStyle(value: string) {
		const oldValue = backgroundStyleValue;
		backgroundStyle.set(value as BackgroundStyle);
		localStorage.setItem('backgroundStyle', value);
		
		if (value === 'matrix' && oldValue !== 'matrix') {
			setTimeout(() => {
				initMatrixEffect();
			}, 100);
		}
	}
	
	function initMatrixEffect() {
		const canvas = document.getElementById('matrix-bg') as HTMLCanvasElement;
		if (!canvas) return;
		
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		const fontSize = 16;
		const columns = Math.floor(canvas.width / fontSize);
		
		const drops: number[] = [];
		for (let i = 0; i < columns; i++) {
			drops[i] = 1;
		}
		
		const accentColorMap: Record<string, string> = {
			'default': '#0ea5e9', // sky blue
			'purple': '#8b5cf6',
			'green': '#10b981',
			'orange': '#f97316',
			'red': '#ef4444',
			'pink': '#ec4899'
		};
		
		// Clean up any existing matrix effect
		if (window.matrixInterval) {
			clearInterval(window.matrixInterval);
			window.matrixInterval = undefined;
		}
		
		// Draw function that uses the current accent color
		const draw = () => {
			// Semi-transparent black to create trail effect
			ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			// Always use the most current accent color
			ctx.fillStyle = accentColorMap[accentColorValue] || '#0ea5e9';
			ctx.font = `${fontSize}px monospace`;
			
			for (let i = 0; i < drops.length; i++) {
				const text = chars[Math.floor(Math.random() * chars.length)];
				ctx.fillText(text, i * fontSize, drops[i] * fontSize);
				
				if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
					drops[i] = 0;
				}
				
				drops[i]++;
			}
		};
		
		// Start the animation
		window.matrixInterval = setInterval(draw, 33);
		
		// Initial draw to show effect immediately
		draw();
		
		// Respond to window resize
		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			
			// Recalculate columns
			const newColumns = Math.floor(canvas.width / fontSize);
			
			// Reset drops array
			drops.length = 0;
			for (let i = 0; i < newColumns; i++) {
				drops[i] = 1;
			}
		};
		
		window.addEventListener('resize', handleResize);
		
		// Return cleanup function
		return () => {
			if (window.matrixInterval) {
				clearInterval(window.matrixInterval);
				window.matrixInterval = undefined;
			}
			window.removeEventListener('resize', handleResize);
		};
	}
	
	// After each update, make sure our UI is consistent
	afterUpdate(() => {
		// This runs after the component has updated
		console.log('Component updated with theme:', accentColorValue, backgroundStyleValue);
	});
</script>

<div class="{backgroundStyleValue === 'gradient' ? 'bg-gradient-to-br ' + gradientClass + ' min-h-screen text-white' : 'min-h-screen'}" class:matrix-container={backgroundStyleValue === 'matrix'} data-tick={tickCounter}>
	{#if backgroundStyleValue === 'matrix'}
		<canvas id="matrix-bg" class="fixed top-0 left-0 w-full h-full -z-10"></canvas>
	{/if}
	
	<div class="container mx-auto px-4 py-8 max-w-4xl">
		<h1 class="text-4xl font-bold mb-8 text-center">
			{#each 'Text to ASCII Art Generator'.split('') as char, i}
				{#if char === ' '}
					<span class="header-char inline-block w-2">&nbsp;</span>
				{:else}
					<span class="header-char inline-block">{char}</span>
				{/if}
			{/each}
		</h1>
		
		<div class="bg-card rounded-lg p-6 shadow-lg mb-8 backdrop-blur-sm" class:bg-opacity-90={backgroundStyleValue === 'matrix'}>
			<div class="mb-6">
				<label for="text-input" class="block text-sm font-medium mb-2">Input Text</label>
				<input
					id="text-input"
					type="text"
					value={text}
					on:input={handleTextChange}
					class="w-full p-2 border rounded-md bg-background"
					placeholder="Type something..."
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				<div>
					<label class="block text-sm font-medium mb-2">Font</label>
					<Select onSelectedChange={(value) => handleFontChange(value)}>
						<SelectTrigger class="w-full">
							<SelectValue placeholder="Select a font">
								{font}
							</SelectValue>
						</SelectTrigger>
						<SelectContent 
							class="max-h-[400px] overflow-y-auto"
							sideOffset={4}
						>
							{#if favoriteFont}
								<div class="p-2 border-b">
									<h3 class="text-sm font-semibold mb-2">Favorite</h3>
									<SelectItem value={favoriteFont}>{favoriteFont}</SelectItem>
								</div>
							{/if}
							
							{#if recentFonts.length > 0}
								<div class="p-2 border-b">
									<h3 class="text-sm font-semibold mb-2">Recent</h3>
									{#each recentFonts as recentFont}
										<SelectItem value={recentFont}>{recentFont}</SelectItem>
									{/each}
								</div>
							{/if}
							
							<div class="p-2 border-b">
								<h3 class="text-sm font-semibold mb-2">Popular</h3>
								{#each popularFonts as popularFont}
									<SelectItem value={popularFont}>{popularFont}</SelectItem>
								{/each}
							</div>
							
							<div class="p-2">
								<h3 class="text-sm font-semibold mb-2">All Fonts</h3>
								{#each fonts as fontName}
									<SelectItem value={fontName}>{fontName}</SelectItem>
								{/each}
							</div>
						</SelectContent>
					</Select>
				</div>
				<div>
					<label class="block text-sm font-medium mb-2">Kerning Style</label>
					<Select onSelectedChange={(value) => handleLayoutChange(value)}>
						<SelectTrigger class="w-full">
							<SelectValue placeholder="Select a style">
								{horizontalLayout}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{#each layoutOptions as option}
								<SelectItem value={option.value}>{option.label}</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				</div>
			</div>
			
			<div class="w-full">
				<Button 
					on:click={generateAsciiArt} 
					class="w-full py-3 text-center text-white font-medium text-lg bg-gradient-to-r {gradientClass} hover:shadow-lg transition-all duration-300 ease-in-out"
					data-accent={accentColorValue}
				>
					Generate ASCII Art
				</Button>
			</div>
		</div>

		
		<div class="bg-card rounded-lg p-6 shadow-lg mb-8 backdrop-blur-sm" class:bg-opacity-90={backgroundStyleValue === 'matrix'}>
			<div class="flex justify-between mb-4">
				<h2 class="text-xl font-semibold">Generated ASCII Art</h2>
				<div class="space-x-2 flex">
					<Button on:click={setFavoriteFont} variant="outline" disabled={loading || font === favoriteFont} size="sm" class="favorite-button">
						<span class="favorite-icon inline-block mr-1">❤️</span>
						Favorite
					</Button>
					<Button on:click={copyToClipboard} variant="outline" disabled={loading || !asciiArt} size="sm" class="copy-button">
						<span class="copy-icon inline-block mr-1">{copying ? '✓' : '📋'}</span>
						{copying ? 'Copied!' : 'Copy'}
					</Button>
					{#if typeof navigator !== 'undefined' && 'share' in navigator}
						<Button on:click={shareAsciiArt} variant="outline" disabled={loading || !asciiArt} size="sm" class="share-button">
							<span class="share-icon inline-block mr-1">{shareSuccess ? '✓' : '📤'}</span>
							{shareSuccess ? 'Shared!' : 'Share'}
						</Button>
					{/if}
				</div>
			</div>

			{#if loading}
				<div class="flex justify-center p-8">
					<div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
				</div>
			{:else}
				<div class="ascii-container bg-background p-4 rounded-md overflow-x-auto">
					<pre class="text-left whitespace-pre text-sm font-mono">{asciiArt}</pre>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.matrix-container {
		color: white;
	}
</style>
