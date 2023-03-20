import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  const { PORT: port } = process?.env;

  return {
    plugins: [
      react(),
    ],
    server: {
      port,
    },
  };
});
