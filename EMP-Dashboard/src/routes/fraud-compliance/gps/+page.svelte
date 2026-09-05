<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { Activity01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

  const gpsAnomalies = [
    { site: 'MG Road Metro Bin #04', latLng: '12.9756° N, 77.6066° E', flaggedUsers: 3, spoofMethod: 'Mock Provider API (Android Debug)', risk: 'Critical' },
    { site: 'Indiranagar 100ft Bin #02', latLng: '12.9784° N, 77.6408° E', flaggedUsers: 2, spoofMethod: 'Impossible Speed (480 km/h)', risk: 'High' },
    { site: 'Whitefield Tech Park Bin #11', latLng: '12.9698° N, 77.7499° E', flaggedUsers: 1, spoofMethod: 'Foreign IP with Local GPS', risk: 'Medium' },
    { site: 'Koramangala 5th Block Bin #03', latLng: '12.9352° N, 77.6245° E', flaggedUsers: 1, spoofMethod: 'Repeated Coordinate Clamping (0.000, 0.000)', risk: 'High' }
  ];

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }
</script>

<svelte:head>
  <title>Location Clusters & GPS Spoofing — T2T Fraud & Compliance</title>
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
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Location Clusters & Geofence Spoofing</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Physical smart-bin coordinates cross-referenced with citizen device GPS telemetry and carrier cell towers.</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each gpsAnomalies as g}
      <Card class="bg-white border-zinc-200 p-4 shadow-none space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-zinc-900 font-sans">{g.site}</span>
          <span class="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold {g.risk === 'Critical' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}">
            {g.risk}
          </span>
        </div>
        <div class="text-[11px] font-mono text-zinc-500">{g.latLng}</div>
        <div class="p-2.5 rounded bg-zinc-50 border border-zinc-200 text-xs space-y-1 font-sans">
          <div class="text-zinc-700"><strong>Spoof Vector:</strong> {g.spoofMethod}</div>
          <div class="text-zinc-500 font-mono text-[11px]">{g.flaggedUsers} citizens flagged at this location</div>
        </div>
        <div class="pt-2 flex items-center justify-end">
          <Button onclick={() => toast(`Reinforced GPS geofence boundary around ${g.site}`)} variant="outline" size="sm" class="text-xs h-7 border-zinc-200">
            Reinforce Geofence
          </Button>
        </div>
      </Card>
    {/each}
  </div>
</div>
