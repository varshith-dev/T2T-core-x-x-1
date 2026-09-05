<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';

  let { class: className = '', children, ...restProps }: { class?: string; children?: Snippet; [key: string]: any } = $props();
</script>

<h3 class={cn('font-semibold leading-none tracking-tight text-zinc-900 text-sm flex items-center justify-between', className)} {...restProps}>
  {@render children?.()}
</h3>
