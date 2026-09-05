<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { CancelCircleIcon } from '@hugeicons/core-free-icons';

  const rejections = [
    { id: 'SUB-18479', citizen: 'Karthik Rao', reason: 'Perceptual hash duplicate match', detected: 'PET Bottle clone', rejectedAt: '40m ago' },
    { id: 'SUB-18462', citizen: 'Sunil M.', reason: 'Non-waste pet photo upload', detected: 'Cat (Felis catus)', rejectedAt: '1h 15m ago' },
    { id: 'SUB-18450', citizen: 'Rohan M.', reason: 'Blown out overexposed capture with zero contrast', detected: 'Indeterminate', rejectedAt: '2h 10m ago' }
  ];
</script>

<svelte:head>
  <title>My Rejections Archive — T2T Reviewer</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Personal Rejections Archive</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Captures rejected during your shifts with regulatory audit reasons.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Submission ID</th>
            <th class="py-2.5 px-3">Citizen</th>
            <th class="py-2.5 px-3">Rejection Justification</th>
            <th class="py-2.5 px-3">Detected Anomaly</th>
            <th class="py-2.5 px-3 text-right">Timestamp</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each rejections as r}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-semibold text-zinc-900">{r.id}</td>
              <td class="py-3 px-3 font-sans font-medium text-xs text-zinc-900">{r.citizen}</td>
              <td class="py-3 px-3 font-sans text-xs text-rose-700">{r.reason}</td>
              <td class="py-3 px-3 text-zinc-600">{r.detected}</td>
              <td class="py-3 px-3 text-right text-zinc-400">{r.rejectedAt}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
