<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    Activity01Icon,
    RotateLeft01Icon,
    CheckmarkCircle01Icon,
    CpuIcon,
    File01Icon
  } from '@hugeicons/core-free-icons';

  interface Microservice {
    name: string;
    description: string;
    endpoint: string;
    status: 'Healthy' | 'Restarting';
    latency: string;
    uptime: string;
    cpu: string;
    memory: string;
  }

  let services = $state<Microservice[]>([
    { name: 'API Server', description: 'FastAPI REST Ingestion & Gateway', endpoint: 'api.t2t.internal:8000', status: 'Healthy', latency: '42 ms', uptime: '99.99%', cpu: '18%', memory: '1.2 / 8 GB' },
    { name: 'PostgreSQL Database', description: 'Primary citizen & transaction store', endpoint: 'pg-primary.internal:5432', status: 'Healthy', latency: '1.8 ms', uptime: '100%', cpu: '24%', memory: '12.4 / 32 GB' },
    { name: 'ML Worker (Triton)', description: 'NVIDIA GPU YOLOv8 TensorRT inference', endpoint: 'triton-fleet.internal:8001', status: 'Healthy', latency: '18.2 ms', uptime: '99.95%', cpu: '44%', memory: '8.1 / 16 GB VRAM' },
    { name: 'Cloudflare R2 Storage', description: 'S3-compatible raw photo object store', endpoint: 'r2-edge.cloudflare.com', status: 'Healthy', latency: '24 ms', uptime: '100%', cpu: 'N/A', memory: '6.0 TB stored' },
    { name: 'Redis Event Queue', description: 'Pub/Sub queue broker for vision ingest', endpoint: 'redis-cluster.internal:6379', status: 'Healthy', latency: '0.8 ms', uptime: '99.98%', cpu: '8%', memory: '512 MB / 4 GB' },
    { name: 'Email SMTP Service', description: 'Citizen welcome & coupon delivery', endpoint: 'smtp-relay.internal:587', status: 'Healthy', latency: '110 ms', uptime: '99.90%', cpu: '2%', memory: '240 MB' }
  ]);

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleRestartService(name: string) {
    const s = services.find(srv => srv.name === name);
    if (s) {
      s.status = 'Restarting';
      toast(`Initiated rolling restart for ${name}`);
      setTimeout(() => {
        s.status = 'Healthy';
      }, 2000);
    }
  }

  function handleRestartCluster() {
    toast('Triggered rolling zero-downtime restart across all cluster microservices');
  }
</script>

<svelte:head>
  <title>System Health & Cluster Diagnostics — T2T Super Admin</title>
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

  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold tracking-tight text-zinc-900">Cluster Diagnostics & Health</h1>
      <p class="text-xs text-zinc-500 mt-0.5">Real-time health, latency, uptime, and rolling restart controls for all core backend services.</p>
    </div>
    <Button onclick={handleRestartCluster} variant="outline" size="sm" class="text-xs h-8 px-3 border-zinc-200">
      <HugeIcon icon={RotateLeft01Icon} size={12} class="mr-1.5 text-zinc-500" />
      Cluster Rolling Restart
    </Button>
  </div>

  <!-- Services Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each services as s}
      <Card class="bg-white border-zinc-200 p-4 shadow-none space-y-3">
        <div class="flex items-center justify-between border-b border-zinc-100 pb-2">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full {s.status === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
            <span class="font-bold text-xs text-zinc-900">{s.name}</span>
          </div>
          <span class="text-[10px] font-mono text-zinc-500 font-medium">{s.uptime}</span>
        </div>

        <div class="text-[11px] text-zinc-500 font-sans">{s.description}</div>
        <div class="text-[10px] font-mono text-zinc-400 break-all">{s.endpoint}</div>

        <div class="grid grid-cols-3 gap-2 font-mono text-xs pt-1">
          <div class="p-2 rounded bg-zinc-50 border border-zinc-200">
            <div class="text-[9px] text-zinc-400 uppercase">Latency</div>
            <div class="font-bold text-zinc-900 mt-0.5">{s.latency}</div>
          </div>
          <div class="p-2 rounded bg-zinc-50 border border-zinc-200">
            <div class="text-[9px] text-zinc-400 uppercase">CPU</div>
            <div class="font-bold text-zinc-900 mt-0.5">{s.cpu}</div>
          </div>
          <div class="p-2 rounded bg-zinc-50 border border-zinc-200">
            <div class="text-[9px] text-zinc-400 uppercase">Memory</div>
            <div class="font-bold text-zinc-900 mt-0.5 truncate">{s.memory}</div>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          {#if s.status === 'Restarting'}
            <span class="text-[10px] font-mono text-amber-700">Restarting...</span>
          {:else}
            <Button onclick={() => handleRestartService(s.name)} variant="outline" size="sm" class="text-[11px] h-6 px-2.5 border-zinc-200">
              Restart Service
            </Button>
          {/if}
        </div>
      </Card>
    {/each}
  </div>
</div>
