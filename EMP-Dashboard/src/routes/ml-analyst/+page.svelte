<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    Activity01Icon,
    CheckmarkCircle01Icon,
    CpuIcon,
    Search01Icon
  } from '@hugeicons/core-free-icons';

  const categoryMetrics = [
    { name: 'Plastic (PET)', samples: 7860, precision: 94.8, recall: 92.1, f1: 93.4 },
    { name: 'Paper & Cardboard', samples: 4490, precision: 91.2, recall: 89.6, f1: 90.4 },
    { name: 'Glass Containers', samples: 2990, precision: 88.5, recall: 86.4, f1: 87.4 },
    { name: 'Metal & Aluminium', samples: 2240, precision: 96.1, recall: 94.5, f1: 95.3 },
    { name: 'E-Waste Batteries', samples: 1120, precision: 82.4, recall: 79.1, f1: 80.7 }
  ];
</script>

<svelte:head>
  <title>Model Evaluation Studio — T2T ML Analyst</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">YOLOv8 Vision Model Studio</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Validation metrics, per-material confusion matrix, classification loss curves, and mislabeled sample queue.</p>
  </div>

  <div class="grid grid-cols-4 gap-3">
    <Card class="bg-white border-zinc-200 p-3 shadow-none">
      <div class="flex items-center justify-between text-zinc-400">
        <HugeIcon icon={Activity01Icon} size={14} />
        <span class="text-[10px] font-mono text-emerald-700 font-semibold">↑ 2.1pp</span>
      </div>
      <div class="text-xl font-bold text-zinc-900 mt-1 font-mono tracking-tight">91.2%</div>
      <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">mAP@50-95</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-3 shadow-none">
      <div class="flex items-center justify-between text-zinc-400">
        <HugeIcon icon={CheckmarkCircle01Icon} size={14} />
        <span class="text-[10px] font-mono text-emerald-700 font-semibold">↑ 1.8pp</span>
      </div>
      <div class="text-xl font-bold text-zinc-900 mt-1 font-mono tracking-tight">87.4%</div>
      <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Auto-Approval Rate</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-3 shadow-none">
      <div class="flex items-center justify-between text-zinc-400">
        <HugeIcon icon={CpuIcon} size={14} />
        <span class="text-[10px] font-mono text-zinc-500">TensorRT</span>
      </div>
      <div class="text-xl font-bold text-zinc-900 mt-1 font-mono tracking-tight">18.2ms</div>
      <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">p95 Inference Time</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-3 shadow-none">
      <div class="flex items-center justify-between text-zinc-400">
        <HugeIcon icon={Search01Icon} size={14} />
        <span class="text-[10px] font-mono text-amber-700 font-semibold">Active</span>
      </div>
      <div class="text-xl font-bold text-zinc-900 mt-1 font-mono tracking-tight">4</div>
      <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Mismatches Logged</div>
    </Card>
  </div>

  <!-- Class-Level Precision / Recall -->
  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="flex items-center justify-between mb-3">
      <div>
        <div class="text-xs font-bold text-zinc-900">Per-Class Vision Performance</div>
        <div class="text-[11px] text-zinc-500">Evaluation on 18,740 validation images in ap-south-1 test set</div>
      </div>
      <span class="text-[10px] font-mono text-zinc-400">YOLOv8-Waste v2.4.1</span>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Class Name</th>
            <th class="py-2.5 px-3">Val Samples</th>
            <th class="py-2.5 px-3">Precision</th>
            <th class="py-2.5 px-3">Recall</th>
            <th class="py-2.5 px-3 text-right">F1 Score</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each categoryMetrics as cat}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-2.5 px-3 font-sans font-semibold text-zinc-900">{cat.name}</td>
              <td class="py-2.5 px-3 text-zinc-500">{cat.samples.toLocaleString()}</td>
              <td class="py-2.5 px-3 text-zinc-700">{cat.precision}%</td>
              <td class="py-2.5 px-3 text-zinc-700">{cat.recall}%</td>
              <td class="py-2.5 px-3 text-right font-bold text-zinc-900">{cat.f1}%</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
