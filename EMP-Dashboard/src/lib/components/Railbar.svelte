<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { dashboardsFor } from '$lib/types';
	import { auth } from '$lib/auth.svelte';

	let currentPath = $derived(page.url.pathname);
	let items = $derived(dashboardsFor(auth.user?.role));
	const initials = (n?: string) =>
		(n ?? 'U')
			.split(' ')
			.map((s) => s[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	function logout() {
		auth.logout();
		goto('/staff-login');
	}
</script>

<aside
	class="sticky top-0 flex h-screen w-60 shrink-0 flex-col justify-between border-r border-zinc-200 bg-[#fafafa] select-none"
>
	<div class="space-y-4 p-3">
		<div class="flex items-center gap-2 px-1 py-1">
			<div
				class="flex h-7 w-7 items-center justify-center rounded bg-zinc-900 text-xs font-semibold text-white"
			>
				T2
			</div>
			<div>
				<div class="text-sm font-semibold text-zinc-900">T2T Platform</div>
				<div class="text-[10px] text-zinc-500">Employee &amp; Admin</div>
			</div>
		</div>
		<div class="space-y-0.5">
			<div class="px-2 pb-1 text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
				Dashboards
			</div>
			{#each items as d (d.id)}
				<a
					href={d.path}
					class="block rounded-md px-2 py-1.5 text-xs {currentPath.startsWith(d.path)
						? 'border border-zinc-200/60 bg-white font-medium text-zinc-900 shadow-xs'
						: 'text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-900'}">{d.name}</a
				>
			{/each}
		</div>
	</div>
	<div class="border-t border-zinc-200 bg-white p-3">
		<div class="flex items-center justify-between gap-2">
			<div class="flex min-w-0 items-center gap-2">
				<div
					class="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-[10px] font-medium text-zinc-700"
				>
					{initials(auth.user?.displayName)}
				</div>
				<div class="truncate">
					<div class="truncate text-xs font-medium text-zinc-900">
						{auth.user?.displayName ?? 'User'}
					</div>
					<div class="truncate font-mono text-[10px] text-zinc-400">{auth.user?.role ?? ''}</div>
				</div>
			</div>
			<button onclick={logout} class="text-[10px] text-zinc-500 underline hover:text-zinc-900"
				>Sign out</button
			>
		</div>
	</div>
</aside>
