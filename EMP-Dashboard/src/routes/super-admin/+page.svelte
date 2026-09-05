<script lang="ts">
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '$lib/components/ui/card';
  import Badge from '$lib/components/ui/badge/badge.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    Shield01Icon,
    Analytics01Icon,
    UserGroupIcon,
    Settings01Icon,
    RotateLeft01Icon,
    Folder01Icon,
    Ticket01Icon,
    File01Icon,
    ShieldAlertIcon,
    Activity01Icon,
    LockIcon,
    UserBlock01Icon,
    Search01Icon,
    CheckmarkCircle01Icon,
    CancelCircleIcon,
    ArrowUp01Icon,
    ArrowRight01Icon,
    Coins01Icon
  } from '@hugeicons/core-free-icons';

  // 6 KPIs
  const kpis = [
    { title: 'Total Citizens', value: '2,413', change: '+12%', note: '312 this week', icon: UserGroupIcon },
    { title: 'Waste Photos Classified', value: '18,740', change: '+8%', note: '91.2% auto-approved', icon: Folder01Icon },
    { title: 'Points Minted', value: '342,800', change: '+15%', note: '₹34,280 retail value', icon: Coins01Icon },
    { title: 'Triton AI Accuracy', value: '91.2%', change: '+2.1pp', note: 'YOLOv8-Waste v2.4.1', icon: Activity01Icon },
    { title: 'Active Point Rules', value: '5 Classes', change: 'Live', note: 'PET, Metal, Glass, Paper, E-Waste', icon: Settings01Icon },
    { title: 'Open Fraud Flags', value: '7', change: '-3', note: 'pHash & geo-anomalies', icon: ShieldAlertIcon }
  ];

  // Point Rules from 01-super-admin.html
  let pointRules = $state([
    { category: 'Plastic Bottles (PET)', points: 10, cap: 50, active: true },
    { category: 'Paper & Cardboard', points: 5, cap: 30, active: true },
    { category: 'Glass Containers', points: 15, cap: 20, active: true },
    { category: 'Metal & Aluminium Cans', points: 20, cap: 25, active: true },
    { category: 'E-Waste & Batteries', points: 50, cap: 5, active: true }
  ]);

  // Recent Admin Actions from 01-super-admin.html
  const recentActions = [
    { actor: 'Varshith D.', action: 'promoted Ravi K. to QA Reviewer', time: '2 min ago' },
    { actor: 'Ananya V.', action: 'updated Metal points to 20', time: '18 min ago' },
    { actor: 'System Daemon', action: 'flagged 7 duplicate submissions via pHash', time: '1 hr ago' },
    { actor: 'Varshith D.', action: 'reprocessed 42 submissions after model upgrade v2.4.1', time: '3 hr ago' },
    { actor: 'System Daemon', action: 'auto-approved 312 submissions (high confidence)', time: '6 hr ago' }
  ];

  // Pending Redemptions from 01-super-admin.html
  let pendingRedemptions = $state([
    { id: 'RED-101', user: 'Arjun T.', coupon: '₹50 Amazon Card', cost: 500, status: 'Pending' },
    { id: 'RED-102', user: 'Meera S.', coupon: '₹100 Flipkart Card', cost: 1000, status: 'Pending' },
    { id: 'RED-103', user: 'Kiran R.', coupon: '₹25 Swiggy Voucher', cost: 250, status: 'Pending' },
    { id: 'RED-104', user: 'Deepa N.', coupon: '₹200 Myntra Code', cost: 2000, status: 'Pending' }
  ]);

  const quickActions = [
    { title: 'Assign Roles', desc: 'Promote or demote any staff user', icon: LockIcon, href: '/super-admin/roles' },
    { title: 'Edit Point Rules', desc: 'Per-category points formulas & caps', icon: Settings01Icon, href: '/super-admin/rules' },
    { title: 'Waste Categories', desc: 'Taxonomy, CO2 offset, and multipliers', icon: Folder01Icon, href: '/super-admin/categories' },
    { title: 'Security Audit', desc: 'SOC2 immutable action ledger', icon: Shield01Icon, href: '/super-admin/audit' }
  ];

  const systemServices = [
    { name: 'API Server', status: 'Online', latency: '42 ms', uptime: '99.99%', ok: true },
    { name: 'Database (Postgres)', status: 'Healthy', latency: '1.8 ms', uptime: '100%', ok: true },
    { name: 'ML Worker (Triton)', status: 'Running', latency: '18.2 ms', uptime: '99.95%', ok: true },
    { name: 'Cloudflare R2 Storage', status: 'Connected', latency: '24 ms', uptime: '100%', ok: true },
    { name: 'Redis Event Queue', status: 'Healthy', latency: '0.8 ms', uptime: '99.98%', ok: true },
    { name: 'Email SMTP Service', status: 'Active', latency: '110 ms', uptime: '99.90%', ok: true }
  ];

  // SVG Area Chart Coordinates
  const activityData = [1240, 1380, 1420, 1190, 1540, 1680, 1820, 1740, 1890, 2010, 2180, 1960, 2120, 2240];
  const chartWidth = 540;
  const chartHeight = 140;
  const maxVal = 2400;
  const minVal = 1000;
  const pointsString = activityData
    .map((d, i) => {
      const x = (i / (activityData.length - 1)) * chartWidth;
      const y = chartHeight - ((d - minVal) / (maxVal - minVal)) * (chartHeight - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  let actionNotification = $state<string | null>(null);

  function notify(msg: string) {
    actionNotification = msg;
    setTimeout(() => (actionNotification = null), 4000);
  }

  function handleApproveRedeem(id: string, name: string) {
    pendingRedemptions = pendingRedemptions.filter((r) => r.id !== id);
    notify(`Approved redemption for ${name}`);
  }

  function handleRejectRedeem(id: string, name: string) {
    pendingRedemptions = pendingRedemptions.filter((r) => r.id !== id);
    notify(`Rejected redemption for ${name}`);
  }
</script>

<svelte:head>
  <title>Super Admin — T2T Platform</title>
</svelte:head>

<div class="space-y-6">
  <!-- Notification Bar -->
  {#if actionNotification}
    <div class="bg-zinc-900 text-white text-xs px-4 py-2.5 rounded flex items-center justify-between transition-all font-mono">
      <div class="flex items-center gap-2">
        <HugeIcon icon={CheckmarkCircle01Icon} size={14} class="text-zinc-200" />
        <span>{actionNotification}</span>
      </div>
      <button onclick={() => (actionNotification = null)} class="text-zinc-400 hover:text-white text-xs">
        Dismiss
      </button>
    </div>
  {/if}

  <!-- Header Banner -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold tracking-tight text-zinc-900">Platform Command Overview</h1>
      <p class="text-xs text-zinc-500 mt-0.5">High-privilege system telemetry, user governance, AI classification health, and rewards economy.</p>
    </div>
    <div class="flex items-center gap-2">
      <a href="/super-admin/rules" class="inline-flex items-center text-xs h-8 px-3 rounded border border-zinc-200 bg-white hover:bg-zinc-50 font-medium text-zinc-800 transition-colors">
        <HugeIcon icon={Settings01Icon} size={12} class="mr-1.5 text-zinc-500" />
        Manage Rules
      </a>
      <a href="/super-admin/categories" class="inline-flex items-center text-xs h-8 px-3 rounded bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-colors">
        <HugeIcon icon={Folder01Icon} size={12} class="mr-1.5" />
        Taxonomy Categories
      </a>
    </div>
  </div>

  <!-- 4 Quick Actions Strip -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
    {#each quickActions as qa}
      <a
        href={qa.href}
        class="p-3 rounded border border-zinc-200 bg-white hover:border-zinc-400 transition-all text-left flex items-start justify-between group"
      >
        <div class="space-y-1">
          <div class="text-xs font-bold text-zinc-900 group-hover:text-zinc-950 flex items-center gap-1.5">
            <HugeIcon icon={qa.icon} size={13} class="text-zinc-500 group-hover:text-zinc-900" />
            <span>{qa.title}</span>
          </div>
          <div class="text-[11px] text-zinc-500">{qa.desc}</div>
        </div>
        <HugeIcon icon={ArrowRight01Icon} size={13} class="text-zinc-400 group-hover:translate-x-0.5 group-hover:text-zinc-800 transition-all shrink-0 mt-0.5" />
      </a>
    {/each}
  </div>

  <!-- 6-Stat KPI Grid -->
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
    {#each kpis as kpi}
      <Card class="bg-white border-zinc-200 p-3 shadow-none">
        <div class="flex items-center justify-between text-zinc-400">
          <HugeIcon icon={kpi.icon} size={14} />
          <span class="text-[10px] font-mono text-zinc-600 font-medium">{kpi.change}</span>
        </div>
        <div class="text-lg font-bold text-zinc-900 mt-1 font-mono tracking-tight">{kpi.value}</div>
        <div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">{kpi.title}</div>
        <div class="text-[10px] text-zinc-400 truncate mt-1">{kpi.note}</div>
      </Card>
    {/each}
  </div>

  <!-- Middle Section: Chart + System Health Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <!-- 14-Day Ingestion Velocity Curve (2 Cols) -->
    <Card class="lg:col-span-2 bg-white border-zinc-200 p-4 shadow-none flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-2">
          <div>
            <div class="text-xs font-bold text-zinc-900">Platform Ingestion Velocity (14 Days)</div>
            <div class="text-[11px] text-zinc-500">Submissions verified across all 5 waste classes</div>
          </div>
          <div class="text-right">
            <span class="text-xs font-mono font-bold text-zinc-900">2,240 / day peak</span>
            <span class="text-[10px] text-emerald-700 block font-mono">↑ 14.2% vs last cycle</span>
          </div>
        </div>

        <div class="h-40 w-full pt-4">
          <svg viewBox="0 0 {chartWidth} {chartHeight}" class="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#18181b" stop-opacity="0.12" />
                <stop offset="100%" stop-color="#18181b" stop-opacity="0.00" />
              </linearGradient>
            </defs>
            <polygon
              points="0,{chartHeight} {pointsString} {chartWidth},{chartHeight}"
              fill="url(#areaFill)"
            />
            <polyline
              fill="none"
              stroke="#18181b"
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
              points={pointsString}
            />
          </svg>
        </div>
      </div>

      <div class="flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-100 pt-2 font-mono">
        <span>Aug 23</span>
        <span>Aug 26</span>
        <span>Aug 29</span>
        <span>Sep 01</span>
        <span>Today</span>
      </div>
    </Card>

    <!-- Cluster Diagnostics (1 Col) -->
    <Card class="bg-white border-zinc-200 p-4 shadow-none">
      <div class="flex items-center justify-between mb-3">
        <div>
          <div class="text-xs font-bold text-zinc-900">Core Services Status</div>
          <div class="text-[11px] text-zinc-500">ap-south-1 region cluster</div>
        </div>
        <a href="/super-admin/system" class="text-[10px] text-zinc-500 hover:text-zinc-900 font-mono">
          Diagnostics →
        </a>
      </div>

      <div class="space-y-2 font-mono text-[11px]">
        {#each systemServices as s}
          <div class="flex items-center justify-between py-1 border-b border-zinc-100 last:border-0">
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span class="text-zinc-800 font-sans text-xs">{s.name}</span>
            </div>
            <div class="flex items-center gap-2 text-zinc-500">
              <span>{s.latency}</span>
              <span class="text-zinc-800 font-medium">{s.uptime}</span>
            </div>
          </div>
        {/each}
      </div>
    </Card>
  </div>

  <!-- Bottom Split Grid: Active Point Rules & Pending Redemptions & Activity Feed -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <!-- Active Point Rules Table -->
    <Card class="bg-white border-zinc-200 p-4 shadow-none">
      <div class="flex items-center justify-between mb-3">
        <div>
          <div class="text-xs font-bold text-zinc-900">Active Point Economy Rules</div>
          <div class="text-[11px] text-zinc-500">Per-category incentives credited on verified classification</div>
        </div>
        <a href="/super-admin/rules" class="text-[10px] text-zinc-600 hover:text-zinc-900 font-mono">
          Full Rules Matrix →
        </a>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
              <th class="py-1.5 px-2">Category</th>
              <th class="py-1.5 px-2">Points</th>
              <th class="py-1.5 px-2">Daily Cap</th>
              <th class="py-1.5 px-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
            {#each pointRules as rule}
              <tr class="hover:bg-zinc-50">
                <td class="py-2 px-2 font-sans text-xs font-medium text-zinc-900">{rule.category}</td>
                <td class="py-2 px-2 font-bold text-zinc-900">{rule.points} pts</td>
                <td class="py-2 px-2 text-zinc-600">{rule.cap} items</td>
                <td class="py-2 px-2 text-right">
                  <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Active
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Pending Redemptions Desk -->
    <Card class="bg-white border-zinc-200 p-4 shadow-none">
      <div class="flex items-center justify-between mb-3">
        <div>
          <div class="text-xs font-bold text-zinc-900">Pending Voucher Redemptions</div>
          <div class="text-[11px] text-zinc-500">Claims requiring super admin treasury approval</div>
        </div>
        <a href="/super-admin/coupons" class="text-[10px] text-zinc-600 hover:text-zinc-900 font-mono">
          All Vouchers →
        </a>
      </div>

      <div class="divide-y divide-zinc-100 text-xs">
        {#each pendingRedemptions as item}
          <div class="py-2.5 flex items-center justify-between gap-3">
            <div>
              <div class="font-medium text-zinc-900 text-xs">{item.user} · <span class="text-zinc-600">{item.coupon}</span></div>
              <div class="text-[10px] font-mono text-zinc-400">{item.id} · Cost: <strong class="text-zinc-700">{item.cost} pts</strong></div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <Button
                onclick={() => handleRejectRedeem(item.id, item.user)}
                variant="outline"
                size="sm"
                class="text-[11px] h-6 px-2 text-zinc-600 border-zinc-200"
              >
                Reject
              </Button>
              <Button
                onclick={() => handleApproveRedeem(item.id, item.user)}
                size="sm"
                class="text-[11px] h-6 px-2 bg-zinc-900 hover:bg-zinc-800 text-white"
              >
                Approve
              </Button>
            </div>
          </div>
        {/each}
      </div>
    </Card>
  </div>
</div>
