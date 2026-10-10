import fs from 'fs';
import path from 'path';

/**
 * Ensures that the destination directory exists.
 * @param {string} dirPath - Absolute or relative path to folder
 */
export function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Formats a timestamp into YYYYMMDD-HHmmss format.
 * @param {Date} date 
 * @returns {string}
 */
export function formatTimestamp(date = new Date()) {
  const pad = (num) => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

/**
 * Generates the full file path for the recorded video.
 * @param {string} outputDir - Directory path
 * @param {string} [customName] - Optional custom name prefix
 * @returns {string} Output MP4 file path
 */
export function generateOutputPath(outputDir, customName) {
  ensureDirSync(outputDir);
  const timestamp = formatTimestamp();
  const filename = customName ? `${customName}-${timestamp}.mp4` : `video-${timestamp}.mp4`;
  return path.join(outputDir, filename);
}
