<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { auth } from '$lib/auth.svelte';
	import { canAccess, dashboardsFor } from '$lib/types';

	let { children }: { children?: Snippet } = $props();

	onMount(() => {
		auth.init();
	});

	// route guard: unauthenticated -> /staff-login; wrong role -> own dashboard
	$effect(() => {
		if (!auth.ready) return;
		const p = page.url.pathname;
		if (p.startsWith('/staff-login')) return;
		if (!auth.user) {
			goto('/staff-login');
			return;
		}
		if (!canAccess(auth.user.role, p)) {
			const mine = dashboardsFor(auth.user.role)[0];
			goto(mine ? mine.path : '/staff-login');
		}
	});
</script>

<div class="min-h-screen bg-[#f8f9fa] font-sans text-zinc-900 antialiased">
	{#if auth.ready}
		{@render children?.()}
	{:else}
		<div class="p-8 text-sm text-zinc-500">Loading…</div>
	{/if}
</div>
