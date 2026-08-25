// Minimal static file server for local play (no deps). Serves ./ with correct MIME for js/html.
// Security: traversal-proof — URL is percent-decoded, normalized, resolved, and must stay under root.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };

http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400); return res.end('bad request');
  }
  const rel = urlPath.replaceAll('\\', '/');
  const file = path.resolve(root, '.' + (rel === '/' || rel === '' ? '/index.html' : rel));
  if (file !== root && !file.startsWith(root + path.sep)) {
    res.writeHead(403); return res.end('forbidden');
  }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(process.env.PORT || 8123, () => console.log(`Punjab Stories at http://localhost:${process.env.PORT || 8123}`));
