<script lang="ts">
	import { page } from '$app/state';
	import { DASHBOARD_ROLES, dashboardsFor } from '$lib/types';
	import { auth } from '$lib/auth.svelte';

	let currentPath = $derived(page.url.pathname);
	let activeRole = $derived(
		DASHBOARD_ROLES.find((r) => currentPath.startsWith(r.path)) || DASHBOARD_ROLES[0]
	);
	let tabs = $derived(dashboardsFor(auth.user?.role));
</script>

<header
	class="sticky top-0 z-30 flex h-13 items-center justify-between border-b border-zinc-200 bg-white px-6 select-none"
>
	<div class="flex items-center gap-3">
		<div class="flex items-center gap-1.5 text-xs font-normal text-zinc-500">
			<span>Dashboards</span>
			<span>/</span>
			<h1 class="font-semibold text-zinc-900">{activeRole.name}</h1>
		</div>
		<div class="ml-4 hidden items-center gap-1 border-l border-zinc-200 pl-4 xl:flex">
			{#each tabs as role (role.id)}
				<a
					href={role.path}
					class="rounded px-2 py-1 text-xs font-medium transition-colors {currentPath.startsWith(
						role.path
					)
						? 'bg-zinc-100 text-zinc-900'
						: 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'}">{role.name.split(' ')[0]}</a
				>
			{/each}
		</div>
	</div>
	<div class="flex items-center gap-3 text-xs text-zinc-500">
		<span class="hidden sm:inline">{auth.user?.email ?? ''}</span>
	</div>
</header>
