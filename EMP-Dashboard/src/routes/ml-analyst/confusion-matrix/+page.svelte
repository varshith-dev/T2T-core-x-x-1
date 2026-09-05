<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { Analytics01Icon } from '@hugeicons/core-free-icons';

  const confusionMatrix = [
    { actual: 'Plastic', predPlastic: 7450, predPaper: 120, predGlass: 180, predMetal: 70, predEWaste: 40 },
    { actual: 'Paper', predPlastic: 90, predPaper: 4020, predGlass: 60, predMetal: 210, predEWaste: 110 },
    { actual: 'Glass', predPlastic: 140, predPaper: 30, predGlass: 2580, predMetal: 160, predEWaste: 80 },
    { actual: 'Metal', predPlastic: 40, predPaper: 30, predGlass: 10, predMetal: 2110, predEWaste: 50 },
    { actual: 'E-Waste', predPlastic: 20, predPaper: 40, predGlass: 10, predMetal: 130, predEWaste: 920 }
  ];
</script>

<svelte:head>
  <title>Confusion Matrix — T2T ML Analyst</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">5×5 Multi-Class Confusion Matrix</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Evaluation of cross-class confusion between actual ground truth and predicted waste taxonomies.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-5 shadow-none space-y-4">
    <div class="overflow-x-auto">
      <table class="w-full text-center text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 font-mono text-[10px] text-zinc-400 uppercase">
            <th class="py-2.5 px-3 text-left font-semibold">Actual \ Predicted</th>
            <th class="py-2.5 px-3 font-semibold">Plastic</th>
            <th class="py-2.5 px-3 font-semibold">Paper</th>
            <th class="py-2.5 px-3 font-semibold">Glass</th>
            <th class="py-2.5 px-3 font-semibold">Metal</th>
            <th class="py-2.5 px-3 font-semibold">E-Waste</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-xs">
          {#each confusionMatrix as row}
            <tr class="hover:bg-zinc-50">
              <td class="py-3 px-3 text-left font-bold text-zinc-900 font-sans">{row.actual}</td>
              <td class="py-3 px-3 font-bold bg-emerald-50 text-emerald-950 border border-emerald-100">{row.predPlastic}</td>
              <td class="py-3 px-3 {row.predPaper > 100 && row.actual !== 'Paper' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-zinc-600'}">{row.predPaper}</td>
              <td class="py-3 px-3 {row.predGlass > 100 && row.actual !== 'Glass' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-zinc-600'}">{row.predGlass}</td>
              <td class="py-3 px-3 {row.predMetal > 100 && row.actual !== 'Metal' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-zinc-600'}">{row.predMetal}</td>
              <td class="py-3 px-3 {row.predEWaste > 100 && row.actual !== 'E-Waste' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-zinc-600'}">{row.predEWaste}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
