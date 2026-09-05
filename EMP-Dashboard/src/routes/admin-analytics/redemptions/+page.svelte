<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    Ticket01Icon,
    CheckmarkCircle01Icon,
    CancelCircleIcon
  } from '@hugeicons/core-free-icons';

  let claims = $state([
    { id: 'CLM-9012', citizen: 'Simran Kaur', voucher: '₹250 Amazon Card', points: 2500, time: '18m ago', status: 'Pending' },
    { id: 'CLM-9011', citizen: 'Arjun Das', voucher: '₹100 Swiggy Voucher', points: 1000, time: '35m ago', status: 'Pending' },
    { id: 'CLM-9010', citizen: 'Vikram Mehta', voucher: '15% Decathlon Off', points: 1200, time: '1h ago', status: 'Pending' }
  ]);

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleApprove(id: string, citizen: string) {
    claims = claims.filter(c => c.id !== id);
    toast(`Approved voucher claim ${id} for ${citizen}`);
  }

  function handleReject(id: string, citizen: string) {
    claims = claims.filter(c => c.id !== id);
    toast(`Rejected voucher claim ${id} for ${citizen}`);
  }
</script>

<svelte:head>
  <title>Pending Claims & Redemptions — T2T Analytics</title>
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
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Voucher Redemptions Desk</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Approve citizen reward claim orders and dispatch digital voucher codes.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Claim Ref</th>
            <th class="py-2.5 px-3">Citizen</th>
            <th class="py-2.5 px-3">Reward Item</th>
            <th class="py-2.5 px-3">Points Debited</th>
            <th class="py-2.5 px-3">Requested Time</th>
            <th class="py-2.5 px-3 text-right">Adjudication</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each claims as c}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-semibold text-zinc-900">{c.id}</td>
              <td class="py-3 px-3 font-sans font-medium text-xs text-zinc-900">{c.citizen}</td>
              <td class="py-3 px-3 font-sans text-xs text-zinc-700">{c.voucher}</td>
              <td class="py-3 px-3 font-bold text-zinc-900">{c.points} pts</td>
              <td class="py-3 px-3 text-zinc-400">{c.time}</td>
              <td class="py-3 px-3 text-right font-sans">
                <div class="flex items-center justify-end gap-1.5">
                  <Button onclick={() => handleReject(c.id, c.citizen)} variant="outline" size="sm" class="text-[11px] h-6 px-2 border-zinc-200 text-zinc-600">
                    Reject
                  </Button>
                  <Button onclick={() => handleApprove(c.id, c.citizen)} size="sm" class="text-[11px] h-6 px-2 bg-zinc-900 hover:bg-zinc-800 text-white">
                    Approve & Dispatch
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
