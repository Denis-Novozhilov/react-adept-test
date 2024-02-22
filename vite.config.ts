import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import ViteReactPlugin from 'vite-plugin-react';
// import ViteSvgIcons from 'vite-plugin-svg-icons';

export default defineConfig({
	plugins: [
		react()
		// ViteReactPlugin(),
		// ViteSvgIcons({
		// 	iconDirs: [path.resolve(process.cwd(), 'src/icons')],
		// 	symbolId: 'icon-[dir]-[name]'
		// })
	]
});

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
