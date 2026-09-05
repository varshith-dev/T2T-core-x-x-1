<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import {
    Analytics01Icon,
    AnalyticsUpIcon,
    Coins01Icon,
    Package01Icon,
    UserGroupIcon,
    Award01Icon,
    Ticket01Icon,
    File01Icon,
    Search01Icon
  } from '@hugeicons/core-free-icons';

  let { children }: { children?: Snippet } = $props();

  const currentPath = $derived(page.url.pathname);

  function isActive(path: string) {
    if (path === '/admin-analytics') {
      return currentPath === '/admin-analytics' || currentPath === '/admin-analytics/';
    }
    return currentPath.startsWith(path);
  }

  const subPath = $derived(currentPath.replace(/^\/admin-analytics\/?/, ''));
  const pageTitle = $derived(
    subPath === '' ? 'Analytics Overview' :
    subPath === 'trends' ? 'Submission Trends' :
    subPath === 'economy' ? 'Points Economy' :
    subPath === 'categories' ? 'Category Breakdown' :
    subPath === 'users' ? 'User Directory' :
    subPath === 'leaderboard' ? 'Top Recyclers Leaderboard' :
    subPath === 'redemptions' ? 'Voucher Redemptions' : subPath
  );
</script>

<div class="flex min-h-screen bg-[#fafafa] text-zinc-900 font-sans antialiased">
  <!-- RAILBAR -->
  <aside class="w-60 shrink-0 border-r border-zinc-200 bg-white flex flex-col justify-between h-screen sticky top-0 select-none">
    <div class="p-3 space-y-4 overflow-y-auto">
      <!-- Workspace Brand -->
      <a href="/admin-analytics" class="flex items-center gap-2.5 px-2 py-1.5 rounded border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100 transition-colors">
        <div class="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-white text-[11px] font-bold font-mono tracking-tight">
          T2
        </div>
        <div class="truncate">
          <div class="text-xs font-semibold text-zinc-900 truncate tracking-tight">T2T Metrics</div>
          <div class="text-[10px] text-zinc-500 font-medium font-mono uppercase tracking-wider">Analytics & Economy</div>
        </div>
      </a>

      <!-- Quick Action -->
      <a
        href="/admin-analytics/trends"
        class="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-medium transition-colors"
      >
        <HugeIcon icon={AnalyticsUpIcon} size={13} />
        <span>View Ingestion Trends</span>
      </a>

      <!-- Section: Performance Views -->
      <div class="space-y-0.5">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Analytics
        </div>
        <a
          href="/admin-analytics"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/admin-analytics') && currentPath === '/admin-analytics' ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Analytics01Icon} size={14} class={isActive('/admin-analytics') && currentPath === '/admin-analytics' ? 'text-zinc-900' : 'text-zinc-500'} />
            Overview
          </span>
          <span class="text-[10px] text-zinc-400 font-mono">14D</span>
        </a>
        <a
          href="/admin-analytics/trends"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/admin-analytics/trends') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={AnalyticsUpIcon} size={14} class={isActive('/admin-analytics/trends') ? 'text-zinc-900' : 'text-zinc-500'} />
            Submission Trends
          </span>
          <span class="text-[10px] text-zinc-700 font-mono font-semibold">+12%</span>
        </a>
        <a
          href="/admin-analytics/economy"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/admin-analytics/economy') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Coins01Icon} size={14} class={isActive('/admin-analytics/economy') ? 'text-zinc-900' : 'text-zinc-500'} />
            Points Economy
          </span>
          <span class="text-[10px] text-zinc-500 font-mono">824k</span>
        </a>
        <a
          href="/admin-analytics/categories"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/admin-analytics/categories') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Package01Icon} size={14} class={isActive('/admin-analytics/categories') ? 'text-zinc-900' : 'text-zinc-500'} />
            Category Breakdown
          </span>
          <span class="text-[10px] text-zinc-500 font-mono">5 types</span>
        </a>
      </div>

      <!-- Section: Users & Activity -->
      <div class="space-y-0.5 pt-2 border-t border-zinc-100">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Users & Activity
        </div>
        <a
          href="/admin-analytics/users"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/admin-analytics/users') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={UserGroupIcon} size={14} class={isActive('/admin-analytics/users') ? 'text-zinc-900' : 'text-zinc-500'} />
            User Directory
          </span>
          <span class="text-[10px] text-zinc-500 font-mono">2,413</span>
        </a>
        <a
          href="/admin-analytics/leaderboard"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/admin-analytics/leaderboard') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Award01Icon} size={14} class={isActive('/admin-analytics/leaderboard') ? 'text-zinc-900' : 'text-zinc-500'} />
            Top Earners
          </span>
          <span class="text-[10px] font-mono text-zinc-400">Top 8</span>
        </a>
      </div>

      <!-- Section: Redemptions -->
      <div class="space-y-0.5 pt-2 border-t border-zinc-100">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Redemptions
        </div>
        <a
          href="/admin-analytics/redemptions"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/admin-analytics/redemptions') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Ticket01Icon} size={14} class={isActive('/admin-analytics/redemptions') ? 'text-zinc-900' : 'text-zinc-500'} />
            Pending Claims
          </span>
          <span class="text-[10px] font-mono font-semibold bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-200">3</span>
        </a>
      </div>
    </div>

    <!-- Rail Footer -->
    <div class="p-3 border-t border-zinc-200 bg-white">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded bg-zinc-100 border border-zinc-300 flex items-center justify-center text-zinc-900 text-xs font-semibold font-mono">
          DR
        </div>
        <div class="truncate">
          <div class="text-xs font-semibold text-zinc-900 truncate">Dev R.</div>
          <div class="text-[10px] text-zinc-500 truncate font-mono">dev.r@t2t.internal</div>
        </div>
      </div>
      <div class="mt-2 flex items-center justify-between">
        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 font-mono">
          Data Analyst
        </span>
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
      </div>
    </div>
  </aside>

  <!-- MAIN SUB-ROUTE WORKSPACE -->
  <main class="flex-1 flex flex-col min-w-0">
    <header class="h-12 border-b border-zinc-200 bg-white px-6 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2.5 text-xs">
        <a href="/" class="text-zinc-400 hover:text-zinc-900 font-mono">T2T</a>
        <span class="text-zinc-300">/</span>
        <a href="/admin-analytics" class="text-zinc-500 hover:text-zinc-900">Analytics</a>
        <span class="text-zinc-300">/</span>
        <span class="text-zinc-900 font-semibold">{pageTitle}</span>
      </div>

      <div class="flex items-center gap-3">
        <div class="relative">
          <HugeIcon icon={Search01Icon} size={13} class="absolute left-2.5 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search metrics... ⌘K"
            class="h-7 w-48 pl-7 pr-3 text-xs bg-zinc-50 border border-zinc-200 rounded focus:outline-none focus:border-zinc-900 focus:bg-white text-zinc-800 placeholder-zinc-400"
          />
        </div>
        <Button variant="outline" size="sm" class="text-xs h-7 px-2.5 border-zinc-200">
          <HugeIcon icon={File01Icon} size={12} class="mr-1.5 text-zinc-500" />
          Export
        </Button>
      </div>
    </header>

    <div class="flex-1 p-6 overflow-y-auto">
      {@render children?.()}
    </div>
  </main>
</div>
