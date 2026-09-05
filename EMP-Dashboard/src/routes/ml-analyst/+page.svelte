<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api';

	let d = $state<any>({ confidenceBuckets: [], gate: [], models: [], mismatches: [], agreement: {} });
	onMount(async () => {
		d = await api.ml();
	});

	let agree = $derived(
		d.agreement?.total ? Math.round((100 * d.agreement.agree) / d.agreement.total) : null
	);
	let maxB = $derived(Math.max(1, ...(d.confidenceBuckets ?? []).map((x: any) => x.n)));
	let wasteCount = $derived((d.gate ?? []).find((g: any) => g.is_waste === true)?.n ?? 0);
	let notWasteCount = $derived((d.gate ?? []).find((g: any) => g.is_waste === false)?.n ?? 0);
</script>

<div class="mx-auto max-w-5xl space-y-6">
	<div>
		<h1 class="text-lg font-semibold">ML Ops</h1>
		<p class="text-sm text-zinc-500">Model accuracy, confidence, waste-gate & mismatches — from live data.</p>
	</div>

	<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
		<div class="rounded-lg border border-zinc-200 bg-white p-4">
			<div class="text-2xl font-bold">{agree ?? '—'}{agree != null ? '%' : ''}</div>
			<div class="text-xs text-zinc-500">ML vs reviewer agreement</div>
		</div>
		<div class="rounded-lg border border-zinc-200 bg-white p-4">
			<div class="text-2xl font-bold">{d.agreement?.total ?? 0}</div>
			<div class="text-xs text-zinc-500">Labeled pairs</div>
		</div>
		<div class="rounded-lg border border-zinc-200 bg-white p-4">
			<div class="text-2xl font-bold text-emerald-700">{wasteCount}</div>
			<div class="text-xs text-zinc-500">Gate: waste</div>
		</div>
		<div class="rounded-lg border border-zinc-200 bg-white p-4">
			<div class="text-2xl font-bold text-red-600">{notWasteCount}</div>
			<div class="text-xs text-zinc-500">Gate: not waste</div>
		</div>
	</div>

	<div class="grid gap-4 lg:grid-cols-2">
		<div class="rounded-lg border border-zinc-200 bg-white">
			<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">Confidence distribution</div>
			<div class="flex h-40 items-end gap-1 p-5">
				{#if (d.confidenceBuckets ?? []).length === 0}<span class="text-sm text-zinc-400">No data</span>{/if}
				{#each d.confidenceBuckets ?? [] as b (b.bucket)}
					<div class="flex flex-1 flex-col items-center gap-1">
						<div class="w-full rounded-t bg-cyan-600" style="height:{(b.n / maxB) * 100}%" title="{b.n}"></div>
						<span class="text-[9px] text-zinc-400">{(b.bucket - 1) * 10}%</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="rounded-lg border border-zinc-200 bg-white">
			<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">Model versions</div>
			<div class="space-y-1 p-5 text-sm">
				{#each d.models ?? [] as m (m.model)}
					<div class="flex justify-between border-b border-zinc-100 py-1.5 last:border-0">
						<span class="truncate font-mono text-xs">{m.model}</span><span class="font-medium">{m.n}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="rounded-lg border border-zinc-200 bg-white">
		<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">
			Recent mismatches (model ≠ reviewer)
		</div>
		<div class="p-5 text-sm">
			{#if (d.mismatches ?? []).length === 0}<span class="text-zinc-400">None — model agrees with reviewers.</span>{/if}
			{#each d.mismatches ?? [] as m (m.id)}
				<div class="flex justify-between border-b border-zinc-100 py-1.5 last:border-0">
					<span>predicted <b class="capitalize">{m.ml_category}</b> → labeled <b class="capitalize">{m.final_category}</b></span>
					<span class="text-zinc-400">{Math.round((m.confidence ?? 0) * 100)}%</span>
				</div>
			{/each}
		</div>
	</div>
</div>
