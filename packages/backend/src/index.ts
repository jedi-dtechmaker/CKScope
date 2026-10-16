import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { api } from './api/router.js';

const port = Number(process.env.PORT ?? 3000);

// Mount the API under the /api prefix so the frontend's Vite proxy lines up.
const app = new Hono();
app.route('/api', api);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`CKScope API listening on http://localhost:${info.port}`);
});
