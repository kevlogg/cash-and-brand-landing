import { getConfig } from './src/config.js';
import { recordWebPage } from './src/recorder.js';

async function main() {
  try {
    const config = getConfig();
    if (!config.url) {
      console.error(`\nError: Missing target URL.`);
      console.error(`Usage: npm run record -- --url="https://ejemplo.com"\n`);
      process.exit(1);
    }
    await recordWebPage(config);
    process.exit(0);
  } catch (err) {
    console.error('\nFatal execution error:', err.message);
    process.exit(1);
  }
}

main();
