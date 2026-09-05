<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import Button from '$lib/components/ui/button/button.svelte';

	let coupons = $state<any[]>([]);
	let reds = $state<any[]>([]);
	let stats = $state<any>({});
	let f = $state({ title: '', description: '', costPoints: 10, stock: 10 });
	let msg = $state('');

	async function load() {
		const [c, r, s] = await Promise.all([api.coupons(), api.redemptions(), api.couponStats()]);
		coupons = c.coupons;
		reds = r.redemptions;
		stats = s;
	}
	onMount(load);

	async function create(e: SubmitEvent) {
		e.preventDefault();
		await api.createCoupon({ ...f, costPoints: +f.costPoints, stock: +f.stock });
		f = { title: '', description: '', costPoints: 10, stock: 10 };
		msg = 'Coupon created';
		await load();
	}
	async function toggle(c: any) {
		await api.updateCoupon(c.id, { active: !c.active });
		await load();
	}
	async function fulfill(r: any) {
		await api.fulfill(r.id);
		await load();
	}
	async function rej(r: any) {
		await api.rejectRedemption(r.id);
		await load();
	}
</script>

<div class="mx-auto max-w-5xl space-y-6">
	<div>
		<h1 class="text-lg font-semibold">Coupons</h1>
		<p class="text-sm text-zinc-500">Catalog, redemptions & fulfillment — live.</p>
	</div>
	{#if msg}<div class="rounded-md bg-zinc-100 px-3 py-2 text-xs text-zinc-700">{msg}</div>{/if}

	<div class="grid grid-cols-2 gap-3 md:grid-cols-3">
		<div class="rounded-lg border border-zinc-200 bg-white p-4">
			<div class="text-2xl font-bold">{coupons.length}</div>
			<div class="text-xs text-zinc-500">Coupons</div>
		</div>
		<div class="rounded-lg border border-zinc-200 bg-white p-4">
			<div class="text-2xl font-bold">{reds.filter((r) => r.status === 'pending').length}</div>
			<div class="text-xs text-zinc-500">Pending redemptions</div>
		</div>
		<div class="rounded-lg border border-zinc-200 bg-white p-4">
			<div class="text-2xl font-bold">{stats.liability ?? 0}</div>
			<div class="text-xs text-zinc-500">Points liability (net)</div>
		</div>
	</div>

	<div class="grid gap-4 lg:grid-cols-2">
		<div class="space-y-4">
			<div class="rounded-lg border border-zinc-200 bg-white">
				<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">New coupon</div>
				<form onsubmit={create} class="space-y-2 p-5 text-sm">
					<input bind:value={f.title} placeholder="Title" required class="h-9 w-full rounded border border-zinc-200 px-2" />
					<input bind:value={f.description} placeholder="Description" class="h-9 w-full rounded border border-zinc-200 px-2" />
					<div class="flex gap-2">
						<input bind:value={f.costPoints} type="number" placeholder="Cost" class="h-9 w-full rounded border border-zinc-200 px-2" />
						<input bind:value={f.stock} type="number" placeholder="Stock" class="h-9 w-full rounded border border-zinc-200 px-2" />
					</div>
					<Button type="submit" class="w-full">Create</Button>
				</form>
			</div>
			<div class="rounded-lg border border-zinc-200 bg-white">
				<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">Catalog</div>
				<div class="p-5 text-sm">
					{#if coupons.length === 0}<span class="text-zinc-400">No coupons.</span>{/if}
					{#each coupons as c (c.id)}
						<div class="flex items-center justify-between gap-2 border-b border-zinc-100 py-2 last:border-0">
							<span class={c.active ? '' : 'text-zinc-400 line-through'}>{c.title}</span>
							<span class="text-zinc-400">{c.costPoints}pts · stock {c.stock}</span>
							<Button size="sm" variant="outline" onclick={() => toggle(c)}>{c.active ? 'Hide' : 'Show'}</Button>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="rounded-lg border border-zinc-200 bg-white">
			<div class="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">Redemptions</div>
			<div class="space-y-2 p-5 text-sm">
				{#if reds.length === 0}<span class="text-zinc-400">No redemptions.</span>{/if}
				{#each reds as r (r.id)}
					<div class="flex items-center justify-between gap-2 border-b border-zinc-100 py-2 last:border-0">
						<div>{r.costPoints} pts<div class="text-[11px] text-zinc-400">{new Date(r.createdAt).toLocaleString()}</div></div>
						<div class="flex items-center gap-2">
							<span class="rounded-full px-2 py-0.5 text-[11px] font-medium {r.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-800' : r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}">{r.status}</span>
							{#if r.status === 'pending'}
								<Button size="sm" onclick={() => fulfill(r)}>Fulfill</Button>
								<Button size="sm" variant="outline" onclick={() => rej(r)}>Reject</Button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
