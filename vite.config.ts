import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-jobs-dev-proxy',
      configureServer(server) {
        server.middlewares.use('/api/jobs', async (req, res) => {
          console.log('\n=============================================');
          console.log('[Dev Proxy Server] Intercepted Request for:', req.originalUrl);
          try {
            const url = new URL(req.originalUrl || '', `http://${req.headers.host}`);
            const query = url.searchParams.get('what') || '';
            const results_per_page = url.searchParams.get('results_per_page') || '20';

            const appId = process.env.ADZUNA_APP_ID || 'e3da6427';
            const appKey = process.env.ADZUNA_APP_KEY || '32704d6227e4696cc1e6e6d8135b5fc6';

            console.log('[Dev Proxy Server] Using API Config:', { appId, appKey: appKey ? '***HIDDEN***' : 'Missing' });

            const params = new URLSearchParams({
                app_id: appId,
                app_key: appKey,
                results_per_page,
            });
            
            const explicitQuery = query ? `${query}` : '';
            if (explicitQuery) params.set('what', explicitQuery);

            // Fetching from GB but with remote international scope to find best tech jobs
            const proxyTarget = `https://api.adzuna.com/v1/api/jobs/gb/search/1?${params.toString()}`;
            console.log('[Dev Proxy Server] Sending Fetch to:', proxyTarget.replace(/app_key=[^&]+/, 'app_key=HIDDEN'));

            const fetchRes = await fetch(proxyTarget);
            console.log('[Dev Proxy Server] Adzuna API returned Status:', fetchRes.status);
            
            if (!fetchRes.ok) {
              const errText = await fetchRes.text();
              console.error('[Dev Proxy Server] Adzuna HTTP Error details:', errText);
              throw new Error('Adzuna API returned ' + fetchRes.status);
            }
            
            const data = await fetchRes.json() as any;
            console.log(`[Dev Proxy Server] Success! Adzuna returned ${data?.results?.length || 0} jobs.`);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('[Dev Proxy Server] Local dev proxy encountered a crash:', error);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ use_fallback: true, fallback_error: String(error) }));
          }
          console.log('=============================================\n');
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
