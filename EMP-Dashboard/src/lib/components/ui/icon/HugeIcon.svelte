<script lang="ts">
  interface Props {
    icon?: any;
    size?: number | string;
    strokeWidth?: number;
    class?: string;
  }

  let {
    icon,
    size = 16,
    strokeWidth = 1.5,
    class: className = ''
  }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
>
  {#if icon && Array.isArray(icon)}
    {#each icon as [tag, attrs]}
      {#if tag === 'path'}
        <path {...attrs} />
      {:else if tag === 'circle'}
        <circle {...attrs} />
      {:else if tag === 'rect'}
        <rect {...attrs} />
      {:else if tag === 'line'}
        <line {...attrs} />
      {:else if tag === 'polygon'}
        <polygon {...attrs} />
      {:else if tag === 'polyline'}
        <polyline {...attrs} />
      {/if}
    {/each}
  {/if}
</svg>
