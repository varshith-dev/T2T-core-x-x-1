<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';

  let {
    variant = 'default',
    class: className = '',
    children,
    ...restProps
  }: {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'purple' | 'cyan';
    class?: string;
    children?: Snippet;
    [key: string]: any;
  } = $props();

  const baseStyles = 'inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium border transition-colors';

  const variants = {
    default: 'border-zinc-200 bg-zinc-100 text-zinc-800',
    secondary: 'border-zinc-200 bg-zinc-50 text-zinc-600',
    destructive: 'border-red-200 bg-red-50 text-red-700',
    outline: 'border-zinc-200 text-zinc-600 bg-white',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    purple: 'border-purple-200 bg-purple-50 text-purple-700',
    cyan: 'border-sky-200 bg-sky-50 text-sky-700'
  };
</script>

<span class={cn(baseStyles, variants[variant], className)} {...restProps}>
  {@render children?.()}
</span>
