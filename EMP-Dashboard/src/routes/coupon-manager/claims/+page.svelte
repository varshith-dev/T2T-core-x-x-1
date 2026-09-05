<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { Clock01Icon, CheckmarkCircle01Icon, CancelCircleIcon } from '@hugeicons/core-free-icons';

  interface Claim {
    id: string;
    citizen: string;
    citizenId: string;
    voucher: string;
    pointsDeducted: number;
    time: string;
    status: 'Pending' | 'Dispatched' | 'Rejected';
    codeGenerated?: string;
  }

  let pendingClaims = $state<Claim[]>([
    { id: 'CLM-9012', citizen: 'Simran Kaur', citizenId: 'USR-8412', voucher: '₹250 Amazon Card', pointsDeducted: 2500, time: '18m ago', status: 'Pending' },
    { id: 'CLM-9011', citizen: 'Arjun Das', citizenId: 'USR-8199', voucher: '₹100 Swiggy Voucher', pointsDeducted: 1000, time: '35m ago', status: 'Pending' },
    { id: 'CLM-9010', citizen: 'Vikram Mehta', citizenId: 'USR-7911', voucher: '15% Decathlon Off', pointsDeducted: 1200, time: '1h 05m ago', status: 'Pending' },
    { id: 'CLM-9009', citizen: 'Meera S.', citizenId: 'USR-8820', voucher: '₹75 Uber Green', pointsDeducted: 750, time: '1h 40m ago', status: 'Pending' },
    { id: 'CLM-9008', citizen: 'Ananya Roy', citizenId: 'USR-9011', voucher: '₹300 BigBasket', pointsDeducted: 3000, time: '2h 10m ago', status: 'Pending' }
  ]);

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleDispatchCode(claimId: string) {
    const claim = pendingClaims.find(c => c.id === claimId);
    if (claim) {
      const code = `T2T-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      claim.status = 'Dispatched';
      claim.codeGenerated = code;
      toast(`Dispatched code [${code}] to ${claim.citizen} via SMS/Email.`);
    }
  }

  function handleRejectClaim(claimId: string) {
    const claim = pendingClaims.find(c => c.id === claimId);
    if (claim) {
      claim.status = 'Rejected';
      toast(`Rejected claim ${claimId}. Refunded +${claim.pointsDeducted} pts to citizen.`);
    }
  }
</script>

<svelte:head>
  <title>Pending Claims Adjudication — T2T Rewards</title>
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
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Citizen Claims Adjudication Desk</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Audit citizen points debits, verify eligibility against fraud rules, and dispatch digital gift card redemption codes.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Claim ID</th>
            <th class="py-2.5 px-3">Citizen</th>
            <th class="py-2.5 px-3">Voucher Requested</th>
            <th class="py-2.5 px-3">Points Debited</th>
            <th class="py-2.5 px-3">Status</th>
            <th class="py-2.5 px-3">Timestamp</th>
            <th class="py-2.5 px-3 text-right">Verification Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each pendingClaims as claim}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-semibold text-zinc-900">{claim.id}</td>
              <td class="py-3 px-3">
                <div class="font-sans font-medium text-xs text-zinc-900">{claim.citizen}</div>
                <div class="text-[10px] text-zinc-400 font-mono">{claim.citizenId}</div>
              </td>
              <td class="py-3 px-3 font-sans text-xs text-zinc-700">{claim.voucher}</td>
              <td class="py-3 px-3 font-bold text-zinc-900">{claim.pointsDeducted} pts</td>
              <td class="py-3 px-3 font-sans">
                {#if claim.status === 'Dispatched'}
                  <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                    Dispatched: {claim.codeGenerated}
                  </span>
                {:else if claim.status === 'Rejected'}
                  <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-rose-50 text-rose-800 border border-rose-200 font-mono">
                    Refunded
                  </span>
                {:else}
                  <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                    Pending Audit
                  </span>
                {/if}
              </td>
              <td class="py-3 px-3 text-zinc-400">{claim.time}</td>
              <td class="py-3 px-3 text-right font-sans">
                {#if claim.status === 'Pending'}
                  <div class="flex items-center justify-end gap-1.5">
                    <Button onclick={() => handleRejectClaim(claim.id)} variant="outline" size="sm" class="text-[11px] h-6 px-2 border-zinc-200 text-zinc-600">
                      Reject
                    </Button>
                    <Button onclick={() => handleDispatchCode(claim.id)} size="sm" class="text-[11px] h-6 px-2 bg-zinc-900 hover:bg-zinc-800 text-white">
                      Dispatch Code
                    </Button>
                  </div>
                {:else}
                  <span class="text-zinc-400 font-mono text-[10px]">Processed</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
