<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { UserBlock01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

  let highRiskUsers = $state([
    { id: 'USR-8889', name: 'Karthik Rao', risk: 94, flags: 7, points: 0, status: 'Frozen', reason: '7 duplicate pHash uploads across sybil accounts' },
    { id: 'USR-8910', name: 'Alok Shenoy', risk: 82, flags: 4, points: 120, status: 'Investigating', reason: 'Android mock-location GPS spoofing' },
    { id: 'USR-8722', name: 'Sunil M.', risk: 68, flags: 3, points: 340, status: 'Warning', reason: 'Repeated non-waste pet submissions' },
    { id: 'USR-8651', name: 'Naveen B.', risk: 65, flags: 3, points: 410, status: 'Warning', reason: 'Co-conspirator in pHash cluster 901' },
    { id: 'USR-8419', name: 'Ritesh G.', risk: 61, flags: 2, points: 190, status: 'Watchlist', reason: 'Rotated duplicate uploads' }
  ]);

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleToggleFreeze(u: any) {
    if (u.status === 'Frozen') {
      u.status = 'Warning';
      toast(`Citizen ${u.name} un-frozen and returned to Warning`);
    } else {
      u.status = 'Frozen';
      toast(`Citizen ${u.name} frozen. Wallet and voucher access revoked.`);
    }
  }
</script>

<svelte:head>
  <title>High-Risk Citizens Watchlist — T2T Fraud & Compliance</title>
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
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">High-Risk Citizen Watchlist</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Citizens with risk index &gt; 60 due to duplicate clusters, mock location tampering, or suspicious submission bursts.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Citizen ID</th>
            <th class="py-2.5 px-3">Name</th>
            <th class="py-2.5 px-3">Risk Score</th>
            <th class="py-2.5 px-3">Flags</th>
            <th class="py-2.5 px-3">Primary Ground</th>
            <th class="py-2.5 px-3">Status</th>
            <th class="py-2.5 px-3 text-right">Enforcement</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each highRiskUsers as u}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-semibold text-zinc-900">{u.id}</td>
              <td class="py-3 px-3 font-sans font-medium text-xs text-zinc-900">{u.name}</td>
              <td class="py-3 px-3 font-bold text-zinc-900">{u.risk}/100</td>
              <td class="py-3 px-3 text-zinc-700">{u.flags}</td>
              <td class="py-3 px-3 font-sans text-xs text-zinc-600 max-w-xs">{u.reason}</td>
              <td class="py-3 px-3 font-sans">
                <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono {u.status === 'Frozen' ? 'bg-rose-50 text-rose-800 border border-rose-200 font-bold' : u.status === 'Investigating' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'}">
                  {u.status}
                </span>
              </td>
              <td class="py-3 px-3 text-right font-sans">
                <Button
                  onclick={() => handleToggleFreeze(u)}
                  variant="outline"
                  size="sm"
                  class="text-[11px] h-6 px-2.5 border-zinc-200 {u.status === 'Frozen' ? 'text-emerald-700' : 'text-zinc-800'}"
                >
                  {u.status === 'Frozen' ? 'Unfreeze' : 'Freeze'}
                </Button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
