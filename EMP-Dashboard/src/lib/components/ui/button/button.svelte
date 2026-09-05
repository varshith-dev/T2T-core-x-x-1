<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';

  let {
    variant = 'default',
    size = 'default',
    class: className = '',
    children,
    onclick,
    disabled = false,
    type = 'button',
    ...restProps
  }: {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    class?: string;
    children?: Snippet;
    onclick?: (e: MouseEvent) => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    [key: string]: any;
  } = $props();

  const baseStyles = 'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none';

  const variants = {
    default: 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-xs',
    destructive: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
    outline: 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 shadow-xs',
    secondary: 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200/70',
    ghost: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
    link: 'text-zinc-900 underline-offset-4 hover:underline'
  };

  const sizes = {
    default: 'h-8 px-3 py-1.5',
    sm: 'h-7 rounded px-2.5 text-[11px]',
    lg: 'h-9 rounded-md px-4 text-sm',
    icon: 'h-8 w-8 p-0'
  };
</script>

<button
  {type}
  {disabled}
  class={cn(baseStyles, variants[variant], sizes[size], className)}
  {onclick}
  {...restProps}
>
  {@render children?.()}
</button>
