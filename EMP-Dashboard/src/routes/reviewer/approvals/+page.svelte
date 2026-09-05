<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

  const approvals = [
    { id: 'SUB-18492', citizen: 'Vikram Patel', material: 'Plastic (PET)', conf: '96.4%', points: 50, approvedAt: '4m ago', bin: 'Bin #BLR-MG-04' },
    { id: 'SUB-18491', citizen: 'Ananya Roy', material: 'E-Waste (Li-Ion)', conf: '91.2%', points: 150, approvedAt: '11m ago', bin: 'Bin #BLR-WF-11' },
    { id: 'SUB-18489', citizen: 'Pooja Iyer', material: 'Metal (Aluminium)', conf: '98.1%', points: 80, approvedAt: '24m ago', bin: 'Bin #BLR-IN-02' },
    { id: 'SUB-18488', citizen: 'David D.', material: 'Glass Bottles', conf: '88.5%', points: 60, approvedAt: '32m ago', bin: 'Bin #BLR-KR-03' },
    { id: 'SUB-18484', citizen: 'Kiran P.', material: 'Paper & Cardboard', conf: '92.0%', points: 40, approvedAt: '55m ago', bin: 'Bin #BLR-MG-04' }
  ];
</script>

<svelte:head>
  <title>My Approvals History — T2T Reviewer</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Personal Approvals History</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Submissions verified and points disbursed by your reviewer workstation shift.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Submission ID</th>
            <th class="py-2.5 px-3">Citizen</th>
            <th class="py-2.5 px-3">Verified Material</th>
            <th class="py-2.5 px-3">AI Confidence</th>
            <th class="py-2.5 px-3">Points Awarded</th>
            <th class="py-2.5 px-3">Deposit Bin</th>
            <th class="py-2.5 px-3 text-right">Time Approved</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each approvals as app}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-semibold text-zinc-900">{app.id}</td>
              <td class="py-3 px-3 font-sans font-medium text-xs text-zinc-900">{app.citizen}</td>
              <td class="py-3 px-3 font-sans text-xs text-zinc-700">{app.material}</td>
              <td class="py-3 px-3 text-zinc-600">{app.conf}</td>
              <td class="py-3 px-3 font-bold text-zinc-900">+{app.points} pts</td>
              <td class="py-3 px-3 text-zinc-500">{app.bin}</td>
              <td class="py-3 px-3 text-right text-zinc-400">{app.approvedAt}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
