import { defineConfig, loadEnv } from 'vite';
import dotenv from 'dotenv';
import { sveltekit } from '@sveltejs/kit/vite';
dotenv.config();

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [sveltekit()],
        define: {
            'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY),
        },
        server: {
            host: '0.0.0.0',  // Permet à Vite d'écouter sur toutes les interfaces réseau
            port: 5173        // Port sur lequel votre application sera disponible
        },
        build: {
            rollupOptions: {
                external: ['stripe'] // Exclure la bibliothèque stripe
            }
        }
    };
});
