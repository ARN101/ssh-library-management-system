/**
 * Lightweight API smoke test (SSH-16).
 * Usage: node scripts/smoke-test.js [baseUrl]
 */
const baseUrl = process.argv[2] || 'http://localhost:5000';

async function check(path, expectedStatus = 200) {
  const res = await fetch(`${baseUrl}${path}`);
  const body = await res.json().catch(() => ({}));

  if (res.status !== expectedStatus) {
    throw new Error(`${path} expected ${expectedStatus}, got ${res.status}`);
  }

  console.log(`OK ${path} -> ${res.status}`, JSON.stringify(body));
}

async function run() {
  await check('/');
  await check('/api/health');
  console.log('Smoke tests passed.');
}

run().catch((err) => {
  console.error('Smoke test failed:', err.message);
  process.exit(1);
});
