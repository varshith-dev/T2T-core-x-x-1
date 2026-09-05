<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import Button from '$lib/components/ui/button/button.svelte';

	const ROLES = ['user', 'reviewer', 'catalog_manager', 'admin', 'super_admin'];

	let head = $state<any>({});
	let rules = $state<any[]>([]);
	let users = $state<any[]>([]);
	let redemptions = $state<any[]>([]);
	let msg = $state('');

	async function load() {
		try {
			const [a, r, u, red] = await Promise.all([
				api.analytics(),
				api.pointRules(),
				api.usersDetail(),
				api.redemptions()
			]);
			head = a.head;
			rules = r.rules;
			users = u.users;
			redemptions = red.redemptions;
		} catch (e: any) {
			msg = e?.message ?? 'failed to load';
		}
	}
	onMount(load);

	async function saveRule(rule: any) {
		await api.setPointRule(rule.category, {
			points: +rule.points,
			dailyCap: +rule.dailyCap,
			active: rule.active
		});
		msg = `Saved ${rule.category}`;
	}
	async function changeRole(u: any, role: string) {
		try {
			await api.setRole(u.id, role);
			u.role = role;
			msg = `${u.displayName} → ${role}`;
		} catch (e: any) {
			msg = e?.message ?? 'failed';
		}
	}
	async function fulfill(r: any) {
		await api.fulfill(r.id);
		await load();
	}
	async function rejectRed(r: any) {
		await api.rejectRedemption(r.id);
		await load();
	}
	async function reprocess() {
		const res: any = await api.reprocess();
		msg = `Re-queued ${res.requeued} submissions`;
	}

	const kpis = $derived([
		['Users', head.users],
		['Submissions', head.submissions],
		['Approved', head.approved],
		['Points issued', head.points_issued]
	]);
</script>

<div class="mx-auto max-w-5xl space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-lg font-semibold">Super Admin</h1>
			<p class="text-sm text-zinc-500">Users, roles, point rules, redemptions & reprocess.</p>
		</div>
		<Button onclick={reprocess}>Reprocess review queue</Button>
	</div>
	{#if msg}<div class="rounded-md bg-zinc-100 px-3 py-2 text-xs text-zinc-700">{msg}</div>{/if}

	<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
		{#each kpis as [label, val] (label)}
			<div class="rounded-lg border border-zinc-200 bg-white p-4">
				<div class="text-2xl font-bold text-zinc-900">{val ?? '—'}</div>
				<div class="text-xs text-zinc-500">{label}</div>
			</div>
		{/each}
	</div>

	<div class="rounded-lg border border-zinc-200 bg-white">
		<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">Point rules</div>
		<div class="space-y-2 p-5">
			{#each rules as rule (rule.category)}
				<div class="flex items-center gap-2 text-sm">
					<span class="w-32 capitalize">{rule.category}</span>
					<input
						type="number"
						bind:value={rule.points}
						class="h-8 w-20 rounded border border-zinc-200 px-2"
					/>
					<span class="text-xs text-zinc-400">pts</span>
					<input
						type="number"
						bind:value={rule.dailyCap}
						class="h-8 w-20 rounded border border-zinc-200 px-2"
					/>
					<span class="text-xs text-zinc-400">cap/day</span>
					<Button size="sm" onclick={() => saveRule(rule)}>Save</Button>
				</div>
			{/each}
		</div>
	</div>

	<div class="rounded-lg border border-zinc-200 bg-white">
		<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">Users & roles</div>
		<div class="p-5">
			{#each users as u (u.id)}
				<div class="flex items-center justify-between gap-2 border-b border-zinc-100 py-2 text-sm last:border-0">
					<div class="min-w-0">
						<div class="truncate">{u.displayName}</div>
						<div class="truncate text-xs text-zinc-400">
							{u.email} · {u.balance} pts · {u.submissions} subs
						</div>
					</div>
					<select
						value={u.role}
						onchange={(e) => changeRole(u, (e.currentTarget as HTMLSelectElement).value)}
						class="h-8 rounded border border-zinc-200 bg-white px-2 text-sm"
					>
						{#each ROLES as r (r)}<option value={r}>{r}</option>{/each}
					</select>
				</div>
			{/each}
		</div>
	</div>

	<div class="rounded-lg border border-zinc-200 bg-white">
		<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">Redemptions</div>
		<div class="space-y-2 p-5">
			{#if redemptions.length === 0}<p class="text-sm text-zinc-500">No redemptions yet.</p>{/if}
			{#each redemptions as r (r.id)}
				<div class="flex items-center justify-between gap-2 border-b border-zinc-100 py-2 text-sm last:border-0">
					<div>
						{r.costPoints} pts
						<span class="text-zinc-400">· {new Date(r.createdAt).toLocaleString()}</span>
					</div>
					<div class="flex items-center gap-2">
						<span
							class="rounded-full px-2 py-0.5 text-[11px] font-medium {r.status === 'fulfilled'
								? 'bg-emerald-100 text-emerald-800'
								: r.status === 'rejected'
									? 'bg-red-100 text-red-700'
									: 'bg-amber-100 text-amber-800'}">{r.status}</span
						>
						{#if r.status === 'pending'}
							<Button size="sm" onclick={() => fulfill(r)}>Fulfill</Button>
							<Button size="sm" variant="outline" onclick={() => rejectRed(r)}>Reject</Button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
