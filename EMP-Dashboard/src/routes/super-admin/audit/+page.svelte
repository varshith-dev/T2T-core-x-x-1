<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    File01Icon,
    Search01Icon,
    CheckmarkCircle01Icon
  } from '@hugeicons/core-free-icons';

  interface AuditEntry {
    id: string;
    actor: string;
    role: string;
    action: string;
    resource: string;
    ip: string;
    timestamp: string;
    status: 'SUCCESS' | 'BLOCKED' | 'FLAGGED';
  }

  let logs = $state<AuditEntry[]>([
    { id: 'AUD-9021', actor: 'Varshith D.', role: 'Super Admin', action: 'Promoted Ravi K. to QA Reviewer', resource: 'USR-002', ip: '103.21.14.88', timestamp: '2 min ago', status: 'SUCCESS' },
    { id: 'AUD-9020', actor: 'Ananya V.', role: 'Super Admin', action: 'Updated Metal points to 20 pts', resource: 'CAT-004', ip: '103.21.14.89', timestamp: '18 min ago', status: 'SUCCESS' },
    { id: 'AUD-9019', actor: 'System Daemon', role: 'Security Bot', action: 'Flagged 7 duplicate submissions via pHash', resource: 'PHASH-CL-902', ip: 'internal-daemon', timestamp: '1 hr ago', status: 'FLAGGED' },
    { id: 'AUD-9018', actor: 'Varshith D.', role: 'Super Admin', action: 'Reprocessed 42 submissions after model v2.4.1 deploy', resource: 'BATCH-8812', ip: '103.21.14.88', timestamp: '3 hr ago', status: 'SUCCESS' },
    { id: 'AUD-9017', actor: 'System Daemon', role: 'Auto Approver', action: 'Auto-approved 312 submissions (> 85% conf)', resource: 'QUEUE-INFERENCE', ip: 'internal-daemon', timestamp: '6 hr ago', status: 'SUCCESS' },
    { id: 'AUD-9016', actor: 'Fatima A.', role: 'Fraud Analyst', action: 'Account freeze enforced on Karthik Rao', resource: 'USR-8889', ip: '14.139.12.9', timestamp: '8 hr ago', status: 'SUCCESS' },
    { id: 'AUD-9015', actor: 'Unknown Client', role: 'Anonymous API', action: 'Rate limit tripped on voucher claims endpoint', resource: '/api/v1/coupons/claim', ip: '185.220.101.4', timestamp: '10 hr ago', status: 'BLOCKED' }
  ]);

  let search = $state('');
  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  const filtered = $derived(
    logs.filter(l => l.actor.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()) || l.resource.toLowerCase().includes(search.toLowerCase()))
  );
</script>

<svelte:head>
  <title>Security Audit Logs — T2T Super Admin</title>
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
      <h1 class="text-xl font-bold tracking-tight text-zinc-900">SOC2 Immutable Administrative Audit Log</h1>
      <p class="text-xs text-zinc-500 mt-0.5">Append-only chronological trail of all privileged actions, policy mutations, and security events.</p>
    </div>
    <Button onclick={() => toast('Exported encrypted compliance audit pack CSV')} variant="outline" size="sm" class="text-xs h-8 px-3 border-zinc-200">
      <HugeIcon icon={File01Icon} size={12} class="mr-1.5 text-zinc-500" />
      Export Audit Pack
    </Button>
  </div>

  <div class="relative max-w-xs">
    <HugeIcon icon={Search01Icon} size={13} class="absolute left-2.5 top-2.5 text-zinc-400" />
    <input
      type="text"
      bind:value={search}
      placeholder="Search actor, action, resource..."
      class="w-full pl-8 pr-3 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900 font-sans"
    />
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Event ID</th>
            <th class="py-2.5 px-3">Actor & Role</th>
            <th class="py-2.5 px-3">Action Description</th>
            <th class="py-2.5 px-3">Target Resource</th>
            <th class="py-2.5 px-3">IP Address</th>
            <th class="py-2.5 px-3">Outcome</th>
            <th class="py-2.5 px-3 text-right">Timestamp</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each filtered as log}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-2.5 px-3 font-semibold text-zinc-900">{log.id}</td>
              <td class="py-2.5 px-3">
                <div class="font-sans font-medium text-xs text-zinc-900">{log.actor}</div>
                <div class="text-[10px] text-zinc-400 font-sans">{log.role}</div>
              </td>
              <td class="py-2.5 px-3 font-sans text-xs text-zinc-800">{log.action}</td>
              <td class="py-2.5 px-3 text-zinc-600">{log.resource}</td>
              <td class="py-2.5 px-3 text-zinc-500">{log.ip}</td>
              <td class="py-2.5 px-3 font-sans">
                {#if log.status === 'SUCCESS'}
                  <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                    Success
                  </span>
                {:else if log.status === 'FLAGGED'}
                  <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                    Flagged
                  </span>
                {:else}
                  <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-rose-50 text-rose-800 border border-rose-200 font-mono">
                    Blocked
                  </span>
                {/if}
              </td>
              <td class="py-2.5 px-3 text-right text-zinc-400">{log.timestamp}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
