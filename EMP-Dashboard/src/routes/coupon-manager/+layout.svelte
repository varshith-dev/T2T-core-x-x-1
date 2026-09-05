<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import {
    Ticket01Icon,
    Clock01Icon,
    Package01Icon,
    Coins01Icon,
    File01Icon
  } from '@hugeicons/core-free-icons';

  let { children }: { children?: Snippet } = $props();

  const currentPath = $derived(page.url.pathname);

  function isActive(path: string) {
    if (path === '/coupon-manager') {
      return currentPath === '/coupon-manager' || currentPath === '/coupon-manager/';
    }
    return currentPath.startsWith(path);
  }

  const subPath = $derived(currentPath.replace(/^\/coupon-manager\/?/, ''));
  const pageTitle = $derived(
    subPath === '' ? 'Voucher Catalog' :
    subPath === 'claims' ? 'Citizen Claims Adjudication' :
    subPath === 'partners' ? 'Retail Merchant Partners' :
    subPath === 'rates' ? 'Treasury Parity & Rates' :
    subPath === 'reports' ? 'Settlement Audit Ledger' : subPath
  );
</script>

<div class="flex min-h-screen bg-[#fafafa] text-zinc-900 font-sans antialiased">
  <!-- RAILBAR -->
  <aside class="w-60 shrink-0 border-r border-zinc-200 bg-white flex flex-col justify-between h-screen sticky top-0 select-none">
    <div class="p-3 space-y-4 overflow-y-auto">
      <!-- Workspace Brand -->
      <a href="/coupon-manager" class="flex items-center gap-2.5 px-2 py-1.5 rounded border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100 transition-colors">
        <div class="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-white text-[11px] font-bold font-mono tracking-tight">
          T2
        </div>
        <div class="truncate">
          <div class="text-xs font-semibold text-zinc-900 truncate tracking-tight">T2T Rewards</div>
          <div class="text-[10px] text-zinc-500 font-medium font-mono uppercase tracking-wider">Vouchers & Economy</div>
        </div>
      </a>

      <!-- Quick Action -->
      <a
        href="/coupon-manager"
        class="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-medium transition-colors"
      >
        <HugeIcon icon={Ticket01Icon} size={13} />
        <span>Voucher Catalog</span>
      </a>

      <!-- Section: Inventory & Claims -->
      <div class="space-y-0.5">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Catalog & Claims
        </div>
        <a
          href="/coupon-manager"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/coupon-manager') && currentPath === '/coupon-manager' ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Ticket01Icon} size={14} class={isActive('/coupon-manager') && currentPath === '/coupon-manager' ? 'text-zinc-900' : 'text-zinc-500'} />
            Voucher Catalog
          </span>
          <span class="text-[10px] text-zinc-500 font-mono">7 batches</span>
        </a>
        <a
          href="/coupon-manager/claims"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/coupon-manager/claims') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Clock01Icon} size={14} class={isActive('/coupon-manager/claims') ? 'text-zinc-900' : 'text-zinc-500'} />
            Pending Claims
          </span>
          <span class="text-[10px] font-mono font-semibold bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-200">5</span>
        </a>
      </div>

      <!-- Section: Retail Partnerships -->
      <div class="space-y-0.5 pt-2 border-t border-zinc-100">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Partners & Network
        </div>
        <a
          href="/coupon-manager/partners"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/coupon-manager/partners') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Package01Icon} size={14} class={isActive('/coupon-manager/partners') ? 'text-zinc-900' : 'text-zinc-500'} />
            Merchant Brands
          </span>
          <span class="text-[10px] font-mono text-zinc-500">6 brands</span>
        </a>
      </div>

      <!-- Section: Economy Treasury -->
      <div class="space-y-0.5 pt-2 border-t border-zinc-100">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Treasury Rules
        </div>
        <a
          href="/coupon-manager/rates"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/coupon-manager/rates') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Coins01Icon} size={14} class={isActive('/coupon-manager/rates') ? 'text-zinc-900' : 'text-zinc-500'} />
            Exchange Ratio
          </span>
          <span class="text-[10px] font-mono text-zinc-500">10:1</span>
        </a>
        <a
          href="/coupon-manager/reports"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/coupon-manager/reports') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={File01Icon} size={14} class={isActive('/coupon-manager/reports') ? 'text-zinc-900' : 'text-zinc-500'} />
            Settlement Audit
          </span>
          <span class="text-[10px] font-mono text-zinc-400">Monthly</span>
        </a>
      </div>
    </div>

    <!-- Rail Footer -->
    <div class="p-3 border-t border-zinc-200 bg-white">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded bg-zinc-100 border border-zinc-300 flex items-center justify-center text-zinc-900 text-xs font-semibold font-mono">
          PM
        </div>
        <div class="truncate">
          <div class="text-xs font-semibold text-zinc-900 truncate">Priya Mehta</div>
          <div class="text-[10px] text-zinc-500 truncate font-mono">priya.m@t2t.internal</div>
        </div>
      </div>
      <div class="mt-2 flex items-center justify-between">
        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 font-mono">
          Rewards Lead
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
        <a href="/coupon-manager" class="text-zinc-500 hover:text-zinc-900">Rewards Economy</a>
        <span class="text-zinc-300">/</span>
        <span class="text-zinc-900 font-semibold">{pageTitle}</span>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" class="text-xs h-7 px-2.5 border-zinc-200">
          <HugeIcon icon={File01Icon} size={12} class="mr-1.5 text-zinc-500" />
          Export Settlement
        </Button>
      </div>
    </header>

    <div class="flex-1 p-6 overflow-y-auto">
      {@render children?.()}
    </div>
  </main>
</div>
