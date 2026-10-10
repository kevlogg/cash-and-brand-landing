import fs from 'fs';
import path from 'path';
import { getConfig } from './src/config.js';
import { recordWebPage } from './src/recorder.js';

async function runTest() {
  console.log(`\n========================================`);
  console.log(`  Automated Reel Recorder Test Suite  `);
  console.log(`========================================\n`);

  // Override configuration for fast automated testing
  const testArgs = [
    '--url=https://example.com',
    '--duration=5',
    '--wait=1000',
    '--output=./output',
    '--width=1080',
    '--height=1920',
  ];

  const config = getConfig(testArgs);

  console.log(`[TEST] Starting test recording on ${config.url}...`);
  const outputFilePath = await recordWebPage(config);

  console.log(`[TEST] Verifying generated output file...`);

  if (!fs.existsSync(outputFilePath)) {
    throw new Error(`TEST FAILED: Output file does not exist at ${outputFilePath}`);
  }

  const stats = fs.statSync(outputFilePath);
  if (stats.size === 0) {
    throw new Error(`TEST FAILED: Output video file is 0 bytes!`);
  }

  console.log(`✔ SUCCESS: Video file generated properly!`);
  console.log(`  File Path: ${outputFilePath}`);
  console.log(`  File Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB (${stats.size} bytes)\n`);
}

runTest().catch((err) => {
  console.error('\n✖ TEST FAILED with error:', err.message);
  process.exit(1);
});
