// Post-build step (runs automatically after `npm run build`):
// - writes sitemap.xml from the prerendered routes
// - writes 404.html (client-rendered shell) so static hosts show the site's own “page introuvable”.
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';

const SITE_URL = 'https://faremoana.ch';
const OUT = 'dist/faremoana/browser';

const { routes } = JSON.parse(readFileSync('dist/faremoana/prerendered-routes.json', 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const priority = (path) => (path === '/' ? '1.0' : path.split('/').length <= 2 ? '0.8' : '0.6');
const urls = Object.keys(routes)
  .sort()
  .map((path) => {
    const loc = SITE_URL + (path === '/' ? '/' : `${path}/`);
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority(path)}</priority>\n  </url>`;
  });

writeFileSync(
  `${OUT}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
);
console.log(`sitemap.xml: ${urls.length} URLs`);

copyFileSync(`${OUT}/index.csr.html`, `${OUT}/404.html`);
console.log('404.html written');
