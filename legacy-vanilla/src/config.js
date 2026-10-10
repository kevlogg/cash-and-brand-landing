import dotenv from 'dotenv';
import minimist from 'minimist';
import path from 'path';

// Load environment variables from .env file if available
dotenv.config();

/**
 * Parses command line arguments and environment variables into a consolidated configuration object.
 * CLI arguments take precedence over environment variables, which take precedence over defaults.
 * 
 * @param {string[]} argv - Array of command-line arguments (defaults to process.argv.slice(2))
 * @returns {Object} Configuration object
 */
export function getConfig(argv = process.argv.slice(2)) {
  const args = minimist(argv, {
    string: ['url', 'u', 'output', 'o', 'userAgent'],
    number: ['width', 'height', 'duration', 'wait', 'fps', 'scale'],
    alias: {
      u: 'url',
      w: 'width',
      h: 'height',
      d: 'duration',
      o: 'output',
    },
  });

  const url = args.url || process.env.TARGET_URL || null;

  const width = args.width || parseInt(process.env.VIEWPORT_WIDTH, 10) || 1080;
  const height = args.height || parseInt(process.env.VIEWPORT_HEIGHT, 10) || 1920;
  const duration = args.duration || parseFloat(process.env.RECORD_DURATION) || 10;
  const initialWait = args.wait !== undefined ? args.wait : (parseInt(process.env.INITIAL_WAIT, 10) || 2000);
  const fps = args.fps || parseInt(process.env.FPS, 10) || 30;
  const outputDir = path.resolve(process.cwd(), args.output || process.env.OUTPUT_DIR || './output');
  const deviceScaleFactor = args.scale || parseInt(process.env.DEVICE_SCALE_FACTOR, 10) || 2;

  const userAgent = args.userAgent || process.env.USER_AGENT || 
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';

  return {
    url,
    viewport: {
      width,
      height,
      deviceScaleFactor,
      isMobile: true,
      hasTouch: true,
    },
    duration,      // Duration in seconds
    initialWait,   // Wait before starting scroll in ms
    fps,
    outputDir,
    userAgent,
  };
}
