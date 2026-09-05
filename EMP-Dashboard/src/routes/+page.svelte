<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth.svelte';

	onMount(() => {
		goto(auth.user ? '/super-admin' : '/staff-login');
	});
</script>

<div class="p-8 text-sm text-zinc-500">Redirecting…</div>
