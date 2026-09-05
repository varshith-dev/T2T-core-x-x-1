<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { File01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

  const settlementReports = [
    { month: 'August 2026', totalClaims: 1420, grossValue: '₹142,000', partnerInvoices: '₹131,350', platformCommission: '₹10,650', status: 'Settled', invoiceId: 'INV-2026-08' },
    { month: 'July 2026', totalClaims: 1290, grossValue: '₹129,000', partnerInvoices: '₹119,325', platformCommission: '₹9,675', status: 'Settled', invoiceId: 'INV-2026-07' },
    { month: 'June 2026', totalClaims: 1110, grossValue: '₹111,000', partnerInvoices: '₹102,675', platformCommission: '₹8,325', status: 'Settled', invoiceId: 'INV-2026-06' },
    { month: 'May 2026', totalClaims: 980, grossValue: '₹98,000', partnerInvoices: '₹90,650', platformCommission: '₹7,350', status: 'Settled', invoiceId: 'INV-2026-05' }
  ];

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }
</script>

<svelte:head>
  <title>Settlement Audit Reports — T2T Rewards</title>
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
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Monthly Partner Settlement Audit</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Immutable settlement ledger across merchant partners, gross face value claimed, platform commission, and disbursement tax invoices.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Billing Cycle</th>
            <th class="py-2.5 px-3">Invoice Ref</th>
            <th class="py-2.5 px-3">Total Claims</th>
            <th class="py-2.5 px-3">Gross Voucher Value</th>
            <th class="py-2.5 px-3">Net Merchant Payout</th>
            <th class="py-2.5 px-3">Platform Retained</th>
            <th class="py-2.5 px-3">Status</th>
            <th class="py-2.5 px-3 text-right">Audit Pack</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each settlementReports as rep}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-semibold text-zinc-900 font-sans">{rep.month}</td>
              <td class="py-3 px-3 text-zinc-500">{rep.invoiceId}</td>
              <td class="py-3 px-3 text-zinc-700">{rep.totalClaims}</td>
              <td class="py-3 px-3 font-bold text-zinc-900">{rep.grossValue}</td>
              <td class="py-3 px-3 text-zinc-700">{rep.partnerInvoices}</td>
              <td class="py-3 px-3 text-emerald-700 font-semibold">{rep.platformCommission}</td>
              <td class="py-3 px-3 font-sans">
                <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                  {rep.status}
                </span>
              </td>
              <td class="py-3 px-3 text-right font-sans">
                <Button onclick={() => toast(`Downloading settlement CSV for ${rep.month}`)} variant="outline" size="sm" class="text-[11px] h-6 px-2.5 border-zinc-200">
                  Export CSV
                </Button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
