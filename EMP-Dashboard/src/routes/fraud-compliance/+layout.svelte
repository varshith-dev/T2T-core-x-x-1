<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import {
    Shield01Icon,
    ShieldAlertIcon,
    Alert01Icon,
    Camera01Icon,
    UserBlock01Icon,
    LockIcon,
    Activity01Icon,
    File01Icon
  } from '@hugeicons/core-free-icons';

  let { children }: { children?: Snippet } = $props();

  const currentPath = $derived(page.url.pathname);

  function isActive(path: string) {
    if (path === '/fraud-compliance') {
      return currentPath === '/fraud-compliance' || currentPath === '/fraud-compliance/';
    }
    return currentPath.startsWith(path);
  }

  const subPath = $derived(currentPath.replace(/^\/fraud-compliance\/?/, ''));
  const pageTitle = $derived(
    subPath === '' ? 'Active Threat Alerts' :
    subPath === 'warnings' ? 'Moderate Warnings Desk' :
    subPath === 'duplicates' ? 'Duplicate Hashes (pHash)' :
    subPath === 'non-waste' ? 'Non-Waste Gating' :
    subPath === 'gps' ? 'Location & Geofence Clusters' :
    subPath === 'high-risk' ? 'High-Risk Citizens' :
    subPath === 'suspended' ? 'Suspended Accounts' : subPath
  );
</script>

<div class="flex min-h-screen bg-[#fafafa] text-zinc-900 font-sans antialiased">
  <!-- RAILBAR -->
  <aside class="w-60 shrink-0 border-r border-zinc-200 bg-white flex flex-col justify-between h-screen sticky top-0 select-none">
    <div class="p-3 space-y-4 overflow-y-auto">
      <!-- Workspace Brand -->
      <a href="/fraud-compliance" class="flex items-center gap-2.5 px-2 py-1.5 rounded border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100 transition-colors">
        <div class="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-white text-[11px] font-bold font-mono tracking-tight">
          T2
        </div>
        <div class="truncate">
          <div class="text-xs font-semibold text-zinc-900 truncate tracking-tight">T2T Security</div>
          <div class="text-[10px] text-zinc-500 font-medium font-mono uppercase tracking-wider">Fraud & Compliance</div>
        </div>
      </a>

      <!-- Quick Action -->
      <a
        href="/fraud-compliance/duplicates"
        class="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-medium transition-colors"
      >
        <HugeIcon icon={ShieldAlertIcon} size={13} />
        <span>Scan Duplicate Hashes</span>
      </a>

      <!-- Section: Threat Feeds -->
      <div class="space-y-0.5">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Threat Feeds
        </div>
        <a
          href="/fraud-compliance"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/fraud-compliance') && currentPath === '/fraud-compliance' ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={ShieldAlertIcon} size={14} class={isActive('/fraud-compliance') && currentPath === '/fraud-compliance' ? 'text-zinc-900' : 'text-zinc-500'} />
            Active Alerts
          </span>
          <span class="text-[10px] font-mono font-semibold bg-rose-50 text-rose-800 px-1.5 py-0.5 rounded border border-rose-200">4</span>
        </a>
        <a
          href="/fraud-compliance/warnings"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/fraud-compliance/warnings') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Alert01Icon} size={14} class={isActive('/fraud-compliance/warnings') ? 'text-zinc-900' : 'text-zinc-500'} />
            Warnings Desk
          </span>
          <span class="text-[10px] font-mono text-zinc-500">4</span>
        </a>
      </div>

      <!-- Section: Detection Engines -->
      <div class="space-y-0.5 pt-2 border-t border-zinc-100">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Detection Engines
        </div>
        <a
          href="/fraud-compliance/duplicates"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/fraud-compliance/duplicates') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Camera01Icon} size={14} class={isActive('/fraud-compliance/duplicates') ? 'text-zinc-900' : 'text-zinc-500'} />
            Duplicate Hashes
          </span>
          <span class="text-[10px] font-mono font-semibold bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-200">3</span>
        </a>
        <a
          href="/fraud-compliance/non-waste"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/fraud-compliance/non-waste') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Shield01Icon} size={14} class={isActive('/fraud-compliance/non-waste') ? 'text-zinc-900' : 'text-zinc-500'} />
            Non-Waste Gating
          </span>
          <span class="text-[10px] font-mono text-zinc-500">5</span>
        </a>
        <a
          href="/fraud-compliance/gps"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/fraud-compliance/gps') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Activity01Icon} size={14} class={isActive('/fraud-compliance/gps') ? 'text-zinc-900' : 'text-zinc-500'} />
            Location Clusters
          </span>
          <span class="text-[10px] font-mono text-zinc-500">4 sites</span>
        </a>
      </div>

      <!-- Section: Enforcement -->
      <div class="space-y-0.5 pt-2 border-t border-zinc-100">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Enforcement
        </div>
        <a
          href="/fraud-compliance/high-risk"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/fraud-compliance/high-risk') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={UserBlock01Icon} size={14} class={isActive('/fraud-compliance/high-risk') ? 'text-zinc-900' : 'text-zinc-500'} />
            High-Risk Users
          </span>
          <span class="text-[10px] font-mono font-semibold bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-200">5</span>
        </a>
        <a
          href="/fraud-compliance/suspended"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/fraud-compliance/suspended') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={LockIcon} size={14} class={isActive('/fraud-compliance/suspended') ? 'text-zinc-900' : 'text-zinc-500'} />
            Suspended Accounts
          </span>
          <span class="text-[10px] font-mono text-zinc-400">3</span>
        </a>
      </div>
    </div>

    <!-- Rail Footer -->
    <div class="p-3 border-t border-zinc-200 bg-white">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded bg-zinc-100 border border-zinc-300 flex items-center justify-center text-zinc-900 text-xs font-semibold font-mono">
          FA
        </div>
        <div class="truncate">
          <div class="text-xs font-semibold text-zinc-900 truncate">Fatima A.</div>
          <div class="text-[10px] text-zinc-500 truncate font-mono">fatima.a@t2t.internal</div>
        </div>
      </div>
      <div class="mt-2 flex items-center justify-between">
        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 font-mono">
          Fraud Analyst
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
        <a href="/fraud-compliance" class="text-zinc-500 hover:text-zinc-900">Security & Compliance</a>
        <span class="text-zinc-300">/</span>
        <span class="text-zinc-900 font-semibold">{pageTitle}</span>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" class="text-xs h-7 px-2.5 border-zinc-200">
          <HugeIcon icon={File01Icon} size={12} class="mr-1.5 text-zinc-500" />
          Export Incident Log
        </Button>
      </div>
    </header>

    <div class="flex-1 p-6 overflow-y-auto">
      {@render children?.()}
    </div>
  </main>
</div>
