<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { Package01Icon } from '@hugeicons/core-free-icons';

  const categories = [
    { name: 'Plastic Bottles (PET)', pct: 42, count: '7,860 items', tonnage: '3.92 tons', accuracy: '94.8%', co2Offset: '2.20 tons CO2e' },
    { name: 'Paper & Cardboard', pct: 24, count: '4,490 items', tonnage: '2.84 tons', accuracy: '91.2%', co2Offset: '2.02 tons CO2e' },
    { name: 'Glass Containers', pct: 16, count: '2,990 items', tonnage: '4.10 tons', accuracy: '88.5%', co2Offset: '1.05 tons CO2e' },
    { name: 'Metal & Aluminium Cans', pct: 12, count: '2,240 items', tonnage: '1.45 tons', accuracy: '96.1%', co2Offset: '2.13 tons CO2e' },
    { name: 'E-Waste & Batteries', pct: 6, count: '1,120 items', tonnage: '0.42 tons', accuracy: '82.4%', co2Offset: '2.35 tons CO2e' }
  ];
</script>

<svelte:head>
  <title>Material Categories & Tonnage — T2T Analytics</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Material Category Tonnage & Vision Precision</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Physical weights collected, AI classification accuracy, and net carbon offset contribution.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Waste Category</th>
            <th class="py-2.5 px-3">Volume Share</th>
            <th class="py-2.5 px-3">Verified Items</th>
            <th class="py-2.5 px-3">Total Mass</th>
            <th class="py-2.5 px-3">AI Vision Accuracy</th>
            <th class="py-2.5 px-3 text-right">Net CO2 Offset</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each categories as c}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-sans font-semibold text-xs text-zinc-900">{c.name}</td>
              <td class="py-3 px-3">
                <div class="flex items-center gap-2">
                  <div class="w-16 bg-zinc-100 h-1.5 rounded-full overflow-hidden border border-zinc-200">
                    <div class="bg-zinc-900 h-full" style="width: {c.pct}%"></div>
                  </div>
                  <span class="text-zinc-700">{c.pct}%</span>
                </div>
              </td>
              <td class="py-3 px-3 text-zinc-700">{c.count}</td>
              <td class="py-3 px-3 font-bold text-zinc-900">{c.tonnage}</td>
              <td class="py-3 px-3 text-emerald-700 font-semibold">{c.accuracy}</td>
              <td class="py-3 px-3 text-right text-zinc-800">{c.co2Offset}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
