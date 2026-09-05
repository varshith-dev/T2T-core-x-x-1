<script lang="ts">
	import Railbar from '$lib/components/Railbar.svelte';
	import Header from '$lib/components/Header.svelte';
	let { children } = $props();
</script>

<div class="flex min-h-screen bg-[#fafafa] text-zinc-900">
	<Railbar />
	<div class="flex min-w-0 flex-1 flex-col">
		<Header />
		<main class="flex-1 p-6">{@render children?.()}</main>
	</div>
</div>
