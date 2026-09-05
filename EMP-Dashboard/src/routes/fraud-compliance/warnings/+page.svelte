<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { Alert01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

  let warnings = $state([
    { id: 'WRN-402', citizen: 'Kiran S.', issue: 'Repeated blurry photos near 50% confidence margin', bin: '#BLR-IN-02', time: '18m ago' },
    { id: 'WRN-401', citizen: 'Rohan M.', issue: 'Bin distance mismatch: 420m away from nearest smart bin', bin: '#BLR-WF-11', time: '45m ago' },
    { id: 'WRN-400', citizen: 'Anita B.', issue: 'Rapid category flipping (Plastic -> Metal -> E-Waste in 3m)', bin: '#BLR-MG-08', time: '1h 10m ago' },
    { id: 'WRN-399', citizen: 'Gaurav K.', issue: 'Low light underexposed submission retry 5x', bin: '#BLR-KR-03', time: '2h 15m ago' }
  ]);

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleDismiss(id: string) {
    warnings = warnings.filter(w => w.id !== id);
    toast(`Dismissed warning ${id}`);
  }
</script>

<svelte:head>
  <title>Warnings Desk — T2T Fraud & Compliance</title>
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
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Moderate Warnings & Anomaly Desk</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Secondary suspicion triggers: blurry captures, geo-drifts under 500m, rapid category switches, and repeated re-submissions.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="divide-y divide-zinc-100 font-mono text-xs">
      {#each warnings as w}
        <div class="py-3 flex items-center justify-between text-[11px]">
          <div class="flex items-center gap-3">
            <span class="font-bold text-zinc-900">{w.id}</span>
            <span class="font-sans font-medium text-zinc-900">{w.citizen}</span>
            <span class="font-sans text-zinc-600">{w.issue}</span>
            <span class="text-zinc-400">{w.bin}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-zinc-400">{w.time}</span>
            <Button onclick={() => handleDismiss(w.id)} variant="outline" size="sm" class="text-[11px] h-6 px-2 border-zinc-200">
              Acknowledge
            </Button>
            <Button onclick={() => { handleDismiss(w.id); toast(`Escalated ${w.citizen} to Watchlist`); }} size="sm" class="text-[11px] h-6 px-2 bg-zinc-900 text-white hover:bg-zinc-800">
              Escalate
            </Button>
          </div>
        </div>
      {/each}
    </div>
  </Card>
</div>
