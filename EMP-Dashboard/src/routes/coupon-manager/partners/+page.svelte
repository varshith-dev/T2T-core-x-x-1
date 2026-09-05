<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { Package01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

  let partners = $state([
    { name: 'Amazon India', category: 'E-Commerce', tier: 'Strategic', commission: '6.5%', activeBatches: 3, totalRedeemedValue: '₹342,500', apiHealth: 'Healthy', contact: 'partnerships@amazon.in' },
    { name: 'Decathlon Sports', category: 'Retail & Apparel', tier: 'Strategic', commission: '8.0%', activeBatches: 2, totalRedeemedValue: '₹188,400', apiHealth: 'Healthy', contact: 'eco@decathlon.in' },
    { name: 'Swiggy', category: 'Food Delivery', tier: 'Strategic', commission: '7.5%', activeBatches: 4, totalRedeemedValue: '₹410,200', apiHealth: 'Healthy', contact: 'green@swiggy.in' },
    { name: 'Uber Mobility', category: 'EV Transportation', tier: 'Preferred', commission: '9.0%', activeBatches: 2, totalRedeemedValue: '₹94,500', apiHealth: 'Healthy', contact: 'mobility@uber.com' },
    { name: 'Zomato Feeding India', category: 'Food & Dining', tier: 'Preferred', commission: '8.5%', activeBatches: 2, totalRedeemedValue: '₹142,800', apiHealth: 'Healthy', contact: 'impact@zomato.com' },
    { name: 'BigBasket Organic', category: 'Groceries', tier: 'Standard', commission: '10.0%', activeBatches: 1, totalRedeemedValue: '₹76,000', apiHealth: 'Healthy', contact: 'vendors@bigbasket.com' }
  ]);

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }
</script>

<svelte:head>
  <title>Merchant Brands & Partners — T2T Rewards</title>
</svelte:head>

<div class="space-y-6">
  {#if toastMsg}
    <div class="bg-zinc-900 text-white text-xs px-4 py-2.5 rounded flex items-center justify-between transition-all font-mono">
      <div class="flex items-center gap-2">
        <HugeIcon icon={CheckmarkCircle01Icon} size={14} class="text-zinc-200" />
        <span>{toastMsg}</span>
      </div>
      <button onclick={() => (toastMsg = null)} class="text-zinc-400 hover:text-white text-xs">Dismiss</button>
    </div>
  {/if}

  <div>
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Retail Brand Partners Network</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Contractual merchant agreements, API webhook health, commission structures, and lifetime gross voucher redemptions.</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each partners as p}
      <Card class="bg-white border-zinc-200 p-4 shadow-none space-y-3">
        <div class="flex items-center justify-between border-b border-zinc-100 pb-2">
          <div>
            <div class="text-xs font-bold text-zinc-900 font-sans">{p.name}</div>
            <div class="text-[10px] text-zinc-400 font-mono">{p.category} · {p.contact}</div>
          </div>
          <span class="text-[10px] font-mono px-1.5 py-0.5 rounded font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
            {p.tier} Partner
          </span>
        </div>

        <div class="grid grid-cols-3 gap-2 font-mono text-xs">
          <div class="p-2 rounded bg-zinc-50 border border-zinc-200">
            <div class="text-[9px] text-zinc-400 uppercase">Commission</div>
            <div class="font-bold text-zinc-900 mt-0.5">{p.commission}</div>
          </div>
          <div class="p-2 rounded bg-zinc-50 border border-zinc-200">
            <div class="text-[9px] text-zinc-400 uppercase">Batches</div>
            <div class="font-bold text-zinc-900 mt-0.5">{p.activeBatches} Live</div>
          </div>
          <div class="p-2 rounded bg-zinc-50 border border-zinc-200">
            <div class="text-[9px] text-zinc-400 uppercase">Redeemed</div>
            <div class="font-bold text-zinc-900 mt-0.5">{p.totalRedeemedValue}</div>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs pt-1">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full {p.apiHealth === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
            <span class="text-[11px] font-mono text-zinc-600">Webhook: {p.apiHealth}</span>
          </div>
          <Button onclick={() => toast(`Triggered test ping to ${p.name} partner API`)} variant="outline" size="sm" class="text-[11px] h-6 px-2 border-zinc-200">
            Test Sync
          </Button>
        </div>
      </Card>
    {/each}
  </div>
</div>
