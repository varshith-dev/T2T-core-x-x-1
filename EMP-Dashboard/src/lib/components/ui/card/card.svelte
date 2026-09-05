<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';

  let {
    class: className = '',
    children,
    ...restProps
  }: {
    class?: string;
    children?: Snippet;
    [key: string]: any;
  } = $props();
</script>

<div
  class={cn(
    'rounded-lg border border-zinc-200/80 bg-white text-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all',
    className
  )}
  {...restProps}
>
  {@render children?.()}
</div>
