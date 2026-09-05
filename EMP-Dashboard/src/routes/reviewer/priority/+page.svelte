<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { ShieldAlertIcon } from '@hugeicons/core-free-icons';

  let items = $state([
    { id: 'SUB-18485', citizen: 'Pooja Iyer', material: 'E-Waste (Li-Ion)', value: '150 pts', issue: 'High payout value payload requires double human QA', wait: '24m' },
    { id: 'SUB-18490', citizen: 'Rahul Verma', material: 'Plastic (PET)', value: '50 pts', issue: 'Active dispute appeal pending support desk SLA', wait: '12m' }
  ]);
</script>

<svelte:head>
  <title>Urgent Priority Queue — T2T Reviewer</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">High-Priority Verification Stream</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Urgent SLA submissions: high-value point payloads and disputed customer appeals.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Priority ID</th>
            <th class="py-2.5 px-3">Citizen</th>
            <th class="py-2.5 px-3">Material Claimed</th>
            <th class="py-2.5 px-3">Flag Reason</th>
            <th class="py-2.5 px-3">In Queue</th>
            <th class="py-2.5 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each items as it}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-semibold text-zinc-900">{it.id}</td>
              <td class="py-3 px-3 font-sans font-medium text-xs text-zinc-900">{it.citizen}</td>
              <td class="py-3 px-3 font-sans text-xs text-zinc-700">{it.material} ({it.value})</td>
              <td class="py-3 px-3 font-sans text-xs text-rose-700">{it.issue}</td>
              <td class="py-3 px-3 text-zinc-500">{it.wait}</td>
              <td class="py-3 px-3 text-right font-sans">
                <a href="/reviewer" class="inline-flex items-center text-[11px] h-6 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded font-medium">
                  Inspect in Canvas
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
