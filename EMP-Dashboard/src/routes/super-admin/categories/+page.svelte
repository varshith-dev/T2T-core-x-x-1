<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    Folder01Icon,
    PlusSignIcon,
    CheckmarkCircle01Icon,
    Delete01Icon,
    Settings01Icon,
    File01Icon
  } from '@hugeicons/core-free-icons';

  interface WasteCategory {
    id: string;
    code: string;
    name: string;
    points: number;
    cap: number;
    co2OffsetKg: number;
    examples: string;
    active: boolean;
    submissionsCount: string;
  }

  let categories = $state<WasteCategory[]>([
    { id: 'CAT-001', code: 'PET', name: 'Plastic Bottles (PET)', points: 10, cap: 50, co2OffsetKg: 0.28, examples: 'Mineral water, soda bottles, clear plastic', active: true, submissionsCount: '7,860 items' },
    { id: 'CAT-002', code: 'PAPR', name: 'Paper & Cardboard', points: 5, cap: 30, co2OffsetKg: 0.45, examples: 'Shipping boxes, newspapers, egg cartons', active: true, submissionsCount: '4,490 items' },
    { id: 'CAT-003', code: 'GLAS', name: 'Glass Containers', points: 15, cap: 20, co2OffsetKg: 0.35, examples: 'Beverage bottles, jam jars, sauce bottles', active: true, submissionsCount: '2,990 items' },
    { id: 'CAT-004', code: 'METL', name: 'Metal & Aluminium Cans', points: 20, cap: 25, co2OffsetKg: 0.95, examples: 'Soda cans, food tins, aluminium foil', active: true, submissionsCount: '2,240 items' },
    { id: 'CAT-005', code: 'EWST', name: 'E-Waste & Batteries', points: 50, cap: 5, co2OffsetKg: 2.10, examples: 'Lithium phone batteries, cables, PCBs', active: true, submissionsCount: '1,120 items' },
    { id: 'CAT-006', code: 'ORGC', name: 'Organic & Compostable', points: 8, cap: 40, co2OffsetKg: 0.15, examples: 'Food scraps, coffee grounds, plant trimmings', active: false, submissionsCount: '340 items' }
  ]);

  let showAddModal = $state(false);
  let newName = $state('');
  let newCode = $state('');
  let newPoints = $state(15);
  let newCap = $state(30);
  let newCo2 = $state(0.5);
  let newExamples = $state('');

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleAddCategory(e: Event) {
    e.preventDefault();
    if (!newName || !newCode) return;
    const newId = `CAT-00${categories.length + 1}`;
    categories.push({
      id: newId,
      code: newCode.toUpperCase(),
      name: newName,
      points: newPoints,
      cap: newCap,
      co2OffsetKg: newCo2,
      examples: newExamples || 'Various recyclable items',
      active: true,
      submissionsCount: '0 items'
    });
    newName = '';
    newCode = '';
    newExamples = '';
    showAddModal = false;
    toast(`Added new waste category: ${newName} (${newCode})`);
  }

  function handleDeleteCategory(id: string, name: string) {
    categories = categories.filter(c => c.id !== id);
    toast(`Removed category ${name}`);
  }

  function handleSaveAll() {
    toast('Saved all taxonomy categories and updated live YOLO vision class mappings');
  }
</script>

<svelte:head>
  <title>Waste Categories & Taxonomy — T2T Super Admin</title>
</svelte:head>

