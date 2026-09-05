<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    Analytics01Icon,
    Coins01Icon,
    Folder01Icon,
    UserGroupIcon,
    Award01Icon,
    Ticket01Icon,
    Package01Icon,
    CheckmarkCircle01Icon,
    ArrowUp01Icon
  } from '@hugeicons/core-free-icons';

  const topEarners = [
    { rank: '01', name: 'Arjun T.', points: '4,820 pts', submissions: 64, tier: 'Tier 1' },
    { rank: '02', name: 'Meera S.', points: '3,950 pts', submissions: 52, tier: 'Tier 1' },
    { rank: '03', name: 'Suresh R.', points: '3,410 pts', submissions: 48, tier: 'Tier 2' },
    { rank: '04', name: 'Divya K.', points: '2,890 pts', submissions: 39, tier: 'Tier 2' },
    { rank: '05', name: 'Kiran P.', points: '2,340 pts', submissions: 31, tier: 'Tier 3' }
  ];

  const recentSubmissions = [
    { id: 'SUB-18492', user: 'Vikram Patel', category: 'Plastic (PET)', confidence: 96.4, points: 50, status: 'Approved', time: '4m ago' },
    { id: 'SUB-18491', user: 'Ananya Roy', category: 'E-Waste (Li-Ion)', confidence: 91.2, points: 150, status: 'Approved', time: '11m ago' },
    { id: 'SUB-18490', user: 'Rahul Verma', category: 'Organic Waste', confidence: 64.8, points: 0, status: 'Needs Review', time: '18m ago' },
    { id: 'SUB-18489', user: 'Pooja Iyer', category: 'Metal (Aluminium)', confidence: 98.1, points: 80, status: 'Approved', time: '24m ago' },
    { id: 'SUB-18488', user: 'David D.', category: 'Glass Bottles', confidence: 88.5, points: 60, status: 'Approved', time: '32m ago' }
  ];

  const categories = [
    { name: 'Plastic (PET)', pct: 42, count: '7,860 items', tonnage: '3.92 tons', barColor: 'bg-zinc-900', accuracy: '94.8%' },
    { name: 'Paper & Cardboard', pct: 24, count: '4,490 items', tonnage: '2.84 tons', barColor: 'bg-zinc-700', accuracy: '91.2%' },
    { name: 'Glass Containers', pct: 16, count: '2,990 items', tonnage: '4.10 tons', barColor: 'bg-zinc-500', accuracy: '88.5%' },
    { name: 'Metal & Aluminium', pct: 12, count: '2,240 items', tonnage: '1.45 tons', barColor: 'bg-zinc-400', accuracy: '96.1%' },
    { name: 'E-Waste Batteries', pct: 6, count: '1,120 items', tonnage: '0.42 tons', barColor: 'bg-zinc-300', accuracy: '82.4%' }
  ];

  // 14-day daily submissions SVG coordinates
  const submissionsData = [1120, 1240, 1380, 1290, 1490, 1620, 1810, 1720, 1890, 2040, 2190, 1980, 2140, 2240];
  const chartW = 420;
  const chartH = 130;
  const maxSub = 2400;
  const minSub = 1000;
  const subPoints = submissionsData
    .map((d, i) => {
      const x = (i / (submissionsData.length - 1)) * chartW;
      const y = chartH - ((d - minSub) / (maxSub - minSub)) * (chartH - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  // Points economy SVG
  const mintedData = [18, 22, 26, 24, 30, 34, 38, 36, 42, 45, 48, 44, 47, 50];
  const burnedData = [8, 10, 12, 11, 15, 16, 19, 18, 21, 23, 24, 22, 24, 26];
  const maxPts = 55;
  const mintedPoints = mintedData
    .map((d, i) => {
      const x = (i / (mintedData.length - 1)) * chartW;
      const y = chartH - (d / maxPts) * (chartH - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');
  const burnedPoints = burnedData
    .map((d, i) => {
      const x = (i / (burnedData.length - 1)) * chartW;
      const y = chartH - (d / maxPts) * (chartH - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');
</script>

<svelte:head>
  <title>Analytics & Treasury Overview — T2T</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header Banner -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold tracking-tight text-zinc-900">Platform Analytics & Intelligence</h1>
      <p class="text-xs text-zinc-500 mt-0.5">Comprehensive telemetry covering 18,740 submissions, points burn velocity, material tonnage, and top recyclers.</p>
    </div>
    <div class="flex items-center gap-2">
      <a href="/admin-analytics/trends" class="inline-flex items-center text-xs h-8 px-3 rounded border border-zinc-200 bg-white hover:bg-zinc-50 font-medium text-zinc-800 transition-colors">
        Submission Trends →
      </a>
      <a href="/admin-analytics/economy" class="inline-flex items-center text-xs h-8 px-3 rounded bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-colors">
        Treasury Economy →
      </a>
    </div>
  </div>

  <!-- 7-Card KPI Strip -->
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
    <Card class="bg-white border-zinc-200 p-3 shadow-none">
      <div class="flex items-center justify-between text-zinc-400">
        <HugeIcon icon={Folder01Icon} size={14} />
        <span class="text-[10px] font-mono text-emerald-700 font-semibold">↑ 12%</span>
      </div>
      <div class="text-lg font-bold text-zinc-900 mt-1 font-mono tracking-tight">18,740</div>
      <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Submissions</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-3 shadow-none">
      <div class="flex items-center justify-between text-zinc-400">
        <HugeIcon icon={CheckmarkCircle01Icon} size={14} />
        <span class="text-[10px] font-mono text-emerald-700 font-semibold">17.1k</span>
      </div>
      <div class="text-lg font-bold text-zinc-900 mt-1 font-mono tracking-tight">91.4%</div>
      <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Approval Rate</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-3 shadow-none">
      <div class="flex items-center justify-between text-zinc-400">
        <HugeIcon icon={Coins01Icon} size={14} />
        <span class="text-[10px] font-mono text-zinc-500">Minted</span>
      </div>
      <div class="text-lg font-bold text-zinc-900 mt-1 font-mono tracking-tight">824,500</div>
      <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Points Issued</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-3 shadow-none">
      <div class="flex items-center justify-between text-zinc-400">
        <HugeIcon icon={Ticket01Icon} size={14} />
        <span class="text-[10px] font-mono text-zinc-500">Redeemed</span>
      </div>
      <div class="text-lg font-bold text-zinc-900 mt-1 font-mono tracking-tight">342,000</div>
      <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Points Spent</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-3 shadow-none">
      <div class="flex items-center justify-between text-zinc-400">
        <HugeIcon icon={UserGroupIcon} size={14} />
        <span class="text-[10px] font-mono text-emerald-700 font-semibold">+312</span>
      </div>
      <div class="text-lg font-bold text-zinc-900 mt-1 font-mono tracking-tight">2,413</div>
      <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Active Users</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-3 shadow-none">
      <div class="flex items-center justify-between text-zinc-400">
        <HugeIcon icon={Package01Icon} size={14} />
        <span class="text-[10px] font-mono text-zinc-500">5 Classes</span>
      </div>
      <div class="text-lg font-bold text-zinc-900 mt-1 font-mono tracking-tight">12.7 tons</div>
      <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Recycled Mass</div>
    </Card>

    <Card class="bg-white border-zinc-200 p-3 shadow-none">
      <div class="flex items-center justify-between text-zinc-400">
        <HugeIcon icon={Coins01Icon} size={14} />
        <span class="text-[10px] font-mono text-zinc-500">41.5%</span>
      </div>
      <div class="text-lg font-bold text-zinc-900 mt-1 font-mono tracking-tight">1.28M pts</div>
      <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Circulating Supply</div>
    </Card>
  </div>

  <!-- Dual SVG Line Charts Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <Card class="bg-white border-zinc-200 p-4 shadow-none">
      <div class="flex items-center justify-between mb-2">
        <div>
          <div class="text-xs font-bold text-zinc-900">Submission Velocity (14-Day Trailing)</div>
          <div class="text-[11px] text-zinc-500">Daily citizen camera captures verified by YOLOv8 vision pipeline</div>
        </div>
        <span class="text-xs font-mono font-bold text-zinc-900">2,240 peak</span>
      </div>
      <div class="h-32 w-full pt-2">
        <svg viewBox="0 0 {chartW} {chartH}" class="w-full h-full overflow-visible">
          <polyline fill="none" stroke="#18181b" stroke-width="2" stroke-linecap="round" points={subPoints} />
        </svg>
      </div>
      <div class="flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-100 pt-2 font-mono">
        <span>Aug 23</span>
        <span>Aug 27</span>
        <span>Aug 31</span>
        <span>Sep 04</span>
        <span>Today</span>
      </div>
    </Card>

    <Card class="bg-white border-zinc-200 p-4 shadow-none">
      <div class="flex items-center justify-between mb-2">
        <div>
          <div class="text-xs font-bold text-zinc-900">Points Treasury Inflow vs Outflow (14-Day)</div>
          <div class="text-[11px] text-zinc-500">Black: Points Minted (k pts) · Grey: Points Redeemed (k pts)</div>
        </div>
        <span class="text-xs font-mono font-bold text-zinc-900">Net: +482.5k pts</span>
      </div>
      <div class="h-32 w-full pt-2">
        <svg viewBox="0 0 {chartW} {chartH}" class="w-full h-full overflow-visible">
          <polyline fill="none" stroke="#18181b" stroke-width="2" stroke-linecap="round" points={mintedPoints} />
          <polyline fill="none" stroke="#a1a1aa" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 2" points={burnedPoints} />
        </svg>
      </div>
      <div class="flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-100 pt-2 font-mono">
        <span>Aug 23</span>
        <span>Aug 27</span>
        <span>Aug 31</span>
        <span>Sep 04</span>
        <span>Today</span>
      </div>
    </Card>
  </div>

  <!-- Thirds Grid: Categories, Status Breakdown, Leaderboard -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <Card class="bg-white border-zinc-200 p-4 shadow-none space-y-3">
      <div class="flex items-center justify-between">
        <div class="text-xs font-bold text-zinc-900">Category Share</div>
        <a href="/admin-analytics/categories" class="text-[10px] text-zinc-500 hover:text-zinc-900 font-mono">All →</a>
      </div>
      <div class="space-y-2">
        {#each categories as c}
          <div class="space-y-1">
            <div class="flex justify-between text-[11px]">
              <span class="font-medium text-zinc-800">{c.name}</span>
              <span class="font-mono text-zinc-500">{c.pct}% · {c.tonnage}</span>
            </div>
            <div class="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
              <div class="{c.barColor} h-full" style="width: {c.pct}%"></div>
            </div>
          </div>
        {/each}
      </div>
    </Card>

    <Card class="bg-white border-zinc-200 p-4 shadow-none space-y-3">
      <div class="text-xs font-bold text-zinc-900">Verification Funnel</div>
      <div class="space-y-2.5 font-mono text-xs">
        <div class="p-2 rounded bg-zinc-50 border border-zinc-100 flex justify-between items-center">
          <span class="text-zinc-700">Auto-Approved (AI &gt; 75%)</span>
          <span class="font-bold text-zinc-900">16,380 (87.4%)</span>
        </div>
        <div class="p-2 rounded bg-zinc-50 border border-zinc-100 flex justify-between items-center">
          <span class="text-zinc-700">QA Human Verified</span>
          <span class="font-bold text-zinc-900">760 (4.1%)</span>
        </div>
        <div class="p-2 rounded bg-zinc-50 border border-zinc-100 flex justify-between items-center">
          <span class="text-zinc-700">Gated Non-Waste Rejections</span>
          <span class="font-bold text-zinc-900">1,240 (6.6%)</span>
        </div>
        <div class="p-2 rounded bg-zinc-50 border border-zinc-100 flex justify-between items-center">
          <span class="text-zinc-700">Duplicate Hash Interceptions</span>
          <span class="font-bold text-zinc-900">360 (1.9%)</span>
        </div>
      </div>
    </Card>

    <Card class="bg-white border-zinc-200 p-4 shadow-none space-y-3">
      <div class="flex items-center justify-between">
        <div class="text-xs font-bold text-zinc-900">Top Recyclers</div>
        <a href="/admin-analytics/leaderboard" class="text-[10px] text-zinc-500 hover:text-zinc-900 font-mono">Full →</a>
      </div>
      <div class="divide-y divide-zinc-100 text-xs">
        {#each topEarners.slice(0, 4) as earner}
          <div class="py-1.5 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="font-mono text-zinc-400 text-[10px]">{earner.rank}</span>
              <span class="font-medium text-zinc-900">{earner.name}</span>
            </div>
            <div class="flex items-center gap-2 font-mono text-[11px]">
              <span class="text-zinc-600">{earner.submissions} drops</span>
              <span class="font-bold text-zinc-900">{earner.points}</span>
            </div>
          </div>
        {/each}
      </div>
    </Card>
  </div>
</div>
