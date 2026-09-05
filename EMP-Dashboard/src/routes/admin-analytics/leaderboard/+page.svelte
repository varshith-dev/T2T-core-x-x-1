<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { Award01Icon } from '@hugeicons/core-free-icons';

  const topEarners = [
    { rank: '01', name: 'Arjun T.', points: '4,820 pts', submissions: 64, tier: 'Tier 1 Recycler', co2Saved: '48.2 kg' },
    { rank: '02', name: 'Meera S.', points: '3,950 pts', submissions: 52, tier: 'Tier 1 Recycler', co2Saved: '39.5 kg' },
    { rank: '03', name: 'Suresh R.', points: '3,410 pts', submissions: 48, tier: 'Tier 2 Recycler', co2Saved: '34.1 kg' },
    { rank: '04', name: 'Divya K.', points: '2,890 pts', submissions: 39, tier: 'Tier 2 Recycler', co2Saved: '28.9 kg' },
    { rank: '05', name: 'Kiran P.', points: '2,340 pts', submissions: 31, tier: 'Tier 3 Recycler', co2Saved: '23.4 kg' },
    { rank: '06', name: 'Rahul V.', points: '2,110 pts', submissions: 28, tier: 'Tier 3 Recycler', co2Saved: '21.1 kg' },
    { rank: '07', name: 'Pooja I.', points: '1,980 pts', submissions: 24, tier: 'Active Recycler', co2Saved: '19.8 kg' },
    { rank: '08', name: 'Simran K.', points: '1,840 pts', submissions: 22, tier: 'Active Recycler', co2Saved: '18.4 kg' }
  ];
</script>

<svelte:head>
  <title>Top Recyclers Leaderboard — T2T Analytics</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Top Citizen Recyclers Leaderboard</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Top contributors sorted by verified recyclables deposits, point honors, and environmental impact.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Rank</th>
            <th class="py-2.5 px-3">Citizen Name</th>
            <th class="py-2.5 px-3">Tier</th>
            <th class="py-2.5 px-3">Verified Drops</th>
            <th class="py-2.5 px-3">CO2 Abated</th>
            <th class="py-2.5 px-3 text-right">Points Earned</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each topEarners as e}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-bold text-zinc-900 font-mono">{e.rank}</td>
              <td class="py-3 px-3 font-sans font-semibold text-xs text-zinc-900">{e.name}</td>
              <td class="py-3 px-3 font-sans text-zinc-600">{e.tier}</td>
              <td class="py-3 px-3 text-zinc-700">{e.submissions} drops</td>
              <td class="py-3 px-3 text-emerald-700 font-medium">{e.co2Saved}</td>
              <td class="py-3 px-3 text-right font-bold text-zinc-900">{e.points}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
