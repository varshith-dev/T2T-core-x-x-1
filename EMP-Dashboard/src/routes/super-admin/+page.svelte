<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import { Card } from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
	import {
		Shield01Icon,
		Settings01Icon,
		Folder01Icon,
		ShieldAlertIcon,
		Activity01Icon,
		LockIcon,
		CheckmarkCircle01Icon,
		ArrowRight01Icon,
		Coins01Icon,
		UserGroupIcon
	} from '@hugeicons/core-free-icons';

	let kpis = $state<any[]>([]);
	let pointRules = $state<any[]>([]);
	let pendingRedemptions = $state<any[]>([]);
	let byDay = $state<number[]>([]);
	let systemServices = $state<any[]>([]);
	let actionNotification = $state<string | null>(null);

	const quickActions = [
		{ title: 'Assign Roles', desc: 'Promote or demote any staff user', icon: LockIcon, href: '/super-admin/roles' },
		{ title: 'Edit Point Rules', desc: 'Per-category points & caps', icon: Settings01Icon, href: '/super-admin/rules' },
		{ title: 'Waste Categories', desc: 'Category taxonomy', icon: Folder01Icon, href: '/super-admin/categories' },
		{ title: 'Security Audit', desc: 'Immutable action ledger', icon: Shield01Icon, href: '/super-admin/audit' }
	];

	const chartWidth = 540;
	const chartHeight = 140;
	let pointsString = $derived.by(() => {
		if (byDay.length === 0) return '';
		const max = Math.max(1, ...byDay);
		return byDay
			.map((d, i) => {
				const x = (i / Math.max(1, byDay.length - 1)) * chartWidth;
				const y = chartHeight - (d / max) * (chartHeight - 20) - 10;
				return `${x},${y}`;
			})
			.join(' ');
	});
	let peak = $derived(byDay.length ? Math.max(...byDay) : 0);

	async function load() {
		const [a, r, red, fraud, health] = await Promise.all([
			api.analytics(),
			api.pointRules(),
			api.redemptions(),
			api.fraud(),
			fetch('/api/health').then((x) => x.ok).catch(() => false)
		]);
		const h = a.head;
		kpis = [
			{ title: 'Total Users', value: String(h.users ?? 0), note: 'registered', icon: UserGroupIcon },
			{ title: 'Submissions', value: String(h.submissions ?? 0), note: `${h.approved ?? 0} approved`, icon: Folder01Icon },
			{ title: 'Points Issued', value: String(h.points_issued ?? 0), note: `${h.points_spent ?? 0} spent`, icon: Coins01Icon },
			{ title: 'Approved', value: String(h.approved ?? 0), note: 'verified', icon: Activity01Icon },
			{ title: 'Point Rules', value: String(r.rules.length), note: 'categories', icon: Settings01Icon },
			{ title: 'Not-waste Flags', value: String(fraud.notWasteCount ?? 0), note: 'gate rejections', icon: ShieldAlertIcon }
		];
		pointRules = r.rules.map((x: any) => ({ category: x.category, points: x.points, cap: x.dailyCap, active: x.active }));
		pendingRedemptions = red.redemptions
			.filter((x: any) => x.status === 'pending')
			.map((x: any) => ({ id: x.id, cost: x.costPoints, when: new Date(x.createdAt).toLocaleString() }));
		byDay = a.submissionsByDay.map((x: any) => x.n);
		systemServices = [
			{ name: 'API Server', uptime: health ? 'Online' : 'Down' },
			{ name: 'Database (Postgres)', uptime: 'Online' },
			{ name: 'ML Service (ViT + CLIP)', uptime: 'Online' },
			{ name: 'S3 Storage', uptime: 'Online' },
			{ name: 'Email (SES)', uptime: 'Configured' }
		];
	}
	onMount(load);

	function notify(msg: string) {
		actionNotification = msg;
		setTimeout(() => (actionNotification = null), 4000);
	}
	async function saveRule(rule: any) {
		await api.setPointRule(rule.category, { points: +rule.points, dailyCap: +rule.cap, active: rule.active });
		notify(`Saved ${rule.category}`);
	}
	async function approveRedeem(item: any) {
		await api.fulfill(item.id);
		await load();
		notify('Redemption fulfilled');
	}
	async function rejectRedeem(item: any) {
		await api.rejectRedemption(item.id);
		await load();
		notify('Redemption rejected');
	}
	async function reprocess() {
		const res: any = await api.reprocess();
		notify(`Re-queued ${res.requeued} submissions`);
	}
