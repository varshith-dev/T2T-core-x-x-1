<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    AnalyticsUpIcon,
    Clock01Icon,
    Calendar01Icon
  } from '@hugeicons/core-free-icons';

  const peakHours = [
    { hour: '06:00 - 09:00', label: 'Morning Commute', submissions: '3,120', pct: 16.6 },
    { hour: '09:00 - 12:00', label: 'Mid-Morning', submissions: '2,480', pct: 13.2 },
    { hour: '12:00 - 15:00', label: 'Afternoon Lunch Drop', submissions: '3,840', pct: 20.5 },
    { hour: '15:00 - 18:00', label: 'Late Afternoon', submissions: '2,910', pct: 15.5 },
    { hour: '18:00 - 21:00', label: 'Evening Peak (Rush)', submissions: '5,140', pct: 27.4 },
    { hour: '21:00 - 00:00', label: 'Night Deposits', submissions: '1,250', pct: 6.8 }
  ];
</script>

<svelte:head>
  <title>Submission Velocity & Peaks — T2T Analytics</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold tracking-tight text-zinc-900">Submission Velocity & Time-Series Trends</h1>
      <p class="text-xs text-zinc-500 mt-0.5">Peak hour patterns, weekday versus weekend surges, and regional smart-bin intake velocities.</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
    <Card class="bg-white border-zinc-200 p-4 shadow-none">
      <div class="text-[10px] uppercase font-semibold text-zinc-400 font-mono">Busiest Window</div>
      <div class="text-xl font-bold text-zinc-900 mt-1 font-mono">18:00 – 21:00</div>
      <div class="text-xs text-zinc-500 mt-0.5">27.4% of total daily volume</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-4 shadow-none">
      <div class="text-[10px] uppercase font-semibold text-zinc-400 font-mono">Weekend Ratio</div>
      <div class="text-xl font-bold text-zinc-900 mt-1 font-mono">+38.2% Surge</div>
      <div class="text-xs text-zinc-500 mt-0.5">Saturday/Sunday consumer cleanup</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-4 shadow-none">
      <div class="text-[10px] uppercase font-semibold text-zinc-400 font-mono">P95 Verification Latency</div>
      <div class="text-xl font-bold text-zinc-900 mt-1 font-mono">18.2 ms</div>
      <div class="text-xs text-zinc-500 mt-0.5">Triton GPU TensorRT pipeline</div>
    </Card>
  </div>

  <Card class="bg-white border-zinc-200 p-5 shadow-none space-y-4">
    <div class="text-xs font-bold text-zinc-900">Intra-Day Time Distribution Breakdown</div>
    <div class="space-y-3">
      {#each peakHours as ph}
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span class="font-medium text-zinc-900 font-sans">{ph.hour} · <span class="text-zinc-500">{ph.label}</span></span>
            <span class="font-mono text-zinc-700 font-bold">{ph.submissions} drops ({ph.pct}%)</span>
          </div>
          <div class="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200">
            <div class="bg-zinc-900 h-full" style="width: {ph.pct * 3.5}%"></div>
          </div>
        </div>
      {/each}
    </div>
  </Card>
</div>
