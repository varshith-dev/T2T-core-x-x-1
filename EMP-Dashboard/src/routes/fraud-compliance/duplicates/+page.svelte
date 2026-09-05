<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { Camera01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

  let duplicateClusters = $state([
    {
      clusterId: 'PHASH-CL-902',
      hammingDistance: 0,
      matchType: 'Bit-Exact Clone',
      copies: 7,
      users: ['USR-8889', 'USR-9012', 'USR-9014'],
      category: 'PET Plastic Bottle',
      pHash: '8f3a1c9e02b4d7e1',
      totalPointsIntercepted: 350
    },
    {
      clusterId: 'PHASH-CL-901',
      hammingDistance: 2,
      matchType: 'Cropped / Rotated Duplicate',
      copies: 4,
      users: ['USR-8419', 'USR-8651'],
      category: 'Aluminium Can',
      pHash: '1a9f4c3b2e7d018a',
      totalPointsIntercepted: 320
    },
    {
      clusterId: 'PHASH-CL-900',
      hammingDistance: 3,
      matchType: 'Color-Adjusted Duplicate',
      copies: 3,
      users: ['USR-8722'],
      category: 'Cardboard Box',
      pHash: '4e2b9c1a0f8d7e33',
      totalPointsIntercepted: 120
    }
  ]);

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleNullify(clusterId: string) {
    duplicateClusters = duplicateClusters.filter(c => c.clusterId !== clusterId);
    toast(`Nullified rewards and flagged sybils for ${clusterId}`);
  }
</script>

<svelte:head>
  <title>Perceptual Hash Deduplication — T2T Fraud & Compliance</title>
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
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Perceptual Hash Duplicate Clusters</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Deduplication engine compares 64-bit DCT perceptual hashes across all uploaded waste photos. Identifies multi-account reward farming.</p>
  </div>

  <div class="space-y-4">
    {#each duplicateClusters as cluster}
      <Card class="bg-white border-zinc-200 p-4 shadow-none space-y-3">
        <div class="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div class="flex items-center gap-2.5">
            <span class="text-xs font-mono font-bold text-zinc-900">{cluster.clusterId}</span>
            <span class="text-xs font-semibold text-zinc-900 font-sans">{cluster.matchType}</span>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
              Hamming Distance: {cluster.hammingDistance}
            </span>
          </div>
          <div class="text-xs font-mono text-zinc-700">
            Intercepted: <strong class="text-zinc-900 font-bold">{cluster.totalPointsIntercepted} pts</strong>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div class="p-2.5 rounded border border-zinc-200 bg-zinc-50 font-mono text-[11px] space-y-1">
            <div class="text-[10px] text-zinc-400 uppercase font-semibold">Fingerprint Hash</div>
            <div class="text-zinc-900 font-bold break-all">{cluster.pHash}</div>
            <div class="text-[10px] text-zinc-500 font-sans">Material: {cluster.category}</div>
          </div>

          <div class="p-2.5 rounded border border-zinc-200 bg-zinc-50 text-[11px] space-y-1">
            <div class="text-[10px] text-zinc-400 uppercase font-mono font-semibold">Linked Sybil Accounts</div>
            <div class="font-mono text-zinc-800">{cluster.users.join(', ')}</div>
            <div class="text-[10px] text-zinc-500 font-sans">{cluster.copies} identical photo uploads detected</div>
          </div>

          <div class="flex items-center justify-end gap-2">
            <Button onclick={() => handleNullify(cluster.clusterId)} size="sm" class="text-xs h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white">
              Nullify Cluster Rewards
            </Button>
          </div>
        </div>
      </Card>
    {/each}
  </div>
</div>
