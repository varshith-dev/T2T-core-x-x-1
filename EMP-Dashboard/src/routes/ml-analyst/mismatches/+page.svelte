<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { Search01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

  let mismatches = $state([
    { id: 'MIS-902', groundTruth: 'Plastic (PET)', predicted: 'Glass Bottle', conf: '58.4%', count: 8, reason: 'High surface reflection on transparent bottle' },
    { id: 'MIS-901', groundTruth: 'Paper (Cardboard)', predicted: 'Non-Recyclable', conf: '52.1%', count: 6, reason: 'Folded flat box geometry with shadow' },
    { id: 'MIS-900', groundTruth: 'Metal (Can)', predicted: 'Plastic (PET)', conf: '61.2%', count: 5, reason: 'Crushed cylindrical body with label peeling' },
    { id: 'MIS-899', groundTruth: 'E-Waste (Battery)', predicted: 'Metal (Aluminium)', conf: '64.0%', count: 4, reason: 'Rectangular silver casing without printing' }
  ]);

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleSendToDataset(id: string) {
    mismatches = mismatches.filter(m => m.id !== id);
    toast(`Sent samples from ${id} to active retraining augmentation pipeline`);
  }
</script>

<svelte:head>
  <title>Mislabeled Captures Queue — T2T ML Analyst</title>
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
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Mislabeled Captures & Hard Negatives</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Captures where reviewer ground-truth differed from YOLOv8 vision prediction. Send to active retraining splits.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Case ID</th>
            <th class="py-2.5 px-3">Reviewer Ground Truth</th>
            <th class="py-2.5 px-3">YOLOv8 Prediction</th>
            <th class="py-2.5 px-3">Confidence</th>
            <th class="py-2.5 px-3">Failure Diagnosis</th>
            <th class="py-2.5 px-3 text-right">Retrain Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each mismatches as m}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-semibold text-zinc-900">{m.id}</td>
              <td class="py-3 px-3 font-sans font-medium text-xs text-emerald-800">{m.groundTruth}</td>
              <td class="py-3 px-3 font-sans text-xs text-rose-700">{m.predicted}</td>
              <td class="py-3 px-3 text-zinc-600">{m.conf}</td>
              <td class="py-3 px-3 font-sans text-zinc-500 text-xs">{m.reason}</td>
              <td class="py-3 px-3 text-right font-sans">
                <Button onclick={() => handleSendToDataset(m.id)} variant="outline" size="sm" class="text-[11px] h-6 px-2.5 border-zinc-200">
                  Send to Dataset
                </Button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