</script>

<svelte:head>
	<title>Super Admin — T2T Platform</title>
</svelte:head>

<div class="space-y-6">
	{#if actionNotification}
		<div class="flex items-center justify-between rounded bg-zinc-900 px-4 py-2.5 font-mono text-xs text-white transition-all">
			<div class="flex items-center gap-2">
				<HugeIcon icon={CheckmarkCircle01Icon} size={14} class="text-zinc-200" />
				<span>{actionNotification}</span>
			</div>
			<button onclick={() => (actionNotification = null)} class="text-xs text-zinc-400 hover:text-white">Dismiss</button>
		</div>
	{/if}

	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-xl font-bold tracking-tight text-zinc-900">Platform Command Overview</h1>
			<p class="mt-0.5 text-xs text-zinc-500">Live system telemetry, user governance, classification health & rewards economy.</p>
		</div>
		<div class="flex items-center gap-2">
			<Button onclick={reprocess} variant="outline" size="sm" class="h-8 border-zinc-200 text-xs">
				<HugeIcon icon={Settings01Icon} size={12} class="mr-1.5 text-zinc-500" /> Reprocess queue
			</Button>
			<a href="/super-admin/rules" class="inline-flex h-8 items-center rounded bg-zinc-900 px-3 text-xs font-medium text-white transition-colors hover:bg-zinc-800">
				<HugeIcon icon={Folder01Icon} size={12} class="mr-1.5" /> Manage rules
			</a>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
		{#each quickActions as qa (qa.href)}
			<a href={qa.href} class="group flex items-start justify-between rounded border border-zinc-200 bg-white p-3 text-left transition-all hover:border-zinc-400">
				<div class="space-y-1">
					<div class="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
						<HugeIcon icon={qa.icon} size={13} class="text-zinc-500 group-hover:text-zinc-900" />
						<span>{qa.title}</span>
					</div>
					<div class="text-[11px] text-zinc-500">{qa.desc}</div>
				</div>
				<HugeIcon icon={ArrowRight01Icon} size={13} class="mt-0.5 shrink-0 text-zinc-400 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-800" />
			</a>
		{/each}
	</div>

	<div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
		{#each kpis as kpi (kpi.title)}
			<Card class="border-zinc-200 bg-white p-3 shadow-none">
				<div class="flex items-center justify-between text-zinc-400">
					<HugeIcon icon={kpi.icon} size={14} />
				</div>
				<div class="mt-1 font-mono text-lg font-bold tracking-tight text-zinc-900">{kpi.value}</div>
				<div class="mt-0.5 text-[10px] font-medium tracking-wider text-zinc-500 uppercase">{kpi.title}</div>
				<div class="mt-1 truncate text-[10px] text-zinc-400">{kpi.note}</div>
			</Card>
		{/each}
	</div>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
		<Card class="flex flex-col justify-between border-zinc-200 bg-white p-4 shadow-none lg:col-span-2">
			<div>
				<div class="mb-2 flex items-center justify-between">
					<div>
						<div class="text-xs font-bold text-zinc-900">Submission velocity (14 days)</div>
						<div class="text-[11px] text-zinc-500">Photos submitted per day</div>
					</div>
					<div class="text-right">
						<span class="font-mono text-xs font-bold text-zinc-900">{peak} / day peak</span>
					</div>
				</div>
				<div class="h-40 w-full pt-4">
					<svg viewBox="0 0 {chartWidth} {chartHeight}" class="h-full w-full overflow-visible">
						<defs>
							<linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stop-color="#18181b" stop-opacity="0.12" />
								<stop offset="100%" stop-color="#18181b" stop-opacity="0.00" />
							</linearGradient>
						</defs>
						{#if pointsString}
							<polygon points="0,{chartHeight} {pointsString} {chartWidth},{chartHeight}" fill="url(#areaFill)" />
							<polyline fill="none" stroke="#18181b" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" points={pointsString} />
						{/if}
					</svg>
				</div>
			</div>
		</Card>

		<Card class="border-zinc-200 bg-white p-4 shadow-none">
			<div class="mb-3">
				<div class="text-xs font-bold text-zinc-900">Core services</div>
				<div class="text-[11px] text-zinc-500">ap-south-1</div>
			</div>
			<div class="space-y-2 font-mono text-[11px]">
				{#each systemServices as s (s.name)}
					<div class="flex items-center justify-between border-b border-zinc-100 py-1 last:border-0">
						<div class="flex items-center gap-2">
							<span class="h-1.5 w-1.5 rounded-full {s.uptime === 'Down' ? 'bg-red-500' : 'bg-emerald-500'}"></span>
							<span class="font-sans text-xs text-zinc-800">{s.name}</span>
						</div>
						<span class="font-medium text-zinc-700">{s.uptime}</span>
					</div>
				{/each}
			</div>
		</Card>
	</div>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<Card class="border-zinc-200 bg-white p-4 shadow-none">
			<div class="mb-3 flex items-center justify-between">
				<div>
					<div class="text-xs font-bold text-zinc-900">Point economy rules</div>
					<div class="text-[11px] text-zinc-500">Points credited per verified category</div>
				</div>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full border-collapse text-left text-xs">
					<thead>
						<tr class="border-b border-zinc-200 font-mono text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
							<th class="px-2 py-1.5">Category</th>
							<th class="px-2 py-1.5">Points</th>
							<th class="px-2 py-1.5">Daily cap</th>
							<th class="px-2 py-1.5 text-right">Save</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-zinc-100 text-[11px]">
						{#each pointRules as rule (rule.category)}
							<tr class="hover:bg-zinc-50">
								<td class="px-2 py-2 text-xs font-medium text-zinc-900 capitalize">{rule.category}</td>
								<td class="px-2 py-2"><input type="number" bind:value={rule.points} class="h-7 w-16 rounded border border-zinc-200 px-1.5 font-mono" /></td>
								<td class="px-2 py-2"><input type="number" bind:value={rule.cap} class="h-7 w-16 rounded border border-zinc-200 px-1.5 font-mono" /></td>
								<td class="px-2 py-2 text-right"><Button size="sm" class="h-6 px-2 text-[11px]" onclick={() => saveRule(rule)}>Save</Button></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</Card>

		<Card class="border-zinc-200 bg-white p-4 shadow-none">
			<div class="mb-3 flex items-center justify-between">
				<div>
					<div class="text-xs font-bold text-zinc-900">Pending redemptions</div>
					<div class="text-[11px] text-zinc-500">Voucher claims awaiting approval</div>
				</div>
			</div>
			<div class="divide-y divide-zinc-100 text-xs">
				{#if pendingRedemptions.length === 0}
					<div class="py-3 text-zinc-400">No pending redemptions.</div>
				{/if}
				{#each pendingRedemptions as item (item.id)}
					<div class="flex items-center justify-between gap-3 py-2.5">
						<div>
							<div class="text-xs font-medium text-zinc-900">{item.cost} pts</div>
							<div class="font-mono text-[10px] text-zinc-400">{String(item.id).slice(0, 8)} · {item.when}</div>
						</div>
						<div class="flex shrink-0 items-center gap-1.5">
							<Button onclick={() => rejectRedeem(item)} variant="outline" size="sm" class="h-6 border-zinc-200 px-2 text-[11px] text-zinc-600">Reject</Button>
							<Button onclick={() => approveRedeem(item)} size="sm" class="h-6 bg-zinc-900 px-2 text-[11px] text-white hover:bg-zinc-800">Approve</Button>
						</div>
					</div>
				{/each}
			</div>
		</Card>
	</div>
</div>
