<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { UserGroupIcon, Search01Icon } from '@hugeicons/core-free-icons';

  const users = [
    { id: 'USR-8199', name: 'Arjun Das', city: 'Bengaluru', tier: 'Tier 1 Recycler', points: '4,820 pts', drops: 64, accuracy: '98.4%', activeSince: 'Apr 2026' },
    { id: 'USR-8412', name: 'Simran Kaur', city: 'Bengaluru', tier: 'Tier 1 Recycler', points: '3,950 pts', drops: 52, accuracy: '96.2%', activeSince: 'May 2026' },
    { id: 'USR-7911', name: 'Vikram Mehta', city: 'Bengaluru', tier: 'Tier 2 Recycler', points: '3,410 pts', drops: 48, accuracy: '94.8%', activeSince: 'Mar 2026' },
    { id: 'USR-8911', name: 'Divya K.', city: 'Mysuru', tier: 'Tier 2 Recycler', points: '2,890 pts', drops: 39, accuracy: '92.1%', activeSince: 'Jun 2026' },
    { id: 'USR-8650', name: 'Kiran P.', city: 'Bengaluru', tier: 'Tier 3 Recycler', points: '2,340 pts', drops: 31, accuracy: '91.0%', activeSince: 'Feb 2026' }
  ];

  let search = $state('');
  const filtered = $derived(users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase())));
</script>

<svelte:head>
  <title>User Engagement Directory — T2T Analytics</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Citizen Recycler Engagement Directory</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Cohort telemetry, individual submission precision, and point accumulation velocity.</p>
  </div>

  <div class="relative max-w-xs">
    <HugeIcon icon={Search01Icon} size={13} class="absolute left-2.5 top-2.5 text-zinc-400" />
    <input
      type="text"
      bind:value={search}
      placeholder="Search citizen..."
      class="w-full pl-8 pr-3 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900 font-sans"
    />
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Citizen ID</th>
            <th class="py-2.5 px-3">Name</th>
            <th class="py-2.5 px-3">City</th>
            <th class="py-2.5 px-3">Loyalty Tier</th>
            <th class="py-2.5 px-3">Total Verified Drops</th>
            <th class="py-2.5 px-3">Clean Drop Rate</th>
            <th class="py-2.5 px-3 text-right">Lifetime Balance</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each filtered as u}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-semibold text-zinc-900">{u.id}</td>
              <td class="py-3 px-3 font-sans font-medium text-xs text-zinc-900">{u.name}</td>
              <td class="py-3 px-3 text-zinc-500 font-sans">{u.city}</td>
              <td class="py-3 px-3 text-zinc-700 font-sans">{u.tier}</td>
              <td class="py-3 px-3 text-zinc-700">{u.drops}</td>
              <td class="py-3 px-3 text-emerald-700 font-semibold">{u.accuracy}</td>
              <td class="py-3 px-3 text-right font-bold text-zinc-900">{u.points}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
