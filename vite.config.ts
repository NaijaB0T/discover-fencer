import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		// Enable minification
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		},
		// Split chunks for better caching
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['svelte'],
					utils: ['./src/lib/utils.js']
				},
				// Set up cache-friendly chunking
				chunkFileNames: 'assets/chunks/[name]-[hash].js',
				entryFileNames: 'assets/entries/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash].[ext]'
			}
		},
		// Chunk size warnings
		chunkSizeWarningLimit: 1000,
	},
	// Optimize asset handling
	optimizeDeps: {
		include: ['svelte']
	},
	// Image optimization
	server: {
		fs: {
			strict: false
		}
	}
});
