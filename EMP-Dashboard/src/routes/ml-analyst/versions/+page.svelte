<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { Clock01Icon, CheckmarkCircle01Icon, RotateLeft01Icon } from '@hugeicons/core-free-icons';

  let models = $state([
    { name: 'YOLOv8-Waste v2.4.1', type: 'Production', mAP: '91.2%', latency: '18.2ms', samples: '18.7k', deployedAt: 'Active' },
    { name: 'YOLOv8-Waste v2.4.2-rc1', type: 'Staging', mAP: '92.4%', latency: '17.9ms', samples: '22.1k', deployedAt: '4d ago' },
    { name: 'YOLOv8-Waste v2.4.0', type: 'Archived', mAP: '89.6%', latency: '19.4ms', samples: '14.2k', deployedAt: '18d ago' },
    { name: 'YOLOv7-Backbone v1.9', type: 'Archived', mAP: '84.1%', latency: '26.8ms', samples: '10.5k', deployedAt: '2m ago' }
  ]);

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handlePromote(name: string) {
    models.forEach(m => {
      if (m.name === name) m.type = 'Production';
      else if (m.type === 'Production') m.type = 'Archived';
    });
    toast(`Promoted ${name} to Production! Rolling out across Triton GPU worker pods.`);
  }
</script>

<svelte:head>
  <title>Model Checkpoints & Deploys — T2T ML Analyst</title>
</svelte:head>

<div class="space-y-6">
  {#if toastMsg}
    <div class="bg-zinc-900 text-white text-xs px-4 py-2.5 rounded flex items-center justify-between transition-all font-mono">
      <div class="flex items-center gap-2">
        <HugeIcon icon={CheckmarkCircle01Icon} size={14} class="text-zinc-200" />
        <span>{toastMsg}</span>
      </div>
      <button onclick={() => (toastMsg = null)} class="text-zinc-400 hover:text-white text-xs">Dismiss</button>
    </div>
  {/if}

  <div>
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">YOLO Model Checkpoints & Production Deploys</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Model weights registry, staging candidates, and one-click blue/green canary promotions.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Model Tag</th>
            <th class="py-2.5 px-3">Environment</th>
            <th class="py-2.5 px-3">mAP@50-95</th>
            <th class="py-2.5 px-3">p95 Latency</th>
            <th class="py-2.5 px-3">Dataset Samples</th>
            <th class="py-2.5 px-3">Deploy Status</th>
            <th class="py-2.5 px-3 text-right">Canary Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each models as m}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-semibold text-zinc-900">{m.name}</td>
              <td class="py-3 px-3">
                <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono {m.type === 'Production' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold' : m.type === 'Staging' ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'}">
                  {m.type}
                </span>
              </td>
              <td class="py-3 px-3 font-bold text-zinc-900">{m.mAP}</td>
              <td class="py-3 px-3 text-zinc-700">{m.latency}</td>
              <td class="py-3 px-3 text-zinc-600">{m.samples}</td>
              <td class="py-3 px-3 text-zinc-500 font-sans">{m.deployedAt}</td>
              <td class="py-3 px-3 text-right font-sans">
                {#if m.type === 'Staging'}
                  <Button onclick={() => handlePromote(m.name)} size="sm" class="text-[11px] h-6 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-white">
                    Promote to Prod
                  </Button>
                {:else if m.type === 'Production'}
                  <span class="text-[10px] text-emerald-700 font-mono font-bold">Serving Traffic</span>
                {:else}
                  <Button onclick={() => handlePromote(m.name)} variant="outline" size="sm" class="text-[11px] h-6 px-2 border-zinc-200 text-zinc-600">
                    Rollback
                  </Button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
