<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { Coins01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

  let exchangeRatio = $state(10);
  let monthlyClaimCap = $state(5000);
  let instantIssuanceLimit = $state(1500);
  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleSave() {
    toast(`Treasury rules saved: ${exchangeRatio} pts = ₹1. Monthly citizen cap: ${monthlyClaimCap} pts.`);
  }
</script>

<svelte:head>
  <title>Treasury Parity & Exchange Rates — T2T Rewards</title>
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
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Rewards Treasury & Monetary Peg</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Configure currency parity between platform points and INR retail voucher value. Set monthly wallet caps and velocity rules.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-6 shadow-none max-w-2xl space-y-6">
    <div class="space-y-4">
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label for="peg-slider" class="text-xs font-bold text-zinc-900">Exchange Peg (Points per ₹1 INR)</label>
          <span class="text-xs font-mono font-bold text-zinc-900">{exchangeRatio} pts = ₹1.00</span>
        </div>
        <input
          id="peg-slider"
          type="range"
          min="5"
          max="25"
          step="1"
          bind:value={exchangeRatio}
          class="w-full accent-zinc-900 cursor-pointer"
        />
        <p class="text-[11px] text-zinc-500 mt-1">
          At {exchangeRatio} pts = ₹1, a ₹100 gift card costs exactly {exchangeRatio * 100} points.
        </p>
      </div>

      <div class="pt-4 border-t border-zinc-100">
        <label for="cap-input" class="block text-xs font-bold text-zinc-900 mb-1">Monthly Citizen Redemption Limit (Pts)</label>
        <input
          id="cap-input"
          type="number"
          bind:value={monthlyClaimCap}
          step="500"
          class="w-full px-3 py-1.5 rounded border border-zinc-200 text-xs font-mono bg-white focus:outline-none focus:border-zinc-900"
        />
        <p class="text-[11px] text-zinc-500 mt-1">
          Prevents sybil account drain. Maximum payout equivalent: ₹{Math.round(monthlyClaimCap / exchangeRatio)} per citizen per month.
        </p>
      </div>

      <div class="pt-4 border-t border-zinc-100">
        <label for="instant-input" class="block text-xs font-bold text-zinc-900 mb-1">Instant Auto-Dispatch Threshold (Pts)</label>
        <input
          id="instant-input"
          type="number"
          bind:value={instantIssuanceLimit}
          step="250"
          class="w-full px-3 py-1.5 rounded border border-zinc-200 text-xs font-mono bg-white focus:outline-none focus:border-zinc-900"
        />
        <p class="text-[11px] text-zinc-500 mt-1">
          Claims below this value skip manual desk review if fraud risk score is below 20.
        </p>
      </div>
    </div>

    <div class="pt-4 border-t border-zinc-100 flex items-center justify-between">
      <span class="text-[11px] font-mono text-zinc-400">SOC2 Policy Ref: TR-2026-V1</span>
      <Button onclick={handleSave} size="sm" class="text-xs h-8 px-4 bg-zinc-900 hover:bg-zinc-800 text-white">
        Save Treasury Policy
      </Button>
    </div>
  </Card>
</div>
