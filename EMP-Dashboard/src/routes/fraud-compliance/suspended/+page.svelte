<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { LockIcon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

  let suspendedUsers = $state([
    { id: 'USR-7601', name: 'Devendra K.', bannedAt: '2026-08-14', reason: 'Sybil script automation emitting 500 fake drops/hr', appealStatus: 'Rejected' },
    { id: 'USR-7588', name: 'Harish T.', bannedAt: '2026-08-20', reason: 'Forged retail barcode QR generation for coupon claims', appealStatus: 'Under Review' },
    { id: 'USR-7412', name: 'Sanjay V.', bannedAt: '2026-08-29', reason: 'Abusive language and repeated non-waste submission spam', appealStatus: 'None' }
  ]);

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleReinstate(id: string, name: string) {
    suspendedUsers = suspendedUsers.filter(u => u.id !== id);
    toast(`Citizen account ${name} reinstated with probationary status`);
  }
</script>

<svelte:head>
  <title>Suspended Accounts Registry — T2T Fraud & Compliance</title>
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
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Suspended Citizen Accounts Registry</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Accounts permanently or temporarily barred from point accumulation, smart-bin unlocks, and retail vouchers.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Citizen ID</th>
            <th class="py-2.5 px-3">Name</th>
            <th class="py-2.5 px-3">Suspension Date</th>
            <th class="py-2.5 px-3">Grounds for Suspension</th>
            <th class="py-2.5 px-3">Appeal Status</th>
            <th class="py-2.5 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each suspendedUsers as s}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-semibold text-zinc-900">{s.id}</td>
              <td class="py-3 px-3 font-sans text-xs text-zinc-900">{s.name}</td>
              <td class="py-3 px-3 text-zinc-500">{s.bannedAt}</td>
              <td class="py-3 px-3 font-sans text-xs text-zinc-600 max-w-xs">{s.reason}</td>
              <td class="py-3 px-3 font-sans">
                <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] bg-zinc-100 text-zinc-700 border border-zinc-200 font-mono">
                  {s.appealStatus}
                </span>
              </td>
              <td class="py-3 px-3 text-right font-sans">
                <Button onclick={() => handleReinstate(s.id, s.name)} variant="outline" size="sm" class="text-[11px] h-6 px-2.5 border-zinc-200">
                  Reinstate
                </Button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
