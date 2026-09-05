<script lang="ts">
  import { cn } from '$lib/utils';

  let {
    class: className = '',
    value = $bindable(''),
    placeholder = '',
    type = 'text',
    disabled = false,
    ...restProps
  }: {
    class?: string;
    value?: string;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    [key: string]: any;
  } = $props();
</script>

<input
  {type}
  {disabled}
  {placeholder}
  bind:value
  class={cn(
    'flex h-8 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-900 placeholder:text-zinc-400 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50',
    className
  )}
  {...restProps}
/>
