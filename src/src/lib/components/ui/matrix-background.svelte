<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import type { AccentColor } from '$lib/types';
    
    export let accentColor: AccentColor = 'default';
    
    // Number of matrix streams to create - increase for more density
    const numberOfStreams = 60;
    
    let streamElements: {left: string, top: string, big: boolean, delay: boolean}[] = [];
    
    // Map accent colors to CSS variables
    const accentColorMap: Record<AccentColor, string> = {
        'default': '#0ea5e9', // sky blue
        'purple': '#8b5cf6',
        'green': '#00ff00', // bright green for matrix
        'orange': '#f97316',
        'red': '#ef4444',
        'pink': '#ec4899'
    };
    
    // Generate random left positions
    function getRandomLeft(): string {
        const leftPositions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
        const randomIndex = Math.floor(Math.random() * leftPositions.length);
        return `l${leftPositions[randomIndex]}`;
    }
    
    // Generate random top starting positions
    function getRandomTop(): string {
        const topValues = [200, 500, 180, 700, 800, 900, 300, 400, 250, 320, 190, 520, 380, 600, 650, 290, 530, 420, 310];
        const randomIndex = Math.floor(Math.random() * topValues.length);
        return `t${topValues[randomIndex]}`;
    }
    
    // Initialize the streams with random positions
    function initializeStreams() {
        streamElements = [];
        for (let i = 0; i < numberOfStreams; i++) {
            // Decide if this stream should be "big"
            const isBig = Math.random() > 0.7;
            // Decide if this stream should have a delay
            const hasDelay = Math.random() > 0.5;
            
            streamElements.push({
                left: getRandomLeft(),
                top: getRandomTop(),
                big: isBig,
                delay: hasDelay
            });
        }
        console.log(`Created ${streamElements.length} matrix streams`);
    }
    
    // Handler for matrix-enabled events
    function handleMatrixEnabled() {
        console.log('Matrix effect enabled or refreshed');
        initializeStreams();
    }
    
    onMount(() => {
        console.log('Matrix component mounted');
        initializeStreams();
        
        // Listen for matrix-enabled events
        window.addEventListener('matrix-enabled', handleMatrixEnabled);
        
        // Listen for resize events to adjust number of streams if needed
        const handleResize = () => {
            console.log('Window resized, refreshing matrix');
            initializeStreams();
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('matrix-enabled', handleMatrixEnabled);
            window.removeEventListener('resize', handleResize);
        };
    });
    
    // When accent color changes, force a small delay to allow CSS to update
    $: if (accentColor) {
        console.log('Matrix accent color changed to:', accentColor);
    }
</script>

<style>
    /* Create falling letter animation using standard CSS animations */
    .matrix-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 1;
        background-color: transparent;
        pointer-events: none;
    }

    /* Left position classes */
    .l0 { left: 0%; }
    .l5 { left: 5%; }
    .l10 { left: 10%; }
    .l15 { left: 15%; }
    .l20 { left: 20%; }
    .l25 { left: 25%; }
    .l30 { left: 30%; }    
    .l35 { left: 35%; }
    .l40 { left: 40%; }
    .l45 { left: 45%; }
    .l50 { left: 50%; }
    .l55 { left: 55%; }
    .l60 { left: 60%; }
    .l65 { left: 65%; }
    .l70 { left: 70%; }
    .l75 { left: 75%; }
    .l80 { left: 80%; }
    .l85 { left: 85%; }
    .l90 { left: 90%; }
    .l95 { left: 95%; }
    .l100 { left: calc(100% - 20px); }

    /* Top position classes */
    .t200 { top: -400px; }
    .t500 { top: -500px; }
    .t180 { top: -680px; }
    .t700 { top: -700px; }
    .t800 { top: -800px; }
    .t900 { top: -900px; }
    .t300 { top: -300px; }    
    .t400 { top: -400px; }    
    .t250 { top: -250px; }    
    .t320 { top: -320px; }    
    .t190 { top: -690px; }    
    .t520 { top: -520px; }    
    .t380 { top: -680px; }    
    .t600 { top: -600px; }    
    .t650 { top: -650px; }    
    .t290 { top: -790px; }    
    .t530 { top: -730px; }    
    .t420 { top: -720px; }    
    .t310 { top: -410px; }

    .big {
        font-size: 24px;
    }

    .letter {
        position: absolute;
        font-family: monospace;
        color: currentColor;
        text-shadow: 0 0 5px currentColor;
        animation: fall 5s linear infinite;
    }

    .d2 {
        animation-delay: 2.5s;
    }

    .letter::after {
        content: 'abcdefghijklmnopqrstuvwxyz0123456789';
        display: inline-block;
        writing-mode: vertical-rl;
        text-orientation: upright;
    }

    .big .letter::after {
        content: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    }

    @keyframes fall {
        0% {
            transform: translateY(0) rotateY(0);
            opacity: 1;
        }
        85% {
            opacity: 1;
        }
        100% {
            transform: translateY(110vh) rotateY(360deg);
            opacity: 0;
        }
    }
    
    /* Accent color classes */
    .matrix-default {
        color: #0ea5e9;
    }
    
    .matrix-purple {
        color: #8b5cf6;
    }
    
    .matrix-green {
        color: #00ff00;
    }
    
    .matrix-orange {
        color: #f97316;
    }
    
    .matrix-red {
        color: #ef4444;
    }
    
    .matrix-pink {
        color: #ec4899;
    }
</style>

<div class="matrix-container">
    {#each streamElements as stream, i (i)}
        <div class="letter {stream.left} {stream.top} matrix-{accentColor} {stream.big ? 'big' : ''} {stream.delay ? 'd2' : ''}"></div>
    {/each}
</div> 