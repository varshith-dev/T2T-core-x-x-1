<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    ShieldAlertIcon,
    Camera01Icon,
    Shield01Icon,
    UserBlock01Icon,
    CheckmarkCircle01Icon
  } from '@hugeicons/core-free-icons';

  let alerts = $state([
    {
      id: 'SEC-7712',
      type: 'Perceptual Hash Duplicate',
      risk: 'CRITICAL',
      score: 94,
      user: 'Karthik Rao (USR-8889)',
      details: 'Identical photo uploaded 7 times across 3 different accounts within 12 minutes.',
      hash: 'pHash: 8f3a1c9e02b4d7e1',
      time: '14m ago'
    },
    {
      id: 'SEC-7711',
      type: 'GPS Geofence Spoofing',
      risk: 'HIGH',
      score: 82,
      user: 'Anonymous (USR-8910)',
      details: 'Mock location mock-provider detected. Reported velocity: 480 km/h between drop-bins.',
      hash: 'Bin: #BLR-MG-04',
      time: '38m ago'
    },
    {
      id: 'SEC-7709',
      type: 'Non-Waste Object Rejection',
      risk: 'MEDIUM',
      score: 68,
      user: 'Sunil M. (USR-8722)',
      details: 'Citizen uploaded pet animal photograph to trigger automated 50 point payout.',
      hash: 'Vision Conf: 98.2% Cat',
      time: '1h 12m ago'
    },
    {
      id: 'SEC-7705',
      type: 'Velocity Burst Attack',
      risk: 'HIGH',
      score: 88,
      user: 'Pooja V. (USR-8109)',
      details: '42 photo submissions submitted within 90 seconds from same IP proxy subnet.',
      hash: 'IP: 185.220.101.4',
      time: '2h 05m ago'
    }
  ]);

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleResolve(id: string) {
    alerts = alerts.filter(a => a.id !== id);
    toast(`Resolved security alert ${id}`);
  }

  function handleFreeze(user: string) {
    toast(`Wallet frozen and redemptions blocked for ${user}`);
  }
</script>

<svelte:head>
  <title>Active Threat Alerts — T2T Fraud & Compliance</title>
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
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Active Threat Incidents Stream</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Real-time duplicate image hashing, GPS geofence spoofing prevention, non-waste gating, and account enforcement.</p>
  </div>

  <div class="grid grid-cols-4 gap-3">
    <Card class="bg-white border-zinc-200 p-3 shadow-none">
      <div class="flex items-center justify-between text-zinc-400">
        <HugeIcon icon={ShieldAlertIcon} size={14} />
        <span class="text-[10px] font-mono text-rose-700 font-semibold">Active</span>
      </div>
      <div class="text-xl font-bold text-zinc-900 mt-1 font-mono tracking-tight">{alerts.length}</div>
      <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Critical Incidents</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-3 shadow-none">
      <div class="flex items-center justify-between text-zinc-400">
        <HugeIcon icon={Camera01Icon} size={14} />
        <span class="text-[10px] font-mono text-zinc-500">pHash</span>
      </div>
      <div class="text-xl font-bold text-zinc-900 mt-1 font-mono tracking-tight">3</div>
      <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Duplicate Clusters</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-3 shadow-none">
      <div class="flex items-center justify-between text-zinc-400">
        <HugeIcon icon={Shield01Icon} size={14} />
        <span class="text-[10px] font-mono text-amber-700 font-semibold">Gated</span>
      </div>
      <div class="text-xl font-bold text-zinc-900 mt-1 font-mono tracking-tight">5</div>
      <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Non-Waste Objects</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-3 shadow-none">
      <div class="flex items-center justify-between text-zinc-400">
        <HugeIcon icon={UserBlock01Icon} size={14} />
        <span class="text-[10px] font-mono text-zinc-500">Watchlist</span>
      </div>
      <div class="text-xl font-bold text-zinc-900 mt-1 font-mono tracking-tight">5</div>
      <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">High-Risk Citizens</div>
    </Card>
  </div>

  <div class="space-y-3">
    <div class="text-xs font-semibold text-zinc-700 uppercase tracking-wider font-mono">Priority Incident Stream</div>

    {#each alerts as alert}
      <Card class="bg-white border-zinc-200 p-4 shadow-none">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-mono font-bold text-zinc-900 shrink-0">
              {alert.score}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-zinc-900 font-mono">{alert.id}</span>
                <span class="text-xs font-bold text-zinc-900">{alert.type}</span>
                <span class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border {alert.risk === 'CRITICAL' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-amber-50 text-amber-800 border-amber-200'}">
                  {alert.risk}
                </span>
              </div>
              <div class="text-xs text-zinc-600 mt-1">{alert.details}</div>
              <div class="flex items-center gap-3 mt-2 text-[11px] font-mono text-zinc-500">
                <span>Citizen: {alert.user}</span>
                <span>·</span>
                <span class="text-zinc-700">{alert.hash}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <span class="text-[10px] font-mono text-zinc-400 mr-2">{alert.time}</span>
            <Button onclick={() => handleResolve(alert.id)} variant="outline" size="sm" class="text-xs h-7 px-2 border-zinc-200">
              Resolve
            </Button>
            <Button onclick={() => handleFreeze(alert.user)} size="sm" class="text-xs h-7 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-white">
              Freeze Payout
            </Button>
          </div>
        </div>
      </Card>
    {/each}
  </div>
</div>
