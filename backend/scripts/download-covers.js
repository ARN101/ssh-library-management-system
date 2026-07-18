/**
 * Download book covers into frontend/public/covers and update cover_url.
 * Usage: node scripts/download-covers.js
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const COVERS_DIRS = [
  path.join(__dirname, '../public/covers'),
  path.join(__dirname, '../../frontend/public/covers'),
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function svgCover(title, author, category) {
  const safe = (s) =>
    String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const t = safe(title).slice(0, 60);
  const a = safe(author).slice(0, 40);
  const c = safe(category || 'Library').slice(0, 28);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="560" viewBox="0 0 400 560">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1677ff"/>
      <stop offset="100%" stop-color="#0958d9"/>
    </linearGradient>
  </defs>
  <rect width="400" height="560" fill="url(#g)"/>
  <rect x="24" y="24" width="352" height="512" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
  <text x="40" y="80" fill="rgba(255,255,255,0.85)" font-family="Georgia, serif" font-size="14">${c}</text>
  <foreignObject x="40" y="140" width="320" height="220">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color:white;font-family:Georgia,serif;font-size:26px;font-weight:700;line-height:1.25;">
      ${t}
    </div>
  </foreignObject>
  <text x="40" y="480" fill="rgba(255,255,255,0.9)" font-family="Georgia, serif" font-size="16">${a}</text>
  <text x="40" y="510" fill="rgba(255,255,255,0.65)" font-family="Arial, sans-serif" font-size="12">SSH Library</text>
</svg>`;
}

async function downloadImage(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'SSH-Library-Seed/1.0',
      Accept: 'image/*',
    },
  });
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  // Open Library often returns a tiny placeholder for missing covers
  if (buf.length < 2000) return null;
  const type = res.headers.get('content-type') || '';
  if (!type.includes('image') && !url.includes('.jpg')) return null;
  return buf;
}

async function fetchCoverBuffer(isbn) {
  const clean = String(isbn).replace(/-/g, '');
  const candidates = [
    `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg`,
    `https://covers.openlibrary.org/b/isbn/${clean}-M.jpg`,
  ];

  for (const url of candidates) {
    try {
      const buf = await downloadImage(url);
      if (buf) return { buf, ext: 'jpg' };
    } catch {
      // try next
    }
  }

  // Google Books volume thumbnail
  try {
    const gRes = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${clean}&maxResults=1`
    );
    if (gRes.ok) {
      const data = await gRes.json();
      const links = data.items?.[0]?.volumeInfo?.imageLinks;
      const thumb = links?.thumbnail || links?.smallThumbnail;
      if (thumb) {
        const httpsUrl = thumb.replace(/^http:/, 'https:');
        const buf = await downloadImage(httpsUrl);
        if (buf) return { buf, ext: 'jpg' };
      }
    }
  } catch {
    // fallback below
  }

  return null;
}

function writeCoverFile(filename, data) {
  for (const dir of COVERS_DIRS) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), data);
  }
}

async function main() {
  for (const dir of COVERS_DIRS) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ssh_library_db',
  });

  const [books] = await conn.query(
    'SELECT id, title, author, isbn, category FROM books ORDER BY id'
  );

  console.log(
    `Downloading covers for ${books.length} books → ${COVERS_DIRS.join(' & ')}`
  );

  let ok = 0;
  let generated = 0;

  for (const book of books) {
    const isbn = (book.isbn || `id${book.id}`).replace(/[^0-9A-Za-z]/g, '');
    let relativePath;
    let wrote = false;

    if (book.isbn && /^\d{10,13}$/.test(String(book.isbn).replace(/-/g, ''))) {
      const result = await fetchCoverBuffer(book.isbn);
      if (result) {
        relativePath = `/covers/${isbn}.${result.ext}`;
        writeCoverFile(`${isbn}.${result.ext}`, result.buf);
        wrote = true;
        ok += 1;
        process.stdout.write('.');
      }
    }

    if (!wrote) {
      relativePath = `/covers/${isbn}.svg`;
      writeCoverFile(`${isbn}.svg`, svgCover(book.title, book.author, book.category));
      generated += 1;
      process.stdout.write('s');
    }

    await conn.query('UPDATE books SET cover_url = ? WHERE id = ?', [
      relativePath,
      book.id,
    ]);

    await sleep(120);
  }

  console.log(`\nDone. downloaded=${ok}, generated_svg=${generated}`);
  await conn.end();
}

main().catch((err) => {
  console.error('download-covers failed:', err.message);
  process.exit(1);
});
