<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { File01Icon, Search01Icon } from '@hugeicons/core-free-icons';

  const submissions = [
    { id: 'SUB-18492', user: 'Vikram Patel', category: 'Plastic (PET)', conf: '96.4%', pts: 50, status: 'Auto-Approved', time: '4m ago' },
    { id: 'SUB-18491', user: 'Ananya Roy', category: 'E-Waste (Li-Ion)', conf: '91.2%', pts: 150, status: 'Auto-Approved', time: '11m ago' },
    { id: 'SUB-18490', user: 'Rahul Verma', category: 'Plastic (PET)', conf: '64.8%', pts: 0, status: 'Needs Review', time: '18m ago' },
    { id: 'SUB-18489', user: 'Pooja Iyer', category: 'Metal (Aluminium)', conf: '98.1%', pts: 80, status: 'Auto-Approved', time: '24m ago' },
    { id: 'SUB-18488', user: 'David D.', category: 'Glass Containers', conf: '88.5%', pts: 60, status: 'Auto-Approved', time: '32m ago' },
    { id: 'SUB-18485', user: 'Pooja Iyer', category: 'E-Waste (Li-Ion)', conf: '58.2%', pts: 0, status: 'Needs Review', time: '45m ago' }
  ];

  let search = $state('');
  const filtered = $derived(submissions.filter(s => s.user.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())));
</script>

<svelte:head>
  <title>All Submissions Catalog — T2T Reviewer</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">All Ingested Waste Submissions Catalog</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Comprehensive audit stream of all 18,740 citizen deposits across the platform.</p>
  </div>

  <div class="relative max-w-xs">
    <HugeIcon icon={Search01Icon} size={13} class="absolute left-2.5 top-2.5 text-zinc-400" />
    <input
      type="text"
      bind:value={search}
      placeholder="Search submission or citizen..."
      class="w-full pl-8 pr-3 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900 font-sans"
    />
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Capture Ref</th>
            <th class="py-2.5 px-3">Citizen</th>
            <th class="py-2.5 px-3">Classified Category</th>
            <th class="py-2.5 px-3">Vision Confidence</th>
            <th class="py-2.5 px-3">Points Minted</th>
            <th class="py-2.5 px-3">Status</th>
            <th class="py-2.5 px-3 text-right">Timestamp</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each filtered as s}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-semibold text-zinc-900">{s.id}</td>
              <td class="py-3 px-3 font-sans font-medium text-xs text-zinc-900">{s.user}</td>
              <td class="py-3 px-3 font-sans text-xs text-zinc-700">{s.category}</td>
              <td class="py-3 px-3 text-zinc-600">{s.conf}</td>
              <td class="py-3 px-3 font-bold text-zinc-900">+{s.pts} pts</td>
              <td class="py-3 px-3 font-sans">
                <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono {s.status === 'Auto-Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}">
                  {s.status}
                </span>
              </td>
              <td class="py-3 px-3 text-right text-zinc-400">{s.time}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
