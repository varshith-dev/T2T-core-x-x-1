<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import {
    CheckmarkCircle01Icon,
    CancelCircleIcon,
    ShieldAlertIcon,
    Clock01Icon,
    Folder01Icon,
    File01Icon,
    Camera01Icon,
    Search01Icon
  } from '@hugeicons/core-free-icons';

  let { children }: { children?: Snippet } = $props();

  const currentPath = $derived(page.url.pathname);

  function isActive(path: string) {
    if (path === '/reviewer') {
      return currentPath === '/reviewer' || currentPath === '/reviewer/';
    }
    return currentPath.startsWith(path);
  }

  const subPath = $derived(currentPath.replace(/^\/reviewer\/?/, ''));
  const pageTitle = $derived(
    subPath === '' ? 'Review Verification Queue' :
    subPath === 'approvals' ? 'My Approvals Log' :
    subPath === 'rejections' ? 'My Rejections Archive' :
    subPath === 'priority' ? 'Urgent Queue' :
    subPath === 'low-conf' ? 'Low Confidence Captures' :
    subPath === 'all' ? 'All Ingested Submissions' : subPath
  );
</script>

<div class="flex min-h-screen bg-[#fafafa] text-zinc-900 font-sans antialiased">
  <!-- RAILBAR -->
  <aside class="w-60 shrink-0 border-r border-zinc-200 bg-white flex flex-col justify-between h-screen sticky top-0 select-none">
    <div class="p-3 space-y-4 overflow-y-auto">
      <!-- Workspace Brand -->
      <a href="/reviewer" class="flex items-center gap-2.5 px-2 py-1.5 rounded border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100 transition-colors">
        <div class="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-white text-[11px] font-bold font-mono tracking-tight">
          T2
        </div>
        <div class="truncate">
          <div class="text-xs font-semibold text-zinc-900 truncate tracking-tight">T2T Review Desk</div>
          <div class="text-[10px] text-zinc-500 font-medium font-mono uppercase tracking-wider">Vision Verification</div>
        </div>
      </a>

      <!-- Quick Action -->
      <a
        href="/reviewer"
        class="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-medium transition-colors"
      >
        <HugeIcon icon={Camera01Icon} size={13} />
        <span>Next In Queue</span>
      </a>

      <!-- Section: Work Queues -->
      <div class="space-y-0.5">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Verification Queues
        </div>
        <a
          href="/reviewer"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/reviewer') && currentPath === '/reviewer' ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Clock01Icon} size={14} class={isActive('/reviewer') && currentPath === '/reviewer' ? 'text-zinc-900' : 'text-zinc-500'} />
            Pending Queue
          </span>
          <span class="text-[10px] font-mono font-semibold bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-200">5</span>
        </a>
        <a
          href="/reviewer/priority"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/reviewer/priority') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={ShieldAlertIcon} size={14} class={isActive('/reviewer/priority') ? 'text-zinc-900' : 'text-zinc-500'} />
            Priority Queue
          </span>
          <span class="text-[10px] font-mono font-semibold bg-rose-50 text-rose-800 px-1.5 py-0.5 rounded border border-rose-200">2</span>
        </a>
        <a
          href="/reviewer/low-conf"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/reviewer/low-conf') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Folder01Icon} size={14} class={isActive('/reviewer/low-conf') ? 'text-zinc-900' : 'text-zinc-500'} />
            Low Confidence (&lt;75%)
          </span>
          <span class="text-[10px] font-mono text-zinc-500">4</span>
        </a>
      </div>

      <!-- Section: History & Logs -->
      <div class="space-y-0.5 pt-2 border-t border-zinc-100">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Personal History
        </div>
        <a
          href="/reviewer/approvals"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/reviewer/approvals') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={CheckmarkCircle01Icon} size={14} class={isActive('/reviewer/approvals') ? 'text-zinc-900' : 'text-zinc-500'} />
            My Approvals
          </span>
          <span class="text-[10px] font-mono text-zinc-400">142</span>
        </a>
        <a
          href="/reviewer/rejections"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/reviewer/rejections') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={CancelCircleIcon} size={14} class={isActive('/reviewer/rejections') ? 'text-zinc-900' : 'text-zinc-500'} />
            My Rejections
          </span>
          <span class="text-[10px] font-mono text-zinc-400">18</span>
        </a>
        <a
          href="/reviewer/all"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/reviewer/all') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={File01Icon} size={14} class={isActive('/reviewer/all') ? 'text-zinc-900' : 'text-zinc-500'} />
            All Submissions
          </span>
          <span class="text-[10px] font-mono text-zinc-400">18.7k</span>
        </a>
      </div>
    </div>

    <!-- Rail Footer -->
    <div class="p-3 border-t border-zinc-200 bg-white">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded bg-zinc-100 border border-zinc-300 flex items-center justify-center text-zinc-900 text-xs font-semibold font-mono">
          RK
        </div>
        <div class="truncate">
          <div class="text-xs font-semibold text-zinc-900 truncate">Ravi K.</div>
          <div class="text-[10px] text-zinc-500 truncate font-mono">ravi.k@t2t.internal</div>
        </div>
      </div>
      <div class="mt-2 flex items-center justify-between">
        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 font-mono">
          QA Reviewer
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
        <a href="/reviewer" class="text-zinc-500 hover:text-zinc-900">Reviewer</a>
        <span class="text-zinc-300">/</span>
        <span class="text-zinc-900 font-semibold">{pageTitle}</span>
      </div>

      <div class="flex items-center gap-3">
        <div class="text-[11px] font-mono text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded border border-zinc-200">
          Target SLA: <strong>&lt; 5 mins</strong>
        </div>
      </div>
    </header>

    <div class="flex-1 p-6 overflow-y-auto">
      {@render children?.()}
    </div>
  </main>
</div>
