<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    UserGroupIcon,
    PlusSignIcon,
    Search01Icon,
    CheckmarkCircle01Icon,
    LockIcon,
    UserBlock01Icon,
    RotateLeft01Icon
  } from '@hugeicons/core-free-icons';

  type UserRole =
    | 'SUPER_ADMIN'
    | 'REVIEWER'
    | 'ML_ENGINEER'
    | 'FRAUD_SPECIALIST'
    | 'REWARDS_MANAGER'
    | 'PLATFORM_SRE'
    | 'SUPPORT_AGENT'
    | 'CITIZEN';

  interface UserRecord {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    points: number;
    submissions: number;
    status: 'ACTIVE' | 'WARNING' | 'SUSPENDED';
    joined: string;
  }

  let users = $state<UserRecord[]>([
    { id: 'USR-001', name: 'Varshith D.', email: 'varshith.d@t2t.internal', role: 'SUPER_ADMIN', points: 14200, submissions: 140, status: 'ACTIVE', joined: '2026-01-01' },
    { id: 'USR-002', name: 'Ravi K.', email: 'ravi.k@t2t.internal', role: 'REVIEWER', points: 3400, submissions: 42, status: 'ACTIVE', joined: '2026-02-15' },
    { id: 'USR-003', name: 'Dr. Shira P.', email: 'shira.p@t2t.internal', role: 'ML_ENGINEER', points: 8900, submissions: 12, status: 'ACTIVE', joined: '2026-02-20' },
    { id: 'USR-004', name: 'Fatima A.', email: 'fatima.a@t2t.internal', role: 'SUPER_ADMIN', points: 6100, submissions: 8, status: 'ACTIVE', joined: '2026-03-01' },
    { id: 'USR-005', name: 'Neha S.', email: 'neha.s@t2t.internal', role: 'SUPPORT_AGENT', points: 4200, submissions: 5, status: 'ACTIVE', joined: '2026-03-12' },
    { id: 'USR-006', name: 'Alex C.', email: 'alex.c@t2t.internal', role: 'PLATFORM_SRE', points: 5100, submissions: 0, status: 'ACTIVE', joined: '2026-03-15' },
    { id: 'USR-8889', name: 'Karthik Rao', email: 'karthik.rao@gmail.com', role: 'CITIZEN', points: 0, submissions: 7, status: 'SUSPENDED', joined: '2026-07-10' },
    { id: 'USR-8910', name: 'Alok Shenoy', email: 'alok.s@outlook.com', role: 'CITIZEN', points: 120, submissions: 14, status: 'WARNING', joined: '2026-07-18' },
    { id: 'USR-8722', name: 'Sunil M.', email: 'sunil.m@yahoo.com', role: 'CITIZEN', points: 340, submissions: 19, status: 'WARNING', joined: '2026-08-01' },
    { id: 'USR-8412', name: 'Simran Kaur', email: 'simran.k@gmail.com', role: 'CITIZEN', points: 2840, submissions: 58, status: 'ACTIVE', joined: '2026-05-11' },
    { id: 'USR-8199', name: 'Arjun Das', email: 'arjun.das@gmail.com', role: 'CITIZEN', points: 4820, submissions: 64, status: 'ACTIVE', joined: '2026-04-20' }
  ]);

  let search = $state('');
  let filterRole = $state('ALL');
  let showAddStaffModal = $state(false);
  let newStaffName = $state('');
  let newStaffEmail = $state('');
  let newStaffRole = $state<UserRole>('REVIEWER');

  // Quick Popup Modal State for Editing Role and User
  let showEditModal = $state(false);
  let editingUser = $state<UserRecord | null>(null);
  let editForm = $state({
    name: '',
    email: '',
    role: 'CITIZEN' as UserRole,
    status: 'ACTIVE' as UserRecord['status'],
    points: 0
  });

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  const filteredUsers = $derived(
    users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase());
      const matchRole = filterRole === 'ALL' ||
        (filterRole === 'CITIZEN' && u.role === 'CITIZEN') ||
        (filterRole === 'STAFF' && u.role !== 'CITIZEN') ||
        (filterRole === 'SUSPENDED' && u.status === 'SUSPENDED');
      return matchSearch && matchRole;
    })
  );

  function openEditModal(u: UserRecord) {
    editingUser = u;
    editForm = {
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      points: u.points
    };
    showEditModal = true;
  }

  function handleSaveEdit(e: Event) {
    e.preventDefault();
    if (!editingUser) return;
    editingUser.name = editForm.name;
    editingUser.email = editForm.email;
    editingUser.role = editForm.role;
    editingUser.status = editForm.status;
    editingUser.points = Number(editForm.points);
    showEditModal = false;
    toast(`Updated ${editingUser.name} · Role: ${editingUser.role.replace('_', ' ')} · Status: ${editingUser.status}`);
  }

  function handleCreateStaff(e: Event) {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;
    const newId = `USR-0${users.length + 1}`;
    users.unshift({
      id: newId,
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      points: 1000,
      submissions: 0,
      status: 'ACTIVE',
      joined: new Date().toISOString().split('T')[0]
    });
    newStaffName = '';
    newStaffEmail = '';
    showAddStaffModal = false;
    toast(`Created staff account for ${newStaffName} (${newStaffRole.replace('_', ' ')})`);
  }

  function handleToggleSuspend(id: string) {
    const u = users.find(user => user.id === id);
    if (u) {
      if (u.status === 'SUSPENDED') {
        u.status = 'ACTIVE';
        toast(`User ${u.name} reinstated to Active`);
      } else {
        u.status = 'SUSPENDED';
        toast(`User ${u.name} suspended from platform`);
      }
    }
  }
