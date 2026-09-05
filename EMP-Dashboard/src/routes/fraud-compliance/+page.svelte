<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api';

	let d = $state<any>({ duplicates: [], topUsersToday: [], flagged: [], notWasteCount: 0 });
	onMount(async () => {
		d = await api.fraud();
	});
</script>

<div class="mx-auto max-w-5xl space-y-6">
	<div>
		<h1 class="text-lg font-semibold">Fraud &amp; Trust</h1>
		<p class="text-sm text-zinc-500">Duplicate images, non-waste attempts & anomalies — live.</p>
	</div>

	<div class="grid grid-cols-2 gap-3 md:grid-cols-3">
		<div class="rounded-lg border border-zinc-200 bg-white p-4">
			<div class="text-2xl font-bold text-red-600">{d.notWasteCount ?? 0}</div>
			<div class="text-xs text-zinc-500">Flagged not-waste (gate)</div>
		</div>
		<div class="rounded-lg border border-zinc-200 bg-white p-4">
			<div class="text-2xl font-bold text-amber-600">{(d.duplicates ?? []).length}</div>
			<div class="text-xs text-zinc-500">Duplicate image groups</div>
		</div>
		<div class="rounded-lg border border-zinc-200 bg-white p-4">
			<div class="text-2xl font-bold">{(d.topUsersToday ?? []).length}</div>
			<div class="text-xs text-zinc-500">Active users today</div>
		</div>
	</div>

	<div class="grid gap-4 lg:grid-cols-2">
		<div class="rounded-lg border border-zinc-200 bg-white">
			<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">Flagged as not-waste</div>
			<div class="p-5 text-sm">
				{#if (d.flagged ?? []).length === 0}<span class="text-zinc-400">None flagged.</span>{/if}
				{#each d.flagged ?? [] as f (f.id)}
					<div class="flex justify-between border-b border-zinc-100 py-1.5 last:border-0">
						<span>{f.display_name} · <span class="capitalize text-zinc-500">{f.ml_category ?? '—'}</span></span>
						<span class="text-zinc-400">waste {Math.round((f.waste_score ?? 0) * 100)}%</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="rounded-lg border border-zinc-200 bg-white">
			<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">Duplicate images (reused)</div>
			<div class="p-5 text-sm">
				{#if (d.duplicates ?? []).length === 0}<span class="text-zinc-400">No duplicates detected.</span>{/if}
				{#each d.duplicates ?? [] as dup (dup.image_phash)}
					<div class="flex justify-between border-b border-zinc-100 py-1.5 font-mono text-xs last:border-0">
						<span class="truncate">{String(dup.image_phash).slice(0, 24)}…</span><span class="font-medium">×{dup.n}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="rounded-lg border border-zinc-200 bg-white">
		<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">Most active users today</div>
		<div class="p-5 text-sm">
			{#each d.topUsersToday ?? [] as u (u.display_name)}
				<div class="flex justify-between border-b border-zinc-100 py-1.5 last:border-0">
					<span>{u.display_name}</span><span class="font-medium">{u.n} submissions</span>
				</div>
			{/each}
		</div>
	</div>
</div>
