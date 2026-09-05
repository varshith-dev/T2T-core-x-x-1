<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { DASHBOARD_ROLES, dashboardsFor } from '$lib/types';
	import { auth } from '$lib/auth.svelte';

	const SUBNAV: Record<string, { label: string; path: string }[]> = {
		'super-admin': [
			{ label: 'Overview', path: '/super-admin' },
			{ label: 'Users', path: '/super-admin/users' },
			{ label: 'Roles', path: '/super-admin/roles' },
			{ label: 'Point rules', path: '/super-admin/rules' },
			{ label: 'Categories', path: '/super-admin/categories' },
			{ label: 'Coupons', path: '/super-admin/coupons' },
			{ label: 'Audit log', path: '/super-admin/audit' },
			{ label: 'Reprocess', path: '/super-admin/reprocess' },
			{ label: 'Suspended', path: '/super-admin/suspended' },
			{ label: 'System', path: '/super-admin/system' }
		],
		'admin-analytics': [
			{ label: 'Overview', path: '/admin-analytics' },
			{ label: 'Trends', path: '/admin-analytics/trends' },
			{ label: 'Categories', path: '/admin-analytics/categories' },
			{ label: 'Economy', path: '/admin-analytics/economy' },
			{ label: 'Redemptions', path: '/admin-analytics/redemptions' },
			{ label: 'Leaderboard', path: '/admin-analytics/leaderboard' },
			{ label: 'Users', path: '/admin-analytics/users' }
		],
		reviewer: [
			{ label: 'Queue', path: '/reviewer' },
			{ label: 'Priority', path: '/reviewer/priority' },
			{ label: 'Low confidence', path: '/reviewer/low-conf' },
			{ label: 'Approvals', path: '/reviewer/approvals' },
			{ label: 'Rejections', path: '/reviewer/rejections' },
			{ label: 'All', path: '/reviewer/all' }
		],
		'ml-analyst': [
			{ label: 'Overview', path: '/ml-analyst' },
			{ label: 'Confidence', path: '/ml-analyst/confidence' },
			{ label: 'Confusion matrix', path: '/ml-analyst/confusion-matrix' },
			{ label: 'Mismatches', path: '/ml-analyst/mismatches' },
			{ label: 'Versions', path: '/ml-analyst/versions' },
			{ label: 'Dataset', path: '/ml-analyst/dataset' }
		],
		'fraud-compliance': [
			{ label: 'Overview', path: '/fraud-compliance' },
			{ label: 'Duplicates', path: '/fraud-compliance/duplicates' },
			{ label: 'Non-waste', path: '/fraud-compliance/non-waste' },
			{ label: 'GPS anomalies', path: '/fraud-compliance/gps' },
			{ label: 'High-risk', path: '/fraud-compliance/high-risk' },
			{ label: 'Warnings', path: '/fraud-compliance/warnings' },
			{ label: 'Suspended', path: '/fraud-compliance/suspended' }
		],
		'coupon-manager': [
			{ label: 'Overview', path: '/coupon-manager' },
			{ label: 'Claims', path: '/coupon-manager/claims' },
			{ label: 'Partners', path: '/coupon-manager/partners' },
			{ label: 'Rates', path: '/coupon-manager/rates' },
			{ label: 'Reports', path: '/coupon-manager/reports' }
		]
	};

	let currentPath = $derived(page.url.pathname);
	let activeRole = $derived(
		DASHBOARD_ROLES.find((r) => currentPath.startsWith(r.path)) || DASHBOARD_ROLES[0]
	);
	let subnav = $derived(SUBNAV[activeRole.id] ?? []);
	let switcher = $derived(dashboardsFor(auth.user?.role));
	let dropdownOpen = $state(false);

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
	class="sticky top-0 flex h-screen w-60 shrink-0 flex-col justify-between overflow-y-auto border-r border-zinc-200 bg-[#fafafa] select-none"
>
	<div class="space-y-4 p-3">
		<!-- workspace switcher (access-filtered; super_admin sees all) -->
		<div class="relative">
			<button
				onclick={() => (dropdownOpen = !dropdownOpen)}
				class="group flex w-full cursor-pointer items-center justify-between rounded-md border border-zinc-200/80 bg-white p-2 text-left shadow-xs transition-colors hover:bg-zinc-50"
			>
				<div class="flex min-w-0 items-center gap-2">
					<div
						class="flex h-6 w-6 items-center justify-center rounded bg-zinc-900 text-[11px] font-semibold text-white"
					>
						T2
					</div>
					<div class="truncate">
						<div class="truncate text-xs font-semibold text-zinc-900">T2T Platform</div>
						<div class="truncate text-[10px] text-zinc-500">{activeRole.name}</div>
					</div>
				</div>
				<span class="text-zinc-400">▾</span>
			</button>
			{#if dropdownOpen}
				<div
					class="absolute top-full right-0 left-0 z-50 mt-1 space-y-0.5 rounded-md border border-zinc-200 bg-white p-1 shadow-lg"
				>
					<div class="px-2 py-1 text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
						Switch dashboard
					</div>
					{#each switcher as d (d.id)}
						<a
							href={d.path}
							onclick={() => (dropdownOpen = false)}
							class="flex items-center justify-between rounded px-2 py-1.5 text-xs {currentPath.startsWith(
								d.path
							)
								? 'bg-zinc-100 font-medium text-zinc-900'
								: 'text-zinc-600 hover:bg-zinc-50'}"
						>
							<span class="truncate">{d.name}</span>
							<span class="font-mono text-[10px] text-zinc-400">{d.badge}</span>
						</a>
					{/each}
				</div>
			{/if}
		</div>

		<!-- sub-navigation for the active dashboard -->
		<div class="space-y-0.5">
			<div class="px-2 pb-1 text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
				Navigation
			</div>
			{#each subnav as item (item.path)}
				<a
					href={item.path}
					class="block rounded-md px-2 py-1.5 text-xs {currentPath === item.path
						? 'border border-zinc-200/60 bg-white font-medium text-zinc-900 shadow-xs'
						: 'text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-900'}">{item.label}</a
				>
			{/each}
		</div>
	</div>

	<!-- bottom: real signed-in user + sign out -->
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
