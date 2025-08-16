// index-multi.js
// Launcher that runs one child process per account.

import { spawn } from "child_process";
import path from "path";

let config;
try {
  config = require('./config.json');
} catch (e) {
  console.error('[launcher] Failed to read config.json:', e.message);
  process.exit(1);
}

if (!config.accounts || !Array.isArray(config.accounts) || config.accounts.length === 0) {
  console.error('[launcher] config.accounts is empty. Please add at least one account.');
  process.exit(1);
}

const children = [];

function startChild(account, index) {
  const label = account.name || `acc${index + 1}`;
  if (!account.robloxId || !account.token) {
    console.error(`[launcher] Skipping ${label}: missing robloxId or token.`);
    return;
  }

  const child = spawn(process.execPath, [path.join(__dirname, 'index.js')], {
    env: {
      ...process.env,
      robloxId: String(account.robloxId),
      token: String(account.token),
      choosingAlgorithm: account.choosingAlgorithm || "Smart",
      specificItems: JSON.stringify(account.specificItems || {}),
      smartAlgo: JSON.stringify(account.smartAlgo || {})
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (d) => process.stdout.write(`[${label}] ${d}`));
  child.stderr.on('data', (d) => process.stderr.write(`[${label}] ${d}`));

  child.on('exit', (code, signal) => {
    console.error(`[launcher] Child ${label} exited (code=${code}, signal=${signal}). Will restart in 30s.`);
    setTimeout(() => startChild(account, index), 30_000);
  });

  children.push(child);
}

config.accounts.forEach((acc, i) => startChild(acc, i));

process.on('SIGINT', () => {
  console.log('\\n[launcher] Caught SIGINT, terminating children...');
  for (const c of children) {
    try { c.kill('SIGINT'); } catch {}
  }
  process.exit(0);
});
