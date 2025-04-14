// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
  {
    path: 'examples/:id', // This renders the "/" route on the client (CSR)
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () =>
      Promise.resolve(Array.from({ length: 7 }, (_, i) => ({ id: i.toString() }))),
  },
  {
    path: '**', // All other routes will be rendered on the server (CSR)
    renderMode: RenderMode.Prerender,
  },
];
