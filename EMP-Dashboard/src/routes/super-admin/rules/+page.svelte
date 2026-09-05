<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    Settings01Icon,
    CheckmarkCircle01Icon
  } from '@hugeicons/core-free-icons';

  interface PointRule {
    category: string;
    code: string;
    points: number;
    cap: number;
    minConfidence: number;
    tierMultiplier: number;
    active: boolean;
  }

  let rules = $state<PointRule[]>([
    { category: 'Plastic Bottles (PET)', code: 'PET', points: 10, cap: 50, minConfidence: 75, tierMultiplier: 1.0, active: true },
    { category: 'Paper & Cardboard', code: 'PAPR', points: 5, cap: 30, minConfidence: 70, tierMultiplier: 1.0, active: true },
    { category: 'Glass Containers', code: 'GLAS', points: 15, cap: 20, minConfidence: 80, tierMultiplier: 1.1, active: true },
    { category: 'Metal & Aluminium Cans', code: 'METL', points: 20, cap: 25, minConfidence: 80, tierMultiplier: 1.1, active: true },
    { category: 'E-Waste & Batteries', code: 'EWST', points: 50, cap: 5, minConfidence: 85, tierMultiplier: 1.25, active: true }
  ]);

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleSaveRule(cat: string) {
    toast(`Saved updated economy formulas for ${cat}`);
  }

  function handleSaveAll() {
    toast('Saved and deployed all point economy formulas across platform');
  }
</script>

<svelte:head>
  <title>Point Economy Rules & Caps — T2T Super Admin</title>
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
      <h1 class="text-xl font-bold tracking-tight text-zinc-900">Point Incentive Formulas & Caps</h1>
      <p class="text-xs text-zinc-500 mt-0.5">Authoritative economy rules dictating citizen token minting rates and confidence gates.</p>
    </div>
    <Button onclick={handleSaveAll} size="sm" class="text-xs h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white">
      Deploy All Rules
    </Button>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Taxonomy Class</th>
            <th class="py-2.5 px-3">Points Per Item</th>
            <th class="py-2.5 px-3">Daily Submissions Cap</th>
            <th class="py-2.5 px-3">Min AI Conf Gate</th>
            <th class="py-2.5 px-3">Tier Multiplier</th>
            <th class="py-2.5 px-3">Rule Status</th>
            <th class="py-2.5 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each rules as r}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3">
                <div class="font-sans font-semibold text-xs text-zinc-900">{r.category}</div>
                <div class="text-[10px] text-zinc-400 font-mono">Code: {r.code}</div>
              </td>
              <td class="py-3 px-3">
                <input
                  type="number"
                  bind:value={r.points}
                  class="w-16 px-2 py-0.5 border border-zinc-200 rounded font-bold text-zinc-900 focus:outline-none focus:border-zinc-900"
                /> pts
              </td>
              <td class="py-3 px-3">
                <input
                  type="number"
                  bind:value={r.cap}
                  class="w-16 px-2 py-0.5 border border-zinc-200 rounded text-zinc-700 focus:outline-none focus:border-zinc-900"
                /> items
              </td>
              <td class="py-3 px-3 text-zinc-700">
                <input
                  type="number"
                  bind:value={r.minConfidence}
                  min="50"
                  max="99"
                  class="w-14 px-2 py-0.5 border border-zinc-200 rounded text-zinc-700 focus:outline-none focus:border-zinc-900"
                /> %
              </td>
              <td class="py-3 px-3 text-zinc-700">
                {r.tierMultiplier}x
              </td>
              <td class="py-3 px-3 font-sans">
                <label class="inline-flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" bind:checked={r.active} class="rounded border-zinc-300 accent-zinc-900" />
                  <span class="text-[11px] {r.active ? 'text-emerald-700 font-medium' : 'text-zinc-400'}">
                    {r.active ? 'Active' : 'Disabled'}
                  </span>
                </label>
              </td>
              <td class="py-3 px-3 text-right font-sans">
                <Button onclick={() => handleSaveRule(r.category)} variant="outline" size="sm" class="text-[11px] h-6 px-2.5 border-zinc-200">
                  Save
                </Button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
