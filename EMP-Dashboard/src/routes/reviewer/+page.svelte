<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import Button from '$lib/components/ui/button/button.svelte';

	const CATS = ['organic', 'plastic', 'paper', 'cardboard', 'metal', 'glass', 'ewaste', 'trash'];
	let queue = $state<any[]>([]);
	let busy = $state('');

	async function load() {
		queue = (await api.reviewQueue()).submissions;
	}
	onMount(load);

	async function approve(s: any, cat: string) {
		busy = s.id;
		await api.approve(s.id, cat);
		await load();
		busy = '';
	}
	async function reject(s: any) {
		busy = s.id;
		await api.reject(s.id);
		await load();
		busy = '';
	}
</script>

<div class="mx-auto max-w-5xl space-y-4">
	<div>
		<h1 class="text-lg font-semibold">Review queue <span class="text-zinc-400">({queue.length})</span></h1>
		<p class="text-sm text-zinc-500">Photos the model wasn't sure about — approve with the correct category or reject.</p>
	</div>

	{#if queue.length === 0}
		<div class="rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
			Nothing to review.
		</div>
	{/if}

	<div class="grid gap-4 sm:grid-cols-2">
		{#each queue as s (s.id)}
			<div class="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
				<img
					src={`/api/images/${s.imageKey}`}
					alt=""
					class="h-48 w-full rounded bg-zinc-100 object-contain"
				/>
				<div class="text-xs text-zinc-500">
					ML guess: <b class="capitalize">{s.mlCategory ?? 'n/a'}</b>
					{#if s.mlConfidence != null}({Math.round(s.mlConfidence * 100)}%){/if}
					{#if s.productName}· {s.productName}{/if}
				</div>
				<div>
					<div class="mb-1 text-[11px] text-zinc-400">Approve as:</div>
					<div class="flex flex-wrap gap-1">
						{#each CATS as c (c)}
							<Button size="sm" variant="outline" disabled={busy === s.id} onclick={() => approve(s, c)}>{c}</Button>
						{/each}
					</div>
				</div>
				<Button size="sm" variant="destructive" disabled={busy === s.id} onclick={() => reject(s)}>Reject</Button>
			</div>
		{/each}
	</div>
</div>
