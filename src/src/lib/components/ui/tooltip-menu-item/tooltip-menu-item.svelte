<script lang="ts">
    import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
    import * as PopoverPrimitive from "$lib/components/ui/popover";
    import { cn } from "$lib/utils.js";

    type $$Props = DropdownMenuPrimitive.ItemProps & {
        tooltipText?: string;
    };
    type $$Events = DropdownMenuPrimitive.ItemEvents;

    export let tooltipText: $$Props["tooltipText"] = undefined;
    export let className: string | undefined = undefined;
    export let disabled: $$Props["disabled"] = undefined;
</script>

{#if disabled && tooltipText}
    <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger class="w-full">
            <DropdownMenuPrimitive.Item
                {disabled}
                class={cn(
                    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    className
                )}
                {...$$restProps}
                on:click
                on:keydown
                on:focusin
                on:focusout
                on:pointerdown
                on:pointerleave
                on:pointermove
            >
                <slot />
            </DropdownMenuPrimitive.Item>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Content 
            class="z-50 w-auto rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md"
            side="right"
            sideOffset={5}
        >
            {tooltipText}
        </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
{:else}
    <DropdownMenuPrimitive.Item
        {disabled}
        class={cn(
            "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...$$restProps}
        on:click
        on:keydown
        on:focusin
        on:focusout
        on:pointerdown
        on:pointerleave
        on:pointermove
    >
        <slot />
    </DropdownMenuPrimitive.Item>
{/if} 