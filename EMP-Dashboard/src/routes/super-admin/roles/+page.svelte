<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    LockIcon,
    CheckmarkCircle01Icon,
    Shield01Icon,
    UserGroupIcon,
    PlusSignIcon
  } from '@hugeicons/core-free-icons';

  interface RoleDefinition {
    id: string;
    name: string;
    description: string;
    userCount: number;
    canViewAnalytics: boolean;
    canModifyTaxonomy: boolean;
    canOverridePoints: boolean;
    canFreezeAccounts: boolean;
    canDeployML: boolean;
    canRestartPods: boolean;
    canAccessAudit: boolean;
  }

  let roles = $state<RoleDefinition[]>([
    { id: 'ROLE-SA', name: 'Super Admin', description: 'Full root authoritative access across all platform modules', userCount: 2, canViewAnalytics: true, canModifyTaxonomy: true, canOverridePoints: true, canFreezeAccounts: true, canDeployML: true, canRestartPods: true, canAccessAudit: true },
    { id: 'ROLE-ML', name: 'ML Vision Analyst', description: 'YOLO model evaluation, confusion matrix, threshold tuning', userCount: 3, canViewAnalytics: true, canModifyTaxonomy: false, canOverridePoints: false, canFreezeAccounts: false, canDeployML: true, canRestartPods: false, canAccessAudit: false },
    { id: 'ROLE-QA', name: 'QA Photo Reviewer', description: 'Human-in-the-loop review of flagged or low-confidence waste images', userCount: 8, canViewAnalytics: false, canModifyTaxonomy: false, canOverridePoints: true, canFreezeAccounts: false, canDeployML: false, canRestartPods: false, canAccessAudit: false },
    { id: 'ROLE-RW', name: 'Rewards Manager', description: 'Retail merchant gift cards, exchange rates, voucher claims', userCount: 4, canViewAnalytics: true, canModifyTaxonomy: false, canOverridePoints: true, canFreezeAccounts: false, canDeployML: false, canRestartPods: false, canAccessAudit: false },
    { id: 'ROLE-SRE', name: 'Platform SRE', description: 'Kubernetes pods, Redis/Kafka event bus queues, S3 storage buckets', userCount: 2, canViewAnalytics: true, canModifyTaxonomy: false, canOverridePoints: false, canFreezeAccounts: false, canDeployML: false, canRestartPods: true, canAccessAudit: true },
    { id: 'ROLE-SUP', name: 'Citizen Support Lead', description: 'Photo appeals, missing points sensor tickets, courtesy points credit', userCount: 6, canViewAnalytics: false, canModifyTaxonomy: false, canOverridePoints: true, canFreezeAccounts: false, canDeployML: false, canRestartPods: false, canAccessAudit: false }
  ]);

  let showAssignModal = $state(false);
  let selectedRoleToAssign = $state('ROLE-QA');
  let targetUserEmail = $state('');

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleSaveRoles() {
    toast('Saved RBAC permission policy across all internal roles');
  }

  function handleQuickAssign(e: Event) {
    e.preventDefault();
    if (!targetUserEmail) return;
    const roleObj = roles.find(r => r.id === selectedRoleToAssign);
    if (roleObj) {
      roleObj.userCount += 1;
      showAssignModal = false;
      toast(`Assigned role "${roleObj.name}" to ${targetUserEmail}`);
      targetUserEmail = '';
    }
  }
</script>

<svelte:head>
  <title>Role Assignment & RBAC — T2T Super Admin</title>
</svelte:head>

