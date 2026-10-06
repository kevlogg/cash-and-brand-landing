/**
 * Performs continuous, smooth vertical scrolling on the active Puppeteer page over a specified duration.
 * This triggers lazy-loading images, CSS scroll animations, and IntersectionObserver callbacks.
 * 
 * @param {import('puppeteer').Page} page - Puppeteer Page instance
 * @param {number} durationInSeconds - Duration of the scroll animation in seconds
 */
export async function performSmoothScroll(page, durationInSeconds) {
  await page.evaluate(async (durationSec) => {
    return new Promise((resolve) => {
      const totalDurationMs = durationSec * 1000;
      const startTime = performance.now();

      const getScrollHeight = () => Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );

      function step(now) {
        const elapsed = now - startTime;
        const maxScroll = getScrollHeight() - window.innerHeight;

        if (maxScroll <= 0) {
          if (elapsed >= totalDurationMs) {
            resolve();
          } else {
            requestAnimationFrame(step);
          }
          return;
        }

        // Calculate progress (0.0 to 1.0)
        const progress = Math.min(elapsed / totalDurationMs, 1);
        
        // Linear scroll speed for steady continuous scrolling, with slight smooth curve
        const currentY = progress * maxScroll;
        window.scrollTo(0, currentY);

        // Trigger scroll event manually for scroll listeners
        window.dispatchEvent(new CustomEvent('scroll'));

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          window.scrollTo(0, maxScroll);
          resolve();
        }
      }

      requestAnimationFrame(step);
    });
  }, durationInSeconds);
}
