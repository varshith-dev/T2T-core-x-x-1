<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { Folder01Icon, File01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

  const splits = [
    { name: 'Training Set (Train)', images: '13,118', annotations: '28,420 bboxes', format: 'YOLOv8 PyTorch', size: '4.2 GB', distribution: '70%' },
    { name: 'Validation Set (Val)', images: '3,748', annotations: '8,120 bboxes', format: 'YOLOv8 PyTorch', size: '1.2 GB', distribution: '20%' },
    { name: 'Holdout Test Set (Test)', images: '1,874', annotations: '4,060 bboxes', format: 'COCO JSON', size: '600 MB', distribution: '10%' }
  ];

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }
</script>

<svelte:head>
  <title>Dataset Splits & Augmentations — T2T ML Analyst</title>
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

  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold tracking-tight text-zinc-900">Training Datasets & Stratified Splits</h1>
      <p class="text-xs text-zinc-500 mt-0.5">18,740 curated waste photos partitioned across Train (70%), Val (20%), and Holdout Test (10%).</p>
    </div>
    <Button onclick={() => toast('Exported YOLOv8 dataset YAML descriptor and download links')} variant="outline" size="sm" class="text-xs h-8 px-3 border-zinc-200">
      <HugeIcon icon={File01Icon} size={12} class="mr-1.5 text-zinc-500" />
      Export Dataset YAML
    </Button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    {#each splits as s}
      <Card class="bg-white border-zinc-200 p-4 shadow-none space-y-3">
        <div class="flex items-center justify-between border-b border-zinc-100 pb-2">
          <span class="font-bold text-xs text-zinc-900 font-sans">{s.name}</span>
          <span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 font-bold">
            {s.distribution}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2 font-mono text-xs">
          <div class="p-2 rounded bg-zinc-50 border border-zinc-200">
            <div class="text-[9px] text-zinc-400 uppercase">Images</div>
            <div class="font-bold text-zinc-900 mt-0.5">{s.images}</div>
          </div>
          <div class="p-2 rounded bg-zinc-50 border border-zinc-200">
            <div class="text-[9px] text-zinc-400 uppercase">Annotations</div>
            <div class="font-bold text-zinc-900 mt-0.5">{s.annotations}</div>
          </div>
        </div>

        <div class="text-[11px] text-zinc-500 font-mono">Format: {s.format} ({s.size})</div>
      </Card>
    {/each}
  </div>
</div>
