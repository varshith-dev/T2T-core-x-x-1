<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let email = $state('');
	let password = $state('');
	let err = $state('');
	let busy = $state(false);

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		busy = true;
		err = '';
		try {
			await auth.login(email, password);
			goto('/super-admin');
		} catch (x: any) {
			err = x?.message ?? 'login failed';
		} finally {
			busy = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-[#f8f9fa] p-4">
	<form
		onsubmit={submit}
		class="w-full max-w-sm space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
	>
		<div class="text-center">
			<div class="text-lg font-semibold text-zinc-900">T2T Dashboards</div>
			<div class="text-sm text-zinc-500">Employee &amp; admin sign in</div>
		</div>
		<div class="space-y-1">
			<label class="text-xs font-medium text-zinc-600" for="e">Email</label>
			<input
				id="e"
				type="email"
				bind:value={email}
				required
				class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-zinc-900"
			/>
		</div>
		<div class="space-y-1">
			<label class="text-xs font-medium text-zinc-600" for="p">Password</label>
			<input
				id="p"
				type="password"
				bind:value={password}
				required
				class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-zinc-900"
			/>
		</div>
		{#if err}<p class="text-sm text-red-600">{err}</p>{/if}
		<Button type="submit" class="w-full" disabled={busy}>{busy ? '…' : 'Sign in'}</Button>
	</form>
</div>
