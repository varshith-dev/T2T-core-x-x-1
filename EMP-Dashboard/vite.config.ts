import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		// dev: proxy the real backend so the dashboard uses live data
		proxy: {
			'/api': { target: 'https://t2t.dev.oqens.me', changeOrigin: true, secure: true }
		}
	}
});