</script>

<svelte:head>
  <title>User Directory & Management — T2T Super Admin</title>
</svelte:head>

<div class="space-y-6">
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

  <!-- Page Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold tracking-tight text-zinc-900">User Management Directory</h1>
      <p class="text-xs text-zinc-500 mt-0.5">Authoritative citizen accounts, internal staff directory, and quick role assignment.</p>
    </div>
    <div class="flex items-center gap-2">
      <a
        href="/super-admin/roles"
        class="inline-flex items-center text-xs h-8 px-3 rounded border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-medium"
      >
        <HugeIcon icon={LockIcon} size={13} class="mr-1.5 text-zinc-500" />
        View RBAC Role Matrix →
      </a>
      <Button onclick={() => showAddStaffModal = !showAddStaffModal} size="sm" class="text-xs h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white">
        <HugeIcon icon={PlusSignIcon} size={13} class="mr-1" />
        Invite Staff Member
      </Button>
    </div>
  </div>

  <!-- Add Staff Modal/Drawer -->
  {#if showAddStaffModal}
    <Card class="bg-white border-zinc-900 p-4 shadow-sm animate-in fade-in">
      <div class="flex items-center justify-between border-b border-zinc-100 pb-2 mb-3">
        <span class="text-xs font-bold text-zinc-900 font-mono">Provision Internal Staff Account</span>
        <button onclick={() => showAddStaffModal = false} class="text-xs text-zinc-400 hover:text-zinc-600">Close</button>
      </div>
      <form onsubmit={handleCreateStaff} class="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label for="staff-name-input" class="block text-[10px] font-semibold uppercase text-zinc-400 mb-1 font-mono">Full Name</label>
          <input
            id="staff-name-input"
            type="text"
            bind:value={newStaffName}
            placeholder="e.g. Vikram Chandra"
            class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900"
            required
          />
        </div>
        <div>
          <label for="staff-email-input" class="block text-[10px] font-semibold uppercase text-zinc-400 mb-1 font-mono">Work Email</label>
          <input
            id="staff-email-input"
            type="email"
            bind:value={newStaffEmail}
            placeholder="vikram.c@t2t.internal"
            class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900"
            required
          />
        </div>
        <div>
          <label for="staff-role-select" class="block text-[10px] font-semibold uppercase text-zinc-400 mb-1 font-mono">Role Tier</label>
          <select
            id="staff-role-select"
            bind:value={newStaffRole}
            class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900"
          >
            <option value="REVIEWER">QA Photo Reviewer</option>
            <option value="ML_ENGINEER">ML Vision Analyst</option>
            <option value="FRAUD_SPECIALIST">Fraud & Compliance</option>
            <option value="REWARDS_MANAGER">Coupon Manager</option>
            <option value="PLATFORM_SRE">Platform SRE</option>
            <option value="SUPPORT_AGENT">Citizen Support Agent</option>
            <option value="SUPER_ADMIN">Super Administrator</option>
          </select>
        </div>
        <div>
          <Button type="submit" size="sm" class="w-full text-xs h-8 bg-zinc-900 hover:bg-zinc-800 text-white">
            Dispatch Invite
          </Button>
        </div>
      </form>
    </Card>
  {/if}

  <!-- Filters & Search Toolbar -->
  <div class="flex items-center justify-between gap-3">
    <div class="relative flex-1 max-w-xs">
      <HugeIcon icon={Search01Icon} size={13} class="absolute left-2.5 top-2.5 text-zinc-400" />
      <input
        type="text"
        bind:value={search}
        placeholder="Search by name, ID or email..."
        class="w-full pl-8 pr-3 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900"
      />
    </div>

    <div class="flex items-center gap-1.5 text-xs">
      {#each ['ALL', 'STAFF', 'CITIZEN', 'SUSPENDED'] as tab}
        <button
          onclick={() => filterRole = tab}
          class="px-2.5 py-1 rounded text-[11px] font-medium transition-colors {filterRole === tab ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'}"
        >
          {tab}
        </button>
      {/each}
    </div>
  </div>

  <!-- Users Table -->
  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">User ID</th>
            <th class="py-2.5 px-3">Name & Contact</th>
            <th class="py-2.5 px-3">Assigned Role</th>
            <th class="py-2.5 px-3">Points Balance</th>
            <th class="py-2.5 px-3">Submissions</th>
            <th class="py-2.5 px-3">Account Status</th>
            <th class="py-2.5 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each filteredUsers as u}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-2.5 px-3 font-semibold text-zinc-900">{u.id}</td>
              <td class="py-2.5 px-3">
                <div class="font-sans font-semibold text-xs text-zinc-900">{u.name}</div>
                <div class="text-[10px] text-zinc-400 font-mono">{u.email}</div>
              </td>
              <td class="py-2.5 px-3">
                <button
                  onclick={() => openEditModal(u)}
                  title="Click to quickly edit role"
                  class="px-2 py-0.5 rounded text-[10px] font-mono transition-all hover:ring-1 hover:ring-zinc-400 text-left cursor-pointer {u.role === 'SUPER_ADMIN' ? 'bg-zinc-900 text-white' : u.role === 'CITIZEN' ? 'bg-zinc-100 text-zinc-700' : 'bg-blue-50 text-blue-800 border border-blue-200'}"
                >
                  {u.role.replace('_', ' ')} ✎
                </button>
              </td>
              <td class="py-2.5 px-3 font-bold text-zinc-900">{u.points} pts</td>
              <td class="py-2.5 px-3 text-zinc-600">{u.submissions}</td>
              <td class="py-2.5 px-3 font-sans">
                {#if u.status === 'ACTIVE'}
                  <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                    Active
                  </span>
                {:else if u.status === 'WARNING'}
                  <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                    Warning
                  </span>
                {:else}
                  <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-rose-50 text-rose-800 border border-rose-200 font-mono">
                    Suspended
                  </span>
                {/if}
              </td>
              <td class="py-2.5 px-3 text-right font-sans">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- Quick Edit Role Button -->
                  <Button
                    onclick={() => openEditModal(u)}
                    variant="outline"
                    size="sm"
                    class="text-[11px] h-6 px-2.5 border-zinc-300 text-zinc-800 hover:bg-zinc-100"
                  >
                    Edit Role
                  </Button>

                  <!-- Suspend/Reinstate Button -->
                  {#if u.role !== 'SUPER_ADMIN'}
                    <Button
                      onclick={() => handleToggleSuspend(u.id)}
                      variant="outline"
                      size="sm"
                      class="text-[11px] h-6 px-2 border-zinc-200 {u.status === 'SUSPENDED' ? 'text-emerald-700 hover:bg-emerald-50' : 'text-zinc-500 hover:text-zinc-900'}"
                    >
                      {u.status === 'SUSPENDED' ? 'Reinstate' : 'Suspend'}
                    </Button>
                  {:else}
                    <span class="text-zinc-400 text-[10px] font-mono px-1">Protected</span>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>

<!-- Quick Popup Modal to Update Role and User Details -->
{#if showEditModal && editingUser}
  <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-lg border border-zinc-200 max-w-lg w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div>
          <h3 class="text-sm font-bold text-zinc-900 font-sans">Edit Role & User Account</h3>
          <p class="text-[11px] text-zinc-500 font-mono mt-0.5">ID: {editingUser.id} · Joined: {editingUser.joined}</p>
        </div>
        <button onclick={() => showEditModal = false} class="text-zinc-400 hover:text-zinc-600 text-sm font-bold p-1">✕</button>
      </div>

      <!-- Quick Edit Form -->
      <form onsubmit={handleSaveEdit} class="space-y-3.5 text-xs">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="edit-name-input" class="block font-medium text-zinc-700 mb-1 font-sans">Full Name</label>
            <input
              id="edit-name-input"
              type="text"
              bind:value={editForm.name}
              class="w-full px-2.5 py-1.5 rounded border border-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans"
              required
            />
          </div>
          <div>
            <label for="edit-email-input" class="block font-medium text-zinc-700 mb-1 font-sans">Email Address</label>
            <input
              id="edit-email-input"
              type="email"
              bind:value={editForm.email}
              class="w-full px-2.5 py-1.5 rounded border border-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
              required
            />
          </div>
        </div>

        <!-- Role Tier Selector -->
        <div>
          <label for="edit-role-select" class="block font-semibold text-zinc-900 mb-1 font-sans">
            Assigned Platform Role
          </label>
          <select
            id="edit-role-select"
            bind:value={editForm.role}
            class="w-full px-2.5 py-2 rounded border border-zinc-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 font-medium"
          >
            <option value="SUPER_ADMIN">👑 Super Administrator (Full Root Access)</option>
            <option value="REVIEWER">🔍 QA Photo Reviewer (Optical Desk)</option>
            <option value="ML_ENGINEER">🧠 ML Vision Analyst (Studio &amp; Thresholds)</option>
            <option value="FRAUD_SPECIALIST">🛡️ Fraud &amp; Compliance Specialist</option>
            <option value="REWARDS_MANAGER">🎟️ Coupon &amp; Rewards Manager</option>
            <option value="PLATFORM_SRE">⚙️ Platform SRE &amp; Infrastructure</option>
            <option value="SUPPORT_AGENT">🎧 Citizen Care &amp; Appeals Agent</option>
            <option value="CITIZEN">🌱 Citizen Recycler (Standard Mobile App)</option>
          </select>
          <p class="text-[10px] text-zinc-500 mt-1">
            Updating the role immediately changes workspace permissions and routing access for this user.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label for="edit-status-select" class="block font-medium text-zinc-700 mb-1 font-sans">Account Status</label>
            <select
              id="edit-status-select"
              bind:value={editForm.status}
              class="w-full px-2.5 py-1.5 rounded border border-zinc-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
            >
              <option value="ACTIVE">Active (Unrestricted)</option>
              <option value="WARNING">Warning (Flagged)</option>
              <option value="SUSPENDED">Suspended (Payouts Frozen)</option>
            </select>
          </div>
          <div>
            <label for="edit-points-input" class="block font-medium text-zinc-700 mb-1 font-sans">Eco-Points Balance</label>
            <input
              id="edit-points-input"
              type="number"
              bind:value={editForm.points}
              class="w-full px-2.5 py-1.5 rounded border border-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono font-bold"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-3 border-t border-zinc-100">
          <Button type="button" variant="outline" size="sm" onclick={() => showEditModal = false}>
            Cancel
          </Button>
          <Button type="submit" size="sm" class="bg-zinc-900 hover:bg-zinc-800 text-white font-medium">
            Save &amp; Update User
          </Button>
        </div>
      </form>
    </div>
  </div>
{/if}
