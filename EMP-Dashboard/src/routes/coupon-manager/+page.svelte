<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import Button from '$lib/components/ui/button/button.svelte';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import {
    Ticket01Icon,
    PlusSignIcon,
    Search01Icon,
    CheckmarkCircle01Icon,
    Clock01Icon,
    Coins01Icon,
    Package01Icon
  } from '@hugeicons/core-free-icons';

  interface Voucher {
    id: string;
    merchant: string;
    category: string;
    title: string;
    cost: number;
    stock: number;
    maxStock: number;
    active: boolean;
  }

  let vouchers = $state<Voucher[]>([
    { id: 'CPN-AMZ-250', merchant: 'Amazon India', category: 'E-Commerce', title: '₹250 Shopping Gift Card', cost: 2500, stock: 142, maxStock: 200, active: true },
    { id: 'CPN-DEC-15', merchant: 'Decathlon', category: 'Sports', title: '15% Off Recycled Apparel', cost: 1200, stock: 88, maxStock: 150, active: true },
    { id: 'CPN-SWG-100', merchant: 'Swiggy', category: 'Food & Dining', title: '₹100 Off Food Delivery', cost: 1000, stock: 210, maxStock: 300, active: true },
    { id: 'CPN-UBR-75', merchant: 'Uber Green', category: 'Mobility', title: '₹75 Off EV Rides', cost: 750, stock: 65, maxStock: 100, active: true },
    { id: 'CPN-ZOM-150', merchant: 'Zomato', category: 'Food & Dining', title: '₹150 Eco Partner Voucher', cost: 1500, stock: 19, maxStock: 100, active: true },
    { id: 'CPN-SBUX-200', merchant: 'Starbucks', category: 'Food & Dining', title: '₹200 Reusable Tumbler Discount', cost: 2000, stock: 45, maxStock: 80, active: true },
    { id: 'CPN-BB-300', merchant: 'BigBasket', category: 'Groceries', title: '₹300 Off Organic Produce', cost: 3000, stock: 120, maxStock: 250, active: true }
  ]);

  let searchQuery = $state('');
  let selectedCategory = $state('ALL');
  let showAddModal = $state(false);
  let newMerchant = $state('');
  let newTitle = $state('');
  let newCost = $state(1000);
  let newStock = $state(100);
  let newCategory = $state('E-Commerce');
  let toastMsg = $state<string | null>(null);

  function toast(msg: string) {
    toastMsg = msg;
    setTimeout(() => (toastMsg = null), 4000);
  }

  function handleCreateVoucher(e: Event) {
    e.preventDefault();
    if (!newMerchant || !newTitle) return;
    const newId = `CPN-${newMerchant.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    vouchers.unshift({
      id: newId,
      merchant: newMerchant,
      category: newCategory,
      title: newTitle,
      cost: newCost,
      stock: newStock,
      maxStock: newStock,
      active: true
    });
    newMerchant = '';
    newTitle = '';
    showAddModal = false;
    toast(`Published voucher batch: ${newId}`);
  }

  function handleToggleVoucher(id: string) {
    const v = vouchers.find(item => item.id === id);
    if (v) {
      v.active = !v.active;
      toast(`${v.title} is now ${v.active ? 'Active' : 'Paused'}`);
    }
  }

  function handleRestock(id: string) {
    const v = vouchers.find(item => item.id === id);
    if (v) {
      v.stock += 50;
      toast(`Added +50 voucher codes to ${v.title}`);
    }
  }

  const filtered = $derived(
    vouchers.filter(v => {
      const matchSearch = v.merchant.toLowerCase().includes(searchQuery.toLowerCase()) || v.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'ALL' || v.category === selectedCategory;
      return matchSearch && matchCat;
    })
  );
</script>

<svelte:head>
  <title>Voucher Catalog — T2T Rewards</title>
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
      <h1 class="text-xl font-bold tracking-tight text-zinc-900">Merchant Voucher Catalog</h1>
      <p class="text-xs text-zinc-500 mt-0.5">Live stock available for citizen reward redemption, digital gift card inventory, and replenishment thresholds.</p>
    </div>
    <Button onclick={() => (showAddModal = !showAddModal)} size="sm" class="text-xs h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white">
      <HugeIcon icon={PlusSignIcon} size={12} class="mr-1.5" />
      Add Voucher Batch
    </Button>
  </div>

  {#if showAddModal}
    <Card class="bg-white border-zinc-900 p-4 shadow-none space-y-3">
      <div class="flex items-center justify-between border-b border-zinc-100 pb-2">
        <span class="text-xs font-bold text-zinc-900">Create New Retail Voucher Batch</span>
        <button type="button" onclick={() => (showAddModal = false)} class="text-xs text-zinc-400 hover:text-zinc-900">Cancel</button>
      </div>

      <form onsubmit={handleCreateVoucher} class="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div>
          <label for="coupon-merchant-name" class="block text-[10px] font-semibold uppercase text-zinc-500 mb-1">Merchant Name</label>
          <input id="coupon-merchant-name" bind:value={newMerchant} placeholder="e.g. Swiggy Instamart" required class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900" />
        </div>
        <div>
          <label for="coupon-voucher-title" class="block text-[10px] font-semibold uppercase text-zinc-500 mb-1">Voucher Title</label>
          <input id="coupon-voucher-title" bind:value={newTitle} placeholder="₹100 Off Grocery Order" required class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900" />
        </div>
        <div>
          <label for="coupon-points-cost" class="block text-[10px] font-semibold uppercase text-zinc-500 mb-1">Points Cost</label>
          <input id="coupon-points-cost" type="number" bind:value={newCost} min="100" step="50" class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900 font-mono" />
        </div>
        <div>
          <label for="coupon-initial-stock" class="block text-[10px] font-semibold uppercase text-zinc-500 mb-1">Initial Stock</label>
          <input id="coupon-initial-stock" type="number" bind:value={newStock} min="10" step="10" class="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900 font-mono" />
        </div>
        <div class="md:col-span-4 flex justify-end pt-1">
          <Button type="submit" size="sm" class="text-xs h-7 px-3 bg-zinc-900 hover:bg-zinc-800 text-white">
            Publish Batch to App Catalog
          </Button>
        </div>
      </form>
    </Card>
  {/if}

  <div class="flex items-center justify-between gap-3">
    <div class="relative flex-1 max-w-xs">
      <HugeIcon icon={Search01Icon} size={13} class="absolute left-2.5 top-2.5 text-zinc-400" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search merchant or voucher..."
        class="w-full pl-8 pr-3 py-1.5 rounded border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900 font-sans"
      />
    </div>

    <div class="flex items-center gap-1.5 text-xs">
      {#each ['ALL', 'E-Commerce', 'Food & Dining', 'Mobility', 'Sports', 'Groceries'] as cat}
        <button
          onclick={() => selectedCategory = cat}
          class="px-2.5 py-1 rounded text-[11px] font-medium transition-colors {selectedCategory === cat ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'}"
        >
          {cat}
        </button>
      {/each}
    </div>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="divide-y divide-zinc-100 font-mono text-xs">
      {#each filtered as v}
        <div class="py-3 flex items-center justify-between text-[11px]">
          <div class="flex items-center gap-3">
            <span class="text-zinc-400">{v.id}</span>
            <span class="font-semibold text-zinc-900 font-sans text-xs">{v.merchant}</span>
            <span class="text-zinc-600 font-sans text-xs">{v.title}</span>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              {v.category}
            </span>
          </div>
          <div class="flex items-center gap-4">
            <span class="font-bold text-zinc-900">{v.cost} pts</span>
            <span class="text-zinc-500">Stock: {v.stock} / {v.maxStock}</span>
            <button
              onclick={() => handleToggleVoucher(v.id)}
              class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium {v.active ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'}"
            >
              {v.active ? 'Active' : 'Paused'}
            </button>
            <Button onclick={() => handleRestock(v.id)} variant="outline" size="sm" class="text-[11px] h-6 px-2 border-zinc-200">
              +50 Stock
            </Button>
          </div>
        </div>
      {/each}
    </div>
  </Card>
</div>
