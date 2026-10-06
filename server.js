// Lightweight local preview server for Move ONN Consultancy
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(__dirname, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found: ' + reqPath);
  }
});

server.listen(PORT, () => {
  console.log(`Move ONN preview server running at http://localhost:${PORT}/`);
  console.log('Available pages:');
  console.log(' - Homepage:        http://localhost:' + PORT + '/index.html');
  console.log(' - Company Reviews: http://localhost:' + PORT + '/companies.html');
  console.log(' - Salaries Guide:  http://localhost:' + PORT + '/salaries.html');
  console.log(' - Worldwide:       http://localhost:' + PORT + '/countries.html');
  console.log(' - Sign In:         http://localhost:' + PORT + '/signin.html');
  console.log(' - Jobs Search:     http://localhost:' + PORT + '/jobs.html');
});
