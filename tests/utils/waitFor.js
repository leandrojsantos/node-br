const http = require('http');

function ping(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode);
    });
    req.on('error', reject);
    req.setTimeout(3000, () => {
      req.destroy(new Error('timeout'));
    });
  });
}

async function waitFor(url, { timeoutMs = 30000, intervalMs = 1000 } = {}) {
  const start = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const status = await ping(url);
      if (status >= 200 && status < 500) return true;
    } catch (_) {}
    if (Date.now() - start > timeoutMs) {
      throw new Error(`Timeout aguardando ${url}`);
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}

module.exports = { waitFor };


