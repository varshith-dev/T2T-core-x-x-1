<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';

  let { class: className = '', children, ...restProps }: { class?: string; children?: Snippet; [key: string]: any } = $props();
</script>

<p class={cn('text-xs text-zinc-400', className)} {...restProps}>
  {@render children?.()}
</p>
