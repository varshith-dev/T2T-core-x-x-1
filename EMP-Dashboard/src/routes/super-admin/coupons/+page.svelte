<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    Ticket01Icon,
    PlusSignIcon,
    CheckmarkCircle01Icon,
    Clock01Icon,
    CancelCircleIcon,
    Coins01Icon
  } from '@hugeicons/core-free-icons';

  interface VoucherPackage {
    id: string;
    merchant: string;
    title: string;
    pointsCost: number;
    stock: number;
    maxStock: number;
    active: boolean;
  }

  let packages = $state<VoucherPackage[]>([
    { id: 'CPN-AMZ-250', merchant: 'Amazon India', title: '₹250 Shopping Card', pointsCost: 2500, stock: 142, maxStock: 200, active: true },
    { id: 'CPN-DEC-15', merchant: 'Decathlon', title: '15% Off Recycled Gear', pointsCost: 1200, stock: 88, maxStock: 150, active: true },
    { id: 'CPN-SWG-100', merchant: 'Swiggy', title: '₹100 Off Food Delivery', pointsCost: 1000, stock: 210, maxStock: 300, active: true },
    { id: 'CPN-UBR-75', merchant: 'Uber Green', title: '₹75 Off EV Rides', pointsCost: 750, stock: 65, maxStock: 100, active: true },
    { id: 'CPN-ZOM-150', merchant: 'Zomato', title: '₹150 Eco Partner Voucher', pointsCost: 1500, stock: 19, maxStock: 100, active: true },
    { id: 'CPN-SBUX-200', merchant: 'Starbucks', title: '₹200 Tumbler Rebate', pointsCost: 2000, stock: 45, maxStock: 80, active: true }
  ]);

  let pendingClaims = $state([
    { id: 'RED-101', user: 'Arjun T.', coupon: '₹50 Amazon Card', cost: 500, time: '14m ago' },
    { id: 'RED-102', user: 'Meera S.', coupon: '₹100 Flipkart Card', cost: 1000, time: '32m ago' },
    { id: 'RED-103', user: 'Kiran R.', coupon: '₹25 Swiggy Voucher', cost: 250, time: '1h 05m ago' },
    { id: 'RED-104', user: 'Deepa N.', coupon: '₹200 Myntra Code', cost: 2000, time: '2h 18m ago' }
  ]);

  let showAddModal = $state(false);
  let newMerchant = $state('');
  let newTitle = $state('');
  let newCost = $state(1000);
  let newStock = $state(100);

  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleCreatePackage(e: Event) {
    e.preventDefault();
    if (!newMerchant || !newTitle) return;
    const newId = `CPN-${newMerchant.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    packages.unshift({
      id: newId,
      merchant: newMerchant,
      title: newTitle,
      pointsCost: newCost,
      stock: newStock,
      maxStock: newStock,
      active: true
    });
    newMerchant = '';
    newTitle = '';
    showAddModal = false;
    toast(`Published voucher package: ${newId}`);
  }

  function handleApprove(id: string, user: string) {
    pendingClaims = pendingClaims.filter(c => c.id !== id);
    toast(`Approved voucher redemption for ${user}`);
  }

  function handleReject(id: string, user: string) {
    pendingClaims = pendingClaims.filter(c => c.id !== id);
    toast(`Rejected voucher redemption for ${user}`);
  }

  function handleRestock(id: string) {
    const pkg = packages.find(p => p.id === id);
    if (pkg) {
      pkg.stock += 50;
      toast(`Added +50 stock to ${pkg.title}`);
    }
  }
</script>

<svelte:head>
  <title>Coupon Catalog & Redemptions — T2T Super Admin</title>
</svelte:head>

<div class="space-y-6">
  <!-- Notification Bar -->
  {#if toastMsg}
    <div class="bg-zinc-900 text-white text-xs px-4 py-2.5 rounded flex items-center justify-between transition-all font-mono">
      <div class="flex items-center gap-2">
        <HugeIcon icon={CheckmarkCircle01Icon} size={14} class="text-zinc-200" />
        <span>{toastMsg}</span>
      </div>
      <button onclick={() => (toastMsg = null)} class="text-zinc-400 hover:text-white text-xs">
        Dismiss
      </button>
    </div>
  {/if}

  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold tracking-tight text-zinc-900">Retail Voucher Catalog & Treasury Claims</h1>
      <p class="text-xs text-zinc-500 mt-0.5">
        Master inventory of merchant vouchers, digital code batches, and pending citizen points claims.
      </p>
    </div>
    <Button onclick={() => (showAddModal = !showAddModal)} size="sm" class="text-xs h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white">
      <HugeIcon icon={PlusSignIcon} size={12} class="mr-1.5" />
      Create Voucher Batch
    </Button>
  </div>

  <!-- Create Voucher Batch Modal -->
  {#if showAddModal}
    <Card class="bg-white border-zinc-900 p-4 shadow-none space-y-3">
      <div class="flex items-center justify-between border-b border-zinc-100 pb-2">
        <span class="text-xs font-bold text-zinc-900">Add Retail Voucher Batch</span>
        <button type="button" onclick={() => (showAddModal = false)} class="text-xs text-zinc-400 hover:text-zinc-900">Cancel</button>
      </div>

      <form onsubmit={handleCreatePackage} class="space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label for="sa-merchant" class="block text-[10px] font-semibold uppercase text-zinc-500 mb-1">Merchant Name</label>
            <input id="sa-merchant" bind:value={newMerchant} placeholder="e.g. Flipkart" required class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900" />
          </div>
          <div>
            <label for="sa-voucher" class="block text-[10px] font-semibold uppercase text-zinc-500 mb-1">Voucher Title</label>
            <input id="sa-voucher" bind:value={newTitle} placeholder="₹200 E-Commerce Voucher" required class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900" />
          </div>
          <div>
            <label for="sa-cost" class="block text-[10px] font-semibold uppercase text-zinc-500 mb-1">Points Cost</label>
            <input id="sa-cost" type="number" bind:value={newCost} min="100" step="50" class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white font-mono focus:outline-none focus:border-zinc-900" />
          </div>
          <div>
            <label for="sa-stock" class="block text-[10px] font-semibold uppercase text-zinc-500 mb-1">Batch Stock (Codes)</label>
            <input id="sa-stock" type="number" bind:value={newStock} min="10" step="10" class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white font-mono focus:outline-none focus:border-zinc-900" />
          </div>
        </div>

        <div class="flex justify-end pt-1">
          <Button type="submit" size="sm" class="text-xs h-7 px-3 bg-zinc-900 hover:bg-zinc-800 text-white">
            Publish Voucher Batch
          </Button>
        </div>
      </form>
    </Card>
  {/if}

  <!-- Pending Claims Adjudication Desk -->
  <Card class="bg-white border-zinc-200 p-4 shadow-none space-y-3">
    <div class="flex items-center justify-between border-b border-zinc-100 pb-2">
      <div>
        <div class="text-xs font-bold text-zinc-900">Pending Citizen Claims Awaiting Super Admin Authorization</div>
        <div class="text-[11px] text-zinc-500">Claims with points debit &gt; 500 pts require double sign-off</div>
      </div>
      <span class="text-[10px] font-mono text-zinc-400">{pendingClaims.length} awaiting audit</span>
    </div>

    <div class="divide-y divide-zinc-100 text-xs font-mono">
      {#each pendingClaims as claim}
        <div class="py-2.5 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="text-zinc-400">{claim.id}</span>
            <span class="font-sans font-semibold text-zinc-900">{claim.user}</span>
            <span class="font-sans text-zinc-700">{claim.coupon}</span>
            <span class="font-bold text-zinc-900">{claim.cost} pts</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-zinc-400 text-[10px] mr-2">{claim.time}</span>
            <Button onclick={() => handleReject(claim.id, claim.user)} variant="outline" size="sm" class="text-[11px] h-6 px-2 border-zinc-200 text-zinc-600">
              Reject
            </Button>
            <Button onclick={() => handleApprove(claim.id, claim.user)} size="sm" class="text-[11px] h-6 px-2 bg-zinc-900 hover:bg-zinc-800 text-white">
              Approve & Dispatch
            </Button>
          </div>
        </div>
      {/each}
    </div>
  </Card>

  <!-- Live Voucher Packages Table -->
  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2 px-3">Batch ID</th>
            <th class="py-2 px-3">Brand Partner</th>
            <th class="py-2 px-3">Reward Title</th>
            <th class="py-2 px-3">Points Cost</th>
            <th class="py-2 px-3">Available Stock</th>
            <th class="py-2 px-3">Status</th>
            <th class="py-2 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each packages as pkg}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-2.5 px-3 font-semibold text-zinc-900">{pkg.id}</td>
              <td class="py-2.5 px-3 font-sans text-xs font-medium text-zinc-900">{pkg.merchant}</td>
              <td class="py-2.5 px-3 font-sans text-xs text-zinc-700">{pkg.title}</td>
              <td class="py-2.5 px-3 font-bold text-zinc-900">{pkg.pointsCost} pts</td>
              <td class="py-2.5 px-3">
                <span class="text-zinc-900 font-medium">{pkg.stock}</span> / {pkg.maxStock}
              </td>
              <td class="py-2.5 px-3 font-sans">
                <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium {pkg.active ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'}">
                  {pkg.active ? 'Live' : 'Paused'}
                </span>
              </td>
              <td class="py-2.5 px-3 text-right font-sans">
                <Button onclick={() => handleRestock(pkg.id)} variant="outline" size="sm" class="text-[11px] h-6 px-2 border-zinc-200">
                  +50 Codes
                </Button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
