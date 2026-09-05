<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import {
    CpuIcon,
    Activity01Icon,
    Settings01Icon,
    Analytics01Icon,
    Clock01Icon,
    Search01Icon,
    Folder01Icon,
    File01Icon
  } from '@hugeicons/core-free-icons';

  let { children }: { children?: Snippet } = $props();

  const currentPath = $derived(page.url.pathname);

  function isActive(path: string) {
    if (path === '/ml-analyst') {
      return currentPath === '/ml-analyst' || currentPath === '/ml-analyst/';
    }
    return currentPath.startsWith(path);
  }

  const subPath = $derived(currentPath.replace(/^\/ml-analyst\/?/, ''));
  const pageTitle = $derived(
    subPath === '' ? 'Model Studio Overview' :
    subPath === 'confidence' ? 'Confidence Threshold Tuning' :
    subPath === 'confusion-matrix' ? 'Confusion Matrix' :
    subPath === 'versions' ? 'Model Checkpoints' :
    subPath === 'mismatches' ? 'Mislabeled Captures' :
    subPath === 'dataset' ? 'Dataset Splits' :
    subPath === 'export' ? 'Model Export' : subPath
  );
</script>

<div class="flex min-h-screen bg-[#fafafa] text-zinc-900 font-sans antialiased">
  <!-- RAILBAR -->
  <aside class="w-60 shrink-0 border-r border-zinc-200 bg-white flex flex-col justify-between h-screen sticky top-0 select-none">
    <div class="p-3 space-y-4 overflow-y-auto">
      <!-- Workspace Brand -->
      <a href="/ml-analyst" class="flex items-center gap-2.5 px-2 py-1.5 rounded border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100 transition-colors">
        <div class="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-white text-[11px] font-bold font-mono tracking-tight">
          T2
        </div>
        <div class="truncate">
          <div class="text-xs font-semibold text-zinc-900 truncate tracking-tight">T2T Vision Lab</div>
          <div class="text-[10px] text-zinc-500 font-medium font-mono uppercase tracking-wider">YOLOv8 Inference</div>
        </div>
      </a>

      <!-- Quick Action -->
      <a
        href="/ml-analyst/confidence"
        class="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-medium transition-colors"
      >
        <HugeIcon icon={Settings01Icon} size={13} />
        <span>Tune Auto-Approval</span>
      </a>

      <!-- Section: Evaluation -->
      <div class="space-y-0.5">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Evaluation
        </div>
        <a
          href="/ml-analyst"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/ml-analyst') && currentPath === '/ml-analyst' ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Activity01Icon} size={14} class={isActive('/ml-analyst') && currentPath === '/ml-analyst' ? 'text-zinc-900' : 'text-zinc-500'} />
            Model Overview
          </span>
          <span class="text-[10px] text-zinc-700 font-mono font-semibold">91.2%</span>
        </a>
        <a
          href="/ml-analyst/confidence"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/ml-analyst/confidence') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Settings01Icon} size={14} class={isActive('/ml-analyst/confidence') ? 'text-zinc-900' : 'text-zinc-500'} />
            Confidence Gates
          </span>
          <span class="text-[10px] font-mono text-zinc-500">75% Gate</span>
        </a>
        <a
          href="/ml-analyst/confusion-matrix"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/ml-analyst/confusion-matrix') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Analytics01Icon} size={14} class={isActive('/ml-analyst/confusion-matrix') ? 'text-zinc-900' : 'text-zinc-500'} />
            Confusion Matrix
          </span>
          <span class="text-[10px] text-zinc-400 font-mono">5×5</span>
        </a>
      </div>

      <!-- Section: Models & Datasets -->
      <div class="space-y-0.5 pt-2 border-t border-zinc-100">
        <div class="px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Models & Data
        </div>
        <a
          href="/ml-analyst/versions"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/ml-analyst/versions') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Clock01Icon} size={14} class={isActive('/ml-analyst/versions') ? 'text-zinc-900' : 'text-zinc-500'} />
            Model Checkpoints
          </span>
          <span class="text-[10px] font-mono text-zinc-400">3 builds</span>
        </a>
        <a
          href="/ml-analyst/mismatches"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/ml-analyst/mismatches') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Search01Icon} size={14} class={isActive('/ml-analyst/mismatches') ? 'text-zinc-900' : 'text-zinc-500'} />
            Mislabeled Queue
          </span>
          <span class="text-[10px] font-mono font-semibold bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">4</span>
        </a>
        <a
          href="/ml-analyst/dataset"
          class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors {isActive('/ml-analyst/dataset') ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
        >
          <span class="flex items-center gap-2">
            <HugeIcon icon={Folder01Icon} size={14} class={isActive('/ml-analyst/dataset') ? 'text-zinc-900' : 'text-zinc-500'} />
            Dataset Splits
          </span>
          <span class="text-[10px] font-mono text-zinc-400">18.7k imgs</span>
        </a>
      </div>
    </div>

    <!-- Rail Footer -->
    <div class="p-3 border-t border-zinc-200 bg-white">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded bg-zinc-100 border border-zinc-300 flex items-center justify-center text-zinc-900 text-xs font-semibold font-mono">
          DS
        </div>
        <div class="truncate">
          <div class="text-xs font-semibold text-zinc-900 truncate">Dr. Shira P.</div>
          <div class="text-[10px] text-zinc-500 truncate font-mono">shira.p@t2t.internal</div>
        </div>
      </div>
      <div class="mt-2 flex items-center justify-between">
        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 font-mono">
          ML Vision Lead
        </span>
        <span class="text-[10px] text-zinc-400 font-mono">PyTorch 2.3</span>
      </div>
    </div>
  </aside>

  <!-- MAIN SUB-ROUTE WORKSPACE -->
  <main class="flex-1 flex flex-col min-w-0">
    <header class="h-12 border-b border-zinc-200 bg-white px-6 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2.5 text-xs">
        <a href="/" class="text-zinc-400 hover:text-zinc-900 font-mono">T2T</a>
        <span class="text-zinc-300">/</span>
        <a href="/ml-analyst" class="text-zinc-500 hover:text-zinc-900">Computer Vision</a>
        <span class="text-zinc-300">/</span>
        <span class="text-zinc-900 font-semibold">{pageTitle}</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-[11px] font-mono text-zinc-600 bg-zinc-50 px-2.5 py-1 rounded border border-zinc-200">
          Current Model: <strong>v2.4.1 (ONNX)</strong>
        </span>
      </div>
    </header>

    <div class="flex-1 p-6 overflow-y-auto">
      {@render children?.()}
    </div>
  </main>
</div>
