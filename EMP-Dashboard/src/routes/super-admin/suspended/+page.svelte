<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    UserBlock01Icon,
    CheckmarkCircle01Icon,
    Search01Icon
  } from '@hugeicons/core-free-icons';

  interface SuspendedRecord {
    id: string;
    name: string;
    email: string;
    bannedAt: string;
    bannedBy: string;
    reason: string;
    appealStatus: 'None' | 'Under Review' | 'Rejected';
  }

  let suspendedUsers = $state<SuspendedRecord[]>([
    { id: 'USR-8889', name: 'Karthik Rao', email: 'karthik.rao@gmail.com', bannedAt: '2026-09-02', bannedBy: 'Fatima A.', reason: 'Uploaded 7 duplicate photos across 3 sybil accounts within 12 minutes', appealStatus: 'Under Review' },
    { id: 'USR-7601', name: 'Devendra K.', email: 'devendra.k@yahoo.com', bannedAt: '2026-08-14', bannedBy: 'Varshith D.', reason: 'Automated curl script submitting 500 fake drop payloads per hour', appealStatus: 'Rejected' },
    { id: 'USR-7588', name: 'Harish T.', email: 'harish.t@gmail.com', bannedAt: '2026-08-20', bannedBy: 'Fatima A.', reason: 'Forged retail barcode QR generation for coupon claims', appealStatus: 'None' },
    { id: 'USR-7412', name: 'Sanjay V.', email: 'sanjay.v@outlook.com', bannedAt: '2026-08-29', bannedBy: 'Varshith D.', reason: 'Abusive language and repeated non-waste submission spam', appealStatus: 'None' }
  ]);

  let search = $state('');
  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleReinstate(id: string, name: string) {
    suspendedUsers = suspendedUsers.filter(u => u.id !== id);
    toast(`Citizen account ${name} (${id}) reinstated to Active status`);
  }

  const filtered = $derived(
    suspendedUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase()))
  );
</script>

<svelte:head>
  <title>Suspended Accounts — T2T Super Admin</title>
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
      <h1 class="text-xl font-bold tracking-tight text-zinc-900">Suspended Citizen Accounts</h1>
      <p class="text-xs text-zinc-500 mt-0.5">Accounts banned from photo submissions, point accumulation, and retail vouchers.</p>
    </div>
  </div>

  <div class="relative max-w-xs">
    <HugeIcon icon={Search01Icon} size={13} class="absolute left-2.5 top-2.5 text-zinc-400" />
    <input
      type="text"
      bind:value={search}
      placeholder="Search suspended accounts..."
      class="w-full pl-8 pr-3 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900"
    />
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Citizen ID</th>
            <th class="py-2.5 px-3">Name & Email</th>
            <th class="py-2.5 px-3">Suspension Date</th>
            <th class="py-2.5 px-3">Enforcing Admin</th>
            <th class="py-2.5 px-3">Grounds for Suspension</th>
            <th class="py-2.5 px-3">Appeal</th>
            <th class="py-2.5 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each filtered as u}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3 font-semibold text-zinc-900">{u.id}</td>
              <td class="py-3 px-3">
                <div class="font-sans font-semibold text-xs text-zinc-900">{u.name}</div>
                <div class="text-[10px] text-zinc-400 font-mono">{u.email}</div>
              </td>
              <td class="py-3 px-3 text-zinc-500">{u.bannedAt}</td>
              <td class="py-3 px-3 text-zinc-700 font-sans">{u.bannedBy}</td>
              <td class="py-3 px-3 font-sans text-zinc-600 max-w-xs">{u.reason}</td>
              <td class="py-3 px-3 font-sans">
                <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono {u.appealStatus === 'Under Review' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'}">
                  {u.appealStatus}
                </span>
              </td>
              <td class="py-3 px-3 text-right font-sans">
                <Button onclick={() => handleReinstate(u.id, u.name)} variant="outline" size="sm" class="text-[11px] h-6 px-2.5 border-zinc-200">
                  Reinstate Account
                </Button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
