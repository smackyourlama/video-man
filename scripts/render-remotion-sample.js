#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const channel = process.argv[2];
const mode = process.argv[3] || 'preview';
if (!channel) throw new Error('Usage: node scripts/render-remotion-sample.js <operator|terminalecho|blackledger|nullsignal> [preview|render]');
const map = {
  operator: 'operator_logic_sample.json',
  terminalecho: 'terminalecho_sample.json',
  blackledger: 'blackledger_sample.json',
  nullsignal: 'nullsignal_sample.json',
};
const file = map[channel];
if (!file) throw new Error(`Unknown channel key: ${channel}`);
const root = path.resolve(__dirname, '..');
const remotionDir = path.join(root, 'remotion');
const dataPath = path.join(root, 'sample-data', 'remotion', file);
const outDir = path.join(root, 'preview-outputs');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outputPath = path.join(outDir, `${channel}-${mode}.mp4`);
const propsPath = path.join(outDir, `${channel}-${mode}-props.json`);
const indexFilePath = path.join(remotionDir, 'src', 'index.tsx');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
fs.writeFileSync(propsPath, JSON.stringify({ videoData: data }));
const command = `npx remotion render ${indexFilePath} Documentary ${outputPath} --props=${propsPath} --log=error`;
execSync(command, { cwd: remotionDir, stdio: 'inherit' });
console.log(outputPath);
