<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';

  let { class: className = '', children, ...restProps }: { class?: string; children?: Snippet; [key: string]: any } = $props();
</script>

<div class={cn('flex flex-col space-y-1.5 p-4 sm:p-5', className)} {...restProps}>
  {@render children?.()}
</div>
