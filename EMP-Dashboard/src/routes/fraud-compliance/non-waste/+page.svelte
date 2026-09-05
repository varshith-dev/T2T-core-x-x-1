<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { Shield01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

  let nonWasteRejections = $state([
    { id: 'NW-551', citizen: 'Sunil M.', objectDetected: 'Domestic Cat (Felis catus)', conf: '98.4%', rewardBlocked: 50, time: '1h 12m ago' },
    { id: 'NW-550', citizen: 'Tanvi P.', objectDetected: 'Human Hand / Selfie', conf: '99.1%', rewardBlocked: 50, time: '2h 20m ago' },
    { id: 'NW-549', citizen: 'Ramesh K.', objectDetected: 'Automobile Steering Wheel', conf: '94.7%', rewardBlocked: 40, time: '3h 05m ago' },
    { id: 'NW-548', citizen: 'Aditya S.', objectDetected: 'Footwear / Running Shoe', conf: '96.2%', rewardBlocked: 50, time: '4h 18m ago' },
    { id: 'NW-547', citizen: 'Maya N.', objectDetected: 'Indoor Furniture (Sofa)', conf: '92.9%', rewardBlocked: 60, time: '5h 40m ago' }
  ]);

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }
</script>

<svelte:head>
  <title>Non-Waste Gating Audit — T2T Fraud & Compliance</title>
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
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Non-Waste Gating Audit</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Submissions intercepted by the YOLOv8 vision filter for objects outside the recyclables taxonomy (pets, furniture, hands, selfies).</p>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Gate ID</th>
            <th class="py-2.5 px-3">Citizen</th>
            <th class="py-2.5 px-3">Object Detected</th>
            <th class="py-2.5 px-3">Confidence</th>
            <th class="py-2.5 px-3">Points Blocked</th>
            <th class="py-2.5 px-3">Time</th>
            <th class="py-2.5 px-3 text-right">Audit Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each nonWasteRejections as nw}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-semibold text-zinc-900">{nw.id}</td>
              <td class="py-3 px-3 font-sans text-xs text-zinc-900">{nw.citizen}</td>
              <td class="py-3 px-3 font-sans text-xs text-rose-700 font-medium">{nw.objectDetected}</td>
              <td class="py-3 px-3 font-bold text-zinc-900">{nw.conf}</td>
              <td class="py-3 px-3 text-zinc-700">+{nw.rewardBlocked} pts blocked</td>
              <td class="py-3 px-3 text-zinc-400">{nw.time}</td>
              <td class="py-3 px-3 text-right font-sans">
                <Button onclick={() => toast(`Audit confirmed for ${nw.id} - ${nw.objectDetected}`)} variant="outline" size="sm" class="text-[11px] h-6 px-2.5 border-zinc-200">
                  Confirm Gate
                </Button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
