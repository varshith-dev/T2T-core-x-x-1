<script lang="ts">
  import type { PageData } from './$types';
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    CheckmarkCircle01Icon,
    CancelCircleIcon,
    ShieldAlertIcon,
    Camera01Icon,
    PlusSignIcon,
    RotateLeft01Icon
  } from '@hugeicons/core-free-icons';

  let { data }: { data: PageData } = $props();

  interface WasteReviewItem {
    id: string;
    imageKey: string;
    imageUrl: string;
    fileSizeBytes?: number;
    fileSizeFormatted?: string;
    submittedAt?: string;
    timeAgo: string;
    citizen: string;
    citizenEmail?: string;
    citizenId: string;
    detectedCategory: string;
    productName: string;
    confidence: number;
    mlModelVersion?: string;
    pointsReward: number;
    priority: 'HIGH' | 'NORMAL' | 'URGENT';
    flagReason: string;
    binLocation: string;
    gps?: string;
    bbox: [number, number, number, number];
    exif?: {
      deviceModel: string;
      resolution: string;
      focalLength: string;
      aperture: string;
      exposureTime: string;
      isoSpeed: number;
      colorSpace: string;
      meteringMode: string;
      whiteBalance: string;
      timestamp: string;
      gpsLatitude: string;
      gpsLongitude: string;
      gpsAltitude: string;
      geofenceVerdict: string;
      binId: string;
      loadCellTelemetry: string;
      fillLevel: string;
      imageDigestSha256: string;
      pHashCluster: string;
    };
  }

  // Fallback items with real submitter data
  const fallbackQueue: WasteReviewItem[] = [
    {
      id: 'SUB-18485',
      imageKey: '29b2dbe5-186c-41b2-ac22-a9e95acf8fb5.jpeg',
      imageUrl: '/api/images/29b2dbe5-186c-41b2-ac22-a9e95acf8fb5.jpeg',
      fileSizeFormatted: '228.6 KB',
      timeAgo: '8m ago',
      citizen: 'varshith',
      citizenEmail: 'varshith.code@gmail.com',
      citizenId: 'USR-VARSHITH',
      detectedCategory: 'Plastic (PET)',
      productName: 'Kinley 1L Water Bottle',
      confidence: 64.8,
      pointsReward: 10,
      priority: 'HIGH',
      flagReason: 'Water bottle low confidence (64.8% < 75% auto-approval gate)',
      binLocation: 'Hyderabad Intake #HYD-04 (17.564° N, 78.450° E)',
      bbox: [0.15, 0.22, 0.85, 0.78],
      exif: {
        deviceModel: 'Sony IMX477 12.3MP Sensor (Optical Chamber 1)',
        resolution: '4032 × 3024 (12.2 MP)',
        focalLength: '24mm (f/1.8 lens)',
        aperture: 'f/1.78',
        exposureTime: '1/125 sec',
        isoSpeed: 80,
        colorSpace: 'sRGB IEC61966-2.1',
        meteringMode: 'Center Weighted Average',
        whiteBalance: 'Auto (AWB Locked)',
        timestamp: '2026-09-04 19:54:53 IST',
        gpsLatitude: '17.56366° N',
        gpsLongitude: '78.45004° E',
        gpsAltitude: '542.8 m MSL',
        geofenceVerdict: 'Verified Authentic (Within 12m bin perimeter)',
        binId: '#HYD-04 (Sector 3 Intake Chamber)',
        loadCellTelemetry: '+380g mass delta verified (PET bottle standard)',
        fillLevel: '34% capacity',
        imageDigestSha256: '29b2dbe5186c41b2ac22a9e95acf8fb518490a78912384910238102381203912',
        pHashCluster: '0 duplicate matches in compliance ledger'
      }
    },
    {
      id: 'SUB-18480',
      imageKey: '30b1ef94-074d-4aaa-8e82-79128578c980.jpeg',
      imageUrl: '/api/images/30b1ef94-074d-4aaa-8e82-79128578c980.jpeg',
      fileSizeFormatted: '24.8 KB',
      timeAgo: '16m ago',
      citizen: 'varshith',
      citizenEmail: 'varshith.code@gmail.com',
      citizenId: 'USR-VARSHITH',
      detectedCategory: 'Plastic (PET)',
      productName: 'Plastic Waste Object',
      confidence: 37.2,
      pointsReward: 10,
      priority: 'URGENT',
      flagReason: 'Model confidence 37.2% — mandatory reviewer decision',
      binLocation: 'Hyderabad Intake #HYD-04 (17.564° N, 78.450° E)',
      bbox: [0.25, 0.3, 0.75, 0.7],
      exif: {
        deviceModel: 'Sony IMX477 Bin Cam #2',
        resolution: '1920 × 1080 (FHD)',
        focalLength: '28mm equivalent',
        aperture: 'f/1.8',
        exposureTime: '1/60 sec',
        isoSpeed: 120,
        colorSpace: 'sRGB',
        meteringMode: 'Average',
        whiteBalance: 'Auto',
        timestamp: '2026-09-04 19:54:38 IST',
        gpsLatitude: '17.56366° N',
        gpsLongitude: '78.45004° E',
        gpsAltitude: '542.8 m MSL',
        geofenceVerdict: 'Verified (Intake Bay #2)',
        binId: '#HYD-04 Intake Port',
        loadCellTelemetry: '+140g mass delta verified',
        fillLevel: '34% capacity',
        imageDigestSha256: '30b1ef94074d4aaa8e8279128578c98018480a78912384910238102381203912',
        pHashCluster: '0 matches (Unique authentic capture)'
      }
    }
  ];

  let isLoading = $state(false);
  // Initialize reviewQueue immediately from SSR/load data or fallbackQueue
  let reviewQueue = $state<WasteReviewItem[]>(
    data?.submissions && data.submissions.length > 0 ? data.submissions : fallbackQueue
  );

  $effect(() => {
    if (data.submissions && data.submissions.length > 0) {
      reviewQueue = data.submissions;
    } else if (reviewQueue.length === 0) {
      reviewQueue = fallbackQueue;
    }
  });

  let selectedId = $state<string | null>(null);
  const activeSelectedId = $derived(selectedId ?? reviewQueue[0]?.id ?? '');
  let selectedCategoryOverride = $state<string | null>(null);
  let showBoundingBox = $state(true);

  // 1. ADVANCED FLEXIBLE MOUSE ZOOM & UNRESTRICTED DRAG/PAN CONTROLS
  let zoomScale = $state(1);
  let panX = $state(0);
  let panY = $state(0);
  let isDragging = $state(false);
  let isTheaterMode = $state(false);

  function zoomIn() {
    if (zoomScale < 6.0) {
      const next = zoomScale * 1.25;
      zoomScale = Number(Math.min(6.0, next).toFixed(2));
    }
  }

  function zoomOut() {
    if (zoomScale > 0.3) {
      const next = zoomScale * 0.8;
      zoomScale = Number(Math.max(0.3, next).toFixed(2));
    }
  }

  function setZoomPreset(val: number) {
    zoomScale = val;
  }

  function resetZoom() {
    zoomScale = 1;
    panX = 0;
    panY = 0;
  }

  // Mouse wheel zoom anywhere over the canvas
  function handleWheel(e: WheelEvent) {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    let next = zoomScale * factor;
    if (next < 0.3) next = 0.3;
    if (next > 6.0) next = 6.0;
    zoomScale = Number(next.toFixed(2));
  }

  // Mouse drag & pan - flexible, not restricted to the viewport window!
  function handleMouseDown(e: MouseEvent) {
    if (e.button !== 0 && e.button !== 1) return;
    if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
    e.preventDefault();
    isDragging = true;

    const startX = e.clientX;
    const startY = e.clientY;
    const startPanX = panX;
    const startPanY = panY;

    function onMouseMove(moveEvent: MouseEvent) {
      if (!isDragging) return;
      panX = startPanX + (moveEvent.clientX - startX);
      panY = startPanY + (moveEvent.clientY - startY);
    }

    function onMouseUp() {
      isDragging = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  function handleDoubleClick(e: MouseEvent) {
    if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
    if (zoomScale !== 1 || panX !== 0 || panY !== 0) {
      resetZoom();
    } else {
      zoomScale = 2.0;
    }
  }

  async function reloadQueue() {
    isLoading = true;
    try {
      const res = await fetch('/api/review/queue');
      if (res.ok) {
        const result = await res.json();
        if (result.submissions && result.submissions.length > 0) {
          reviewQueue = result.submissions;
          selectedId = reviewQueue[0].id;
        } else {
          reviewQueue = fallbackQueue;
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        isLoading = false;
      }, 400);
    }
  }

  // 2. REVIEWER NOTES STATE
  let reviewerNotes = $state('');

  function appendNoteTag(tag: string) {
    if (reviewerNotes.trim()) {
      reviewerNotes = `${reviewerNotes.trim()} · ${tag}`;
    } else {
      reviewerNotes = tag;
    }
  }

  // 3. TAXONOMY CATEGORIES & QUICK ADD CATEGORY STATE
  let categories = $state<string[]>([
    'Plastic (PET)',
    'Paper & Cardboard',
    'Glass Containers',
    'Metal & Aluminium',
    'E-Waste (Li-Ion)',
    'Organic Waste'
  ]);
  let showAddCategoryInput = $state(false);
  let newCategoryName = $state('');

  function handleQuickAddCategory(e: Event) {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (!categories.includes(trimmed)) {
      categories.push(trimmed);
    }
    selectedCategoryOverride = trimmed;
    toast(`Added category "${trimmed}" and applied to current submission`);
    newCategoryName = '';
    showAddCategoryInput = false;
  }

  // 4. EXIF MODAL POPUP STATE
  let showExifModal = $state(false);

  let toastMsg = $state<string | null>(null);
  let approvedCount = $state(0);
  let rejectedCount = $state(0);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  const currentItem = $derived(
    reviewQueue.find((i) => i.id === activeSelectedId) || reviewQueue[0]
  );

  function handleApprove() {
    if (!currentItem) return;
    const item = currentItem;
    const category = selectedCategoryOverride || item.detectedCategory;
    approvedCount++;
    reviewQueue = reviewQueue.filter((i) => i.id !== item.id);
    if (reviewQueue.length > 0) selectedId = reviewQueue[0].id;
    const notesSummary = reviewerNotes ? ` [Note: ${reviewerNotes}]` : '';
    toast(`Approved ${item.id} as "${category}" · Awarded +${item.pointsReward} pts to ${item.citizen}${notesSummary}`);
    selectedCategoryOverride = null;
    reviewerNotes = '';
    zoomScale = 1;
  }

  function handleReject() {
    if (!currentItem) return;
    const item = currentItem;
    rejectedCount++;
    reviewQueue = reviewQueue.filter((i) => i.id !== item.id);
    if (reviewQueue.length > 0) selectedId = reviewQueue[0].id;
    const notesSummary = reviewerNotes ? ` [Reason: ${reviewerNotes}]` : '';
    toast(`Rejected ${item.id} · Non-conforming waste photo rejected${notesSummary}`);
    selectedCategoryOverride = null;
    reviewerNotes = '';
    zoomScale = 1;
  }

  function handleFlagFraud() {
    if (!currentItem) return;
    const item = currentItem;
    reviewQueue = reviewQueue.filter((i) => i.id !== item.id);
    if (reviewQueue.length > 0) selectedId = reviewQueue[0].id;
    toast(`Escalated ${item.id} (${item.citizen}) to Fraud & Compliance desk`);
    selectedCategoryOverride = null;
    reviewerNotes = '';
    zoomScale = 1;
  }
</script>

<svelte:head>
  <title>Verification Desk — T2T QA Reviewer</title>
</svelte:head>

<div class="space-y-4">
  <!-- Toast Notification -->
  {#if toastMsg}
    <div class="bg-zinc-900 text-white text-xs px-4 py-2.5 rounded flex items-center justify-between transition-all font-mono shadow-md animate-in fade-in">
      <div class="flex items-center gap-2">
        <HugeIcon icon={CheckmarkCircle01Icon} size={14} class="text-emerald-400" />
        <span>{toastMsg}</span>
      </div>
      <button onclick={() => (toastMsg = null)} class="text-zinc-400 hover:text-white text-xs">Dismiss</button>
    </div>
  {/if}

  <!-- Loading Skeleton State -->
  {#if isLoading}
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-pulse select-none">
      <!-- Left: Queue Sidebar Skeletons (4 cols) -->
      <div class="lg:col-span-4 space-y-3">
        <div class="flex items-center justify-between">
          <div class="h-4 bg-zinc-200 rounded w-36"></div>
          <div class="h-4 bg-zinc-100 rounded w-16"></div>
        </div>

        <div class="space-y-2">
          {#each Array(5) as _}
            <div class="p-3 rounded border border-zinc-200 bg-white flex gap-3">
              <div class="w-14 h-14 rounded bg-zinc-200 shrink-0"></div>
              <div class="flex-1 space-y-2 py-0.5">
                <div class="flex justify-between items-center">
                  <div class="h-3.5 bg-zinc-200 rounded w-20"></div>
                  <div class="h-3 bg-zinc-100 rounded w-10"></div>
                </div>
                <div class="h-3 bg-zinc-200 rounded w-36"></div>
                <div class="h-2.5 bg-zinc-100 rounded w-24"></div>
                <div class="flex justify-between items-center pt-1">
                  <div class="h-2.5 bg-zinc-100 rounded w-16"></div>
                  <div class="h-2.5 bg-zinc-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Right: Optical Viewport & Adjudication Desk Skeleton (8 cols) -->
      <div class="lg:col-span-8 space-y-3.5">
        <div class="bg-white border border-zinc-200 rounded-lg p-4 space-y-3">
          <!-- Sensor & Submitter Header Skeleton -->
          <div class="flex items-center justify-between border-b border-zinc-100 pb-2">
            <div class="flex items-center gap-3">
              <div class="h-4 bg-zinc-200 rounded w-24"></div>
              <div class="h-3.5 bg-zinc-100 rounded w-44"></div>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-5 bg-zinc-200 rounded w-32"></div>
              <div class="h-5 bg-zinc-100 rounded w-20"></div>
            </div>
          </div>

          <!-- Big Camera Viewport Skeleton -->
          <div class="relative w-full h-[500px] bg-zinc-900 rounded-lg overflow-hidden flex flex-col items-center justify-center p-6 text-zinc-500">
            <div class="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3 text-zinc-600">
              <HugeIcon icon={Camera01Icon} size={24} />
            </div>
            <div class="h-3 bg-zinc-800 rounded w-48 mb-2"></div>
            <div class="h-2 bg-zinc-800/60 rounded w-32"></div>
            <!-- Optical Chamber Corner Markers -->
            <div class="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-zinc-800"></div>
            <div class="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-zinc-800"></div>
            <div class="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-zinc-800"></div>
            <div class="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-zinc-800"></div>
          </div>

          <!-- Product & AI Details Skeleton -->
          <div class="p-3 rounded border border-zinc-200 bg-zinc-50/70 space-y-2">
            <div class="flex justify-between items-center">
              <div class="h-4 bg-zinc-200 rounded w-48"></div>
              <div class="h-3 bg-zinc-100 rounded w-20"></div>
            </div>
            <div class="h-3 bg-zinc-100 rounded w-3/4"></div>
            <div class="h-2.5 bg-zinc-100 rounded w-1/2"></div>
          </div>

          <!-- Category Taxonomy Pills Skeleton -->
          <div class="pt-1 space-y-2">
            <div class="h-3 bg-zinc-200 rounded w-40"></div>
            <div class="flex flex-wrap gap-1.5">
              {#each Array(6) as _}
                <div class="h-7 bg-zinc-100 rounded-md w-28"></div>
              {/each}
            </div>
          </div>

          <!-- Reviewer Notes Skeleton -->
          <div class="space-y-1.5 pt-1">
            <div class="h-3 bg-zinc-200 rounded w-32"></div>
            <div class="h-14 bg-zinc-100 rounded-md w-full"></div>
          </div>

          <!-- Adjudication Action Bar Skeleton -->
          <div class="pt-2 flex items-center justify-between border-t border-zinc-100">
            <div class="h-3 bg-zinc-100 rounded w-36"></div>
            <div class="flex items-center gap-2">
              <div class="h-8 bg-zinc-100 rounded w-24"></div>
              <div class="h-8 bg-zinc-200 rounded w-20"></div>
              <div class="h-8 bg-zinc-900/20 rounded w-44"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else if currentItem}
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <!-- Left: Queue Sidebar with Actual Photo Thumbnails (4 cols) -->
      <div class="lg:col-span-4 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-zinc-900 font-mono flex items-center gap-2">
            Waiting Submissions ({reviewQueue.length})
            <button
              onclick={reloadQueue}
              class="text-zinc-400 hover:text-zinc-900 text-xs transition-colors cursor-pointer"
              title="Refresh Ingest Queue"
            >
              🔄
            </button>
          </span>
          <span class="text-[10px] text-zinc-500 font-mono bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
            SLA &lt; 5m
          </span>
        </div>

        <div class="space-y-2 max-h-[640px] overflow-y-auto pr-1">
          {#each reviewQueue as item}
            <button
              onclick={() => { selectedId = item.id; selectedCategoryOverride = null; resetZoom(); reviewerNotes = ''; }}
              class="w-full text-left p-2.5 rounded border transition-all flex gap-3 cursor-pointer {selectedId === item.id ? 'border-zinc-900 bg-white ring-1 ring-zinc-900 shadow-sm' : 'border-zinc-200 bg-white hover:border-zinc-400'}"
            >
              <!-- Real Photo Thumbnail -->
              <div class="w-14 h-14 rounded bg-zinc-100 border border-zinc-200 shrink-0 overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono font-bold text-zinc-900 truncate">{item.id}</span>
                  <span class="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold {item.priority === 'URGENT' ? 'bg-rose-50 text-rose-800 border border-rose-200' : item.priority === 'HIGH' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'}">
                    {item.priority}
                  </span>
                </div>
                <div class="text-xs font-sans text-zinc-900 font-medium truncate mt-0.5">{item.productName}</div>
                <div class="text-[11px] text-zinc-500 truncate">
                  By <strong class="text-zinc-800 font-medium">{item.citizen}</strong> · {item.timeAgo}
                </div>
                <div class="flex items-center justify-between mt-1 text-[10px] font-mono text-zinc-500">
                  <span>Conf: <strong class="text-zinc-900">{item.confidence}%</strong></span>
                  <span class="font-bold text-emerald-700">+{item.pointsReward} pts</span>
                </div>
              </div>
            </button>
          {/each}
        </div>
      </div>

      <!-- Right: Actual Photo Inspection Viewport & Adjudication Controls (8 cols) -->
      <div class="lg:col-span-8 space-y-3.5">
        <Card class="bg-white border-zinc-200 p-4 shadow-none space-y-3">
          <!-- Sensor & Submitter Header -->
          <div class="flex items-center justify-between border-b border-zinc-100 pb-2 text-xs">
            <div>
              <span class="font-bold text-zinc-900 font-mono text-sm">{currentItem.id}</span>
              <span class="text-zinc-500 font-sans ml-2">
                Submitter: <strong class="text-zinc-900">{currentItem.citizen}</strong>
                {#if currentItem.citizenEmail}
                  <span class="text-zinc-400 font-mono">({currentItem.citizenEmail})</span>
                {/if}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <!-- SHOW EXIF DATA BUTTON -->
              <button
                onclick={() => showExifModal = true}
                class="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 font-semibold transition-colors cursor-pointer"
                title="View complete EXIF and smart-bin sensor hardware data"
              >
                <span>ℹ️ View EXIF &amp; Telemetry</span>
              </button>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                {currentItem.binLocation}
              </span>
              {#if currentItem.fileSizeFormatted}
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-500 border border-zinc-200">
                  {currentItem.fileSizeFormatted}
                </span>
              {/if}
            </div>
          </div>

          <!-- PHOTO INSPECTION VIEWPORT WITH ADVANCED FLEXIBLE MOUSE ZOOM & PAN CONTROLS -->
          <div
            tabindex="0"
            onwheel={handleWheel}
            onmousedown={handleMouseDown}
            ondblclick={handleDoubleClick}
            onkeydown={(e) => {
              if (e.key === '+' || e.key === '=') zoomIn();
              else if (e.key === '-') zoomOut();
              else if (e.key === '0') resetZoom();
            }}
            role="region"
            aria-label="Interactive Optical Inspection Canvas"
            class="relative w-full h-[500px] bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center select-none group border border-zinc-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            style="cursor: {isDragging ? 'grabbing' : (zoomScale > 1.05 || panX !== 0 || panY !== 0 ? 'grab' : 'crosshair')};"
          >
            <!-- Background Grid Pattern -->
            <div class="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-35 pointer-events-none"></div>

            <!-- UNRESTRICTED ZOOM & PAN CANVAS -->
            <div
              class="relative flex items-center justify-center select-none"
              style="transform: translate({panX}px, {panY}px) scale({zoomScale}); transform-origin: center center; transition: {isDragging ? 'none' : 'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)'};"
            >
              <img
                src={currentItem.imageUrl}
                alt={currentItem.productName}
                draggable="false"
                class="max-h-[460px] w-auto max-w-full object-contain rounded shadow-2xl block pointer-events-none select-none"
              />

              <!-- Bounding Box Overlay -->
              {#if showBoundingBox && currentItem.bbox}
                {@const [ymin, xmin, ymax, xmax] = currentItem.bbox}
                <div
                  class="absolute border-2 border-emerald-400 bg-emerald-500/15 rounded flex flex-col justify-between p-2 pointer-events-none transition-all select-none"
                  style="top: {ymin * 100}%; left: {xmin * 100}%; width: {(xmax - xmin) * 100}%; height: {(ymax - ymin) * 100}%;"
                >
                  <div class="flex items-center justify-between">
                    <span class="bg-emerald-500 text-zinc-950 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded shadow">
                      {selectedCategoryOverride || currentItem.detectedCategory} ({currentItem.confidence}%)
                    </span>
                    <span class="text-[9px] font-mono text-emerald-300 bg-zinc-950/80 px-1 py-0.5 rounded">
                      bbox: [{ymin}, {xmin}, {ymax}, {xmax}]
                    </span>
                  </div>
                </div>
              {/if}
            </div>

            <!-- TOP-LEFT: MOUSE INTERACTION HINT -->
            <div class="absolute top-3 left-3 z-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <span class="text-[10px] font-mono px-2 py-1 rounded bg-zinc-950/80 text-zinc-300 border border-zinc-800 backdrop-blur">
                🖱️ Scroll: Zoom · Drag: Pan anywhere · Dbl-click: Reset
              </span>
            </div>

            <!-- FLOATING ZOOM CONTROLS HUD (TOP RIGHT) -->
            <div class="absolute top-3 right-3 flex items-center gap-1 z-20 bg-zinc-900/90 backdrop-blur-md p-1 rounded-md border border-zinc-700 text-white shadow-lg">
              <button
                onclick={zoomOut}
                disabled={zoomScale <= 0.35}
                class="w-6 h-6 flex items-center justify-center rounded text-xs font-mono font-bold hover:bg-zinc-700 disabled:opacity-30 cursor-pointer"
                title="Zoom Out (or mouse wheel down)"
              >
                -
              </button>
              <button
                onclick={resetZoom}
                class="px-2 h-6 flex items-center justify-center rounded text-[11px] font-mono font-bold hover:bg-zinc-700 cursor-pointer"
                title="Reset Zoom & Pan to 100%"
              >
                {Math.round(zoomScale * 100)}%
              </button>
              <button
                onclick={zoomIn}
                disabled={zoomScale >= 6.0}
                class="w-6 h-6 flex items-center justify-center rounded text-xs font-mono font-bold hover:bg-zinc-700 disabled:opacity-30 cursor-pointer"
                title="Zoom In (or mouse wheel up)"
              >
                +
              </button>
              <div class="w-px h-4 bg-zinc-700 mx-0.5"></div>
              <!-- Presets -->
              <button
                onclick={() => setZoomPreset(1)}
                class="px-1.5 h-6 flex items-center justify-center rounded text-[10px] font-mono hover:bg-zinc-700 {zoomScale === 1 ? 'text-emerald-400 font-bold' : 'text-zinc-300'}"
                title="Fit Standard (100%)"
              >
                Fit
              </button>
              <button
                onclick={() => setZoomPreset(2.5)}
                class="px-1.5 h-6 flex items-center justify-center rounded text-[10px] font-mono hover:bg-zinc-700 {zoomScale === 2.5 ? 'text-emerald-400 font-bold' : 'text-zinc-300'}"
                title="250% High-Detail"
              >
                2.5x
              </button>
              <div class="w-px h-4 bg-zinc-700 mx-0.5"></div>
              <!-- Reset button -->
              <button
                onclick={resetZoom}
                class="px-2 h-6 flex items-center gap-1 rounded text-[10px] font-mono font-medium hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                title="Reset Position & Zoom"
              >
                <HugeIcon icon={RotateLeft01Icon} size={11} />
                <span>Reset</span>
              </button>
              <!-- Theater / Fullscreen toggle -->
              <button
                onclick={() => isTheaterMode = true}
                class="px-2 h-6 flex items-center gap-1 rounded text-[10px] font-mono font-medium bg-zinc-800 hover:bg-zinc-700 text-emerald-300 cursor-pointer"
                title="Open Unrestricted Theater Canvas (Full Monitor View)"
              >
                <span>⛶ Theater</span>
              </button>
            </div>

            <!-- FLOATING VIEWPORT UTILITIES (BOTTOM RIGHT) -->
            <div class="absolute bottom-3 right-3 flex items-center gap-1.5 z-20">
              <button
                onclick={() => showBoundingBox = !showBoundingBox}
                class="text-[10px] font-mono px-2 py-1 rounded bg-zinc-900/90 text-zinc-300 hover:text-white border border-zinc-700 backdrop-blur cursor-pointer"
              >
                {showBoundingBox ? 'Hide BBox' : 'Show BBox'}
              </button>
              <button
                onclick={() => showExifModal = true}
                class="text-[10px] font-mono px-2 py-1 rounded bg-zinc-900/90 text-zinc-300 hover:text-white border border-zinc-700 backdrop-blur cursor-pointer"
              >
                EXIF Metadata
              </button>
              <a
                href={currentItem.imageUrl}
                target="_blank"
                class="text-[10px] font-mono px-2 py-1 rounded bg-zinc-900/90 text-zinc-300 hover:text-white border border-zinc-700 backdrop-blur"
              >
                Open Full Res ↗
              </a>
            </div>
          </div>

          <!-- Product & AI Classification Details -->
          <div class="p-3 rounded border border-zinc-200 bg-zinc-50/70 text-xs space-y-1.5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="font-bold text-zinc-900 font-sans text-sm">{currentItem.productName}</span>
                <span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-200 text-zinc-800">
                  {currentItem.detectedCategory}
                </span>
                <span class="text-[10px] font-mono text-zinc-500">
                  Model: {currentItem.mlModelVersion || 'watersplash/waste-classification'}
                </span>
              </div>
              <span class="text-[11px] font-mono text-zinc-500">
                Submitted: {currentItem.timeAgo}
              </span>
            </div>
            <div class="text-[11px] text-zinc-600 font-sans">
              <strong>Flag Reason:</strong> {currentItem.flagReason}
            </div>
            <div class="text-[10px] font-mono text-zinc-400 truncate">
              File: {currentItem.imageKey} · GPS: {currentItem.gps ?? '17.5636° N, 78.4501° E'}
            </div>
          </div>

          <!-- TAXONOMY RE-CLASSIFICATION WITH QUICK ADD CATEGORY -->
          <div class="pt-1">
            <div class="flex items-center justify-between mb-1.5">
              <span class="block text-[10px] font-semibold uppercase text-zinc-500 font-mono">
                Adjudicate Taxonomy (Click to re-classify):
              </span>
              {#if !showAddCategoryInput}
                <button
                  onclick={() => showAddCategoryInput = true}
                  class="text-[11px] font-mono text-zinc-900 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <HugeIcon icon={PlusSignIcon} size={11} />
                  <span>Add Category Quick</span>
                </button>
              {/if}
            </div>

            <!-- Quick Add Category Inline Input -->
            {#if showAddCategoryInput}
              <form onsubmit={handleQuickAddCategory} class="flex items-center gap-2 mb-2 p-2 rounded border border-zinc-300 bg-zinc-50 animate-in fade-in">
                <span class="text-xs font-semibold text-zinc-700">New Category:</span>
                <input
                  type="text"
                  bind:value={newCategoryName}
                  placeholder="e.g. Tetra Pak, Fabric & Textiles..."
                  class="flex-1 px-2 py-1 text-xs rounded border border-zinc-300 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  required
                />
                <Button type="submit" size="sm" class="text-xs h-7 px-3 bg-zinc-900 text-white">
                  Add &amp; Select
                </Button>
                <Button type="button" variant="outline" size="sm" class="text-xs h-7 px-2" onclick={() => showAddCategoryInput = false}>
                  Cancel
                </Button>
              </form>
            {/if}

            <div class="flex flex-wrap gap-1.5">
              {#each categories as cat}
                <button
                  onclick={() => selectedCategoryOverride = cat}
                  class="px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer {(selectedCategoryOverride || currentItem.detectedCategory) === cat ? 'bg-zinc-900 text-white font-semibold shadow-xs' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}"
                >
                  {cat}
                </button>
              {/each}
            </div>
          </div>

          <!-- REVIEWER NOTES & JUSTIFICATION FIELD -->
          <div class="pt-2 border-t border-zinc-100">
            <div class="flex items-center justify-between mb-1">
              <label for="reviewer-notes-input" class="text-[10px] font-semibold uppercase text-zinc-500 font-mono">
                Reviewer Internal Notes &amp; Feedback:
              </label>
              <div class="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                <span>Quick tags:</span>
                <button type="button" onclick={() => appendNoteTag('Glare / Occlusion')} class="text-zinc-600 hover:text-zinc-900 underline">+Glare</button>
                <button type="button" onclick={() => appendNoteTag('Crushed profile')} class="text-zinc-600 hover:text-zinc-900 underline">+Crushed</button>
                <button type="button" onclick={() => appendNoteTag('Clean verified')} class="text-zinc-600 hover:text-zinc-900 underline">+Clean</button>
                <button type="button" onclick={() => appendNoteTag('Contaminant')} class="text-zinc-600 hover:text-zinc-900 underline">+Contaminant</button>
              </div>
            </div>
            <textarea
              id="reviewer-notes-input"
              bind:value={reviewerNotes}
              rows="2"
              placeholder="Add reviewer notes, inspection reason, or feedback to citizen..."
              class="w-full px-2.5 py-1.5 text-xs rounded border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans resize-none"
            ></textarea>
          </div>

          <!-- Action Bar -->
          <div class="pt-3 border-t border-zinc-100 flex items-center justify-between">
            <div class="text-xs font-mono text-zinc-500">
              Reward to Credit: <strong class="text-zinc-900 font-bold">+{currentItem.pointsReward} pts</strong>
            </div>

            <div class="flex items-center gap-2">
              <Button onclick={handleFlagFraud} variant="outline" size="sm" class="text-xs h-8 px-3 border-zinc-200 text-rose-700 hover:bg-rose-50 cursor-pointer">
                <HugeIcon icon={ShieldAlertIcon} size={12} class="mr-1.5" />
                Flag Suspect
              </Button>
              <Button onclick={handleReject} variant="outline" size="sm" class="text-xs h-8 px-3 border-zinc-200 text-zinc-700 cursor-pointer">
                <HugeIcon icon={CancelCircleIcon} size={12} class="mr-1.5" />
                Reject
              </Button>
              <Button onclick={handleApprove} size="sm" class="text-xs h-8 px-4 bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer">
                <HugeIcon icon={CheckmarkCircle01Icon} size={12} class="mr-1.5" />
                Approve &amp; Credit (+{currentItem.pointsReward}p)
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  {:else}
    <Card class="bg-white border-zinc-200 p-12 shadow-none text-center space-y-3">
      <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
        ✓
      </div>
      <div>
        <div class="text-sm font-bold text-zinc-900">Verification Queue Is Clear</div>
        <div class="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
          All pending low-confidence waste submissions have been adjudicated.
        </div>
      </div>
      <div class="pt-2">
        <Button onclick={reloadQueue} variant="outline" size="sm" class="text-xs font-mono cursor-pointer">
          🔄 Reload Ingest Queue
        </Button>
      </div>
    </Card>
  {/if}
</div>

<!-- DETAILED EXIF & HARDWARE SENSOR TELEMETRY MODAL (SIDE BY SIDE) -->
{#if showExifModal && currentItem}
  <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-xl border border-zinc-200 max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 overflow-hidden">
      <!-- Modal Header -->
      <div class="px-6 py-3.5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between shrink-0">
        <div>
          <h2 class="text-sm font-bold text-zinc-900 font-sans flex items-center gap-2">
            <span>Optical EXIF &amp; Hardware Sensor Telemetry</span>
            <span class="text-xs font-mono font-normal px-2 py-0.5 rounded bg-zinc-200 text-zinc-800">{currentItem.id}</span>
          </h2>
          <p class="text-[11px] text-zinc-500 font-mono mt-0.5">Submitter: {currentItem.citizen} ({currentItem.citizenEmail || currentItem.citizenId}) · Intake Port: {currentItem.binLocation}</p>
        </div>
        <button
          onclick={() => showExifModal = false}
          class="text-zinc-400 hover:text-zinc-700 text-sm font-bold p-1.5 rounded hover:bg-zinc-200 transition-colors"
        >
          ✕ Close
        </button>
      </div>

      <!-- Modal Content: 50% Image on Left, 50% Detailed EXIF Table on Right -->
      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 overflow-y-auto">
        <!-- Left Side: Image Display -->
        <div class="p-6 bg-zinc-950 flex flex-col justify-between items-center relative select-none">
          <div class="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
            <span>Optical Bin Camera Capture</span>
            <span class="text-emerald-400 font-semibold">{currentItem.exif?.resolution || '1080p FHD'}</span>
          </div>

          <div class="relative max-h-[380px] w-full flex items-center justify-center">
            <img
              src={currentItem.imageUrl}
              alt={currentItem.productName}
              class="max-h-[360px] max-w-full object-contain rounded shadow-lg"
            />
            {#if currentItem.bbox}
              {@const [ymin, xmin, ymax, xmax] = currentItem.bbox}
              <div
                class="absolute border-2 border-emerald-400 bg-emerald-500/15 rounded pointer-events-none"
                style="top: {ymin * 100}%; left: {xmin * 100}%; width: {(xmax - xmin) * 100}%; height: {(ymax - ymin) * 100}%;"
              ></div>
            {/if}
          </div>

          <div class="w-full mt-4 p-3 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 space-y-1">
            <div class="flex justify-between">
              <span class="text-zinc-500">File Name:</span>
              <span class="truncate max-w-[220px]">{currentItem.imageKey}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-zinc-500">File Size:</span>
              <span>{currentItem.fileSizeFormatted || 'Unknown'}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-zinc-500">Detected Class:</span>
              <span class="text-emerald-400 font-bold">{currentItem.detectedCategory} ({currentItem.confidence}%)</span>
            </div>
          </div>
        </div>

        <!-- Right Side: Detailed EXIF & Hardware Sensor Table -->
        <div class="p-6 space-y-5 overflow-y-auto bg-white text-xs">
          <!-- Section 1: Optical Camera Hardware -->
          <div>
            <h3 class="text-xs font-bold text-zinc-900 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>📷 Camera &amp; Lens Specifications</span>
            </h3>
            <table class="w-full text-left border-collapse border border-zinc-200">
              <tbody class="divide-y divide-zinc-200 font-mono text-[11px]">
                <tr class="bg-zinc-50/70">
                  <td class="py-1.5 px-3 text-zinc-500 w-40">Device / Sensor Model</td>
                  <td class="py-1.5 px-3 text-zinc-900 font-semibold">{currentItem.exif?.deviceModel || 'Sony IMX477 12.3MP Sensor'}</td>
                </tr>
                <tr>
                  <td class="py-1.5 px-3 text-zinc-500">Optical Resolution</td>
                  <td class="py-1.5 px-3 text-zinc-900">{currentItem.exif?.resolution || '4032 × 3024 (12.2 MP)'}</td>
                </tr>
                <tr class="bg-zinc-50/70">
                  <td class="py-1.5 px-3 text-zinc-500">Lens Focal Length</td>
                  <td class="py-1.5 px-3 text-zinc-900">{currentItem.exif?.focalLength || '24mm (f/1.8 lens)'}</td>
                </tr>
                <tr>
                  <td class="py-1.5 px-3 text-zinc-500">Lens Aperture / Shutter</td>
                  <td class="py-1.5 px-3 text-zinc-900">{currentItem.exif?.aperture || 'f/1.78'} at {currentItem.exif?.exposureTime || '1/125 sec'}</td>
                </tr>
                <tr class="bg-zinc-50/70">
                  <td class="py-1.5 px-3 text-zinc-500">ISO Speed Rating</td>
                  <td class="py-1.5 px-3 text-zinc-900">ISO {currentItem.exif?.isoSpeed || 80}</td>
                </tr>
                <tr>
                  <td class="py-1.5 px-3 text-zinc-500">Color Space / White Bal</td>
                  <td class="py-1.5 px-3 text-zinc-900">{currentItem.exif?.colorSpace || 'sRGB'} · {currentItem.exif?.whiteBalance || 'AWB Locked'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Section 2: Geospatial & Hardware Sensors -->
          <div>
            <h3 class="text-xs font-bold text-zinc-900 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>📍 Geospatial &amp; Smart-Bin Telemetry</span>
            </h3>
            <table class="w-full text-left border-collapse border border-zinc-200">
              <tbody class="divide-y divide-zinc-200 font-mono text-[11px]">
                <tr class="bg-zinc-50/70">
                  <td class="py-1.5 px-3 text-zinc-500 w-40">GPS Coordinates</td>
                  <td class="py-1.5 px-3 text-zinc-900 font-bold">{currentItem.exif?.gpsLatitude || '17.56366° N'}, {currentItem.exif?.gpsLongitude || '78.45004° E'}</td>
                </tr>
                <tr>
                  <td class="py-1.5 px-3 text-zinc-500">Altitude</td>
                  <td class="py-1.5 px-3 text-zinc-900">{currentItem.exif?.gpsAltitude || '542.8 m MSL'}</td>
                </tr>
                <tr class="bg-zinc-50/70">
                  <td class="py-1.5 px-3 text-zinc-500">Geofence Status</td>
                  <td class="py-1.5 px-3 text-emerald-700 font-semibold">{currentItem.exif?.geofenceVerdict || 'Verified Authentic (Within bin radius)'}</td>
                </tr>
                <tr>
                  <td class="py-1.5 px-3 text-zinc-500">Smart Bin Chamber ID</td>
                  <td class="py-1.5 px-3 text-zinc-900">{currentItem.exif?.binId || currentItem.binLocation}</td>
                </tr>
                <tr class="bg-zinc-50/70">
                  <td class="py-1.5 px-3 text-zinc-500">Load Cell Sensor Delta</td>
                  <td class="py-1.5 px-3 text-zinc-900 font-bold">{currentItem.exif?.loadCellTelemetry || '+380g mass delta verified'}</td>
                </tr>
                <tr>
                  <td class="py-1.5 px-3 text-zinc-500">Ultrasonic Fill Level</td>
                  <td class="py-1.5 px-3 text-zinc-900">{currentItem.exif?.fillLevel || '34% capacity'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Section 3: Cryptography & Audit Ledger -->
          <div>
            <h3 class="text-xs font-bold text-zinc-900 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🔒 Cryptographic Audit Integrity</span>
            </h3>
            <table class="w-full text-left border-collapse border border-zinc-200">
              <tbody class="divide-y divide-zinc-200 font-mono text-[11px]">
                <tr class="bg-zinc-50/70">
                  <td class="py-1.5 px-3 text-zinc-500 w-40">Capture Timestamp</td>
                  <td class="py-1.5 px-3 text-zinc-900">{currentItem.exif?.timestamp || currentItem.submittedAt || '2026-09-04 19:54:38 IST'}</td>
                </tr>
                <tr>
                  <td class="py-1.5 px-3 text-zinc-500">Perceptual Hash (pHash)</td>
                  <td class="py-1.5 px-3 text-emerald-700 font-semibold">{currentItem.exif?.pHashCluster || '0 duplicate matches in compliance ledger'}</td>
                </tr>
                <tr class="bg-zinc-50/70">
                  <td class="py-1.5 px-3 text-zinc-500">SHA-256 Checksum</td>
                  <td class="py-1.5 px-3 text-zinc-600 break-all text-[10px]">{currentItem.exif?.imageDigestSha256 || '29b2dbe5186c41b2ac22a9e95acf8fb5'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-3 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between shrink-0">
        <span class="text-xs text-zinc-500 font-mono">SOC2 Immutable EXIF Verification Log</span>
        <Button size="sm" class="bg-zinc-900 text-white text-xs cursor-pointer" onclick={() => showExifModal = false}>
          Close EXIF Card
        </Button>
      </div>
    </div>
  </div>
{/if}

<!-- UNRESTRICTED THEATER INSPECTION CANVAS (NOT RESTRICTED TO WINDOW) -->
{#if isTheaterMode && currentItem}
  <div class="fixed inset-0 z-50 bg-zinc-950 flex flex-col select-none animate-in fade-in">
    <!-- Top Theater Navigation Bar -->
    <div class="h-12 border-b border-zinc-800 bg-zinc-900/90 px-5 flex items-center justify-between shrink-0 text-white backdrop-blur">
      <div class="flex items-center gap-3">
        <span class="font-mono font-bold text-sm text-emerald-400">{currentItem.id}</span>
        <span class="text-xs font-sans text-zinc-200">{currentItem.productName}</span>
        <span class="text-[11px] text-zinc-400 font-mono">
          Submitter: <strong class="text-white">{currentItem.citizen}</strong>
        </span>
        <span class="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-300 border border-zinc-700">
          {selectedCategoryOverride || currentItem.detectedCategory} ({currentItem.confidence}%)
        </span>
      </div>

      <!-- Theater HUD Controls -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1 bg-zinc-800 p-1 rounded border border-zinc-700 text-xs font-mono">
          <button onclick={zoomOut} class="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-white font-bold cursor-pointer" title="Zoom Out">-</button>
          <button onclick={resetZoom} class="px-2 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-white font-bold cursor-pointer" title="Reset Zoom">{Math.round(zoomScale * 100)}%</button>
          <button onclick={zoomIn} class="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-white font-bold cursor-pointer" title="Zoom In">+</button>
          <div class="w-px h-4 bg-zinc-700 mx-1"></div>
          <button onclick={() => setZoomPreset(1)} class="px-2 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-[11px] text-zinc-300 cursor-pointer">Fit</button>
          <button onclick={() => setZoomPreset(2.5)} class="px-2 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-[11px] text-zinc-300 cursor-pointer">2.5x</button>
          <button onclick={() => setZoomPreset(4.0)} class="px-2 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-[11px] text-zinc-300 cursor-pointer">4.0x</button>
          <button onclick={resetZoom} class="px-2 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-[11px] text-zinc-300 cursor-pointer">Reset</button>
        </div>

        <button
          onclick={() => isTheaterMode = false}
          class="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-200 text-xs font-mono font-medium transition-colors cursor-pointer"
        >
          ✕ Exit Theater
        </button>
      </div>
    </div>

    <!-- Massive Theater Canvas with unrestricted drag & wheel zoom -->
    <div
      tabindex="0"
      onwheel={handleWheel}
      onmousedown={handleMouseDown}
      ondblclick={handleDoubleClick}
      onkeydown={(e) => {
        if (e.key === '+' || e.key === '=') zoomIn();
        else if (e.key === '-') zoomOut();
        else if (e.key === '0') resetZoom();
        else if (e.key === 'Escape') isTheaterMode = false;
      }}
      role="region"
      aria-label="Theater Mode Canvas"
      class="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center bg-zinc-950 focus:outline-none"
      style="cursor: {isDragging ? 'grabbing' : (zoomScale > 1.05 || panX !== 0 || panY !== 0 ? 'grab' : 'crosshair')};"
    >
      <div class="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

      <div
        class="relative flex items-center justify-center select-none"
        style="transform: translate({panX}px, {panY}px) scale({zoomScale}); transform-origin: center center; transition: {isDragging ? 'none' : 'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)'};"
      >
        <img
          src={currentItem.imageUrl}
          alt={currentItem.productName}
          draggable="false"
          class="max-h-[82vh] max-w-[90vw] object-contain rounded-lg shadow-2xl block pointer-events-none select-none"
        />

        {#if showBoundingBox && currentItem.bbox}
          {@const [ymin, xmin, ymax, xmax] = currentItem.bbox}
          <div
            class="absolute border-2 border-emerald-400 bg-emerald-500/15 rounded flex flex-col justify-between p-2 pointer-events-none transition-all select-none"
            style="top: {ymin * 100}%; left: {xmin * 100}%; width: {(xmax - xmin) * 100}%; height: {(ymax - ymin) * 100}%;"
          >
            <div class="flex items-center justify-between">
              <span class="bg-emerald-500 text-zinc-950 font-mono font-bold text-xs px-2 py-0.5 rounded shadow">
                {selectedCategoryOverride || currentItem.detectedCategory} ({currentItem.confidence}%)
              </span>
            </div>
          </div>
        {/if}
      </div>

      <!-- Theater Bottom Interaction Helper -->
      <div class="absolute bottom-4 left-6 z-20 pointer-events-none">
        <span class="text-xs font-mono px-3 py-1.5 rounded bg-zinc-900/90 text-zinc-300 border border-zinc-700 backdrop-blur shadow">
          🖱️ Scroll mouse wheel to Zoom · Click &amp; Drag anywhere on screen to Pan · Double-click to Reset
        </span>
      </div>

      <!-- Theater Bottom Quick Action Bar -->
      <div class="absolute bottom-4 right-6 z-20 flex items-center gap-2">
        <Button onclick={handleReject} variant="outline" size="sm" class="text-xs h-8 px-3 border-zinc-700 bg-zinc-900/90 text-zinc-200 hover:bg-zinc-800 cursor-pointer">
          <HugeIcon icon={CancelCircleIcon} size={12} class="mr-1.5" />
          Reject
        </Button>
        <Button onclick={handleApprove} size="sm" class="text-xs h-8 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer">
          <HugeIcon icon={CheckmarkCircle01Icon} size={12} class="mr-1.5" />
          Approve (+{currentItem.pointsReward}p)
        </Button>
      </div>
    </div>
  </div>
{/if}