<div class="space-y-6">
  <!-- Notification Bar -->
  {#if toastMsg}
    <div class="bg-zinc-900 text-white text-xs px-4 py-2.5 rounded flex items-center justify-between transition-all font-mono">
      <div class="flex items-center gap-2">
        <HugeIcon icon={CheckmarkCircle01Icon} size={14} class="text-zinc-200" />
        <span>{toastMsg}</span>
      </div>
      <button onclick={() => (toastMsg = null)} class="text-zinc-400 hover:text-white text-xs">
        Dismiss
      </button>
    </div>
  {/if}

  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold tracking-tight text-zinc-900">Waste Categories & Material Taxonomy</h1>
      <p class="text-xs text-zinc-500 mt-0.5">
        Define recyclables taxonomy, point multipliers, CO2 offset factors, and daily citizen submission caps.
      </p>
    </div>
    <div class="flex items-center gap-2">
      <Button onclick={() => (showAddModal = !showAddModal)} size="sm" class="text-xs h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white">
        <HugeIcon icon={PlusSignIcon} size={12} class="mr-1.5" />
        Add Category
      </Button>
      <Button onclick={handleSaveAll} variant="outline" size="sm" class="text-xs h-8 px-3 border-zinc-200">
        Save Taxonomy
      </Button>
    </div>
  </div>

  <!-- Add Category Modal / Drawer -->
  {#if showAddModal}
    <Card class="bg-white border-zinc-900 p-5 shadow-none space-y-4">
      <div class="flex items-center justify-between border-b border-zinc-100 pb-2">
        <span class="text-xs font-bold text-zinc-900">Define New Waste Category</span>
        <button type="button" onclick={() => (showAddModal = false)} class="text-xs text-zinc-400 hover:text-zinc-900">Cancel</button>
      </div>

      <form onsubmit={handleAddCategory} class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label for="cat-name" class="block text-[10px] font-semibold uppercase text-zinc-500 mb-1">Category Name</label>
            <input id="cat-name" bind:value={newName} placeholder="e.g. Tetra Pak Cartons" required class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900" />
          </div>
          <div>
            <label for="cat-code" class="block text-[10px] font-semibold uppercase text-zinc-500 mb-1">Taxonomy Code (4 chars)</label>
            <input id="cat-code" bind:value={newCode} maxlength="4" placeholder="TETR" required class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white uppercase font-mono focus:outline-none focus:border-zinc-900" />
          </div>
          <div>
            <label for="cat-points" class="block text-[10px] font-semibold uppercase text-zinc-500 mb-1">Points Reward Per Item</label>
            <input id="cat-points" type="number" bind:value={newPoints} min="1" step="1" class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white font-mono focus:outline-none focus:border-zinc-900" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label for="cat-cap" class="block text-[10px] font-semibold uppercase text-zinc-500 mb-1">Daily Citizen Cap (Items)</label>
            <input id="cat-cap" type="number" bind:value={newCap} min="1" class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white font-mono focus:outline-none focus:border-zinc-900" />
          </div>
          <div>
            <label for="cat-co2" class="block text-[10px] font-semibold uppercase text-zinc-500 mb-1">CO2 Offset Factor (kg CO2e / item)</label>
            <input id="cat-co2" type="number" bind:value={newCo2} step="0.05" class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white font-mono focus:outline-none focus:border-zinc-900" />
          </div>
          <div>
            <label for="cat-examples" class="block text-[10px] font-semibold uppercase text-zinc-500 mb-1">Accepted Item Examples</label>
            <input id="cat-examples" bind:value={newExamples} placeholder="Juice boxes, milk cartons" class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900" />
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <Button type="submit" size="sm" class="text-xs h-7 px-3 bg-zinc-900 hover:bg-zinc-800 text-white">
            Create Category & Propagate to Vision AI
          </Button>
        </div>
      </form>
    </Card>
  {/if}

  <!-- Categories Table -->
  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Taxonomy ID</th>
            <th class="py-2.5 px-3">Material Category</th>
            <th class="py-2.5 px-3">Points Per Item</th>
            <th class="py-2.5 px-3">Daily Citizen Cap</th>
            <th class="py-2.5 px-3">CO2 Offset Factor</th>
            <th class="py-2.5 px-3">Volume Ingested</th>
            <th class="py-2.5 px-3">Status</th>
            <th class="py-2.5 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each categories as cat}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-semibold text-zinc-900">{cat.id}</td>
              <td class="py-3 px-3">
                <div class="font-sans font-semibold text-xs text-zinc-900">{cat.name}</div>
                <div class="text-[10px] text-zinc-400 font-sans mt-0.5">{cat.examples}</div>
              </td>
              <td class="py-3 px-3">
                <input
                  type="number"
                  bind:value={cat.points}
                  class="w-16 px-2 py-0.5 border border-zinc-200 rounded font-bold text-zinc-900 focus:outline-none focus:border-zinc-900"
                /> pts
              </td>
              <td class="py-3 px-3">
                <input
                  type="number"
                  bind:value={cat.cap}
                  class="w-16 px-2 py-0.5 border border-zinc-200 rounded text-zinc-700 focus:outline-none focus:border-zinc-900"
                /> items
              </td>
              <td class="py-3 px-3 text-zinc-700">
                {cat.co2OffsetKg} kg CO2e
              </td>
              <td class="py-3 px-3 text-zinc-500 font-sans">
                {cat.submissionsCount}
              </td>
              <td class="py-3 px-3 font-sans">
                <label class="inline-flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" bind:checked={cat.active} class="rounded border-zinc-300 accent-zinc-900" />
                  <span class="text-[11px] {cat.active ? 'text-emerald-700 font-medium' : 'text-zinc-400'}">
                    {cat.active ? 'Active' : 'Disabled'}
                  </span>
                </label>
              </td>
              <td class="py-3 px-3 text-right font-sans">
                <div class="flex items-center justify-end gap-1.5">
                  <Button
                    onclick={() => toast(`Updated configuration for ${cat.name}`)}
                    variant="outline"
                    size="sm"
                    class="text-[11px] h-6 px-2 border-zinc-200"
                  >
                    Save
                  </Button>
                  <Button
                    onclick={() => handleDeleteCategory(cat.id, cat.name)}
                    variant="outline"
                    size="sm"
                    class="text-[11px] h-6 px-2 border-zinc-200 text-rose-700 hover:bg-rose-50"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
