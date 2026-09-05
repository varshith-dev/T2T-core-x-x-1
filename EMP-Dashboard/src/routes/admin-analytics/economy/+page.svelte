<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    Coins01Icon,
    Ticket01Icon,
    CheckmarkCircle01Icon
  } from '@hugeicons/core-free-icons';
</script>

<svelte:head>
  <title>Points Economy & Tokenomics — T2T Analytics</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Points Treasury & Tokenomics</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Circulating rewards liquidity, voucher burn velocity, and monetary exchange parity.</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
    <Card class="bg-white border-zinc-200 p-4 shadow-none">
      <div class="text-[10px] uppercase font-semibold text-zinc-400 font-mono">Circulating Supply</div>
      <div class="text-xl font-bold text-zinc-900 mt-1 font-mono">1,280,000 pts</div>
      <div class="text-xs text-zinc-500 mt-0.5">₹128,000 INR backed value</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-4 shadow-none">
      <div class="text-[10px] uppercase font-semibold text-zinc-400 font-mono">30-Day Burn Velocity</div>
      <div class="text-xl font-bold text-zinc-900 mt-1 font-mono">41.5%</div>
      <div class="text-xs text-zinc-500 mt-0.5">Voucher redemption rate</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-4 shadow-none">
      <div class="text-[10px] uppercase font-semibold text-zinc-400 font-mono">Treasury Reserve Balance</div>
      <div class="text-xl font-bold text-emerald-700 mt-1 font-mono">₹200,000</div>
      <div class="text-xs text-zinc-500 mt-0.5">Corporate ESG escrow pool</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-4 shadow-none">
      <div class="text-[10px] uppercase font-semibold text-zinc-400 font-mono">Exchange Parity</div>
      <div class="text-xl font-bold text-zinc-900 mt-1 font-mono">10 pts = ₹1.00</div>
      <div class="text-xs text-zinc-500 mt-0.5">Strict non-inflationary peg</div>
    </Card>
  </div>

  <Card class="bg-white border-zinc-200 p-5 shadow-none space-y-3">
    <div class="text-xs font-bold text-zinc-900">Monetary Inflow & Outflow Breakdown</div>
    <div class="divide-y divide-zinc-100 font-mono text-xs">
      <div class="py-2.5 flex justify-between items-center">
        <span class="text-zinc-700">Total Reward Points Minted (Lifetime)</span>
        <span class="font-bold text-zinc-900">2,480,000 pts (₹248,000)</span>
      </div>
      <div class="py-2.5 flex justify-between items-center">
        <span class="text-zinc-700">Points Burned in Voucher Redemptions</span>
        <span class="font-bold text-rose-700">-1,200,000 pts (₹120,000)</span>
      </div>
      <div class="py-2.5 flex justify-between items-center">
        <span class="text-zinc-700">Net Active Citizen Wallet Liability</span>
        <span class="font-bold text-emerald-700">1,280,000 pts (₹128,000)</span>
      </div>
      <div class="py-2.5 flex justify-between items-center">
        <span class="text-zinc-700">Monthly ESG Sponsor Grant Replenishment</span>
        <span class="font-bold text-zinc-900">+₹50,000 / month</span>
      </div>
    </div>
  </Card>
</div>
