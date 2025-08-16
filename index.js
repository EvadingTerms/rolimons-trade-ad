// index.js
// Main bot logic. Supports multi-account by reading env vars from index-multi.js.
// Falls back to config.json if no env vars (single-account mode).

import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const __dirname = path.resolve();

// Load config.json (fallback for single-account mode)
let config = {};
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf-8"));
} catch (e) {
  console.error("[bot] Failed to read config.json:", e.message);
}

// Get credentials + settings from env vars (multi-account launcher) or fallback
const robloxId = process.env.robloxId || config.robloxId;
const token = process.env.token || config.token;

let choosingAlgorithm = process.env.choosingAlgorithm || config.choosingAlgorithm;
let specificItems = {};
let smartAlgo = {};

try {
  specificItems = process.env.specificItems
    ? JSON.parse(process.env.specificItems)
    : config.specificItems || {};
} catch (e) {
  console.error("[bot] Failed to parse specificItems from env:", e.message);
}

try {
  smartAlgo = process.env.smartAlgo
    ? JSON.parse(process.env.smartAlgo)
    : config.smartAlgo || {};
} catch (e) {
  console.error("[bot] Failed to parse smartAlgo from env:", e.message);
}

console.log("[bot] Starting bot for RobloxId:", robloxId);
console.log("[bot] Algorithm:", choosingAlgorithm);

// =======================
// Your existing posting logic goes here.
// Use `choosingAlgorithm`, `specificItems`, and `smartAlgo` per account.
// Example check:
if (choosingAlgorithm.toLowerCase().includes("specific")) {
  console.log("[bot] Using Specific Items config:", specificItems);
  // TODO: build and send the ad with specific items
} else {
  console.log("[bot] Using Smart Algo config:", smartAlgo);
  // TODO: build and send the ad with smart algo
}
