import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import ffmpegPath from 'ffmpeg-static';
import { performSmoothScroll } from './scroller.js';
import { generateOutputPath } from './utils.js';

/**
 * Automates website recording to an MP4 video file optimized for Instagram Reels.
 * 
 * @param {Object} config - Configuration object from getConfig()
 * @returns {Promise<string>} Path of the saved .mp4 video file
 */
export async function recordWebPage(config) {
  if (!config.url) {
    throw new Error('A target URL must be provided. Example: npm run record -- --url="https://example.com"');
  }

  console.log(`\n========================================`);
  console.log(`  Instagram Reel Video Web Recorder  `);
  console.log(`========================================`);
  console.log(`Target URL:     ${config.url}`);
  console.log(`Viewport:       ${config.viewport.width}x${config.viewport.height} (9:16 Aspect Ratio)`);
  console.log(`Duration:       ${config.duration} seconds`);
  console.log(`Initial Wait:   ${config.initialWait} ms`);
  console.log(`FPS:            ${config.fps}`);
  console.log(`Output Folder:  ${config.outputDir}`);
  console.log(`----------------------------------------\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--window-size=${config.viewport.width},${config.viewport.height}`,
      '--hide-scrollbars',
    ],
  });

  try {
    const page = await browser.newPage();

    // Emulate mobile browser environment
    await page.setUserAgent(config.userAgent);
    await page.setViewport({
      width: config.viewport.width,
      height: config.viewport.height,
      deviceScaleFactor: config.viewport.deviceScaleFactor,
      isMobile: config.viewport.isMobile,
      hasTouch: config.viewport.hasTouch,
    });

    const recorderOptions = {
      fps: config.fps,
      ffmpeg_Path: ffmpegPath || undefined,
      videoFrame: {
        width: config.viewport.width,
        height: config.viewport.height,
      },
      aspectRatio: '9:16',
    };

    const recorder = new PuppeteerScreenRecorder(page, recorderOptions);
    const outputPath = generateOutputPath(config.outputDir);

    console.log(`[1/4] Navigating to target webpage...`);
    await page.goto(config.url, {
      waitUntil: ['load', 'domcontentloaded'],
      timeout: 60000,
    });

    console.log(`[2/4] Waiting ${config.initialWait}ms for fonts and dynamic assets to load...`);
    await new Promise((resolve) => setTimeout(resolve, config.initialWait));

    console.log(`[3/4] Starting screen recording -> ${outputPath}`);
    await recorder.start(outputPath);

    console.log(`[4/4] Executing smooth vertical scroll over ${config.duration}s...`);
    await performSmoothScroll(page, config.duration);

    // Give a 500ms pause at the bottom of the page before stopping recording
    await new Promise((resolve) => setTimeout(resolve, 500));

    await recorder.stop();
    console.log(`\n✔ Recording completed successfully! Video saved to:\n  ${outputPath}\n`);

    return outputPath;
  } catch (error) {
    console.error(`✖ Recording failed:`, error.message);
    throw error;
  } finally {
    await browser.close();
  }
}
