<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api';

	let head = $state<any>({});
	let byDay = $state<any[]>([]);
	let cats = $state<any[]>([]);
	let status = $state<any[]>([]);
	let board = $state<any[]>([]);

	onMount(async () => {
		const [a, l] = await Promise.all([api.analytics(), api.leaderboard()]);
		head = a.head;
		byDay = a.submissionsByDay;
		cats = a.categoryBreakdown;
		status = a.statusBreakdown;
		board = l.top;
	});

	let maxDay = $derived(Math.max(1, ...byDay.map((d) => d.n)));
	let maxCat = $derived(Math.max(1, ...cats.map((c) => c.n)));
	const kpis = $derived([
		['Users', head.users],
		['Submissions', head.submissions],
		['Approved', head.approved],
		['Points issued', head.points_issued],
		['Points spent', head.points_spent],
		['Pending redemptions', head.redemptions_pending]
	]);
</script>

<div class="mx-auto max-w-5xl space-y-6">
	<div>
		<h1 class="text-lg font-semibold">Admin &amp; Analytics</h1>
		<p class="text-sm text-zinc-500">Platform KPIs, submission trends, categories & leaderboard.</p>
	</div>

	<div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
		{#each kpis as [label, val] (label)}
			<div class="rounded-lg border border-zinc-200 bg-white p-4">
				<div class="text-xl font-bold text-zinc-900">{val ?? '—'}</div>
				<div class="text-[11px] text-zinc-500">{label}</div>
			</div>
		{/each}
	</div>

	<div class="grid gap-4 lg:grid-cols-2">
		<div class="rounded-lg border border-zinc-200 bg-white">
			<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">Submissions (14 days)</div>
			<div class="flex h-40 items-end gap-1 p-5">
				{#if byDay.length === 0}<span class="text-sm text-zinc-400">No data</span>{/if}
				{#each byDay as d (d.d)}
					<div class="flex flex-1 flex-col items-center gap-1">
						<div
							class="w-full rounded-t bg-zinc-900"
							style="height:{(d.n / maxDay) * 100}%"
							title="{d.d}: {d.n}"
						></div>
						<span class="text-[9px] text-zinc-400">{d.d}</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="rounded-lg border border-zinc-200 bg-white">
			<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">Approved by category</div>
			<div class="space-y-2 p-5">
				{#if cats.length === 0}<span class="text-sm text-zinc-400">No approvals yet</span>{/if}
				{#each cats as c (c.category)}
					<div class="text-xs">
						<div class="mb-0.5 flex justify-between"><span class="capitalize">{c.category}</span><span>{c.n}</span></div>
						<div class="h-2 rounded bg-zinc-100"><div class="h-full rounded bg-emerald-500" style="width:{(c.n / maxCat) * 100}%"></div></div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="grid gap-4 lg:grid-cols-2">
		<div class="rounded-lg border border-zinc-200 bg-white">
			<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">Submission status</div>
			<div class="space-y-1 p-5 text-sm">
				{#each status as s (s.status)}
					<div class="flex justify-between border-b border-zinc-100 py-1.5 last:border-0">
						<span class="capitalize">{String(s.status).replace('_', ' ')}</span><span class="font-medium">{s.n}</span>
					</div>
				{/each}
			</div>
		</div>
		<div class="rounded-lg border border-zinc-200 bg-white">
			<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">Leaderboard (top earners)</div>
			<div class="space-y-1 p-5 text-sm">
				{#if board.length === 0}<span class="text-zinc-400">No users yet</span>{/if}
				{#each board as u, i (u.display_name + i)}
					<div class="flex justify-between border-b border-zinc-100 py-1.5 last:border-0">
						<span>{i + 1}. {u.display_name}</span><span class="font-medium text-emerald-700">{u.earned} pts</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
