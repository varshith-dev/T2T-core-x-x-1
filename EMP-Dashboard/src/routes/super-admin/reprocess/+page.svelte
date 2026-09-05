<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    RotateLeft01Icon,
    CheckmarkCircle01Icon,
    Activity01Icon
  } from '@hugeicons/core-free-icons';

  let selectedModel = $state('YOLOv8-Waste v2.4.1 (Production)');
  let threshold = $state(75);
  let isRunning = $state(false);
  let progress = $state(0);
  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  let queueItems = $state([
    { id: 'SUB-18490', citizen: 'Rahul Verma', currentCategory: 'Needs Review', prevConf: '64.8%', targetModel: 'v2.4.1' },
    { id: 'SUB-18485', citizen: 'Pooja Iyer', currentCategory: 'Needs Review', prevConf: '58.2%', targetModel: 'v2.4.1' },
    { id: 'SUB-18471', citizen: 'Ananya Roy', currentCategory: 'Needs Review', prevConf: '61.4%', targetModel: 'v2.4.1' },
    { id: 'SUB-18455', citizen: 'David D.', currentCategory: 'Needs Review', prevConf: '69.0%', targetModel: 'v2.4.1' },
    { id: 'SUB-18440', citizen: 'Kiran P.', currentCategory: 'Needs Review', prevConf: '54.1%', targetModel: 'v2.4.1' }
  ]);

  function handleStartReprocess() {
    isRunning = true;
    progress = 10;
    toast('Dispatched batch re-inference job to Triton GPU worker fleet');
    const interval = setInterval(() => {
      progress += 25;
      if (progress >= 100) {
        clearInterval(interval);
        isRunning = false;
        toast('Batch re-inference complete: 84 of 124 submissions auto-approved');
      }
    }, 600);
  }
</script>

<svelte:head>
  <title>Batch Reprocess Queue — T2T Super Admin</title>
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
      <h1 class="text-xl font-bold tracking-tight text-zinc-900">AI Classification Reprocess Queue</h1>
      <p class="text-xs text-zinc-500 mt-0.5">Re-evaluate unverified or low-confidence submissions against newly trained YOLO checkpoint models.</p>
    </div>
    <Button onclick={handleStartReprocess} disabled={isRunning} size="sm" class="text-xs h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white">
      <HugeIcon icon={RotateLeft01Icon} size={12} class="mr-1.5" />
      {isRunning ? `Reprocessing (${progress}%)...` : 'Start Batch Re-inference'}
    </Button>
  </div>

  <Card class="bg-white border-zinc-200 p-5 shadow-none space-y-4 max-w-2xl">
    <div class="space-y-3">
      <div>
        <label for="reprocess-model" class="block text-xs font-bold text-zinc-900 mb-1">Target Checkpoint Model</label>
        <select id="reprocess-model" bind:value={selectedModel} class="w-full px-3 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900 font-sans">
          <option value="YOLOv8-Waste v2.4.1 (Production)">YOLOv8-Waste v2.4.1 (Production, mAP 91.2%)</option>
          <option value="YOLOv8-Waste v2.4.2-rc1 (Staging)">YOLOv8-Waste v2.4.2-rc1 (Staging, mAP 92.4%)</option>
          <option value="YOLOv7-Backbone Legacy">YOLOv7-Backbone Legacy (mAP 84.1%)</option>
        </select>
      </div>

      <div>
        <div class="flex items-center justify-between mb-1">
          <label for="reprocess-thresh" class="text-xs font-bold text-zinc-900">Auto-Approval Threshold</label>
          <span class="text-xs font-mono font-bold text-zinc-900">{threshold}%</span>
        </div>
        <input
          id="reprocess-thresh"
          type="range"
          min="60"
          max="95"
          step="1"
          bind:value={threshold}
          class="w-full accent-zinc-900 cursor-pointer"
        />
        <div class="text-[11px] text-zinc-500 mt-1">Submissions with re-evaluated confidence &ge; {threshold}% will automatically credit citizen points.</div>
      </div>

      {#if isRunning}
        <div class="space-y-1.5 pt-2">
          <div class="flex justify-between text-xs font-mono text-zinc-600">
            <span>GPU Workers Active</span>
            <span>{progress}%</span>
          </div>
          <div class="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200">
            <div class="bg-zinc-900 h-full transition-all duration-300" style="width: {progress}%"></div>
          </div>
        </div>
      {/if}
    </div>
  </Card>

  <!-- Queue Items Sample -->
  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="flex items-center justify-between mb-3">
      <div>
        <div class="text-xs font-bold text-zinc-900">Queued Submissions Awaiting Re-inference (124 Items)</div>
        <div class="text-[11px] text-zinc-500">Low confidence captures previously held for human QA review</div>
      </div>
      <span class="text-[10px] font-mono text-zinc-400">Queue: Active</span>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Submission ID</th>
            <th class="py-2.5 px-3">Citizen</th>
            <th class="py-2.5 px-3">Current Status</th>
            <th class="py-2.5 px-3">Original Confidence</th>
            <th class="py-2.5 px-3">Target Model</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each queueItems as q}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-2.5 px-3 font-semibold text-zinc-900">{q.id}</td>
              <td class="py-2.5 px-3 font-sans text-xs text-zinc-900">{q.citizen}</td>
              <td class="py-2.5 px-3 font-sans">
                <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                  {q.currentCategory}
                </span>
              </td>
              <td class="py-2.5 px-3 text-zinc-600">{q.prevConf}</td>
              <td class="py-2.5 px-3 text-zinc-800 font-semibold">{q.targetModel}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
