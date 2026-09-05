<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { Settings01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

  let autoApprovalThreshold = $state(75);
  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }
</script>

<svelte:head>
  <title>Confidence Threshold Tuning — T2T ML Analyst</title>
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
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Auto-Approval Threshold Simulator</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Simulate trade-offs between human QA review volume and false positive point disbarment.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-6 shadow-none max-w-2xl space-y-4">
    <div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-bold text-zinc-900">Global Auto-Approval Threshold</span>
        <span class="text-sm font-mono font-bold text-zinc-900">{autoApprovalThreshold}% Confidence</span>
      </div>
      <input
        type="range"
        min="60"
        max="95"
        step="1"
        bind:value={autoApprovalThreshold}
        class="w-full accent-zinc-900 cursor-pointer"
      />
    </div>

    <div class="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-100 font-mono text-xs">
      <div class="p-3 bg-zinc-50 rounded border border-zinc-200">
        <div class="text-[10px] text-zinc-400 uppercase">Estimated Auto-Approval Rate</div>
        <div class="text-lg font-bold text-zinc-900 mt-0.5">{Math.round(100 - (autoApprovalThreshold - 50) * 0.45)}%</div>
        <div class="text-[10px] text-zinc-500 font-sans mt-0.5">Instant points credit</div>
      </div>
      <div class="p-3 bg-zinc-50 rounded border border-zinc-200">
        <div class="text-[10px] text-zinc-400 uppercase">Human QA Escalation Volume</div>
        <div class="text-lg font-bold text-zinc-900 mt-0.5">{Math.round((autoApprovalThreshold - 50) * 0.45)}%</div>
        <div class="text-[10px] text-zinc-500 font-sans mt-0.5">Queued for reviewer shift</div>
      </div>
    </div>

    <div class="flex justify-end pt-2">
      <Button onclick={() => toast(`Applied ${autoApprovalThreshold}% confidence threshold to live inference workers`)} size="sm" class="text-xs h-8 px-4 bg-zinc-900 hover:bg-zinc-800 text-white">
        Deploy Threshold
      </Button>
    </div>
  </Card>
</div>
