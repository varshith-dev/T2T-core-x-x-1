<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';

  let { class: className = '', children, ...restProps }: { class?: string; children?: Snippet; [key: string]: any } = $props();
</script>

<div class={cn('flex items-center p-4 sm:p-5 pt-0 border-t border-zinc-100 mt-4', className)} {...restProps}>
  {@render children?.()}
</div>
