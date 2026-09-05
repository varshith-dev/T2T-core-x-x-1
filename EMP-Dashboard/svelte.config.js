import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// SPA: fallback so client-side routing handles /super-admin, /reviewer, etc.
		adapter: adapter({ fallback: 'index.html' })
	}
};

export default config;