<div class="space-y-6">
  {#if toastMsg}
    <div class="bg-zinc-900 text-white text-xs px-4 py-2.5 rounded flex items-center justify-between transition-all font-mono shadow-md animate-in fade-in">
      <div class="flex items-center gap-2">
        <HugeIcon icon={CheckmarkCircle01Icon} size={14} class="text-emerald-400" />
        <span>{toastMsg}</span>
      </div>
      <button onclick={() => (toastMsg = null)} class="text-zinc-400 hover:text-white text-xs">Dismiss</button>
    </div>
  {/if}

  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold tracking-tight text-zinc-900">Role-Based Access Control (RBAC) Matrix</h1>
      <p class="text-xs text-zinc-500 mt-0.5">Granular capabilities and authoritative boundary matrix for internal employee roles.</p>
    </div>
    <div class="flex items-center gap-2">
      <a
        href="/super-admin/users"
        class="inline-flex items-center text-xs h-8 px-3 rounded border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-medium"
      >
        <HugeIcon icon={UserGroupIcon} size={13} class="mr-1.5 text-zinc-500" />
        Manage Users Directory →
      </a>
      <Button onclick={() => showAssignModal = true} variant="outline" size="sm" class="text-xs h-8 px-3 border-zinc-300">
        <HugeIcon icon={PlusSignIcon} size={13} class="mr-1" />
        Quick Assign Role
      </Button>
      <Button onclick={handleSaveRoles} size="sm" class="text-xs h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white">
        Save Permission Policy
      </Button>
    </div>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Role Profile</th>
            <th class="py-2.5 px-3">Assigned Staff</th>
            <th class="py-2.5 px-3 text-center">Analytics</th>
            <th class="py-2.5 px-3 text-center">Taxonomy</th>
            <th class="py-2.5 px-3 text-center">Points Override</th>
            <th class="py-2.5 px-3 text-center">Freeze Accts</th>
            <th class="py-2.5 px-3 text-center">Deploy ML</th>
            <th class="py-2.5 px-3 text-center">Restart Pods</th>
            <th class="py-2.5 px-3 text-center">SOC2 Audit</th>
            <th class="py-2.5 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each roles as r}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-3 px-3">
                <div class="font-sans font-semibold text-xs text-zinc-900">{r.name}</div>
                <div class="text-[10px] text-zinc-400 font-sans mt-0.5">{r.description}</div>
              </td>
              <td class="py-3 px-3 font-semibold text-zinc-900">
                <span class="inline-flex items-center px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                  {r.userCount} users
                </span>
              </td>
              <td class="py-3 px-3 text-center">
                <input type="checkbox" bind:checked={r.canViewAnalytics} disabled={r.id === 'ROLE-SA'} class="rounded border-zinc-300 accent-zinc-900" />
              </td>
              <td class="py-3 px-3 text-center">
                <input type="checkbox" bind:checked={r.canModifyTaxonomy} disabled={r.id === 'ROLE-SA'} class="rounded border-zinc-300 accent-zinc-900" />
              </td>
              <td class="py-3 px-3 text-center">
                <input type="checkbox" bind:checked={r.canOverridePoints} disabled={r.id === 'ROLE-SA'} class="rounded border-zinc-300 accent-zinc-900" />
              </td>
              <td class="py-3 px-3 text-center">
                <input type="checkbox" bind:checked={r.canFreezeAccounts} disabled={r.id === 'ROLE-SA'} class="rounded border-zinc-300 accent-zinc-900" />
              </td>
              <td class="py-3 px-3 text-center">
                <input type="checkbox" bind:checked={r.canDeployML} disabled={r.id === 'ROLE-SA'} class="rounded border-zinc-300 accent-zinc-900" />
              </td>
              <td class="py-3 px-3 text-center">
                <input type="checkbox" bind:checked={r.canRestartPods} disabled={r.id === 'ROLE-SA'} class="rounded border-zinc-300 accent-zinc-900" />
              </td>
              <td class="py-3 px-3 text-center">
                <input type="checkbox" bind:checked={r.canAccessAudit} disabled={r.id === 'ROLE-SA'} class="rounded border-zinc-300 accent-zinc-900" />
              </td>
              <td class="py-3 px-3 text-right font-sans">
                <Button
                  onclick={() => { selectedRoleToAssign = r.id; showAssignModal = true; }}
                  variant="outline"
                  size="sm"
                  class="text-[11px] h-6 px-2 border-zinc-200 hover:bg-zinc-100"
                >
                  Assign User
                </Button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>

<!-- Quick Assign Role Modal -->
{#if showAssignModal}
  <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-lg border border-zinc-200 max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
      <div class="flex items-center justify-between border-b border-zinc-100 pb-2">
        <h3 class="text-sm font-bold text-zinc-900">Quick Assign Role</h3>
        <button onclick={() => showAssignModal = false} class="text-zinc-400 hover:text-zinc-600 text-sm font-bold">✕</button>
      </div>

      <form onsubmit={handleQuickAssign} class="space-y-3 text-xs">
        <div>
          <label for="assign-target-role" class="block font-medium text-zinc-700 mb-1">Target Role</label>
          <select
            id="assign-target-role"
            bind:value={selectedRoleToAssign}
            class="w-full px-2.5 py-1.5 rounded border border-zinc-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            {#each roles as r}
              <option value={r.id}>{r.name}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="assign-user-email" class="block font-medium text-zinc-700 mb-1">Staff Member Email</label>
          <input
            id="assign-user-email"
            type="email"
            bind:value={targetUserEmail}
            placeholder="e.g. varshith.code@gmail.com"
            class="w-full px-2.5 py-1.5 rounded border border-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900"
            required
          />
          <p class="text-[10px] text-zinc-500 mt-1">Role assignment takes effect immediately across all internal consoles.</p>
        </div>

        <div class="flex justify-end gap-2 pt-2 border-t border-zinc-100">
          <Button type="button" variant="outline" size="sm" onclick={() => showAssignModal = false}>
            Cancel
          </Button>
          <Button type="submit" size="sm" class="bg-zinc-900 hover:bg-zinc-800 text-white">
            Confirm Assignment
          </Button>
        </div>
      </form>
    </div>
  </div>
{/if}
