<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
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
    Search01Icon
  } from '@hugeicons/core-free-icons';

  let { children }: { children?: Snippet } = $props();

  const currentPath = $derived(page.url.pathname);

  function isActive(path: string) {
    if (path === '/super-admin') {
      return currentPath === '/super-admin' || currentPath === '/super-admin/';
    }
    return currentPath.startsWith(path);
  }

  // Derive breadcrumb
  const subPath = $derived(currentPath.replace(/^\/super-admin\/?/, ''));
  const pageTitle = $derived(
    subPath === '' ? 'Command Overview' :
    subPath === 'system' ? 'System Health' :
    subPath === 'users' ? 'All Users Directory' :
    subPath === 'roles' ? 'Role Assignment & RBAC' :
    subPath === 'suspended' ? 'Suspended Accounts' :
    subPath === 'rules' ? 'Point Rules & Multipliers' :
    subPath === 'categories' ? 'Waste Categories' :
    subPath === 'coupons' ? 'Coupon Catalog' :
    subPath === 'audit' ? 'Audit Logs' :
    subPath === 'reprocess' ? 'Reprocess Queue' : subPath
  );
</script>

<div class="flex min-h-screen bg-[#fafafa] text-zinc-900 font-sans antialiased">
  <!-- RAILBAR (Real SvelteKit navigation links) -->
  <aside class="w-60 shrink-0 border-r border-zinc-200 bg-white flex flex-col justify-between h-screen sticky top-0 select-none">
    <div class="p-3 space-y-4 overflow-y-auto">
      <!-- Workspace Brand -->
      <a href="/super-admin" class="flex items-center gap-2.5 px-2 py-1.5 rounded border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100 transition-colors">
        <div class="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-white text-[11px] font-bold font-mono tracking-tight">
          T2
        </div>
        <div class="truncate">
          <div class="text-xs font-semibold text-zinc-900 truncate tracking-tight">T2T Platform</div>
          <div class="text-[10px] text-zinc-500 font-medium font-mono uppercase tracking-wider">Command Center</div>
        </div>
      </a>

      <!-- Quick Action -->
      <a
        href="/super-admin"
        class="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-medium transition-colors"
      >
        <HugeIcon icon={Shield01Icon} size={13} />
        <span>Platform Overview</span>
      </a>

      <!-- Section: Overview -->
      <div class="space-y-0.5">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Overview
        </div>
        <a
          href="/super-admin"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/super-admin') && currentPath === '/super-admin' ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Analytics01Icon} size={14} class={isActive('/super-admin') && currentPath === '/super-admin' ? 'text-zinc-900' : 'text-zinc-500'} />
            Command Overview
          </span>
          <span class="text-[10px] font-mono text-zinc-400">Live</span>
        </a>
        <a
          href="/super-admin/system"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/super-admin/system') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Activity01Icon} size={14} class={isActive('/super-admin/system') ? 'text-zinc-900' : 'text-zinc-500'} />
            System Health
          </span>
          <span class="text-[10px] font-mono text-emerald-700 font-medium">99.98%</span>
        </a>
      </div>

      <!-- Section: User Management -->
      <div class="space-y-0.5 pt-2 border-t border-zinc-100">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          User Management
        </div>
        <a
          href="/super-admin/users"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/super-admin/users') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={UserGroupIcon} size={14} class={isActive('/super-admin/users') ? 'text-zinc-900' : 'text-zinc-500'} />
            All Users
          </span>
          <span class="text-[10px] font-mono text-zinc-500">2.4k</span>
        </a>
        <a
          href="/super-admin/roles"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/super-admin/roles') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={LockIcon} size={14} class={isActive('/super-admin/roles') ? 'text-zinc-900' : 'text-zinc-500'} />
            Role Assignment
          </span>
          <span class="text-[10px] font-mono text-zinc-400">8 tiers</span>
        </a>
        <a
          href="/super-admin/suspended"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/super-admin/suspended') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={UserBlock01Icon} size={14} class={isActive('/super-admin/suspended') ? 'text-zinc-900' : 'text-zinc-500'} />
            Suspended Accounts
          </span>
          <span class="text-[10px] font-mono text-zinc-500">3</span>
        </a>
      </div>

      <!-- Section: Platform Config -->
      <div class="space-y-0.5 pt-2 border-t border-zinc-100">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Platform Config
        </div>
        <a
          href="/super-admin/rules"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/super-admin/rules') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Settings01Icon} size={14} class={isActive('/super-admin/rules') ? 'text-zinc-900' : 'text-zinc-500'} />
            Point Rules
          </span>
          <span class="text-[10px] font-mono text-zinc-400">v2.4</span>
        </a>
        <a
          href="/super-admin/categories"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/super-admin/categories') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Folder01Icon} size={14} class={isActive('/super-admin/categories') ? 'text-zinc-900' : 'text-zinc-500'} />
            Categories
          </span>
          <span class="text-[10px] font-mono text-zinc-500">5 active</span>
        </a>
        <a
          href="/super-admin/coupons"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/super-admin/coupons') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Ticket01Icon} size={14} class={isActive('/super-admin/coupons') ? 'text-zinc-900' : 'text-zinc-500'} />
            Coupon Catalog
          </span>
          <span class="text-[10px] font-mono text-zinc-400">24 pkgs</span>
        </a>
      </div>

      <!-- Section: Security & ML -->
      <div class="space-y-0.5 pt-2 border-t border-zinc-100">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Security & ML
        </div>
        <a
          href="/super-admin/audit"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/super-admin/audit') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={File01Icon} size={14} class={isActive('/super-admin/audit') ? 'text-zinc-900' : 'text-zinc-500'} />
            Audit Logs
          </span>
          <span class="text-[10px] font-mono text-zinc-400">SOC2</span>
        </a>
        <a
          href="/fraud-compliance"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={ShieldAlertIcon} size={14} class="text-zinc-500" />
            Fraud Alerts
          </span>
          <span class="text-[10px] font-mono font-semibold bg-rose-50 text-rose-800 px-1.5 py-0.5 rounded border border-rose-200">7</span>
        </a>
        <a
          href="/super-admin/reprocess"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/super-admin/reprocess') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={RotateLeft01Icon} size={14} class={isActive('/super-admin/reprocess') ? 'text-zinc-900' : 'text-zinc-500'} />
            Reprocess Queue
          </span>
          <span class="text-[10px] font-mono text-zinc-500">124 jobs</span>
        </a>
      </div>
    </div>

    <!-- Rail Footer -->
    <div class="p-3 border-t border-zinc-200 bg-white">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold font-mono">
          VD
        </div>
        <div class="truncate">
          <div class="text-xs font-semibold text-zinc-900 truncate">Varshith D.</div>
          <div class="text-[10px] text-zinc-500 truncate font-mono">varshith.d@t2t.internal</div>
        </div>
      </div>
      <div class="mt-2 flex items-center justify-between">
        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 font-mono">
          Super Admin
        </span>
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
      </div>
    </div>
  </aside>

  <!-- MAIN SUB-ROUTE WORKSPACE -->
  <main class="flex-1 flex flex-col min-w-0">
    <!-- Top Header with Real Route Breadcrumb -->
    <header class="h-12 border-b border-zinc-200 bg-white px-6 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2.5 text-xs">
        <a href="/" class="text-zinc-400 hover:text-zinc-900 font-mono">T2T</a>
        <span class="text-zinc-300">/</span>
        <a href="/super-admin" class="text-zinc-500 hover:text-zinc-900">Super Admin</a>
        <span class="text-zinc-300">/</span>
        <span class="text-zinc-900 font-semibold">{pageTitle}</span>
      </div>

      <div class="flex items-center gap-3">
        <div class="relative">
          <HugeIcon icon={Search01Icon} size={13} class="absolute left-2.5 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search platform... ⌘K"
            class="h-7 w-48 pl-7 pr-3 text-xs bg-zinc-50 border border-zinc-200 rounded focus:outline-none focus:border-zinc-900 focus:bg-white text-zinc-800 placeholder-zinc-400"
          />
        </div>
        <Button variant="outline" size="sm" class="text-xs h-7 px-2.5 border-zinc-200">
          <HugeIcon icon={File01Icon} size={12} class="mr-1.5 text-zinc-500" />
          Export
        </Button>
      </div>
    </header>

    <!-- Sub-page dynamic content slot -->
    <div class="flex-1 p-6 overflow-y-auto">
      {@render children?.()}
    </div>
  </main>
</div>
