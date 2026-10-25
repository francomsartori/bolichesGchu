import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    // Emulates the Cloudflare runtime (env vars, bindings) during `astro dev`,
    // reading secrets from a local .dev.vars file instead of process.env.
    platformProxy: { enabled: true },
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    // Workaround for a Cloudflare/workerd dev-mode issue: the SSR dep
    // optimizer cache (node_modules/.vite/deps_ssr) can go stale and break
    // the runner mid-session on any file edit ("file does not exist...").
    // Bundling these inline instead of pre-optimizing them avoids that path.
    ssr: {
      noExternal: ['react', 'react-dom', 'react-leaflet', 'leaflet'],
    },
  },
});
